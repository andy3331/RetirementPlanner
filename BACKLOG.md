# Backlog

Items captured for future consideration but not yet scheduled.

---

## Social Security Estimator Enhancement

**Context:** Currently the app requires users to manually enter their monthly SS benefit at age 62 and FRA. Many users won't know these numbers without looking up their SSA statement.

**Proposed improvement:** Add an income-based estimate using the SSA bend-point formula. User would enter career average annual earnings; the app would estimate their FRA monthly benefit using the current bend-point thresholds and then adjust for claim age (62 = ~70%, FRA = 100%, 70 = 124%).

**Notes:**
- Bend points change annually; would need to either hardcode a recent year's values or allow user to input
- Could be a collapsible "estimate my benefit" helper in the SS section of Plan Settings
- Output pre-fills the `ss62` and `ssFRA` fields but leaves them editable
- Lower priority since the current manual-entry approach works fine for users who have checked their SSA account

---
