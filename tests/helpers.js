const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");

let plannerPromise = null;
let jsdomModulePromise = null;

function pad(value) {
  return String(value).padStart(2, "0");
}

function yearsAgoIso(currentDate, years) {
  const [year, month, day] = String(currentDate).split("-").map(Number);
  return `${year - years}-${pad(month)}-${pad(day)}`;
}

function addYears(age, years) {
  return Math.round((age + years) * 1000) / 1000;
}

function monthsBetweenAges(startAge, endAge) {
  return Math.max(0, Math.ceil((endAge - startAge) * 12 - 1e-9));
}

function monteAgeGrid(currentAge, endAge = 100) {
  const months = monthsBetweenAges(currentAge, endAge);
  return {
    agePoints: Array.from({ length: months + 1 }, (_, index) => currentAge + index / 12),
    horizonMonths: {
      age90: monthsBetweenAges(currentAge, 90),
      age95: monthsBetweenAges(currentAge, 95),
      age100: monthsBetweenAges(currentAge, 100),
    },
  };
}

function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitFor(predicate, timeoutMs = 2000, intervalMs = 15) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (predicate()) return;
    await wait(intervalMs);
  }
  throw new Error("Timed out waiting for condition.");
}

function fireEvent(element, type, window) {
  const evt = new window.Event(type, { bubbles: true });
  element.dispatchEvent(evt);
}

async function loadPlannerHooks(options = {}) {
  const useCache =
    !options.fetchImpl &&
    !options.initialLocalStorage &&
    !options.onBeforeParse &&
    !options.onAfterReady;
  if (useCache && plannerPromise) return plannerPromise;
  const loader = (async () => {
    if (!jsdomModulePromise) {
      jsdomModulePromise = import("jsdom");
    }
    const { JSDOM } = await jsdomModulePromise;
    const [indexHtml, appJs, policyJs] = await Promise.all([
      fs.readFile(path.join(ROOT, "index.html"), "utf8"),
      fs.readFile(path.join(ROOT, "app.js"), "utf8"),
      fs.readFile(path.join(ROOT, "policy-config.js"), "utf8"),
    ]);

    // NOTE: the replacement callbacks are required. With a plain replacement
    // string, JS treats "$$", "$&", "$'" etc. as escape sequences, silently
    // mangling any source code (like the $$ DOM helper) injected this way.
    const html = indexHtml
      .replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js"><\/script>/, "")
      .replace('<script src="policy-config.js"></script>', () => `<script>${policyJs}</script>`)
      .replace('<script src="app.js"></script>', () => `<script>${appJs}</script>`);

    const dom = new JSDOM(html, {
      runScripts: "dangerously",
      resources: "usable",
      pretendToBeVisual: true,
      url: "http://localhost:3456/",
      beforeParse(window) {
        window.__RETIREMENT_PLANNER_TEST__ = true;
        const alerts = [];
        window.__plannerTestAlerts = alerts;
        window.fetch =
          options.fetchImpl ||
          (async (url) => {
            const pathName = typeof url === "string" ? url : url?.url || "";
            if (pathName.includes("/api/data")) {
              return {
                ok: true,
                status: 200,
                json: async () => ({ firstRun: true, data: null }),
              };
            }
            throw new Error(`Unexpected fetch in test harness: ${pathName}`);
          });
        window.Chart = class ChartStub {
          constructor() {}
          destroy() {}
          update() {}
        };
        window.alert = (message) => {
          alerts.push(String(message));
        };
        window.confirm = () => true;
        window.print = () => {};
        window.navigator.sendBeacon = () => true;
        if (window.HTMLCanvasElement?.prototype) {
          window.HTMLCanvasElement.prototype.getContext = () => ({});
        }
        if (options.initialLocalStorage) {
          Object.entries(options.initialLocalStorage).forEach(([key, value]) => {
            window.localStorage.setItem(key, value);
          });
        }
        options.onBeforeParse?.(window);
      },
    });

    await new Promise((resolve, reject) => {
      const started = Date.now();
      const tick = () => {
        const hooks = dom.window.__plannerTestHooks;
        if (hooks?.appReady?.()) {
          resolve();
          return;
        }
        if (Date.now() - started > 5000) {
          reject(new Error("Planner test hooks did not become ready in time."));
          return;
        }
        setTimeout(tick, 20);
      };
      tick();
    });

    return {
      dom,
      hooks: dom.window.__plannerTestHooks,
    };
  })();
  if (useCache) plannerPromise = loader;
  const loaded = await loader;
  options.onAfterReady?.(loaded.dom.window, loaded.hooks);
  return loaded;
}

function approxEqual(actual, expected, epsilon = 1e-6) {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `Expected ${actual} to be within ${epsilon} of ${expected}`,
  );
}

