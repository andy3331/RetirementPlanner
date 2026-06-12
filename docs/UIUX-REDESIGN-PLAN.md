# Retirement Planner — UI/UX Review & Redesign Plan

**Reviewer lens:** principal product designer (fintech dashboards / data-dense consumer tools)
**Date:** June 2026
**Scope:** full visual + interaction + information-architecture redesign. Engine, data model, and PRD guardrails (local-first, no backend, month-by-month sim) are untouched.

---

## Part 1 — Honest assessment of the current product

### What is genuinely strong (keep and amplify)

The *content* of this app is far beyond most consumer retirement tools — closer to ProjectionLab or Boldin than to a toy calculator:

- Bridge-to-401k-unlock modeling, ACA subsidy heuristics, SSA statement import with stop-work adjustment, withdrawal-strategy comparison, Monte Carlo, solver-backed "levers."
- The two-mode mental model — **reality tracking** ("Am I On Track?") vs **possibility space** ("What If?") — is a genuinely good IA idea. Most competitors blur these; this app separates them cleanly.
- Plain-English summary paragraphs already exist next to the math.
- Local-first privacy is a real differentiator worth surfacing in the UI as a trust cue, not a first-run banner about JSON file paths.
- Design tokens are already centralized in `styles.css`; light/dark both exist. Good bones for a re-skin.

The problem is not capability. It is that the presentation buries a strong engine under generic, exhausting chrome.

### The core UX problems

**P1. No hierarchy — everything shouts at the same volume.**
The Track tab is ~8,700px of stacked panels; What If is longer. Each panel contains a grid of identical cards, each card contains 4–8 identical key/value tiles with ALL-CAPS micro-labels. "Overall Status: Ahead" — the single thing the user came to learn — is the same visual weight as "Last Updated: 12 days ago." When 60 tiles are equally loud, nothing is heard. The user's actual question ("Can I retire at 55? Am I still okay?") is answerable in one sentence, and the UI never says that sentence first.

**P2. The "AI-generated" look (user-flagged, confirmed).**
The current design hits nearly every recognized tell of LLM-default styling:

| Tell | Where it appears |
|---|---|
| Cards nested in cards nested in tiles (3 levels deep) | Every panel on both tabs |
| Colored 3px left-border stripes on cards | Track status, limiting factors, action plan, strategy cards |
| ALL-CAPS 0.65rem gray micro-labels on every datum | ~100+ instances |
| Identical 2/3/4-column card grids as the only layout idea | `grid2/3/4` everywhere |
| Pill/ellipse status badges ("ON TRACK", "TARGET AGE HOLDS") | Squashed-oval badges, visually broken at some sizes |
| Callout/summary boxes under every section (`.sum`) | Every panel ends with one |
| Emoji in system UI ("⚡ Settings changed") | Recalc bar |
| Verbose hedging system-voice copy | Panel subtitles, summaries |
| Gradient hero + glassmorphism blur | Top bar, older design iterations |

These patterns read as "scaffolded, not designed." Removing them is necessary but not sufficient — the replacement needs a *positive* point of view (Part 2).

**P3. Stale-results workflow.**
Switching to What If presents dimmed, blurred content with a "Settings changed — results are out of date → Recalculate" bar. Manual recalculation is a 1990s spreadsheet pattern. The engine is pure local JS; there is no reason results shouldn't update live (debounced, in a worker). Today the user pays a tax of one click + a full-tab blur-out on every adjustment, which kills the explore-loop that the What If tab exists for.

**P4. Audience whiplash.**
Consumer-grade summary cards sit directly above a 21-column "Base-Plan Math Breakdown" audit table and a 24-column strategy audit. Both audiences are real (you want to *trust* the math), but interleaving them in one scroll makes the page feel like a debug dump. Audit belongs behind an explicit "inspect the math" door.

**P5. Charts are Chart.js defaults.**
- X-axes are labeled with dates ("Apr 2026, Oct 2027, Apr 2029…") rotated 45°, when the entire mental model of the app is **age** ("at 59.5, at 65, at 75"). Every competitor (ProjectionLab, Boldin, Empower) uses age on the x-axis.
- No annotations for the events the model is *about*: retirement age, 401k unlock, Medicare at 65, SS claim age.
- Two near-identical charts side-by-side with separate legends instead of one combined view with a toggle.
- Heavy gridlines, default legend chips, no direct labeling, no uncertainty bands (despite the app literally computing Monte Carlo percentiles).

