const DOCS = [
  {file:'00_角色主设定卡.md',title:'角色主设定卡',kind:'身份与性格'},
  {file:'01_人物设计规范.md',title:'人物设计规范',kind:'视觉规则'},
  {file:'02_系列目录与分镜.md',title:'系列目录与代表画面',kind:'创作规划'},
  {file:'03_图像提示词库.md',title:'图像提示词库',kind:'可复用提示'},
  {file:'04_制作进度与反馈.md',title:'制作进度与反馈',kind:'修改记录'},
  {file:'05_下一会话接力说明.md',title:'下一会话接力说明',kind:'续作入口'},
  {file:'06_网站建设规划.md',title:'设定集阅读网站规划',kind:'阅读站说明'},
  {file:'07_案例与工具研究.md',title:'案例与工具研究',kind:'来源与判断'},
  {file:'08_视觉身份档案.md',title:'视觉身份档案',kind:'身份锚点'},
  {file:'09_衣橱与造型登记.md',title:'衣橱与造型登记',kind:'造型进度'},
  {file:'10_完整生图提示词包.md',title:'完整生图提示词',kind:'完整提示词'},
  {file:'11_设定集案例研究.md',title:'设定集案例研究',kind:'18条一手来源'},
  {file:'12_参考图分工与批次策略.md',title:'参考分工与批次策略',kind:'制作工作法'},
  {file:'13_穿搭研究与造型方案.md',title:'12套穿搭研究',kind:'服装方案'},
  {file:'14_首批生成与审阅记录.md',title:'首批生成与审阅记录',kind:'实际作品'},
  {file:'15_第二批生成与审阅记录.md',title:'第二批作品与审阅',kind:'实际作品'},
  {file:'16_成年比例基准与参考用法.md',title:'成年比例与参考分工',kind:'视觉规则'},
  {file:'17_生图经验与验收清单.md',title:'生图经验与验收',kind:'持续修正'},
  {file:'18_夜间整批制作与检查记录.md',title:'夜间作品与检查记录',kind:'实际作品'},
  {file:'19_角尾参考研究与修正依据.md',title:'角尾参考与修正',kind:'参考依据'},
  {file:'20_保存与恢复说明.md',title:'保存与恢复',kind:'文件保全'},
  {file:'21_表情表演与情境分配.md',title:'表情与情境',kind:'角色表演'},
  {file:'22_中断恢复与网站核对.md',title:'中断恢复与网站核对',kind:'保存核对'},
  {file:'23_裤裙与短裙的参考选择.md',title:'裤裙与短裙参考',kind:'穿搭来源'},
  {file:'24_本轮交付与待修清单.md',title:'本轮成果与待修项',kind:'交付记录'},
  {file:'25_第一批图像生成与验收记录.md',title:'第一批图像与验收',kind:'当前批次'},
  {file:'25_龙角两次转向与尺寸校准.md',title:'龙角转向与尺寸校准',kind:'视觉规则'},
  {file:'26_拦截处理与额度记录.md',title:'拦截处理与额度记录',kind:'制作记录'},
  {file:'27_下一轮20张生活图与Q版计划.md',title:'20张生活图与Q版计划',kind:'下一轮计划'},
  {file:'28_网站阅读逻辑与案例依据.md',title:'网站阅读逻辑与案例依据',kind:'网站规范'},
  {file:'29_线上保存与记忆来源说明.md',title:'线上保存与记忆来源说明',kind:'网站规范'},
  {file:'30_标志排版与交互修订.md',title:'标志排版与交互修订',kind:'网站规范'},
  {file:'31_网页读取兼容与公开镜像.md',title:'网页读取兼容与公开镜像',kind:'网站规范'},
  {file:'32_妆容变化与新中式造型规划.md',title:'妆容变化与新中式造型',kind:'造型规划'},
  {file:'33_第二批图像生成与验收记录.md',title:'第二批图像与验收',kind:'生图与检查'},
  {file:'34_第三批图像与用户反馈.md',title:'第三批图像与用户反馈',kind:'生图与检查'}
];
const cache = new Map(Object.entries(JSON.parse(document.querySelector('#content-cache')?.textContent||'{}')));
let docRequestId=0,searchRequestId=0;
const views = [...document.querySelectorAll('.view')];
const navButtons = [...document.querySelectorAll('[data-view], [data-doc]')];
const searchInput = document.querySelector('#site-search');
const crumb = document.querySelector('#crumb-current');
const docPanel = document.querySelector('#view-document');
const docContent = document.querySelector('#markdown-content');
const sourceLink = document.querySelector('#source-link');

