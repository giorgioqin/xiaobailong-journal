/* Local prompt library. This module only reads files beside the archive. */
(() => {
  'use strict';
  let dataPromise;
  let catalog;
  let caseMap = new Map();
  const state = { query: '', category: '全部', priority: '全部', sort: 'foundation' };
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const local = path => '../' + String(path || '').split('/').map(encodeURIComponent).join('/');
  const priorityName = n => ({1:'先行制作',2:'随后制作',3:'后续展开'}[n] || '待安排');
  const stageName = stage => ({'adult-home':'成年 · 居家显角尾','adult-city':'成年 · 外出藏角尾','adult-dragon':'成年 · 龙族特征',clay:'成年 · 白模',student:'学生时代 · 高马尾',child:'虚构童年',dragon:'完整白龙'}[stage] || stage);
  const shorten = (value, length = 108) => String(value || '').length > length ? String(value).slice(0, length) + '…' : String(value || '');

  function loadData() {
    if (!dataPromise) dataPromise = Promise.all([
      SiteData.json('prompts/catalog.json'),
      SiteData.json('research/cases.json')
    ]).then(([prompts, cases]) => {
      catalog = prompts;
      caseMap = new Map((cases.sources || []).map(item => [item.id, item]));
      return prompts;
    });
    return dataPromise;
  }

  function referenceHTML(ref, index, item) {
    return `<figure class="pw-reference"><button type="button" class="pw-reference-image" data-image="${esc(local(ref.path))}" aria-label="放大参考 ${esc(ref.id)}"><img src="${esc(local(ref.path))}" alt="参考 ${esc(ref.id)}" loading="lazy" decoding="async"><span>放大查看</span></button><figcaption><b>Image ${index + 1} · ${esc(ref.id)}</b><p>${esc(ref.role)}</p></figcaption></figure>`;
  }

  function caseHTML(id) {
    const source = caseMap.get(id);
    if (!source) return `<span class="pw-case">${esc(id)}</span>`;
    if (!/^https?:\/\//i.test(source.url || '')) return `<span class="pw-case">${esc(id)} · ${esc(source.title)}</span>`;
    return `<a class="pw-case" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer" title="${esc(source.adopted || source.observed)}">${esc(id)} · ${esc(source.title)} ↗</a>`;
  }

  function itemHTML(item) {
    const refs = item.references || (item.refs || []).map(id => ({id, ...(catalog.reference_definitions?.[id] || {})}));
    const status = item.generated_file ? (item.generation_record?.status || '已生成 · 待审') : (item.status || '未生成');
    const generated = item.generated_file ? `<figure class="pw-generated"><button type="button" data-image="${esc(local(item.generated_file))}" aria-label="放大${esc(item.title)}实际初稿"><img src="${esc(local(item.generated_file))}" alt="${esc(item.title)}实际生成初稿" loading="lazy"></button><figcaption>${esc(item.generation_record?.status || '实际初稿 · 待用户审阅')}。${esc((item.generation_record?.review || []).join('；'))}</figcaption></figure>` : '';
    return `<details class="pw-card" data-prompt-id="${esc(item.id)}"><summary><div class="pw-card-id">${esc(item.id)}<span>${esc(item.ratio)}</span></div><div class="pw-card-heading"><div class="pw-card-tags"><span>${esc(item.category)}</span><span>${esc(stageName(item.stage))}</span></div><h2>${esc(item.title)}</h2><p>${esc(shorten(item.action || item.scene))}</p></div><div class="pw-card-state"><span class="pw-priority pw-priority-${Number(item.priority) || 2}">${esc(priorityName(item.priority))}</span><small>${esc(status)}</small><span class="pw-expand" aria-hidden="true">＋</span></div></summary><div class="pw-card-body">${generated}<div class="pw-actions"><button type="button" class="pw-button pw-copy" data-copy="${esc(item.id)}">复制完整提示词</button><a class="pw-button pw-download" download="${esc(item.filename)}" href="${esc(local('prompts/完整单条提示词/' + item.filename))}">下载 .txt ↓</a><span class="pw-copy-feedback" role="status" data-copy-status="${esc(item.id)}"></span></div><div class="pw-spec"><p><b>本张造型</b>${esc(item.wardrobe)}</p><p><b>场景与构图</b>${esc(item.scene)} ${esc(item.composition)}</p><p><b>参考格位与用法</b>${esc(item.selected_reference || '按每张参考的职责使用。')}</p>${item.note ? `<p><b>设计备注</b>${esc(item.note)}</p>` : ''}</div><h3>随调用附上的参考图</h3><div class="pw-references">${refs.map((ref, index) => referenceHTML(ref, index, item)).join('')}</div><details class="pw-full-text"><summary>阅读全文 · ${String(item.full_prompt || '').length.toLocaleString('zh-CN')} 字</summary><pre>${esc(item.full_prompt)}</pre></details><div class="pw-manual-copy" data-manual-copy="${esc(item.id)}" hidden><label>浏览器未能自动复制，全文已选中，可直接复制。<textarea readonly aria-label="${esc(item.title)}完整提示词">${esc(item.full_prompt)}</textarea></label></div><div class="pw-checks"><h3>完成时看这几处</h3><ul>${(item.checks || []).map(check => `<li>${esc(check)}</li>`).join('')}</ul></div><div class="pw-cases"><h3>这一条采用的案例</h3><div>${(item.cases || []).map(caseHTML).join('')}</div></div><p class="pw-parameters">${esc(item.parameters_note || '')}</p></div></details>`;
  }

  function renderResults(host) {
    const query = state.query.trim().toLocaleLowerCase();
    const items = (catalog.items || []).filter(item => {
      if (state.category !== '全部' && item.category !== state.category) return false;
      if (state.priority !== '全部' && String(item.priority) !== state.priority) return false;
      return !query || [item.id, item.title, item.category, item.selected_reference, item.full_prompt, ...(item.cases || [])].join(' ').toLocaleLowerCase().includes(query);
    });
    items.sort((a, b) => {
      if (state.sort === 'foundation') {
        const foundation = Number(!a.id.startsWith('B')) - Number(!b.id.startsWith('B'));
        if (foundation) return foundation;
        if (a.id.startsWith('B')) return a.id.localeCompare(b.id);
      }
      if (state.sort !== 'number' && a.priority !== b.priority) return a.priority - b.priority;
      return a.id.localeCompare(b.id);
    });
    host.querySelector('.pw-result-count').textContent = `显示 ${items.length} / ${(catalog.items || []).length} 条`;
    host.querySelector('.pw-list').innerHTML = items.length ? items.map(itemHTML).join('') : '<div class="pw-empty">没有找到这一组提示词。换个关键词，或将筛选改为全部。</div>';
  }

  async function copyPrompt(id, host, button) {
    const item = catalog.items.find(item => item.id === id);
    if (!item) return;
    const feedback = host.querySelector(`[data-copy-status="${id}"]`);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(item.full_prompt);
      feedback.textContent = '完整提示词已复制';
      button.textContent = '已复制 ✓';
    } catch (_) {
      const fallback = host.querySelector(`[data-manual-copy="${id}"]`);
      fallback.hidden = false;
      const textarea = fallback.querySelector('textarea');
      textarea.focus();
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      feedback.textContent = '请复制下方已选中的全文';
    }
  }

  window.renderPromptWorkbench = async function renderPromptWorkbench() {
    const host = document.getElementById('prompt-workbench');
    if (!host || host.dataset.ready === 'true' || host.dataset.loading === 'true') return;
    host.dataset.loading = 'true';
    host.innerHTML = '<p class="pw-loading" role="status">正在整理提示词与参考图…</p>';
    try {
      await loadData();
      const items = catalog.items || [];
      const foundations = items.filter(item => item.id.startsWith('B')).length;
      const generatedCount = items.filter(item => item.generated_file).length;
      const categories = [...new Set(items.map(item => item.category))];
      host.innerHTML = `<header class="pw-header"><p class="section-kicker">PROMPT WORKBENCH · V${esc(catalog.version)}</p><div class="pw-header-line"><div><h1>准备好下一张</h1><p>每一条都是独立完整的提示词。展开后可看参考职责、指定格位与案例，复制后即可接力。</p></div><span class="pw-not-generated">${generatedCount ? generatedCount + ' 个编号已有图像' : '全部未生成'}</span></div><div class="pw-stats"><div><strong>${items.length}</strong><span>完整提示词</span></div><div><strong>${foundations}</strong><span>基础设计</span></div><div><strong>${items.length - foundations}</strong><span>生活与主题</span></div><p>先完成基础锚点，再按小批次创作。<br>已有脸与短发参考继续复用。</p></div></header><div class="pw-toolbar"><label class="pw-search"><span>搜索提示词</span><input type="search" placeholder="试试：高马尾、牛仔、冬日、渡鸦" aria-label="搜索完整提示词"></label><label><span>系列</span><select data-filter="category"><option value="全部">全部系列</option>${categories.map(category => `<option value="${esc(category)}">${esc(category)}</option>`).join('')}</select></label><label><span>制作顺序</span><select data-filter="priority"><option value="全部">全部优先级</option><option value="1">先行制作</option><option value="2">随后制作</option><option value="3">后续展开</option></select></label><label><span>排列</span><select data-filter="sort"><option value="foundation">6 张基础优先</option><option value="priority">按优先级</option><option value="number">按编号</option></select></label></div><div class="pw-result-line"><p class="pw-result-count" role="status" aria-live="polite"></p><span>展开卡片查看，全文按需打开</span></div><div class="pw-list"></div>`;
      host.querySelector('input[type="search"]').addEventListener('input', event => {state.query = event.target.value; renderResults(host);});
      host.querySelectorAll('[data-filter]').forEach(select => select.addEventListener('change', event => {state[event.target.dataset.filter] = event.target.value; renderResults(host);}));
      host.addEventListener('click', event => {
        const button = event.target.closest('[data-copy]');
        if (button) copyPrompt(button.dataset.copy, host, button);
      });
      host.dataset.ready = 'true';
      renderResults(host);
    } catch (error) {
      host.innerHTML = `<div class="pw-empty"><h2>暂时无法读取提示词</h2><p>${esc(error.message)}。请从设定集的本地启动入口打开网站。</p></div>`;
    } finally {
      host.dataset.loading = 'false';
    }
  };
})();
