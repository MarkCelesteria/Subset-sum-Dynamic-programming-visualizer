// subsetsum.js — generates every step of the subset-sum algorithm

// Phase labels used in app.js to style things differently
const PHASE = {
  INIT:      'init',
  BASE:      'base',
  FILL:      'fill',
  CHECK:     'check',
  TRACE:     'trace',
  DONE:      'done',
};

function generateSteps(nums, target) {
  const n = nums.length;
  const steps = [];

  // dp[i][s] will be built incrementally
  // We store a flat snapshot each step (array of arrays)
  const dp = [];
  for (let i = 0; i <= n; i++) {
    dp.push(new Array(target + 1).fill(null)); // null = not yet computed
  }

  function snapDP() {
    return dp.map(row => [...row]);
  }

  function snap(lines, changedLines, msg, phase, cursorI, cursorS, traceI, traceS, vars, resultSoFar, refExcl, refIncl) {
    steps.push({
      lines:        lines || [],
      changedLines: changedLines || [],
      msg,
      phase,
      cursorI:  cursorI  ?? null,
      cursorS:  cursorS  ?? null,
      traceI:   traceI   ?? null,
      traceS:   traceS   ?? null,
      refExcl:  refExcl  ?? null,   // {i, s} cell being checked for exclude
      refIncl:  refIncl  ?? null,   // {i, s} cell being checked for include
      dp:       snapDP(),
      vars:     vars     || {},
      result:   resultSoFar ? [...resultSoFar] : [],
    });
  }

  // ── 1. Introduction ──
  snap([0], [], `subsetSum(nums=[${nums}], target=${target})`, PHASE.INIT, null, null, null, null,
       { n, target });

  snap([1, 4], [], `Create dp table of size (${n+1}) × (${target+1}), all False`, PHASE.INIT, null, null, null, null,
       { n, target });

  // ── 2. Base case ──
  snap([6, 7, 8], [], 'Base case: dp[i][0] = True for every row (empty subset always sums to 0)', PHASE.BASE, null, 0, null, null,
       { n, target });
  for (let i = 0; i <= n; i++) {
    dp[i][0] = true;
  }
  snap([7, 8], [8], `Set dp[0..${n}][0] = True`, PHASE.BASE, null, 0, null, null,
       { n, target });

  // ── 3. Fill table ──
  for (let i = 1; i <= n; i++) {
    const num = nums[i - 1];
    snap([10, 11], [], `Row i=${i}: considering nums[${i}] = ${num}`, PHASE.FILL, i, null, null, null,
         { i, s: '—', 'nums[i]': num, target });

    for (let s = 1; s <= target; s++) {
      // Exclude: reference dp[i-1][s]
      const excl = dp[i - 1][s];
      snap([12, 13, 14], [], `  i=${i}, s=${s}: exclude ${num}? → check dp[${i-1}][${s}]=${excl}`, PHASE.FILL, i, s, null, null,
           { i, s, 'nums[i]': num, [`dp[${i-1}][${s}]`]: excl },
           null, {i: i-1, s: s}, null);

      dp[i][s] = excl;

      let incl = false;
      if (s >= num) {
        incl = dp[i - 1][s - num];
        snap([16, 17, 18], [], `  i=${i}, s=${s}: include ${num}? check dp[${i-1}][${s-num}]=${incl}`, PHASE.FILL, i, s, null, null,
             { i, s, 'nums[i]': num, [`dp[${i-1}][${s}]`]: excl, [`dp[${i-1}][${s-num}]`]: incl },
             null, {i: i-1, s: s}, {i: i-1, s: s-num});
        dp[i][s] = dp[i][s] || incl;
      }

      snap([14, 18], dp[i][s] !== excl ? [18] : [14], `  → dp[${i}][${s}] = ${dp[i][s]}`, PHASE.FILL, i, s, null, null,
           { i, s, 'nums[i]': num, 'dp[i][s]': dp[i][s] });
    }
  }

  // ── 4. Check result ──
  snap([20, 21], [], `Check dp[${n}][${target}] = ${dp[n][target]}`, PHASE.CHECK, n, target, null, null,
       { 'dp[n][target]': dp[n][target] });

  if (!dp[n][target]) {
    snap([20, 21], [21], `dp[n][target] is False → no subset sums to ${target}`, PHASE.DONE, null, null, null, null,
         { result: '[]' });
    return steps;
  }

  // ── 5. Traceback ──
  const result = [];
  let remaining = target;
  snap([23, 24, 25], [], `Traceback: remaining=${remaining}, trace path through dp table`, PHASE.TRACE, null, null, n, remaining,
       { remaining, result: '[]' });

  for (let i = n; i > 0 && remaining > 0; i--) {
    const num = nums[i - 1];
    snap([26, 27], [], `  i=${i}: nums[${i}]=${num}, remaining=${remaining}`, PHASE.TRACE, null, null, i, remaining,
         { i, 'nums[i]': num, remaining });

    if (remaining >= num && dp[i - 1][remaining - num]) {
      result.push(num);
      remaining -= num;
      snap([27, 28, 29], [28, 29], `  Include ${num}! remaining → ${remaining}, result=[${[...result]}]`, PHASE.TRACE, null, null, i - 1, remaining,
           { i, 'nums[i]': num, remaining, result: `[${result}]` }, result);
    } else {
      snap([26, 27], [], `  Skip ${num} (not used)`, PHASE.TRACE, null, null, i - 1, remaining,
           { i, 'nums[i]': num, remaining });
    }
  }

  result.reverse();
  snap([31, 32], [32], `Done! Subset = [${result}], sum = ${result.reduce((a,b)=>a+b,0)}`, PHASE.DONE, null, null, null, null,
       { result: `[${result}]`, sum: result.reduce((a,b)=>a+b,0) }, result);

  return steps;
}
