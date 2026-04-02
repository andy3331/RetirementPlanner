(() => {
  /* ===== CONSTANTS & DEFAULTS ===== */
  const KEY = "retirementPlanner.v1",
    today = (() => {
      const d = new Date();
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10);
    })();
  const base = {
    currentDate: today,
    dateOfBirth: "1990-01-01",
    currentAge: 35,
    currentBrokerageBalance: 25000,
    current401kBalance: 80000,
    monthlyBrokerageContribution: 1500,
    contributionPct: 6,
    annualSalary: 120000,
    employerMatchPct: 4,
    targetRetirementAge: 55,
    scenarioTargetRetirementAge: 55,
    annualRetirementSpend: 60000,
    unlockAge: 59.5,
    chartEndAge: 80,
    showBlendAChart: true,
    showBlendBChart: true,
    blendATicker1: "IYW",
    blendAWeight1: 90,
    blendAReturn1: 16.8,
    blendATicker2: "VTI",
    blendAWeight2: 10,
    blendAReturn2: 11,
    blendBTicker1: "QQQM",
    blendBWeight1: 90,
    blendBReturn1: 13.8,
    blendBTicker2: "VTI",
    blendBWeight2: 10,
    blendBReturn2: 11,
    iywAccumReturn: 16.2,
    qqqmAccumReturn: 13.5,
    postRetirementReturn: 5,
    k401AccumReturn: 7,
    k401PostReturn: 7,
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 62,
    scenario: "bull",
    customIywAccumReturn: 16.2,
    customQqqmAccumReturn: 13.5,
    customPostRetirementReturn: 5,
    customK401AccumReturn: 7,
    customK401PostReturn: 7,
    blendDefaultsVersion: 2,
    balanceHistory: [
      {
        timestamp: new Date().toISOString(),
        date: today,
        brokerage: 25000,
        k401: 80000,
      },
    ],
    assumptionHistory: [
      {
        timestamp: new Date().toISOString(),
        effectiveDate: today,
        monthlyBrokerageContribution: 1500,
        annualSalary: 120000,
        contributionPct: 6,
        employerMatchPct: 4,
      },
    ],
  };
  const nums = Object.keys(base).filter(
    (k) => typeof base[k] === "number",
  );
  const positiveDefaultKeys = [
    "annualSalary",
    "targetRetirementAge",
    "scenarioTargetRetirementAge",
    "annualRetirementSpend",
    "unlockAge",
    "chartEndAge",
    "blendAReturn1",
    "blendAReturn2",
    "blendBReturn1",
    "blendBReturn2",
    "iywAccumReturn",
    "qqqmAccumReturn",
    "postRetirementReturn",
    "k401AccumReturn",
    "k401PostReturn",
    "customIywAccumReturn",
    "customQqqmAccumReturn",
    "customPostRetirementReturn",
    "customK401AccumReturn",
    "customK401PostReturn",
  ];
  const legacyBlendDefaults = {
    blendATicker1: "SPY",
    blendAWeight1: 60,
    blendAReturn1: 10.5,
    blendATicker2: "AGG",
    blendAWeight2: 40,
    blendAReturn2: 4.5,
    blendBTicker1: "VTI",
    blendBWeight1: 70,
    blendBReturn1: 9.5,
    blendBTicker2: "VXUS",
    blendBWeight2: 30,
    blendBReturn2: 7.2,
    iywAccumReturn: 8.1,
    qqqmAccumReturn: 8.8,
    customIywAccumReturn: 8.1,
    customQqqmAccumReturn: 8.8,
  };

  /* ===== DOM HELPERS ===== */
  const el = (id) => document.getElementById(id);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const ui = {
    hOverallBadge: el("hOverallBadge"),
    hOverallDetail: el("hOverallDetail"),
    hBrokerageCoverage: el("hBrokerageCoverage"),
    hBrokerageDetail: el("hBrokerageDetail"),
    h401kCoverage: el("h401kCoverage"),
    h401kDetail: el("h401kDetail"),
    hTarget: el("hTarget"),
    hTargetDetail: el("hTargetDetail"),
    hUpdated: el("hUpdated"),
    hUpdatedDetail: el("hUpdatedDetail"),
    heroOverallStatus: el("heroOverallStatus"),
    currentDate: el("currentDate"),
    dob: el("dob"),
    currentAgeInput: el("currentAgeInput"),
    history: el("history"),
    basePlanSnapshot: el("basePlanSnapshot"),
    trackStatusCards: el("trackStatusCards"),
    changeCards: el("changeCards"),
    changeMatrix: el("changeMatrix"),
    assumptionHistory: el("assumptionHistory"),
    blendFetchStatus: el("blendFetchStatus"),
    blendALabel: el("blendALabel"),
    blendBLabel: el("blendBLabel"),
    blendATicker1: el("blendATicker1"),
    blendAWeight1: el("blendAWeight1"),
    blendAReturn1: el("blendAReturn1"),
    blendATicker2: el("blendATicker2"),
    blendAWeight2: el("blendAWeight2"),
    blendAReturn2: el("blendAReturn2"),
    blendABlendedReturn: el("blendABlendedReturn"),
    blendAAutoFill: el("blendAAutoFill"),
    blendBTicker1: el("blendBTicker1"),
    blendBWeight1: el("blendBWeight1"),
    blendBReturn1: el("blendBReturn1"),
    blendBTicker2: el("blendBTicker2"),
    blendBWeight2: el("blendBWeight2"),
    blendBReturn2: el("blendBReturn2"),
    blendBBlendedReturn: el("blendBBlendedReturn"),
    blendBAutoFill: el("blendBAutoFill"),
    monthlyBrokerageContribution: el("monthlyBrokerageContribution"),
    monthlyBrokerageContributionRange: el(
      "monthlyBrokerageContributionRange",
    ),
    contributionPct: el("contributionPct"),
    annualSalary: el("annualSalary"),
    employerMatchPct: el("employerMatchPct"),
    monthly401: el("monthly401"),
    targetRetirementAge: el("targetRetirementAge"),
    targetRetirementAgeRange: el("targetRetirementAgeRange"),
    scenarioTargetRetirementAge: el("scenarioTargetRetirementAge"),
    scenarioTargetRetirementAgeRange: el(
      "scenarioTargetRetirementAgeRange",
    ),
    annualRetirementSpend: el("annualRetirementSpend"),
    annualRetirementSpendRange: el("annualRetirementSpendRange"),
    unlockAge: el("unlockAge"),
    chartEndAge: el("chartEndAge"),
    iywAccumReturn: el("iywAccumReturn"),
    qqqmAccumReturn: el("qqqmAccumReturn"),
    postRetirementReturn: el("postRetirementReturn"),
    k401AccumReturn: el("k401AccumReturn"),
    k401PostReturn: el("k401PostReturn"),
    ss62: el("ss62"),
    ssFRA: el("ssFRA"),
    ssClaimAge: el("ssClaimAge"),
    ssApplied: el("ssApplied"),
    scenarioNote: el("scenarioNote"),
    customGrid: el("customGrid"),
    customIywAccumReturn: el("customIywAccumReturn"),
    customQqqmAccumReturn: el("customQqqmAccumReturn"),
    customPostRetirementReturn: el("customPostRetirementReturn"),
    customK401AccumReturn: el("customK401AccumReturn"),
    customK401PostReturn: el("customK401PostReturn"),
    warningPanel: el("warningPanel"),
    warningText: el("warningText"),
    cards: el("cards"),
    status: el("status"),
    summary: el("summary"),
    actualBrokerageChart: el("actualBrokerageChart"),
    actual401kChart: el("actual401kChart"),
    actualBrokerageFallback: el("actualBrokerageFallback"),
    actual401kFallback: el("actual401kFallback"),
    reviewNote: el("reviewNote"),
    brokerageChart: el("brokerageChart"),
    k401Chart: el("k401Chart"),
    mixChart: el("mixChart"),
    showBlendAChart: el("showBlendAChart"),
    showBlendBChart: el("showBlendBChart"),
    showBlendALabel: el("showBlendALabel"),
    showBlendBLabelInline: el("showBlendBLabelInline"),
    brokerageFallback: el("brokerageFallback"),
    k401Fallback: el("k401Fallback"),
    mixFallback: el("mixFallback"),
    modalBg: el("modalBg"),
    modalDate: el("modalDate"),
    modalBrokerage: el("modalBrokerage"),
    modal401: el("modal401"),
    assumptionModalBg: el("assumptionModalBg"),
    assumptionModalDate: el("assumptionModalDate"),
    assumptionModalBrokerageContribution: el(
      "assumptionModalBrokerageContribution",
    ),
    assumptionModalSalary: el("assumptionModalSalary"),
    assumptionModalContributionPct: el("assumptionModalContributionPct"),
    assumptionModalMatchPct: el("assumptionModalMatchPct"),
    assumptionModalMonthly401: el("assumptionModalMonthly401"),
    openAssumptionModal: el("openAssumptionModal"),
    openAssumptionModalInline: el("openAssumptionModalInline"),
    syncScenarioAgeBtn: el("syncScenarioAgeBtn"),
    resetDefaultsBtn: el("resetDefaultsBtn"),
    drawerBackdrop: el("drawerBackdrop"),
    settingsDrawer: el("settingsDrawer"),
  };

  /* ===== STATE ===== */
  let state = load(),
    actualBrokerageReviewChart,
    actual401kReviewChart,
    bChart,
    kChart,
    mixChart,
    editingHistoryId = null,
    editingAssumptionId = null;

  /* ===== TAB NAVIGATION ===== */
  $$(".tabBtn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      $$(".tabBtn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
      $$(".tabContent").forEach((c) => c.classList.toggle("active", c.dataset.tab === tab));
    }),
  );

  /* ===== SETTINGS DRAWER ===== */
  el("openSettings")?.addEventListener("click", () => {
    ui.drawerBackdrop.classList.add("open");
  });
  el("closeSettings")?.addEventListener("click", () => {
    ui.drawerBackdrop.classList.remove("open");
  });
  ui.drawerBackdrop?.addEventListener("click", (e) => {
    if (e.target === ui.drawerBackdrop) ui.drawerBackdrop.classList.remove("open");
  });

  /* ===== FORMAT HELPERS ===== */
  function n(v, f = 0) {
    if (typeof v === "number" && isFinite(v)) return v;
    const p = parseFloat(
      String(v ?? "")
        .replace(/[$,%\s]/g, "")
        .replace(/,/g, ""),
    );
    return isFinite(p) ? p : f;
  }
  function money(v, d = 0) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: d,
      minimumFractionDigits: d,
    }).format(isFinite(v) ? v : 0);
  }
  function num(v, d = 1) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: d,
      minimumFractionDigits: d,
    }).format(isFinite(v) ? v : 0);
  }
  function age(v) {
    return isFinite(v) ? num(v, 1) : "Not viable";
  }
  function lon(v) {
    return v == null ? "110+" : age(v);
  }
  function pct(v) {
    return `${num(v, v % 1 === 0 ? 0 : 1)}%`;
  }
  function fmtDate(v) {
    const d = new Date(`${v}T12:00:00`);
    return Number.isNaN(d.getTime())
      ? v
      : d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  }

  /* ===== LEGACY BLEND MIGRATION ===== */
  function matchesLegacyBlendDefaults(s) {
    return (
      String(s.blendATicker1 || "").trim().toUpperCase() ===
        legacyBlendDefaults.blendATicker1 &&
      n(s.blendAWeight1) === legacyBlendDefaults.blendAWeight1 &&
      n(s.blendAReturn1) === legacyBlendDefaults.blendAReturn1 &&
      String(s.blendATicker2 || "").trim().toUpperCase() ===
        legacyBlendDefaults.blendATicker2 &&
      n(s.blendAWeight2) === legacyBlendDefaults.blendAWeight2 &&
      n(s.blendAReturn2) === legacyBlendDefaults.blendAReturn2 &&
      String(s.blendBTicker1 || "").trim().toUpperCase() ===
        legacyBlendDefaults.blendBTicker1 &&
      n(s.blendBWeight1) === legacyBlendDefaults.blendBWeight1 &&
      n(s.blendBReturn1) === legacyBlendDefaults.blendBReturn1 &&
      String(s.blendBTicker2 || "").trim().toUpperCase() ===
        legacyBlendDefaults.blendBTicker2 &&
      n(s.blendBWeight2) === legacyBlendDefaults.blendBWeight2 &&
      n(s.blendBReturn2) === legacyBlendDefaults.blendBReturn2 &&
      n(s.iywAccumReturn) === legacyBlendDefaults.iywAccumReturn &&
      n(s.qqqmAccumReturn) === legacyBlendDefaults.qqqmAccumReturn
    );
  }
  function applyRequestedBlendDefaults(s) {
    Object.assign(s, {
      blendATicker1: base.blendATicker1,
      blendAWeight1: base.blendAWeight1,
      blendAReturn1: base.blendAReturn1,
      blendATicker2: base.blendATicker2,
      blendAWeight2: base.blendAWeight2,
      blendAReturn2: base.blendAReturn2,
      blendBTicker1: base.blendBTicker1,
      blendBWeight1: base.blendBWeight1,
      blendBReturn1: base.blendBReturn1,
      blendBTicker2: base.blendBTicker2,
      blendBWeight2: base.blendBWeight2,
      blendBReturn2: base.blendBReturn2,
      iywAccumReturn: base.iywAccumReturn,
      qqqmAccumReturn: base.qqqmAccumReturn,
    });
    if (
      n(s.customIywAccumReturn) === legacyBlendDefaults.customIywAccumReturn
    ) {
      s.customIywAccumReturn = base.customIywAccumReturn;
    }
    if (
      n(s.customQqqmAccumReturn) ===
      legacyBlendDefaults.customQqqmAccumReturn
    ) {
      s.customQqqmAccumReturn = base.customQqqmAccumReturn;
    }
  }

  /* ===== AGE CALCULATIONS ===== */
  function computeAge(s) {
    const dob = new Date(`${s.dateOfBirth}T12:00:00`),
      cur = new Date(`${s.currentDate}T12:00:00`);
    if (
      Number.isNaN(dob.getTime()) ||
      Number.isNaN(cur.getTime()) ||
      cur < dob
    )
      return n(s.currentAge, 0);
    return Math.round(((cur - dob) / (365.2425 * 86400000)) * 100) / 100;
  }
  function dobFromAge(ageValue, currentDate) {
    const cur = new Date(`${currentDate}T12:00:00`);
    if (Number.isNaN(cur.getTime())) return today;
    const dob = new Date(cur.getTime() - ageValue * 365.2425 * 86400000);
    return new Date(dob.getTime() - dob.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }

  /* ===== LOAD / SAVE ===== */
  function load() {
    try {
      const raw = localStorage.getItem(KEY),
        x = raw ? JSON.parse(raw) : {},
        s = { ...base, ...x };
      nums.forEach((k) => (s[k] = n(s[k], base[k])));
      positiveDefaultKeys.forEach((k) => {
        if (!(s[k] > 0)) s[k] = base[k];
      });
      if (![6, 8].includes(Number(s.contributionPct)))
        s.contributionPct = base.contributionPct;
      if (!["bull", "crash", "custom"].includes(s.scenario))
        s.scenario = base.scenario;
      if (
        n(x.blendDefaultsVersion, 0) < base.blendDefaultsVersion ||
        matchesLegacyBlendDefaults(s)
      ) {
        applyRequestedBlendDefaults(s);
        s.blendDefaultsVersion = base.blendDefaultsVersion;
      }
      s.balanceHistory =
        Array.isArray(s.balanceHistory) && s.balanceHistory.length
          ? s.balanceHistory.map((r) => ({
              timestamp: r.timestamp || new Date().toISOString(),
              date: r.date || today,
              brokerage: n(r.brokerage),
              k401: n(r.k401),
            }))
          : base.balanceHistory.slice();
      s.assumptionHistory =
        Array.isArray(s.assumptionHistory) && s.assumptionHistory.length
          ? s.assumptionHistory.map((r) => ({
              timestamp: r.timestamp || new Date().toISOString(),
              effectiveDate: r.effectiveDate || r.date || today,
              monthlyBrokerageContribution: n(
                r.monthlyBrokerageContribution,
                s.monthlyBrokerageContribution,
              ),
              annualSalary: n(r.annualSalary, s.annualSalary),
              contributionPct: [6, 8].includes(Number(r.contributionPct))
                ? n(r.contributionPct)
                : s.contributionPct,
              employerMatchPct: n(r.employerMatchPct, s.employerMatchPct),
            }))
          : base.assumptionHistory.map((r) => ({ ...r }));
      s.currentDate = today;
      s.dateOfBirth = /^\d{4}-\d{2}-\d{2}$/.test(
        String(s.dateOfBirth || ""),
      )
        ? s.dateOfBirth
        : base.dateOfBirth;
      s.currentAge = computeAge(s);
      return s;
    } catch {
      return {
        ...base,
        currentDate: today,
        assumptionHistory: base.assumptionHistory.map((r) => ({ ...r })),
      };
    }
  }
  function save() {
    state.currentAge = computeAge(state);
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  /* ===== FINANCIAL MATH ===== */
  function mRate(a) {
    return Math.pow(1 + a / 100, 1 / 12) - 1;
  }
  function ssMonthly(s) {
    return s.ssClaimAge <= 62
      ? n(s.ss62)
      : s.ssClaimAge >= 70
        ? n(s.ssFRA) * 1.24
        : n(s.ssFRA);
  }
  function k401MonthlyFromValues(salary, contributionPct, employerMatchPct) {
    const emp = n(contributionPct),
      match = (n(employerMatchPct) * Math.min(emp, 6)) / 6;
    return (n(salary) * (emp + match)) / 100 / 12;
  }
  function k401Monthly(s) {
    return k401MonthlyFromValues(
      s.annualSalary,
      s.contributionPct,
      s.employerMatchPct,
    );
  }

  /* ===== ASSUMPTION TIMELINE ===== */
  function assumptionSort(a, b) {
    const ad = new Date(`${a.effectiveDate}T12:00:00`).getTime(),
      bd = new Date(`${b.effectiveDate}T12:00:00`).getTime();
    if (bd !== ad) return bd - ad;
    return new Date(b.timestamp) - new Date(a.timestamp);
  }
  function addMonthsIso(date, months) {
    const d = new Date(`${date}T12:00:00`);
    if (Number.isNaN(d.getTime())) return date;
    d.setMonth(d.getMonth() + months);
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  }
  function assumptionsForDate(s, date) {
    const rows = [...(s.assumptionHistory || [])].sort(assumptionSort),
      entry =
        rows.find((r) => r.effectiveDate <= date) ||
        rows[rows.length - 1] ||
        null;
    return entry
      ? {
          monthlyBrokerageContribution: n(
            entry.monthlyBrokerageContribution,
            s.monthlyBrokerageContribution,
          ),
          annualSalary: n(entry.annualSalary, s.annualSalary),
          contributionPct: [6, 8].includes(Number(entry.contributionPct))
            ? n(entry.contributionPct)
            : n(s.contributionPct),
          employerMatchPct: n(entry.employerMatchPct, s.employerMatchPct),
        }
      : {
          monthlyBrokerageContribution: n(s.monthlyBrokerageContribution),
          annualSalary: n(s.annualSalary),
          contributionPct: n(s.contributionPct),
          employerMatchPct: n(s.employerMatchPct),
        };
  }

  /* ===== BLEND HELPERS ===== */
  function blendLabel(prefix) {
    const t1 = String(state[`${prefix}Ticker1`] || "")
        .trim()
        .toUpperCase(),
      t2 = String(state[`${prefix}Ticker2`] || "")
        .trim()
        .toUpperCase();
    return [t1, t2].filter(Boolean).join(" / ") || "Custom blend";
  }
  function blendRate(prefix) {
    const w1 = Math.max(0, n(state[`${prefix}Weight1`], 0)),
      w2 = Math.max(0, n(state[`${prefix}Weight2`], 0)),
      total = Math.max(1, w1 + w2);
    return (
      (n(state[`${prefix}Return1`], 0) * w1 +
        n(state[`${prefix}Return2`], 0) * w2) /
      total
    );
  }
  function applyBlendReturns() {
    state.iywAccumReturn = blendRate("blendA");
    state.qqqmAccumReturn = blendRate("blendB");
    if (!(n(state.customIywAccumReturn) > 0))
      state.customIywAccumReturn = state.iywAccumReturn;
    if (!(n(state.customQqqmAccumReturn) > 0))
      state.customQqqmAccumReturn = state.qqqmAccumReturn;
  }

  /* ===== SCENARIO RATES ===== */
  function scenarioRates(s) {
    if (s.scenario === "custom")
      return {
        label: "Custom",
        iyw: n(s.customIywAccumReturn),
        qqqm: n(s.customQqqmAccumReturn),
        post: n(s.customPostRetirementReturn),
        kacc: n(s.customK401AccumReturn),
        kpost: n(s.customK401PostReturn),
        note: "Custom uses the scenario-specific return overrides below.",
      };
    if (s.scenario === "crash") {
      const iyw = Math.max(n(s.iywAccumReturn) - 9, 3),
        qqqm = Math.max(n(s.qqqmAccumReturn) - 8, 2),
        post = Math.max(n(s.postRetirementReturn) - 2, 2),
        kacc = Math.max(n(s.k401AccumReturn) - 2, 3),
        kpost = Math.max(n(s.k401PostReturn) - 2, 3);
      return {
        label: "Tech Crash",
        iyw,
        qqqm,
        post,
        kacc,
        kpost,
        note: `Tech crash trims ${blendLabel("blendA")} to ${pct(iyw)}, ${blendLabel("blendB")} to ${pct(qqqm)}, post-retirement growth to ${pct(post)}, and 401k growth to ${pct(kacc)} / ${pct(kpost)}.`,
      };
    }
    return {
      label: "Bull Case",
      iyw: n(s.iywAccumReturn),
      qqqm: n(s.qqqmAccumReturn),
      post: n(s.postRetirementReturn),
      kacc: n(s.k401AccumReturn),
      kpost: n(s.k401PostReturn),
      note: "Bull case uses your base return assumptions exactly as entered.",
    };
  }
  function baselinePlanningRates(s) {
    return {
      label: "Base plan",
      iyw: n(s.iywAccumReturn),
      qqqm: n(s.qqqmAccumReturn),
      post: n(s.postRetirementReturn),
      kacc: n(s.k401AccumReturn),
      kpost: n(s.k401PostReturn),
      note: "Actual progress review uses your saved base assumptions rather than the active scenario toggle.",
    };
  }

  /* ===== SIMULATION ENGINE ===== */
  function bridgeSim(s, f, retAge, r, override) {
    const cur = computeAge(s),
      unlock = n(s.unlockAge, 59.5),
      bAccum = mRate(f === "iyw" ? r.iyw : r.qqqm),
      bPost = mRate(r.post),
      kAccum = mRate(r.kacc),
      kPost = mRate(r.kpost),
      spend = n(s.annualRetirementSpend) / 12,
      startDate = s.currentDate || today;
    let b = n(s.currentBrokerageBalance),
      k = n(s.current401kBalance);
    const mRet = Math.max(0, Math.ceil((retAge - cur) * 12 - 1e-9)),
      actual = cur + mRet / 12;
    for (let i = 1; i <= mRet; i++) {
      const entry = assumptionsForDate(s, addMonthsIso(startDate, i)),
        bContrib = override ?? n(entry.monthlyBrokerageContribution),
        kContrib = k401MonthlyFromValues(
          entry.annualSalary,
          entry.contributionPct,
          entry.employerMatchPct,
        );
      b = b * (1 + bAccum) + bContrib;
      k = k * (1 + kAccum) + kContrib;
    }
    const bRet = b,
      kRet = k;
    if (actual >= unlock)
      return {
        viable: bRet >= 5000,
        currentAge: cur,
        actualRetirementAge: actual,
        brokerageAtRetirement: bRet,
        k401AtRetirement: kRet,
        brokerageAtUnlock: bRet,
        k401AtUnlock: kRet,
        totalAtUnlock: bRet + kRet,
      };
    const mUnlock = Math.max(0, Math.ceil((unlock - actual) * 12 - 1e-9));
    for (let i = 0; i < mUnlock; i++) {
      b = Math.max(0, b * (1 + bPost) - spend);
      k = k * (1 + kPost);
    }
    return {
      viable: b >= 5000,
      currentAge: cur,
      actualRetirementAge: actual,
      brokerageAtRetirement: bRet,
      k401AtRetirement: kRet,
      brokerageAtUnlock: b,
      k401AtUnlock: k,
      totalAtUnlock: b + k,
    };
  }
  function project(s, f, retAge, r) {
    const cur = computeAge(s),
      unlock = n(s.unlockAge),
      claim = n(s.ssClaimAge),
      chartEndAge = Math.max(unlock, n(s.chartEndAge, 80)),
      bAccum = mRate(f === "iyw" ? r.iyw : r.qqqm),
      bPost = mRate(r.post),
      kAccum = mRate(r.kacc),
      kPost = mRate(r.kpost),
      spend = n(s.annualRetirementSpend) / 12,
      annualSpend = n(s.annualRetirementSpend),
      ss = ssMonthly(s),
      startDate = s.currentDate || today;
    let b = n(s.currentBrokerageBalance),
      k = n(s.current401kBalance);
    const bSeries = [{ x: cur, y: b }],
      kSeries = [{ x: cur, y: k }],
      cashflowSSSeries = [],
      cashflowSpendSeries = [],
      cashflow401kWithdrawSeries = [],
      cashflowBrokerageWithdrawSeries = [],
      cSeries = [];
    const mRet = Math.max(0, Math.ceil((retAge - cur) * 12 - 1e-9)),
      actual = cur + mRet / 12;
    const pushB = (x, y) => {
      if (x <= 62.001) bSeries.push({ x, y: Math.max(0, y) });
    };
    const pushK = (x, y) => {
      if (x <= chartEndAge + 0.001) kSeries.push({ x, y: Math.max(0, y) });
    };
    const pushCash = (x, ssAnnual, spendAnnual, k401WithdrawAnnual, brokerageWithdrawAnnual) => {
      if (x <= chartEndAge + 0.001) {
        cashflowSSSeries.push({ x, y: Math.max(0, ssAnnual) });
        cashflowSpendSeries.push({ x, y: Math.max(0, spendAnnual) });
        cashflow401kWithdrawSeries.push({
          x,
          y: Math.max(0, k401WithdrawAnnual),
        });
        cashflowBrokerageWithdrawSeries.push({
          x,
          y: Math.max(0, brokerageWithdrawAnnual),
        });
      }
    };
    for (let i = 1; i <= mRet; i++) {
      const entry = assumptionsForDate(s, addMonthsIso(startDate, i)),
        bContrib = n(entry.monthlyBrokerageContribution),
        kContrib = k401MonthlyFromValues(
          entry.annualSalary,
          entry.contributionPct,
          entry.employerMatchPct,
        );
      b = b * (1 + bAccum) + bContrib;
      k = k * (1 + kAccum) + kContrib;
      pushB(cur + i / 12, b);
      pushK(cur + i / 12, k);
    }
    const bRet = b,
      kRet = k;
    let bUnlock = b,
      kUnlock = k,
      start = actual;
    if (actual < unlock) {
      const mUnlock = Math.max(
        0,
        Math.ceil((unlock - actual) * 12 - 1e-9),
      );
      for (let i = 1; i <= mUnlock; i++) {
        b = Math.max(0, b * (1 + bPost) - spend);
        k = k * (1 + kPost);
        const agePoint = actual + i / 12;
        pushB(agePoint, b);
        pushK(agePoint, k);
        pushCash(agePoint, 0, annualSpend, 0, annualSpend);
      }
      bUnlock = b;
      kUnlock = k;
      start = unlock;
    }
    let bs = Math.max(0, bUnlock),
      ks = Math.max(0, kUnlock),
      kOnly = Math.max(0, kUnlock),
      life = null;
    cSeries.push({ x: start, y: bs + ks });
    const totalMonths = Math.max(0, Math.round((110 - start) * 12));
    for (let i = 1; i <= totalMonths; i++) {
      const a = start + i / 12,
        income = a >= claim ? ss : 0,
        need = Math.max(0, spend - income),
        before = bs + ks;
      const kWithdraw = Math.min(kOnly, need);
      const bWithdraw = Math.max(0, need - kWithdraw);
      if (need > 0) kOnly = Math.max(0, kOnly - kWithdraw);
      if (kOnly > 0.01) kOnly *= 1 + kPost;
      else kOnly = 0;
      pushK(a, kOnly);
      if (before <= 0.01) {
        bs = 0;
        ks = 0;
        if (life == null) life = a;
        cSeries.push({ x: a, y: 0 });
        pushB(a, 0);
        pushCash(a, income * 12, annualSpend, kWithdraw * 12, bWithdraw * 12);
        break;
      }
      if (need > 0) {
        let remain = need,
          kw = Math.min(ks, remain);
        ks -= kw;
        remain -= kw;
        if (remain > 0.01) bs = Math.max(0, bs - remain);
      }
      bs *= 1 + bPost;
      ks *= 1 + kPost;
      const total = Math.max(0, bs + ks);
      cSeries.push({ x: a, y: total });
      pushB(a, bs);
      pushCash(a, income * 12, annualSpend, kWithdraw * 12, bWithdraw * 12);
      if (total <= 0.01 && life == null) {
        life = a;
        break;
      }
    }
    const sustain = (Math.max(0, bUnlock) + Math.max(0, kUnlock)) * 0.04,
      annualSS = ss * 12;
    return {
      ...bridgeSim(s, f, retAge, r),
      actualRetirementAge: actual,
      brokerageAtRetirement: bRet,
      k401AtRetirement: kRet,
      brokerageAtUnlock: bUnlock,
      k401AtUnlock: kUnlock,
      totalAtUnlock: Math.max(0, bUnlock) + Math.max(0, kUnlock),
      sustainableWithdrawal: sustain,
      annualSS,
      annualGapOrSurplus: sustain + annualSS - n(s.annualRetirementSpend),
      longevityAge: life,
      brokerageSeries: bSeries,
      k401Series: kSeries,
      cashflowSSSeries,
      cashflowSpendSeries,
      cashflow401kWithdrawSeries,
      cashflowBrokerageWithdrawSeries,
      combinedSeries: cSeries,
    };
  }
  function earliest(s, f, r) {
    const cur = computeAge(s),
      max = Math.max(0, Math.round((75 - cur) * 12));
    for (let i = 0; i <= max; i++) {
      const a = cur + i / 12;
      if (bridgeSim(s, f, a, r).viable) return a;
    }
    return null;
  }
  function bridgeNeed(s, r) {
    return bridgeNeedAtAge(s, r, n(s.targetRetirementAge));
  }
  function bridgeNeedAtAge(s, r, retirementAge) {
    const cur = computeAge(s),
      target = Math.max(cur, retirementAge),
      unlock = n(s.unlockAge);
    if (target >= unlock) return 0;
    const months = Math.max(0, Math.ceil((unlock - target) * 12 - 1e-9)),
      spend = n(s.annualRetirementSpend) / 12,
      rate = mRate(r.post);
    let lo = 0,
      hi = 1e7;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      let bal = mid;
      for (let m = 0; m < months; m++)
        bal = Math.max(0, bal * (1 + rate) - spend);
      if (bal >= 5000) hi = mid;
      else lo = mid;
    }
    return hi;
  }
  function minContrib(s, f, r) {
    const target = n(s.targetRetirementAge),
      cur = computeAge(s);
    if (target <= cur) return n(s.monthlyBrokerageContribution);
    if (bridgeSim(s, f, target, r).viable)
      return n(s.monthlyBrokerageContribution);
    let lo = 0,
      hi = 50000;
    while (!bridgeSim(s, f, target, r, hi).viable && hi < 250000) hi *= 2;
    if (hi >= 250000) return null;
    for (let i = 0; i < 45; i++) {
      const mid = (lo + hi) / 2;
      if (bridgeSim(s, f, target, r, mid).viable) hi = mid;
      else lo = mid;
    }
    return Math.ceil(hi / 50) * 50;
  }

  /* ===== UI VALUE SETTERS ===== */
  function setVal(id, val, type) {
    const e = ui[id];
    if (!e) return;
    if (type === "date" || type === "select") e.value = String(val);
    else if (type === "currency") e.value = money(val);
    else if (type === "age") e.value = num(val, 1);
    else if (type === "percent")
      e.value = num(val, val % 1 === 0 ? 0 : 1);
    else e.value = val;
  }
  function fillInputs() {
    setVal("currentAgeInput", state.currentAge, "age");
    setVal("currentDate", state.currentDate, "date");
    setVal("dob", state.dateOfBirth, "date");
    setVal(
      "monthlyBrokerageContribution",
      state.monthlyBrokerageContribution,
      "currency",
    );
    setVal("annualSalary", state.annualSalary, "currency");
    setVal("employerMatchPct", state.employerMatchPct, "percent");
    setVal("targetRetirementAge", state.targetRetirementAge, "age");
    setVal(
      "scenarioTargetRetirementAge",
      state.scenarioTargetRetirementAge,
      "age",
    );
    setVal(
      "annualRetirementSpend",
      state.annualRetirementSpend,
      "currency",
    );
    setVal("unlockAge", state.unlockAge, "age");
    setVal("chartEndAge", state.chartEndAge, "age");
    if (ui.showBlendAChart) ui.showBlendAChart.checked = !!state.showBlendAChart;
    if (ui.showBlendBChart) ui.showBlendBChart.checked = !!state.showBlendBChart;
    if (ui.showBlendALabel)
      ui.showBlendALabel.textContent = `${blendLabel("blendA")} path`;
    if (ui.showBlendBLabelInline)
      ui.showBlendBLabelInline.textContent = `${blendLabel("blendB")} path`;
    setVal("blendAWeight1", state.blendAWeight1, "percent");
    setVal("blendAReturn1", state.blendAReturn1, "percent");
    setVal("blendAWeight2", state.blendAWeight2, "percent");
    setVal("blendAReturn2", state.blendAReturn2, "percent");
    setVal("blendBWeight1", state.blendBWeight1, "percent");
    setVal("blendBReturn1", state.blendBReturn1, "percent");
    setVal("blendBWeight2", state.blendBWeight2, "percent");
    setVal("blendBReturn2", state.blendBReturn2, "percent");
    ui.blendATicker1.value = String(state.blendATicker1 || "");
    ui.blendATicker2.value = String(state.blendATicker2 || "");
    ui.blendBTicker1.value = String(state.blendBTicker1 || "");
    ui.blendBTicker2.value = String(state.blendBTicker2 || "");
    setVal("iywAccumReturn", state.iywAccumReturn, "percent");
    setVal("qqqmAccumReturn", state.qqqmAccumReturn, "percent");
    setVal("postRetirementReturn", state.postRetirementReturn, "percent");
    setVal("k401AccumReturn", state.k401AccumReturn, "percent");
    setVal("k401PostReturn", state.k401PostReturn, "percent");
    setVal("ss62", state.ss62, "currency");
    setVal("ssFRA", state.ssFRA, "currency");
    setVal("customIywAccumReturn", state.customIywAccumReturn, "percent");
    setVal(
      "customQqqmAccumReturn",
      state.customQqqmAccumReturn,
      "percent",
    );
    setVal(
      "customPostRetirementReturn",
      state.customPostRetirementReturn,
      "percent",
    );
    setVal(
      "customK401AccumReturn",
      state.customK401AccumReturn,
      "percent",
    );
    setVal("customK401PostReturn", state.customK401PostReturn, "percent");
    ui.contributionPct.value = String(state.contributionPct);
    ui.ssClaimAge.value = String(state.ssClaimAge);
    ui.monthlyBrokerageContributionRange.value = String(
      Math.min(5000, Math.max(500, state.monthlyBrokerageContribution)),
    );
    ui.targetRetirementAgeRange.value = String(
      Math.min(60, Math.max(47, state.targetRetirementAge)),
    );
    ui.scenarioTargetRetirementAgeRange.value = String(
      Math.min(60, Math.max(47, state.scenarioTargetRetirementAge)),
    );
    ui.annualRetirementSpendRange.value = String(
      Math.min(80000, Math.max(35000, state.annualRetirementSpend)),
    );
    ui.monthly401.textContent = money(k401Monthly(state));
    ui.ssApplied.textContent = `${money(ssMonthly(state))} / month`;
    ui.blendALabel.textContent = `Primary: ${blendLabel("blendA")}`;
    ui.blendBLabel.textContent = `Alternative: ${blendLabel("blendB")}`;
    ui.blendABlendedReturn.textContent = pct(state.iywAccumReturn);
    ui.blendBBlendedReturn.textContent = pct(state.qqqmAccumReturn);
    ["bull", "crash", "custom"].forEach((s) =>
      document
        .querySelector(`.pill[data-s="${s}"]`)
        ?.classList.toggle("active", state.scenario === s),
    );
    ui.customGrid.classList.toggle("hidden", state.scenario !== "custom");
  }

  /* ===== HISTORY HELPERS ===== */
  function historySort(a, b) {
    const ad = new Date(`${a.date}T12:00:00`).getTime(),
      bd = new Date(`${b.date}T12:00:00`).getTime();
    if (bd !== ad) return bd - ad;
    return new Date(b.timestamp) - new Date(a.timestamp);
  }
  function sortedHistory() {
    return [...state.balanceHistory].sort(historySort);
  }
  function sortedAssumptionHistory() {
    return [...state.assumptionHistory].sort(assumptionSort);
  }
  function latestHistoryEntry() {
    return sortedHistory()[0];
  }
  function activeAssumptionEntry(date = state.currentDate || today) {
    const rows = sortedAssumptionHistory();
    return (
      rows.find((r) => r.effectiveDate <= date) ||
      rows[rows.length - 1] ||
      null
    );
  }
  function syncCurrentFromHistory() {
    const x = latestHistoryEntry();
    if (x) {
      state.currentBrokerageBalance = n(
        x.brokerage,
        state.currentBrokerageBalance,
      );
      state.current401kBalance = n(x.k401, state.current401kBalance);
    }
    const a = activeAssumptionEntry(state.currentDate || today);
    if (!a) return;
    state.monthlyBrokerageContribution = n(
      a.monthlyBrokerageContribution,
      state.monthlyBrokerageContribution,
    );
    state.annualSalary = n(a.annualSalary, state.annualSalary);
    state.contributionPct = [6, 8].includes(Number(a.contributionPct))
      ? n(a.contributionPct)
      : state.contributionPct;
    state.employerMatchPct = n(
      a.employerMatchPct,
      state.employerMatchPct,
    );
  }
  function lastUpdated() {
    const x = latestHistoryEntry();
    if (!x || !x.date) return "No snapshots yet";
    const d = new Date(`${x.date}T12:00:00`),
      now = new Date(`${today}T12:00:00`),
      days = Math.floor((now - d) / 86400000);
    if (days <= 0) return `Today (${fmtDate(x.date)})`;
    if (days === 1) return `1 day ago`;
    return `${days} days ago`;
  }
  function totalBalance(r) {
    return n(r?.brokerage) + n(r?.k401);
  }
  function balanceValue(r, key) {
    if (!r) return 0;
    return key === "total" ? totalBalance(r) : n(r?.[key]);
  }
  function delta(v) {
    return v > 0 ? "deltaUp" : v < 0 ? "deltaDown" : "mutedValue";
  }
  function diff(cur, ref) {
    if (!cur || !ref) return null;
    const a = totalBalance(cur),
      b = totalBalance(ref),
      d = a - b,
      p = b > 0 ? (d / b) * 100 : null;
    return { amount: d, percent: p };
  }
  function diffBalanceField(cur, ref, key) {
    if (!cur || !ref) return null;
    const a = balanceValue(cur, key),
      b = balanceValue(ref, key),
      d = a - b,
      p = b > 0 ? (d / b) * 100 : null;
    return { amount: d, percent: p };
  }
  function historyOnOrBefore(date) {
    return sortedHistory().find((r) => r.date <= date) || null;
  }
  function historyMetrics() {
    const latest = latestHistoryEntry();
    if (!latest) return null;
    const monthRef = historyOnOrBefore(
        new Date(
          new Date(`${latest.date}T12:00:00`).setMonth(
            new Date(`${latest.date}T12:00:00`).getMonth() - 1,
          ),
        )
          .toISOString()
          .slice(0, 10),
      ),
      yearRef = historyOnOrBefore(
        new Date(
          new Date(`${latest.date}T12:00:00`).setFullYear(
            new Date(`${latest.date}T12:00:00`).getFullYear() - 1,
          ),
        )
          .toISOString()
          .slice(0, 10),
      ),
      first = sortedHistory().slice(-1)[0] || null;
    return {
      latest,
      total: totalBalance(latest),
      brokerage: n(latest.brokerage),
      k401: n(latest.k401),
      monthly:
        monthRef && monthRef.timestamp !== latest.timestamp
          ? diff(latest, monthRef)
          : null,
      monthlyBrokerage:
        monthRef && monthRef.timestamp !== latest.timestamp
          ? diffBalanceField(latest, monthRef, "brokerage")
          : null,
      monthly401:
        monthRef && monthRef.timestamp !== latest.timestamp
          ? diffBalanceField(latest, monthRef, "k401")
          : null,
      yearly:
        yearRef && yearRef.timestamp !== latest.timestamp
          ? diff(latest, yearRef)
          : null,
      yearlyBrokerage:
        yearRef && yearRef.timestamp !== latest.timestamp
          ? diffBalanceField(latest, yearRef, "brokerage")
          : null,
      yearly401:
        yearRef && yearRef.timestamp !== latest.timestamp
          ? diffBalanceField(latest, yearRef, "k401")
          : null,
      lifetime:
        first && first.timestamp !== latest.timestamp
          ? diff(latest, first)
          : null,
      lifetimeBrokerage:
        first && first.timestamp !== latest.timestamp
          ? diffBalanceField(latest, first, "brokerage")
          : null,
      lifetime401:
        first && first.timestamp !== latest.timestamp
          ? diffBalanceField(latest, first, "k401")
          : null,
    };
  }

  /* ===== PROGRESS ANALYSIS ===== */
  function snapshotState(row, currentState) {
    return {
      ...currentState,
      currentDate: row.date,
      currentBrokerageBalance: n(row.brokerage),
      current401kBalance: n(row.k401),
      currentAge: computeAge({
        ...currentState,
        currentDate: row.date,
      }),
    };
  }
  function monthsBetweenAges(startAge, endAge) {
    return Math.max(0, Math.ceil((endAge - startAge) * 12 - 1e-9));
  }
  function sampleSeriesAtAge(series, targetAge) {
    if (!Array.isArray(series) || !series.length) return 0;
    let value = n(series[0]?.y, 0);
    for (const point of series) {
      if (n(point?.x, 0) <= targetAge + 1e-9) value = n(point?.y, value);
      else break;
    }
    return value;
  }
  function buildFundingBuckets(result, startAge, endAge) {
    const ages = [];
    for (let agePoint = startAge; agePoint <= endAge + 1e-9; agePoint += 1) {
      ages.push(Math.round(agePoint * 10) / 10);
    }
    const ss = ages.map((agePoint) =>
        sampleSeriesAtAge(result.cashflowSSSeries, agePoint),
      ),
      spend = ages.map((agePoint) =>
        sampleSeriesAtAge(result.cashflowSpendSeries, agePoint),
      ),
      k401 = ages.map((agePoint) =>
        sampleSeriesAtAge(result.cashflow401kWithdrawSeries, agePoint),
      ),
      brokerage = ages.map((agePoint) =>
        sampleSeriesAtAge(result.cashflowBrokerageWithdrawSeries, agePoint),
      ),
      gap = ages.map((_, index) =>
        Math.max(0, spend[index] - ss[index] - k401[index] - brokerage[index]),
      );
    return {
      labels: ages.map((agePoint) => age(agePoint)),
      ss,
      spend,
      k401,
      brokerage,
      gap,
    };
  }
  function bridgeBalanceAtUnlockFromRetirementBalance(
    retirementBalance,
    retirementAge,
    stateLike,
    rates,
  ) {
    const unlock = n(stateLike.unlockAge, 59.5),
      spend = n(stateLike.annualRetirementSpend) / 12,
      rate = mRate(rates.post),
      months = monthsBetweenAges(retirementAge, unlock);
    let balance = Math.max(0, retirementBalance);
    for (let i = 0; i < months; i += 1) {
      balance = Math.max(0, balance * (1 + rate) - spend);
    }
    return balance;
  }
  function retirementNeedProfile(stateLike, rates) {
    const currentAge = computeAge(stateLike),
      retirementAge = Math.max(currentAge, n(stateLike.targetRetirementAge)),
      unlock = n(stateLike.unlockAge, 59.5),
      ssAnnual = ssMonthly(stateLike) * 12,
      requiredBrokerageAtRetirement =
        retirementAge >= unlock ? 0 : bridgeNeed(stateLike, rates),
      brokerageAtUnlock = bridgeBalanceAtUnlockFromRetirementBalance(
        requiredBrokerageAtRetirement,
        retirementAge,
        stateLike,
        rates,
      ),
      requiredCombinedAtUnlock = Math.max(
        0,
        (n(stateLike.annualRetirementSpend) - ssAnnual) / 0.04,
      ),
      required401kAtUnlock = Math.max(
        0,
        requiredCombinedAtUnlock - brokerageAtUnlock,
      ),
      monthsToUnlock = monthsBetweenAges(retirementAge, unlock),
      kGrowth = Math.pow(1 + mRate(rates.kpost), monthsToUnlock);
    return {
      retirementAge,
      requiredBrokerageAtRetirement,
      brokerageAtUnlock,
      requiredCombinedAtUnlock,
      required401kAtUnlock,
      required401kAtRetirement:
        monthsToUnlock > 0 ? required401kAtUnlock / kGrowth : required401kAtUnlock,
    };
  }
  function requiredRoleBalanceForSnapshot(
    row,
    currentState,
    fundKey,
    rates,
    balanceKey,
  ) {
    const snapshot = snapshotState(row, currentState),
      profile = retirementNeedProfile(snapshot, rates),
      targetAge = profile.retirementAge,
      roleTarget =
        balanceKey === "brokerage"
          ? profile.requiredBrokerageAtRetirement
          : profile.required401kAtRetirement,
      balanceField =
        balanceKey === "brokerage"
          ? "currentBrokerageBalance"
          : "current401kBalance",
      tester = (amount) => {
        const testState = { ...snapshot, [balanceField]: amount },
          result = bridgeSim(testState, fundKey, targetAge, rates);
        return balanceKey === "brokerage"
          ? result.brokerageAtRetirement >= roleTarget
          : result.k401AtRetirement >= roleTarget;
      };
    if (roleTarget <= 0 || tester(0)) return 0;
    let hi = Math.max(
      25000,
      n(row[balanceKey === "brokerage" ? "brokerage" : "k401"]) * 1.5,
      roleTarget * 1.5,
    );
    while (!tester(hi) && hi < 25000000) hi *= 2;
    if (hi >= 25000000 && !tester(hi)) return null;
    let lo = 0;
    for (let i = 0; i < 60; i += 1) {
      const mid = (lo + hi) / 2;
      if (tester(mid)) hi = mid;
      else lo = mid;
    }
    return hi;
  }
  function chartMonthKey(date) {
    return String(date || "").slice(0, 7);
  }
  function chartMonthLabel(monthKey) {
    return new Date(`${monthKey}-01T12:00:00`).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  function monthKeysBetween(startDate, endDate) {
    const start = chartMonthKey(startDate),
      end = chartMonthKey(endDate);
    if (!start || !end) return [];
    const out = [];
    let cursor = `${start}-01`;
    while (chartMonthKey(cursor) <= end) {
      out.push(chartMonthKey(cursor));
      cursor = addMonthsIso(cursor, 1);
    }
    return out;
  }
  function straightLinePath(startValue, endValue, steps) {
    if (steps <= 0) return [endValue];
    return Array.from({ length: steps + 1 }, (_, i) => {
      const progress = i / steps;
      return startValue + (endValue - startValue) * progress;
    });
  }
  function projectedAccumulationSeries(currentState, fundKey, rates) {
    const latest = latestHistoryEntry();
    if (!latest) return { brokerage: {}, k401: {} };
    const snapshot = snapshotState(latest, currentState),
      snapshotAge = computeAge(snapshot),
      targetAge = Math.max(snapshotAge, n(currentState.targetRetirementAge)),
      monthsToTarget = Math.max(
        0,
        Math.ceil((targetAge - snapshotAge) * 12 - 1e-9),
      ),
      brokerageRate = mRate(fundKey === "iyw" ? rates.iyw : rates.qqqm),
      k401Rate = mRate(rates.kacc),
      brokerage = {},
      k401 = {};
    let b = n(snapshot.currentBrokerageBalance),
      k = n(snapshot.current401kBalance),
      currentMonth = chartMonthKey(latest.date);
    brokerage[currentMonth] = b;
    k401[currentMonth] = k;
    for (let i = 1; i <= monthsToTarget; i += 1) {
      const nextDate = addMonthsIso(latest.date, i),
        assumptions = assumptionsForDate(snapshot, nextDate),
        bContrib = n(assumptions.monthlyBrokerageContribution),
        kContrib = k401MonthlyFromValues(
          assumptions.annualSalary,
          assumptions.contributionPct,
          assumptions.employerMatchPct,
        ),
        monthKey = chartMonthKey(nextDate);
      b = b * (1 + brokerageRate) + bContrib;
      k = k * (1 + k401Rate) + kContrib;
      brokerage[monthKey] = b;
      k401[monthKey] = k;
    }
    return { brokerage, k401 };
  }
  function currentPlanFundKey() {
    return "iyw";
  }
  function projectedTargetSnapshot(currentState, rates) {
    const latest = latestHistoryEntry();
    if (!latest) return null;
    const latestSnapshot = snapshotState(latest, currentState),
      latestAge = computeAge(latestSnapshot),
      targetAge = Math.max(latestAge, n(currentState.targetRetirementAge)),
      monthsToTarget = monthsBetweenAges(latestAge, targetAge),
      targetDate = addMonthsIso(latest.date, monthsToTarget),
      fundKey = currentPlanFundKey(),
      projected = projectedAccumulationSeries(currentState, fundKey, rates),
      monthKey = chartMonthKey(targetDate);
    return {
      date: targetDate,
      brokerage:
        projected.brokerage[monthKey] ?? n(latest.brokerage, 0),
      k401: projected.k401[monthKey] ?? n(latest.k401, 0),
      targetAge,
      monthsToTarget,
    };
  }
  function buildActualProgressData(currentState, rates) {
    const rows = [...sortedHistory()].reverse();
    if (!rows.length) {
      return {
        labels: [],
        actualBrokerage: [],
        actual401k: [],
        requiredBrokerage: [],
        required401k: [],
      };
    }
    const latest = rows[rows.length - 1],
      latestSnapshot = snapshotState(latest, currentState),
      latestAge = computeAge(latestSnapshot),
      target = projectedTargetSnapshot(currentState, rates),
      targetAge = Math.max(
        latestAge,
        target?.targetAge ?? n(currentState.targetRetirementAge),
      ),
      monthsToTarget = target?.monthsToTarget ?? monthsBetweenAges(latestAge, targetAge),
      targetDate = target?.date ?? addMonthsIso(latest.date, monthsToTarget),
      fundKey = currentPlanFundKey(),
      monthKeys = monthKeysBetween(rows[0].date, targetDate),
      labels = monthKeys.map(chartMonthLabel),
      actualByMonth = rows.reduce((acc, row) => {
        acc[chartMonthKey(row.date)] = row;
        return acc;
      }, {}),
      latestMonthKey = chartMonthKey(latest.date),
      latestRequiredBrokerage =
        requiredRoleBalanceForSnapshot(
          latest,
          currentState,
          fundKey,
          rates,
          "brokerage",
        ) ?? n(latest.brokerage),
      latestRequired401k =
        requiredRoleBalanceForSnapshot(
          latest,
          currentState,
          fundKey,
          rates,
          "k401",
        ) ?? n(latest.k401),
      targetRequiredBrokerage =
        target == null
          ? latestRequiredBrokerage
          : (requiredRoleBalanceForSnapshot(
              target,
              currentState,
              fundKey,
              rates,
              "brokerage",
            ) ?? latestRequiredBrokerage),
      targetRequired401k =
        target == null
          ? latestRequired401k
          : (requiredRoleBalanceForSnapshot(
              target,
              currentState,
              fundKey,
              rates,
              "k401",
            ) ?? latestRequired401k),
      requiredBrokeragePath = straightLinePath(
        latestRequiredBrokerage,
        targetRequiredBrokerage,
        monthsToTarget,
      ),
      required401kPath = straightLinePath(
        latestRequired401k,
        targetRequired401k,
        monthsToTarget,
      ),
      latestMonthIndex = monthKeys.findIndex((key) => key === latestMonthKey);
    return {
      labels,
      actualBrokerage: monthKeys.map((monthKey) =>
        actualByMonth[monthKey] ? n(actualByMonth[monthKey].brokerage) : null,
      ),
      actual401k: monthKeys.map((monthKey) =>
        actualByMonth[monthKey] ? n(actualByMonth[monthKey].k401) : null,
      ),
      requiredBrokerage: monthKeys.map((_, index) =>
        index < latestMonthIndex
          ? null
          : requiredBrokeragePath[index - latestMonthIndex] ?? null,
      ),
      required401k: monthKeys.map((_, index) =>
        index < latestMonthIndex
          ? null
          : required401kPath[index - latestMonthIndex] ?? null,
      ),
    };
  }
  function latestProgressBenchmark(rates) {
    const latest = latestHistoryEntry();
    if (!latest) return null;
    const fundKey = currentPlanFundKey(),
      latestSnapshot = snapshotState(latest, state),
      profile = retirementNeedProfile(latestSnapshot, rates),
      requiredBrokerage = requiredRoleBalanceForSnapshot(
        latest,
        state,
        fundKey,
        rates,
        "brokerage",
      ),
      required401k = requiredRoleBalanceForSnapshot(
        latest,
        state,
        fundKey,
        rates,
        "k401",
      );
    if (requiredBrokerage == null || required401k == null) return null;
    const requiredTotal = requiredBrokerage + required401k,
      actualBrokerage = n(latest.brokerage),
      actual401k = n(latest.k401),
      actualTotal = totalBalance(latest);
    return {
      key: fundKey,
      label: `your base plan (${blendLabel("blendA")})`,
      profile,
      requiredBrokerage,
      required401k,
      requiredTotal,
      latest,
      actualBrokerage,
      actual401k,
      actualTotal,
      brokerageRatio:
        requiredBrokerage > 0
          ? actualBrokerage / requiredBrokerage
          : 1,
      k401Ratio:
        required401k > 0 ? actual401k / required401k : 1,
      totalRatio: requiredTotal > 0 ? actualTotal / requiredTotal : 1,
    };
  }

  /* ===== RENDER: HERO STATUS DASHBOARD ===== */
  function renderHeroDashboard(rates) {
    const benchmark = latestProgressBenchmark(rates);
    const yearsToRetire = Math.max(0, n(state.targetRetirementAge) - computeAge(state));

    ui.hTarget.textContent = `Age ${age(state.targetRetirementAge)}`;
    ui.hTargetDetail.textContent = `${num(yearsToRetire, 1)} years away`;
    ui.hUpdated.textContent = lastUpdated();
    ui.hUpdatedDetail.textContent = fmtDate(latestHistoryEntry()?.date || today);

    if (!benchmark) {
      ui.hOverallBadge.textContent = "Needs Data";
      ui.heroOverallStatus.className = "statusCard accent";
      ui.hOverallDetail.textContent = "Add a balance snapshot to see your status";
      ui.hBrokerageCoverage.textContent = "-";
      ui.h401kCoverage.textContent = "-";
      return;
    }

    const ratio = benchmark.totalRatio;
    let statusText, statusClass;
    if (ratio >= 1.05) {
      statusText = "Ahead";
      statusClass = "good";
    } else if (ratio >= 0.95) {
      statusText = "On Track";
      statusClass = "good";
    } else if (ratio >= 0.88) {
      statusText = "Slightly Behind";
      statusClass = "okay";
    } else {
      statusText = "Behind";
      statusClass = "bad";
    }

    ui.hOverallBadge.textContent = statusText;
    ui.hOverallBadge.className = `statusValue`;
    ui.hOverallBadge.style.color = `var(--${statusClass === "good" ? "ok" : statusClass === "okay" ? "warn" : "bad"})`;
    ui.heroOverallStatus.className = "statusCard accent";
    ui.hOverallDetail.textContent = `${pct((ratio - 1) * 100)} vs required path`;

    ui.hBrokerageCoverage.textContent = pct(benchmark.brokerageRatio * 100);
    ui.hBrokerageDetail.textContent = `${money(benchmark.actualBrokerage)} of ${money(benchmark.requiredBrokerage)} needed`;

    ui.h401kCoverage.textContent = pct(benchmark.k401Ratio * 100);
    ui.h401kDetail.textContent = `${money(benchmark.actual401k)} of ${money(benchmark.required401k)} needed`;
  }

  /* ===== RENDER: BASE PLAN SNAPSHOT ===== */
  function renderBasePlanSnapshot(rates) {
    if (!ui.basePlanSnapshot) return;
    const active = activeAssumptionEntry() || {},
      profile = retirementNeedProfile(state, rates),
      latest = latestHistoryEntry(),
      latestDate = latest ? fmtDate(latest.date) : "No snapshots yet";
    ui.basePlanSnapshot.innerHTML = [
      `<article class="card"><div class="top"><div><h3>Timeline</h3><p class="sub">Dates that define the benchmark.</p></div></div><div class="rowGrid"><div class="row"><span>Target retirement age</span><strong>${age(state.targetRetirementAge)}</strong></div><div class="row"><span>401k unlock age</span><strong>${age(state.unlockAge)}</strong></div><div class="row"><span>SS claim age</span><strong>${num(state.ssClaimAge, 0)}</strong></div><div class="row"><span>Latest snapshot</span><strong>${latestDate}</strong></div></div></article>`,
      `<article class="card"><div class="top"><div><h3>Spending</h3><p class="sub">Used for on-track review only.</p></div></div><div class="rowGrid"><div class="row"><span>Annual spend target</span><strong>${money(state.annualRetirementSpend)}</strong></div><div class="row"><span>Social Security at claim</span><strong>${money(ssMonthly(state) * 12)}/yr</strong></div><div class="row"><span>Bridge needed at retirement</span><strong>${money(profile.requiredBrokerageAtRetirement)}</strong></div><div class="row"><span>401k needed at unlock</span><strong>${money(profile.required401kAtUnlock)}</strong></div></div></article>`,
      `<article class="card"><div class="top"><div><h3>Accumulation</h3><p class="sub">Current contribution settings and returns.</p></div></div><div class="rowGrid"><div class="row"><span>Brokerage path</span><strong>${blendLabel("blendA")} at ${pct(rates.iyw)}</strong></div><div class="row"><span>Brokerage / mo</span><strong>${money(active.monthlyBrokerageContribution ?? state.monthlyBrokerageContribution)}</strong></div><div class="row"><span>401k contribution</span><strong>${pct(active.contributionPct ?? state.contributionPct)} + ${pct(active.employerMatchPct ?? state.employerMatchPct)} match</strong></div><div class="row"><span>401k growth</span><strong>${pct(rates.kacc)} / ${pct(rates.kpost)}</strong></div></div></article>`,
    ].join("");
  }

  /* ===== RENDER: TRACK STATUS CARDS ===== */
  function renderTrackStatusCards(rates) {
    if (!ui.trackStatusCards) return;
    const benchmark = latestProgressBenchmark(rates);
    if (!benchmark) {
      ui.trackStatusCards.innerHTML =
        `<article class="card"><div class="top"><div><h3>Brokerage Track Status</h3><p class="sub">Save a balance snapshot to compare against your base plan.</p></div><span class="badge okay">Needs data</span></div></article><article class="card"><div class="top"><div><h3>401k Track Status</h3><p class="sub">Save a balance snapshot to compare against your base plan.</p></div><span class="badge okay">Needs data</span></div></article>`;
      return;
    }
    const oneYearLaterState = {
        ...state,
        targetRetirementAge: n(state.targetRetirementAge) + 1,
      },
      fundKey = benchmark.key,
      brokerageReq1y =
        requiredRoleBalanceForSnapshot(
          benchmark.latest,
          oneYearLaterState,
          fundKey,
          rates,
          "brokerage",
        ) ?? benchmark.requiredBrokerage,
      k401Req1y =
        requiredRoleBalanceForSnapshot(
          benchmark.latest,
          oneYearLaterState,
          fundKey,
          rates,
          "k401",
        ) ?? benchmark.required401k,
      makeCard = (
        title,
        actual,
        reqNow,
        reqSoft,
        label,
        roleLabel,
        roleValue,
      ) => {
        const currentGap = reqNow - actual,
          softGap = reqSoft - actual;
        let cls = "bad",
          status = "Off track",
          note = `Today's ${label} balance is below the amount needed to stay on your age-${age(state.targetRetirementAge)} base plan by ${money(Math.max(0, currentGap))}. This likely needs intervention.`;
        if (currentGap <= 0) {
          cls = "good";
          status = "On track";
          note = `Today's ${label} balance is enough to stay on the age-${age(state.targetRetirementAge)} base plan, with ${money(Math.abs(currentGap))} of cushion.`;
        } else if (softGap <= 0) {
          cls = "okay";
          status = "Slightly off";
          note = `Today's ${label} balance misses the current target by ${money(Math.max(0, currentGap))}, but it is still roughly within a one-year slip of plan.`;
        }
        const borderColor = cls === "good" ? "var(--ok)" : cls === "okay" ? "var(--warn)" : "var(--bad)";
        return `<article class="card" style="border-left:3px solid ${borderColor}"><div class="top"><div><h3>${title}</h3><p class="sub">What this account needs today for the age-${age(state.targetRetirementAge)} plan.</p></div><span class="badge ${cls}">${status}</span></div><div class="rowGrid"><div class="row"><span>Actual ${label} today</span><strong>${money(actual)}</strong></div><div class="row"><span>Target for age ${age(state.targetRetirementAge)}</span><strong>${money(reqNow)}</strong></div><div class="row"><span>Ahead / behind</span><strong class="${currentGap <= 0 ? "deltaUp" : "deltaDown"}">${currentGap <= 0 ? `+${money(Math.abs(currentGap))}` : `-${money(currentGap)}`}</strong></div><div class="row"><span>Target for age ${age(n(state.targetRetirementAge) + 1)}</span><strong>${money(reqSoft)}</strong></div><div class="row"><span>${roleLabel}</span><strong>${money(roleValue)}</strong></div></div><p class="sub" style="margin-top:.7rem">${note}</p></article>`;
      };
    ui.trackStatusCards.innerHTML = [
      makeCard(
        "Brokerage Track Status",
        benchmark.actualBrokerage,
        benchmark.requiredBrokerage,
        brokerageReq1y,
        "brokerage",
        "Bridge needed at retirement",
        benchmark.profile.requiredBrokerageAtRetirement,
      ),
      makeCard(
        "401k Track Status",
        benchmark.actual401k,
        benchmark.required401k,
        k401Req1y,
        "401k",
        "401k needed at unlock",
        benchmark.profile.required401kAtUnlock,
      ),
    ].join("");
  }

  /* ===== RENDER: CHANGE CARDS ===== */
  function formatDeltaSummary(value, emptyLabel) {
    if (!value) return emptyLabel;
    const percent = value.percent == null ? "-" : pct(value.percent);
    return `${percent} (${value.amount >= 0 ? "+" : ""}${money(value.amount)})`;
  }
  function renderChangeCards() {
    const m = historyMetrics();
    if (!ui.changeCards || !m) return;
    const cards = [
      { label: "Latest Brokerage", main: money(m.brokerage), sub: fmtDate(m.latest.date) },
      { label: "Latest 401k", main: money(m.k401), sub: fmtDate(m.latest.date) },
      { label: "Latest Total", main: money(m.total), sub: fmtDate(m.latest.date) },
    ];
    ui.changeCards.innerHTML = cards
      .map(
        (c) =>
          `<article class="card" style="border-left:3px solid var(--brand)"><span class="mini">${c.label}</span><strong style="display:block;margin-top:.35rem;font-size:1.15rem;color:var(--brand)">${c.main}</strong><div class="sub" style="margin-top:.3rem">${c.sub}</div></article>`,
      )
      .join("");
    if (!ui.changeMatrix) return;
    const rows = [
      { label: "Brokerage", monthly: m.monthlyBrokerage, yearly: m.yearlyBrokerage, lifetime: m.lifetimeBrokerage },
      { label: "401k", monthly: m.monthly401, yearly: m.yearly401, lifetime: m.lifetime401 },
      { label: "Total", monthly: m.monthly, yearly: m.yearly, lifetime: m.lifetime },
    ];
    ui.changeMatrix.innerHTML = rows
      .map(
        (row) =>
          `<tr><td>${row.label}</td><td class="${row.monthly ? delta(row.monthly.amount) : "mutedValue"}">${formatDeltaSummary(row.monthly, "Need older snapshot")}</td><td class="${row.yearly ? delta(row.yearly.amount) : "mutedValue"}">${formatDeltaSummary(row.yearly, "Need 12+ months")}</td><td class="${row.lifetime ? delta(row.lifetime.amount) : "mutedValue"}">${formatDeltaSummary(row.lifetime, "Need 2 snapshots")}</td></tr>`,
      )
      .join("");
  }

  /* ===== RENDER: REVIEW NOTE ===== */
  function suggestedCatchUpIncrease(current, needed, cap) {
    if (needed == null) return null;
    const gap = Math.max(0, needed - current);
    if (gap <= 0) return 0;
    return Math.min(cap, Math.ceil(gap / 50) * 50);
  }
  function renderReviewNote(rates) {
    if (!ui.reviewNote) return;
    const metrics = historyMetrics(),
      benchmark = latestProgressBenchmark(rates);
    if (!metrics || !benchmark) {
      ui.reviewNote.textContent =
        "Add at least one saved balance snapshot to compare actual progress against the balances required for your base plan.";
      return;
    }
    const totalCoverage = pct((benchmark.totalRatio - 1) * 100),
      brokerageCoverage = pct((benchmark.brokerageRatio - 1) * 100),
      k401Coverage = pct((benchmark.k401Ratio - 1) * 100),
      weakMonth =
        (metrics.monthly?.amount ?? 0) < 0 &&
        ((metrics.yearly?.amount ?? 0) > 0 ||
          (metrics.lifetime?.amount ?? 0) > 0),
      neededBrokerage = minContrib(state, benchmark.key, rates),
      moderateBrokerageStep = suggestedCatchUpIncrease(
        n(state.monthlyBrokerageContribution),
        neededBrokerage,
        500,
      ),
      canRaise401k = n(state.contributionPct) < 8,
      contributionStep = canRaise401k
        ? `or raising your 401k contribution from ${pct(state.contributionPct)} to 8%`
        : "while keeping your 401k contribution steady";
    if (benchmark.totalRatio >= 1.05) {
      ui.reviewNote.textContent = `You are ahead of the balance path needed for ${benchmark.label}. Total assets are running ${totalCoverage} versus the required path, with brokerage at ${brokerageCoverage} and 401k at ${k401Coverage}. This is comfortably within range.`;
      return;
    }
    if (benchmark.totalRatio >= 0.95) {
      ui.reviewNote.textContent = weakMonth
        ? `You are still within a normal tracking band for ${benchmark.label}. Total assets are ${totalCoverage} relative to the required path, and the latest softness looks more like a short-term drawdown than a structural miss.`
        : `You are within range of the required path for ${benchmark.label}. Total assets are ${totalCoverage} relative to the needed balance, with brokerage at ${brokerageCoverage} and 401k at ${k401Coverage}.`;
      return;
    }
    if (benchmark.totalRatio >= 0.88) {
      ui.reviewNote.textContent = weakMonth
        ? `You are a bit below the required path for ${benchmark.label}, but the gap is moderate. Consider adding about ${moderateBrokerageStep ? money(moderateBrokerageStep) : "$100-$300"} per month to brokerage ${contributionStep}.`
        : `You are modestly behind the required path for ${benchmark.label}. Total assets are ${totalCoverage} versus required. Consider adding about ${moderateBrokerageStep ? money(moderateBrokerageStep) : "$100-$300"} per month to brokerage ${contributionStep}.`;
      return;
    }
    const fullGapText =
      neededBrokerage == null
        ? "more than this planner can estimate"
        : money(
            Math.max(
              0,
              neededBrokerage - n(state.monthlyBrokerageContribution),
            ),
          );
    ui.reviewNote.textContent = `You are meaningfully behind the balance path for ${benchmark.label}. Total assets are ${totalCoverage} relative to required. Consider brokerage contributions about ${fullGapText} higher ${contributionStep}, or a later retirement age / lower spend.`;
  }

  /* ===== RENDER: HISTORIES ===== */
  function renderHistory() {
    const rows = sortedHistory();
    ui.history.innerHTML = rows
      .map((r, i) => {
        const older = rows[i + 1],
          d = older ? diff(r, older) : null,
          t = d
            ? `${d.amount >= 0 ? "+" : ""}${money(d.amount)}${d.percent == null ? "" : ` (${pct(d.percent)})`}`
            : "-";
        return `<tr><td>${fmtDate(r.date)}</td><td>${money(r.brokerage)}</td><td>${money(r.k401)}</td><td>${money(totalBalance(r))}</td><td class="${d ? delta(d.amount) : "mutedValue"}">${t}</td><td><div class="historyActions"><button class="miniBtn" type="button" data-action="edit" data-id="${r.timestamp}">Edit</button><button class="miniBtn danger" type="button" data-action="delete" data-id="${r.timestamp}">Delete</button></div></td></tr>`;
      })
      .join("");
  }
  function assumptionDeltaText(cur, prev) {
    if (!prev) return "Starting baseline";
    const parts = [];
    const brokerageDelta =
      n(cur.monthlyBrokerageContribution) - n(prev.monthlyBrokerageContribution);
    const salaryDelta = n(cur.annualSalary) - n(prev.annualSalary);
    const contributionDelta =
      n(cur.contributionPct) - n(prev.contributionPct);
    const matchDelta = n(cur.employerMatchPct) - n(prev.employerMatchPct);
    const monthly401Delta =
      k401MonthlyFromValues(
        cur.annualSalary,
        cur.contributionPct,
        cur.employerMatchPct,
      ) -
      k401MonthlyFromValues(
        prev.annualSalary,
        prev.contributionPct,
        prev.employerMatchPct,
      );
    if (brokerageDelta)
      parts.push(
        `Brokerage ${brokerageDelta > 0 ? "+" : ""}${money(brokerageDelta)}`,
      );
    if (salaryDelta)
      parts.push(`Salary ${salaryDelta > 0 ? "+" : ""}${money(salaryDelta)}`);
    if (contributionDelta)
      parts.push(
        `401k ${contributionDelta > 0 ? "+" : ""}${pct(contributionDelta)}`,
      );
    if (matchDelta)
      parts.push(
        `Match ${matchDelta > 0 ? "+" : ""}${pct(matchDelta)}`,
      );
    if (monthly401Delta)
      parts.push(
        `401k/mo ${monthly401Delta > 0 ? "+" : ""}${money(monthly401Delta)}`,
      );
    return parts.join(" &middot; ") || "No change";
  }
  function renderAssumptionHistory() {
    if (!ui.assumptionHistory) return;
    const rows = sortedAssumptionHistory();
    ui.assumptionHistory.innerHTML = rows
      .map(
        (r, i) =>
          `<tr><td>${fmtDate(r.effectiveDate)}</td><td>${money(r.monthlyBrokerageContribution)}</td><td>${money(r.annualSalary)}</td><td>${pct(r.contributionPct)}</td><td>${pct(r.employerMatchPct)}</td><td>${money(k401MonthlyFromValues(r.annualSalary, r.contributionPct, r.employerMatchPct))}</td><td>${assumptionDeltaText(r, rows[i + 1])}</td><td><div class="historyActions"><button class="miniBtn" type="button" data-action="edit" data-id="${r.timestamp}">Edit</button><button class="miniBtn danger" type="button" data-action="delete" data-id="${r.timestamp}">Delete</button></div></td></tr>`,
      )
      .join("");
  }

  /* ===== RENDER: SCENARIO CARDS ===== */
  function renderCards(res, early, stateLike = state) {
    const t = n(stateLike.targetRetirementAge);
    ui.cards.innerHTML = [
      {
        key: "iyw",
        title: `${blendLabel("blendA")} path`,
        rate: res.rates.iyw,
      },
      {
        key: "qqqm",
        title: `${blendLabel("blendB")} path`,
        rate: res.rates.qqqm,
      },
    ]
      .map((f) => {
        const x = res[f.key],
          e = early[f.key],
          cls =
            e == null
              ? "bad"
              : e <= t
                ? "good"
                : e <= t + 2
                  ? "okay"
                  : "bad",
          gapLabel =
            x.annualGapOrSurplus >= 0
              ? "Annual surplus vs spend"
              : "Annual gap vs spend";
        const borderColor = cls === "good" ? "var(--ok)" : cls === "okay" ? "var(--warn)" : "var(--bad)";
        return `<article class="card" style="border-left:3px solid ${borderColor}"><div class="top"><div><h3>${f.title}</h3><p class="sub">Accumulation ${pct(f.rate)}. ${res.rates.label} at age ${age(stateLike.targetRetirementAge)}.</p></div><div class="age ${cls}">${e == null ? "65+" : age(e)}<small>earliest viable</small></div></div><div class="rowGrid"><div class="row"><span>Brokerage at retirement</span><strong>${money(x.brokerageAtRetirement)}</strong></div><div class="row"><span>401k at retirement</span><strong>${money(x.k401AtRetirement)}</strong></div><div class="row"><span>Brokerage at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.brokerageAtUnlock)}</strong></div><div class="row"><span>401k at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.k401AtUnlock)}</strong></div><div class="row"><span>Combined at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.totalAtUnlock)}</strong></div><div class="row"><span>4% withdrawal / year</span><strong>${money(x.sustainableWithdrawal)}</strong></div><div class="row"><span>${gapLabel}</span><strong>${money(Math.abs(x.annualGapOrSurplus))}</strong></div><div class="row"><span>Portfolio longevity</span><strong>${lon(x.longevityAge)}</strong></div></div></article>`;
      })
      .join("");
  }
  function renderStatus(res, stateLike = state) {
    ui.status.innerHTML = [
      { key: "iyw", title: `${blendLabel("blendA")} bridge` },
      { key: "qqqm", title: `${blendLabel("blendB")} bridge` },
    ]
      .map((f) => {
        const x = res[f.key],
          cls = x.viable ? "good" : "bad",
          txt = x.viable ? "Viable" : "Not viable";
        const borderColor = cls === "good" ? "var(--ok)" : "var(--bad)";
        return `<article class="card" style="border-left:3px solid ${borderColor}"><div class="top"><h3 style="margin:0">${f.title}</h3><span class="badge ${cls}">${txt}</span></div><div class="rowGrid"><div class="row"><span>Retirement age</span><strong>${age(x.actualRetirementAge)}</strong></div><div class="row"><span>Brokerage at retirement</span><strong>${money(x.brokerageAtRetirement)}</strong></div><div class="row"><span>Brokerage at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.brokerageAtUnlock)}</strong></div><div class="row"><span>Bridge threshold</span><strong>${x.viable ? ">= $5,000" : "< $5,000"}</strong></div></div></article>`;
      })
      .join("");
  }
  function renderWarning(early, r, stateLike = state) {
    const miss =
      (early.iyw == null || early.iyw > 65) &&
      (early.qqqm == null || early.qqqm > 65);
    if (!miss) {
      ui.warningPanel.classList.add("hidden");
      return;
    }
    const iy = minContrib(stateLike, "iyw", r),
      qq = minContrib(stateLike, "qqqm", r);
    ui.warningText.textContent = `To make age ${age(stateLike.targetRetirementAge)} viable, monthly brokerage contributions would need to be about ${iy == null ? "more than this planner searched for" : money(iy)} for ${blendLabel("blendA")} and ${qq == null ? "more than this planner searched for" : money(qq)} for ${blendLabel("blendB")}.`;
    ui.warningPanel.classList.remove("hidden");
  }
  function renderSummary(res, early, stateLike = state) {
    const target = n(stateLike.targetRetirementAge),
      best = [
        { key: "iyw", label: blendLabel("blendA") },
        { key: "qqqm", label: blendLabel("blendB") },
      ].sort(
        (a, b) => (early[a.key] ?? Infinity) - (early[b.key] ?? Infinity),
      )[0],
      ea = early[best.key],
      x = res[best.key],
      futureAssumptionCount = sortedAssumptionHistory().filter(
        (r) => r.effectiveDate > (stateLike.currentDate || today),
      ).length,
      scheduledNote = futureAssumptionCount
        ? ` Scheduled compensation changes from ${futureAssumptionCount} future effective ${futureAssumptionCount === 1 ? "month" : "months"} are already included.`
        : "",
      gap =
        x.annualGapOrSurplus >= 0
          ? `a ${money(x.annualGapOrSurplus)} annual surplus after Social Security`
          : `a ${money(Math.abs(x.annualGapOrSurplus))} annual shortfall after Social Security`;
    if (ea == null || ea > 65)
      return `${res.rates.label} does not produce a bridge-safe retirement before age 65 for either path. At target age ${age(target)}, ${blendLabel("blendA")} leaves ${money(res.iyw.brokerageAtUnlock)} in brokerage at ${num(stateLike.unlockAge, 1)} and ${blendLabel("blendB")} leaves ${money(res.qqqm.brokerageAtUnlock)}.${scheduledNote}`;
    return `With ${money(stateLike.monthlyBrokerageContribution)}/month into ${best.label}, the earliest bridge-safe age in the ${res.rates.label.toLowerCase()} is ${age(ea)}. At target age ${age(target)}, the ${best.label} path reaches ${money(x.totalAtUnlock)} combined at ${num(stateLike.unlockAge, 1)} and supports ${money(x.sustainableWithdrawal)}/year at 4%. Social Security adds ${money(x.annualSS)}/year at age ${stateLike.ssClaimAge}, leaving ${gap}. Portfolio longevity: age ${lon(x.longevityAge)}.${scheduledNote}`;
  }

  /* ===== CHART RENDERING ===== */
  function paintActualCharts(rates) {
    const showFallback = () => {
      ui.actualBrokerageChart.classList.add("hidden");
      ui.actual401kChart.classList.add("hidden");
      ui.actualBrokerageFallback.classList.remove("hidden");
      ui.actual401kFallback.classList.remove("hidden");
    };
    if (
      typeof Chart === "undefined" ||
      !ui.actualBrokerageChart ||
      !ui.actual401kChart
    ) {
      showFallback();
      return;
    }
    const review = buildActualProgressData(state, rates);
    if (review.labels.length < 1) {
      showFallback();
      return;
    }
    ui.actualBrokerageChart.classList.remove("hidden");
    ui.actual401kChart.classList.remove("hidden");
    ui.actualBrokerageFallback.classList.add("hidden");
    ui.actual401kFallback.classList.add("hidden");
    const css = getComputedStyle(document.documentElement),
      text = css.getPropertyValue("--text").trim(),
      muted = css.getPropertyValue("--muted").trim(),
      border = css.getPropertyValue("--border").trim(),
      lineBase = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { labels: { color: text } },
          tooltip: {
            callbacks: {
              label(c) {
                return `${c.dataset.label}: ${money(c.parsed.y)}`;
              },
            },
          },
        },
        scales: {
          x: { ticks: { color: muted }, grid: { color: border } },
          y: {
            ticks: { color: muted, callback: (v) => money(v, 0) },
            grid: { color: border },
          },
        },
      };
    const normalize = (data) => data.map((v) => (v == null ? null : Math.max(0, v)));
    try {
      if (actualBrokerageReviewChart) actualBrokerageReviewChart.destroy();
      if (actual401kReviewChart) actual401kReviewChart.destroy();
      actualBrokerageReviewChart = new Chart(
        ui.actualBrokerageChart.getContext("2d"),
        {
          type: "line",
          data: {
            labels: review.labels,
            datasets: [
              {
                label: "Actual brokerage",
                data: normalize(review.actualBrokerage),
                borderColor: "#0d667d",
                backgroundColor: "transparent",
                borderWidth: 2.8,
                pointRadius: 3,
                tension: 0.24,
              },
              {
                label: `Required by age ${age(state.targetRetirementAge)}`,
                data: normalize(review.requiredBrokerage),
                borderColor: "#d36b2c",
                backgroundColor: "transparent",
                borderWidth: 2.2,
                pointRadius: 0,
                borderDash: [8, 6],
                spanGaps: true,
                tension: 0.15,
              },
            ],
          },
          options: {
            ...lineBase,
            scales: {
              ...lineBase.scales,
              y: {
                ...lineBase.scales.y,
                title: {
                  display: true,
                  text: "Brokerage balance",
                  color: muted,
                },
              },
            },
          },
        },
      );
      actual401kReviewChart = new Chart(
        ui.actual401kChart.getContext("2d"),
        {
          type: "line",
          data: {
            labels: review.labels,
            datasets: [
              {
                label: "Actual 401k",
                data: normalize(review.actual401k),
                borderColor: "#2f7a58",
                backgroundColor: "transparent",
                borderWidth: 2.8,
                pointRadius: 3,
                tension: 0.24,
              },
              {
                label: `Required by age ${age(state.targetRetirementAge)}`,
                data: normalize(review.required401k),
                borderColor: "#f1a35f",
                backgroundColor: "transparent",
                borderWidth: 2.2,
                pointRadius: 0,
                borderDash: [8, 6],
                spanGaps: true,
                tension: 0.15,
              },
            ],
          },
          options: {
            ...lineBase,
            scales: {
              ...lineBase.scales,
              y: {
                ...lineBase.scales.y,
                title: {
                  display: true,
                  text: "401k balance",
                  color: muted,
                },
              },
            },
          },
        },
      );
    } catch (err) {
      console.error("Actual review chart render failed", err);
      showFallback();
    }
  }
  function paintCharts(res, need, stateLike = state) {
    const showFallback = () => {
      ui.brokerageChart.classList.add("hidden");
      ui.k401Chart.classList.add("hidden");
      ui.mixChart.classList.add("hidden");
      ui.brokerageFallback.classList.remove("hidden");
      ui.k401Fallback.classList.remove("hidden");
      ui.mixFallback.classList.remove("hidden");
    };
    if (typeof Chart === "undefined") {
      showFallback();
      return;
    }
    ui.brokerageChart.classList.remove("hidden");
    ui.k401Chart.classList.remove("hidden");
    ui.mixChart.classList.remove("hidden");
    ui.brokerageFallback.classList.add("hidden");
    ui.k401Fallback.classList.add("hidden");
    ui.mixFallback.classList.add("hidden");
    ui.brokerageChart.removeAttribute("width");
    ui.brokerageChart.removeAttribute("height");
    ui.k401Chart.removeAttribute("width");
    ui.k401Chart.removeAttribute("height");
    ui.mixChart.removeAttribute("width");
    ui.mixChart.removeAttribute("height");
    const css = getComputedStyle(document.documentElement),
      text = css.getPropertyValue("--text").trim(),
      muted = css.getPropertyValue("--muted").trim(),
      border = css.getPropertyValue("--border").trim(),
      bad = css.getPropertyValue("--bad").trim(),
      cur = computeAge(stateLike),
      targetRetirementAge = res.iyw.actualRetirementAge,
      unlockAge = n(stateLike.unlockAge, 59.5),
      claimAge = n(stateLike.ssClaimAge, 62),
      chartEndAge = Math.max(
        n(stateLike.unlockAge, 59.5),
        n(stateLike.chartEndAge, 80),
      ),
      bridgeEndAge = Math.max(unlockAge, targetRetirementAge, cur),
      aLabel = blendLabel("blendA"),
      bLabel = blendLabel("blendB"),
      showA = state.showBlendAChart !== false,
      showB = state.showBlendBChart !== false,
      phaseDatasets = (maxY, includeSS = false) => {
        const out = [
          {
            label: "Retirement age",
            data: [
              { x: targetRetirementAge, y: 0 },
              { x: targetRetirementAge, y: maxY },
            ],
            parsing: false,
            borderColor: "#8a8f98",
            borderWidth: 1.5,
            pointRadius: 0,
            borderDash: [3, 5],
            phaseMarker: true,
          },
          {
            label: "401k unlock age",
            data: [
              { x: unlockAge, y: 0 },
              { x: unlockAge, y: maxY },
            ],
            parsing: false,
            borderColor: "#5f88b2",
            borderWidth: 1.5,
            pointRadius: 0,
            borderDash: [3, 5],
            phaseMarker: true,
          },
        ];
        if (includeSS) {
          out.push({
            label: "Social Security claim age",
            data: [
              { x: claimAge, y: 0 },
              { x: claimAge, y: maxY },
            ],
            parsing: false,
            borderColor: bad,
            borderWidth: 1.5,
            pointRadius: 0,
            borderDash: [3, 5],
            phaseMarker: true,
          });
        }
        return out;
      },
      baseOpts = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: "nearest", intersect: false },
        plugins: {
          legend: {
            labels: {
              color: text,
              filter(item, data) {
                return !data.datasets[item.datasetIndex]?.phaseMarker;
              },
            },
          },
          tooltip: {
            callbacks: {
              label(c) {
                return `${c.dataset.label ? `${c.dataset.label}: ` : ""}${money(c.parsed.y)}`;
              },
            },
          },
        },
        scales: {
          x: {
            type: "linear",
            ticks: { color: muted },
            grid: { color: border },
          },
          y: {
            ticks: { color: muted, callback: (v) => money(v, 0) },
            grid: { color: border },
          },
        },
      };
    try {
      if (bChart) bChart.destroy();
      if (kChart) kChart.destroy();
      if (mixChart) mixChart.destroy();
      const bridgeRequirementSeries = (() => {
          const months = Math.max(
            1,
            Math.ceil((bridgeEndAge - cur) * 12 - 1e-9),
          );
          const points = [];
          for (let i = 0; i <= months; i += 1) {
            const agePoint = cur + i / 12;
            points.push({
              x: agePoint,
              y:
                agePoint >= unlockAge
                  ? 0
                  : bridgeNeedAtAge(stateLike, res.rates, agePoint),
            });
          }
          return points;
        })(),
        bridgeMax = Math.max(
          ...bridgeRequirementSeries.map((p) => p.y),
          ...res.iyw.brokerageSeries.map((p) => p.y),
          ...res.qqqm.brokerageSeries.map((p) => p.y),
        ),
        k401Max = Math.max(...res.iyw.k401Series.map((p) => p.y)),
        fundingBucketsA = buildFundingBuckets(
          res.iyw,
          targetRetirementAge,
          chartEndAge,
        ),
        fundingBucketsB = buildFundingBuckets(
          res.qqqm,
          targetRetirementAge,
          chartEndAge,
        ),
        fundingLabels = fundingBucketsA.labels;
      bChart = new Chart(ui.brokerageChart.getContext("2d"), {
        type: "line",
        data: {
          datasets: [
            ...(showA
              ? [
                  {
                    label: `${aLabel} brokerage`,
                    data: res.iyw.brokerageSeries,
                    parsing: false,
                    borderColor: "#0d667d",
                    borderWidth: 2.5,
                    pointRadius: 0,
                    tension: 0.28,
                  },
                ]
              : []),
            ...(showB
              ? [
                  {
                    label: `${bLabel} brokerage`,
                    data: res.qqqm.brokerageSeries,
                    parsing: false,
                    borderColor: "#d36b2c",
                    borderWidth: 2.5,
                    pointRadius: 0,
                    tension: 0.28,
                  },
                ]
              : []),
            {
              label: "Required bridge balance",
              data: bridgeRequirementSeries,
              parsing: false,
              borderColor: "#8a8f98",
              borderWidth: 2,
              pointRadius: 0,
              borderDash: [8, 6],
              tension: 0.18,
            },
            ...phaseDatasets(bridgeMax),
          ],
        },
        options: {
          ...baseOpts,
          scales: {
            ...baseOpts.scales,
            x: {
              ...baseOpts.scales.x,
              min: cur,
              max: bridgeEndAge,
              title: { display: true, text: "Age", color: muted },
            },
            y: {
              ...baseOpts.scales.y,
              title: {
                display: true,
                text: "Brokerage balance",
                color: muted,
              },
            },
          },
        },
      });
      kChart = new Chart(ui.k401Chart.getContext("2d"), {
        type: "line",
        data: {
          datasets: [
            {
              label: "401k balance",
              data: res.iyw.k401Series,
              parsing: false,
              borderColor: "#2f7a58",
              borderWidth: 2.5,
              pointRadius: 0,
              tension: 0.2,
            },
            ...phaseDatasets(k401Max, true),
          ],
        },
        options: {
          ...baseOpts,
          scales: {
            ...baseOpts.scales,
            x: {
              ...baseOpts.scales.x,
              min: cur,
              max: chartEndAge,
              title: { display: true, text: "Age", color: muted },
            },
            y: {
              ...baseOpts.scales.y,
              title: {
                display: true,
                text: "401k balance",
                color: muted,
              },
            },
          },
        },
      });
      mixChart = new Chart(ui.mixChart.getContext("2d"), {
        type: "bar",
        data: {
          labels: fundingLabels,
          datasets: [
            ...(showA
              ? [
                  {
                    label: `${aLabel} Social Security`,
                    data: fundingBucketsA.ss,
                    backgroundColor: "rgba(138, 143, 152, 0.75)",
                    borderColor: "#8a8f98",
                    borderWidth: 1,
                    stack: "pathA",
                  },
                  {
                    label: `${aLabel} 401k withdrawal`,
                    data: fundingBucketsA.k401,
                    backgroundColor: "rgba(47, 122, 88, 0.85)",
                    borderColor: "#2f7a58",
                    borderWidth: 1,
                    stack: "pathA",
                  },
                  {
                    label: `${aLabel} brokerage withdrawal`,
                    data: fundingBucketsA.brokerage,
                    backgroundColor: "rgba(13, 102, 125, 0.88)",
                    borderColor: "#0d667d",
                    borderWidth: 1,
                    stack: "pathA",
                  },
                  {
                    label: `${aLabel} unfunded gap`,
                    data: fundingBucketsA.gap,
                    backgroundColor: "rgba(177, 60, 53, 0.35)",
                    borderColor: "#b13c35",
                    borderWidth: 1,
                    stack: "pathA",
                  },
                ]
              : []),
            ...(showB
              ? [
                  {
                    label: `${bLabel} Social Security`,
                    data: fundingBucketsB.ss,
                    backgroundColor: "rgba(138, 143, 152, 0.4)",
                    borderColor: "#8a8f98",
                    borderWidth: 1,
                    stack: "pathB",
                  },
                  {
                    label: `${bLabel} 401k withdrawal`,
                    data: fundingBucketsB.k401,
                    backgroundColor: "rgba(47, 122, 88, 0.5)",
                    borderColor: "#2f7a58",
                    borderWidth: 1,
                    stack: "pathB",
                  },
                  {
                    label: `${bLabel} brokerage withdrawal`,
                    data: fundingBucketsB.brokerage,
                    backgroundColor: "rgba(211, 107, 44, 0.85)",
                    borderColor: "#d36b2c",
                    borderWidth: 1,
                    stack: "pathB",
                  },
                  {
                    label: `${bLabel} unfunded gap`,
                    data: fundingBucketsB.gap,
                    backgroundColor: "rgba(177, 60, 53, 0.22)",
                    borderColor: "#b13c35",
                    borderWidth: 1,
                    stack: "pathB",
                  },
                ]
              : []),
            {
              type: "line",
              label: "Annual spend target",
              data: fundingBucketsA.spend,
              borderColor: "#b13c35",
              backgroundColor: "transparent",
              borderWidth: 2,
              pointRadius: 0,
              borderDash: [6, 6],
              tension: 0,
              fill: false,
              order: 0,
            },
          ],
        },
        options: {
          ...baseOpts,
          scales: {
            ...baseOpts.scales,
            x: {
              ticks: { color: muted },
              grid: { color: border },
              stacked: false,
              title: {
                display: true,
                text: "Age",
                color: muted,
              },
            },
            y: {
              ...baseOpts.scales.y,
              stacked: true,
              title: {
                display: true,
                text: "Annual retirement funding",
                color: muted,
              },
            },
          },
        },
      });
    } catch (err) {
      console.error("Chart render failed", err);
      showFallback();
    }
  }

  /* ===== MASTER RENDER ===== */
  function render() {
    syncCurrentFromHistory();
    state.currentAge = computeAge(state);
    applyBlendReturns();
    save();
    fillInputs();
    try {
      const planningRates = baselinePlanningRates(state),
        scenarioState = {
          ...state,
          targetRetirementAge: Math.max(
            state.currentAge,
            n(state.scenarioTargetRetirementAge, state.targetRetirementAge),
          ),
        },
        rates = scenarioRates(state),
        target = Math.max(
          scenarioState.currentAge,
          n(scenarioState.targetRetirementAge),
        ),
        res = {
          rates,
          iyw: project(scenarioState, "iyw", target, rates),
          qqqm: project(scenarioState, "qqqm", target, rates),
        },
        early = {
          iyw: earliest(scenarioState, "iyw", rates),
          qqqm: earliest(scenarioState, "qqqm", rates),
        };
      ui.scenarioNote.textContent = `${rates.note} Scenario retirement age is ${age(scenarioState.targetRetirementAge)}. The brokerage comparison changes between ${blendLabel("blendA")} and ${blendLabel("blendB")}; the 401k path only changes when retirement timing or 401k return assumptions change.`;
      renderHeroDashboard(planningRates);
      renderHistory();
      renderBasePlanSnapshot(planningRates);
      renderTrackStatusCards(planningRates);
      renderChangeCards();
      renderAssumptionHistory();
      renderCards(res, early, scenarioState);
      renderStatus(res, scenarioState);
      renderWarning(early, rates, scenarioState);
      ui.summary.textContent = renderSummary(res, early, scenarioState);
      renderReviewNote(planningRates);
      paintActualCharts(planningRates);
      paintCharts(res, bridgeNeed(scenarioState, rates), scenarioState);
    } catch (err) {
      console.error("Render failed", err);
      ui.scenarioNote.textContent =
        "Some projections could not render, but your saved inputs are still loaded.";
      renderHistory();
      if (ui.basePlanSnapshot) ui.basePlanSnapshot.innerHTML = "";
      ui.trackStatusCards.innerHTML = "";
      renderChangeCards();
      renderAssumptionHistory();
      ui.cards.innerHTML = "";
      ui.status.innerHTML = "";
      ui.summary.textContent =
        "Saved inputs loaded, but the projection engine hit an error. Use Reset defaults if stale data caused this.";
      if (ui.reviewNote)
        ui.reviewNote.textContent =
          "The planner could not finish the review analysis.";
      ui.warningPanel.classList.add("hidden");
      ui.actualBrokerageChart.classList.add("hidden");
      ui.actual401kChart.classList.add("hidden");
      ui.actualBrokerageFallback.classList.remove("hidden");
      ui.actual401kFallback.classList.remove("hidden");
      ui.brokerageChart.classList.add("hidden");
      ui.k401Chart.classList.add("hidden");
      ui.mixChart.classList.add("hidden");
      ui.brokerageFallback.classList.remove("hidden");
      ui.k401Fallback.classList.remove("hidden");
      ui.mixFallback.classList.remove("hidden");
    }
  }

  /* ===== INPUT PERSISTENCE ===== */
  function persistVisibleState() {
    state.currentDate =
      ui.currentDate.value || state.currentDate || today;
    if (document.activeElement === ui.currentAgeInput) {
      const typedAge = n(ui.currentAgeInput.value, state.currentAge);
      state.currentAge = typedAge;
      state.dateOfBirth = dobFromAge(typedAge, state.currentDate);
    } else if (ui.dob.value) {
      state.dateOfBirth = ui.dob.value;
    }
    state.monthlyBrokerageContribution = n(
      ui.monthlyBrokerageContribution.value,
      state.monthlyBrokerageContribution,
    );
    state.annualSalary = n(ui.annualSalary.value, state.annualSalary);
    state.employerMatchPct = n(
      ui.employerMatchPct.value,
      state.employerMatchPct,
    );
    state.targetRetirementAge = n(
      ui.targetRetirementAge.value,
      state.targetRetirementAge,
    );
    state.scenarioTargetRetirementAge = n(
      ui.scenarioTargetRetirementAge?.value,
      state.scenarioTargetRetirementAge,
    );
    state.annualRetirementSpend = n(
      ui.annualRetirementSpend.value,
      state.annualRetirementSpend,
    );
    state.unlockAge = n(ui.unlockAge.value, state.unlockAge);
    state.chartEndAge = Math.max(
      n(state.unlockAge, 59.5),
      n(ui.chartEndAge?.value, state.chartEndAge),
    );
    state.showBlendAChart = ui.showBlendAChart?.checked ?? state.showBlendAChart;
    state.showBlendBChart = ui.showBlendBChart?.checked ?? state.showBlendBChart;
    state.blendATicker1 = String(
      ui.blendATicker1.value || state.blendATicker1,
    )
      .trim()
      .toUpperCase();
    state.blendATicker2 = String(
      ui.blendATicker2.value || state.blendATicker2,
    )
      .trim()
      .toUpperCase();
    state.blendBTicker1 = String(
      ui.blendBTicker1.value || state.blendBTicker1,
    )
      .trim()
      .toUpperCase();
    state.blendBTicker2 = String(
      ui.blendBTicker2.value || state.blendBTicker2,
    )
      .trim()
      .toUpperCase();
    state.blendAWeight1 = n(ui.blendAWeight1.value, state.blendAWeight1);
    state.blendAReturn1 = n(ui.blendAReturn1.value, state.blendAReturn1);
    state.blendAWeight2 = n(ui.blendAWeight2.value, state.blendAWeight2);
    state.blendAReturn2 = n(ui.blendAReturn2.value, state.blendAReturn2);
    state.blendBWeight1 = n(ui.blendBWeight1.value, state.blendBWeight1);
    state.blendBReturn1 = n(ui.blendBReturn1.value, state.blendBReturn1);
    state.blendBWeight2 = n(ui.blendBWeight2.value, state.blendBWeight2);
    state.blendBReturn2 = n(ui.blendBReturn2.value, state.blendBReturn2);
    applyBlendReturns();
    state.postRetirementReturn = n(
      ui.postRetirementReturn.value,
      state.postRetirementReturn,
    );
    state.k401AccumReturn = n(
      ui.k401AccumReturn.value,
      state.k401AccumReturn,
    );
    state.k401PostReturn = n(
      ui.k401PostReturn.value,
      state.k401PostReturn,
    );
    state.ss62 = n(ui.ss62.value, state.ss62);
    state.ssFRA = n(ui.ssFRA.value, state.ssFRA);
    state.customIywAccumReturn = n(
      ui.customIywAccumReturn.value,
      state.customIywAccumReturn,
    );
    state.customQqqmAccumReturn = n(
      ui.customQqqmAccumReturn.value,
      state.customQqqmAccumReturn,
    );
    state.customPostRetirementReturn = n(
      ui.customPostRetirementReturn.value,
      state.customPostRetirementReturn,
    );
    state.customK401AccumReturn = n(
      ui.customK401AccumReturn.value,
      state.customK401AccumReturn,
    );
    state.customK401PostReturn = n(
      ui.customK401PostReturn.value,
      state.customK401PostReturn,
    );
    state.contributionPct = n(
      ui.contributionPct.value,
      state.contributionPct,
    );
    state.ssClaimAge = n(ui.ssClaimAge.value, state.ssClaimAge);
    save();
  }
  function update(k, v) {
    state[k] = v;
    if (
      [
        "monthlyBrokerageContribution",
        "annualSalary",
        "employerMatchPct",
        "contributionPct",
      ].includes(k)
    )
      upsertAssumptionHistory();
    if (["currentBrokerageBalance", "current401kBalance"].includes(k))
      upsertBalanceHistory();
    render();
  }

  /* ===== HISTORY MUTATIONS ===== */
  function upsertBalanceHistory() {
    const date = state.currentDate || today,
      existing = state.balanceHistory.find((r) => r.date === date);
    if (existing) {
      existing.brokerage = n(state.currentBrokerageBalance);
      existing.k401 = n(state.current401kBalance);
      return;
    }
    state.balanceHistory = [
      {
        timestamp: new Date().toISOString(),
        date,
        brokerage: n(state.currentBrokerageBalance),
        k401: n(state.current401kBalance),
      },
      ...state.balanceHistory,
    ];
  }
  function upsertAssumptionHistory(
    effectiveDate = state.currentDate || today,
  ) {
    const existing = state.assumptionHistory.find(
      (r) => r.effectiveDate === effectiveDate,
    );
    if (existing) {
      existing.monthlyBrokerageContribution = n(
        state.monthlyBrokerageContribution,
      );
      existing.annualSalary = n(state.annualSalary);
      existing.contributionPct = n(state.contributionPct);
      existing.employerMatchPct = n(state.employerMatchPct);
      return;
    }
    state.assumptionHistory = [
      {
        timestamp: new Date().toISOString(),
        effectiveDate,
        monthlyBrokerageContribution: n(
          state.monthlyBrokerageContribution,
        ),
        annualSalary: n(state.annualSalary),
        contributionPct: n(state.contributionPct),
        employerMatchPct: n(state.employerMatchPct),
      },
      ...state.assumptionHistory,
    ];
  }

  /* ===== AUTO-FILL ===== */
  async function fetchEstimatedReturn(ticker) {
    const symbol = String(ticker || "")
      .trim()
      .toLowerCase();
    if (!symbol) throw new Error("Enter a ticker first.");
    const response = await fetch(
      `https://stooq.com/q/d/l/?s=${symbol}.us&i=m`,
      { mode: "cors" },
    );
    if (!response.ok)
      throw new Error(`Lookup failed (${response.status}).`);
    const csv = await response.text();
    const rows = csv
      .trim()
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.split(","));
    const closes = rows
      .map((parts) => ({ date: parts[0], close: parseFloat(parts[4]) }))
      .filter((r) => isFinite(r.close));
    if (closes.length < 24)
      throw new Error("Not enough history returned.");
    const latest = closes[closes.length - 1].close,
      first =
        closes[Math.max(0, closes.length - 61)]?.close ?? closes[0].close,
      years = Math.max(1, (closes.length - 1) / 12);
    return (Math.pow(latest / first, 1 / years) - 1) * 100;
  }
  async function autoFillBlend(prefix) {
    ui.blendFetchStatus.textContent = `Trying to estimate returns for ${blendLabel(prefix)}...`;
    try {
      const t1 = String(state[`${prefix}Ticker1`] || "").trim(),
        t2 = String(state[`${prefix}Ticker2`] || "").trim();
      if (!t1 && !t2) throw new Error("Enter at least one ticker.");
      if (t1) {
        const r1 = await fetchEstimatedReturn(t1);
        state[`${prefix}Return1`] = Math.round(r1 * 10) / 10;
      }
      if (t2) {
        const r2 = await fetchEstimatedReturn(t2);
        state[`${prefix}Return2`] = Math.round(r2 * 10) / 10;
      }
      ui.blendFetchStatus.textContent = `Returns refreshed for ${blendLabel(prefix)}. You can still edit them manually.`;
      render();
    } catch (err) {
      ui.blendFetchStatus.textContent = `Auto-fill could not fetch returns. Manual entry remains available. ${err.message || err}`;
    }
  }

  /* ===== EVENT WIRING ===== */
  [
    ["monthlyBrokerageContribution", "monthlyBrokerageContribution"],
    ["annualSalary", "annualSalary"],
    ["employerMatchPct", "employerMatchPct"],
    ["targetRetirementAge", "targetRetirementAge"],
    ["scenarioTargetRetirementAge", "scenarioTargetRetirementAge"],
    ["annualRetirementSpend", "annualRetirementSpend"],
    ["unlockAge", "unlockAge"],
    ["chartEndAge", "chartEndAge"],
    ["blendAWeight1", "blendAWeight1"],
    ["blendAReturn1", "blendAReturn1"],
    ["blendAWeight2", "blendAWeight2"],
    ["blendAReturn2", "blendAReturn2"],
    ["blendBWeight1", "blendBWeight1"],
    ["blendBReturn1", "blendBReturn1"],
    ["blendBWeight2", "blendBWeight2"],
    ["blendBReturn2", "blendBReturn2"],
    ["postRetirementReturn", "postRetirementReturn"],
    ["k401AccumReturn", "k401AccumReturn"],
    ["k401PostReturn", "k401PostReturn"],
    ["ss62", "ss62"],
    ["ssFRA", "ssFRA"],
    ["customIywAccumReturn", "customIywAccumReturn"],
    ["customQqqmAccumReturn", "customQqqmAccumReturn"],
    ["customPostRetirementReturn", "customPostRetirementReturn"],
    ["customK401AccumReturn", "customK401AccumReturn"],
    ["customK401PostReturn", "customK401PostReturn"],
  ].forEach(([id, key]) => {
    const field = ui[id];
    if (!field) return;
    field.addEventListener("input", persistVisibleState);
    field.addEventListener("change", () =>
      update(key, n(field.value, state[key])),
    );
  });
  [
    "blendATicker1",
    "blendATicker2",
    "blendBTicker1",
    "blendBTicker2",
  ].forEach((id) => {
    const field = ui[id];
    field?.addEventListener("input", persistVisibleState);
    field?.addEventListener("change", () => {
      persistVisibleState();
      render();
    });
  });
  [ui.showBlendAChart, ui.showBlendBChart].forEach((field) => {
    field?.addEventListener("change", () => {
      persistVisibleState();
      render();
    });
  });
  ui.blendAAutoFill?.addEventListener("click", () =>
    autoFillBlend("blendA"),
  );
  ui.blendBAutoFill?.addEventListener("click", () =>
    autoFillBlend("blendB"),
  );
  ui.currentAgeInput?.addEventListener("input", persistVisibleState);
  ui.currentAgeInput?.addEventListener("change", () => {
    const val = n(ui.currentAgeInput.value, state.currentAge);
    state.dateOfBirth = dobFromAge(val, state.currentDate);
    state.currentAge = val;
    render();
  });
  ui.currentDate?.addEventListener("input", persistVisibleState);
  ui.currentDate?.addEventListener("change", () =>
    update("currentDate", ui.currentDate.value),
  );
  ui.dob?.addEventListener("input", persistVisibleState);
  ui.dob?.addEventListener("change", () =>
    update("dateOfBirth", ui.dob.value),
  );
  ui.contributionPct?.addEventListener("input", persistVisibleState);
  ui.contributionPct?.addEventListener("change", () =>
    update("contributionPct", n(ui.contributionPct.value, 6)),
  );
  ui.ssClaimAge?.addEventListener("input", persistVisibleState);
  ui.ssClaimAge?.addEventListener("change", () =>
    update("ssClaimAge", n(ui.ssClaimAge.value, 62)),
  );
  ui.monthlyBrokerageContributionRange?.addEventListener("input", () =>
    update(
      "monthlyBrokerageContribution",
      n(ui.monthlyBrokerageContributionRange.value, 2000),
    ),
  );
  ui.targetRetirementAgeRange?.addEventListener("input", () =>
    update(
      "targetRetirementAge",
      n(ui.targetRetirementAgeRange.value, 50),
    ),
  );
  ui.scenarioTargetRetirementAgeRange?.addEventListener("input", () =>
    update(
      "scenarioTargetRetirementAge",
      n(ui.scenarioTargetRetirementAgeRange.value, 50),
    ),
  );
  ui.annualRetirementSpendRange?.addEventListener("input", () =>
    update(
      "annualRetirementSpend",
      n(ui.annualRetirementSpendRange.value, 55000),
    ),
  );
  window.addEventListener("beforeunload", persistVisibleState);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistVisibleState();
  });
  $$(".pill").forEach((b) =>
    b.addEventListener("click", () => update("scenario", b.dataset.s)),
  );
  ui.syncScenarioAgeBtn?.addEventListener("click", () =>
    update("scenarioTargetRetirementAge", n(state.targetRetirementAge)),
  );

  /* ===== MODAL HELPERS ===== */
  function assumptionModalSeed(dateValue) {
    return (
      activeAssumptionEntry(dateValue) || {
        monthlyBrokerageContribution: state.monthlyBrokerageContribution,
        annualSalary: state.annualSalary,
        contributionPct: state.contributionPct,
        employerMatchPct: state.employerMatchPct,
      }
    );
  }
  function refreshAssumptionModalMonthly401() {
    ui.assumptionModalMonthly401.textContent = money(
      k401MonthlyFromValues(
        n(ui.assumptionModalSalary.value, state.annualSalary),
        n(ui.assumptionModalContributionPct.value, state.contributionPct),
        n(ui.assumptionModalMatchPct.value, state.employerMatchPct),
      ),
    );
  }
  function openAssumptionModalFn(entry = null) {
    const effectiveDate =
        entry?.effectiveDate || state.currentDate || today,
      seed = entry || assumptionModalSeed(effectiveDate);
    editingAssumptionId = entry ? entry.timestamp : null;
    el("assumptionModalTitle").textContent = entry
      ? "Edit Compensation Change"
      : "Schedule Compensation Change";
    el("saveAssumptionModal").textContent = entry
      ? "Save Changes"
      : "Confirm Change";
    ui.assumptionModalDate.value = effectiveDate;
    ui.assumptionModalBrokerageContribution.value = money(
      seed.monthlyBrokerageContribution,
    );
    ui.assumptionModalSalary.value = money(seed.annualSalary);
    ui.assumptionModalContributionPct.value = String(
      [6, 8].includes(Number(seed.contributionPct))
        ? seed.contributionPct
        : state.contributionPct,
    );
    ui.assumptionModalMatchPct.value = pct(seed.employerMatchPct);
    refreshAssumptionModalMonthly401();
    ui.assumptionModalBg.classList.add("open");
    ui.assumptionModalBg.setAttribute("aria-hidden", "false");
  }
  function openHistoryModal(entry = null) {
    editingHistoryId = entry ? entry.timestamp : null;
    el("modalTitle").textContent = entry
      ? "Edit Balance Snapshot"
      : "Update Balances";
    el("saveModal").textContent = entry
      ? "Save Changes"
      : "Confirm Snapshot";
    ui.modalDate.value = entry?.date || today;
    ui.modalBrokerage.value = money(
      entry ? entry.brokerage : state.currentBrokerageBalance,
    );
    ui.modal401.value = money(
      entry ? entry.k401 : state.current401kBalance,
    );
    ui.modalBg.classList.add("open");
    ui.modalBg.setAttribute("aria-hidden", "false");
  }
  el("openModal")?.addEventListener("click", () => openHistoryModal());
  el("openModalHistory")?.addEventListener("click", () => openHistoryModal());
  ui.openAssumptionModal?.addEventListener("click", () =>
    openAssumptionModalFn(),
  );
  ui.openAssumptionModalInline?.addEventListener("click", () =>
    openAssumptionModalFn(),
  );
  function closeModal() {
    editingHistoryId = null;
    el("modalTitle").textContent = "Update Balances";
    el("saveModal").textContent = "Confirm Snapshot";
    ui.modalBg.classList.remove("open");
    ui.modalBg.setAttribute("aria-hidden", "true");
  }
  function closeAssumptionModal() {
    editingAssumptionId = null;
    el("assumptionModalTitle").textContent =
      "Schedule Compensation Change";
    el("saveAssumptionModal").textContent = "Confirm Change";
    ui.assumptionModalBg.classList.remove("open");
    ui.assumptionModalBg.setAttribute("aria-hidden", "true");
  }
  el("closeModal")?.addEventListener("click", closeModal);
  el("cancelModal")?.addEventListener("click", closeModal);
  el("closeAssumptionModal")?.addEventListener(
    "click",
    closeAssumptionModal,
  );
  el("cancelAssumptionModal")?.addEventListener(
    "click",
    closeAssumptionModal,
  );
  ui.modalBg?.addEventListener("click", (e) => {
    if (e.target === ui.modalBg) closeModal();
  });
  ui.assumptionModalBg?.addEventListener("click", (e) => {
    if (e.target === ui.assumptionModalBg) closeAssumptionModal();
  });
  [
    "assumptionModalBrokerageContribution",
    "assumptionModalSalary",
    "assumptionModalContributionPct",
    "assumptionModalMatchPct",
  ].forEach((id) =>
    el(id)?.addEventListener("input", refreshAssumptionModalMonthly401),
  );
  el("assumptionModalContributionPct")?.addEventListener(
    "change",
    refreshAssumptionModalMonthly401,
  );
  ui.history?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id,
      entry = state.balanceHistory.find((r) => r.timestamp === id);
    if (!entry) return;
    if (btn.dataset.action === "edit") {
      openHistoryModal(entry);
      return;
    }
    if (btn.dataset.action === "delete") {
      if (!confirm(`Delete the snapshot from ${fmtDate(entry.date)}?`))
        return;
      state.balanceHistory = state.balanceHistory.filter(
        (r) => r.timestamp !== id,
      );
      closeModal();
      render();
    }
  });
  ui.assumptionHistory?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id,
      entry = state.assumptionHistory.find((r) => r.timestamp === id);
    if (!entry) return;
    if (btn.dataset.action === "edit") {
      openAssumptionModalFn(entry);
      return;
    }
    if (btn.dataset.action === "delete") {
      if (
        !confirm(
          `Delete the compensation change effective ${fmtDate(entry.effectiveDate)}?`,
        )
      )
        return;
      state.assumptionHistory = state.assumptionHistory.filter(
        (r) => r.timestamp !== id,
      );
      if (!state.assumptionHistory.length) {
        state.assumptionHistory = [
          {
            timestamp: new Date().toISOString(),
            effectiveDate: state.currentDate || today,
            monthlyBrokerageContribution: n(
              state.monthlyBrokerageContribution,
            ),
            annualSalary: n(state.annualSalary),
            contributionPct: n(state.contributionPct),
            employerMatchPct: n(state.employerMatchPct),
          },
        ];
      }
      closeAssumptionModal();
      render();
    }
  });
  el("saveModal")?.addEventListener("click", () => {
    const date = ui.modalDate.value || today,
      brokerage = n(
        ui.modalBrokerage.value,
        state.currentBrokerageBalance,
      ),
      k401 = n(ui.modal401.value, state.current401kBalance);
    if (editingHistoryId) {
      state.balanceHistory = state.balanceHistory.map((r) =>
        r.timestamp === editingHistoryId
          ? { ...r, date, brokerage, k401 }
          : r,
      );
    } else {
      state.balanceHistory = [
        { timestamp: new Date().toISOString(), date, brokerage, k401 },
        ...state.balanceHistory,
      ];
    }
    state.currentDate = date;
    state.currentBrokerageBalance = brokerage;
    state.current401kBalance = k401;
    closeModal();
    render();
  });
  el("saveAssumptionModal")?.addEventListener("click", () => {
    const effectiveDate =
        ui.assumptionModalDate.value || state.currentDate || today,
      row = {
        effectiveDate,
        monthlyBrokerageContribution: n(
          ui.assumptionModalBrokerageContribution.value,
          state.monthlyBrokerageContribution,
        ),
        annualSalary: n(
          ui.assumptionModalSalary.value,
          state.annualSalary,
        ),
        contributionPct: n(
          ui.assumptionModalContributionPct.value,
          state.contributionPct,
        ),
        employerMatchPct: n(
          ui.assumptionModalMatchPct.value,
          state.employerMatchPct,
        ),
      };
    if (editingAssumptionId) {
      const collision = state.assumptionHistory.find(
        (r) =>
          r.effectiveDate === effectiveDate &&
          r.timestamp !== editingAssumptionId,
      );
      if (collision) {
        Object.assign(collision, row);
        state.assumptionHistory = state.assumptionHistory.filter(
          (r) => r.timestamp !== editingAssumptionId,
        );
      } else {
        state.assumptionHistory = state.assumptionHistory.map((r) =>
          r.timestamp === editingAssumptionId ? { ...r, ...row } : r,
        );
      }
    } else {
      const existing = state.assumptionHistory.find(
        (r) => r.effectiveDate === effectiveDate,
      );
      if (existing) Object.assign(existing, row);
      else {
        state.assumptionHistory = [
          { timestamp: new Date().toISOString(), ...row },
          ...state.assumptionHistory,
        ];
      }
    }
    closeAssumptionModal();
    render();
  });
  el("printBtn")?.addEventListener("click", () => window.print());
  ui.resetDefaultsBtn?.addEventListener("click", () => {
    if (
      !confirm(
        "Reset the planner back to its original defaults? This clears saved browser state.",
      )
    )
      return;
    state = {
      ...base,
      currentDate: today,
      balanceHistory: [
        {
          timestamp: new Date().toISOString(),
          date: today,
          brokerage: base.currentBrokerageBalance,
          k401: base.current401kBalance,
        },
      ],
      assumptionHistory: [
        {
          timestamp: new Date().toISOString(),
          effectiveDate: today,
          monthlyBrokerageContribution: base.monthlyBrokerageContribution,
          annualSalary: base.annualSalary,
          contributionPct: base.contributionPct,
          employerMatchPct: base.employerMatchPct,
        },
      ],
    };
    save();
    render();
  });

  /* ===== INITIAL RENDER ===== */
  render();
})();
