// 世界 · 其二《內亞海洋》（前 800 – 1500）
import { beat, reg, arrow, city, label, zone, stream, wall, quote, note, title, ll, C } from "../lib/dsl.js";
import { P } from "../lib/regions.js";
const W1 = "《文明更迭的源代碼》", W4 = "《經與史華夏世界的歷史建構》", WD = "《中國窪地》", T02 = "劉仲敬 Twitter", I076 = "《劉仲敬訪談 076》", I016 = "《劉仲敬訪談 016》";
const CA = ll(34.27, 108.95);

export default {
  title: "內亞海洋",
  scenes: [
    beat({ dur: 16, cam: [[0, { lon: 40, lat: 30, zoom: 0.95 }], [16, { lon: 62, lat: 35, zoom: 1.2 }]], year: "前800", yearSub: "至前200",
      layers: [reg(["GRC"], C.sky, "希臘", 7.4), reg(["IND"], C.olive, "印度", 7.8, { alpha: 0.45 }), reg(["CN:Shaanxi", "CN:Henan", "CN:Shandong"], C.verm, "華夏", 8.2), reg(["ISR"], C.gold, "希伯來", 8.6)],
      caps: [...title("世界 · 其二", "內亞海洋 —— 劉仲敬史觀 · 地圖紀錄片", 1.2, 7),
        quote("現在人們說的希臘文明、華夏文明，這些都是*第二代的文明*。", W1, 8.2, 15.5)] }),
    beat({ bbox: [-8, 30, 42, 47], year: "前750", yearSub: "至前550", chapNum: "一", chapText: "大希臘",
      layers: [...[[ll(37.07, 15.29), "敘拉古"], [ll(40.47, 17.24), "塔蘭托"], [ll(43.3, 5.37), "馬薩利亞"], [ll(41.01, 28.98), "拜占庭"]].flatMap(([p, n], i) => [
        arrow([ll(38, 24), p], C.sky, 0.6 + i * 0.7, 1.6, { width: 7 }), city(p, n, 2 + i * 0.7)])],
      caps: [quote("包括阿基米得所在的敘拉古城邦，*都是大希臘殖民的產物*", "《劉仲敬訪談 005》", 1, 13.5)] }),
    beat({ dur: 15, cam: [[0, { lon: 60, lat: 35, zoom: 1.05 }], [15, { lon: 65, lat: 35, zoom: 1.1 }]], year: "前100", yearSub: "至200", chapNum: "二", chapText: "羅馬與漢",
      layers: [reg(P.rome, C.verm, "羅馬", 0.6, { alpha: 0.5, labelAt: [15, 40] }), reg(["CN:Shaanxi", "CN:Henan", "CN:Shandong", "CN:Hebei", "CN:Shanxi", "CN:Hubei", "CN:Jiangsu", "CN:Anhui", "CN:Sichuan"], C.ochre, "漢", 1.4, { alpha: 0.5 })],
      caps: [quote("秦漢帝國不是羅馬帝國的等價物，*社會分化程度遠為低下*。", W4, 1, 14)] }),
    beat({ dur: 15, bbox: [70, 30, 125, 55], year: "前200", yearSub: "至100", chapNum: "三", chapText: "匈奴與漢",
      layers: [reg(["MNG"], C.slate, "匈奴", 0.4), arrow([ll(47, 103), CA], C.slate, 1, 2, { label: "組織與軍事技術", width: 10 }), arrow([CA, ll(47, 108)], C.gold, 3.4, 2, { label: "絲綢與糧食", width: 8 })],
      caps: [quote("*內亞輸出組織和技術，東亞提供人力和金錢*。", T02, 1, 7), quote("然後上古時代開始，力量是在*擁有馬匹和戰車的陸路*一邊", I016, 7.4, 14.5)] }),
    beat({ dur: 15, bbox: [40, 28, 112, 48], year: "300", yearSub: "至700", chapNum: "四", chapText: "粟特與薩珊",
      layers: [reg(["IRN"], C.ochre, "薩珊", 0.4), reg(P.sogdia, C.teal, "粟特", 0.8), ...[[ll(33.09, 44.58), "泰西封"], [ll(39.77, 64.42), "布哈拉"], [ll(39.65, 66.96), "撒馬爾罕"], [ll(40.14, 94.66), "敦煌"], [CA, "長安"]].map(([p, n], i) => city(p, n, 1.4 + i * 0.4)),
        stream(ll(39.65, 66.96), CA, C.gold, 2.5, { n: 40 })],
      caps: [quote(`在整個內亞地區，*波斯人的文化輸出仍然佔有絕對優勢*`, WD, 1, 14.5)] }),
    beat({ dur: 15, bbox: [25, 30, 120, 55], year: "552", yearSub: "至630", chapNum: "五", chapText: "突厥",
      layers: [reg(["MNG", "KAZ", "CN:Xinjiang"], C.slate, "突厥汗國", 0.4, { alpha: 0.45 }), arrow([ll(47.5, 102), ll(41.01, 28.98)], C.slate, 1.4, 3.5, { label: "使節 · 568", width: 8 }),
        city(ll(41.01, 28.98), "君士坦丁堡", 4.6)],
      caps: [quote(`突厥人是整個內亞地區*最主要的鐵器提供者*`, WD, 1, 14.5)] }),
    beat({ dur: 15, bbox: [95, 26, 125, 45], year: "唐", yearSub: "至元", chapNum: "六", chapText: "內亞海洋的港口",
      layers: [...[[ll(40.14, 94.66), "沙州"], [ll(38.1, 106.3), "靈州"], [CA, "長安"], [ll(42.36, 116.18), "上都"], [ll(40.81, 114.88), "張家口"], [ll(39.9, 116.4), "大都"]].map(([p, n], i) => city(p, n, 0.4 + i * 0.3)),
        arrow([ll(30.27, 120.15), ll(39.9, 116.4)], C.gold, 2.4, 2, { label: "奴隸與膏脂", width: 8 }), arrow([ll(42.36, 116.18), ll(30.8, 119.5)], C.slate, 4.2, 2, { label: "組織與技術", width: 8 })],
      caps: [quote("*組織和技術從內亞流向吳越*，奴隸和膏脂從吳越流向內亞。", "劉仲敬 Twitter", 1, 14.5)] }),
    beat({ dur: 15, cam: [[0, { lon: 70, lat: 45, zoom: 1.05 }], [15, { lon: 75, lat: 45, zoom: 1.1 }]], year: "1206", yearSub: "至1260", chapNum: "七", chapText: "蒙古",
      layers: [reg(P.mongolEmpire, C.indigo, "蒙古帝國", 0.4, { alpha: 0.5, reveal: "grow", growDur: 4 }), city(ll(47.2, 102.82), "哈拉和林", 0.6), city(ll(33.31, 44.36), "巴格達 · 1258", 3.5)],
      caps: [quote("蒙古帝國的和平也是這個樣子的，*商路並不是他們開辟的*。", I076, 1, 14.5)] }),
    beat({ dur: 15, cam: [[0, { lon: 75, lat: 45, zoom: 1.1 }], [15, { lon: 75, lat: 45, zoom: 1.14 }]], year: "1260", yearSub: "至1368", chapNum: "八", chapText: "四大汗國",
      layers: [reg(["CHN", "MNG", "PRK", "KOR"], C.indigo, "元", 0.4), reg(["KAZ", "KGZ", "UZB", "TJK"], C.teal, "察合台", 0.8), reg(["IRN", "IRQ", "AZE", "ARM", "TKM", "AFG"], C.ochre, "伊兒", 1.2), reg(["RUS", "UKR"], C.plum, "金帳", 1.6, { alpha: 0.4, labelAt: [50, 52] })],
      caps: [quote("在大多數情況之下，*商路是在多國體系之下維持得最好*。", I076, 1, 14.5)] }),
    beat({ dur: 17, cam: [[0, { lon: 40, lat: 15, zoom: 0.95 }], [17, { lon: 45, lat: 10, zoom: 1.0 }]], year: "1497", yearSub: "至1498", chapNum: "九", chapText: "海路的再勝",
      layers: [reg(P.mongolEmpire, C.slate, null, 0.2, { alpha: 0.35, t1: 8, fade: 2 }), arrow([ll(38.72, -9.14), ll(10, -20), ll(-34.36, 18.47), ll(-10, 45), ll(11.25, 75.78)], C.sky, 1.6, 5, { label: "達伽馬", width: 10, arc: 0.05 }),
        city(ll(11.25, 75.78), "卡利卡特", 6.8)],
      caps: [quote("蒙古帝國是*內亞路線的落日余輝*，接下來就是海路再次戰勝陸路的時代了。", I016, 1, 8.4),
        quote("世界史是從西方開始的，所以*哥倫布時代是近代史的來源*。", I076, 8.8, 15.2), { style: "sub", text: "世界 · 其二《內亞海洋》", pos: "center", y: 540, t0: 15.3, t1: 17, wash: false }] }),
  ],
};
