// 這片土地 · 其二《秦政》（約前 450 – 220）
import { beat, reg, arrow, city, label, zone, wall, quote, note, title, ll, C } from "../lib/dsl.js";
import { P } from "../lib/regions.js";
const J3 = "《經與史 · 通向盛夏之路》", J4 = "《經與史 · 革命時代》", J5 = "《經與史 · 嚴冬將臨》", WD = "《中國窪地》";
const WS = [100, 24, 125, 44];
const XY = ll(34.33, 108.71);

export default {
  title: "秦政",
  scenes: [
    beat({ dur: 16, cam: [[0, { lon: 105, lat: 36, zoom: 1.6 }], [16, { lon: 112.5, lat: 34, zoom: 3.2 }]], year: "前350", yearSub: "戰國",
      layers: [reg(["CN:Shaanxi", "CN:Gansu"], C.brick, "秦", 7.5), reg(["CN:Shanxi", "CN:Henan"], C.olive, "三晉", 8), reg(P.qi, C.ochre, "齊", 8.5),
        reg(P.yan, C.slate, "燕", 9), reg(["CN:Hubei", "CN:Hunan", "CN:Anhui"], C.verm, "楚", 9.5), reg(["CN:Zhejiang"], C.sky, "越", 10)],
      caps: [...title("這片土地 · 其二", "秦政 —— 劉仲敬史觀 · 地圖紀錄片", 1.2, 7),
        quote("郡縣制的精神源於*喪失組織資源的原子化個人*，\n吏治國家將他們重新組織成垂直管理的扁平社會。", J3, 8.2, 15.5)] }),
    beat({ bbox: [106, 32, 116, 38], year: "前400", chapNum: "一", chapText: "三晉的實驗室",
      layers: [reg(P.jin, C.olive, "晉", 0.3), reg(P.guanzhong, C.brick, "秦", 0.5), city(ll(35.1, 111.2), "安邑", 0.8), city(XY, "咸陽", 1),
        arrow([ll(35.1, 111.2), XY], C.ochre, 1.6, 2, { label: "法家與郡縣", width: 9 })],
      caps: [quote("秦人大體上是*三晉的文化殖民地*，「以吏為師」和郡縣制都起源於晉、光大於秦。", J4, 1, 13.5)] }),
    beat({ bbox: [106, 34, 118, 42], year: "前350", chapNum: "二", chapText: "邊疆的補丁",
      layers: [city(ll(37.5, 109.5), "上郡", 0.8), city(ll(40.8, 111.7), "雲中", 1.3), city(ll(39.84, 114.57), "代", 1.8),
        ...[ll(37.5, 109.5), ll(40.8, 111.7), ll(39.84, 114.57)].map((p, i) => zone(p, "rgba(181,69,47,0.85)", 1.5, 1 + i * 0.5))],
      caps: [quote("最早的郡縣與其說是一種制度，不如說是\n軍國主義現實政治給封建主義習慣法打上的*一連串補丁*。", J4, 1, 13.5)] }),
    beat({ bbox: [105, 32, 112, 37], year: "前356", yearSub: "商鞅變法", chapNum: "三", chapText: "編戶齊民",
      layers: [reg(P.guanzhong, C.brick, null, 0.3, { hatch: "rgba(250,240,220,0.8)" }), city(XY, "咸陽", 0.6)],
      caps: [quote("「編戶齊民」不僅要毀滅封建，而且要*毀滅氏族*，\n將一切資源集中到國家手中。", J4, 1, 13.5),
        note("一戶一格：國家直接管到每一個人", 4, 13, { x: 1480, y: 720 })] }),
    beat({ dur: 17, bbox: [104, 30, 122, 42], year: "前230", yearSub: "至前221", chapNum: "四", chapText: "機器",
      layers: [reg(["CN:Shaanxi", "CN:Gansu"], C.brick, "秦", 0.2), city(XY, "咸陽", 0.4),
        ...[[ll(34.4, 113.74), "韓"], [ll(36.6, 114.48), "趙"], [ll(34.8, 114.35), "魏"], [ll(32.58, 116.78), "楚"], [ll(39.9, 116.4), "燕"], [ll(36.86, 118.33), "齊"]].flatMap(([p, n], i) => [
          arrow([XY, p], C.verm, 1 + i * 1.6, 1.4, { width: 8 }), city(p, n, 2.3 + i * 1.6)]),
        reg(P.eighteen.filter((x) => !["CN:Sichuan", "CN:Chongqing", "CN:Yunnan", "CN:Guizhou", "CN:Guangxi", "CN:Guangdong", "CN:Fujian", "CN:Hainan"].includes(x)), C.brick, null, 11, { alpha: 0.35 })],
      caps: [quote("秦政的原則卻只有一條：只要你得到這台機器，\n*這台機器就會為你做任何事情*。", J3, 2, 16)] }),
    beat({ bbox: [108, 28, 122, 40], year: "前209", yearSub: "至前202", chapNum: "五", chapText: "諸夏的反抗",
      layers: [zone(ll(36.5, 118), "rgba(200,145,58,0.9)", 4, 0.5), zone(ll(31.5, 114), "rgba(181,69,47,0.9)", 5, 1), city(ll(33.63, 117.07), "大澤鄉", 1.2),
        label(ll(36.5, 118.3), "齊", 0.8, { size: 40 }), label(ll(31, 113), "楚", 1.2, { size: 40 })],
      caps: [quote("「寧蹈東海，義不帝秦」是*齊人的愛國主義*。", J4, 1, 7),
        quote("廉頗視為萎靡腐敗的楚人卻將*復國主義和軍事傳統*保持到最後。", J3, 7.4, 13.5)] }),
    beat({ dur: 15, bbox: [90, 30, 125, 52], year: "前215", chapNum: "六", chapText: "草原的回應",
      layers: [reg(["MNG", "CN:InnerMongol"], C.slate, "匈奴", 0.5), city(ll(47.5, 102.5), "龍城", 1),
        wall([ll(40.3, 104), ll(40.8, 108), ll(41, 111.7), ll(40.6, 114.5), ll(40.4, 117.5), ll(40.8, 121)], "#efe2c4", 1.5, { dur: 3 })],
      caps: [quote("從後者的角度看，匈奴是秦、趙、燕*開邊拓地的自然反應*。", J4, 1, 7),
        quote("長城是未雨綢繆的廟算，在自己戰斗力最強的窗口期，\n以最有利的條件*劃定永久的邊疆*。", J4, 7.4, 14.5)] }),
    beat({ dur: 15, bbox: [68, 15, 130, 48], year: "前133", yearSub: "至前101 · 漢武帝", chapNum: "七", chapText: "雇傭兵的遠征",
      layers: [city(ll(34.27, 108.9), "長安", 0.4),
        ...[[ll(40.14, 94.66), "敦煌"], [ll(23.13, 113.26), "番禺"], [ll(39.02, 125.75), "王險"], [ll(40.5, 71), "大宛"]].flatMap(([p, n], i) => [
          arrow([ll(34.27, 108.9), p], C.verm, 1 + i * 1.3, 1.6, { width: 8 }), city(p, n, 2.4 + i * 1.3)]),
        reg(["CN:Guangdong", "CN:Guangxi"], C.teal, "南越", 2.4, { alpha: 0.45 })],
      caps: [quote("匈奴、朝鮮、南越、大宛的戰役將七科謫、惡少、徒、弛刑、應募罪人\n送進了*雇佣兵的行伍*。", J5, 1.5, 14.5)] }),
    beat({ bbox: [96, 36, 116, 50], year: "89", yearSub: "燕然", chapNum: "八", chapText: "以夷制夷",
      layers: [arrow([ll(40.3, 107), ll(45.2, 105.8)], C.ochre, 1, 2.5, { label: "南匈奴與屬國", width: 10 }), city(ll(45.2, 105.8), "燕然山", 3)],
      caps: [quote("竇憲以*南匈奴和屬國的武力*絕漠，實現了毀滅北匈奴的歷史性勝利。", J5, 1, 13.5)] }),
    beat({ dur: 17, bbox: [100, 24, 124, 44], year: "184", yearSub: "至220", chapNum: "九", chapText: "方格散了",
      layers: [reg(P.eighteen, C.brick, null, 0, { alpha: 0.4, hatch: "rgba(250,240,220,0.6)", t1: 9, fade: 3 }),
        ...[ll(36, 114), ll(31, 113), ll(30.6, 104), ll(32, 119), ll(35, 105)].map((p, i) => zone(p, "rgba(227,185,96,0.8)", 3, 6 + i * 0.5))],
      caps: [quote("編戶齊民是吏治國家汲取人力物力的根基，\n這時已經陷入*無法整頓的混亂*中。", J5, 1, 8.4),
        quote(`內亞的部落也許是野蠻的，但它是*能夠自己統治自己和統治別人的*`, WD, 8.8, 15),
        { style: "sub", text: "這片土地 · 其二《秦政》", pos: "center", y: 540, t0: 15.2, t1: 17, wash: false }] }),
  ],
};
