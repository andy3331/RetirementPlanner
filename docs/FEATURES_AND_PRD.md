# Retirement Planner PRD And Feature Guardrails

## Purpose

This document is the long-term reference for the retirement planner.

Use it before making product, UX, or technical changes so future updates do not accidentally remove or weaken existing functionality.

## Product Summary

The app is a single-file, browser-only retirement planning tool that helps a user:

- track current brokerage and 401k balances
- model early retirement viability
- compare two different brokerage portfolio blends
- estimate bridge survival until 401k access
- estimate post-unlock longevity with a defined withdrawal order
- incorporate Social Security timing
- track historical balance, salary, and contribution changes over time

The planner runs fully in the browser with no backend.

## Core Product Principles

These are non-negotiable unless intentionally changed and reviewed.

1. The app must run locally in the browser with no backend requirement.
2. User data must remain local by default.
3. Inputs must persist via `localStorage`.
4. The planner must support side-by-side brokerage path comparison.
5. The simulation must remain month-by-month, not annual-only.
6. Balance history and contribution-history tracking must remain available.
7. Public repository defaults must remain sanitized and must never contain a real user’s financial data.

## Privacy Requirements

These are especially important.

1. Tracked files must never contain a real user’s:
   - salary
   - balances
   - retirement age
   - spending target
   - holdings
   - contribution settings
   - employer match details
   - Social Security values
2. Public screenshots must use sanitized example values only.
3. Real user data should only live in browser `localStorage` unless the user explicitly exports or shares it.
4. Future GitHub updates must preserve this sanitation rule.
5. Do not hard-code personal portfolio holdings into repo defaults.

## Current Architecture

### App shape

- Single file: `index.html`
- Embedded CSS
- Embedded JavaScript
- Charting via Chart.js CDN
- No build tools
- No framework dependency

### Persistence

The app currently uses `localStorage` to persist:

- current form state
- balance history
- assumption / contribution history

### Data safety note

The repository contains only generic sample defaults.
Actual user data is expected to live in browser storage only.

## Main Functional Areas

### 1. Current state inputs

The app must support editable inputs for:

- current date
- date of birth
- current age
- current brokerage balance
- current 401k balance

Expected behavior:

- `current date` auto-populates from the system date on load
- `date of birth` and `current age` should stay connected
- editing age should backfill DOB
- editing DOB should recompute age

### 2. Contribution inputs

The app must support:

- monthly brokerage contribution
- 401k contribution % of salary
- annual salary
- employer match %

Expected behavior:

- values are editable inline
- values are auto-saved
- estimated monthly total 401k contribution is displayed live

### 3. Retirement assumption inputs

The app must support:

- target retirement age
- annual retirement spend
- 401k unlock age
- brokerage accumulation return inputs derived from portfolio blends
- post-retirement drawdown return
- 401k accumulation return
- 401k post-retirement growth rate

### 4. Social Security inputs

The app must support:

- age 62 monthly benefit
- full retirement age monthly benefit
- claim age selection

Expected behavior:

- claim-age-adjusted SS amount is shown live

### 5. Brokerage blend builder

The app must support two editable brokerage comparison paths:

- `Primary blend`
- `Alternative blend`

Each blend currently supports:

- two ticker inputs
- two weight inputs
- two holding-level return inputs
- one blended accumulation return

Expected behavior:

1. The user can replace hard-coded ETFs with their own tickers.
2. The blended return is computed from holding returns and weights.
3. The primary and alternative labels must flow through cards, charts, and summaries.
4. Manual return entry must always work.
5. Auto-fill return lookup is best-effort only and must never block core planner functionality.

### 6. Scenario system

The app must support:

- Bull case
- Tech crash
- Custom
- Monte Carlo stress testing

Expected behavior:

- scenario selection updates both portfolio comparison paths
- custom scenario allows manual return override
- scenario description text updates live
- Monte Carlo stays in the What If view and must not change the base-plan on-track review
- Monte Carlo should report probability-based outcomes separately from deterministic outputs

### 7. Simulation engine

The app must remain month-by-month and preserve three phases:

#### Phase 1: Accumulation

From current age to retirement age:

- brokerage compounds monthly
- brokerage receives monthly contribution
- 401k compounds monthly
- 401k receives employee contribution plus employer match

#### Phase 2: Bridge

From retirement age to unlock age:

- brokerage compounds using post-retirement rate
- brokerage funds monthly spending
- 401k continues growing untouched
- viability requires brokerage survival to unlock age

#### Phase 3: Post unlock

From unlock age onward:

- withdrawals default to 401k first
- brokerage may remain invested as a reserve if it survives the bridge
- Social Security is added starting at claim age
- monthly withdrawals continue net of SS
- longevity is the age at which the remaining retirement assets hit zero, if they do

