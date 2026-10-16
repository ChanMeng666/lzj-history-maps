// 地圖紀錄片播放器：Canvas 2D 正射投影地球 + 鏡頭飛行 + 史地圖層 + 字幕。
// 每一幀都是時間 t 的純函數，供無頭瀏覽器逐幀截圖。
import { geoOrthographic, geoPath, geoGraticule10, geoInterpolate, geoCentroid, geoBounds, geoDistance } from "d3-geo";
import { feature, mesh } from "topojson-client";
import { drawCaption } from "./type.js";

export const VW = 1920, VH = 1080;
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
export const easeInOut = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export function hash(i, s = 0) {
  let x = Math.imul((i | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul((s | 0) + 0x632be5ab, 0xc2b2ae35);
  x ^= x >>> 15; x = Math.imul(x, 0x2c1b3c6d); x ^= x >>> 12; x = Math.imul(x, 0x297a2d39); x ^= x >>> 15;
  return (x >>> 0) / 4294967296;
}

// ---------------------------------------------------------------- 調色盤
export const C = {
  sea0: "#16304a", sea1: "#0a1726", land: "#d8cdb2", land2: "#cfc3a5", border: "rgba(92,80,62,0.55)",
  prov: "rgba(110,96,74,0.45)", river: "rgba(80,130,170,0.75)", lake: "#5d8db0", grat: "rgba(160,190,220,0.10)",
  ink: "#2b2420", paper: "#f2ead8", gold: "#e3b960",
  verm: "#b5452f", ochre: "#c8913a", teal: "#2f7f7a", indigo: "#3d5a8c", plum: "#7a4b78", olive: "#6e7d3a",
  slate: "#5b6770", rose: "#c46b6b", sky: "#4f8fbf", sand: "#bfa36a", moss: "#55704b", brick: "#9a4b32",
};

// ---------------------------------------------------------------- 地理數據
export class Geo {
  async load(base) {
    const j = async (f) => (await fetch(`${base}/data/topo/${f}.json`)).json();
    const [countries, land, rivers, lakes, prov, cnr] = await Promise.all(["countries", "land", "rivers", "lakes", "cn_prov", "cn_rivers"].map(j));
    const key = (o) => Object.keys(o.objects)[0];
    this.countries = feature(countries, countries.objects[key(countries)]).features;
    this.borders = mesh(countries, countries.objects[key(countries)], (a, b) => a !== b);
    this.land = feature(land, land.objects[key(land)]);
    this.rivers = feature(rivers, rivers.objects[key(rivers)]);
    this.lakes = feature(lakes, lakes.objects[key(lakes)]);
    this.prov = feature(prov, prov.objects[key(prov)]).features;
    this.provMesh = mesh(prov, prov.objects[key(prov)], (a, b) => a !== b);
    this.cnRivers = feature(cnr, cnr.objects[key(cnr)]);
    this.byId = new Map();
    for (const f of this.countries) this.byId.set(f.properties.id, f);
    for (const f of this.prov) this.byId.set(f.properties.id, f);
    this.grat = geoGraticule10();
  }
  // ids: ["CHN", "CN:Zhejiang", ...] → FeatureCollection
  fc(ids) {
    return { type: "FeatureCollection", features: ids.map((i) => this.byId.get(i)).filter(Boolean) };
  }
}

// ---------------------------------------------------------------- 鏡頭
// cam: { lon, lat, zoom, tilt? }；zoom 1 = 整個地球高度的 0.9
export function camKeys(list, t) {
  if (t <= list[0][0]) return { ...list[0][1] };
  for (let i = 0; i < list.length - 1; i++) {
    const [t0, a] = list[i], [t1, b] = list[i + 1];
    if (t <= t1) {
      const k = easeInOut((t - t0) / (t1 - t0));
      const gi = geoInterpolate([a.lon, a.lat], [b.lon, b.lat]);
      // 長距離飛行時中途拉遠
      const d = geoDistance([a.lon, a.lat], [b.lon, b.lat]);
      const za = Math.log(a.zoom), zb = Math.log(b.zoom);
      const hop = Math.min(za, zb) - Math.min(1.4, d * 0.9) * Math.sin(Math.PI * k) * (d > 0.15 ? 1 : 0);
      const z = Math.exp(lerp(za, zb, k) + Math.min(0, hop - Math.min(za, zb)) * 0.0 + (d > 0.15 ? -Math.min(1.2, d * 0.8) * Math.sin(Math.PI * k) : 0));
      const [lon, lat] = gi(k);
      return { lon, lat, zoom: z };
    }
  }
  return { ...list[list.length - 1][1] };
}

function projection(cam) {
  return geoOrthographic().rotate([-cam.lon, -cam.lat, 0]).translate([VW / 2, VH / 2])
    .scale(VH * 0.45 * cam.zoom).clipAngle(90).precision(0.4);
}

// ---------------------------------------------------------------- 地形暈渲（WebGL）
// 對每個像素反算正射投影 → 經緯度 → 取 Natural Earth 暈渲圖，乘到陸地上。
class Relief {
  async init(url) {
    this.cv = document.createElement("canvas"); this.cv.width = VW; this.cv.height = VH;
    const gl = this.gl = this.cv.getContext("webgl", { preserveDrawingBuffer: true, premultipliedAlpha: false });
    if (!gl) return;
    const vs = "attribute vec2 a; varying vec2 uv; void main(){ uv=a*0.5+0.5; gl_Position=vec4(a,0.,1.); }";
    const fs = `precision highp float; varying vec2 uv; uniform sampler2D tex; uniform vec3 cam; uniform vec2 res; uniform float k;
      void main(){ vec2 px = vec2(uv.x*res.x, (1.-uv.y)*res.y); float R = cam.z;
        float x = (px.x - res.x*0.5)/R, y = -(px.y - res.y*0.5)/R; float r2 = x*x+y*y; if (r2 >= 1.) { gl_FragColor = vec4(1.); return; }
        float d = sqrt(1.-r2); float lp = cam.y; float X = d*cos(lp) - y*sin(lp); float Z = y*cos(lp) + d*sin(lp); float Y = x;
        float lon = atan(Y, X) + cam.x; float lat = asin(clamp(Z,-1.,1.));
        vec2 t = vec2(fract((lon/3.14159265 + 1.)*0.5), 0.5 - lat/3.14159265);
        float h = texture2D(tex, t).r; float v = mix(1., 0.62 + 0.5*h, k); gl_FragColor = vec4(vec3(v), 1.); }`;
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o; };
    const pr = this.pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const img = new Image(); img.src = url; await img.decode();
    let src = img; const mx = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    if (img.width > mx) { const c = document.createElement("canvas"); c.width = mx; c.height = mx / 2; c.getContext("2d").drawImage(img, 0, 0, mx, mx / 2); src = c; }
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, gl.LUMINANCE, gl.UNSIGNED_BYTE, src);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.u = { cam: gl.getUniformLocation(pr, "cam"), res: gl.getUniformLocation(pr, "res"), k: gl.getUniformLocation(pr, "k") };
    this.ok = true;
  }
  render(cam, R, k = 1) {
    const gl = this.gl; gl.viewport(0, 0, VW, VH);
    gl.uniform3f(this.u.cam, cam.lon * Math.PI / 180, cam.lat * Math.PI / 180, R); gl.uniform2f(this.u.res, VW, VH); gl.uniform1f(this.u.k, k);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); return this.cv;
  }
}

