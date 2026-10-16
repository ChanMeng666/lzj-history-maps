// 寫片用的簡寫：一個「節拍」一行數據。座標一律 [經度, 緯度]；研究資料給的「緯, 經」用 ll(lat, lon) 轉。
import { C, VW, VH } from "./map.js";
export { C };

export const ll = (lat, lon) => [lon, lat];

// bbox [西, 南, 東, 北] → 鏡頭 {lon, lat, zoom}
export function fit([w, s, e, n], pad = 0.82) {
  const lon = (w + e) / 2, lat = (s + n) / 2;
  const dl = ((e - w) * Math.PI) / 180, dp = ((n - s) * Math.PI) / 180;
  const R = Math.min((pad * VW) / (dl * Math.cos((lat * Math.PI) / 180)), (pad * VH) / dp);
  return { lon, lat, zoom: Math.max(0.9, R / (VH * 0.45)) };
}

// 鏡頭：從 a 緩推到 b（b 省略則在 a 上做 6% 的慢推）
export function camTo(a, b, dur) {
  const A = Array.isArray(a) ? fit(a) : a;
  const B = b ? (Array.isArray(b) ? fit(b) : b) : { ...A, zoom: A.zoom * 1.06 };
  return [[0, A], [dur, B]];
}

export const reg = (ids, color, label, t0 = 0.6, o = {}) => ({ type: "regions", ids: [].concat(ids), color, label, t0, ...o });
export const arrow = (path, color, t0 = 1, dur = 2.2, o = {}) => ({ type: "arrow", path, color, t0, dur, ...o });
export const city = (at, name, t0 = 0.8, o = {}) => ({ type: "city", at, name, t0, ...o });
export const label = (at, text, t0 = 0.8, o = {}) => ({ type: "label", at, text, t0, ...o });
export const zone = (at, color, radius = 8, t0 = 0.5, o = {}) => ({ type: "zone", at, color, radius, t0, ...o });
export const stream = (from, to, color, t0 = 1, o = {}) => ({ type: "stream", from, to, color, t0, ...o });
export const wall = (path, color = "#e8dcc0", t0 = 1, o = {}) => ({ type: "line", path, color, t0, width: 5, dash: [14, 8], ...o });

// 字幕
export const chap = (num, text, t0 = 0.4, t1 = null) => ({ style: "chapter", num, text, t0, t1 });
export const quote = (text, src, t0, t1, o = {}) => ({ style: "quote", text, src, t0, t1, pos: "bottom", y: 945, ...o, opt: { size: 46, max: 1700, ...(o.opt || {}) } });
export const note = (text, t0, t1, o = {}) => ({ style: "note", text, t0, t1, ...o });
export const title = (text, sub, t0 = 1.2, t1 = 7) => [
  { style: "title", text, pos: "center", y: 470, t0, t1 },
  { style: "sub", text: sub, pos: "center", y: 610, t0: t0 + 1, t1, wash: false },
];

// 一個節拍 → 場景
export function beat({ dur = 14, bbox, to, cam, year, yearSub, layers = [], caps = [], chapNum, chapText, trans = 1.4, ...rest }) {
  const sc = { dur, trans, cam: cam ?? camTo(bbox, to, dur), layers, caps: [...caps], year, yearSub, ...rest };
  if (chapNum) sc.caps.unshift(chap(chapNum, chapText, 0.4, dur - 0.4));
  // 字幕的結束時間沒寫時，延到場景結尾
  sc.caps = sc.caps.map((c) => ({ ...c, t1: c.t1 ?? dur - 0.5 }));
  return sc;
}
