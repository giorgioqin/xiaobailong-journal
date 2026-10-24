/* Public creative notes  Private diary text remains outside this build */
const DIARY_STORIES=[
  {
    "id": "name",
    "title": "白恬这个名字",
    "date": "2026年10月22日",
    "summary": "一个正式的名字 留下原来熟悉的称呼",
    "file": "memories/stories/01_白恬这个名字.md",
    "works": [
      "B07",
      "B02"
    ]
  },
  {
    "id": "motion",
    "title": "动作还没结束",
    "date": "2026年10月23日",
    "summary": "闻花 跳起 回头笑 镜头之后还有下一步",
    "file": "memories/stories/02_动作还没结束.md",
    "works": [
      "N61",
      "N63",
      "N66",
      "N69"
    ]
  },
  {
    "id": "old-things",
    "title": "旧物店里的慢下午",
    "date": "2026年10月22日",
    "summary": "一台旧相机 一张唱片 让好奇心带路",
    "file": "memories/stories/03_旧物店里的慢下午.md",
    "works": [
      "N13",
      "N23",
      "N71"
    ]
  },
  {
    "id": "journey",
    "title": "路上还有下一页",
    "date": "2026年10月23日",
    "summary": "穿适合走路的鞋 自己挑一条想走的路",
    "file": "memories/stories/04_路上还有下一页.md",
    "works": [
      "T19",
      "N14",
      "N65",
      "N72"
    ]
  }
];

DOCS.push(...DIARY_STORIES.map(s=>({file:s.file,title:s.title,kind:'创作记忆'})));
window.workStoryLinks=function(id){
 const story=DIARY_STORIES.find(s=>s.works.includes(id));
 return story?'<button class="work-story-link" data-doc="'+escapeHtml(story.file)+'">读这段记忆 <span aria-hidden="true">↗</span></button>':'';
};
window.renderDiaryStories=function(){
 const host=document.getElementById('diary-stories');if(!host||host.dataset.ready)return;
 host.innerHTML=DIARY_STORIES.map((s,i)=>'<button class="diary-story" data-doc="'+escapeHtml(s.file)+'"><span class="diary-story-date">'+escapeHtml(s.date)+'</span><span class="diary-story-copy"><small>0'+(i+1)+'</small><b>'+escapeHtml(s.title)+'</b><span>'+escapeHtml(s.summary)+'</span></span><span class="diary-story-arrow" aria-hidden="true">↗</span></button>').join('');
 host.dataset.ready='1';
};
window.decorateMemoryStory=async function(file){
 const story=DIARY_STORIES.find(s=>s.file===file);if(!story)return;
 try{
  const items=journalGallery.length?journalGallery:(await jsonResource('images/generated/manifest.json')).items;
  if(!document.querySelector('#markdown-content h1')||location.hash!=='#doc='+encodeURIComponent(file))return;
  const works=story.works.map(id=>items.find(i=>i.id===id)).filter(Boolean);
  const html='<aside class="story-works" aria-label="这段记忆里的作品"><div class="story-works-heading"><p class="eyebrow">画面与记忆</p><h2>从这些画面继续看</h2></div><div class="story-works-grid">'+works.map(i=>'<figure><button class="image-open" data-image="'+escapeHtml(localUrl(i.path))+'" data-caption="'+escapeHtml(i.title)+'" aria-label="放大'+escapeHtml(i.title)+'"><img src="'+escapeHtml(localUrl(i.path))+'" alt="'+escapeHtml(i.title)+'" loading="lazy"></button><figcaption><small>'+escapeHtml(i.id)+'</small><span>'+escapeHtml(i.title)+'</span></figcaption></figure>').join('')+'</div><button class="text-button" data-view="gallery">回到作品抽屉 <span aria-hidden="true">↗</span></button></aside>';
  docContent.insertAdjacentHTML('beforeend',html);
 }catch(e){console.warn('相关作品暂未载入')}
};