function makeState(hooks, overrides = {}) {
  const base = hooks.baseState();
  const currentDate = overrides.currentDate ?? base.currentDate;
  const contributionPct =
    overrides.contributionPct != null ? overrides.contributionPct : base.contributionPct;
  const employerMatchPct =
    overrides.employerMatchPct != null
      ? overrides.employerMatchPct
      : hooks.resolveEmployerMatchPct(contributionPct, base.employerMatchPct);
  const brokerage = overrides.currentBrokerageBalance ?? base.currentBrokerageBalance;
  const k401 = overrides.current401kBalance ?? base.current401kBalance;
  return hooks.buildState({
    ...base,
    currentDate,
    currentBrokerageBalance: brokerage,
    current401kBalance: k401,
    dateOfBirth:
      overrides.dateOfBirth != null
        ? overrides.dateOfBirth
        : yearsAgoIso(currentDate, overrides.ageYears ?? 40),
    monthlyBrokerageContribution:
      overrides.monthlyBrokerageContribution ?? base.monthlyBrokerageContribution,
    annualSalary: overrides.annualSalary ?? base.annualSalary,
    annualSalaryGrowthRate:
      overrides.annualSalaryGrowthRate ?? base.annualSalaryGrowthRate,
    contributionPct,
    employerMatchPct,
    annualRetirementSpend:
      overrides.annualRetirementSpend ?? base.annualRetirementSpend,
    targetRetirementAge:
      overrides.targetRetirementAge ?? base.targetRetirementAge,
    scenarioTargetRetirementAge:
      overrides.scenarioTargetRetirementAge ?? base.scenarioTargetRetirementAge,
    preMedicareHealthcareCost:
      overrides.preMedicareHealthcareCost ?? base.preMedicareHealthcareCost,
    acaHealthcareMode: overrides.acaHealthcareMode ?? base.acaHealthcareMode,
    acaSubsidyRule: overrides.acaSubsidyRule ?? base.acaSubsidyRule,
    acaBenchmarkAnnualPremium:
      overrides.acaBenchmarkAnnualPremium ?? base.acaBenchmarkAnnualPremium,
    acaIncomeCapPct: overrides.acaIncomeCapPct ?? base.acaIncomeCapPct,
    acaHouseholdSize: overrides.acaHouseholdSize ?? base.acaHouseholdSize,
    acaStressMultiplier:
      overrides.acaStressMultiplier ?? base.acaStressMultiplier,
    acaPolicyPreset: overrides.acaPolicyPreset ?? base.acaPolicyPreset,
    ssEstimateMode: overrides.ssEstimateMode ?? base.ssEstimateMode,
    ss62: overrides.ss62 ?? base.ss62,
    ssFRA: overrides.ssFRA ?? base.ssFRA,
    ssClaimAge: overrides.ssClaimAge ?? base.ssClaimAge,
    ssStatementBenefitMap:
      overrides.ssStatementBenefitMap ?? base.ssStatementBenefitMap,
    ssStatementEarningsHistory:
      overrides.ssStatementEarningsHistory ?? base.ssStatementEarningsHistory,
    unlockAge: overrides.unlockAge ?? base.unlockAge,
    chartEndAge: overrides.chartEndAge ?? base.chartEndAge,
    scenarioWithdrawalStrategy:
      overrides.scenarioWithdrawalStrategy ?? base.scenarioWithdrawalStrategy,
    scenarioOptimizationGoal:
      overrides.scenarioOptimizationGoal ?? base.scenarioOptimizationGoal,
    scenarioBrokerageReserveYears:
      overrides.scenarioBrokerageReserveYears ?? base.scenarioBrokerageReserveYears,
    scenarioTaxAwareAnnualCap:
      overrides.scenarioTaxAwareAnnualCap ?? base.scenarioTaxAwareAnnualCap,
    scenarioBrokerageGainRate:
      overrides.scenarioBrokerageGainRate ?? base.scenarioBrokerageGainRate,
    scenarioTaxFilingStatus:
      overrides.scenarioTaxFilingStatus ?? base.scenarioTaxFilingStatus,
    scenarioStateTaxRate:
      overrides.scenarioStateTaxRate ?? base.scenarioStateTaxRate,
    monteCarloRuns: overrides.monteCarloRuns ?? base.monteCarloRuns,
    monteBrokerageVol:
      overrides.monteBrokerageVol ?? base.monteBrokerageVol,
    monte401kVol:
      overrides.monte401kVol ?? base.monte401kVol,
    balanceHistory:
      overrides.balanceHistory ??
      [
        {
          timestamp: new Date(`${currentDate}T12:00:00Z`).toISOString(),
          date: currentDate,
          brokerage,
          k401,
        },
      ],
    assumptionHistory:
      overrides.assumptionHistory ??
      [
        {
          timestamp: new Date(`${currentDate}T12:00:00Z`).toISOString(),
          effectiveDate: currentDate,
          monthlyBrokerageContribution:
            overrides.monthlyBrokerageContribution ?? base.monthlyBrokerageContribution,
          annualSalary: overrides.annualSalary ?? base.annualSalary,
          contributionPct,
          employerMatchPct,
        },
      ],
  });
}

module.exports = {
  addYears,
  approxEqual,
  fireEvent,
  loadPlannerHooks,
  makeState,
  monteAgeGrid,
  monthsBetweenAges,
  wait,
  waitFor,
};