function escapeHtml(value){return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;')}
function inlineMarkdown(text){
  let s=escapeHtml(text);
  s=s.replace(/`([^`]+)`/g,'<code>$1</code>');
  s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,href)=>{
    const raw=href.replaceAll('&amp;','&');
    const safe=/^(https?:|mailto:|\.\.?\/|#)/i.test(raw)?raw:'#';
    const local=/^(?:images\/|prompts\/|references\/|research\/|production\/|memories\/|planning\/|site\/|[0-9]{2}_[^/]+\.md$|小白龙同志_正式设定集\/)/.test(raw)?'../'+raw:safe;
    const external=/^https?:/i.test(raw);
    return `<a href="${escapeHtml(local)}"${external?' target="_blank" rel="noopener noreferrer"':''}>${label}</a>`;
  });
  s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/\*([^*]+)\*/g,'<em>$1</em>');
  return s;
}
function splitTableRow(line){return line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(x=>x.trim())}
function renderMarkdown(md){
  const lines=md.replace(/\r/g,'').split('\n');let html='';let i=0;
  while(i<lines.length){
    const line=lines[i];
    if(!line.trim()){i++;continue}
    if(line.startsWith('```')){const lang=line.slice(3).trim();i++;let code=[];while(i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i++]);i++;html+=`<pre><code${lang?` class="language-${escapeHtml(lang)}"`:''}>${escapeHtml(code.join('\n'))}</code></pre>`;continue}
    if(/^\|.*\|$/.test(line)&&i+1<lines.length&&/^\|?\s*:?-{2,}/.test(lines[i+1])){
      const heads=splitTableRow(line);i+=2;let rows=[];while(i<lines.length&&/^\|.*\|$/.test(lines[i]))rows.push(splitTableRow(lines[i++]));
      html+='<table><thead><tr>'+heads.map(c=>`<th>${inlineMarkdown(c)}</th>`).join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+heads.map((_,k)=>`<td>${inlineMarkdown(r[k]||'')}</td>`).join('')+'</tr>').join('')+'</tbody></table>';continue;
    }
    const heading=line.match(/^(#{1,3})\s+(.*)$/);if(heading){const n=heading[1].length;html+=`<h${n}>${inlineMarkdown(heading[2])}</h${n}>`;i++;continue}
    if(/^>\s?/.test(line)){let q=[];while(i<lines.length&&/^>\s?/.test(lines[i]))q.push(lines[i++].replace(/^>\s?/,''));html+=`<blockquote>${q.map(x=>`<p>${inlineMarkdown(x)}</p>`).join('')}</blockquote>`;continue}
    if(/^\s*[-*+]\s+/.test(line)||/^\s*\d+\.\s+/.test(line)){
      const ordered=/^\s*\d+\./.test(line);const tag=ordered?'ol':'ul';let items=[];while(i<lines.length&&(/^\s*[-*+]\s+/.test(lines[i])||/^\s*\d+\.\s+/.test(lines[i]))){items.push(lines[i++].replace(/^\s*(?:[-*+]\s+|\d+\.\s+)/,''))}html+=`<${tag}>${items.map(x=>`<li>${inlineMarkdown(x)}</li>`).join('')}</${tag}>`;continue;
    }
    if(/^---+$/.test(line)){html+='<hr>';i++;continue}
    let para=[line.trim()];i++;while(i<lines.length&&lines[i].trim()&&!/^(#{1,3}\s|>|```|\s*[-*+]\s+|\s*\d+\.\s+)/.test(lines[i])&&!/^\|.*\|$/.test(lines[i]))para.push(lines[i++].trim());html+=`<p>${para.map(inlineMarkdown).join('<br>')}</p>`;
  }
  return html;
}
function showView(id,title){
  views.forEach(v=>{const active=v.id===`view-${id}`;v.classList.toggle('active',active);v.hidden=!active});
  document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===id||(id==='document'&&b.dataset.doc===window.currentDoc)));
  if(title)crumb.textContent=title;else if(id==='home')crumb.textContent='档案首页';else if(id==='gallery')crumb.textContent='作品与参考';else if(id==='search')crumb.textContent='搜索结果';
  if(id==='prompts'){crumb.textContent='生图提示词';if(window.renderPromptWorkbench)window.renderPromptWorkbench();}
  if(id==='gallery'){renderBatch2();renderGenerated();}
  if(['home','gallery','prompts'].includes(id))history.replaceState(null,'','#'+id);
  window.scrollTo({top:0,behavior:'smooth'});
}
async function loadDoc(file){
 if(!cache.has(file))cache.set(file,await SiteData.text(file));
 return cache.get(file);
}
async function openDoc(file){
 const meta=DOCS.find(d=>d.file===file);if(!meta)return false;
 const request=++docRequestId;window.currentDoc=file;showView('document',meta.title);
 document.querySelector('#document-toc').innerHTML='';
 docContent.setAttribute('aria-busy','true');
 docContent.innerHTML='<div class="loading-state" role="status"><p>正在打开这份档案</p><small>正文准备好后会显示在这里</small></div>';
 sourceLink.href='../'+encodeURI(file);
 const slow=setTimeout(()=>{if(request===docRequestId&&docContent.getAttribute('aria-busy')==='true'){const hint=docContent.querySelector('.loading-state small');if(hint)hint.textContent='连接比平时慢一些 仍在尝试读取'}},3000);
 try{
  const md=await loadDoc(file);if(request!==docRequestId||window.currentDoc!==file||docPanel.hidden)return false;
  docContent.innerHTML=renderMarkdown(md);docPanel.setAttribute('aria-label',meta.title);return true;
 }catch(err){
  if(request!==docRequestId||docPanel.hidden)return false;
  docContent.innerHTML='<div class="error-state" role="status"><h2>这份档案暂时没打开</h2><p>'+escapeHtml(err.message)+'</p><button class="text-button" data-doc="'+escapeHtml(file)+'">重新读取 ↗</button><a href="'+escapeHtml(sourceLink.href)+'" target="_blank" rel="noopener">直接阅读原文 ↗</a></div>';return false;
 }finally{clearTimeout(slow);if(request===docRequestId)docContent.removeAttribute('aria-busy')}
}
function extractPlain(md){return md.replace(/```[\s\S]*?```/g,' ').replace(/[#>*`|]/g,' ').replace(/\[([^\]]+)\]\([^)]+\)/g,'$1').replace(/\s+/g,' ').trim()}
async function primeSearch(){return SiteData.json('site/assets/search-index-v066.json')}
async function runSearch(query){
 const q=query.trim().toLocaleLowerCase(),request=++searchRequestId;
 if(!q){showView('home');return}
 showView('search');document.querySelector('#search-summary').textContent='正在搜索 '+query;
 const host=document.querySelector('#search-results');host.innerHTML='<div class="loading-state" role="status">正在打开搜索索引</div>';
 try{
  const index=await primeSearch();if(request!==searchRequestId||document.querySelector('#view-search').hidden)return;
  const hits=index.items.filter(d=>(d.title+' '+d.text).toLocaleLowerCase().includes(q));
  host.innerHTML=hits.length?hits.map(d=>{const at=d.text.toLocaleLowerCase().indexOf(q),start=Math.max(0,at-50);return '<button class="search-result" '+(d.file?'data-doc="'+escapeHtml(d.file)+'"':'data-view="'+escapeHtml(d.view)+'"')+'><strong>'+escapeHtml(d.title)+'</strong><span>'+escapeHtml(d.kind)+'</span><p>'+escapeHtml(d.text.slice(start,start+180))+'</p></button>'}).join(''):'<div class="empty-result">暂时没有匹配条目 试试短发 尾巴 穿搭或作品编号</div>';
  document.querySelector('#search-summary').textContent='找到 '+hits.length+' 条相关记录';
 }catch(error){if(request===searchRequestId)host.innerHTML='<div class="error-state" role="status"><p>'+escapeHtml(error.message)+'</p><button data-filter="'+escapeHtml(query)+'" class="text-button">重新搜索 ↗</button></div>'}
}
let warmTimer,warmCount=0;
function warmDoc(event){
 const trigger=event.target.closest('[data-doc]');if(!trigger||cache.has(trigger.dataset.doc)||navigator.connection?.saveData)return;
 clearTimeout(warmTimer);warmTimer=setTimeout(()=>{if(warmCount>=2)return;warmCount++;loadDoc(trigger.dataset.doc).catch(()=>{}).finally(()=>warmCount--)},120);
}
document.addEventListener('pointerover',warmDoc,{passive:true});
document.addEventListener('focusin',warmDoc);
document.addEventListener('click',e=>{
  const doc=e.target.closest('[data-doc]');if(doc){e.preventDefault();openDoc(doc.dataset.doc);return}
  const view=e.target.closest('[data-view]');if(view){e.preventDefault();showView(view.dataset.view);return}
  const filter=e.target.closest('[data-filter]');if(filter){runSearch(filter.dataset.filter);return}
  const img=e.target.closest('[data-image]');if(img){const lb=document.querySelector('#lightbox');document.querySelector('#lightbox-image').src=img.dataset.image;lb.showModal();return}
});
searchInput.addEventListener('input',()=>{clearTimeout(window.searchTimer);window.searchTimer=setTimeout(()=>runSearch(searchInput.value),170)});
searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();runSearch(searchInput.value);searchInput.blur()}if(e.key==='Escape'){searchInput.value='';showView('home');searchInput.blur()}});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();searchInput.focus()}if(e.key==='Escape'){const lb=document.querySelector('#lightbox');if(lb.open)lb.close()}});
document.querySelector('#lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')e.currentTarget.close()});

