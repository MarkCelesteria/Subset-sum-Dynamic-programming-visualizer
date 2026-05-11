// app.js — main controller

let nums      = [3, 34, 4, 12, 5, 2];
let target    = 9;
let steps     = [];
let stepIdx   = 0;
let autoTimer = null;
let autoDelay = 600;

// ── Apply a step to all panels ──
function applyStep(idx) {
  if (!steps.length) return;
  idx = Math.max(0, Math.min(idx, steps.length - 1));
  const s = steps[idx];

  highlightCodeLines(s.lines, s.changedLines);
  renderStatus(`[${idx + 1}/${steps.length}]  ${s.msg}`);
  updateDPTable(s.dp, s.cursorI, s.cursorS, s.traceI, s.traceS, s.refExcl, s.refIncl);
  renderNumsChips(nums, s.cursorI || s.traceI);
  renderResultChips(s.result);
  renderVars(s.vars);

  document.getElementById('btn-prev').disabled = idx <= 0;
  document.getElementById('btn-next').disabled = idx >= steps.length - 1;
  if (idx >= steps.length - 1) stopAuto();
}

// ── Controls ──
function stepDir(dir) {
  stepIdx = Math.max(0, Math.min(stepIdx + dir, steps.length - 1));
  applyStep(stepIdx);
}

function resetViz() {
  stopAuto();
  stepIdx = 0;
  steps = generateSteps(nums, target);
  buildDPTable(nums, target);
  applyStep(0);
}

function toggleAuto() {
  if (autoTimer) { stopAuto(); return; }
  const btn = document.getElementById('btn-auto');
  btn.innerHTML = '&#9646;&#9646;';
  btn.classList.add('btn--auto-active');
  autoTimer = setInterval(() => {
    if (stepIdx >= steps.length - 1) { stopAuto(); return; }
    stepIdx++;
    applyStep(stepIdx);
  }, autoDelay);
}

function stopAuto() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  const btn = document.getElementById('btn-auto');
  btn.innerHTML = '&#9654;';
  btn.classList.remove('btn--auto-active');
}

// ── Editor ──
function applyInput() {
  const raw    = document.getElementById('nums-input').value;
  const tgtRaw = document.getElementById('target-input').value;
  const errEl  = document.getElementById('input-err');
  errEl.textContent = '';

  try {
    const parsed = raw.split(',').map(s => {
      const n = parseInt(s.trim(), 10);
      if (isNaN(n)) throw new Error(`"${s.trim()}" is not an integer`);
      if (n < 0)    throw new Error(`Negative numbers not supported: ${n}`);
      return n;
    });
    const t = parseInt(tgtRaw, 10);
    if (isNaN(t) || t < 0) throw new Error('Target must be a non-negative integer');
    if (parsed.length === 0) throw new Error('nums must have at least one element');
    if (t > 200) throw new Error('Target too large (max 200 for readability)');
    if (parsed.length > 12) throw new Error('Too many numbers (max 12 for readability)');

    nums   = parsed;
    target = t;
    resetViz();
  } catch (e) {
    errEl.textContent = 'Error: ' + e.message;
  }
}

// ── Wire up events ──
document.addEventListener('DOMContentLoaded', () => {
  buildCodePanel();

  document.getElementById('btn-prev').addEventListener('click', () => stepDir(-1));
  document.getElementById('btn-next').addEventListener('click', () => stepDir(1));
  document.getElementById('btn-reset').addEventListener('click', resetViz);
  document.getElementById('btn-auto').addEventListener('click', toggleAuto);

  document.getElementById('speed-sl').addEventListener('input', function () {
    autoDelay = +this.value;
    if (autoTimer) { stopAuto(); toggleAuto(); }
  });

  resetViz();
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  if (e.key === 'ArrowRight' || e.key === 'l') stepDir(1);
  if (e.key === 'ArrowLeft'  || e.key === 'h') stepDir(-1);
  if (e.key === ' ') { e.preventDefault(); toggleAuto(); }
  if (e.key === 'r') resetViz();
});
