# Retirement Planner

A personal retirement planning tool for modeling:

- Current brokerage and 401k balances
- Ongoing contributions and employer match
- Bridge viability before 401k unlock
- Social Security timing, including SSA Statement XML import
- Brokerage portfolio comparisons using two editable ETF/stock blends
- Balance history and contribution-history tracking over time
- Scenario modeling (Bull, Crash, Custom, named saves)
- Withdrawal strategy comparison after 401k unlock
- Savings-strategy suggestions for brokerage vs 401k contributions
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
3. **Post-unlock drawdown** — the default is 401k-first, but the What If tab can compare 401k-first, brokerage-first, pro-rata, brokerage-reserve, and a simple tax-aware heuristic; Social Security reduces the draw starting at claim age

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
3. In **Social Security**, choose either manual inputs or **SSA statement XML** mode
4. If using statement mode, import your SSA XML file so the planner can adjust benefits when retirement age stops future earnings before claim age
5. Click **Update Balances** to record today's account balances
6. Use the **Brokerage Path Builder** on the What If? tab to configure your two portfolio blends
7. Review the **Am I On Track?** tab for your current progress against the base plan
8. Use the **What If?** tab to stress-test scenarios

---

## Brokerage Path Builder

Each blend has two ticker slots, a split %, and a per-holding expected return. The weighted blended return drives the projection engine. The **Try auto-fill returns** button fetches recent CAGR estimates from a public data source — useful as a starting point but always verify and adjust manually.

---

## Scenario Modeling

Three built-in scenarios (Bull Case, Tech Crash, Custom) plus up to **5 named saved scenarios** you can label, configure, and switch between. Named scenarios are stored in your data file.

The What If tab also includes a **Monte Carlo** panel. It uses randomized monthly returns around your selected scenario assumptions to estimate success odds to ages 90, 95, and 100, plus percentile balance paths. These outputs are scenario-only and do not affect the deterministic `Am I On Track?` view.

It also includes:

- **Withdrawal Strategy Comparison** — compare different post-unlock draw orders
- **Savings Strategy Suggestions** — estimate the brokerage or 401k contribution levels needed to keep a chosen retirement age viable under the selected strategy

The tax-aware mode is intentionally heuristic: it tries to keep annual 401k withdrawals near a user-set cap before leaning harder on brokerage, but it does **not** model full federal/state taxes, ACA cliffs, basis lots, or RMDs.

---

## Social Security Modes

The planner now supports two Social Security input modes:

- **Manual**: you enter monthly benefits at age 62 and full retirement age
- **SSA statement XML**: you import the machine-readable SSA statement and the planner uses the statement estimates plus imported earnings history

In statement mode, the planner reduces the imported benefit when your retirement age implies you stop covered work before claim age. This uses a **top-35 earnings proxy** based on the imported earnings record plus your current salary as projected covered earnings before retirement.

## Policy Assumptions

Policy-sensitive Social Security and ACA tables now live in `policy-config.js`.

Update that file when you need to change things like:

- the delayed-claim Social Security multiplier
- ACA policy stress presets
- federal poverty level baselines
- ACA premium-tax-credit applicable percentage brackets

Keeping those values in one file makes policy changes easier to audit without digging through the main planner engine.

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

## Local Docker Commands

This app is an Express/Node server, so the Docker setup runs the existing development server inside a Node LTS container and exposes it on **http://localhost:3456**.

Start the app:

```bash
docker compose up -d
```

Stop the app:

```bash
docker compose down
```

View logs:

```bash
docker compose logs -f
```

Rebuild after changing Docker-related files:

```bash
docker compose up -d --build
```

Notes:

- Source code is bind-mounted into the container, so local file edits are reflected immediately.
- `node_modules` stays inside Docker in a named volume instead of being written to your Windows filesystem.
- The container sets `HOST=0.0.0.0`, so the Express server is reachable from the host machine while still using the same app code.

### Windows Helper Scripts

If you want simple double-clickable commands on Windows, use the batch files in [E:\Projects\RetirementPlanner\scripts](E:\Projects\RetirementPlanner\scripts):

```bat
scripts\start.bat
scripts\stop.bat
scripts\restart.bat
scripts\logs.bat
scripts\open.bat
```

They map to:

- `start.bat` → `docker compose up -d`
- `stop.bat` → `docker compose down`
- `restart.bat` → `docker compose down` then `docker compose up -d`
- `logs.bat` → `docker compose logs -f`
- `open.bat` → opens `http://localhost:3456` in your default browser

## Running Math Tests

```bash
npm test
```

This runs the full regression suite against the real browser app logic through a headless JSDOM harness.

For faster day-to-day checks:

```bash
npm run test:fast
```

For the slower UI/persistence/import coverage:

```bash
npm run test:integration
```

The current coverage is focused on the highest-risk deterministic and reliability logic:

- employer-match math
- manual and statement-based Social Security calculations
- ACA/pre-65 healthcare math
- salary-growth propagation into future assumptions
- accumulation, bridge, and post-retirement solver behavior
- withdrawal strategy differences
- bridge-need monotonicity
- Monte Carlo invariants
- settings-draft / What If separation
- persistence and import fallback behavior
- planner tax breakdown sanity checks

---

## Dependencies

- [Express](https://expressjs.com/) — local HTTP server and API
- [Chart.js](https://www.chartjs.org/) — loaded from CDN for charts

---

## Product Spec

For feature requirements and regression tracking, see [`docs/FEATURES_AND_PRD.md`](docs/FEATURES_AND_PRD.md).
