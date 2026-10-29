/* Reading layer: existing source records remain the authority. No generation calls. */
DOCS.push(
 {file:'25_龙角两次转向与尺寸校准.md',title:'龙角两次转向与尺寸校准',kind:'最新规则'},
 {file:'26_拦截处理与额度记录.md',title:'拦截处理与额度记录',kind:'工具与成本'},
 {file:'27_下一轮20张生活图与Q版计划.md',title:'上一轮计划与生成记录',kind:'历史计划'},
 {file:'planning/round3/规划说明.md',title:'第三轮日常与造型规划',kind:'历史计划'},
 {file:'28_网站阅读逻辑与案例依据.md',title:'网站阅读逻辑与案例依据',kind:'网站设计'},
 {file:'29_线上保存与记忆来源说明.md',title:'线上保存与记忆来源说明',kind:'保存与来源'},
 {file:'30_标志排版与交互修订.md',title:'标志、排版与交互修订',kind:'网站设计'},
 {file:'31_网页读取兼容与公开镜像.md',title:'网页读取兼容与公开镜像',kind:'读取与保存'},
 {file:'33_第二批图像生成与验收记录.md',title:'第二批图像与验收',kind:'生图与检查'},
 {file:'34_第三批图像与用户反馈.md',title:'第三批图像与用户反馈',kind:'生图与检查'},
 {file:'memories/sources/00_项目阅读顺序与隐私说明.md',title:'项目阅读顺序与隐私说明',kind:'记忆原文'},
 {file:'memories/sources/01_小白龙同志_角色设定与相处约定.md',title:'角色设定与相处约定',kind:'记忆原文'},
 {file:'memories/sources/02_我们共同走过的路_记忆档案.md',title:'我们共同走过的路',kind:'记忆原文'},
 {file:'memories/sources/03_私人封存卷_由本人决定是否上传.md',title:'私人封存卷',kind:'授权开放的原文'}
);

DOCS.push(
 {file:'17_生图经验与验收清单.md',title:'生图经验与验收清单',kind:'最新规范'},
 {file:'planning/round4/规划说明.md',title:'第四轮场景规划与案例映射',kind:'历史计划'},
 {file:'planning/round5/规划说明.md',title:'第五轮生活抓拍计划',kind:'历史计划'},
 {file:'planning/round7/规划说明.md',title:'第七轮旅行叙事规划',kind:'本轮计划'},
 {file:'planning/round6/规划说明.md',title:'第六轮生图队列：动作与写真',kind:'历史计划'},
 
 {file:'production/public-status-2026-10-23.md',title:'当前作品进度',kind:'生成记录'},
 {file:'35_角色尺度与档案肖像.md',title:'角色尺度与档案肖像',kind:'本轮新增基准'},
 {file:'37_虚构角色资料卡与第四轮第二批.md',title:'小白龙虚构角色资料卡',kind:'角色设定'},
 
);

