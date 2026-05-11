// ui.js — renders side panels (nums, result, vars)

function renderNumsChips(nums, activeI) {
  const el = document.getElementById('nums-chips');
  // nums is 1-indexed in the algorithm (nums[i] = nums[i-1])
  el.innerHTML = nums.map((v, idx) => {
    const i = idx + 1; // 1-based
    let cls = 'chip';
    if (i === activeI) cls += ' chip--active';
    return `<div class="${cls}" title="index ${i}">${v}</div>`;
  }).join('');
}

function renderResultChips(result) {
  const el = document.getElementById('result-chips');
  if (!result || !result.length) {
    el.innerHTML = '<span style="font-size:11px;color:var(--text-dim);font-family:var(--font-mono)">(empty)</span>';
    return;
  }
  el.innerHTML = result.map(v =>
    `<div class="chip chip--result">${v}</div>`
  ).join('');
}

function renderVars(vars) {
  const el = document.getElementById('vars-table');
  if (!vars || !Object.keys(vars).length) {
    el.innerHTML = '';
    return;
  }
  el.innerHTML = Object.entries(vars).map(([k, v]) => {
    const isChanged = (k === 'dp[i][s]' || k === 'remaining' || k === 'result');
    const cls = isChanged ? 'kv-row kv-row--changed' : 'kv-row kv-row--active';
    return `<div class="${cls}">
      <span class="key">${k}</span>
      <span class="val">${v}</span>
    </div>`;
  }).join('');
}

function renderStatus(msg) {
  document.getElementById('status-bar').textContent = msg || '';
}
