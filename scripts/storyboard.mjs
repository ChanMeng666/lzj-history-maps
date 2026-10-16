// 從片子源碼生成 docs/STORYBOARD.md：每一幕的年份、章節、引文與出處。node scripts/storyboard.mjs
import fs from 'node:fs';
globalThis.S = (s) => s;
const ORDER = ['china1', 'china2', 'china3', 'china4', 'prc1', 'prc2', 'prc3', 'world1', 'world2', 'world3', 'world4'];
const SERIES = { china: 'This Land（這片土地）', prc: 'The Republic（共和國）', world: 'The World（世界）' };
const tm = JSON.parse(fs.readFileSync('audio/timing.json', 'utf8'));
let md = '# Storyboard\n\nGenerated from `web/films/*.js` by `scripts/storyboard.mjs`. Every on-screen quotation is listed with the source title shown on screen.\n';
let last = '';
for (const id of ORDER) {
  const film = (await import(`../web/films/${id}.js`)).default;
  const ser = id.replace(/\d+$/, '');
  if (ser !== last) { md += `\n## ${SERIES[ser]}\n`; last = ser; }
  md += `\n### ${id} · 《${film.title}》 — ${Math.round(tm[id].duration)} s\n\n| # | Year | Chapter | Quotation | Source |\n|---|---|---|---|---|\n`;
  film.scenes.forEach((sc, i) => {
    const chap = (sc.caps || []).find((c) => c.style === 'chapter');
    const qs = (sc.caps || []).filter((c) => c.style === 'quote');
    const cell = (s) => String(s ?? '').replace(/\*/g, '').replace(/\n/g, ' ').replace(/\|/g, '\|');
    const yr = [sc.year, sc.yearSub].filter(Boolean).join(' ');
    if (!qs.length) md += `| ${i + 1} | ${cell(yr)} | ${cell(chap && chap.num + ' ' + chap.text)} | | |\n`;
    qs.forEach((q, k) => { md += `| ${k ? '' : i + 1} | ${k ? '' : cell(yr)} | ${k ? '' : cell(chap && chap.num + ' ' + chap.text)} | ${cell(q.text)} | ${cell(q.src)} |\n`; });
  });
}
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/STORYBOARD.md', md);
console.log('wrote docs/STORYBOARD.md', md.length);