async function renderBatch2(){
  const host=document.querySelector('#reference-batch2');if(!host||host.dataset.ready)return;
  try{const response=await fetch('../references/wardrobe-batch2.json');if(!response.ok)throw Error('参考读取失败');const refs=await response.json();
  host.innerHTML=refs.filter(x=>!x.duplicate).map(x=>`<article class="gallery-card reference-card"><button class="image-open" data-image="../${escapeHtml(x.path)}" aria-label="放大${escapeHtml(x.title)}"><img loading="lazy" src="../${escapeHtml(x.path)}" alt="${escapeHtml(x.title)}"><span class="image-zoom" aria-hidden="true">⌕</span></button><div class="gallery-meta"><div><span class="status-label">${escapeHtml(x.id)} · ${x.rows}行${x.cols}列</span><h2>${escapeHtml(x.title)}</h2></div></div><p>${escapeHtml(x.role)}</p></article>`).join('');host.dataset.ready='true';
  }catch(error){host.textContent=error.message;}
}
// Route handling belongs to journal.js so history and reading position stay together.

function savedImageCard(x, historical=false){
 const notes=Array.isArray(x.review)?x.review:[];
 return `<article class="gallery-card identity-sheet-card"><button class="image-open" data-image="../${escapeHtml(x.path)}" aria-label="放大${escapeHtml(x.title)}"><img src="../${escapeHtml(x.path)}" alt="${escapeHtml(x.title)}" loading="lazy"><span class="image-zoom" aria-hidden="true">⌕</span></button><div class="gallery-meta"><div><span class="status-label draft-label">${escapeHtml(x.status)}</span><h2>${historical?'':escapeHtml(x.id)+' · '}${escapeHtml(x.title)}</h2></div></div>${notes.length?`<p>${notes.map(escapeHtml).join('；')}。</p>`:''}</article>`;
}
async function renderGenerated(){
 const host=document.querySelector('#generated-gallery');if(!host)return;
 try{const response=await fetch('../images/generated/manifest.json');if(!response.ok)throw Error('作品记录读取失败');const data=await response.json();
 const current=data.items||[],archive=data.archive_items||[];
 host.innerHTML=current.map(x=>savedImageCard(x)).join('')+(archive.length?`<details class="saved-history" style="grid-column:1 / -1"><summary>查看 ${archive.length} 张历史版本与修正记录</summary><p>旧稿保留供追溯。退稿、失败版本不会作为当前参考。</p><div class="gallery-grid">${archive.map(x=>savedImageCard(x,true)).join('')}</div></details>`:'');
 const summary=document.querySelector('#generated-summary');if(summary)summary.textContent=`已保存 ${current.length} 个作品编号，共 ${data.version_image_count||current.length} 张含修改版图片。下方展示当前版本，历史版本可展开；检查结果和用户确认分别记录。`;
 }catch(error){host.textContent=error.message;}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!document.querySelector('#view-gallery')?.hidden)renderGenerated();});
