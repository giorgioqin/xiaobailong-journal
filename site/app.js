x=>savedImageCard(x)).join('')+(archive.length?`<details class="saved-history" style="grid-column:1 / -1"><summary>查看 ${archive.length} 张历史版本与修正记录</summary><p>旧稿保留供追溯。退稿、失败版本不会作为当前参考。</p><div class="gallery-grid">${archive.map(x=>savedImageCard(x,true)).join('')}</div></details>`:'');
 const summary=document.querySelector('#generated-summary');if(summary)summary.textContent=`已保存 ${current.length} 个作品编号，共 ${data.version_image_count||current.length} 张含修改版图片。下方展示当前版本，历史版本可展开；检查结果和用户确认分别记录。`;
 }catch(error){host.textContent=error.message;}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!document.querySelector('#view-gallery')?.hidden)renderGenerated();});
