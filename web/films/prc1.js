// 共和國 · 其一《支部》（1920 – 1953）
import { beat, reg, arrow, city, label, zone, wall, quote, note, title, ll, C } from "../lib/dsl.js";
import { P } from "../lib/regions.js";
const MG = "《民國紀事本末》", T2 = "《劉仲敬入門第二講 · 通古今之變》", V106 = "《劉仲敬訪談 106 論中共的內蒙古政策》";
const MOS = ll(55.76, 37.62), SH = ll(31.23, 121.47), GZ = ll(23.13, 113.26), BJ = ll(39.9, 116.4), YA = ll(36.59, 109.49), VL = ll(43.12, 131.89);
const RED = "#b8322a";

export default {
  title: "支部",
  scenes: [
    beat({ dur: 16, cam: [[0, { lon: 60, lat: 45, zoom: 1.1 }], [16, { lon: 95, lat: 40, zoom: 1.6 }]], year: "1920", yearSub: "至1921",
      layers: [reg(["RUS", "UKR", "BLR", "KAZ"], RED, "蘇俄", 7.5, { alpha: 0.5 }),
        arrow([MOS, VL, SH], RED, 8.4, 3.5, { label: "代表與盧布", width: 11 }), city(SH, "上海 · 1921", 11.5)],
      caps: [...title("共和國 · 其一", "支部 —— 劉仲敬史觀 · 地圖紀錄片", 1.2, 7),
        quote("最後中國共產黨勝出的唯一原因就是*組織和金錢*。\n蘇聯的盧布和紀律加到中國共產黨的頭上", "《劉仲敬訪談 072》", 8.4, 15.5)] }),
    beat({ bbox: [40, -10, 150, 60], year: "1920年代", chapNum: "一", chapText: "一個不起眼的支部",
      layers: [reg(["MNG"], RED, "蒙古", 0.6, { alpha: 0.6 }), reg(["IDN"], RED, "南洋", 1, { alpha: 0.5 }), reg(P.manchuria, RED, "滿洲", 1.4, { alpha: 0.4 }),
        city(SH, "中國支部", 2, { r: 4 }), city(ll(37.57, 126.98), "朝鮮支部", 2.4, { r: 4 })],
      caps: [quote("中國共產黨最初在共產國際的共產黨各黨當中是一個*很不起眼的角色*。\n在二十年代，這個支部跟朝鮮共產黨支部是差不多大的。", V106, 1, 13.5, { opt: { size: 42 } })] }),
    beat({ bbox: [105, 18, 125, 35], year: "1923", chapNum: "二", chapText: "兩百萬銀元",
      layers: [reg(["CN:Guangdong"], C.ochre, "廣州政府", 0.5), arrow([SH, GZ], C.gold, 1, 2, { label: "銀元", width: 9 }), city(GZ, "廣州", 2.5)],
      caps: [quote("馬林和越飛帶著*二百萬銀元*（不是盧布，紙盧布是一文也不值的）給了孫文。", "《劉仲敬訪談 054》", 1, 13.5)] }),
    beat({ bbox: [108, 20, 134, 45], year: "1924", yearSub: "黃埔", chapNum: "三", chapText: "黨國的模板",
      layers: [arrow([VL, ll(30, 126), GZ], RED, 0.8, 3, { label: "軍火與顧問", width: 10, arc: 0.06 }), city(ll(23.1, 113.42), "黃埔軍校", 3.6)],
      caps: [quote("民國（約法）國父：宋教仁。*黨國（訓政）國父鮑羅廷*、汪兆銘，耐人尋昧。", MG, 1, 7.4),
        quote("*以黨治國、以黨司法、以黨領軍*。作俑造因者自食其業。", MG, 7.8, 13.5)] }),
    beat({ dur: 15, bbox: [105, 20, 125, 42], year: "1928", yearSub: "節點之一", chapNum: "四", chapText: "北伐",
      layers: [arrow([GZ, ll(30.59, 114.31), ll(32.06, 118.8), BJ], C.ochre, 0.8, 5, { label: "北伐", width: 12 }),
        ...[["CN:Guangdong"], ["CN:Hunan"], ["CN:Hubei"], ["CN:Jiangxi"], ["CN:Jiangsu", "CN:Zhejiang", "CN:Shanghai"]].map((ids, i) => reg(ids, C.ochre, null, 1.5 + i * 0.8, { alpha: 0.4 }))],
      caps: [quote(`他沒有意識到1928 年他已經*跨越了節點*`, T2, 2, 14.5), note("節點：換一個人、換一步棋，結局就會改寫", 6, 14, { x: 1450, y: 780 })] }),
    beat({ bbox: [100, 20, 135, 46], year: "1928", yearSub: "至1937", chapNum: "五", chapText: "鎖定",
      layers: [city(ll(25.89, 116.03), "瑞金", 0.5), arrow([ll(25.89, 116.03), ll(26.6, 106.7), ll(29.9, 102.2), ll(33.5, 103.5), YA], RED, 1, 4, { label: "長征", width: 6 }),
        reg(P.manchuria, "#6a6f8a", "滿洲國 · 1931", 3, { alpha: 0.5 })],
      caps: [quote(`中國的命運從1928 年到1949 年的過程中，已經*通過一個動態平衡鎖定了*。`, T2, 1, 13.5)] }),
    beat({ dur: 15, bbox: [100, 18, 145, 50], year: "1937", yearSub: "節點之二", chapNum: "六", chapText: "日本的重新選擇",
      layers: [reg(["JPN", "KOR", "PRK"], "#5a5f78", "日本", 0.4), reg(P.manchuria, "#5a5f78", null, 0.6), city(ll(39.85, 116.21), "盧溝橋", 1),
        reg(["CN:Hebei", "CN:Beijing", "CN:Tianjin", "CN:Shandong", "CN:Jiangsu", "CN:Shanghai", "CN:Zhejiang"], "#5a5f78", null, 2.5, { alpha: 0.45 })],
      caps: [quote(`1937 年之所以是一個節點，是因為1937 年以前一直是*站在英美一邊扮演國際秩序維持者的日本*，做了一個重新選擇。`, T2, 1, 14.5, { opt: { size: 40 } })] }),
    beat({ bbox: [100, 28, 125, 44], year: "1937", yearSub: "至1945", chapNum: "七", chapText: "戰爭養大了支部",
      layers: [city(YA, "延安", 0.4), ...[["CN:Shaanxi", "CN:Gansu", "CN:Ningxia"], ["CN:Shanxi"], ["CN:Hebei"], ["CN:Shandong"]].map((ids, i) =>
        reg(ids, RED, null, 1 + i * 1.2, { alpha: 0.3 + 0.05 * i, reveal: "grow" }))],
      caps: [quote("是抗日戰爭改變了基本局勢，使它的*黨員人數和利用價值大大上升*。", V106, 1, 13.5)] }),
    beat({ dur: 16, bbox: [112, 36, 136, 53], year: "1945", yearSub: "至1948", chapNum: "八", chapText: "滿洲黨",
      layers: [arrow([ll(48.5, 117), ll(45.8, 126.53)], RED, 0.6, 2, { label: "蘇聯紅軍", width: 11 }), arrow([ll(50.3, 127.5), ll(41.8, 123.43)], RED, 1, 2.2, { width: 9 }),
        reg(P.manchuria, RED, "滿洲黨", 3, { alpha: 0.55 }), arrow([YA, ll(41.8, 123.43)], C.ochre, 6, 2.5, { label: "關內幹部", width: 8 }), city(ll(46.08, 122.07), "烏蘭浩特", 4)],
      caps: [quote("滿洲黨尤其是在*蘇聯紅軍的直接武裝*之下建立起來的。\n只要滿洲黨接管了滿洲工業區的遺產，整個中國黨都要完蛋。", V106, 1, 8),
        quote("他們戰勝滿洲優勢的唯一手段就是*人事*，\n把關內的幹部通過組織關係派進滿洲和蒙古去。", V106, 8.4, 15)] }),
    beat({ dur: 15, bbox: [72, 16, 136, 54], year: "1949", chapNum: "九", chapText: "建國：兩派的聯盟",
      layers: [reg(P.manchuria, RED, "滿洲黨", 0.4, { alpha: 0.6 }), reg(["CN:Hebei", "CN:Shanxi", "CN:Shandong", "CN:Henan", "CN:Shaanxi"], C.brick, "梁山好漢 + 土鱉幹部黨", 1, { alpha: 0.5, labelSize: 28 }),
        reg(P.eighteen, RED, null, 5, { alpha: 0.25, reveal: "grow", growDur: 4 }), reg(P.taiwan, C.sky, "台灣", 6), city(BJ, "北京 · 10月1日", 7)],
      caps: [quote("建立毛澤東所代表的*梁山好漢和封建軍閥*與劉少奇所代表的*土鱉幹部黨*的聯盟，\n他們才能夠戰勝更洋氣的滿洲黨。", V106, 1, 14.5, { opt: { size: 42 } })] }),
    beat({ dur: 17, bbox: [118, 33, 132, 43], year: "1950", yearSub: "至1953", chapNum: "十", chapText: "朝鮮不是節點",
      layers: [wall([ll(38, 124.6), ll(38, 129.5)], C.paper, 0.5, { dash: [10, 8], width: 3 }), label(ll(38.3, 130.4), "三八線", 0.8, { size: 26 }),
        arrow([ll(40.12, 124.38), ll(39.03, 125.75), ll(37.57, 126.98)], RED, 1.5, 2.5, { width: 10 }), city(ll(39.03, 125.75), "平壤", 1.5), city(ll(37.57, 126.98), "漢城", 2)],
      caps: [quote(`所以我們可以說，從格局和節點的意義上來講，*朝鮮戰爭其實並不算是一個節點*。`, T2, 1, 8),
        quote("你只需要研究一下*滿洲的鐵路網是誰在經營*，如果蘇聯專家走了以後毛澤東有沒有能力經營，\n這些偽問題就是根本沒有必要考慮的。", "《劉仲敬訪談 079》", 8.4, 15.2, { opt: { size: 40 } }),
        { style: "sub", text: "共和國 · 其一《支部》", pos: "center", y: 540, t0: 15.3, t1: 17, wash: false }] }),
  ],
};
