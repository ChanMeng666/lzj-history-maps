// 輸出每部片的場景起點、時長（供配樂對齊）：node scripts/timing.mjs > audio/timing.json
import fs from 'node:fs';
const out = {};
globalThis.S = (s) => s;
for (const f of fs.readdirSync('web/films').filter((x) => x.endsWith('.js') && x !== 'test.js')) {
  const film = (await import('../web/films/' + f)).default;
  let s = 0; const scenes = [];
  film.scenes.forEach((sc, i) => { scenes.push({ start: +s.toFixed(3), dur: sc.dur, trans: sc.trans ?? 1.2, year: sc.year ?? '' }); s += sc.dur - (i < film.scenes.length - 1 ? (sc.trans ?? 1.2) : 0); });
  out[f.replace('.js', '')] = { duration: +s.toFixed(3), scenes };
}
console.log(JSON.stringify(out, null, 1));
