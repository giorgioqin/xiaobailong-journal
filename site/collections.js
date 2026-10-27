/* Scene and wardrobe drawers  Current works remain separate from historical edits */
let workAxis='scene',workTaxonomy=null,openWorkGroup={scene:'home',outfit:'dress'};
let taxonomyReady;
function loadTaxonomy(){return taxonomyReady ||= SiteData.json('site/assets/work-taxonomy-v062.json?v=20261027-4').then(data=>{workTaxonomy=data;return data}).catch(error=>{taxonomyReady=null;throw error})}
function taxonomyTitle(axis,id){return workTaxonomy?.axes[axis]?.find(g=>g.items.includes(id))?.title||''}
function currentWorkCard(item){
 const notes=Array.isArray(item.review)?item.review:[];
 return `<article class="gallery-card work-card"><button class="image-open" data-image="${escapeHtml(localUrl(item.path))}" data-caption="${escapeHtml(item.title)}" aria-label="放大${escapeHtml(item.title)}"><img src="${escapeHtml(localUrl(item.path))}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async"></button><div class="work-caption"><small>${escapeHtml(item.id)}</small><h2>${escapeHtml(item.title)}</h2></div><div class="work-tags"><span>${escapeHtml(taxonomyTitle('scene',item.id))}</span><span>${escapeHtml(taxonomyTitle('outfit',item.id))}</span></div>${window.workStoryLinks?.(item.id)||''}<details class="work-record"><summary>制作记录</summary>${notes.map(n=>`<p>${escapeHtml(n)}</p>`).join('')}<a href="${escapeHtml(localUrl(item.path))}" target="_blank" rel="noopener">打开浏览图 ↗</a></details></article>`;
}
function fillWorkDrawer(drawer){
 if(!drawer.open||drawer.dataset.loaded)return;
 const group=workTaxonomy.axes[workAxis].find(g=>g.id===drawer.dataset.workGroup);if(!group)return;
 const items=group.items.map(id=>journalGallery.find(x=>x.id===id)).filter(Boolean);
 drawer.querySelector('.drawer-content').innerHTML=items.map(currentWorkCard).join('');drawer.dataset.loaded='1';
}
async function renderWorkDrawers(){
 const host=document.getElementById('generated-gallery');
 try{
  await loadTaxonomy();
  const available=new Set(journalGallery.map(x=>x.id));
  const groups=workTaxonomy.axes[workAxis].map(g=>({...g,items:g.items.filter(id=>available.has(id))})).filter(g=>g.items.length);
  const count=journalGallery.length;
  document.getElementById('current-gallery-count').textContent=count;
  document.getElementById('history-gallery-count').textContent=journalHistory.length;
  document.getElementById('generated-summary').textContent=`${count} 张当前作品　${groups.length} 个${workAxis==='scene'?'场景':'穿搭'}抽屉`;
  document.querySelectorAll('[data-work-axis]').forEach(button=>{const active=button.dataset.workAxis===workAxis;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1});
  host.setAttribute('aria-labelledby','work-axis-'+workAxis);
  host.innerHTML=groups.map((group,i)=>`<details class="work-drawer" data-work-group="${group.id}" ${group.id===openWorkGroup[workAxis]?'open':''}><summary><span class="drawer-index">${String(i+1).padStart(2,'0')}</span><span class="drawer-heading"><b>${group.title}</b><small>${group.description}</small></span><span class="drawer-count">${group.items.length}<small>张</small></span><span class="drawer-toggle" aria-hidden="true"></span></summary><div class="drawer-content gallery-grid"></div></details>`).join('');
  host.querySelectorAll('.work-drawer').forEach(fillWorkDrawer);
  if(!document.getElementById('gallery-history').hidden)renderWorkHistory();
 }catch(e){host.innerHTML='<div class="error-state"><p>'+escapeHtml(e.message)+'</p><button class="text-button" data-view="gallery">重新读取 ↗</button></div>'}
}
function renderWorkHistory(){
 const host=document.getElementById('history-gallery');
 if(!journalHistory.length){host.textContent='正在读取历史版本';return}
 if(host.dataset.ready)return;
 host.innerHTML=journalHistory.map(x=>journalCard(x,true)).join('');host.dataset.ready='1';
}
window.renderWorkDrawers=renderWorkDrawers;window.renderWorkHistory=renderWorkHistory;
document.addEventListener('click',event=>{const button=event.target.closest('[data-work-axis]');if(!button||button.dataset.workAxis===workAxis)return;workAxis=button.dataset.workAxis;renderWorkDrawers()});
document.getElementById('generated-gallery').addEventListener('toggle',event=>{
 const drawer=event.target;if(!drawer.isConnected||!drawer.matches('.work-drawer')||!drawer.open)return;
 openWorkGroup[workAxis]=drawer.dataset.workGroup;
 drawer.parentElement.querySelectorAll('.work-drawer[open]').forEach(other=>{if(other!==drawer)other.open=false});
 fillWorkDrawer(drawer);
 const content=drawer.querySelector('.drawer-content');content.getAnimations().forEach(a=>a.cancel());
 if(document.body.classList.contains('keyboard-input')||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 content.animate([{opacity:.5,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:180,easing:'cubic-bezier(.23,1,.32,1)'});
},true);
document.querySelector('.work-axis-switch').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?'scene':event.key==='End'?'outfit':workAxis==='scene'?'outfit':'scene';const button=document.querySelector(`[data-work-axis="${next}"]`);button.click();button.focus()});
