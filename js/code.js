// code.js — pseudocode display + highlighting

const PSEUDO_LINES = [
  { text: "function subsetSum(nums, target):",              tag: "fn-def" },
  { text: "    n = length of nums",                         tag: "" },
  { text: "",                                               tag: "" },
  { text: "    # Build DP table (n+1 rows, target+1 cols)", tag: "cmt" },
  { text: "    dp = 2D table of False, size (n+1) x (target+1)", tag: "" },
  { text: "",                                               tag: "" },
  { text: "    # Base case: empty subset sums to 0",        tag: "cmt" },
  { text: "    for i from 0 to n:",                         tag: "" },
  { text: "        dp[i][0] = True",                        tag: "" },
  { text: "",                                               tag: "" },
  { text: "    # Fill the table row by row",                tag: "cmt" },
  { text: "    for i from 1 to n:",                         tag: "" },
  { text: "        for s from 1 to target:",                tag: "" },
  { text: "            # Option 1: exclude nums[i]",        tag: "cmt" },
  { text: "            dp[i][s] = dp[i-1][s]",              tag: "" },
  { text: "",                                               tag: "" },
  { text: "            # Option 2: include nums[i] if it fits", tag: "cmt" },
  { text: "            if s >= nums[i]:",                   tag: "" },
  { text: "                dp[i][s] = dp[i][s] OR dp[i-1][s - nums[i]]", tag: "" },
  { text: "",                                               tag: "" },
  { text: "    if dp[n][target] is False:",                 tag: "" },
  { text: "        return []    # no subset exists",        tag: "" },
  { text: "",                                               tag: "" },
  { text: "    # Traceback to find which numbers were used",tag: "cmt" },
  { text: "    result = []",                                tag: "" },
  { text: "    remaining = target",                         tag: "" },
  { text: "    for i from n down to 1:",                    tag: "" },
  { text: "        if remaining >= nums[i] AND dp[i-1][remaining - nums[i]]:", tag: "" },
  { text: "            result.append(nums[i])",             tag: "" },
  { text: "            remaining -= nums[i]",               tag: "" },
  { text: "",                                               tag: "" },
  { text: "    reverse(result)",                            tag: "" },
  { text: "    return result",                              tag: "" },
];

function buildCodePanel() {
  const pre = document.getElementById('code-pre');
  pre.innerHTML = PSEUDO_LINES.map((l, i) => {
    const safe = (l.text || ' ')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    let html = safe;
    // Colour keywords inline
    if (l.tag === 'cmt') {
      html = `<span class="code-cmt">${safe}</span>`;
    } else if (l.tag === 'fn-def') {
      html = safe
        .replace(/function/, '<span class="code-kw">function</span>')
        .replace(/subsetSum/, '<span class="code-fn">subsetSum</span>');
    } else {
      html = safe
        .replace(/\b(for|if|return|from|to|down|AND|OR|is|not)\b/g, '<span class="code-kw">$1</span>')
        .replace(/\b(True|False)\b/g, m => m === 'True'
          ? '<span class="code-bool-t">True</span>'
          : '<span class="code-bool-f">False</span>')
        .replace(/\b(\d+)\b/g, '<span class="code-num">$1</span>');
    }

    return `<span class="code-line" id="cl${i}">${html}</span>`;
  }).join('\n');
}

function highlightCodeLines(activeLines, changedLines) {
  PSEUDO_LINES.forEach((_, i) => {
    const el = document.getElementById('cl' + i);
    if (!el) return;
    el.className = 'code-line';
    if (changedLines && changedLines.includes(i))   el.classList.add('code-line--changed');
    else if (activeLines && activeLines.includes(i)) el.classList.add('code-line--active');
  });
  const first = activeLines && activeLines[0];
  if (first != null) {
    const el = document.getElementById('cl' + first);
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}
