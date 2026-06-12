# Backlog

Items captured for future consideration but not yet scheduled.

---

## Social Security Estimator Enhancement

**Context:** The app now supports manual SS inputs and SSA statement XML import with a statement-based stop-work adjustment. The next realism upgrade is a fuller benefit engine that computes the estimate from earnings directly rather than calibrating from the imported statement estimate.

**Proposed improvement:** Add a deeper income-based estimate using the SSA bend-point formula. User would enter or import yearly earnings; the app would estimate the FRA monthly benefit from indexed earnings and then adjust for claim age (62 = ~70%, FRA = 100%, 70 = 124%).

**Notes:**
- Bend points change annually; would need to either hardcode a recent year's values or allow user to input
- Could use the imported SSA XML earnings history as the primary input source
- Could expose a yearly earnings editor for manual corrections
- Would replace the current top-35 proxy with a closer SSA-style estimate

---

## Tax-Aware Withdrawal Engine

**Context:** The app now supports a simple tax-aware What If strategy that tries to cap annual 401k withdrawals before leaning harder on brokerage. That is directionally useful, but it is not a full tax optimizer.

**Proposed improvement:** Add a more complete withdrawal engine that can account for federal ordinary-income brackets, capital-gains treatment and basis, ACA subsidy cliffs, state taxes, and later-life Medicare/tax effects.

**Notes:**
- The current heuristic should stay clearly labeled as heuristic until a fuller model exists
- Brokerage-first vs 401k-first recommendations can change materially once taxes are modeled
- A future version should report recommendation confidence based on data completeness and tax assumptions

---