### 8. Viability outputs

The app must continue showing:

- earliest viable retirement age
- brokerage at retirement
- 401k at retirement
- brokerage at unlock age
- 401k at unlock age
- combined balance at unlock age
- 4% withdrawal estimate
- annual gap or surplus vs spend
- portfolio longevity age

### 9. Target-age status

The app must show whether the selected target retirement age is bridge-viable for each comparison path.

### 10. Charts

The app must support:

- brokerage bridge chart
- 401k path chart
- retirement cash-flow chart
- Monte Carlo percentile path chart

Expected behavior:

- charts must not break page layout
- if charts fail, the planner must still function
- fallback messaging should appear if chart rendering fails
- the brokerage bridge chart must compare brokerage blend paths against the bridge requirement
- the 401k chart must use only 401k assumptions and must not vary by brokerage blend
- the retirement cash-flow chart must show Social Security, 401k withdrawals, brokerage withdrawals, and spend clearly enough for monthly review
- the Monte Carlo chart must remain scenario-only and display percentile paths rather than actual-history balances

### 11. Balance history

The app must support:

- adding balance snapshots
- editing snapshots
- deleting snapshots
- showing last-updated status

Expected behavior:

- latest relevant balance history drives the current starting balances
- balance history remains visible in the UI

### 12. Contribution / assumption history

The app must support tracked history for:

- monthly brokerage contribution
- annual salary
- 401k contribution %
- employer match %

Expected behavior:

- entries are stored with a date
- changes appear in the contribution-history table
- future development should preserve this history instead of collapsing it into one current value only

### 13. Change metrics

The app must keep:

- monthly change
- 1-year change
- lifetime change

These currently reflect balance-history comparisons.

## UX Requirements

The app should remain:

- mobile responsive
- printable
- usable without a backend
- understandable without technical knowledge

Important UI expectations:

1. Inputs should be grouped logically.
2. Summary text should explain the result in plain English.
3. Color coding should communicate viability clearly.
4. Sliders and text inputs must remain synchronized.
5. The planner must remain usable even if optional extras like charts or auto-fill fail.

## Default / Example Data Policy

Public defaults should be generic examples only.

They should:

- look realistic enough to demonstrate the product
- avoid representing any private real-world user
- avoid personal portfolio fingerprints

If defaults are changed in the future, verify:

1. they are not copied from a real user profile
2. screenshots are regenerated if necessary
3. README language still matches the current app behavior

## Known Implementation Decisions

These are current product decisions that future updates should respect unless intentionally changed:

1. `Current date` refreshes to the system date on load.
2. The planner is local-first and browser-only.
3. Auto-filled return lookup is not guaranteed because `file://` browser CORS behavior is inconsistent.
4. Manual return entry is the reliable source of truth for portfolio assumptions.
5. The comparison engine currently supports two holdings per brokerage blend.
6. Balance-history edit/delete capability is supported.
7. Contribution-history display exists, but future work may improve true forward-dated assumption replay.
8. After unlock, the default withdrawal policy is `401k first`, with leftover brokerage preserved as reserve capital until needed.
9. The 401k planning chart is intentionally independent of the brokerage blend comparison.

## Future Improvement Ideas

These are reasonable future enhancements, but they should not remove current behavior.

- support more than two holdings per brokerage blend
- add a dedicated effective-date modal for contribution-history changes
- improve assumption replay so different contribution settings can apply over different time periods more explicitly
- add import/export of local plan data
- support local chart fallback without CDN dependency
- add custom named scenarios
- support inflation-adjusted spending assumptions
- add a Social Security stop-work estimator mode that reduces benefits when work stops before claim age
- support importing or manually entering SSA yearly earnings history to improve stop-work estimates

## Regression Checklist

Before merging changes, verify:

1. The page still opens directly via `file://`.
2. Inputs still auto-save and reload from `localStorage`.
3. `Current date` still auto-populates from the system date.
4. DOB and age still stay in sync.
5. Both brokerage blend paths still render and compare correctly.
6. The app still supports manual return entry.
7. Simulation outputs still appear for both comparison paths.
8. The 401k chart is the same regardless of brokerage blend selection, unless 401k assumptions themselves change.
9. Charts do not stretch the page vertically.
10. Balance history still renders and can be edited/deleted.
11. Contribution-history tracking still renders.
12. Monthly / 1-year / lifetime change cards still display.
13. Public tracked defaults are still sanitized.
14. Public screenshots do not contain private user data.
15. README still matches the actual UI.

## Change Management Guidance

When making updates:

1. Read this file first.
2. Identify which requirements are affected.
3. Verify no privacy rules are being weakened.
4. Re-test the regression checklist.
5. Update this file if product behavior intentionally changes.
