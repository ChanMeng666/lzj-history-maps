import { C } from '../lib/map.js';
export default {
  scenes: [
    { dur: 8, cam: [[0, { lon: 60, lat: 25, zoom: 1 }], [7, { lon: 112, lat: 33, zoom: 2.6 }]], year: '1949',
      layers: [
        { type: 'regions', ids: ['CN:Zhejiang', 'CN:Jiangsu', 'CN:Shanghai'], color: C.teal, t0: 3, label: '吳越', reveal: 'grow' },
        { type: 'regions', ids: ['CN:Sichuan', 'CN:Chongqing'], color: C.ochre, t0: 4, label: '巴蜀' },
        { type: 'arrow', path: [[37.6, 55.7], [87.6, 43.8], [116.4, 39.9]], color: C.verm, t0: 2, dur: 3, label: '蘇聯秩序', width: 10 },
        { type: 'city', at: [116.4, 39.9], name: '北平', t0: 5 },
        { type: 'stream', from: [-74, 40.7], to: [121.5, 31.2], color: '#f0d27a', t0: 5, n: 60 },
      ],
      caps: [{ t0: 1, t1: 7.5, style: 'chapter', num: '一', text: '測試' }, { t0: 3, t1: 7.5, style: 'quote', text: '改革開放是*美國秩序的輸入*', src: '訪談 106', pos: 'bottom', y: 960 }] },
  ],
};
