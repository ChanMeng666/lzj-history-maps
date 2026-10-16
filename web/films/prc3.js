// 共和國 · 其三《中間那一節》（1972 – 今）
import { beat, reg, arrow, city, label, zone, stream, wall, quote, note, title, ll, C } from "../lib/dsl.js";
import { P } from "../lib/regions.js";
const T2 = "《劉仲敬入門第二講 · 通古今之變》", V106 = "《劉仲敬訪談 106》", V130 = "《劉仲敬訪談 130》", V058 = "《劉仲敬訪談 058》", GC = "《劉仲敬論全球資本主義》";
const BJ = ll(39.9, 116.4), HK = ll(22.32, 114.17), SZ = ll(22.54, 114.06), DL = ll(38.91, 121.6), TOK = ll(35.68, 139.69);
const BLUE = "#3f7cc0", GOLD = "#e3b960";

export default {
  title: "中間那一節",
  scenes: [
    beat({ dur: 16, cam: [[0, { lon: 125, lat: 35, zoom: 1.6 }], [16, { lon: 125, lat: 36, zoom: 2.2 }]], year: "1972", yearSub: "至1976",
      layers: [arrow([TOK, DL], C.sky, 7.5, 2, { label: "化肥工廠", width: 9 }), arrow([ll(53.55, 9.99), ll(48, 60), BJ], C.sky, 8, 3, { width: 7 }), city(DL, "大連", 9.5)],
      caps: [...title("共和國 · 其三", "中間那一節 —— 劉仲敬史觀 · 地圖紀錄片", 1.2, 7),
        quote("沒有這個代辦處的話，*德國和日本的肥料是進不了中國的*，\n文化大革命根本維持不到1976年。", "《劉仲敬訪談 115》", 8.2, 15.5),
        note("史實：美國駐北京聯絡處，1973年5月設立", 9, 15.5, { x: 1520, y: 300, opt: { size: 30 } })] }),
    beat({ bbox: [100, 20, 135, 46], year: "1978", chapNum: "一", chapText: "放水出閥",
      layers: [zone(BJ, "rgba(63,124,192,0.9)", 3, 0.5), wall([BJ, ll(36, 117), ll(32, 119.5), ll(28, 120), ll(24, 117), ll(22.5, 114)], "#7fb3e3", 2, { dash: null, width: 8, dur: 4 })],
      caps: [quote("1972年才是改革開放的節點，而*1979年根本不是*，反倒是老列寧主義者的奪權活動。", "《劉仲敬訪談 115》", 1, 7),
        quote(`1972 年的大轉向就是*放水出閥*，之後無論如何都會在地上衝出一條水道，這便是1978 年的事情。`, T2, 7.4, 13.5, { opt: { size: 42 } })] }),
    beat({ dur: 15, bbox: [72, 16, 136, 54], year: "1980年代", chapNum: "二", chapText: "美國秩序的輸入",
      layers: [reg(P.coast, BLUE, "東南沿海", 0.6, { alpha: 0.6, reveal: "grow" }), reg([...P.innerMongolia, ...P.xinjiang, ...P.manchuria], "#8a6b6b", null, 2, { alpha: 0.35 })],
      caps: [quote("而*改革開放是美國秩序的輸入*，改革開放發財的部分全在東南沿海，\n跟過去的士大夫文化地區基本一致。", V106, 1, 14.5)] }),
    beat({ bbox: [108, 20, 123, 27], year: "1980", yearSub: "經濟特區", chapNum: "三", chapText: "特區",
      layers: [...[[SZ, "深圳"], [ll(22.27, 113.58), "珠海"], [ll(23.35, 116.68), "汕頭"], [ll(24.48, 118.09), "廈門"]].map(([p, n], i) => city(p, n, 0.5 + i * 0.4)),
        arrow([HK, SZ], GOLD, 2, 1.2, { label: "港資", width: 9, arc: 0.4 }), arrow([ll(25.03, 121.56), ll(24.48, 118.09)], GOLD, 2.8, 1.6, { label: "台資", width: 9 })],
      caps: [quote("給福建的特殊政策和引誘台商到福建來投資的政策，*跟港商到廣東是一樣的優惠*。", "《劉仲敬訪談 131》", 1, 13.5)] }),
    beat({ bbox: [104, 18, 124, 34], year: "1990年代", chapNum: "四", chapText: "繞一圈回來的錢",
      layers: [arrow([ll(30.5, 112), HK], "#d9796f", 0.6, 2, { label: "資金外逃", width: 8 }), arrow([HK, ll(28.5, 118)], GOLD, 2.4, 2, { label: "「香港資金」", width: 8 })],
      caps: [quote("內地資金外逃到香港，然後又*以香港資金的名義反過來投資內地*，是同一個邏輯。", "《劉仲敬訪談 073》", 1, 13.5)] }),
    beat({ bbox: [100, 22, 124, 42], year: "1990年代", chapNum: "五", chapText: "匪諜系與改革",
      layers: [label(ll(34, 112), "匪諜系", 0.6, { size: 42, color: "#f1d28c" })],
      caps: [quote("匪諜系的關鍵性轉折點不是改革開放。\n改革開放是*匪諜系積極支持*，認為沒有什麼大不了的", "《劉仲敬訪談 091》", 1, 13.5)] }),
    beat({ dur: 15, bbox: [102, 20, 122, 34], year: "1990年代", chapNum: "六", chapText: "打工仔",
      layers: [...[ll(30.6, 104), ll(28.2, 112.97), ll(34.7, 113.6)].map((p, i) => arrow([p, ll(23.02, 113.75)], C.ochre, 0.6 + i * 0.6, 2, { width: 6 })),
        city(ll(23.02, 113.75), "東莞", 2.5), city(SZ, "深圳", 2.8, { align: "right" })],
      caps: [quote("八十年代後期的*鄉鎮企業*在九十年代轉向對外開放以後*基本上都破產了*。", V130, 1, 7),
        quote("現在這些潛在的小老板和工人全都變成了*東莞和深圳的打工仔*。", V130, 7.4, 14.5)] }),
    beat({ dur: 15, cam: [[0, { lon: 165, lat: 30, zoom: 1.1 }], [15, { lon: 150, lat: 30, zoom: 1.2 }]], year: "2001", yearSub: "至2015", chapNum: "七", chapText: "產業淘汰的最後一環",
      layers: [stream(ll(37, -100), ll(30, 120), GOLD, 0.6, { n: 60 }), stream(TOK, ll(30, 120), GOLD, 1, { n: 30 }), stream(ll(50, 8), ll(30, 120), GOLD, 1.4, { n: 40 }),
        reg(P.coast, GOLD, null, 2, { alpha: 0.5 })],
      caps: [quote(`就是其他地方淘汰落後產業，把淘汰的落後產業全都集中到這裡的時候，這是最繁榮時期……\n然而這正是*產業淘汰的最後一環*。`, GC, 1, 14.5, { opt: { size: 40 } })] }),
    beat({ bbox: [116, 36, 126, 42], year: "2010年代", chapNum: "八", chapText: "斷了的中間層",
      layers: [city(DL, "大連", 0.5), city(ll(39.63, 121.98), "瓦房店", 0.8), arrow([TOK, DL], C.sky, 1.4, 2, { label: "日本技術員", width: 8 })],
      caps: [quote("包括大連的那些日本企業，本地人都是農民工，*中間那個技術工人層次斷代了*，\n稍微像一點樣的技術人員必須是日本人自己帶過來。這就是瓦房店化的最後升級。", V058, 1, 13.5, { opt: { size: 40 } })] }),
    beat({ dur: 17, bbox: [60, -10, 150, 50], year: "2018", yearSub: "至今", chapNum: "九", chapText: "技術輸出的中止",
      layers: [reg(P.coast, GOLD, null, 0, { alpha: 0.5, t1: 9, fade: 3 }), arrow([ll(23, 113.5), ll(21.18, 106.07)], GOLD, 1.5, 2, { label: "越南", width: 8 }),
        arrow([ll(23, 113.5), ll(13.08, 80.27)], GOLD, 2.4, 2.4, { label: "印度", width: 8 })],
      caps: [quote("對於中國方面來說的話，那就是*技術輸出的中止*。", V130, 1, 7),
        quote("相應的產業，像是唐國初年的玻璃生產一樣，又第不知道多少次進入無法自我維持的狀態。\n這就是一個*瓦房店現象*。", V130, 7.4, 15.2, { opt: { size: 40 } }),
        { style: "sub", text: "共和國 · 其三《中間那一節》", pos: "center", y: 540, t0: 15.3, t1: 17, wash: false }] }),
  ],
};
