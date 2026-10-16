"""從 Natural Earth（公有領域）建立地圖拓撲：
   countries / land / rivers / lakes（1:50m），省級 prov（中國各省 + 台灣 + 美國各州，1:10m），中國河流（1:10m）。
   python scripts/build_geo.py   （需要 mapshaper：npm i -g mapshaper）"""
import json, os, subprocess
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data'))
B = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
NEED = ['ne_50m_land', 'ne_50m_admin_0_countries', 'ne_50m_rivers_lake_centerlines', 'ne_50m_lakes',
        'ne_10m_admin_1_states_provinces', 'ne_10m_rivers_lake_centerlines']
os.makedirs('raw', exist_ok=True); os.makedirs('topo', exist_ok=True)
for n in NEED:
    if not os.path.exists(f'raw/{n}.geojson'):
        subprocess.run(['curl', '-sL', '-o', f'raw/{n}.geojson', B + n + '.geojson'], check=True)

d = json.load(open('raw/ne_10m_admin_1_states_provinces.geojson', encoding='utf-8'))
out = []
for f in d['features']:
    p = f['properties']
    if p['adm0_a3'] == 'CHN':
        out.append({'type': 'Feature', 'properties': {'id': 'CN:' + p['name'].replace(' ', '')}, 'geometry': f['geometry']})
    elif p['adm0_a3'] == 'TWN':
        out.append({'type': 'Feature', 'properties': {'id': 'CN:Taiwan'}, 'geometry': f['geometry']})
    elif p['adm0_a3'] == 'USA':
        out.append({'type': 'Feature', 'properties': {'id': 'US:' + p['name'].replace(' ', '')}, 'geometry': f['geometry']})
json.dump({'type': 'FeatureCollection', 'features': out}, open('raw/prov.geojson', 'w'))

c = json.load(open('raw/ne_50m_admin_0_countries.geojson', encoding='utf-8'))
for f in c['features']:
    p = f['properties']; f['properties'] = {'id': p['ADM0_A3'], 'name': p['NAME']}
json.dump(c, open('raw/countries.geojson', 'w'))

r = json.load(open('raw/ne_10m_rivers_lake_centerlines.geojson', encoding='utf-8'))
keep = []
for f in r['features']:
    g = f['geometry']
    if not g: continue
    cs = g['coordinates'] if g['type'] == 'MultiLineString' else [g['coordinates']]
    pts = [pt for l in cs for pt in l]
    if not pts: continue
    xs = [q[0] for q in pts]; ys = [q[1] for q in pts]
    if 68 < min(xs) and max(xs) < 145 and 15 < min(ys) and max(ys) < 56 and (f['properties'].get('scalerank') or 9) <= 6:
        keep.append({'type': 'Feature', 'properties': {}, 'geometry': g})
json.dump({'type': 'FeatureCollection', 'features': keep}, open('raw/cn_rivers.geojson', 'w'))

M = lambda *a: subprocess.run(['mapshaper', *a], check=True, shell=True)
M('raw/prov.geojson', '-dissolve', 'id', '-simplify', '12%', 'keep-shapes', '-o', 'topo/cn_prov.json', 'format=topojson', 'quantization=1e5')
M('raw/cn_rivers.geojson', '-simplify', '20%', '-o', 'topo/cn_rivers.json', 'format=topojson')
M('raw/countries.geojson', '-simplify', '25%', 'keep-shapes', '-o', 'topo/countries.json', 'format=topojson', 'quantization=1e5')
M('raw/ne_50m_land.geojson', '-simplify', '25%', 'keep-shapes', '-o', 'topo/land.json', 'format=topojson')
M('raw/ne_50m_rivers_lake_centerlines.geojson', '-filter-fields', 'name', '-simplify', '30%', '-o', 'topo/rivers.json', 'format=topojson')
M('raw/ne_50m_lakes.geojson', '-filter-fields', 'name', '-simplify', '30%', '-o', 'topo/lakes.json', 'format=topojson')
print('ok')
