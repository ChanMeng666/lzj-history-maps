// 世界 · 其三《種子銀行》（376 – 1789）
import { beat, reg, arrow, city, label, zone, wall, quote, note, title, ll, C } from "../lib/dsl.js";
import { P } from "../lib/regions.js";
const W1 = "《文明更迭的源代碼》", I002 = "《劉仲敬訪談 002》", I005 = "《劉仲敬訪談 005》", I016 = "《劉仲敬訪談 016》";

export default {
  title: "種子銀行",
  scenes: [
    beat({ dur: 16, cam: [[0, { lon: 30, lat: 40, zoom: 1.05 }], [16, { lon: 10, lat: 45, zoom: 2.0 }]], year: "376", yearSub: "至476",
      layers: [reg(P.romeWest.concat(["GBR"]), C.verm, "西羅馬", 7.4, { alpha: 0.45 }), ...[[ll(48, 3)], [ll(41, -3)], [ll(43, 12)]].map(([p], i) => arrow([ll(53, 12), p], C.slate, 8 + i * 0.6, 2, { width: 8 })),
        arrow([ll(53, 12), ll(41, -3), ll(36.85, 10.32)], C.slate, 9.6, 3, { label: "汪達爾人", width: 7 })],
      caps: [...title("世界 · 其三", "種子銀行 —— 劉仲敬史觀 · 地圖紀錄片", 1.2, 7),
        quote("那個使民眾負擔過重的官僚體制*一下子就瓦解了*", W1, 8.2, 15.5)] }),
    beat({ bbox: [-12, 30, 40, 58], year: "500", yearSub: "至700", chapNum: "一", chapText: "打不死的教會",
      layers: [...[ll(41.9, 12.45), ll(45.76, 4.83), ll(48.86, 2.35), ll(50.94, 6.96), ll(37.98, -1.13), ll(51.28, 1.08), ll(45.43, 12.33), ll(48.58, 7.75)].map((p, i) => city(p, i === 0 ? "羅馬" : null, 0.4 + i * 0.3, { r: 5 }))],
      caps: [quote("帝國的主要社會基層是*彷彿打不死的教會*，這對於蠻族而言才是最重要的。", W1, 1, 13.5)] }),
    beat({ bbox: [-5, 40, 20, 55], year: "800", yearSub: "至962", chapNum: "二", chapText: "查理曼到神聖羅馬",
      layers: [reg(["FRA", "DEU", "NLD", "BEL", "LUX", "CHE", "AUT"], C.indigo, "法蘭克", 0.6), city(ll(50.78, 6.08), "亞琛", 1.2)],
      caps: [quote("內日耳曼人征服羅馬帝國，建立神聖羅馬帝國以後，忘記了日耳曼語言，*變成了拉丁族*。", "劉仲敬 Twitter", 1, 13.5)] }),
    beat({ bbox: [-10, 36, 30, 62], year: "1000", yearSub: "至1300", chapNum: "三", chapText: "多中心的拉丁世界",
      layers: [reg(P.latin, C.indigo, "拉丁基督教世界", 0.5, { alpha: 0.45, labelAt: [12, 50] }), city(ll(44.58, 10.45), "卡諾莎 · 1077", 1.6), city(ll(41.9, 12.45), "羅馬", 2)],
      caps: [quote(`西歐封建二要義：*政教多元競爭，司法體系多元競爭*`, "數卷殘編", 1, 7), quote("羅馬教廷的專家小組是*全世界民族國家官僚機構的起源*", "《劉仲敬訪談 101》", 7.4, 13.5)] }),
    beat({ bbox: [-6, 43, 15, 54], year: "1088", yearSub: "波隆那", chapNum: "四", chapText: "羅馬法的刺激",
      layers: [city(ll(44.49, 11.34), "波隆那", 0.4), ...[[ll(48.85, 2.35), "巴黎"], [ll(51.75, -1.25), "牛津"], [ll(51.5, -0.13), "西敏"]].flatMap(([p, n], i) => [
        arrow([ll(44.49, 11.34), p], C.gold, 1 + i * 0.7, 1.8, { width: 7 }), city(p, n, 2.4 + i * 0.7)])],
      caps: [quote("就是需要有來自羅馬法的刺激，*但是又不能由羅馬法壟斷*", W1, 1, 8), quote("而這樣的情況就*出現在英國*。", W1, 8.4, 13.5)] }),
    beat({ bbox: [-8, 49, 3, 56], year: "1066", yearSub: "至1215", chapNum: "五", chapText: "英格蘭",
      layers: [reg(["GBR"], C.verm, "英格蘭", 0.5), city(ll(50.91, 0.49), "黑斯廷斯 · 1066", 1), city(ll(51.44, -0.56), "蘭尼米德 · 1215", 1.6)],
      caps: [quote("英格蘭等於是*日耳曼封建世界在歐洲以外拋下的一個種子*", I002, 1, 13.5)] }),
    beat({ bbox: [-10, 36, 20, 58], year: "1550", yearSub: "至1688", chapNum: "六", chapText: "絕對主義的時代",
      layers: [reg(["FRA", "ESP"], "#7c7468", "絕對主義", 0.5, { alpha: 0.55 }), reg(["GBR"], C.verm, "英格蘭", 1)],
      caps: [quote("英格蘭*保留了封建主義的憲法*", I002, 1, 13.5)] }),
    beat({ dur: 15, bbox: [-80, 22, 10, 58], year: "1492", yearSub: "至1630", chapNum: "七", chapText: "越過大西洋",
      layers: [arrow([ll(50.37, -4.14), ll(37.21, -76.78)], C.verm, 0.6, 3, { label: "詹姆斯敦 · 1607", width: 9 }), arrow([ll(50.37, -4.14), ll(41.96, -70.67)], C.verm, 1.6, 3, { label: "普利茅斯 · 1620", width: 9 })],
      caps: [quote("只要是*移民團體和輸出秩序並行*，都可以算是殖民。", I005, 1, 7.2), quote("隨著歐洲人跟隨達伽馬的步伐來到印度洋和南洋，*海路重新壓倒了陸路*。", I016, 7.6, 14.5)] }),
    beat({ bbox: [-74, 41, -69, 44], year: "1620", yearSub: "至1750", chapNum: "八", chapText: "新英格蘭鄉鎮",
      layers: [reg(P.newEngland, C.verm, "新英格蘭", 0.5), ...[ll(42.36, -71.06), ll(41.82, -71.41), ll(41.76, -72.68), ll(43.21, -71.54), ll(42.27, -71.8)].map((p, i) => city(p, null, 1 + i * 0.3, { r: 5 }))],
      caps: [quote("新英格蘭鄉鎮為*中世紀自治公社移殖*", "數卷殘編", 1, 7), quote(`美洲殖民地其實是*中古以來基督教歐洲政治資源的種子銀行*。`, "《從華夏到中國》", 7.4, 13.5)] }),
    beat({ bbox: [-86, 29, -65, 46], year: "1776", yearSub: "至1787", chapNum: "九", chapText: "又一粒種子",
      layers: [reg(P.thirteen, C.verm, "十三州", 0.5, { reveal: "grow" }), city(ll(39.95, -75.16), "費城", 1.4)],
      caps: [quote("所以*美國又是英格蘭本身拋到美洲大陸的一個種子*。", I002, 1, 13.5)] }),
    beat({ dur: 17, cam: [[0, { lon: 0, lat: 40, zoom: 0.95 }], [17, { lon: -10, lat: 38, zoom: 1.0 }]], year: "接力", chapNum: "十", chapText: "沒有中斷過",
      layers: [arrow([ll(33, 44), ll(35, 30), ll(38, 23), ll(46, 5), ll(51.5, -0.1), ll(40, -75)], C.gold, 1, 6, { width: 12, arc: 0.06 })],
      caps: [quote("核心文明從肥沃新月到兩希、從兩希到大西洋兩岸，*一直沒有中斷過*。", "劉仲敬 Twitter", 1.5, 15.2),
        { style: "sub", text: "世界 · 其三《種子銀行》", pos: "center", y: 540, t0: 15.3, t1: 17, wash: false }] }),
  ],
};
