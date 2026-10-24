"""Build current reading cache and one search index from already-public files only."""
from pathlib import Path
import json,re
R=Path(__file__).resolve().parents[1]
D=R
items={}
for js in ['app.js','journal.js']:
    for file,title,kind in re.findall(r"file:'([^']+)',title:'([^']+)',kind:'([^']+)'",(D/'site'/js).read_text()):
        if (D/file).is_file():items[file]={'file':file,'title':title,'kind':kind}
for i,title in enumerate(['白恬这个名字','动作还没结束','旧物店里的慢下午','路上还有下一页'],1):
    file=f'memories/stories/{i:02}_{title}.md'
    items[file]={'file':file,'title':title,'kind':'创作记忆'}
plain=lambda md:re.sub(r'\s+',' ',re.sub(r'[#>*`|]',' ',md)).strip()
search=[]
for file,meta in items.items():
    # Old authorized memory sources remain separately readable without replicating their bodies into search assets.
    body='' if file.startswith('memories/sources/') else plain((D/file).read_text())
    search.append({**meta,'text':body})
for roundname in ['round2','round3','round4','round5','round6']:
    p=D/'planning'/roundname/'catalog.json'
    if not p.exists():continue
    for x in json.loads(p.read_text())['items']:
        search.append({'title':x.get('id','')+' '+x.get('title',''),'kind':'场景计划','view':'plan','text':' '.join(str(x.get(k,'')) for k in ['scene','outfit','expression','camera','novelty'])})
p=D/'memories/archive-images.json'
if p.exists():
    for x in json.loads(p.read_text()):search.append({'title':x.get('id','')+' '+x.get('title',''),'kind':'旧影像','view':'gallery','text':x.get('caption','')})
critical=['production/current-creation-guide.md','production/character-card-archive.md','planning/round6/规划说明.md','00_角色主设定卡.md','17_生图经验与验收清单.md','25_龙角两次转向与尺寸校准.md','35_角色尺度与档案肖像.md']+[k for k in items if k.startswith('memories/stories/')]
bundle={f:(D/f).read_text() for f in critical if (D/f).exists()}
index=json.dumps({'version':'064','items':search},ensure_ascii=False,separators=(',',':'))+'\n'
cache='window.XBL_BUNDLED_DOCS='+json.dumps(bundle,ensure_ascii=False,separators=(',',':'))+';\n'
for base in [D/'site']:
    (base/'assets/search-index-v064.json').write_text(index)
    (base/'content-cache-v064.js').write_text(cache)
    page=base/'index.html'
    html=page.read_text().replace('  <script src="./content-cache-v064.js" defer></script>\n','').replace('./app.js?v=064"','./app.js?v=064-2"')
    block='<script id="content-cache" type="application/json">'+json.dumps(bundle,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+'</script>'
    if '<script id="content-cache"' in html:
        html=re.sub(r'<script id="content-cache" type="application/json">.*?</script>',lambda _:block,html,flags=re.S)
    else:
        html=html.replace('  <script src="./data-loader.js', '  '+block+'\n  <script src="./data-loader.js',1)
    page.write_text(html)
print(json.dumps({'search_entries':len(search),'unique_docs':len(items),'bundled_docs':len(bundle),'cache_bytes':len(cache.encode()),'search_bytes':len(index.encode())},ensure_ascii=False))
