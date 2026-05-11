# Subset Sum Visualizer

An interactive, step-by-step visualization of the Subset Sum dynamic programming algorithm. Watch the DP table fill cell by cell, see exactly which cells are being referenced at each decision, and trace back the final subset.

> **Note:** This project was created for **school/educational purposes** and was generated with the assistance of AI (Claude by Anthropic).

---

## What it does

- Steps through the subset sum DP algorithm one operation at a time
- Highlights the exact pseudocode line currently executing
- Shows the full DP table with color-coded cells at every step:
  - Which cell is currently being written
  - Which cells are being read for the exclude/include decision
  - Which cells are part of the traceback path
- Displays live updates to the `nums[]` array, `result[]` subset, and key variables
- Lets you edit the input array and target sum, then replay

## How to run

No installation or server required. Just open `index.html` in any modern browser.

```
double-click index.html   →   opens in browser
```

## Controls

| Action | How |
|---|---|
| Step forward | Click **Next →** or press `→` / `L` |
| Step backward | Click **← Prev** or press `←` / `H` |
| Auto-play / pause | Click **▶ Auto** or press `Space` |
| Reset | Click **↺ Reset** or press `R` |
| Change input | Edit the nums array and target in the **Edit Input** panel, then click **Apply & Run** |
| Change speed | Drag the Speed slider (80 ms – 1800 ms per step) |

## DP table color legend

| Color | Meaning |
|---|---|
| **T** (green) | `dp[i][s] = True` — a valid subset exists |
| **F** (red) | `dp[i][s] = False` — no valid subset |
| Blue border | Current cell being computed |
| Blue tint | Cell being read for the **exclude** option (`dp[i-1][s]`) |
| Green tint | Cell being read for the **include** option (`dp[i-1][s - nums[i]]`) |
| Purple | Traceback path cell |
| `·` | Not yet computed |

## Input format

- **nums array** — comma-separated non-negative integers, e.g. `3, 34, 4, 12, 5, 2`
- **Target sum** — a non-negative integer, e.g. `9`
- Maximum 12 numbers and target ≤ 200 for readable table sizing

## Project structure

```
subset-sum-visualizer/
├── index.html          — entry point, HTML layout
├── README.md           — this file
├── LICENSE             — MIT license
├── css/
│   ├── base.css        — design tokens, reset, typography
│   ├── layout.css      — header and main grid
│   ├── panels.css      — all panel interiors and code highlight
│   ├── controls.css    — buttons, range slider
│   └── table.css       — DP table cell styles and legend
└── js/
    ├── subsetsum.js    — step generator (records every state + reference cells)
    ├── code.js         — builds and highlights the pseudocode panel
    ├── table.js        — builds and updates the DP table DOM
    ├── ui.js           — renders nums chips, result chips, variables
    └── app.js          — main controller, wires everything together
```

## Algorithm

The subset sum problem asks: given a set of non-negative integers and a target value, does any subset sum exactly to that target? If so, which elements form that subset?

**Approach:** Bottom-up dynamic programming.

- Build a `(n+1) × (target+1)` boolean table where `dp[i][s]` means "can we form sum `s` using only the first `i` numbers?"
- Base case: `dp[i][0] = True` for all `i` (empty subset sums to 0)
- Recurrence: `dp[i][s] = dp[i-1][s]` (exclude) OR `dp[i-1][s - nums[i]]` (include, if `s ≥ nums[i]`)
- Traceback: walk backwards through the table to reconstruct which elements were included

**Time complexity:** O(n × target)  
**Space complexity:** O(n × target)

## Disclaimer

This project was built as a learning tool for academic purposes. It was created with the assistance of AI and is not intended for production use.
