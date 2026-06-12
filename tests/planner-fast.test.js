const test = require("node:test");
const assert = require("node:assert/strict");

const {
  addYears,
  approxEqual,
  loadPlannerHooks,
  makeState,
  monteAgeGrid,
  monthsBetweenAges,
} = require("./helpers");

test("employer match formula follows the documented schedule", async () => {
  const { hooks } = await loadPlannerHooks();
  assert.equal(hooks.resolveEmployerMatchPct(0), 0);
  assert.equal(hooks.resolveEmployerMatchPct(1), 1);
  assert.equal(hooks.resolveEmployerMatchPct(2), 1.5);
  assert.equal(hooks.resolveEmployerMatchPct(3), 2);
  assert.equal(hooks.resolveEmployerMatchPct(6), 3.5);
  assert.equal(hooks.resolveEmployerMatchPct(8), 3.5);
});

test("manual Social Security mode applies 62/FRA/70 logic consistently", async () => {
  const { hooks } = await loadPlannerHooks();
  const state62 = makeState(hooks, {
    ssEstimateMode: "manual",
    ss62: 2500,
    ssFRA: 3500,
    ssClaimAge: 62,
  });
  const state67 = makeState(hooks, {
    ssEstimateMode: "manual",
    ss62: 2500,
    ssFRA: 3500,
    ssClaimAge: 67,
  });
  const state70 = makeState(hooks, {
    ssEstimateMode: "manual",
    ss62: 2500,
    ssFRA: 3500,
    ssClaimAge: 70,
  });
  assert.equal(hooks.ssMonthly(state62), 2500);
  assert.equal(hooks.ssMonthly(state67), 3500);
  approxEqual(hooks.ssMonthly(state70), 4340);
});

test("statement-based Social Security stop-work estimate is monotonic with later retirement", async () => {
  const { hooks } = await loadPlannerHooks();
  const seed = makeState(hooks, { ageYears: 40 });
  const currentAge = hooks.computeAge(seed);
  const earningsHistory = Array.from({ length: 20 }, (_, index) => ({
    year: 2006 + index,
    amount: 100000 + index * 2500,
  }));
  const early = makeState(hooks, {
    ageYears: 40,
    targetRetirementAge: addYears(currentAge, 8),
    ssEstimateMode: "statementXml",
    ssClaimAge: 62,
    ssStatementBenefitMap: { "62": 2600, "67": 3600, "70": 4464 },
    ssStatementEarningsHistory: earningsHistory,
    annualSalary: 150000,
    annualSalaryGrowthRate: 3,
  });
  const later = makeState(hooks, {
    ...early,
    targetRetirementAge: addYears(currentAge, 15),
  });
  const earlyBenefit = hooks.ssMonthly(early);
  const laterBenefit = hooks.ssMonthly(later);
  assert.ok(earlyBenefit > 0);
  assert.ok(laterBenefit >= earlyBenefit);
  assert.ok(laterBenefit <= 2600);
});

test("manual ACA healthcare cost follows pre-65 stress and drops away at 65", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    preMedicareHealthcareCost: 12000,
    acaHealthcareMode: "manual",
    acaStressMultiplier: 150,
  });
  assert.equal(hooks.annualHealthcareCostAtAge(state, 60), 18000);
  assert.equal(hooks.annualHealthcareCostAtAge(state, 65), 0);
});

