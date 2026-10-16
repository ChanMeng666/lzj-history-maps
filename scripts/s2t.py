"""把片子裏 S("簡體原文") 標記的引語轉成繁體（OpenCC s2tw；只改字形與標點，不改字詞），就地改寫。
   python scripts/s2t.py web/films/*.js"""
import re, sys, opencc
cc = opencc.OpenCC('s2tw')
PUNCT = {',': '，', ';': '；', '?': '？', '(': '（', ')': '）', ':': '：', '!': '！'}


def conv(m):
    t = cc.convert(m.group(2))
    t = ''.join(PUNCT.get(ch, ch) for ch in t)
    return m.group(1) + t + m.group(1)


for p in sys.argv[1:]:
    s = open(p, encoding='utf-8').read()
    n = len(re.findall(r'S\((["\'`])', s))
    s2 = re.sub(r'S\((["\'`])(.*?)\1\)', conv, s)
    open(p, 'w', encoding='utf-8').write(s2)
    print(p, n, 'converted')