// ---------------------------------------------------------------- 播放器
export class MapPlayer {
  constructor(canvas, film, base) {
    this.film = film; this.base = base;
    this.ctx = canvas.getContext("2d");
    this.geo = new Geo();
    this.off = [0, 1].map(() => { const c = document.createElement("canvas"); c.width = VW; c.height = VH; return c; });
    let s = 0; this.starts = [];
    film.scenes.forEach((sc, i) => { this.starts.push(s); s += sc.dur - (i < film.scenes.length - 1 ? (sc.trans ?? 1.2) : 0); });
    this.duration = s;
    film.captions = film.captions || [];
    film.scenes.forEach((sc, i) => (sc.caps || []).forEach((c) => film.captions.push({ ...c, sci: i, t0: this.starts[i] + c.t0, t1: this.starts[i] + c.t1 })));
  }
  async init() {
    await this.geo.load(this.base);
    const img = new Image(); img.src = `${this.base}/data/grain.png`; await img.decode().catch(() => {}); this.grain = img;
    this.relief = new Relief(); await this.relief.init(`${this.base}/data/relief.jpg`).catch(() => {});
    await document.fonts.ready;
  }
  active(t) {
    const out = [];
    this.film.scenes.forEach((sc, i) => { const s0 = this.starts[i]; if (t >= s0 && t < s0 + sc.dur) out.push({ i, sc, lt: t - s0 }); });
    if (!out.length) { const i = this.film.scenes.length - 1; out.push({ i, sc: this.film.scenes[i], lt: t - this.starts[i] }); }
    return out.slice(0, 2);
  }
  camOf(sc, lt) { return sc.cam ? (Array.isArray(sc.cam) ? camKeys(sc.cam, lt) : sc.cam(lt)) : { lon: 105, lat: 33, zoom: 2.2 }; }