**P6. Forms.**
The settings drawer is ~40 fields in one scroll, mixing core inputs (salary, target age) with deep policy esoterica (ACA subsidy rule, FPL baselines), with paragraph-length explainer text inline. Numeric fields are bare text inputs — no currency/percent formatting affordance, no steppers; redundant slider+text pairs for some fields but not others. Derived read-only fields look like inputs.

**P7. Mobile is effectively unsupported.**
Status cards stack into a full-width tower with huge dead space; the tab nav clips off-canvas; 21-column tables are unusable. Fine to be desktop-first; current state is desktop-only while pretending otherwise.

**P8. Trust & numeracy details.**
- False precision: "$926,791 at retirement" for a 10-year projection erodes credibility. Round projections (nearest $1k or $5k); keep precision only for *actuals* the user entered.
- Color semantics are diluted: amber is used both for warnings and for the informational "Inflation-adjusted (2.5%)" pill.
- Numbers are set in the body font without tabular figures, so columns of currency don't align.

**P9. Accessibility.**
Muted gray-on-dark micro-labels likely fail WCAG AA; status is conveyed by color + caps alone; canvas charts have no data alternative (the audit tables could serve this role if linked); no `aria-live` on recalculated results; sliders lack visible value/keyboard affordance polish.

---

## Part 2 — Comparable products & what to steal

| Product | What they do well | What we take |
|---|---|---|
| **ProjectionLab** (projectionlab.com) — widely cited as the best-designed planner in this space | Left-rail navigation of focused views; age-based timeline as the organizing metaphor; Sankey cash-flow charts; chips/cards used sparingly; advanced tax detail behind disclosure | Focused views instead of mega-scroll; age-axis everywhere; "plan canvas" feel; progressive disclosure of tax/ACA depth |
| **Boldin** (boldin.com, ex-NewRetirement; Overview redesigned May 2025) | One headline "plan accuracy/score" metric; optimistic/pessimistic bands on every projection; guided "next best action" list | Single verdict hero; confidence bands from the Monte Carlo we already compute; Action Plan as a ranked to-do list, not a card grid |
| **Empower retirement readiness** | One gauge + forecast band; everything else secondary | Verdict-first hierarchy |
| **Fidelity Retirement Score / Schwab** | One number (e.g., "on track score") as anchor for lay users | A single status sentence + score chip, with drill-down |
| **Copilot Money** (Apple Design Award finalist) / **Monarch** | Typography-driven design; tabular figures; one accent color; semantic color reserved for meaning; charts feel bespoke | Numeric type system; restraint; chart theming |
| **Linear / Stripe Dashboard** | Density without boxes-in-boxes: flat surfaces, dividers, typographic hierarchy; monochrome + one accent | De-card-ification strategy; sentence-case labels; calm tables |

---

## Part 3 — Redesign direction ("what it should feel like")

**Design stance, in one paragraph:** An instrument, not a brochure. Calm, editorial, numerate — closer to a well-typeset annual report than a SaaS marketing dashboard. One surface level, one accent color, typography does the hierarchy, color only ever means status, and the single most important sentence in the product ("You're on track to retire at 55, with 6% cushion") is the first and largest thing on screen.

### 3.1 Information architecture

Replace the two mega-tabs with **four focused views** plus an inspector. Keep the reality/possibility split as the top-level mental model:

```
┌─ Top bar ───────────────────────────────────────────────┐
│  Plan for [Name]        Today · Explore · History · Data │
└──────────────────────────────────────────────────────────┘

TODAY (verdict + drivers; replaces "Am I On Track?")
  · Hero verdict sentence + status
  · Three drivers: Bridge / 401k / Healthcare drag (flat stat rows)
  · Progress chart (one, combined, age axis)
  · Ranked action list (solver levers, as a list not cards)

EXPLORE (replaces "What If?")
  · Persistent left control rail: scenario, age slider, blends, strategy
  · Live results canvas: verdict delta, comparison table, charts
  · Saved scenarios as chips across the top
  · Monte Carlo as a fan-chart section with success gauge

HISTORY
  · Balance snapshots, comp/contribution timeline, changes matrix
  (Today keeps only "last snapshot" provenance chip)

DATA / AUDIT
  · Base-plan math table, strategy audit, tax/MAGI worksheet,
    export/import, print. Linked contextually from any number
    ("inspect this math →")

Settings stays a drawer but is re-grouped (see 3.6).
```

