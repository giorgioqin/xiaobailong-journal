/* Dedicated exhibition layer  Existing work metadata remains authoritative */
const LIVING_EXHIBITIONS=[
 {slug:'sea-and-kite',number:'03',title:'海风与一只小白龙风筝',subtitle:'从海边合照 到亲手做风筝 再跑向草地',description:'先在海边留下两个人的笑\n再用竹条和纸做一只小白龙\n最后让它跟着风飞起来',ascii:'~  ~    /\\ /\\    ~  ~',ids:['N100','N101','N101A','N102','N103',...Array.from({length:17},(_,i)=>'N'+(104+i))],notes:[],chapters:{N100:'01 / 海边 · 一起留下的照片',N104:'02 / 工坊 · 把想法做出来',N116:'03 / 草地 · 让它飞起来'}},
 {slug:'on-the-road',number:'04',title:'路上慢慢走',subtitle:'十二张旅行影像 连成一段路',description:'从启程到回程\n一路有风景 有回望 也有随手留下的笑\n十二个瞬间 连成这段旅行',ascii:' .  .   /\\ /\\   .  .',ids:Array.from({length:12},(_,i)=>'N'+(88+i)),notes:[]},
 {slug:'wind',number:'01',title:'风经过的时候',subtitle:'从一次回望到一个没停下来的动作',description:'上坡的笑意 桥上的招呼 还有被风翻动的一页纸\n把那些还没结束的动作连在一起\n画面之外也像有下一步',asset:'exhibition-wind-v01.webp',ids:['N64','N70','N45','N69','N72','N73','N36'],notes:['跑上坡时 笑意比脚步更快','桥上的招呼 大得像要拥抱风','秋河边的歇脚也有好心情','转身的脚步和追上来的裙摆','扶着栏杆回头 碰巧撞上镜头','窗边还有没写完的一页','日常也值得留下一张']},
 {slug:'wardrobe',number:'02',title:'她选择的造型',subtitle:'换一件衣服 也换一种心情',description:'有时候轻快 有时候郑重\n从晨光里的柔软到纸伞下的舞步\n衣服与动作一起说话',asset:'exhibition-wardrobe-v01.webp',ids:['N21','N26','N27','N32','N33','N34'],notes:['柔软的白色与回身的一眼','黑猫系旗袍配上一点暗红唇色','圣诞的红丝绒与柔软毛绒边','伞与脚步一起转动','庭院里披起一段柔软的布料','浅蓝牛仔和全身镜前的一刻']}
];
const brandAsset=name=>'./assets/living-code/'+name;
function coverVisual(ex){return ex.ascii?`<div class="cover-ascii" aria-hidden="true"><span class="ascii-label">FIELD NOTES / ${ex.number}</span><pre>${ex.ascii}
   .  .  .  .  .
~ ~ ~ ~ ~ ~ ~ ~ ~</pre><span class="ascii-footer">XIAO BAI LONG　+　JOURNEY</span></div>`:`<img src="${brandAsset(ex.asset)}" alt="" width="1024" height="1024" loading="lazy">`}
function exhibitionCover(ex){
 const count=ex.ids.length;
 return `<button class="exhibition-cover" data-exhibit="${ex.slug}" aria-label="走进${ex.title}"><div class="cover-art"><span class="cover-number">${ex.number}</span>${coverVisual(ex)}</div><div class="cover-caption"><h3>${ex.title}</h3><p>${ex.subtitle}</p><small>${count} 件作品</small><span class="cover-arrow" aria-hidden="true">↗</span></div></button>`;
}
async function renderLivingExhibitions(){
 const hosts=['home-exhibitions','exhibition-index'].map(id=>document.getElementById(id)).filter(x=>x&&!x.dataset.ready);
 if(!hosts.length)return;
 try{const html=LIVING_EXHIBITIONS.map(ex=>exhibitionCover(ex)).join('');hosts.forEach(host=>{host.innerHTML=html;host.dataset.ready='1'})}
 catch{hosts.forEach(host=>{host.innerHTML='<p>展览暂未载入</p><button class="text-button" data-view="gallery">前往作品</button>'})}
}
async function openExhibition(slug){
 const ex=LIVING_EXHIBITIONS.find(x=>x.slug===slug);if(!ex){showView('exhibitions');return}
 commitRoute('#exhibit='+ex.slug);showView('exhibition',ex.title);
 const host=document.getElementById('exhibition-detail');host.textContent='正在布展';
 try{
  const {items}=await jsonResource('images/generated/manifest.json?v=20261030-1');
  if(location.hash!=='#exhibit='+ex.slug)return;
  const works=ex.ids.map(id=>items.find(x=>x.id===id)).filter(Boolean);
  const next=LIVING_EXHIBITIONS[(LIVING_EXHIBITIONS.indexOf(ex)+1)%LIVING_EXHIBITIONS.length];
  host.innerHTML=`<button class="exhibit-back" data-view="exhibitions">← 全部展览</button><div class="exhibit-opening"><div><p class="eyebrow">展览 ${ex.number}</p><h1 id="exhibition-name">${ex.title}</h1><p>${ex.description.replaceAll('\n','<br>')}</p></div><div class="cover-art">${coverVisual(ex)}</div></div><div class="exhibit-count"><span>${works.length} 件作品</span><span>点击画面放大查看</span><span>共同创作</span></div><div class="exhibit-works">${works.map((work,i)=>`${ex.chapters?.[work.id]?`<div class="series-chapter"><span>${escapeHtml(ex.chapters[work.id])}</span><span aria-hidden="true">. . .</span></div>`:''}<figure class="exhibit-work"><button class="image-open" data-image="${escapeHtml(localUrl(work.path))}" data-caption="${escapeHtml(work.title)}" aria-label="放大${escapeHtml(work.title)}"><img src="${escapeHtml(localUrl(work.path))}" alt="${escapeHtml(work.title)}" loading="lazy" decoding="async"></button><figcaption><small>${String(i+1).padStart(2,'0')}</small><span>${escapeHtml(cleanHeading(work.title))}</span></figcaption><p>${ex.notes[ex.ids.indexOf(work.id)]||''}</p></figure>`).join('')}</div><nav class="exhibit-end" aria-label="继续观看"><button data-view="gallery"><small>自由浏览</small>全部作品 ↗</button><button data-exhibit="${next.slug}"><small>下一场展览</small>${next.title} ↗</button></nav>`;
 }catch{host.innerHTML='<p class="loading-state">展览暂未载入</p><button class="text-button" data-view="exhibitions">返回展览</button>'}
}
window.renderLivingExhibitions=renderLivingExhibitions;window.openExhibition=openExhibition;
function cleanHeading(value){return String(value).replace(/[，。！？；：、·“”「」《》…—｜|]/g,' ').replace(/\s+/g,' ').trim()}
// Display headings can be simplified without rewriting any source documents
function quietHeadings(root){root.querySelectorAll('h1,h2,h3').forEach(h=>{const walker=document.createTreeWalker(h,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode())node.nodeValue=cleanHeading(node.nodeValue)})}
const headingObserver=new MutationObserver(records=>{for(const r of records)for(const n of r.addedNodes)if(n.nodeType===1){if(/^H[123]$/.test(n.tagName))quietHeadings(n.parentElement);else quietHeadings(n)}});
headingObserver.observe(document.getElementById('main'),{childList:true,subtree:true});quietHeadings(document.getElementById('main'));
const menuButton=document.querySelector('.mobile-menu-toggle'),mainNavigation=document.getElementById('main-nav');
function closeLivingMenu(){menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','展开导航');mainNavigation.classList.remove('is-open')}
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'收起导航':'展开导航');mainNavigation.classList.toggle('is-open',open)});
document.addEventListener('click',event=>{if(event.target.closest('.skip-link')){event.preventDefault();document.getElementById('main').focus();return}const ex=event.target.closest('[data-exhibit]');if(ex){event.preventDefault();openExhibition(ex.dataset.exhibit)}if(event.target.closest('[data-view],[data-doc],[data-exhibit]'))closeLivingMenu();if(!event.target.closest('.site-header'))closeLivingMenu()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeLivingMenu();menuButton.focus()}});
window.addEventListener('DOMContentLoaded',()=>{renderLivingExhibitions();jsonResource('planning/round8/public/catalog.json?v=20261030-1').then(data=>{document.getElementById('home-plan-note').textContent=data.items.length+' 项创作计划 · '+(data.generated_this_round||0)+' 张已生成'}).catch(()=>{})});