test("salary growth compounds from the active salary anchor in assumption history", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    annualSalary: 100000,
    annualSalaryGrowthRate: 5,
  });
  const currentDate = state.currentDate;
  const [year, month, day] = currentDate.split("-").map(Number);
  const nextYearDate = `${year + 1}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const oneYearOut = hooks.assumptionsForDate(state, nextYearDate);
  approxEqual(oneYearOut.annualSalary, 105000, 1);
});

test("zero-return accumulation and bridge math matches hand-calculable balances", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 40,
    currentBrokerageBalance: 12000,
    current401kBalance: 24000,
    monthlyBrokerageContribution: 1000,
    annualSalary: 120000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 12000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    unlockAge: 44,
    chartEndAge: 75,
    preMedicareHealthcareCost: 0,
  });
  const currentAge = hooks.computeAge(state);
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const result = hooks.project(
    state,
    "iyw",
    addYears(currentAge, 2),
    rates,
    { strategy: "k401First", reserveYears: 2 },
  );
  approxEqual(result.brokerageAtRetirement, 36000);
  approxEqual(result.k401AtRetirement, 46800);
  approxEqual(result.brokerageAtUnlock, 12000);
  approxEqual(result.k401AtUnlock, 46800);
  assert.equal(result.viable, true);
});

test("bridge viability fails when the bridge account cannot survive to unlock", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 40,
    currentBrokerageBalance: 12000,
    current401kBalance: 24000,
    monthlyBrokerageContribution: 1000,
    annualSalary: 120000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 24000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    unlockAge: 44,
    chartEndAge: 75,
    preMedicareHealthcareCost: 0,
  });
  const currentAge = hooks.computeAge(state);
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const result = hooks.bridgeSim(state, "iyw", addYears(currentAge, 2), rates);
  assert.equal(result.viable, false);
  approxEqual(result.brokerageAtUnlock, 0);
});

test("later retirement does not reduce projected retirement balances under the same assumptions", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 40,
    currentBrokerageBalance: 10000,
    current401kBalance: 50000,
    monthlyBrokerageContribution: 1500,
    annualSalary: 120000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 18000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    unlockAge: 60,
  });
  const currentAge = hooks.computeAge(state);
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const early = hooks.project(state, "iyw", addYears(currentAge, 2), rates);
  const later = hooks.project(state, "iyw", addYears(currentAge, 4), rates);
  assert.ok(later.brokerageAtRetirement >= early.brokerageAtRetirement);
  assert.ok(later.k401AtRetirement >= early.k401AtRetirement);
});

test("401k contributions stop at retirement in the deterministic projection", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 40,
    currentBrokerageBalance: 0,
    current401kBalance: 24000,
    monthlyBrokerageContribution: 0,
    annualSalary: 120000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 0,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    unlockAge: 42,
    chartEndAge: 75,
  });
  const currentAge = hooks.computeAge(state);
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const result = hooks.project(state, "iyw", addYears(currentAge, 1), rates);
  approxEqual(result.k401AtRetirement, 35400);
  approxEqual(result.k401AtUnlock, 35400);
});

test("draw strategies produce materially different allocations and brokerage reserve uses annual spend", async () => {
  const { hooks } = await loadPlannerHooks();
  const k401First = hooks.drawFromAccounts(100, 100, 60, { strategy: "k401First" }, 10);
  const brokerageFirst = hooks.drawFromAccounts(100, 100, 60, { strategy: "brokerageFirst" }, 10);
  const proRata = hooks.drawFromAccounts(100, 100, 60, { strategy: "proRata" }, 10);
  const reserve = hooks.drawFromAccounts(
    100,
    100,
    60,
    { strategy: "brokerageReserve", reserveYears: 2 },
    10,
  );

  assert.equal(k401First.k401Withdraw, 60);
  assert.equal(k401First.brokerageWithdraw, 0);
  assert.equal(brokerageFirst.k401Withdraw, 0);
  assert.equal(brokerageFirst.brokerageWithdraw, 60);
  approxEqual(proRata.k401Withdraw, 30);
  approxEqual(proRata.brokerageWithdraw, 30);
  assert.equal(reserve.brokerageWithdraw, 0);
  assert.equal(reserve.k401Withdraw, 60);
});

test("bridge need increases as retirement age moves earlier when all else is fixed", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 40,
    annualRetirementSpend: 24000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    unlockAge: 60,
    preMedicareHealthcareCost: 0,
  });
  const currentAge = hooks.computeAge(state);
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const earlier = hooks.bridgeNeedAtAge(state, rates, addYears(currentAge, 10));
  const later = hooks.bridgeNeedAtAge(state, rates, addYears(currentAge, 12));
  assert.ok(earlier > later);
});

test("planner tax breakdown layers flat state tax on top of federal tax", async () => {
  const { hooks } = await loadPlannerHooks();
  const breakdown = hooks.estimatePlannerTaxBreakdown(50000, 0, 0, "single", 5);
  approxEqual(breakdown.stateTax, 2500);
  assert.ok(breakdown.ordinaryTax > 0);
  assert.ok(breakdown.totalTax > breakdown.ordinaryTax);
});

test("Monte Carlo paths collapse to a single deterministic path at zero volatility", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 40,
    currentBrokerageBalance: 12000,
    current401kBalance: 24000,
    monthlyBrokerageContribution: 1000,
    annualSalary: 120000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 12000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    unlockAge: 44,
    chartEndAge: 100,
    preMedicareHealthcareCost: 0,
    monteCarloRuns: 100,
    monteBrokerageVol: 0,
    monte401kVol: 0,
  });
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const result = hooks.runMonteCarloForPath(
    state,
    "iyw",
    rates,
    hooks.monteCarloConfig(state, rates),
  );

  assert.ok([0, 100].includes(result.success90));
  assert.ok([0, 100].includes(result.success95));
  assert.ok([0, 100].includes(result.success100));
  assert.equal(result.p10Series.length, result.p50Series.length);
  assert.equal(result.p50Series.length, result.p90Series.length);

  result.p10Series.forEach((point, index) => {
    approxEqual(point.y, result.p50Series[index].y);
    approxEqual(point.y, result.p90Series[index].y);
  });
});

test("Monte Carlo zero-volatility runs are identical across random seeds", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 40,
    currentBrokerageBalance: 12000,
    current401kBalance: 24000,
    monthlyBrokerageContribution: 1000,
    annualSalary: 120000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 12000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    unlockAge: 44,
    chartEndAge: 100,
    preMedicareHealthcareCost: 0,
    monteBrokerageVol: 0,
    monte401kVol: 0,
  });
  const currentAge = hooks.computeAge(state);
  const { agePoints, horizonMonths } = monteAgeGrid(currentAge, 100);
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const config = hooks.monteCarloConfig(state, rates);
  const run0 = hooks.simulateMonteCarloPath(state, "iyw", rates, config, 0, agePoints, horizonMonths);
  const run7 = hooks.simulateMonteCarloPath(state, "iyw", rates, config, 7, agePoints, horizonMonths);

  assert.deepEqual(run0.totals, run7.totals);
  assert.deepEqual(run0.endingBalances, run7.endingBalances);
  assert.deepEqual(run0.success, run7.success);
});

test("Monte Carlo success does not improve when annual spend rises under the same assumptions", async () => {
  const { hooks } = await loadPlannerHooks();
  const base = {
    ageYears: 40,
    currentBrokerageBalance: 40000,
    current401kBalance: 120000,
    monthlyBrokerageContribution: 2000,
    annualSalary: 140000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    ss62: 2200,
    ssFRA: 3000,
    ssClaimAge: 62,
    unlockAge: 59.5,
    chartEndAge: 100,
    preMedicareHealthcareCost: 0,
    monteCarloRuns: 120,
    monteBrokerageVol: 18,
    monte401kVol: 12,
  };
  const lowerSpend = makeState(hooks, {
    ...base,
    annualRetirementSpend: 40000,
  });
  const higherSpend = makeState(hooks, {
    ...base,
    annualRetirementSpend: 70000,
  });
  const lowerRates = hooks.baselinePlanningRates(lowerSpend);
  const higherRates = hooks.baselinePlanningRates(higherSpend);
  const lowerResult = hooks.runMonteCarloForPath(
    lowerSpend,
    "iyw",
    lowerRates,
    hooks.monteCarloConfig(lowerSpend, lowerRates),
  );
  const higherResult = hooks.runMonteCarloForPath(
    higherSpend,
    "iyw",
    higherRates,
    hooks.monteCarloConfig(higherSpend, higherRates),
  );

  assert.ok(lowerResult.success90 >= higherResult.success90);
  assert.ok(lowerResult.success95 >= higherResult.success95);
  assert.ok(lowerResult.success100 >= higherResult.success100);
});

test("Monte Carlo depletion clamps future balances to zero after plan failure", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 58,
    targetRetirementAge: 58,
    unlockAge: 58,
    chartEndAge: 100,
    currentBrokerageBalance: 5000,
    current401kBalance: 10000,
    monthlyBrokerageContribution: 0,
    annualSalary: 0,
    contributionPct: 0,
    employerMatchPct: 0,
    annualRetirementSpend: 120000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    preMedicareHealthcareCost: 0,
    monteBrokerageVol: 0,
    monte401kVol: 0,
  });
  const currentAge = hooks.computeAge(state);
  const { agePoints, horizonMonths } = monteAgeGrid(currentAge, 100);
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const config = hooks.monteCarloConfig(state, rates);
  const outcome = hooks.simulateMonteCarloPath(state, "iyw", rates, config, 0, agePoints, horizonMonths);

  assert.ok(outcome.depletionAge != null);
  const firstZeroIndex = outcome.totals.findIndex((value) => value === 0);
  assert.ok(firstZeroIndex >= 0);
  outcome.totals.slice(firstZeroIndex).forEach((value) => {
    assert.equal(value, 0);
  });
});

test("Monte Carlo percentile bands stay ordered and success thresholds are nested", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    ageYears: 40,
    currentBrokerageBalance: 50000,
    current401kBalance: 150000,
    monthlyBrokerageContribution: 1800,
    annualSalary: 150000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 50000,
    ss62: 2600,
    ssFRA: 3500,
    ssClaimAge: 62,
    unlockAge: 59.5,
    chartEndAge: 100,
    preMedicareHealthcareCost: 12000,
    acaHealthcareMode: "manual",
    acaStressMultiplier: 100,
    monteCarloRuns: 120,
    monteBrokerageVol: 22,
    monte401kVol: 14,
  });
  const rates = hooks.baselinePlanningRates(state);
  const result = hooks.runMonteCarloForPath(
    state,
    "iyw",
    rates,
    hooks.monteCarloConfig(state, rates),
  );

  result.p10Series.forEach((point, index) => {
    const p50 = result.p50Series[index].y;
    const p90 = result.p90Series[index].y;
    assert.ok(point.y <= p50 + 1e-9);
    assert.ok(p50 <= p90 + 1e-9);
  });
  assert.ok(result.success90 >= result.success95);
  assert.ok(result.success95 >= result.success100);
});

test("golden deterministic bridge scenario preserves exact contribution and withdrawal totals by phase", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    currentDate: "2026-01-01",
    ageYears: 40,
    targetRetirementAge: 42,
    unlockAge: 44,
    chartEndAge: 75,
    currentBrokerageBalance: 12000,
    current401kBalance: 24000,
    monthlyBrokerageContribution: 1000,
    annualSalary: 120000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 12000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    preMedicareHealthcareCost: 0,
  });
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const result = hooks.project(state, "iyw", 42, rates, {
    strategy: "k401First",
    reserveYears: 2,
  });
  const monthly = result.monthlyBreakdown;
  const currentAge = hooks.computeAge(state);
  const accumulationMonths = monthsBetweenAges(currentAge, 42);
  const bridgeMonths = monthsBetweenAges(result.actualRetirementAge, 44);
  const expectedK401Monthly = hooks.k401MonthlyFromValues(
    120000,
    6,
    hooks.resolveEmployerMatchPct(6),
  );
  const expectedBrokerageAtRetirement = 12000 + accumulationMonths * 1000;
  const expectedK401AtRetirement = 24000 + accumulationMonths * expectedK401Monthly;
  const expectedBrokerageAtUnlock = Math.max(
    0,
    expectedBrokerageAtRetirement - bridgeMonths * 1000,
  );
  const accumulationRows = monthly.filter((row) => row.phase === "Accumulation");
  const bridgeRows = monthly.filter((row) => row.phase === "Bridge");
  const postUnlockRows = monthly.filter((row) => row.phase === "Post unlock");

  assert.ok(accumulationRows.length > 0);
  assert.ok(bridgeRows.length > 0);
  assert.ok(postUnlockRows.length > 0);

  approxEqual(
    accumulationRows.reduce((sum, row) => sum + row.brokerageContribution, 0),
    accumulationMonths * 1000,
  );
  approxEqual(
    accumulationRows.reduce((sum, row) => sum + row.k401Contribution, 0),
    accumulationMonths * expectedK401Monthly,
  );
  approxEqual(
    bridgeRows.reduce((sum, row) => sum + row.brokerageWithdrawal, 0),
    bridgeMonths * 1000,
  );
  approxEqual(
    bridgeRows.reduce((sum, row) => sum + row.k401Withdrawal, 0),
    0,
  );
  approxEqual(result.brokerageAtRetirement, expectedBrokerageAtRetirement);
  approxEqual(result.k401AtRetirement, expectedK401AtRetirement);
  approxEqual(result.brokerageAtUnlock, expectedBrokerageAtUnlock);
  approxEqual(result.k401AtUnlock, expectedK401AtRetirement);
});

test("Social Security claim start immediately reduces monthly 401k withdrawals in the deterministic plan", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    currentDate: "2026-01-01",
    ageYears: 60,
    targetRetirementAge: 60,
    unlockAge: 60,
    chartEndAge: 75,
    currentBrokerageBalance: 0,
    current401kBalance: 240000,
    monthlyBrokerageContribution: 0,
    annualSalary: 0,
    contributionPct: 0,
    employerMatchPct: 0,
    annualRetirementSpend: 24000,
    ss62: 1000,
    ssFRA: 1400,
    ssClaimAge: 62,
    preMedicareHealthcareCost: 0,
  });
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const result = hooks.project(state, "iyw", 60, rates, {
    strategy: "k401First",
    reserveYears: 2,
  });
  const monthly = result.monthlyBreakdown;
  const preClaim = monthly.find(
    (row) => row.phase === "Post unlock" && row.age > 61.8 && row.age < 61.95,
  );
  const postClaim = monthly.find(
    (row) => row.phase === "Post unlock + SS" && row.age >= 62,
  );

  assert.ok(preClaim);
  assert.ok(postClaim);
  approxEqual(preClaim.ssIncome, 0);
  approxEqual(preClaim.k401Withdrawal, 2000);
  approxEqual(postClaim.ssIncome, 1000);
  approxEqual(postClaim.k401Withdrawal, 1000);
  approxEqual(postClaim.spend, 2000);
});

test("yearly plan rows stay internally consistent with monthly breakdown totals", async () => {
  const { hooks } = await loadPlannerHooks();
  const state = makeState(hooks, {
    currentDate: "2026-01-01",
    ageYears: 40,
    targetRetirementAge: 42,
    unlockAge: 44,
    chartEndAge: 75,
    currentBrokerageBalance: 12000,
    current401kBalance: 24000,
    monthlyBrokerageContribution: 1000,
    annualSalary: 120000,
    contributionPct: 6,
    employerMatchPct: hooks.resolveEmployerMatchPct(6),
    annualRetirementSpend: 12000,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 70,
    preMedicareHealthcareCost: 0,
  });
  const rates = { iyw: 0, qqqm: 0, post: 0, kacc: 0, kpost: 0 };
  const result = hooks.project(state, "iyw", 42, rates, {
    strategy: "k401First",
    reserveYears: 2,
  });
  const yearly = hooks.buildYearlyPlanRows(result, state);
  const sumMonthly = (key) =>
    result.monthlyBreakdown.reduce((total, row) => total + Number(row[key] || 0), 0);
  const sumYearly = (key) =>
    yearly.reduce((total, row) => total + Number(row[key] || 0), 0);

  approxEqual(sumYearly("brokerageContribution"), sumMonthly("brokerageContribution"));
  approxEqual(sumYearly("k401Contribution"), sumMonthly("k401Contribution"));
  approxEqual(sumYearly("k401EmployeeContribution"), sumMonthly("k401EmployeeContribution"));
  approxEqual(sumYearly("k401EmployerContribution"), sumMonthly("k401EmployerContribution"));
  approxEqual(sumYearly("brokerageWithdrawal"), sumMonthly("brokerageWithdrawal"));
  approxEqual(sumYearly("k401Withdrawal"), sumMonthly("k401Withdrawal"));
  approxEqual(sumYearly("ssIncome"), sumMonthly("ssIncome"));
  approxEqual(sumYearly("spend"), sumMonthly("spend"));
  approxEqual(sumYearly("gap"), sumMonthly("gap"));
});