Hash-based routing (`#today`, `#explore`…) keeps the no-build, no-framework constraint.

### 3.2 Layout system (de-card-ification)

- **One surface level.** The page background is the only background; sections are separated by whitespace and 1px hairline dividers, not boxes. A "card" (border + radius + padding) is reserved for exactly two things: saved-scenario chips and the hero verdict block.
- Key/value tiles → **stat rows**: label left, value right, hairline between rows, tabular figures aligned. Dense, scannable, zero chrome.
- Comparison content (withdrawal strategies, blend A vs B, scenario vs base) → **real tables** with sticky first column, not card grids. A 5-strategy × 8-metric comparison is a table; cards hide the comparability.
- Asymmetric layouts: content column + narrow context rail, instead of symmetric 4-up grids.
- Radius 6–8px where surfaces exist; shadows only on overlays (drawer, modal, popover).

### 3.3 Typography & numbers

- **Type system:** one sans for UI (e.g., system stack or Inter/IBM Plex Sans self-hosted — no CDN), with `font-variant-numeric: tabular-nums lining-nums` on every numeric context. Optionally a serif or humanist display face *only* for the hero verdict sentence to give the product a face that AI-default UIs never have.
- **Scale:** 4 sizes + 2 weights, period. (~32/20/15/13). Sentence case everywhere. ALL-CAPS eliminated except (optionally) one eyebrow style at 11px/+0.06em used max once per view.
- **Number rules:** actuals exact ($86,500); projections rounded ($927k); percents 1 decimal; ages 1 decimal only when fractional. One utility (`fmtMoney`, `fmtPct`, `fmtAge`) enforces this everywhere.

### 3.4 Color

- Neutral ramp (warm gray for light, blue-gray for dark) + **one brand accent (the existing teal)** + three semantic colors (ok/warn/bad) used *only* for plan status — never decoratively.
- Status indicators: small dot + sentence-case text ("● On track"), replacing oval badges and colored left borders.
- Charts: brand teal for "actual," neutral dashed for "plan," semantic only at threshold crossings. Monte Carlo band in 8–12% alpha teal.
- Both themes re-derived from the same ramp; kill the cream-vs-navy split personality (current light mode is beige/teal, dark is navy/cyan — they feel like different products).

### 3.5 Charts (highest visual-impact change)

1. **Age on the x-axis** (41 → 90), ticks every 5 years, "today" as a labeled vertical rule.
2. **Event annotations:** retirement age, 401k unlock (59.5), Medicare (65), SS claim — labeled vertical markers. These are the plot points of the user's story; the chart should tell it.
3. **One combined progress chart** on Today (total + per-account toggle) instead of two side-by-side near-duplicates.
4. **Direct labeling** at line ends; no legend chips.
5. **Uncertainty band** (P10–P90 from existing Monte Carlo) behind the base-plan line — this is the Boldin pattern and we already compute the data.
6. Monte Carlo → **fan chart** + a single large success-probability number.
7. Strip gridlines to ~4 horizontal hairlines; remove vertical gridlines; y-axis in $k/$M.
8. Theme via one shared Chart.js config object (we keep Chart.js; no new deps).

### 3.6 Interaction model

- **Kill manual Recalculate.** Move the engine call into a Web Worker (engine is already pure functions in `app.js`; extract to `engine.js` imported by both worker and tests). Debounce inputs ~200ms; show a 150ms shimmer on affected numbers only; `aria-live="polite"` announce the new verdict. The blur-overlay + recalc bar is deleted.
- **Explore = live levers.** Age slider and key inputs in the persistent rail update the verdict line instantly: "Retire at 53 → bridge holds, +$129k at 75 vs base." The delta *is* the product.
- **Progressive disclosure:** audit tables, ACA policy internals, tax worksheets live behind "Inspect →" links that open the Data view scrolled to the right table, or a slide-over inspector. Every headline number gets a quiet "how is this computed?" affordance — that's the trust story.
- **Settings drawer** re-grouped into: *Profile* · *Income & contributions* · *Retirement targets* · *Market assumptions* · *Healthcare (Advanced)* · *Social Security*. Advanced groups collapsed by default. Explainer paragraphs become `?` popovers with a one-line summary + "learn more" expansion. Currency/percent inputs get formatting on blur and prefix/suffix adornments.
- **First-run:** replace the JSON-file banner with a 3-step inline setup (age & target → balances → salary/contributions) that fills the verdict hero as you type. The file-path detail moves to Data view.

### 3.7 Copy system