  drawScene(ctx, sc, lt) {
    const g = this.geo, cam = this.camOf(sc, lt), proj = projection(cam), path = geoPath(proj, ctx);
    const z = cam.zoom;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // 外太空 / 底色
    const bg = ctx.createRadialGradient(VW / 2, VH / 2, 0, VW / 2, VH / 2, VW * 0.7);
    bg.addColorStop(0, "#0d1b2b"); bg.addColorStop(1, "#05090f");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, VW, VH);
    // 海
    const R = proj.scale();
    const sea = ctx.createRadialGradient(VW / 2 - R * 0.3, VH / 2 - R * 0.35, R * 0.1, VW / 2, VH / 2, R);
    sea.addColorStop(0, C.sea0); sea.addColorStop(1, C.sea1);
    ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = sea; ctx.fill();
    if (R < VW) { ctx.save(); ctx.shadowColor = "rgba(120,170,230,0.35)"; ctx.shadowBlur = 40; ctx.strokeStyle = "rgba(140,190,240,0.35)"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); }
    // 經緯網
    ctx.beginPath(); path(g.grat); ctx.strokeStyle = C.grat; ctx.lineWidth = 1; ctx.stroke();
    // 陸地
    ctx.beginPath(); path(g.land); ctx.fillStyle = C.land; ctx.fill();
    ctx.save(); ctx.clip();
    if (this.relief?.ok && (sc.relief ?? 1) > 0) { ctx.globalCompositeOperation = "multiply"; ctx.drawImage(this.relief.render(cam, R, sc.relief ?? 1), 0, 0); ctx.globalCompositeOperation = "source-over"; }
    if (this.grain?.width) { ctx.globalAlpha = 0.08; ctx.drawImage(this.grain, 0, 0, VW, VH); ctx.globalAlpha = 1; }
    ctx.restore();
    // 湖、河
    ctx.beginPath(); path(g.lakes); ctx.fillStyle = C.lake; ctx.fill();
    const rk = clamp((z - 1.6) / 1.5);
    if (rk > 0) {
      ctx.globalAlpha = rk; ctx.beginPath(); path(z > 3 ? g.cnRivers : g.rivers); ctx.strokeStyle = C.river; ctx.lineWidth = z > 3 ? 1.6 : 1.1; ctx.stroke();
      if (z > 3) { ctx.beginPath(); path(g.rivers); ctx.lineWidth = 1.1; ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    // 國界、省界
    const showModern = sc.modernBorders ?? 0.55;
    ctx.globalAlpha = showModern; ctx.beginPath(); path(g.borders); ctx.strokeStyle = C.border; ctx.lineWidth = 0.9; ctx.stroke(); ctx.globalAlpha = 1;
    const pk = clamp((z - 2.6) / 1.2) * (sc.provinces ?? 0.6);
    if (pk > 0) { ctx.globalAlpha = pk; ctx.beginPath(); path(g.provMesh); ctx.strokeStyle = C.prov; ctx.lineWidth = 0.8; ctx.setLineDash([4, 3]); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; }
    // 史地圖層
    const ctxL = { ctx, proj, path, g, lt, cam, z, R };
    for (const L of sc.layers || []) {
      const vis = L.t1 !== undefined ? ease(prog(lt, L.t0 ?? 0, (L.t0 ?? 0) + (L.fade ?? 0.8))) * (1 - ease(prog(lt, L.t1 - (L.fade ?? 0.8), L.t1))) : ease(prog(lt, L.t0 ?? 0, (L.t0 ?? 0) + (L.fade ?? 0.8)));
      if (vis <= 0.001) continue;
      LAYERS[L.type](ctxL, L, vis);
    }
    // 球體邊緣的大氣暗角
    ctx.beginPath(); path({ type: "Sphere" });
    const rim = ctx.createRadialGradient(VW / 2, VH / 2, R * 0.82, VW / 2, VH / 2, R);
    rim.addColorStop(0, "rgba(0,0,0,0)"); rim.addColorStop(1, "rgba(0,8,20,0.35)");
    if (R < VW * 0.9) { ctx.fillStyle = rim; ctx.fill(); }
    // 年份
    if (sc.year) drawYear(ctx, typeof sc.year === "function" ? sc.year(lt) : sc.year, sc.yearSub, lt);
  }

  async seek(T) {
    const act = this.active(T);
    const main = this.ctx;
    if (act.length === 1) {
      this.drawScene(main, act[0].sc, act[0].lt);
    } else {
      const a = act[0], b = act[1], tr = a.sc.trans ?? 1.2;
      const p = ease(clamp((a.lt - (a.sc.dur - tr)) / tr));
      const ca = this.off[0].getContext("2d"), cb = this.off[1].getContext("2d");
      this.drawScene(ca, a.sc, a.lt); this.drawScene(cb, b.sc, b.lt);
      main.setTransform(1, 0, 0, 1, 0, 0);
      main.globalAlpha = 1; main.drawImage(this.off[0], 0, 0);
      main.globalAlpha = p; main.drawImage(this.off[1], 0, 0); main.globalAlpha = 1;
    }
    // 字幕
    for (let c of this.film.captions) if (T >= c.t0 - 0.1 && T < c.t1 + 0.1) {
      if (c.at) { const s = act.find((x) => x.i === c.sci); if (!s) continue; const pj = projection(this.camOf(s.sc, s.lt)); const q = pj(c.at); if (q) c = { ...c, to: q }; }
      drawCaption(main, { color: "paper", ...c }, T);
    }
    // 暗角 + 顆粒
    main.setTransform(1, 0, 0, 1, 0, 0);
    const v = main.createRadialGradient(VW / 2, VH / 2, VH * 0.45, VW / 2, VH / 2, VW * 0.75);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,0.45)");
    main.fillStyle = v; main.fillRect(0, 0, VW, VH);
    const fin = this.film.fadeIn ?? 1.2, fout = this.film.fadeOut ?? 2;
    const f = Math.max(1 - clamp(T / fin), clamp((T - (this.duration - fout)) / fout));
    if (f > 0) { main.fillStyle = `rgba(5,9,15,${ease(f)})`; main.fillRect(0, 0, VW, VH); }
  }
}

