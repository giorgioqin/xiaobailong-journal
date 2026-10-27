/* One request per resource and bounded network waits. */
(()=>{'use strict';
 const values=new Map(),pending=new Map();
 async function read(path,type='json',timeout=10000){
  const url=new URL(path,location.href).href,key=type+':'+url;
  if(values.has(key))return values.get(key);
  if(pending.has(key))return pending.get(key);
  const controller=new AbortController();let expired=false;
  const timer=setTimeout(()=>{expired=true;controller.abort()},timeout);
  const task=(async()=>{try{
   const response=await fetch(url,{signal:controller.signal,cache:'default',credentials:'same-origin'});
   if(!response.ok)throw Error('读取失败 '+response.status);
   const value=await(type==='json'?response.json():response.text());values.set(key,value);return value;
  }catch(error){throw Error(expired?'等待超过10秒 请重试':navigator.onLine===false?'当前处于离线状态':error.message||'网络暂时不可用')}
  finally{clearTimeout(timer);pending.delete(key)}})();
  pending.set(key,task);return task;
 }
 window.SiteData={read,json:path=>read('../'+encodeURI(path)),text:path=>read('../'+encodeURI(path),'text')};
 const schedule=window.requestIdleCallback||((fn)=>setTimeout(fn,700));
 window.addEventListener('DOMContentLoaded',()=>schedule(()=>{if(!navigator.connection?.saveData)window.SiteData.json('images/generated/manifest.json?v=20261027-4').catch(()=>{})},{timeout:1500}));
})();