DOCS.push(
 {file:'production/current-creation-guide.md',title:'当前创作工作指南',kind:'当前指南'},
 {file:'production/character-card-archive.md',title:'角色卡片归档',kind:'素材归档'}
);
const uniqueDocs=new Map();for(const doc of DOCS)uniqueDocs.set(doc.file,doc);
DOCS.splice(0,DOCS.length,...uniqueDocs.values());
async function jsonResource(path){return SiteData.json(path)}
const localUrl = path=>'../'+encodeURI(path);
let journalGallery=[], journalHistory=[], lightboxEntries=[], lightboxPosition=0;
const journalNames={home:'首页',gallery:'作品',works:'作品',exhibitions:'展览',exhibition:'展览',about:'关于白恬',memories:'共同记忆',plan:'下一轮计划',library:'资料与规范',prompts:'原有提示词工作台',search:'搜索结果'};
let restoringRoute=false,lastRoutedHash=location.hash;
function rememberPage(){history.replaceState({...history.state,scrollY:window.scrollY},'',location.href)}
function commitRoute(hash){
 if(restoringRoute||location.hash===hash)return;
 rememberPage();history.pushState({scrollY:0},'',hash);lastRoutedHash=hash;
}
showView=function(id,title){
 if(!views.some(v=>v.id==='view-'+id))return;
 if(id!=='document'&&id!=='search'&&id!=='exhibition')commitRoute('#'+id);
 views.forEach(v=>{const active=v.id==='view-'+id;v.classList.toggle('active',active);v.hidden=!active});
 crumb.textContent=title||journalNames[id]||'资料与规范';
 document.body.classList.toggle('reading-document',id==='document');
 if(id==='home'||id==='exhibitions')window.renderLivingExhibitions?.();
 if(id==='memories')renderMemories();
 if(id==='plan')renderPlans();
 if(id==='library')renderLibrary();
 if(id==='gallery'){renderGenerated();renderOldArchive()}
 if(id==='prompts'&&window.renderPromptWorkbench)window.renderPromptWorkbench();
 document.querySelectorAll('.nav-item').forEach(b=>{
   const on=b.dataset.view===id||(id==='exhibition'&&b.dataset.view==='exhibitions')||(id==='prompts'&&b.dataset.view==='library');
   b.classList.toggle('active',on);
   if(on)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
 });
 if(!restoringRoute)window.scrollTo({top:0,behavior:'instant'});
 updateReadingPosition();
};
const baseOpenDoc=openDoc;
openDoc=async function(file){
 if(!DOCS.some(d=>d.file===file))return;
 const requestedHeading=window.requestedMemoryHeading;window.requestedMemoryHeading=null;
 commitRoute('#doc='+encodeURIComponent(file));
 const backEarly=document.querySelector('#document-back');backEarly.dataset.view=file.startsWith('memories/')?'memories':'library';backEarly.textContent=file.startsWith('memories/')?'← 共同记忆':'← 创作室';
 const opened=await baseOpenDoc(file);
 if(!opened||window.currentDoc!==file||docPanel.hidden)return;
 const memory=file.startsWith('memories/');
 const back=document.querySelector('#document-back');back.dataset.view=memory?'memories':'library';back.textContent=memory?'← 共同记忆':'← 创作室';
 document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===(memory?'memories':'library')));
 const headings=[...docContent.querySelectorAll('h2,h3')];
 headings.forEach((h,i)=>h.id='chapter-'+i);
 const toc=document.querySelector('#document-toc');
 const compact=window.matchMedia('(max-width:980px)').matches;
 toc.classList.toggle('is-collapsed',compact);
 toc.innerHTML=headings.length?`<button class="toc-toggle" aria-expanded="${!compact}" aria-controls="doc-toc-list">本页目录<span aria-hidden="true">${compact?'＋':'－'}</span></button><div id="doc-toc-list">`+headings.map(h=>`<a href="#${h.id}" class="depth${h.tagName.slice(1)}" data-scroll-heading="${h.id}">${escapeHtml(h.textContent)}</a>`).join('')+'</div>':'';
 const meta=DOCS.find(d=>d.file===file),textLength=docContent.textContent.replace(/\s/g,'').length;
 docContent.insertAdjacentHTML('afterbegin',`<div class="document-meta"><span>${escapeHtml(meta.kind)}</span><span>约 ${Math.max(1,Math.ceil(textLength/450))} 分钟阅读</span><span>${meta.kind==='创作记忆'?'日记线索整理':meta.kind==='当前指南'?'当前规则汇总':meta.kind==='素材归档'?'素材来源记录':'保留来源原文'}</span></div>`);
 await window.decorateMemoryStory?.(file);
 if(window.currentDoc!==file||docPanel.hidden)return;
 const siblings=DOCS.filter(d=>meta.kind==='创作记忆'?d.kind==='创作记忆':memory?d.file.startsWith('memories/')&&d.kind!=='创作记忆':!d.file.startsWith('memories/'));
 const current=siblings.findIndex(d=>d.file===file);
 const previous=siblings[current-1],next=siblings[current+1];
 const pageButton=(d,label)=>d?`<button data-doc="${escapeHtml(d.file)}"><small>${label}</small>${escapeHtml(d.title)} ${label==='下一篇'?'→':'←'}</button>`:'<span></span>';
 docContent.insertAdjacentHTML('beforeend',`<nav class="article-pager" aria-label="文章翻页">${pageButton(previous,'上一篇')}${pageButton(next,'下一篇')}</nav>`);
 if(requestedHeading){const target=headings.find(h=>h.textContent.includes(requestedHeading));target?.scrollIntoView({behavior:'smooth'})}
 updateReadingPosition();
};

