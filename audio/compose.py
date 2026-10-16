"""地圖紀錄片的配樂：按場景邊界作曲，全部用真實樂器採樣。
   python audio/compose.py china1 | all
每個系列一套調性與配器；每個場景一種織體，旋律由音階步進生成並落在和弦音上，章節交界處有輕擊。"""
import os, sys, json
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, 'lib'))
from score import Score
from arrange import section, melody, bells

NOTE = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}
NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
nm = lambda m: f"{NAMES[m % 12]}{m // 12 - 1}"

MINOR = [0, 2, 3, 5, 7, 8, 10]
MAJOR = [0, 2, 4, 5, 7, 9, 11]
PENTA_M = [0, 3, 5, 7, 10]
PENTA = [0, 2, 4, 7, 9]

SERIES = {
    'china': dict(key='D', mode=MINOR, scale=PENTA_M, prog=[1, 6, 7, 4, 1, 3, 7, 5],
                  styles=['zither', 'pad', 'harp', 'darkpad', 'zither', 'folk', 'pad', 'harp', 'zither', 'darkpad', 'pad', 'harp'],
                  lead=['erhu', 'dan_tranh', 'flute', 'erhu', 'cellos', 'erhu', 'flute', 'violin']),
    'prc': dict(key='A', mode=MINOR, scale=MINOR, prog=[1, 6, 4, 5, 1, 7, 6, 5],
                styles=['darkpad', 'pizz', 'march', 'trem', 'darkpad', 'chorale', 'march', 'pad', 'trem', 'brass', 'darkpad', 'pad'],
                lead=['cellos', 'horn', 'violin', 'trumpet', 'cellos', 'oboe', 'horn', 'violin']),
    'world': dict(key='D', mode=MAJOR, scale=PENTA, prog=[1, 5, 6, 4, 1, 4, 5, 1],
                  styles=['pad', 'harp', 'brass', 'arp_piano', 'pad', 'folk', 'harp', 'brass', 'pad', 'arp_piano', 'trem', 'brass'],
                  lead=['horn', 'flute', 'violin', 'oboe', 'horn', 'clarinet', 'violins', 'flute']),
}


def triad(root_pc, mode, deg):
    """deg: 1..7 → (bass, [三個和弦音])"""
    i = deg - 1
    pcs = [(root_pc + mode[(i + k) % 7] + 12 * ((i + k) // 7)) for k in (0, 2, 4)]
    bass = 36 + (pcs[0] % 12)
    if bass > 45: bass -= 12
    tones = [48 + (p - pcs[0] % 12 + (pcs[0] % 12)) % 24 for p in pcs]
    tones = sorted(set(52 + ((p - 52) % 12) for p in pcs))
    return nm(bass), [nm(t) for t in tones]


def gen_melody(s, t0, dur, inst, root_pc, scale, chords, rng, vel=.45):
    """在 [t0, t0+dur) 內寫旋律：音階步進，每小節頭落在和弦音"""
    pool = [m for m in range(60, 86) if (m - root_pc) % 12 in scale]
    lo, hi = (55, 74) if inst in ('cellos', 'horn', 'erhu') else (62, 84)
    pool = [m for m in pool if lo <= m <= hi] or pool
    cur = pool[len(pool) // 2]
    t = t0 + 0.5
    rhythms = [[2, 1, 1], [1, 1, 2], [1.5, .5, 2], [1, .5, .5, 2], [3, 1], [2, 2]]
    bar = 0
    while t < t0 + dur - 1.2:
        chord = chords[bar % len(chords)]
        ctones = [NOTE[c[:-1]] for c in chord[1]]
        for k, b in enumerate(rhythms[int(rng.integers(len(rhythms)))]):
            if t >= t0 + dur - 1.0:
                break
            if k == 0:
                cand = [m for m in pool if m % 12 in ctones] or pool
                cur = min(cand, key=lambda m: abs(m - cur) + rng.random() * 3)
            else:
                i = pool.index(min(pool, key=lambda m: abs(m - cur)))
                i = int(np.clip(i + rng.choice([-2, -1, -1, 1, 1, 2]), 0, len(pool) - 1))
                cur = pool[i]
            if rng.random() > 0.12:
                s.n(t, inst, nm(cur), b * 1.05, vel * (1.1 if k == 0 else 0.95), 0.15)
            t += b
        bar += 1


def compose(film, timing):
    series = 'china' if film.startswith('china') else 'prc' if film.startswith('prc') else 'world'
    cfg = SERIES[series]
    rng = np.random.default_rng(abs(hash(film)) % (2 ** 31))
    s = Score(int(rng.integers(1 << 30)))
    root_pc = NOTE[cfg['key']]
    T = timing['duration']
    scenes = timing['scenes']
    for i, sc in enumerate(scenes):
        t0, dur = sc['start'], sc['dur']
        end = min(T, t0 + dur - (sc['trans'] if i < len(scenes) - 1 else 0))
        length = end - t0
        # 和弦：每 4 秒換一個，從系列進行中按場景位移取
        nb = max(1, int(round(length / 4)))
        beats = length / nb
        degs = [cfg['prog'][(i * 3 + k) % len(cfg['prog'])] for k in range(nb)]
        chords = [(beats, *triad(root_pc, cfg['mode'], d)) for d in degs]
        if i == len(scenes) - 1:
            chords[-1] = (chords[-1][0], *triad(root_pc, cfg['mode'], 1))
        style = cfg['styles'][i % len(cfg['styles'])] if i else 'pad'
        section(s, t0, chords, style, .45)
        if style not in ('pad', 'darkpad', 'organ'):
            section(s, t0, chords, 'pad', .28)
        # 旋律（片頭留白給標題）
        lead = cfg['lead'][i % len(cfg['lead'])]
        ms = t0 + (6.5 if i == 0 else 1.0)
        gen_melody(s, ms, end - ms, lead, root_pc, cfg['scale'], [(c[1], c[2]) for c in chords], rng, vel=.42)
        # 章節交界的輕擊
        if i:
            s.hit(t0 + 0.4, 'timpani', 'drum1' if series != 'world' else 'drum2', .45)
            if series == 'china':
                s.n(t0 + 0.4, 'tubular_bells', nm(60 + root_pc), 3, .22, -.2)
    # 結尾和弦
    b, n = triad(root_pc, cfg['mode'], 1)
    s.chord(T - 5, 'piano', [b] + n, 4.5, .35, strum=.1)
    s.n(T - 5, 'tubular_bells', nm(72 + root_pc), 4, .25)
    s.render(T, name=film)


if __name__ == '__main__':
    tm = json.load(open(os.path.join(HERE, 'timing.json'), encoding='utf-8'))
    w = sys.argv[1] if len(sys.argv) > 1 else 'all'
    for f in (sorted(tm) if w == 'all' else [w]):
        compose(f, tm[f])