- Verdict-first: every view opens with a sentence a human would say. "You're on track to retire at 55." / "If you retired at 53 instead, you'd have $129k more at 75."
- Rename tabs: "Am I On Track?" → **Today**; "What If?" → **Explore**.
- Glossary treatment for jargon (bridge, unlock, MAGI, drag): first use per view gets a dotted-underline popover. Keep the terms — they're good — define them once.
- Delete hedging boilerplate from subtitles ("Solver-backed levers that would help clear the current target-age plan" → "What would help most").
- No emoji in system UI.

### 3.8 Mobile & accessibility

- Stat rows and tables degrade naturally (rows stay rows; tables get pinned first column + horizontal scroll, or collapse to per-row summaries).
- Bottom tab bar on <640px; hero verdict remains the first screenful with zero dead space.
- WCAG AA contrast audit on the new ramp; visible focus rings; `prefers-reduced-motion` respected; charts paired with "view as table →" links into the Data view (the audit tables become the accessible alternative, turning P4's liability into an asset).

---

## Part 4 — Execution plan

Each phase is independently shippable; engine behavior is frozen (existing `tests/` must pass unchanged throughout). Validate each phase with headless-Chrome screenshot passes (light + dark + 390px mobile) like the ones used for this review.

**Phase 0 — Foundations (no visible change)**
- Extract pure engine functions from `app.js` into `engine.js`; load it from both the page and a new worker shim. Run existing tests against it.
- Add formatting utilities (`fmtMoney/fmtPct/fmtAge`) and the new design tokens (type scale, spacing, neutral ramp, semantic colors) alongside the old ones.
- Build the shared Chart.js theme object.
- Exit: tests green, app pixel-identical.

**Phase 1 — IA shell**
- Hash routing, four views (Today/Explore/History/Data), top bar redesign, move existing panels into their new homes *unstyled*. Settings drawer regrouping.
- Exit: nothing lost (checklist against `docs/FEATURES_AND_PRD.md` feature list), every section reachable in ≤2 clicks.

**Phase 2 — Today view**
- Hero verdict block, three driver stat-groups, ranked action list, single combined progress chart with age axis + annotations + Monte Carlo band, provenance chip ("Balances as of June 11 · Update").
- Delete: 5-card status strip, milestone pills, duplicated per-account charts, `.sum` callouts.

**Phase 3 — Live recalculation**
- Engine in worker, debounced recompute, per-number shimmer, delete recalc bar/overlay. `aria-live` verdict announcements.

**Phase 4 — Explore view**
- Left control rail (scenario, age slider, blends, strategy, MC settings), saved-scenario chips, verdict delta line, strategy comparison as a table, MC fan chart + success gauge, action list.
- Delete: blend card grids, strategy card grids, oval badges, per-section summaries (fold into verdict + table).

**Phase 5 — History & Data views**
- History: snapshot/comp timelines as clean tables with sparkline deltas.
- Data: audit tables with sticky headers/first column, $k formatting, row hover; "inspect →" links from Today/Explore numbers; export/import/print. Print stylesheet refresh (verdict + key tables).

**Phase 6 — Settings & forms**
- Adorned numeric inputs, popover help, advanced-group collapse, inline validation, derived fields visually distinct, first-run setup flow.

**Phase 7 — Mobile + a11y + theme polish**
- Bottom nav, responsive tables, contrast audit, focus states, reduced motion, dark/light parity QA, delete all dead CSS from the old system.

**Suggested order of value if time-boxed:** 2 → 3 → 4 (the verdict hero, live recalc, and chart overhaul deliver ~80% of the perceived redesign).

---

## Part 5 — Anti-"AI-slop" guardrails (apply during every phase)

A removal checklist is not a design, but these rules keep the new one honest:

1. One background surface per view; if you're about to wrap something in a rounded box, try a divider + heading first.
2. No colored left-border stripes. Status = dot + words.
3. No ALL-CAPS labels below 12px. Sentence case by default.
4. Max one accent color; semantic colors only for plan health.
5. No gradients, no glassmorphism, no backdrop blur (drawer scrim excepted).
6. No emoji in UI chrome.
7. Numbers in tabular figures, aligned, with one precision rule per number class.
8. Every grid of ≥3 identical cards must justify why it isn't a table or a list.
9. Charts must name the user's life events, not calendar dates.
10. Copy leads with the answer, not the methodology.

---

## Implementation status (June 11, 2026)

**Done — Phases 0–3:**
- New design system in `styles.css`: warm-paper light / blue-gray dark ramps, one teal accent, semantic color reserved for status, 4-size type scale, tabular numerals everywhere, flat panels with hairline dividers, dot-style status badges, segmented scenario toggles, no gradients/blur/shadows except overlays.
- IA shell: four views (Today `#today`, Explore `#explore`, History `#history`, Data `#data`) with hash deep-links. Internal tab keys remain `track`/`whatif` for engine/test compatibility.
- Today view: verdict hero ("You're on track to retire at 52"), status dot + delta line, inline stat strip (coverage, target, balances-as-of provenance), de-carded stat-row sections, sentence-case copy.
- Charts: age-based x-axis (ticks every 5 years), life-event markers (today / retire / 401k unlock), no legends, 4 hairline gridlines, $k/$M axis, plan-vs-actual in accent + neutral dash.
- Live recalculation: the Recalculate bar and ⚡ stale-state are gone; Explore changes debounce ~300 ms into an auto-render with Monte Carlo quick-mode while adjusting.
- Dev preview isolation: `server.js` honors `DATA_DIR`; `.claude/launch.json` (in this repo) runs port 3457 against gitignored `data-dev/` so the App-Master-managed Docker instance on 3456 and the real `data/` file are untouched.
- Tests: 23/26 passing — identical to the pre-redesign baseline (the 3 failures are pre-existing Monte Carlo assertions).

**Done — Phases 4–7 (same day):**
- Explore: sticky left control rail (scenario presets, age slider, portfolio blends as a disclosure, withdrawal-strategy + optimization controls, Monte Carlo settings, saved scenarios) with the results canvas alongside; strategy comparison converted from a card grid to a full-width table (strategies as rows, dot statuses, tag line, selected-row highlight); Monte Carlo chart gains a p10–p90 confidence band; every chart color now reads from theme tokens (`chartColor()/chartColorA()` helpers), so light/dark stay in sync.
- History & Data: clean tables, sticky first column on wide audit tables (Data view + strategy audit/tax worksheets).
- Settings drawer: regrouped to Profile / Contributions / Base plan / Social Security with Healthcare & ACA behind an "advanced" disclosure; the wall-of-text ACA explainer condensed to one short note; first-run banner rewritten as a privacy statement instead of a file-path notice.
- Accessibility/mobile: flex/grid min-width overflow fixes, scrollable tab nav, `prefers-reduced-motion`, contrast bump on muted text, `aria-live` on the hero verdict and scenario note, dead CSS removed.

**Polish backlog — done:** Explore opens with a verdict-delta sentence ("Waiting until 55 holds in this scenario — about $3.03M combined at 75, +$1.67M vs your base age 52") using approximate-money formatting per the precision rules; Today links into the Data view ("See the year-by-year math →", wired through hash routing); print stylesheet refreshed (control rail and buttons hidden, one view per page, audit tables shrink to sheet width); first run auto-opens Plan Settings; phones get a fixed bottom tab bar (safe-area aware); focus-visible outlines on all interactive elements. A latent test-harness bug was fixed along the way: `tests/helpers.js` injected app.js via `String.replace`, which treats `$$`/`$&` in the replacement as escape sequences and silently mangled the injected source (it had been consistently renaming the `$$` DOM helper — harmless until the new `$${...}` templates exposed it).

**Deferred by choice:** adorned $/% input affixes (the engine parses raw numeric strings; affixes need a parse layer first) and the optional single combined progress chart on Today.

**Tooling notes:** screenshot helper `__review_shot.html` (gitignored) + headless Chrome. Windows clamps `--window-size` to ~482px min width — use the helper's `?w=390` iframe mode for true mobile shots, and `?theme=light` to force light tokens. Explore screenshots often catch the "Calculating…" overlay because Monte Carlo runs longer than the virtual-time budget; the layout beneath is still rendered.

## Appendix — Review evidence

- Live app reviewed at 1440px (Track + Explore tabs, settings drawer) and 390px mobile, dark theme, via headless Chrome against the local server; historical light/dark screenshots in `docs/screenshots/`.
- Code reviewed: `index.html` (1,093 lines), `styles.css` (1,312), `app.js` (9,270), `server.js`, `docs/FEATURES_AND_PRD.md`.
- Comparator references: ProjectionLab, Boldin (May-2025 Overview redesign), Empower, Fidelity Retirement Score, Copilot Money, Monarch, Linear/Stripe dashboard idioms.