// ---------------------------------------------------------------- 年份
function drawYear(ctx, text, sub, lt) {
  ctx.save();
  ctx.textAlign = "right"; ctx.textBaseline = "alphabetic";
  ctx.font = "92px Serif"; ctx.fillStyle = C.gold; ctx.shadowColor = "rgba(0,0,0,0.6)"; ctx.shadowBlur = 18;
  ctx.fillText(text, VW - 90, 160);
  if (sub) { ctx.font = "30px Serif"; ctx.fillStyle = "rgba(242,234,216,0.8)"; ctx.fillText(sub, VW - 92, 205); }
  ctx.restore();
}

// ---------------------------------------------------------------- 圖層
function centroidPx(L, proj, fc) { const c = L.labelAt || geoCentroid(fc); return [c, proj(c)]; }

function visible(proj, lonlat) {
  const r = proj.rotate();
  return geoDistance(lonlat, [-r[0], -r[1]]) < Math.PI / 2 - 0.02;
}

function halo(ctx, text, x, y, fill, stroke = "rgba(20,16,12,0.75)", w = 6) {
  ctx.lineJoin = "round"; ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.strokeText(text, x, y); ctx.fillStyle = fill; ctx.fillText(text, x, y);
}

const LAYERS = {
  // 填色區域：ids 為國家 ADM0_A3 或 "CN:省名"；reveal: fade | grow（由中心向外擴散）
  regions({ ctx, path, proj, g, lt }, L, vis) {
    const fc = L.geo || g.fc(L.ids);
    ctx.save();
    if (L.reveal === "grow") {
      const [c, px] = centroidPx(L, proj, fc);
      const k = ease(prog(lt, L.t0 ?? 0, (L.t0 ?? 0) + (L.growDur ?? 2.5)));
      if (px) { ctx.beginPath(); ctx.arc(px[0], px[1], Math.max(1, k * 2600), 0, Math.PI * 2); ctx.clip(); }
    }
    ctx.beginPath(); path(fc);
    ctx.globalAlpha = vis * (L.alpha ?? 0.62); ctx.fillStyle = L.color; ctx.fill();
    if (L.hatch) {
      ctx.save(); ctx.clip(); ctx.globalAlpha = vis * 0.5; ctx.strokeStyle = L.hatch; ctx.lineWidth = 2;
      for (let x = -VH; x < VW + VH; x += 14) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + VH, VH); ctx.stroke(); }
      ctx.restore();
    }
    ctx.globalAlpha = vis * (L.edge ?? 0.9); ctx.beginPath(); path(fc); ctx.strokeStyle = L.stroke ?? "rgba(250,240,220,0.85)"; ctx.lineWidth = L.edgeW ?? 1.6; ctx.stroke();
    ctx.restore();
    if (L.label) LAYERS.label({ ctx, proj, g, lt }, { at: L.labelAt || geoCentroid(fc), text: L.label, size: L.labelSize ?? 34, color: L.labelColor ?? C.paper, sub: L.sub }, vis);
  },
  // 標籤
  label({ ctx, proj }, L, vis) {
    if (!visible(proj, L.at)) return;
    const p = proj(L.at); if (!p) return;
    ctx.save(); ctx.globalAlpha = vis; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.font = `${L.size ?? 30}px ${L.font ?? "Serif"}`;
    const sp = L.spacing ?? 0.18;
    const text = [...L.text].join(sp ? " " : "");
    halo(ctx, text, p[0] + (L.dx ?? 0), p[1] + (L.dy ?? 0), L.color ?? C.paper);
    if (L.sub) { ctx.font = `${Math.round((L.size ?? 30) * 0.55)}px Serif`; halo(ctx, L.sub, p[0] + (L.dx ?? 0), p[1] + (L.dy ?? 0) + (L.size ?? 30) * 0.85, "rgba(242,234,216,0.85)", "rgba(20,16,12,0.7)", 4); }
    ctx.restore();
  },
  // 城市
  city({ ctx, proj, lt }, L, vis) {
    if (!visible(proj, L.at)) return;
    const p = proj(L.at); if (!p) return;
    ctx.save(); ctx.globalAlpha = vis;
    const pu = (lt * 0.8 + hash(L.at[0] * 100, 3)) % 1;
    if (L.pulse !== false) { ctx.beginPath(); ctx.arc(p[0], p[1], 6 + pu * 26, 0, Math.PI * 2); ctx.strokeStyle = `rgba(227,185,96,${(1 - pu) * 0.7})`; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(p[0], p[1], L.r ?? 6, 0, Math.PI * 2); ctx.fillStyle = L.color ?? C.gold; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "rgba(20,16,12,0.8)"; ctx.stroke();
    if (L.name) {
      ctx.font = `${L.size ?? 30}px Serif`; ctx.textAlign = L.align ?? "left"; ctx.textBaseline = "middle";
      halo(ctx, L.name, p[0] + (L.align === "right" ? -14 : 14), p[1] + (L.dy ?? -2), C.paper);
    }
    ctx.restore();
  },
  // 箭頭：path 為一串 [lon,lat]；沿大圓插值並抬高成弧線，逐步畫出
  arrow({ ctx, proj, lt }, L, vis) {
    const pts = densify(L.path, L.arc ?? 0.18);
    const k = ease(prog(lt, L.t0 ?? 0, (L.t0 ?? 0) + (L.dur ?? 2)));
    const n = Math.max(2, Math.floor(pts.length * k));
    const scr = []; for (let i = 0; i < n; i++) { const q = proj(pts[i].ll); if (q && visible(proj, pts[i].ll)) scr.push([q[0], q[1] - pts[i].h * proj.scale() * 0.5]); else if (scr.length) break; }
    if (scr.length < 2) return;
    const w = L.width ?? 8;
    ctx.save(); ctx.globalAlpha = vis; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.shadowColor = L.color; ctx.shadowBlur = 16;
    for (let i = 1; i < scr.length; i++) {
      const f = i / scr.length;
      ctx.beginPath(); ctx.moveTo(...scr[i - 1]); ctx.lineTo(...scr[i]);
      ctx.strokeStyle = L.color; ctx.lineWidth = w * (0.35 + 0.65 * f); ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,248,230,0.55)"; ctx.lineWidth = Math.max(1.2, w * 0.18);
    ctx.beginPath(); ctx.moveTo(...scr[0]); for (const q of scr.slice(1)) ctx.lineTo(...q); ctx.stroke();
    // 箭頭
    const [a, b] = [scr[scr.length - 2], scr[scr.length - 1]];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), hs = w * 2.4;
    ctx.beginPath(); ctx.moveTo(b[0] + Math.cos(ang) * hs * 0.6, b[1] + Math.sin(ang) * hs * 0.6);
    ctx.lineTo(b[0] + Math.cos(ang + 2.5) * hs, b[1] + Math.sin(ang + 2.5) * hs);
    ctx.lineTo(b[0] + Math.cos(ang - 2.5) * hs, b[1] + Math.sin(ang - 2.5) * hs); ctx.closePath();
    ctx.fillStyle = L.color; ctx.fill();
    // 沿線移動的光點
    if (k >= 1 && L.flow !== false) {
      for (let j = 0; j < 4; j++) {
        const u = ((lt * 0.35 + j / 4) % 1), q = scr[Math.floor(u * (scr.length - 1))];
        const gr = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], w * 1.6);
        gr.addColorStop(0, "rgba(255,250,235,0.9)"); gr.addColorStop(1, "rgba(255,250,235,0)");
        ctx.fillStyle = gr; ctx.fillRect(q[0] - w * 2, q[1] - w * 2, w * 4, w * 4);
      }
    }
    if (L.label && k > 0.6) {
      const m = scr[Math.floor(scr.length * 0.5)];
      ctx.font = `${L.size ?? 26}px Serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      halo(ctx, L.label, m[0] + (L.ldx ?? 0), m[1] + (L.ldy ?? -26), C.paper);
    }
    ctx.restore();
  },
  // 粒子流：從 from 流向 to（資金、技術、人口）
  stream({ ctx, proj, lt }, L, vis) {
    const pts = densify([L.from, L.to], L.arc ?? 0.12);
    ctx.save(); ctx.globalAlpha = vis;
    for (let j = 0; j < (L.n ?? 40); j++) {
      const u = (lt * (L.speed ?? 0.18) + hash(j, 7)) % 1;
      const p = pts[Math.floor(u * (pts.length - 1))];
      const q = proj(p.ll); if (!q || !visible(proj, p.ll)) continue;
      const jx = (hash(j, 8) - 0.5) * (L.spread ?? 30), jy = (hash(j, 9) - 0.5) * (L.spread ?? 30);
      const x = q[0] + jx, y = q[1] - p.h * proj.scale() * 0.5 + jy, r = L.size ?? 4;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = L.color; ctx.globalAlpha = vis * (0.4 + 0.6 * Math.sin(u * Math.PI)); ctx.fill();
    }
    ctx.restore();
  },
  // 柔光區（窪地、低氣壓、中心）
  zone({ ctx, proj }, L, vis) {
    if (!visible(proj, L.at)) return;
    const p = proj(L.at); if (!p) return;
    const r = (L.radius ?? 8) / 180 * Math.PI * proj.scale();
    const gr = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r);
    gr.addColorStop(0, L.color); gr.addColorStop(1, "rgba(0,0,0,0)");
    ctx.save(); ctx.globalAlpha = vis * (L.alpha ?? 0.6); ctx.fillStyle = gr; ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.restore();
  },
  // 虛線（長城、前線、海岸防線）
  line({ ctx, path, lt }, L, vis) {
    const k = ease(prog(lt, L.t0 ?? 0, (L.t0 ?? 0) + (L.dur ?? 1.5)));
    const coords = L.path.slice(0, Math.max(2, Math.ceil(L.path.length * k)));
    ctx.save(); ctx.globalAlpha = vis; ctx.beginPath(); path({ type: "LineString", coordinates: coords });
    ctx.strokeStyle = L.color ?? C.verm; ctx.lineWidth = L.width ?? 4; if (L.dash) ctx.setLineDash(L.dash); ctx.stroke(); ctx.restore();
  },
  // 圖例
  legend({ ctx }, L, vis) {
    ctx.save(); ctx.globalAlpha = vis; ctx.font = "26px Serif"; ctx.textBaseline = "middle";
    const x = L.x ?? 90; let y = L.y ?? VH - 300;
    ctx.fillStyle = "rgba(8,14,22,0.55)"; ctx.fillRect(x - 24, y - 34, L.w ?? 420, L.items.length * 46 + 30);
    for (const [col, text] of L.items) { ctx.fillStyle = col; ctx.fillRect(x, y - 12, 34, 24); ctx.fillStyle = C.paper; ctx.fillText(text, x + 50, y); y += 46; }
    ctx.restore();
  },
};

// 兩點之間的大圓插值 + 抬高（弧線）
function densify(path, arc) {
  const out = [];
  for (let s = 0; s < path.length - 1; s++) {
    const gi = geoInterpolate(path[s], path[s + 1]);
    const d = geoDistance(path[s], path[s + 1]);
    const N = Math.max(12, Math.ceil(d * 120));
    for (let i = 0; i <= N; i++) {
      if (s > 0 && i === 0) continue;
      const u = i / N;
      out.push({ ll: gi(u), h: arc * d * Math.sin(Math.PI * u) * 0.35 });
    }
  }
  return out;
}