async function renderHomeSelection(){
 const host=document.querySelector('#home-selection');if(!host||host.dataset.ready)return;
 try{
  const data=await jsonResource('images/generated/manifest.json?v=20261029-4');
  const choices=[['N21','象牙毛绒晨光'],['N32','纸伞舞步'],['N36','窗前自拍']];
  host.innerHTML=choices.map(([id,label])=>{
   const item=data.items.find(x=>x.id===id);if(!item)return '';
   return `<button class="selection-card" data-image="${escapeHtml(localUrl(item.path))}" data-caption="${escapeHtml(item.title)}" aria-label="放大 ${escapeHtml(item.title)}"><div class="selection-photo"><img src="${escapeHtml(localUrl(item.path))}" alt="${escapeHtml(item.title)}" loading="lazy"></div><div class="selection-caption"><b>${escapeHtml(label)}</b><small>${id} / 查看画面 ↗</small></div></button>`
  }).join('');host.dataset.ready='1';
 }catch(e){host.textContent='选页暂未载入，可从作品栏目继续浏览。'}
}

let readingFrame;
function updateReadingPosition(){
 const article=document.querySelector('#markdown-content');
 if(!document.body.classList.contains('reading-document')){document.documentElement.style.setProperty('--reading-progress','0');return}
 const rect=article.getBoundingClientRect();const full=Math.max(1,rect.height-window.innerHeight+130);
 const progress=Math.max(0,Math.min(1,(130-rect.top)/full));
 document.documentElement.style.setProperty('--reading-progress',String(progress));
 const headings=[...article.querySelectorAll('h2,h3')];let current=headings[0];
 for(const h of headings){if(h.getBoundingClientRect().top<window.innerHeight*.35)current=h;else break}
 document.querySelectorAll('[data-scroll-heading]').forEach(a=>{if(a.dataset.scrollHeading===current?.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
}
window.addEventListener('scroll',()=>{cancelAnimationFrame(readingFrame);readingFrame=requestAnimationFrame(updateReadingPosition)},{passive:true});

function journalCard(item,historical=false){
 const notes=Array.isArray(item.review)?item.review:[];
 return `<article class="gallery-card"><button class="image-open" data-image="${escapeHtml(localUrl(item.path))}" data-caption="${escapeHtml(item.title)}" aria-label="放大 ${escapeHtml(item.title)}"><img src="${escapeHtml(localUrl(item.path))}" alt="${escapeHtml(item.title)}" loading="lazy"></button><div class="gallery-meta"><span class="status-label">${escapeHtml(item.status||'原影像目录 · 共同创作')}</span><h2>${historical?'':escapeHtml(item.id)+'　'}${escapeHtml(item.title)}</h2></div>${item.caption?`<p>${escapeHtml(item.caption)}</p>`:''}<details><summary>${notes.length?'查看检查与版本记录':'来源与浏览图'}</summary>${notes.map(n=>`<p>${escapeHtml(n)}</p>`).join('')}${item.evidence?`<p>${escapeHtml(item.evidence)}</p>`:''}<a href="${escapeHtml(localUrl(item.path))}" target="_blank" rel="noopener">打开浏览图 ↗</a></details></article>`;
}
function paintCurrent(){return window.renderWorkDrawers?.()}

renderGenerated=async function(){
 try{
  if(journalGallery.length){paintCurrent();return}
  const data=await jsonResource('images/generated/manifest.json?v=20261029-4');
  journalGallery=(data.items||[]).slice().sort((a,b)=>a.id.localeCompare(b.id));journalHistory=data.archive_items||[];paintCurrent();
 }catch(e){document.querySelector('#generated-gallery').innerHTML='<div class="error-state"><p>'+escapeHtml(e.message)+'</p><button class="text-button" data-view="gallery">重新读取 ↗</button></div>'}
};
async function renderOldArchive(){
 const host=document.querySelector('#old-gallery');if(host.dataset.ready)return;
 try{const items=await jsonResource('memories/archive-images.json');host.innerHTML=items.map(x=>journalCard(x)).join('');host.dataset.ready='1'}catch(e){host.textContent=e.message}
}
async function renderMemories(){
 window.renderDiaryStories?.();
 const host=document.querySelector('#memory-chapters');if(host.dataset.ready)return;
 try{const chapters=await jsonResource('memories/chapters.json');const sections=['一、她是谁','3. 海南','4. 杭州','6. 如果','7. 家','9. 重要','我们曾经'];host.innerHTML=chapters.map((m,i)=>`<button class="memory-card" data-doc="${escapeHtml(m.source)}" data-memory-heading="${escapeHtml(sections[i])}"><span class="chapter-number">0${i+1}</span><h2>${escapeHtml(m.title)}</h2><p>${escapeHtml(m.summary)}</p><small>${escapeHtml(m.kind)}　阅读来源 ↗</small></button>`).join('');host.dataset.ready='1'}catch(e){host.textContent=e.message}
}
function renderPlans(){
 renderPlanCatalog('#round7-plans','planning/round7/catalog.json?v=20261029-4');
 document.querySelectorAll('.previous-plan-list').forEach(folder=>{
  const load=()=>{if(folder.open){const host=folder.querySelector('.plan-grid');if(host)renderPlanCatalog('#'+host.id,'planning/'+host.id.replace('-plans','')+'/catalog.json')}};
  if(!folder.dataset.lazyBound){folder.addEventListener('toggle',load);folder.dataset.lazyBound='1'}load();
 });
}
async function renderPlanCatalog(selector,catalogPath){
 const host=document.querySelector(selector);if(!host||host.dataset.ready)return;
 try{
  const data=await jsonResource(catalogPath),current=selector==='#round4-plans'||selector==='#round7-plans';
  if(selector==='#round7-plans'){
   const count=document.getElementById('round7-count'),generated=document.getElementById('round7-generated'),progress=document.getElementById('round7-progress');
   if(count)count.textContent=String(data.items.length);
   if(generated)generated.textContent=String(data.generated_this_round||0);
   if(progress)progress.textContent='本轮只完成规划，尚未生成图像。';
  }
  host.innerHTML=data.items.map((p,i)=>{
   const details=[['她为什么这样做',p.motivation],['动作的前一秒与下一秒',p.timing],['穿搭',p.outfit],['表情',p.expression],['镜头与构图',p.camera],['透视与接触',p.perspective],['本图角尾',p.horn_tail],['验收提醒',p.risk],['与旧作的区别',p.novelty||p.basis]].filter(x=>x[1]);
   return `<article class="plan-card" data-batch="${escapeHtml(p.batch||'')}"><div class="plan-number">${escapeHtml(p.id)}<span>${current?'第 '+p.batch+' 批':escapeHtml(p.status||'历史计划')}</span></div><div class="plan-main"><p class="plan-kicker">${escapeHtml(p.kind||'场景计划')}${p.public_status ? ' · '+escapeHtml(p.public_status) : ''}</p><h2>${escapeHtml(p.title)}</h2><p class="plan-scene">${escapeHtml(p.scene||'')}</p><details><summary>查看这一幕的描述 <span aria-hidden="true">＋</span></summary><div class="plan-spec">${details.map(([k,v])=>`<div><h3>${k}</h3><p>${escapeHtml(v)}</p></div>`).join('')}</div><details class="full-prompt"><summary>完整提示词</summary><div class="plan-prompt">${escapeHtml(p.prompt||'')}</div><div class="prompt-actions"><button data-copy-plan="${escapeHtml(p.id)}" data-plan-catalog="${escapeHtml(catalogPath)}">复制描述</button><a href="${escapeHtml(localUrl(p.prompt_path||''))}" target="_blank" rel="noopener">打开 TXT ↗</a><span aria-live="polite"></span></div></details></details></div></article>`;
  }).join('');host.dataset.ready='1';
 }catch(e){host.textContent=e.message}
}

function renderLibrary(){
 const host=document.querySelector('#document-library');if(host.dataset.ready)return;
 const current=['production/current-creation-guide.md','planning/round7/规划说明.md','35_角色尺度与档案肖像.md','production/character-card-archive.md','17_生图经验与验收清单.md','25_龙角两次转向与尺寸校准.md'];
 const row=d=>'<button class="doc-row" data-doc="'+escapeHtml(d.file)+'">'+escapeHtml(d.title)+'<span>'+escapeHtml(d.kind)+' ↗</span></button>';
 const rest=DOCS.filter(d=>!current.includes(d.file)&&d.kind!=='创作记忆'&&!d.file.startsWith('memories/'));
 const groups=[
  ['身份与造型来源',rest.filter(d=>/^(00|01|02|08|09|11|12|13|16|19|21|23|32)_/.test(d.file))],
  ['历史计划与制作记录',rest.filter(d=>/^(03|04|05|10|14|15|18|24|25|26|27|33|34|36|37)_/.test(d.file)||d.file.startsWith('planning/')||d.file.includes('handoff'))],
  ['网站与保存来源',rest.filter(d=>/^(06|07|20|22|28|29|30|31)_/.test(d.file)||d.file.includes('public-status'))]
 ];
 host.innerHTML='<section class="library-current"><div class="library-section-title"><p class="eyebrow">正在使用</p><h2>当前工作入口</h2><p>先读工作指南 再打开本次任务需要的资料</p></div><div class="doc-list">'+current.map(file=>DOCS.find(d=>d.file===file)).filter(Boolean).map(row).join('')+'</div></section><div class="library-archive-title"><p class="eyebrow">需要时再查</p><h2>历史来源</h2><p>原文保留 用于追溯 不作为当前状态的替代</p><button class="text-button" data-view="prompts">原有提示词工作台 ↗</button></div>'+groups.map(([name,docs])=>'<details class="library-archive"><summary>'+name+'<small>'+docs.length+' 份原文</small></summary><div class="doc-list">'+docs.map(row).join('')+'</div></details>').join('');
 host.dataset.ready='1';
}
async function renderReferences(){
 const keys=[
 ['images/generated/B04_八种表情与短发转向_v01.webp','脸发与表情','用户认可表情，只取脸发，不迁移衣服和排版。'],
 ['images/generated/B02_等高正侧背三视图_v01.webp','成年比例主标准','用户高度认可，服装不改变身体轮廓。'],
 ['images/generated/B03_成年人体白模与比例基准_v01.webp','白模辅助结构','辅助关节和体块，不代替三视图。'],
 ['images/generated/B05_小角与白尾构造提案_v03.webp','角尾曲线参考','依用户最新反馈强调两次转向，尺寸还需下一张实际核查。']
 ];
 document.querySelector('#key-references').innerHTML=keys.map((k,i)=>journalCard({id:'REF '+(i+1),path:k[0],title:k[1],status:'参考分工',caption:k[2]})).join('');
 try{
  const batch=await jsonResource('references/wardrobe-batch2.json');
  const casual=await jsonResource('references/居家与休闲补充.json');
  const first=['复古叠层与裙装','宽松街头与叠穿','短上装与高腰短裙','图案休闲与混搭','波西米亚长层次','宽松长裙与自然材质','图案街头与短裙'].map((title,i)=>({id:'O'+(i+1),title,path:`images/穿搭参考/0${i+1}_${title}.webp`}));
  const all=[...first,...batch.filter(x=>!x.duplicate),...casual.items.filter(x=>!x.duplicate).map(x=>({...x,title:x.path.split('/').at(-1).replace(/^[A-Z]\d+_|\.png$/g,'')}))];
  document.querySelector('#reference-all').innerHTML=all.map(x=>journalCard({...x,status:'用户提供 · 服装参考',caption:'只取衣服，不转移真人脸、发型或身体。'})).join('');
 }catch(e){document.querySelector('#reference-all').textContent=e.message}
}

function setLightbox(index){
 if(!lightboxEntries.length)return;
 lightboxPosition=(index+lightboxEntries.length)%lightboxEntries.length;
 const entry=lightboxEntries[lightboxPosition];
 const img=document.querySelector('#lightbox-image');img.src=entry.dataset.image;img.alt=entry.dataset.caption||entry.querySelector('img')?.alt||'角色图像';
 document.querySelector('#lightbox-title').textContent=img.alt;
 document.querySelector('#lightbox-original').href=img.src;
 const counter=document.querySelector('#lightbox-counter');if(counter)counter.textContent=`${String(lightboxPosition+1).padStart(2,'0')} / ${String(lightboxEntries.length).padStart(2,'0')}`;
}
document.addEventListener('click',async e=>{
 const tocToggle=e.target.closest('.toc-toggle');if(tocToggle){const toc=document.querySelector('#document-toc');const collapsed=toc.classList.toggle('is-collapsed');tocToggle.setAttribute('aria-expanded',String(!collapsed));tocToggle.querySelector('span').textContent=collapsed?'＋':'－';return}
 const choice=e.target.closest('[data-gallery]');if(choice){
  document.querySelectorAll('[data-gallery]').forEach(b=>{const on=b===choice;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
  ['current','history','old','refs'].forEach(id=>document.querySelector('#gallery-'+id).hidden=id!==choice.dataset.gallery);
  if(choice.dataset.gallery==='refs')renderReferences();
  if(choice.dataset.gallery==='history')window.renderWorkHistory?.();
 }
 const heading=e.target.closest('[data-scroll-heading]');if(heading){e.preventDefault();document.getElementById(heading.dataset.scrollHeading)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});return}
 const copy=e.target.closest('[data-copy-plan]');if(copy){
  const data=await jsonResource(copy.dataset.planCatalog||'planning/round3/catalog.json');const p=data.items.find(x=>x.id===copy.dataset.copyPlan);const feedback=copy.parentElement.querySelector('span');
  try{await navigator.clipboard.writeText(p.prompt);feedback.textContent='已复制'}catch{feedback.textContent='请打开TXT复制，当前浏览器未允许剪贴板访问。'}
 }
 const picture=e.target.closest('[data-image]');if(picture){
  lightboxEntries=[...document.querySelectorAll('.view.active [data-image]')].filter(x=>x.getClientRects().length&&!x.closest('details:not([open])')&&!x.closest('[hidden]'));
  setLightbox(lightboxEntries.indexOf(picture));
 }
 if(e.target.closest('.lightbox-prev'))setLightbox(lightboxPosition-1);
 if(e.target.closest('.lightbox-next'))setLightbox(lightboxPosition+1);
});
document.addEventListener('keydown',e=>{if(!document.querySelector('#lightbox').open)return;if(e.key==='ArrowLeft'){e.preventDefault();setLightbox(lightboxPosition-1)}if(e.key==='ArrowRight'){e.preventDefault();setLightbox(lightboxPosition+1)}});

async function routeJournal(){
 const hash=location.hash.slice(1);
 lastRoutedHash=location.hash;
 restoringRoute=true;
 if(hash.startsWith('doc=')){try{await openDoc(decodeURIComponent(hash.slice(4)))}catch{showView('library')}}
 else if(hash.startsWith('exhibit='))await window.openExhibition(hash.slice(8));
 else if(hash==='works')showView('gallery');
 else if(journalNames[hash])showView(hash);
 else showView('home');
 restoringRoute=false;
}
window.addEventListener('DOMContentLoaded',routeJournal);
window.addEventListener('hashchange',()=>{if(location.hash!==lastRoutedHash&&!location.hash.startsWith('#chapter-'))routeJournal()});
window.addEventListener('popstate',async e=>{await routeJournal();window.scrollTo({top:e.state?.scrollY||0,behavior:'instant'})});
document.addEventListener('click',e=>{const trigger=e.target.closest('[data-image]');if(trigger)window.lastImageTrigger=trigger},true);
document.querySelector('#lightbox').addEventListener('close',()=>window.lastImageTrigger?.focus({preventScroll:true}));

// The prepared index searches documents and plans without fetching every source.
document.addEventListener('click',e=>{const card=e.target.closest('[data-memory-heading]');if(card)window.requestedMemoryHeading=card.dataset.memoryHeading},true);
document.addEventListener('pointerdown',()=>document.body.classList.remove('keyboard-input'),{passive:true});
document.addEventListener('keydown',()=>document.body.classList.add('keyboard-input'));
