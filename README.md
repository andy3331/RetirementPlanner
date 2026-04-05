# Retirement Planner

A personal retirement planning tool for modeling:

- Current brokerage and 401k balances
- Ongoing contributions and employer match
- Bridge viability before 401k unlock
- Social Security timing
- Brokerage portfolio comparisons using two editable ETF/stock blends
- Balance history and contribution-history tracking over time
- Scenario modeling (Bull, Crash, Custom, named saves)
- Monte Carlo scenario stress testing
- Inflation-adjusted projections

Runs as a local Node.js server. All data stays on your machine.

---

## Quick Start

```bash
npm install
npm start
```

Then open **http://localhost:3456** in your browser.

---

## Your Data File

On first launch the app creates **`data/planner-data.json`** in this project folder. This file stores all of your personal numbers — balances, salary, contributions, history, scenarios, everything.

**Important things to know:**

- `data/` is in `.gitignore` — it will never be committed to Git, even if you push this repo.
- The file is plain JSON. You can open it, read it, back it up, or copy it to another machine.
- If you share this project with someone else, they get a clean slate. Their data file is theirs, yours is yours.
- To back up your data: copy `data/planner-data.json` somewhere safe (cloud drive, USB, etc.).
- To restore: place your backup file back at `data/planner-data.json` and restart the server.
- To move to a new machine: copy the whole project folder, or just copy `data/planner-data.json` into a fresh clone.

You can also **export** a dated JSON snapshot or **import** a backup from the Settings drawer inside the app.

---

## Privacy

This repository is safe to share publicly.

- No personal balances, salary, retirement age, spend target, contribution settings, or holdings are stored in any tracked file.
- The defaults in the app are generic sample values only.
- Your actual data lives only in `data/planner-data.json`, which is gitignored.

---

## How the Plan Works

The app runs a month-by-month simulation in three phases:

1. **Accumulation** — from today to your target retirement age, compounding contributions
2. **Bridge** — from retirement to 401k unlock, drawing down from brokerage
3. **Post-unlock drawdown** — 401k funds withdrawals first; Social Security reduces the draw starting at claim age

It compares two brokerage blend paths side by side so you can model how different portfolio mixes change retirement timing and longevity.

### Planning Assumptions

- Brokerage is the bridge account from retirement to 401k unlock
- 401k compounds with its own return assumptions, stops receiving contributions at retirement, and stays untouched until unlock age
- After unlock, withdrawals come from the 401k first
- Remaining brokerage balance after unlock stays invested as reserve capital
- Social Security reduces the required portfolio draw at the selected claim age
- Inflation adjustment (if enabled) reduces the real purchasing power of nominal returns

---

## Using the App

1. Run `npm start` and open **http://localhost:3456**
2. Click **Plan Settings** (top right) to enter your profile, contributions, and return assumptions
3. Click **Update Balances** to record today's account balances
4. Use the **Brokerage Path Builder** on the What If? tab to configure your two portfolio blends
5. Review the **Am I On Track?** tab for your current progress against the base plan
6. Use the **What If?** tab to stress-test scenarios

---

## Brokerage Path Builder

Each blend has two ticker slots, a split %, and a per-holding expected return. The weighted blended return drives the projection engine. The **Try auto-fill returns** button fetches recent CAGR estimates from a public data source — useful as a starting point but always verify and adjust manually.

---

## Scenario Modeling

Three built-in scenarios (Bull Case, Tech Crash, Custom) plus up to **5 named saved scenarios** you can label, configure, and switch between. Named scenarios are stored in your data file.

The What If tab also includes a **Monte Carlo** panel. It uses randomized monthly returns around your selected scenario assumptions to estimate success odds to ages 90, 95, and 100, plus percentile balance paths. These outputs are scenario-only and do not affect the deterministic `Am I On Track?` view.

---

## Data Management

From the **Settings drawer**:

- **Export data** — downloads a dated JSON snapshot of your full data file
- **Import data** — uploads a JSON backup to replace your current data file
- **Reset defaults** — wipes your data file back to generic sample values

---

## Running in Development

```bash
npm run dev
```

Uses Node's built-in `--watch` flag to restart the server automatically on file changes.

---

## Dependencies

- [Express](https://expressjs.com/) — local HTTP server and API
- [Chart.js](https://www.chartjs.org/) — loaded from CDN for charts

---

## Product Spec

For feature requirements and regression tracking, see [`docs/FEATURES_AND_PRD.md`](docs/FEATURES_AND_PRD.md).
