// table.js — builds and updates the DP table

let _target = 0;
let _nums   = [];
let _tableBuilt = false;

function buildDPTable(nums, target) {
  _target = target;
  _nums   = nums;
  _tableBuilt = true;
  const n = nums.length;
  const wrap = document.getElementById('table-scroll');

  let html = '<table class="dp-table"><thead><tr>';
  // Top-left corner cell
  html += '<th style="min-width:90px;text-align:left">i \\ sum&nbsp;s →</th>';
  for (let s = 0; s <= target; s++) {
    html += `<th class="th-sum" id="th-s${s}">${s}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (let i = 0; i <= n; i++) {
    html += '<tr>';
    const rowLabel = i === 0
      ? `i=0 (base)`
      : `i=${i} [${nums[i-1]}]`;
    html += `<td class="td-row-head" id="tr-head-${i}">${rowLabel}</td>`;
    for (let s = 0; s <= target; s++) {
      html += `<td class="dp-cell dp-cell--empty" id="dp-${i}-${s}">·</td>`;
    }
    html += '</tr>';
  }

  html += '</tbody></table>';
  html += `<div class="table-legend">
    <div class="leg"><div class="leg-box leg-box--true"></div>True</div>
    <div class="leg"><div class="leg-box leg-box--false"></div>False</div>
    <div class="leg"><div class="leg-box leg-box--cursor"></div>Current cell</div>
    <div class="leg"><div class="leg-box leg-box--ref-excl"></div>Checking (exclude)</div>
    <div class="leg"><div class="leg-box leg-box--ref-incl"></div>Checking (include)</div>
    <div class="leg"><div class="leg-box leg-box--trace"></div>Traceback path</div>
  </div>`;

  wrap.innerHTML = html;
}

function updateDPTable(dpSnap, cursorI, cursorS, traceI, traceS, refExcl, refIncl) {
  if (!_tableBuilt) return;
  const n = _nums.length;

  for (let i = 0; i <= n; i++) {
    for (let s = 0; s <= _target; s++) {
      const cell = document.getElementById(`dp-${i}-${s}`);
      if (!cell) continue;

      const val = dpSnap[i][s];
      cell.className = 'dp-cell';

      if (i === cursorI && s === cursorS) {
        cell.classList.add('dp-cell--cursor');
        cell.textContent = val === null ? '·' : val ? 'T' : 'F';
      } else if (i === traceI && s === traceS) {
        cell.classList.add('dp-cell--trace');
        cell.textContent = val === null ? '·' : val ? 'T' : 'F';
      } else if (refIncl && i === refIncl.i && s === refIncl.s) {
        // Include reference cell (dp[i-1][s-num]) — green tint
        cell.classList.add('dp-cell--ref-incl');
        cell.textContent = val === null ? '·' : val ? 'T' : 'F';
      } else if (refExcl && i === refExcl.i && s === refExcl.s) {
        // Exclude reference cell (dp[i-1][s]) — blue tint
        cell.classList.add('dp-cell--ref-excl');
        cell.textContent = val === null ? '·' : val ? 'T' : 'F';
      } else if (val === null) {
        cell.classList.add('dp-cell--empty');
        cell.textContent = '·';
      } else if (val === true) {
        cell.classList.add('dp-cell--true');
        cell.textContent = 'T';
      } else {
        cell.classList.add('dp-cell--false');
        cell.textContent = 'F';
      }
    }
  }

  // Highlight active column header
  for (let s = 0; s <= _target; s++) {
    const th = document.getElementById('th-s' + s);
    if (!th) continue;
    th.className = (s === cursorS || s === traceS) ? 'th-sum th-sum-active' : 'th-sum';
  }

  // Scroll cursor into view
  if (cursorI != null && cursorS != null) {
    const cell = document.getElementById(`dp-${cursorI}-${cursorS}`);
    if (cell) cell.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }
}
