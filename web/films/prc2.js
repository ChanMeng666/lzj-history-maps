// 共和國 · 其二《大禮包與無底洞》（1950 – 1972）
import { beat, reg, arrow, city, label, zone, wall, quote, note, title, ll, C } from "../lib/dsl.js";
import { P } from "../lib/regions.js";
const T2 = "《劉仲敬入門第二講 · 通古今之變》", V106 = "《劉仲敬訪談 106》", V058 = "《劉仲敬訪談 058》";
const MOS = ll(55.76, 37.62), BJ = ll(39.9, 116.4), SH = ll(31.23, 121.47), WFD = ll(39.63, 121.98);
const RED = "#b8322a", BLUE = "#3f7cc0";

export default {
  title: "大禮包與無底洞",
  scenes: [
    beat({ dur: 16, cam: [[0, { lon: 70, lat: 45, zoom: 1.1 }], [16, { lon: 95, lat: 42, zoom: 1.5 }]], year: "1950年代",
      layers: [reg(P.ussr, RED, "蘇聯", 7.4, { alpha: 0.45 }), reg(["DEU", "CZE"], RED, null, 7.8), reg(P.manchuria, C.gold, "大禮包", 8.4, { alpha: 0.7 }),
        reg(P.eighteen, C.slate, "無底洞", 9, { alpha: 0.4 })],
      caps: [...title("共和國 · 其二", "大禮包與無底洞 —— 劉仲敬史觀 · 地圖紀錄片", 1.2, 7),
        quote("要了滿洲就像得到一個東德或捷克一樣，*對蘇聯是一個大禮包*", V106, 8.2, 15.5)] }),
    beat({ dur: 15, bbox: [70, 25, 135, 58], year: "1953", yearSub: "至1957", chapNum: "一", chapText: "一百五十六項",
      layers: [...[[ll(41.8, 123.43), "瀋陽"], [ll(45.8, 126.53), "哈爾濱"], [ll(43.82, 125.32), "長春"], [ll(36.06, 103.83), "蘭州"], [ll(34.62, 112.45), "洛陽"], [ll(40.66, 109.84), "包頭"], [ll(30.59, 114.31), "武漢"]].flatMap(([p, n], i) => [
        arrow([MOS, p], RED, 0.6 + i * 0.7, 2, { width: 5, flow: false }), city(p, n, 2.2 + i * 0.7, { size: 26 })])],
      caps: [quote("一百五十多個大項目*對於蘇聯來說也是一個很沉重的負擔*。", V106, 1, 7),
        quote("五十年代是全國學習中長鐵路，就是滿鐵。\n五十年代的全國工業*都是在學習滿洲的工業*。", V058, 7.4, 14.5)] }),
    beat({ bbox: [110, 30, 142, 44], year: "1950年代", chapNum: "二", chapText: "瓦房店",
      layers: [arrow([ll(35.68, 139.69), WFD], C.sky, 0.6, 2, { label: "日本的技術", width: 8 }), city(WFD, "瓦房店", 2.4),
        arrow([WFD, ll(34.62, 112.45)], C.ochre, 3.4, 2, { label: "軸承", width: 7 }), arrow([WFD, ll(30.59, 114.31)], C.ochre, 4, 2, { width: 6 })],
      caps: [quote("*瓦房店來自於日本*，瓦房店輸出到全中國。", V058, 1, 6.8),
        quote("瓦房店學的實質就是，無論組織還是技術，\n在*遠離其發源地的地方*，動力就會削弱和退化。", "《劉仲敬訪談 005》", 7.2, 13.5)] }),
    beat({ bbox: [72, 18, 135, 53], year: "1950年代", chapNum: "三", chapText: "各自為政的地區",
      layers: [reg(P.innerMongolia, C.slate, "內蒙", 0.5), reg(P.xinjiang, "#7c8796", "新疆", 0.9), reg(P.manchuria, C.gold, "滿洲", 1.3, { alpha: 0.5 }),
        city(ll(40.84, 111.75), "呼和浩特", 1.6), city(ll(43.83, 87.62), "烏魯木齊", 2)],
      caps: [quote("蘇聯等於是*內亞征服者的繼承者*，它的特權部門都在內亞方向。", V106, 1, 13.5)] }),
    beat({ bbox: [100, 22, 124, 42], year: "1958", chapNum: "四", chapText: "反蘇的階級基礎",
      layers: [reg(P.eighteen, C.brick, "土鱉小幹部 + 舊士大夫", 0.6, { alpha: 0.4, labelSize: 30 })],
      caps: [quote("毛澤東是看到了這個*潛在的階級基礎*，才敢推行他的反蘇政策的。", V106, 1, 13.5)] }),
    beat({ bbox: [60, 25, 135, 58], year: "1960", chapNum: "五", chapText: "專家撤走",
      layers: [...[ll(41.8, 123.43), ll(34.62, 112.45), ll(36.06, 103.83), ll(40.66, 109.84)].map((p, i) => arrow([p, MOS], "#d9796f", 0.6 + i * 0.6, 2.2, { width: 5 }))],
      caps: [quote("你只需要研究一下滿洲的鐵路網是誰在經營，\n*如果蘇聯專家走了以後毛澤東有沒有能力經營*……", "《劉仲敬訪談 079》", 1, 13.5)] }),
    beat({ dur: 15, bbox: [98, 22, 124, 36], year: "1964", yearSub: "至1971 · 三線", chapNum: "六", chapText: "三線",
      layers: [reg(P.thirdFront, C.sand, "三線", 0.4, { alpha: 0.6 }), city(SH, "上海", 0.8), arrow([SH, ll(29.56, 106.55)], C.ochre, 1.2, 2.4, { width: 9, label: "工廠與人" }),
        arrow([SH, ll(26.58, 101.72)], C.ochre, 1.8, 2.6, { width: 7 }), city(ll(26.58, 101.72), "攀枝花", 3.6)],
      caps: [quote("上海教育體系培養出來的人大部分都被分散到全國各地，\n而上海的經濟變成*內地三線軍事軍工企業的一個服務性部門*。", "《劉仲敬訪談 083》", 1, 14.5, { opt: { size: 42 } })] }),
    beat({ dur: 15, bbox: [95, 12, 125, 42], year: "1966", yearSub: "至1969", chapNum: "七", chapText: "兩派的鬥爭",
      layers: [label(ll(36, 112), "蘇聯系", 0.6, { size: 40, color: "#f2b0a8" }), label(ll(30, 114), "梁山系", 1, { size: 40, color: "#f1d28c" }),
        arrow([ll(48, 85), ll(21.03, 105.85)], RED, 2, 3, { label: "蘇聯軍火改給越南", width: 8 }), city(ll(21.03, 105.85), "河內", 4.5)],
      caps: [quote("文革的本質是*蘇聯系人馬和梁山系人馬之間的鬥爭*。這時候，共產黨已經不再有蘇聯的武器支持，\n而蘇聯的武器支持給了越南", "《劉仲敬訪談 043》", 1, 8, { opt: { size: 40 } }),
        quote("他在反蘇的時候還必須借重葉劍英和周恩來的情報系統，\n而*情報系統和匪諜系統是最蘇聯系的*。", "《劉仲敬訪談 023》", 8.4, 14.5)] }),
    beat({ bbox: [10, 35, 140, 60], year: "1968", yearSub: "至1969", chapNum: "八", chapText: "布拉格與珍寶島",
      layers: [city(ll(50.08, 14.44), "布拉格 · 1968", 0.6), city(ll(46.49, 133.84), "珍寶島 · 1969", 2),
        ...[ll(49, 87), ll(47, 105), ll(45, 117), ll(48.5, 130)].map((p, i) => zone(p, "rgba(184,50,42,0.9)", 3, 3 + i * 0.4))],
      caps: [quote(`他已很清楚意識到捷克事件對自己可能產生的危險。這時必須做出馬基雅維利式的選擇，\n因為*只有美國才能平衡蘇聯*。`, T2, 1, 13.5, { opt: { size: 42 } })] }),
    beat({ dur: 17, cam: [[0, { lon: 165, lat: 35, zoom: 1.2 }], [17, { lon: 160, lat: 36, zoom: 1.3 }]], year: "1972", yearSub: "節點之三", chapNum: "九", chapText: "1972",
      layers: [arrow([ll(38.9, -77.04), ll(47, -125), ll(45, 175), BJ], BLUE, 1, 4, { label: "尼克松訪華", width: 12, arc: 0.06 }), reg(["CHN"], BLUE, null, 6, { alpha: 0.3 }),
        city(BJ, "北京", 5)],
      caps: [quote(`這個格局不是在1978 年，而是在*1972 年*，中美機會主義聯合已經確定了。`, T2, 1, 8),
        quote(`1972 年的戲劇性外交革命使此後的黨內鬥爭*不再有斯大林班底*`, T2, 8.4, 15.2),
        { style: "sub", text: "共和國 · 其二《大禮包與無底洞》", pos: "center", y: 540, t0: 15.3, t1: 17, wash: false }] }),
  ],
};
