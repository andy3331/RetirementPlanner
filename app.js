(async () => {
  /* ===== CONSTANTS & DEFAULTS ===== */
  const KEY = "retirementPlanner.v1",
    UNSYNC_KEY = `${KEY}.unsynced`,
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
    employerMatchPct: 3.5,
    targetRetirementAge: 55,
    scenarioTargetRetirementAge: 55,
    annualRetirementSpend: 60000,
    unlockAge: 59.5,
    chartEndAge: 80,
    showBlendAChart: true,
    showBlendBChart: true,
    basePlanTicker1: "IYW",
    basePlanWeight1: 90,
    basePlanReturn1: 16.8,
    basePlanTicker2: "VTI",
    basePlanWeight2: 10,
    basePlanReturn2: 11,
    basePlanAccumReturn: 16.2,
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
    monteCarloRuns: 1000,
    monteBrokerageVol: 22,
    monte401kVol: 14,
    blendDefaultsVersion: 2,
    inflationAdjusted: false,
    inflationRate: 2.5,
    savedScenarios: [],
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
        employerMatchPct: 3.5,
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
    "basePlanWeight1",
    "basePlanReturn1",
    "basePlanWeight2",
    "basePlanReturn2",
    "basePlanAccumReturn",
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
    "monteCarloRuns",
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
    basePlanMathSummary: el("basePlanMathSummary"),
    basePlanMathRows: el("basePlanMathRows"),
    contributionFlexCards: el("contributionFlexCards"),
    contributionFlexSummary: el("contributionFlexSummary"),
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
    monteCarloRuns: el("monteCarloRuns"),
    monteBrokerageVol: el("monteBrokerageVol"),
    monte401kVol: el("monte401kVol"),
    monteCarloSummary: el("monteCarloSummary"),
    monteCarloCards: el("monteCarloCards"),
    monteCarloChart: el("monteCarloChart"),
    monteCarloFallback: el("monteCarloFallback"),
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
    promoteBlendToBasePlan: el("promoteBlendToBasePlan"),
    resetDefaultsBtn: el("resetDefaultsBtn"),
    drawerBackdrop: el("drawerBackdrop"),
    settingsDrawer: el("settingsDrawer"),
  };

  /* ===== STATE ===== */
  // _appReady prevents the initial render from saving defaults back to disk
  // before the user has had a chance to migrate their data.
  let _appReady = false;
  let state = buildState(null),
    actualBrokerageReviewChart,
    actual401kReviewChart,
    bChart,
    kChart,
    mixChart,
    monteChart,
    monteCacheKey = null,
    monteCacheValue = null,
    editingHistoryId = null,
    editingAssumptionId = null,
    assumptionModalSeedContributionPct = null,
    assumptionModalSeedMatchPct = null,
    pendingSaveTimer = null,
    pendingRenderTimer = null,
    drawerPointerDownOnBackdrop = false;

  /* ===== TAB NAVIGATION ===== */
  $$(".tabBtn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      $$(".tabBtn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
      $$(".tabContent").forEach((c) => c.classList.toggle("active", c.dataset.tab === tab));
      scheduleRender(0);
    }),
  );

  /* ===== SETTINGS DRAWER ===== */
  el("openSettings")?.addEventListener("click", () => {
    ui.drawerBackdrop.classList.add("open");
  });
  el("closeSettings")?.addEventListener("click", () => {
    ui.drawerBackdrop.classList.remove("open");
  });
  ui.settingsDrawer?.addEventListener("pointerdown", () => {
    drawerPointerDownOnBackdrop = false;
  });
  ui.drawerBackdrop?.addEventListener("pointerdown", (e) => {
    drawerPointerDownOnBackdrop = e.target === ui.drawerBackdrop;
  });
  ui.drawerBackdrop?.addEventListener("click", (e) => {
    if (e.target === ui.drawerBackdrop && drawerPointerDownOnBackdrop) {
      ui.drawerBackdrop.classList.remove("open");
    }
    drawerPointerDownOnBackdrop = false;
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
  function normalizeContributionPct(v, f = 0) {
    return Math.min(100, Math.max(0, n(v, f)));
  }
  function maybeNumber(v) {
    if (v == null || String(v).trim() === "") return null;
    const parsed = parseFloat(
      String(v)
        .replace(/[$,%\s]/g, "")
        .replace(/,/g, ""),
    );
    return isFinite(parsed) ? parsed : null;
  }
  function employerMatchPctFromContributionPct(contributionPct) {
    const employeePct = normalizeContributionPct(contributionPct);
    if (employeePct <= 1) return employeePct;
    if (employeePct <= 6) return 1 + (employeePct - 1) * 0.5;
    return 3.5;
  }
  function resolveEmployerMatchPct(contributionPct, storedMatchPct = null) {
    const explicitMatch = maybeNumber(storedMatchPct);
    return explicitMatch == null
      ? employerMatchPctFromContributionPct(contributionPct)
      : explicitMatch;
  }
  function nextEmployerMatchPct(
    nextContributionPct,
    priorContributionPct,
    priorMatchPct = null,
  ) {
    const nextPct = normalizeContributionPct(nextContributionPct),
      priorPct = maybeNumber(priorContributionPct),
      explicitMatch = maybeNumber(priorMatchPct);
    if (nextPct <= 0) return 0;
    if (priorPct == null || explicitMatch == null) {
      return employerMatchPctFromContributionPct(nextPct);
    }
    const priorFormula = employerMatchPctFromContributionPct(priorPct);
    return Math.abs(explicitMatch - priorFormula) > 0.0001
      ? explicitMatch
      : employerMatchPctFromContributionPct(nextPct);
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
  function buildState(rawData) {
    try {
      const x = rawData || {},
        s = { ...base, ...x };
      nums.forEach((k) => (s[k] = n(s[k], base[k])));
      positiveDefaultKeys.forEach((k) => {
        if (!(s[k] > 0)) s[k] = base[k];
      });
      s.contributionPct = normalizeContributionPct(
        s.contributionPct,
        base.contributionPct,
      );
      s.employerMatchPct = resolveEmployerMatchPct(
        s.contributionPct,
        x.employerMatchPct,
      );
      if (!["bull", "crash", "custom"].includes(s.scenario))
        s.scenario = base.scenario;
      if (
        n(x.blendDefaultsVersion, 0) < base.blendDefaultsVersion ||
        matchesLegacyBlendDefaults(s)
      ) {
        applyRequestedBlendDefaults(s);
        s.blendDefaultsVersion = base.blendDefaultsVersion;
      }
      if (!String(s.basePlanTicker1 || "").trim())
        s.basePlanTicker1 = String(s.blendATicker1 || base.basePlanTicker1).trim().toUpperCase();
      if (!(n(s.basePlanWeight1) > 0)) s.basePlanWeight1 = n(s.blendAWeight1, base.basePlanWeight1);
      if (!(n(s.basePlanReturn1) > 0)) s.basePlanReturn1 = n(s.blendAReturn1, base.basePlanReturn1);
      if (!String(s.basePlanTicker2 || "").trim())
        s.basePlanTicker2 = String(s.blendATicker2 || base.basePlanTicker2).trim().toUpperCase();
      if (!(n(s.basePlanWeight2) > 0)) s.basePlanWeight2 = n(s.blendAWeight2, base.basePlanWeight2);
      if (!(n(s.basePlanReturn2) > 0)) s.basePlanReturn2 = n(s.blendAReturn2, base.basePlanReturn2);
      if (!(n(s.basePlanAccumReturn) > 0)) {
        const total = Math.max(1, n(s.basePlanWeight1) + n(s.basePlanWeight2));
        s.basePlanAccumReturn =
          (n(s.basePlanReturn1) * n(s.basePlanWeight1) +
            n(s.basePlanReturn2) * n(s.basePlanWeight2)) /
          total;
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
              contributionPct: normalizeContributionPct(
                r.contributionPct,
                s.contributionPct,
              ),
              employerMatchPct: resolveEmployerMatchPct(
                normalizeContributionPct(r.contributionPct, s.contributionPct),
                r.employerMatchPct,
              ),
            }))
          : base.assumptionHistory.map((r) => ({ ...r }));
      s.currentDate = today;
      s.dateOfBirth = /^\d{4}-\d{2}-\d{2}$/.test(
        String(s.dateOfBirth || ""),
      )
        ? s.dateOfBirth
        : base.dateOfBirth;
      s.currentAge = computeAge(s);
      if (!Array.isArray(s.savedScenarios)) s.savedScenarios = [];
      if (typeof s.inflationAdjusted !== "boolean") s.inflationAdjusted = false;
      if (!(n(s.inflationRate) > 0)) s.inflationRate = base.inflationRate;
      return s;
    } catch {
      return {
        ...base,
        currentDate: today,
        assumptionHistory: base.assumptionHistory.map((r) => ({ ...r })),
      };
    }
  }
  function showTopBanner(kind, html) {
    const banner = el("firstRunBanner");
    if (!banner) return;
    banner.dataset.bannerKind = kind;
    banner.innerHTML = `${html} <button class="iconBtn" id="dismissFirstRun" style="margin-left:auto" type="button">&times;</button>`;
    banner.classList.remove("hidden");
  }
  function clearTopBanner(kind) {
    const banner = el("firstRunBanner");
    if (!banner) return;
    if (!kind || banner.dataset.bannerKind === kind) {
      banner.classList.add("hidden");
      banner.innerHTML = "";
      delete banner.dataset.bannerKind;
    }
  }
  function setUnsyncedMarker(message) {
    localStorage.setItem(UNSYNC_KEY, message || "1");
  }
  function markUnsyncedSave(message) {
    setUnsyncedMarker(message);
    showTopBanner(
      "unsynced",
      `<strong>Local changes not saved to file.</strong> ${message || "The browser copy is newer than data/planner-data.json right now, so the app will keep using the local copy until the next successful save."}`,
    );
  }
  function clearUnsyncedSave() {
    localStorage.removeItem(UNSYNC_KEY);
    clearTopBanner("unsynced");
  }

  async function loadFromServer() {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) {
        throw new Error(`Load failed with status ${res.status}`);
      }
      const { firstRun, data } = await res.json();
      const cached = localStorage.getItem(KEY),
        hasUnsyncedLocal = !!localStorage.getItem(UNSYNC_KEY);
      if (firstRun) {
        if (cached) {
          let migrated;
          try {
            migrated = JSON.parse(cached);
            const migrationRes = await fetch("/api/data", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(migrated),
            });
            if (!migrationRes.ok) {
              throw new Error(`Migration failed with status ${migrationRes.status}`);
            }
            clearUnsyncedSave();
            showTopBanner(
              "migration",
              `<strong>Welcome back!</strong> Your settings have been migrated from browser storage to your local data file at <code>data/planner-data.json</code>.`,
            );
            return buildState(migrated);
          } catch {
            const fallback = buildState(migrated || null);
            markUnsyncedSave(
              "Your existing browser-only data is still loaded for this session, but it could not be written to <code>data/planner-data.json</code> yet. Fix the local server issue, then refresh to retry.",
            );
            return fallback;
          }
        }
        el("firstRunBanner")?.classList.remove("hidden");
        return buildState(null);
      }
      if (hasUnsyncedLocal && cached) {
        try {
          const fallback = buildState(JSON.parse(cached));
          showTopBanner(
            "unsynced",
            `<strong>Using newer local changes.</strong> The file-backed save failed earlier, so the browser copy is being used until the next successful save to <code>data/planner-data.json</code>.`,
          );
          return fallback;
        } catch {}
      }
      clearUnsyncedSave();
      return buildState(data);
    } catch {
      try {
        const cached = localStorage.getItem(KEY);
        return buildState(cached ? JSON.parse(cached) : null);
      } catch {
        return buildState(null);
      }
    }
  }

  function flushSaveToServer(useKeepalive = false) {
    if (!_appReady) return; // never save during initial page load
    clearTimeout(pendingSaveTimer);
    pendingSaveTimer = null;
    state.currentAge = computeAge(state);
    const payload = JSON.stringify(state);
    localStorage.setItem(KEY, payload);
    if (useKeepalive && navigator.sendBeacon) {
      setUnsyncedMarker(
        "A final save was queued while the page was closing, but it has not been confirmed on disk yet.",
      );
      const ok = navigator.sendBeacon(
        "/api/data",
        new Blob([payload], { type: "application/json" }),
      );
      if (ok) return;
    }
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: useKeepalive,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Save failed with status ${res.status}`);
        }
        clearUnsyncedSave();
      })
      .catch((err) => {
        console.error(err);
        markUnsyncedSave(
          `The app could not write your latest edits to <code>data/planner-data.json</code> (${err.message || err}). The local browser copy is still preserved.`,
        );
      });
  }
  function saveToServer() {
    if (!_appReady) return;
    state.currentAge = computeAge(state);
    localStorage.setItem(KEY, JSON.stringify(state));
    clearTimeout(pendingSaveTimer);
    pendingSaveTimer = setTimeout(flushSaveToServer, 180);
  }
  function activeTab() {
    return document.querySelector(".tabBtn.active")?.dataset.tab || "track";
  }
  function scheduleRender(delay = 90) {
    clearTimeout(pendingRenderTimer);
    pendingRenderTimer = setTimeout(() => {
      pendingRenderTimer = null;
      render();
    }, delay);
  }

  /* ===== FINANCIAL MATH ===== */
  function mRate(a) {
    return Math.pow(1 + a / 100, 1 / 12) - 1;
  }
  function realRate(nominal) {
    if (!state.inflationAdjusted) return nominal;
    const inf = Math.max(0, n(state.inflationRate, 2.5));
    return ((1 + nominal / 100) / (1 + inf / 100) - 1) * 100;
  }
  function ssMonthly(s) {
    return s.ssClaimAge <= 62
      ? n(s.ss62)
      : s.ssClaimAge >= 70
        ? n(s.ssFRA) * 1.24
        : n(s.ssFRA);
  }
  function k401MonthlyFromValues(salary, contributionPct, employerMatchPct = null) {
    const emp = normalizeContributionPct(contributionPct),
      match = resolveEmployerMatchPct(contributionPct, employerMatchPct);
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
          contributionPct: normalizeContributionPct(
            entry.contributionPct,
            s.contributionPct,
          ),
          employerMatchPct: resolveEmployerMatchPct(
            normalizeContributionPct(entry.contributionPct, s.contributionPct),
            entry.employerMatchPct,
          ),
        }
      : {
          monthlyBrokerageContribution: n(s.monthlyBrokerageContribution),
          annualSalary: n(s.annualSalary),
          contributionPct: normalizeContributionPct(s.contributionPct),
          employerMatchPct: resolveEmployerMatchPct(
            normalizeContributionPct(s.contributionPct),
            s.employerMatchPct,
          ),
        };
  }
  function activeAssumptionEntryForState(s, date) {
    const rows = [...(s.assumptionHistory || [])].sort(assumptionSort);
    return (
      rows.find((r) => (r.effectiveDate || r.date || today) <= date) ||
      rows[rows.length - 1] ||
      null
    );
  }

  /* ===== BLEND HELPERS ===== */
  function labelFromFields(t1, t2) {
    return [String(t1 || "").trim().toUpperCase(), String(t2 || "").trim().toUpperCase()]
      .filter(Boolean)
      .join(" / ") || "Custom blend";
  }
  function blendLabel(prefix) {
    return labelFromFields(state[`${prefix}Ticker1`], state[`${prefix}Ticker2`]);
  }
  function basePlanLabel() {
    return labelFromFields(state.basePlanTicker1, state.basePlanTicker2);
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
  function syncBasePlanBlendFromScenario() {
    state.basePlanTicker1 = String(state.blendATicker1 || "").trim().toUpperCase();
    state.basePlanWeight1 = n(state.blendAWeight1);
    state.basePlanReturn1 = n(state.blendAReturn1);
    state.basePlanTicker2 = String(state.blendATicker2 || "").trim().toUpperCase();
    state.basePlanWeight2 = n(state.blendAWeight2);
    state.basePlanReturn2 = n(state.blendAReturn2);
    state.basePlanAccumReturn = n(state.iywAccumReturn);
  }

  /* ===== SCENARIO RATES ===== */
  function scenarioRates(s) {
    const rLabel = s.inflationAdjusted ? " (real)" : "";
    if (s.scenario === "custom")
      return {
        label: "Custom",
        iyw: realRate(n(s.customIywAccumReturn)),
        qqqm: realRate(n(s.customQqqmAccumReturn)),
        post: realRate(n(s.customPostRetirementReturn)),
        kacc: realRate(n(s.customK401AccumReturn)),
        kpost: realRate(n(s.customK401PostReturn)),
        note: `Custom uses the scenario-specific return overrides below${rLabel}.`,
      };
    if (s.scenario === "crash") {
      const iyw = realRate(Math.max(n(s.iywAccumReturn) - 9, 3)),
        qqqm = realRate(Math.max(n(s.qqqmAccumReturn) - 8, 2)),
        post = realRate(Math.max(n(s.postRetirementReturn) - 2, 2)),
        kacc = realRate(Math.max(n(s.k401AccumReturn) - 2, 3)),
        kpost = realRate(Math.max(n(s.k401PostReturn) - 2, 3));
      return {
        label: "Tech Crash",
        iyw,
        qqqm,
        post,
        kacc,
        kpost,
        note: `Tech crash trims ${blendLabel("blendA")} to ${pct(iyw)}, ${blendLabel("blendB")} to ${pct(qqqm)}, post-retirement growth to ${pct(post)}, and 401k growth to ${pct(kacc)} / ${pct(kpost)}${rLabel}.`,
      };
    }
    return {
      label: "Bull Case",
      iyw: realRate(n(s.iywAccumReturn)),
      qqqm: realRate(n(s.qqqmAccumReturn)),
      post: realRate(n(s.postRetirementReturn)),
      kacc: realRate(n(s.k401AccumReturn)),
      kpost: realRate(n(s.k401PostReturn)),
      note: `Bull case uses your base return assumptions exactly as entered${rLabel}.`,
    };
  }
  function baselinePlanningRates(s) {
    return {
      label: "Base plan",
      iyw: realRate(n(s.basePlanAccumReturn, s.iywAccumReturn)),
      qqqm: realRate(n(s.basePlanAccumReturn, s.iywAccumReturn)),
      post: realRate(n(s.postRetirementReturn)),
      kacc: realRate(n(s.k401AccumReturn)),
      kpost: realRate(n(s.k401PostReturn)),
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
      cashflowGapSeries = [],
      monthlyBreakdown = [],
      cSeries = [];
    const mRet = Math.max(0, Math.ceil((retAge - cur) * 12 - 1e-9)),
      actual = cur + mRet / 12;
    const pushB = (x, y) => {
      if (x <= chartEndAge + 0.001) bSeries.push({ x, y: Math.max(0, y) });
    };
    const pushK = (x, y) => {
      if (x <= chartEndAge + 0.001) kSeries.push({ x, y: Math.max(0, y) });
    };
    const pushCash = (
      x,
      ssAnnual,
      spendAnnual,
      k401WithdrawAnnual,
      brokerageWithdrawAnnual,
      gapAnnual,
    ) => {
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
        cashflowGapSeries.push({
          x,
          y: Math.max(0, gapAnnual),
        });
      }
    };
    const pushMonth = (row) => {
      if (n(row.age, 0) <= chartEndAge + 0.001) monthlyBreakdown.push(row);
    };
    for (let i = 1; i <= mRet; i++) {
      const entry = assumptionsForDate(s, addMonthsIso(startDate, i)),
        bContrib = n(entry.monthlyBrokerageContribution),
        kContrib = k401MonthlyFromValues(
          entry.annualSalary,
          entry.contributionPct,
          entry.employerMatchPct,
        );
      const bStart = b,
        kStart = k,
        datePoint = addMonthsIso(startDate, i),
        agePoint = cur + i / 12;
      b = b * (1 + bAccum) + bContrib;
      k = k * (1 + kAccum) + kContrib;
      pushB(agePoint, b);
      pushK(agePoint, k);
      pushMonth({
        date: datePoint,
        age: agePoint,
        phase: "Accumulation",
        brokerageStart: bStart,
        brokerageEnd: b,
        k401Start: kStart,
        k401End: k,
        brokerageContribution: bContrib,
        k401Contribution: kContrib,
        brokerageWithdrawal: 0,
        k401Withdrawal: 0,
        ssIncome: 0,
        spend: 0,
        gap: 0,
      });
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
        const bStart = b,
          kStart = k,
          datePoint = addMonthsIso(startDate, mRet + i),
          agePoint = actual + i / 12,
          grownBrokerage = b * (1 + bPost),
          bridgeWithdraw = Math.min(grownBrokerage, spend),
          bridgeGap = Math.max(0, spend - bridgeWithdraw);
        b = Math.max(0, grownBrokerage - spend);
        k = k * (1 + kPost);
        pushB(agePoint, b);
        pushK(agePoint, k);
        pushCash(agePoint, 0, annualSpend, 0, bridgeWithdraw * 12, bridgeGap * 12);
        pushMonth({
          date: datePoint,
          age: agePoint,
          phase: "Bridge",
          brokerageStart: bStart,
          brokerageEnd: b,
          k401Start: kStart,
          k401End: k,
          brokerageContribution: 0,
          k401Contribution: 0,
          brokerageWithdrawal: bridgeWithdraw,
          k401Withdrawal: 0,
          ssIncome: 0,
          spend,
          gap: bridgeGap,
        });
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
        before = bs + ks,
        datePoint = addMonthsIso(startDate, mRet + Math.max(0, Math.ceil((start - actual) * 12 - 1e-9)) + i),
        bStart = bs,
        kStart = ks;
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
        pushCash(a, income * 12, annualSpend, 0, 0, need * 12);
        pushMonth({
          date: datePoint,
          age: a,
          phase: income > 0 ? "Post unlock + SS" : "Post unlock",
          brokerageStart: bStart,
          brokerageEnd: 0,
          k401Start: kStart,
          k401End: 0,
          brokerageContribution: 0,
          k401Contribution: 0,
          brokerageWithdrawal: 0,
          k401Withdrawal: 0,
          ssIncome: income,
          spend,
          gap: need,
        });
        break;
      }
      let actualKWithdraw = 0,
        actualBWithdraw = 0,
        actualGap = 0;
      if (need > 0) {
        let remain = need,
          kw = Math.min(ks, remain);
        ks -= kw;
        remain -= kw;
        actualKWithdraw = kw;
        const bw = Math.min(bs, remain);
        bs -= bw;
        remain -= bw;
        actualBWithdraw = bw;
        actualGap = Math.max(0, remain);
      }
      bs *= 1 + bPost;
      ks *= 1 + kPost;
      const total = Math.max(0, bs + ks);
      cSeries.push({ x: a, y: total });
      pushB(a, bs);
      pushK(a, ks);
      pushCash(
        a,
        income * 12,
        annualSpend,
        actualKWithdraw * 12,
        actualBWithdraw * 12,
        actualGap * 12,
      );
      pushMonth({
        date: datePoint,
        age: a,
        phase: income > 0 ? "Post unlock + SS" : "Post unlock",
        brokerageStart: bStart,
        brokerageEnd: bs,
        k401Start: kStart,
        k401End: ks,
        brokerageContribution: 0,
        k401Contribution: 0,
        brokerageWithdrawal: actualBWithdraw,
        k401Withdrawal: actualKWithdraw,
        ssIncome: income,
        spend,
        gap: actualGap,
      });
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
      cashflowGapSeries,
      monthlyBreakdown,
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
  function fullPlanViableAtAge(s, f, retirementAge, r) {
    const result = project(s, f, retirementAge, r),
      hasGap = (result.cashflowGapSeries || []).some(
        (point) => n(point?.y, 0) > 1,
      ),
      depletedEarly =
        result.longevityAge != null && result.longevityAge < 109.99;
    return {
      viable: !hasGap && !depletedEarly,
      result,
    };
  }
  function earliestFullPlan(s, f, r) {
    const cur = computeAge(s),
      max = Math.max(0, Math.round((75 - cur) * 12));
    for (let i = 0; i <= max; i++) {
      const a = cur + i / 12,
        outcome = fullPlanViableAtAge(s, f, a, r);
      if (outcome.viable) return a;
    }
    return null;
  }
  function ssEstimateRisk(stateLike, retirementAge = n(stateLike.targetRetirementAge)) {
    const annualSS = ssMonthly(stateLike) * 12,
      claimAge = n(stateLike.ssClaimAge, 62),
      retireAge = Math.max(computeAge(stateLike), n(retirementAge));
    if (!(annualSS > 0)) return null;
    if (retireAge >= claimAge) return null;
    const yearsEarly = Math.max(0, claimAge - retireAge);
    return {
      annualSS,
      claimAge,
      retireAge,
      yearsEarly,
      text: `The planner currently treats Social Security as a fixed ${money(annualSS)}/year beginning at age ${age(claimAge)}. If you stop working around age ${age(retireAge)}, that estimate may be overstated if it came from a projection assuming more future earnings before claim age.`,
    };
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
  function isFullPlanViable(stateLike, fundKey, rates) {
    const retirementAge = Math.max(
        computeAge(stateLike),
        n(stateLike.targetRetirementAge),
      ),
      result = project(stateLike, fundKey, retirementAge, rates),
      hasGap = (result.cashflowGapSeries || []).some(
        (point) => n(point?.y, 0) > 1,
      ),
      depletedEarly =
        result.longevityAge != null && result.longevityAge < 109.99;
    return {
      viable: !hasGap && !depletedEarly,
      result,
    };
  }
  function stateWithContributionStop(stateLike, stopType, stopDate) {
    const seed =
        activeAssumptionEntryForState(stateLike, stopDate) || {
          monthlyBrokerageContribution: n(stateLike.monthlyBrokerageContribution),
          annualSalary: n(stateLike.annualSalary),
          contributionPct: normalizeContributionPct(stateLike.contributionPct),
          employerMatchPct: resolveEmployerMatchPct(
            stateLike.contributionPct,
            stateLike.employerMatchPct,
          ),
        },
      rows = [...(stateLike.assumptionHistory || [])].map((row) => {
        const effectiveDate = row.effectiveDate || row.date || today,
          next = { ...row, effectiveDate };
        if (effectiveDate >= stopDate) {
          if (stopType === "brokerage") next.monthlyBrokerageContribution = 0;
          if (stopType === "k401") next.contributionPct = 0;
        }
        return next;
      }),
      hasExactStop = rows.some((row) => row.effectiveDate === stopDate);
    if (!hasExactStop) {
      rows.push({
        timestamp: `flex-${stopType}-${stopDate}`,
        effectiveDate: stopDate,
        monthlyBrokerageContribution:
          stopType === "brokerage"
            ? 0
            : n(seed.monthlyBrokerageContribution),
        annualSalary: n(seed.annualSalary),
        contributionPct:
          stopType === "k401"
            ? 0
            : normalizeContributionPct(seed.contributionPct),
        employerMatchPct: resolveEmployerMatchPct(
          stopType === "k401" ? 0 : seed.contributionPct,
          stopType === "k401" ? 0 : seed.employerMatchPct,
        ),
      });
    }
    return {
      ...stateLike,
      assumptionHistory: rows,
    };
  }
  function earliestContributionStop(stateLike, rates, stopType) {
    const fundKey = currentPlanFundKey(),
      currentAge = computeAge(stateLike),
      retirementAge = Math.max(currentAge, n(stateLike.targetRetirementAge)),
      monthsToRetirement = monthsBetweenAges(currentAge, retirementAge),
      startDate = stateLike.currentDate || today,
      baseline = isFullPlanViable(stateLike, fundKey, rates);
    if (!baseline.viable) {
      return {
        viableBasePlan: false,
        stopType,
      };
    }
    for (let month = 0; month <= monthsToRetirement; month += 1) {
      const stopDate = addMonthsIso(startDate, month),
        candidateState = stateWithContributionStop(
          stateLike,
          stopType,
          stopDate,
        ),
        candidate = isFullPlanViable(candidateState, fundKey, rates);
      if (candidate.viable) {
        return {
          viableBasePlan: true,
          stopType,
          stopDate,
          stopAge: computeAge({ ...stateLike, currentDate: stopDate }),
          monthsUntilStop: month,
          result: candidate.result,
        };
      }
    }
    return {
      viableBasePlan: true,
      stopType,
      stopDate: null,
      stopAge: null,
      monthsUntilStop: null,
      result: null,
    };
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
  function refreshMain401DerivedDisplays() {
    if (!ui.employerMatchPct || !ui.monthly401) return;
    const contributionPct = normalizeContributionPct(
      ui.contributionPct?.value,
      state.contributionPct,
    );
    const employerMatchPct = nextEmployerMatchPct(
      contributionPct,
      state.contributionPct,
      state.employerMatchPct,
    );
    ui.employerMatchPct.value = pct(employerMatchPct);
    ui.monthly401.textContent = money(
      k401MonthlyFromValues(
        n(ui.annualSalary?.value, state.annualSalary),
        contributionPct,
        employerMatchPct,
      ),
    );
  }
  function fillInputs() {
    state.contributionPct = normalizeContributionPct(
      state.contributionPct,
      base.contributionPct,
    );
    state.employerMatchPct = resolveEmployerMatchPct(
      state.contributionPct,
      state.employerMatchPct,
    );
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
    setVal("monteCarloRuns", state.monteCarloRuns, "select");
    setVal("monteBrokerageVol", state.monteBrokerageVol, "percent");
    setVal("monte401kVol", state.monte401kVol, "percent");
    ui.contributionPct.value = num(
      state.contributionPct,
      state.contributionPct % 1 === 0 ? 0 : 1,
    );
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
    refreshMain401DerivedDisplays();
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
    // Catch-up contribution note (age 50+)
    el("catchUpNote")?.classList.toggle("hidden", state.currentAge < 50);
    // Inflation toggle
    const inflToggle = el("inflationAdjustedToggle");
    if (inflToggle) inflToggle.checked = !!state.inflationAdjusted;
    el("inflationRateField")?.classList.toggle("hidden", !state.inflationAdjusted);
    const inflRateInput = el("inflationRate");
    if (inflRateInput) inflRateInput.value = String(n(state.inflationRate, 2.5));
    // Print date
    const pd = el("printDate");
    if (pd) pd.textContent = fmtDate(today);
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
    state.contributionPct = normalizeContributionPct(
      a.contributionPct,
      state.contributionPct,
    );
    state.employerMatchPct = resolveEmployerMatchPct(
      state.contributionPct,
      a.employerMatchPct,
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
      gap = ages.map((agePoint, index) =>
        Math.max(
          0,
          sampleSeriesAtAge(result.cashflowGapSeries, agePoint) ||
            (spend[index] - ss[index] - k401[index] - brokerage[index]),
        ),
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
  function buildYearlyPlanRows(result) {
    const rows = Array.isArray(result?.monthlyBreakdown)
      ? result.monthlyBreakdown
      : [];
    const grouped = new Map();
    for (const row of rows) {
      const year = String(row.date || "").slice(0, 4);
      if (!year) continue;
      if (!grouped.has(year)) {
        grouped.set(year, {
          year,
          startDate: row.date,
          endDate: row.date,
          ageStart: row.age,
          ageEnd: row.age,
          phases: new Set([row.phase]),
          brokerageStart: n(row.brokerageStart),
          brokerageEnd: n(row.brokerageEnd),
          k401Start: n(row.k401Start),
          k401End: n(row.k401End),
          brokerageContribution: 0,
          k401Contribution: 0,
          brokerageWithdrawal: 0,
          k401Withdrawal: 0,
          ssIncome: 0,
          spend: 0,
          gap: 0,
        });
      }
      const bucket = grouped.get(year);
      bucket.endDate = row.date;
      bucket.ageEnd = row.age;
      bucket.phases.add(row.phase);
      bucket.brokerageEnd = n(row.brokerageEnd);
      bucket.k401End = n(row.k401End);
      bucket.brokerageContribution += n(row.brokerageContribution);
      bucket.k401Contribution += n(row.k401Contribution);
      bucket.brokerageWithdrawal += n(row.brokerageWithdrawal);
      bucket.k401Withdrawal += n(row.k401Withdrawal);
      bucket.ssIncome += n(row.ssIncome);
      bucket.spend += n(row.spend);
      bucket.gap += n(row.gap);
    }
    return [...grouped.values()].map((row) => ({
      ...row,
      phaseLabel: [...row.phases].join(" / "),
      totalStart: row.brokerageStart + row.k401Start,
      totalEnd: row.brokerageEnd + row.k401End,
    }));
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
  function survivesPostUnlockPlan(
    stateLike,
    rates,
    starting401k,
    startingBrokerage,
  ) {
    const unlock = n(stateLike.unlockAge, 59.5),
      claim = n(stateLike.ssClaimAge),
      spend = n(stateLike.annualRetirementSpend) / 12,
      ss = ssMonthly(stateLike),
      kPost = mRate(rates.kpost),
      bPost = mRate(rates.post),
      maxAge = 110;
    let k = Math.max(0, starting401k),
      b = Math.max(0, startingBrokerage);
    const totalMonths = Math.max(0, Math.round((maxAge - unlock) * 12));
    for (let i = 1; i <= totalMonths; i += 1) {
      const agePoint = unlock + i / 12,
        income = agePoint >= claim ? ss : 0;
      let need = Math.max(0, spend - income),
        kWithdraw = 0,
        bWithdraw = 0;
      if (need > 0) {
        kWithdraw = Math.min(k, need);
        k -= kWithdraw;
        need -= kWithdraw;
        bWithdraw = Math.min(b, need);
        b -= bWithdraw;
        need -= bWithdraw;
      }
      if (need > 0.01) {
        return {
          viable: false,
          depletionAge: agePoint,
          ending401k: Math.max(0, k),
          endingBrokerage: Math.max(0, b),
        };
      }
      k = k > 0.01 ? k * (1 + kPost) : 0;
      b = b > 0.01 ? b * (1 + bPost) : 0;
    }
    return {
      viable: true,
      depletionAge: null,
      ending401k: Math.max(0, k),
      endingBrokerage: Math.max(0, b),
    };
  }
  function required401kAtUnlockForPlan(stateLike, rates, brokerageAtUnlock) {
    const annualSpend = n(stateLike.annualRetirementSpend),
      annualSS = ssMonthly(stateLike) * 12,
      tester = (amount) =>
        survivesPostUnlockPlan(
          stateLike,
          rates,
          amount,
          brokerageAtUnlock,
        ).viable;
    if (tester(0)) return 0;
    let hi = Math.max(
      100000,
      Math.max(0, annualSpend - annualSS) * 12,
      (annualSpend || 1) * 4,
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
  function retirementNeedProfile(stateLike, rates) {
    const currentAge = computeAge(stateLike),
      retirementAge = Math.max(currentAge, n(stateLike.targetRetirementAge)),
      unlock = n(stateLike.unlockAge, 59.5),
      requiredBrokerageAtRetirement =
        retirementAge >= unlock ? 0 : bridgeNeed(stateLike, rates),
      brokerageAtUnlock = bridgeBalanceAtUnlockFromRetirementBalance(
        requiredBrokerageAtRetirement,
        retirementAge,
        stateLike,
        rates,
      ),
      required401kAtUnlock = required401kAtUnlockForPlan(
        stateLike,
        rates,
        brokerageAtUnlock,
      ),
      requiredCombinedAtUnlock =
        required401kAtUnlock == null
          ? null
          : Math.max(0, brokerageAtUnlock) + Math.max(0, required401kAtUnlock),
      monthsToUnlock = monthsBetweenAges(retirementAge, unlock),
      kGrowth = Math.pow(1 + mRate(rates.kpost), monthsToUnlock);
    return {
      retirementAge,
      requiredBrokerageAtRetirement,
      brokerageAtUnlock,
      requiredCombinedAtUnlock,
      required401kAtUnlock,
      required401kAtRetirement:
        required401kAtUnlock == null
          ? null
          : monthsToUnlock > 0
            ? required401kAtUnlock / kGrowth
            : required401kAtUnlock,
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
      balanceField =
        balanceKey === "brokerage"
          ? "currentBrokerageBalance"
          : "current401kBalance";
    const tester = (amount) => {
      const testState = { ...snapshot, [balanceField]: amount },
        retirementAge = Math.max(
          computeAge(testState),
          n(testState.targetRetirementAge),
        ),
        result = project(testState, fundKey, retirementAge, rates),
        hasGap = (result.cashflowGapSeries || []).some(
          (point) => n(point?.y, 0) > 1,
        ),
        depletedEarly =
          result.longevityAge != null && result.longevityAge < 109.99;
      return !hasGap && !depletedEarly;
    };
    if (tester(0)) return 0;
    let hi = Math.max(
      25000,
      n(row[balanceKey === "brokerage" ? "brokerage" : "k401"]) * 1.5,
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
  function projectedPlanSeries(currentState, fundKey, rates, endAgeOverride) {
    const latest = latestHistoryEntry();
    if (!latest) return { brokerage: {}, k401: {} };
    const snapshot = snapshotState(latest, currentState),
      snapshotAge = computeAge(snapshot),
      retirementAge = Math.max(snapshotAge, n(currentState.targetRetirementAge)),
      unlockAge = n(currentState.unlockAge, 59.5),
      claimAge = n(currentState.ssClaimAge, 62),
      endAge = Math.max(snapshotAge, n(endAgeOverride, n(currentState.chartEndAge, 80))),
      brokerageRate = mRate(fundKey === "iyw" ? rates.iyw : rates.qqqm),
      k401Rate = mRate(rates.kacc),
      brokeragePostRate = mRate(rates.post),
      k401PostRate = mRate(rates.kpost),
      spend = n(currentState.annualRetirementSpend) / 12,
      ss = ssMonthly(currentState),
      brokerage = {},
      k401 = {};
    let b = n(snapshot.currentBrokerageBalance),
      k = n(snapshot.current401kBalance),
      currentMonth = chartMonthKey(latest.date);
    brokerage[currentMonth] = b;
    k401[currentMonth] = k;
    const monthsToRetirement = Math.max(
      0,
      Math.ceil((retirementAge - snapshotAge) * 12 - 1e-9),
    );
    for (let i = 1; i <= monthsToRetirement; i += 1) {
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
    const actualRetirementAge = snapshotAge + monthsToRetirement / 12;
    if (actualRetirementAge < unlockAge) {
      const monthsToUnlock = Math.max(
        0,
        Math.ceil((unlockAge - actualRetirementAge) * 12 - 1e-9),
      );
      for (let i = 1; i <= monthsToUnlock; i += 1) {
        const monthOffset = monthsToRetirement + i,
          nextDate = addMonthsIso(latest.date, monthOffset),
          monthKey = chartMonthKey(nextDate);
        b = Math.max(0, b * (1 + brokeragePostRate) - spend);
        k = k * (1 + k401PostRate);
        brokerage[monthKey] = b;
        k401[monthKey] = k;
      }
    }
    let planAge = Math.max(actualRetirementAge, unlockAge),
      monthsElapsed = monthsBetweenAges(snapshotAge, planAge);
    const monthsToEnd = Math.max(
      0,
      Math.ceil((endAge - planAge) * 12 - 1e-9),
    );
    for (let i = 1; i <= monthsToEnd; i += 1) {
      const monthOffset = monthsElapsed + i,
        nextDate = addMonthsIso(latest.date, monthOffset),
        agePoint = planAge + i / 12,
        income = agePoint >= claimAge ? ss : 0,
        monthKey = chartMonthKey(nextDate);
      let need = Math.max(0, spend - income);
      const kWithdraw = Math.min(k, need);
      k -= kWithdraw;
      need -= kWithdraw;
      const bWithdraw = Math.min(b, need);
      b -= bWithdraw;
      need -= bWithdraw;
      b = b > 0.01 ? b * (1 + brokeragePostRate) : 0;
      k = k > 0.01 ? k * (1 + k401PostRate) : 0;
      brokerage[monthKey] = Math.max(0, b);
      k401[monthKey] = Math.max(0, k);
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
      projected = projectedPlanSeries(currentState, fundKey, rates, targetAge),
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
        projectedBrokerage: [],
        projected401k: [],
      };
    }
    const latest = rows[rows.length - 1],
      latestSnapshot = snapshotState(latest, currentState),
      latestAge = computeAge(latestSnapshot),
      reviewEndAge = Math.max(latestAge, 75),
      monthsToReviewEnd = monthsBetweenAges(latestAge, reviewEndAge),
      reviewEndDate = addMonthsIso(latest.date, monthsToReviewEnd),
      fundKey = currentPlanFundKey(),
      projected = projectedPlanSeries(currentState, fundKey, rates, reviewEndAge),
      monthKeys = monthKeysBetween(rows[0].date, reviewEndDate),
      labels = monthKeys.map(chartMonthLabel),
      actualByMonth = rows.reduce((acc, row) => {
        acc[chartMonthKey(row.date)] = row;
        return acc;
      }, {}),
      latestMonthKey = chartMonthKey(latest.date),
      latestMonthIndex = monthKeys.findIndex((key) => key === latestMonthKey);
    const projectedBrokerage = [],
      projected401k = [];
    for (let index = 0; index < monthKeys.length; index += 1) {
      if (index < latestMonthIndex) {
        projectedBrokerage.push(null);
        projected401k.push(null);
        continue;
      }
      const monthKey = monthKeys[index];
      projectedBrokerage.push(projected.brokerage[monthKey] ?? null);
      projected401k.push(projected.k401[monthKey] ?? null);
    }
    return {
      labels,
      actualBrokerage: monthKeys.map((monthKey) =>
        actualByMonth[monthKey] ? n(actualByMonth[monthKey].brokerage) : null,
      ),
      actual401k: monthKeys.map((monthKey) =>
        actualByMonth[monthKey] ? n(actualByMonth[monthKey].k401) : null,
      ),
      projectedBrokerage,
      projected401k,
    };
  }
  function latestProgressBenchmark(rates) {
    const latest = latestHistoryEntry();
    if (!latest) return null;
    const fundKey = currentPlanFundKey(),
      latestSnapshot = snapshotState(latest, state),
      profile = retirementNeedProfile(latestSnapshot, rates),
      projectedBasePlan = project(
        latestSnapshot,
        fundKey,
        profile.retirementAge,
        rates,
      ),
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
    const impossible = requiredBrokerage == null || required401k == null,
      requiredTotal =
        impossible ? null : requiredBrokerage + required401k,
      actualBrokerage = n(latest.brokerage),
      actual401k = n(latest.k401),
      actualTotal = totalBalance(latest);
    return {
      key: fundKey,
      label: `your base plan (${basePlanLabel()})`,
      profile,
      projectedBasePlan,
      requiredBrokerage,
      required401k,
      requiredTotal,
      impossible,
      latest,
      actualBrokerage,
      actual401k,
      actualTotal,
      brokerageRatio:
        requiredBrokerage == null
          ? 0
          : requiredBrokerage > 0
          ? actualBrokerage / requiredBrokerage
          : 1,
      k401Ratio:
        required401k == null ? 0 : required401k > 0 ? actual401k / required401k : 1,
      totalRatio:
        requiredTotal == null ? 0 : requiredTotal > 0 ? actualTotal / requiredTotal : 1,
    };
  }

  /* ===== RENDER: MILESTONES ===== */
  function renderMilestones(benchmark) {
    const row = el("milestonesRow");
    if (!row) return;
    if (!benchmark) { row.innerHTML = ""; return; }
    if (benchmark.impossible) {
      row.innerHTML = `<span class="milestonePill bad">Current target age not viable</span>`;
      return;
    }
    const pills = [];
    const bRatio = benchmark.brokerageRatio,
      kRatio = benchmark.k401Ratio,
      tRatio = benchmark.totalRatio;
    const cls = (r) => r >= 1 ? "good" : r >= 0.75 ? "okay" : "bad";
    pills.push({ label: `Bridge ${pct(bRatio * 100)} funded`, c: cls(bRatio) });
    pills.push({ label: `401k ${pct(kRatio * 100)} of target`, c: cls(kRatio) });
    if (tRatio >= 1.05) pills.push({ label: "Ahead of plan", c: "good" });
    else if (tRatio >= 0.95) pills.push({ label: "On track", c: "good" });
    else if (tRatio >= 0.88) pills.push({ label: "Slightly behind", c: "okay" });
    else pills.push({ label: "Behind plan", c: "bad" });
    if (state.inflationAdjusted) pills.push({ label: `Inflation-adjusted (${pct(n(state.inflationRate, 2.5))})`, c: "okay" });
    row.innerHTML = pills.map((p) => `<span class="milestonePill ${p.c}">${p.label}</span>`).join("");
  }

  /* ===== RENDER: SAVED SCENARIOS ===== */
  function renderSavedScenarios() {
    const list = el("savedScenariosList");
    if (!list) return;
    const scenarios = state.savedScenarios || [];
    if (!scenarios.length) {
      list.innerHTML = '<p class="sub" style="padding:0.5rem 0;margin:0">No saved scenarios yet. Configure a scenario above and click <strong>Save current</strong>.</p>';
      return;
    }
    list.innerHTML = scenarios.map((sc) =>
      {
        const stamp =
            typeof sc.timestamp === "string" && sc.timestamp
              ? sc.timestamp
              : today,
          stampDate = /^\d{4}-\d{2}-\d{2}/.test(stamp)
            ? stamp.slice(0, 10)
            : today,
          name = String(sc.name || "Saved scenario"),
          scenarioName = String(sc.scenario || "custom"),
          scenarioAge = n(sc.scenarioTargetRetirementAge, state.scenarioTargetRetirementAge);
        return `<div class="savedScenarioCard">
        <div class="scenarioCardInfo">
          <div class="scenarioCardName">${name}</div>
          <div class="scenarioCardMeta">${scenarioName} &middot; Age ${num(scenarioAge, 1)} &middot; ${fmtDate(stampDate)}</div>
        </div>
        <div class="scenarioCardActions">
          <button class="miniBtn" type="button" data-action="loadScenario" data-id="${sc.id}">Load</button>
          <button class="miniBtn danger" type="button" data-action="deleteScenario" data-id="${sc.id}">Delete</button>
        </div>
      </div>`;
      }
    ).join("");
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
      renderMilestones(null);
      return;
    }
    if (benchmark.impossible) {
      ui.hOverallBadge.textContent = "Off Track";
      ui.heroOverallStatus.className = "statusCard bad";
      ui.hOverallDetail.textContent = `Age ${age(state.targetRetirementAge)} is not currently viable under your saved assumptions.`;
      ui.hBrokerageCoverage.textContent =
        benchmark.requiredBrokerage == null ? "Not viable" : pct(benchmark.brokerageRatio * 100);
      ui.h401kCoverage.textContent =
        benchmark.required401k == null ? "Not viable" : pct(benchmark.k401Ratio * 100);
      renderMilestones(benchmark);
      return;
    }
    renderMilestones(benchmark);

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
      projectedBasePlan = project(
        state,
        currentPlanFundKey(),
        Math.max(computeAge(state), n(state.targetRetirementAge)),
        rates,
      ),
      ssRisk = ssEstimateRisk(state, state.targetRetirementAge),
      latest = latestHistoryEntry(),
      latestDate = latest ? fmtDate(latest.date) : "No snapshots yet";
    ui.basePlanSnapshot.innerHTML = [
      `<article class="card"><div class="top"><div><h3>Timeline</h3><p class="sub">Dates that define the benchmark.</p></div></div><div class="rowGrid"><div class="row"><span>Target retirement age</span><strong>${age(state.targetRetirementAge)}</strong></div><div class="row"><span>401k unlock age</span><strong>${age(state.unlockAge)}</strong></div><div class="row"><span>SS claim age</span><strong>${num(state.ssClaimAge, 0)}</strong></div><div class="row"><span>Latest snapshot</span><strong>${latestDate}</strong></div></div></article>`,
      `<article class="card"><div class="top"><div><h3>Spending</h3><p class="sub">Used for on-track review only.</p></div></div><div class="rowGrid"><div class="row"><span>Annual spend target</span><strong>${money(state.annualRetirementSpend)}</strong></div><div class="row"><span>Social Security at claim</span><strong>${money(ssMonthly(state) * 12)}/yr</strong></div><div class="row"><span>Bridge needed at retirement</span><strong>${money(profile.requiredBrokerageAtRetirement)}</strong></div><div class="row"><span>Projected brokerage at unlock</span><strong>${money(projectedBasePlan.brokerageAtUnlock)}</strong></div><div class="row"><span>401k needed at unlock for 401k role</span><strong>${money(profile.required401kAtUnlock)}</strong></div></div>${ssRisk ? `<p class="sub" style="margin-top:.75rem;color:var(--warn)">${ssRisk.text}</p>` : ""}</article>`,
        `<article class="card"><div class="top"><div><h3>Accumulation</h3><p class="sub">Current contribution settings and returns.</p></div></div><div class="rowGrid"><div class="row"><span>Base-plan brokerage path</span><strong>${basePlanLabel()} at ${pct(rates.iyw)}</strong></div><div class="row"><span>Brokerage / mo</span><strong>${money(active.monthlyBrokerageContribution ?? state.monthlyBrokerageContribution)}</strong></div><div class="row"><span>401k contribution</span><strong>${pct(active.contributionPct ?? state.contributionPct)} + ${pct(resolveEmployerMatchPct(active.contributionPct ?? state.contributionPct, active.employerMatchPct ?? state.employerMatchPct))} match</strong></div><div class="row"><span>401k growth</span><strong>${pct(rates.kacc)} / ${pct(rates.kpost)}</strong></div></div></article>`,
    ].join("");
  }
  function renderBasePlanMathBreakdown(rates) {
    if (!ui.basePlanMathSummary || !ui.basePlanMathRows) return;
    const retirementAge = Math.max(computeAge(state), n(state.targetRetirementAge)),
      result = project(state, currentPlanFundKey(), retirementAge, rates),
      rows = buildYearlyPlanRows(result),
      chartEndAge = Math.max(n(state.unlockAge, 59.5), n(state.chartEndAge, 80));
    ui.basePlanMathSummary.innerHTML = `<p>Base-plan path uses <strong>${basePlanLabel()}</strong>, retires at <strong>age ${age(retirementAge)}</strong>, bridges to <strong>${age(state.unlockAge)}</strong>, and rolls forward through <strong>age ${age(chartEndAge)}</strong>. Rows below are grouped by calendar year and include the same monthly contributions, withdrawals, compounding, and Social Security timing used in the planner.</p>`;
    if (!rows.length) {
      ui.basePlanMathRows.innerHTML =
        `<tr><td colspan="15" class="mutedValue">No projected rows available yet.</td></tr>`;
      return;
    }
    ui.basePlanMathRows.innerHTML = rows
      .map((row) => {
        const gapClass = row.gap > 1 ? "deltaDown" : "mutedValue";
        return `<tr><td>${row.year}</td><td>${age(row.ageStart)} - ${age(row.ageEnd)}</td><td>${row.phaseLabel}</td><td>${money(row.brokerageStart)}</td><td>${money(row.brokerageContribution)}</td><td>${money(row.brokerageWithdrawal)}</td><td>${money(row.brokerageEnd)}</td><td>${money(row.k401Start)}</td><td>${money(row.k401Contribution)}</td><td>${money(row.k401Withdrawal)}</td><td>${money(row.k401End)}</td><td>${money(row.ssIncome)}</td><td>${money(row.spend)}</td><td class="${gapClass}">${money(row.gap)}</td><td>${money(row.totalEnd)}</td></tr>`;
      })
      .join("");
  }
  function renderContributionFlexibility(rates) {
    if (!ui.contributionFlexCards || !ui.contributionFlexSummary) return;
    const brokerage = earliestContributionStop(state, rates, "brokerage"),
      k401 = earliestContributionStop(state, rates, "k401");
    if (!brokerage.viableBasePlan || !k401.viableBasePlan) {
      ui.contributionFlexCards.innerHTML = [
        `<article class="card" style="border-left:3px solid var(--bad)"><div class="top"><div><h3>Brokerage Contribution Flexibility</h3><p class="sub">Restore base-plan viability before using stop analysis.</p></div><span class="badge bad">Unavailable</span></div><p class="sub" style="margin-top:.7rem">The current target age is not viable under the saved assumptions, so there is no safe brokerage stop date to report yet.</p></article>`,
        `<article class="card" style="border-left:3px solid var(--bad)"><div class="top"><div><h3>401k Contribution Flexibility</h3><p class="sub">Restore base-plan viability before using stop analysis.</p></div><span class="badge bad">Unavailable</span></div><p class="sub" style="margin-top:.7rem">The current target age is not viable under the saved assumptions, so there is no safe 401k stop date to report yet.</p></article>`,
      ].join("");
      ui.contributionFlexSummary.textContent =
        "Contribution stop analysis activates once the current base plan is viable.";
      return;
    }
    const makeCard = (label, result, projectedRetirementValue, projectedUnlockValue) => {
      const canStopNow = result.monthsUntilStop === 0,
        stopDateText = result.stopDate ? fmtDate(result.stopDate) : "Not before retirement",
        stopAgeText = result.stopAge != null ? age(result.stopAge) : "-",
        monthsText =
          result.monthsUntilStop == null
            ? "Keep contributing through retirement"
            : canStopNow
              ? "Can stop now"
              : `Continue for ${result.monthsUntilStop} more months`;
      return `<article class="card" style="border-left:3px solid var(--brand)"><div class="top"><div><h3>${label}</h3><p class="sub">Earliest point you could stop this contribution stream while keeping the full base plan viable.</p></div><span class="badge ${canStopNow ? "good" : "okay"}">${canStopNow ? "Can stop now" : "Can stop later"}</span></div><div class="rowGrid"><div class="row"><span>Earliest safe stop date</span><strong>${stopDateText}</strong></div><div class="row"><span>Stop age</span><strong>${stopAgeText}</strong></div><div class="row"><span>Timing</span><strong>${monthsText}</strong></div><div class="row"><span>Projected balance at retirement</span><strong>${money(projectedRetirementValue)}</strong></div><div class="row"><span>Projected balance at ${age(state.unlockAge)}</span><strong>${money(projectedUnlockValue)}</strong></div></div><p class="sub" style="margin-top:.7rem">${canStopNow ? `Under the current base plan, this contribution stream could stop immediately and the plan would still remain viable.` : `Under the current base plan, keep this contribution stream running until ${fmtDate(result.stopDate)} and then it could drop to zero without breaking the plan.`}</p></article>`;
    };
    ui.contributionFlexCards.innerHTML = [
      makeCard(
        "Brokerage Contribution Flexibility",
        brokerage,
        brokerage.result?.brokerageAtRetirement,
        brokerage.result?.brokerageAtUnlock,
      ),
      makeCard(
        "401k Contribution Flexibility",
        k401,
        k401.result?.k401AtRetirement,
        k401.result?.k401AtUnlock,
      ),
    ].join("");
    ui.contributionFlexSummary.textContent =
      `This analysis uses your current base-plan assumptions, retirement age ${age(state.targetRetirementAge)}, and ${basePlanLabel()} return path. Each stop date is solved month by month by setting only that contribution stream to zero from that month onward while holding the rest of the plan constant.`;
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
    if (benchmark.impossible) {
      const makeImpossibleCard = (title, actual, label) =>
        `<article class="card" style="border-left:3px solid var(--bad)"><div class="top"><div><h3>${title}</h3><p class="sub">Current target age is not viable under the saved assumptions.</p></div><span class="badge bad">Off track</span></div><div class="rowGrid"><div class="row"><span>Actual ${label} today</span><strong>${money(actual)}</strong></div><div class="row"><span>Target age</span><strong>${age(state.targetRetirementAge)}</strong></div><div class="row"><span>Status</span><strong class="deltaDown">Not currently solvable</strong></div><div class="row"><span>Next step</span><strong>Adjust age, spend, or contributions</strong></div></div><p class="sub" style="margin-top:.7rem">This is not missing data. It means the current target age does not produce a viable full-plan path with the saved assumptions and balances.</p></article>`;
      ui.trackStatusCards.innerHTML = [
        makeImpossibleCard("Brokerage Track Status", benchmark.actualBrokerage, "brokerage"),
        makeImpossibleCard("401k Track Status", benchmark.actual401k, "401k"),
      ].join("");
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
        projectedRetirementLabel,
        projectedRetirementValue,
        projectedUnlockLabel,
        projectedUnlockValue,
      ) => {
        const currentGap = reqNow - actual,
          softGap = reqSoft - actual;
        let cls = "bad",
          status = "Off track",
          note = `Holding the rest of the plan constant, today's ${label} balance is below the minimum needed to keep the full age-${age(state.targetRetirementAge)} plan viable by ${money(Math.max(0, currentGap))}. This likely needs intervention.`;
        if (currentGap <= 0) {
          cls = "good";
          status = "On track";
          note = `Holding the rest of the plan constant, today's ${label} balance is enough to keep the full age-${age(state.targetRetirementAge)} plan viable, with ${money(Math.abs(currentGap))} of cushion.`;
        } else if (softGap <= 0) {
          cls = "okay";
          status = "Slightly off";
          note = `Holding the rest of the plan constant, today's ${label} balance misses the current target by ${money(Math.max(0, currentGap))}, but it is still roughly within a one-year slip of plan.`;
        }
        const borderColor = cls === "good" ? "var(--ok)" : cls === "okay" ? "var(--warn)" : "var(--bad)";
        return `<article class="card" style="border-left:3px solid ${borderColor}"><div class="top"><div><h3>${title}</h3><p class="sub">Minimum current balance needed to keep the full age-${age(state.targetRetirementAge)} plan viable, assuming everything else stays the same.</p></div><span class="badge ${cls}">${status}</span></div><div class="rowGrid"><div class="row"><span>Actual ${label} today</span><strong>${money(actual)}</strong></div><div class="row"><span>Minimum current balance needed</span><strong>${money(reqNow)}</strong></div><div class="row"><span>Ahead / behind</span><strong class="${currentGap <= 0 ? "deltaUp" : "deltaDown"}">${currentGap <= 0 ? `+${money(Math.abs(currentGap))}` : `-${money(currentGap)}`}</strong></div><div class="row"><span>Minimum current balance if retiring at ${age(n(state.targetRetirementAge) + 1)}</span><strong>${money(reqSoft)}</strong></div><div class="row"><span>${projectedRetirementLabel}</span><strong>${money(projectedRetirementValue)}</strong></div><div class="row"><span>${projectedUnlockLabel}</span><strong>${money(projectedUnlockValue)}</strong></div></div><p class="sub" style="margin-top:.7rem">${note}</p></article>`;
      };
    ui.trackStatusCards.innerHTML = [
      makeCard(
        "Brokerage Track Status",
        benchmark.actualBrokerage,
        benchmark.requiredBrokerage,
        brokerageReq1y,
        "brokerage",
        "Projected brokerage at retirement on current path",
        benchmark.projectedBasePlan.brokerageAtRetirement,
        `Projected brokerage at ${age(state.unlockAge)} on current path`,
        benchmark.projectedBasePlan.brokerageAtUnlock,
      ),
      makeCard(
        "401k Track Status",
        benchmark.actual401k,
        benchmark.required401k,
        k401Req1y,
        "401k",
        "Projected 401k at retirement on current path",
        benchmark.projectedBasePlan.k401AtRetirement,
        `Projected 401k at ${age(state.unlockAge)} on current path`,
        benchmark.projectedBasePlan.k401AtUnlock,
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
    if (benchmark.impossible) {
      ui.reviewNote.textContent =
        `Your saved balances are loaded, but age ${age(state.targetRetirementAge)} is not currently viable under the base-plan assumptions. This is a plan shortfall, not a missing-data issue.`;
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
      canRaise401k = n(state.contributionPct) < 6,
      contributionStep = canRaise401k
        ? `or raising your 401k contribution from ${pct(state.contributionPct)} toward the 6% full-match level`
        : `while keeping your 401k contribution near ${pct(state.contributionPct)}`;
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
    const curMatch = resolveEmployerMatchPct(
      cur.contributionPct,
      cur.employerMatchPct,
    );
    const prevMatch = resolveEmployerMatchPct(
      prev.contributionPct,
      prev.employerMatchPct,
    );
    const brokerageDelta =
      n(cur.monthlyBrokerageContribution) - n(prev.monthlyBrokerageContribution);
    const salaryDelta = n(cur.annualSalary) - n(prev.annualSalary);
    const contributionDelta =
      n(cur.contributionPct) - n(prev.contributionPct);
    const matchDelta = curMatch - prevMatch;
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
          `<tr><td>${fmtDate(r.effectiveDate)}</td><td>${money(r.monthlyBrokerageContribution)}</td><td>${money(r.annualSalary)}</td><td>${pct(r.contributionPct)}</td><td>${pct(resolveEmployerMatchPct(r.contributionPct, r.employerMatchPct))}</td><td>${money(k401MonthlyFromValues(r.annualSalary, r.contributionPct, r.employerMatchPct))}</td><td>${assumptionDeltaText(r, rows[i + 1])}</td><td><div class="historyActions"><button class="miniBtn" type="button" data-action="edit" data-id="${r.timestamp}">Edit</button><button class="miniBtn danger" type="button" data-action="delete" data-id="${r.timestamp}">Delete</button></div></td></tr>`,
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
          e = early[f.key]?.full,
          bridgeAge = early[f.key]?.bridge,
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
        return `<article class="card" style="border-left:3px solid ${borderColor}"><div class="top"><div><h3>${f.title}</h3><p class="sub">Accumulation ${pct(f.rate)}. ${res.rates.label} at age ${age(stateLike.targetRetirementAge)}.</p></div><div class="age ${cls}">${e == null ? "65+" : age(e)}<small>earliest full-plan-safe</small></div></div><div class="rowGrid"><div class="row"><span>Bridge-safe age</span><strong>${bridgeAge == null ? "65+" : age(bridgeAge)}</strong></div><div class="row"><span>Brokerage at retirement</span><strong>${money(x.brokerageAtRetirement)}</strong></div><div class="row"><span>401k at retirement</span><strong>${money(x.k401AtRetirement)}</strong></div><div class="row"><span>Brokerage at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.brokerageAtUnlock)}</strong></div><div class="row"><span>401k at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.k401AtUnlock)}</strong></div><div class="row"><span>Combined at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.totalAtUnlock)}</strong></div><div class="row"><span>4% withdrawal / year</span><strong>${money(x.sustainableWithdrawal)}</strong></div><div class="row"><span>${gapLabel}</span><strong>${money(Math.abs(x.annualGapOrSurplus))}</strong></div><div class="row"><span>Portfolio longevity</span><strong>${lon(x.longevityAge)}</strong></div></div></article>`;
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
      (early.iyw?.bridge == null || early.iyw.bridge > 65) &&
      (early.qqqm?.bridge == null || early.qqqm.bridge > 65);
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
      ssRisk = ssEstimateRisk(stateLike, target),
      best = [
        { key: "iyw", label: blendLabel("blendA") },
        { key: "qqqm", label: blendLabel("blendB") },
      ].sort(
        (a, b) => (early[a.key]?.full ?? Infinity) - (early[b.key]?.full ?? Infinity),
      )[0],
      bridgeAge = early[best.key]?.bridge,
      fullAge = early[best.key]?.full,
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
    const ssRiskNote = ssRisk ? ` ${ssRisk.text}` : "";
    if (bridgeAge == null || bridgeAge > 65)
      return `${res.rates.label} does not produce a bridge-safe retirement before age 65 for either path. At target age ${age(target)}, ${blendLabel("blendA")} leaves ${money(res.iyw.brokerageAtUnlock)} in brokerage at ${num(stateLike.unlockAge, 1)} and ${blendLabel("blendB")} leaves ${money(res.qqqm.brokerageAtUnlock)}.${scheduledNote}${ssRiskNote}`;
    if (fullAge == null || fullAge > 65)
      return `With ${money(stateLike.monthlyBrokerageContribution)}/month into ${best.label}, the earliest bridge-safe age in the ${res.rates.label.toLowerCase()} is ${age(bridgeAge)}, but the planner does not find a full-plan-safe retirement before age 65 on that path.${scheduledNote}${ssRiskNote}`;
    return `With ${money(stateLike.monthlyBrokerageContribution)}/month into ${best.label}, the earliest full-plan-safe age in the ${res.rates.label.toLowerCase()} is ${age(fullAge)}. The bridge-safe age is ${age(bridgeAge)}. At target age ${age(target)}, the ${best.label} path reaches ${money(x.totalAtUnlock)} combined at ${num(stateLike.unlockAge, 1)} and supports ${money(x.sustainableWithdrawal)}/year at 4%. Social Security adds ${money(x.annualSS)}/year at age ${stateLike.ssClaimAge}, leaving ${gap}. Portfolio longevity: age ${lon(x.longevityAge)}.${scheduledNote}${ssRiskNote}`;
  }

  /* ===== MONTE CARLO ===== */
  function hashString(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i += 1) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }
  function mulberry32(seed) {
    let t = seed >>> 0;
    return function () {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randomNormal(rng) {
    let u = 0,
      v = 0;
    while (u === 0) u = rng();
    while (v === 0) v = rng();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function monteMonthlyReturn(meanAnnualPct, annualVolPct, rng) {
    const sigmaAnnual = Math.max(0, n(annualVolPct, 0)) / 100,
      sigmaMonthly = sigmaAnnual / Math.sqrt(12),
      meanAnnual = Math.max(-99, n(meanAnnualPct, 0)),
      driftMonthly = Math.log(1 + meanAnnual / 100) / 12;
    return Math.exp(driftMonthly + sigmaMonthly * randomNormal(rng)) - 1;
  }
  function percentileFromSorted(values, fraction) {
    if (!values.length) return 0;
    const idx = Math.max(
      0,
      Math.min(values.length - 1, Math.round((values.length - 1) * fraction)),
    );
    return values[idx];
  }
  function formatMonteAge(ageValue) {
    return ageValue == null || ageValue >= 109.99 ? "110+" : age(ageValue);
  }
  function simulateMonteCarloPath(stateLike, fundKey, rates, config, runIndex, agePoints, horizonMonths) {
    const cur = computeAge(stateLike),
      retirementAge = Math.max(cur, n(stateLike.targetRetirementAge)),
      unlockAge = n(stateLike.unlockAge, 59.5),
      claimAge = n(stateLike.ssClaimAge, 62),
      spend = n(stateLike.annualRetirementSpend) / 12,
      ss = ssMonthly(stateLike),
      startDate = stateLike.currentDate || today,
      mRet = monthsBetweenAges(cur, retirementAge),
      actualRetirementAge = cur + mRet / 12,
      mUnlock =
        actualRetirementAge < unlockAge
          ? monthsBetweenAges(actualRetirementAge, unlockAge)
          : 0,
      seedBase = `${fundKey}|${JSON.stringify(config.seedKey)}|${runIndex}`,
      rng = mulberry32(hashString(seedBase));
    let b = n(stateLike.currentBrokerageBalance),
      k = n(stateLike.current401kBalance),
      depletedAge = null;
    const totals = [Math.max(0, b + k)];
    for (let month = 1; month < agePoints.length; month += 1) {
      const agePoint = agePoints[month],
        datePoint = addMonthsIso(startDate, month);
      if (depletedAge != null) {
        totals.push(0);
        continue;
      }
      if (month <= mRet) {
        const entry = assumptionsForDate(stateLike, datePoint),
          bContrib = n(entry.monthlyBrokerageContribution),
          kContrib = k401MonthlyFromValues(
            entry.annualSalary,
            entry.contributionPct,
            entry.employerMatchPct,
          ),
          bRet = monteMonthlyReturn(
            fundKey === "iyw" ? rates.iyw : rates.qqqm,
            config.brokerageVol,
            rng,
          ),
          kRet = monteMonthlyReturn(rates.kacc, config.k401Vol, rng);
        b = Math.max(0, b * (1 + bRet) + bContrib);
        k = Math.max(0, k * (1 + kRet) + kContrib);
        totals.push(b + k);
        continue;
      }
      if (month <= mRet + mUnlock) {
        const bRet = monteMonthlyReturn(rates.post, config.brokerageVol, rng),
          kRet = monteMonthlyReturn(rates.kpost, config.k401Vol, rng),
          grownBrokerage = Math.max(0, b * (1 + bRet)),
          bridgeWithdraw = Math.min(grownBrokerage, spend),
          gap = Math.max(0, spend - bridgeWithdraw);
        b = Math.max(0, grownBrokerage - spend);
        k = Math.max(0, k * (1 + kRet));
        if (gap > 1) {
          depletedAge = agePoint;
          b = 0;
          k = 0;
        }
        totals.push(b + k);
        continue;
      }
      const income = agePoint >= claimAge ? ss : 0;
      let need = Math.max(0, spend - income);
      const kWithdraw = Math.min(k, need);
      k -= kWithdraw;
      need -= kWithdraw;
      const bWithdraw = Math.min(b, need);
      b -= bWithdraw;
      need -= bWithdraw;
      if (need > 1) {
        depletedAge = agePoint;
        b = 0;
        k = 0;
        totals.push(0);
        continue;
      }
      b = Math.max(0, b * (1 + monteMonthlyReturn(rates.post, config.brokerageVol, rng)));
      k = Math.max(0, k * (1 + monteMonthlyReturn(rates.kpost, config.k401Vol, rng)));
      totals.push(b + k);
    }
    const endingBalances = {
      age90: totals[horizonMonths.age90] ?? 0,
      age95: totals[horizonMonths.age95] ?? 0,
      age100: totals[horizonMonths.age100] ?? 0,
    };
    const success = {
      age90: depletedAge == null || depletedAge >= 90,
      age95: depletedAge == null || depletedAge >= 95,
      age100: depletedAge == null || depletedAge >= 100,
    };
    return {
      totals,
      depletionAge: depletedAge,
      endingBalances,
      success,
    };
  }
  function runMonteCarloForPath(stateLike, fundKey, rates, config) {
    const cur = computeAge(stateLike),
      endAge = Math.max(100, n(stateLike.chartEndAge, 80)),
      months = monthsBetweenAges(cur, endAge),
      agePoints = Array.from({ length: months + 1 }, (_, i) => cur + i / 12),
      monthBuckets = Array.from({ length: months + 1 }, () => []),
      depletionAges = [],
      endings90 = [],
      endings95 = [],
      endings100 = [],
      horizonMonths = {
        age90: monthsBetweenAges(cur, 90),
        age95: monthsBetweenAges(cur, 95),
        age100: monthsBetweenAges(cur, 100),
      };
    let success90 = 0,
      success95 = 0,
      success100 = 0;
    for (let run = 0; run < config.runs; run += 1) {
      const outcome = simulateMonteCarloPath(
        stateLike,
        fundKey,
        rates,
        config,
        run,
        agePoints,
        horizonMonths,
      );
      outcome.totals.forEach((value, idx) => {
        monthBuckets[idx].push(Math.max(0, value));
      });
      depletionAges.push(outcome.depletionAge == null ? 110 : outcome.depletionAge);
      endings90.push(outcome.endingBalances.age90);
      endings95.push(outcome.endingBalances.age95);
      endings100.push(outcome.endingBalances.age100);
      if (outcome.success.age90) success90 += 1;
      if (outcome.success.age95) success95 += 1;
      if (outcome.success.age100) success100 += 1;
    }
    const sortedDepletions = [...depletionAges].sort((a, b) => a - b),
      sorted90 = [...endings90].sort((a, b) => a - b),
      sorted95 = [...endings95].sort((a, b) => a - b),
      sorted100 = [...endings100].sort((a, b) => a - b),
      p10Series = [],
      p50Series = [],
      p90Series = [];
    monthBuckets.forEach((bucket, idx) => {
      bucket.sort((a, b) => a - b);
      p10Series.push({ x: agePoints[idx], y: percentileFromSorted(bucket, 0.1) });
      p50Series.push({ x: agePoints[idx], y: percentileFromSorted(bucket, 0.5) });
      p90Series.push({ x: agePoints[idx], y: percentileFromSorted(bucket, 0.9) });
    });
    return {
      runs: config.runs,
      endAge,
      success90: (success90 / config.runs) * 100,
      success95: (success95 / config.runs) * 100,
      success100: (success100 / config.runs) * 100,
      medianDepletionAge: percentileFromSorted(sortedDepletions, 0.5),
      medianEnding90: percentileFromSorted(sorted90, 0.5),
      medianEnding95: percentileFromSorted(sorted95, 0.5),
      medianEnding100: percentileFromSorted(sorted100, 0.5),
      p10Series,
      p50Series,
      p90Series,
    };
  }
  function monteCarloConfig(stateLike, rates) {
    return {
      runs: Math.max(100, Math.min(5000, Math.round(n(stateLike.monteCarloRuns, 1000)))),
      brokerageVol: Math.max(0, n(stateLike.monteBrokerageVol, 22)),
      k401Vol: Math.max(0, n(stateLike.monte401kVol, 14)),
      seedKey: {
        currentDate: stateLike.currentDate,
        targetRetirementAge: stateLike.targetRetirementAge,
        unlockAge: stateLike.unlockAge,
        chartEndAge: stateLike.chartEndAge,
        annualRetirementSpend: stateLike.annualRetirementSpend,
        currentBrokerageBalance: stateLike.currentBrokerageBalance,
        current401kBalance: stateLike.current401kBalance,
        ss62: stateLike.ss62,
        ssFRA: stateLike.ssFRA,
        ssClaimAge: stateLike.ssClaimAge,
        k401AccumReturn: rates.kacc,
        k401PostReturn: rates.kpost,
        postReturn: rates.post,
        brokerageVol: stateLike.monteBrokerageVol,
        k401Vol: stateLike.monte401kVol,
        balanceHistory: stateLike.balanceHistory,
        assumptionHistory: stateLike.assumptionHistory,
      },
    };
  }
  function getMonteCarloResults(stateLike, rates) {
    const config = monteCarloConfig(stateLike, rates),
      cacheKey = JSON.stringify({
        config,
        rates,
        showA: stateLike.showBlendAChart,
        showB: stateLike.showBlendBChart,
        blendA: blendLabel("blendA"),
        blendB: blendLabel("blendB"),
      });
    if (monteCacheKey === cacheKey && monteCacheValue) return monteCacheValue;
    const result = {
      config,
      iyw: runMonteCarloForPath(stateLike, "iyw", rates, config),
      qqqm: runMonteCarloForPath(stateLike, "qqqm", rates, config),
    };
    monteCacheKey = cacheKey;
    monteCacheValue = result;
    return result;
  }
  function paintMonteCarloChart(monte, stateLike = state) {
    if (!ui.monteCarloChart || !ui.monteCarloFallback) return;
    const showFallback = () => {
      ui.monteCarloChart.classList.add("hidden");
      ui.monteCarloFallback.classList.remove("hidden");
    };
    if (typeof Chart === "undefined") {
      showFallback();
      return;
    }
    ui.monteCarloChart.classList.remove("hidden");
    ui.monteCarloFallback.classList.add("hidden");
    ui.monteCarloChart.removeAttribute("width");
    ui.monteCarloChart.removeAttribute("height");
    const text = getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#eef4fb",
      muted = getComputedStyle(document.documentElement).getPropertyValue("--muted").trim() || "#9db0c2",
      border = getComputedStyle(document.documentElement).getPropertyValue("--border").trim() || "#283345",
      showA = stateLike.showBlendAChart !== false,
      showB = stateLike.showBlendBChart !== false,
      datasets = [];
    if (showA) {
      datasets.push(
        { label: `${blendLabel("blendA")} p10`, data: monte.iyw.p10Series, parsing: false, borderColor: "rgba(13,102,125,0.35)", borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 },
        { label: `${blendLabel("blendA")} median`, data: monte.iyw.p50Series, parsing: false, borderColor: "#0d667d", borderWidth: 2.5, pointRadius: 0 },
        { label: `${blendLabel("blendA")} p90`, data: monte.iyw.p90Series, parsing: false, borderColor: "rgba(13,102,125,0.6)", borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 },
      );
    }
    if (showB) {
      datasets.push(
        { label: `${blendLabel("blendB")} p10`, data: monte.qqqm.p10Series, parsing: false, borderColor: "rgba(211,107,44,0.35)", borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 },
        { label: `${blendLabel("blendB")} median`, data: monte.qqqm.p50Series, parsing: false, borderColor: "#d36b2c", borderWidth: 2.5, pointRadius: 0 },
        { label: `${blendLabel("blendB")} p90`, data: monte.qqqm.p90Series, parsing: false, borderColor: "rgba(211,107,44,0.6)", borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 },
      );
    }
    try {
      if (monteChart) monteChart.destroy();
      monteChart = new Chart(ui.monteCarloChart.getContext("2d"), {
        type: "line",
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
          interaction: { mode: "nearest", intersect: false },
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
            x: {
              type: "linear",
              min: computeAge(stateLike),
              max: Math.max(100, n(stateLike.chartEndAge, 80)),
              ticks: { color: muted },
              grid: { color: border },
              title: { display: true, text: "Age", color: muted },
            },
            y: {
              ticks: { color: muted, callback: (v) => money(v, 0) },
              grid: { color: border },
              title: { display: true, text: "Combined portfolio balance", color: muted },
            },
          },
        },
      });
    } catch (err) {
      console.error("Monte Carlo chart render failed", err);
      showFallback();
    }
  }
  function renderMonteCarlo(stateLike, rates) {
    if (!ui.monteCarloCards || !ui.monteCarloSummary) return;
    const monte = getMonteCarloResults(stateLike, rates),
      paths = [
        { key: "iyw", label: blendLabel("blendA"), visible: stateLike.showBlendAChart !== false },
        { key: "qqqm", label: blendLabel("blendB"), visible: stateLike.showBlendBChart !== false },
      ].filter((row) => row.visible);
    ui.monteCarloSummary.textContent =
      `Monte Carlo uses ${num(monte.config.runs, 0)} seeded runs with randomized monthly returns around the active scenario assumptions. Brokerage volatility is ${pct(monte.config.brokerageVol)}, 401k volatility is ${pct(monte.config.k401Vol)}, and success means the plan avoids an unfunded gap before the shown age threshold.`;
    ui.monteCarloCards.innerHTML = paths
      .map((path) => {
        const row = monte[path.key];
        return `<article class="card" style="border-left:3px solid ${path.key === "iyw" ? "var(--brand)" : "var(--alt)"}"><div class="top"><div><h3>${path.label}</h3><p class="sub">Probability view of the current scenario path.</p></div><span class="badge ${row.success100 >= 70 ? "good" : row.success100 >= 50 ? "okay" : "bad"}">${pct(row.success100)} to age 100</span></div><div class="rowGrid"><div class="row"><span>Success to age 90</span><strong>${pct(row.success90)}</strong></div><div class="row"><span>Success to age 95</span><strong>${pct(row.success95)}</strong></div><div class="row"><span>Success to age 100</span><strong>${pct(row.success100)}</strong></div><div class="row"><span>Median ending balance at 90</span><strong>${money(row.medianEnding90)}</strong></div><div class="row"><span>Median ending balance at 95</span><strong>${money(row.medianEnding95)}</strong></div><div class="row"><span>Median ending balance at 100</span><strong>${money(row.medianEnding100)}</strong></div><div class="row"><span>Median depletion age</span><strong>${formatMonteAge(row.medianDepletionAge)}</strong></div></div></article>`;
      })
      .join("");
    paintMonteCarloChart(monte, stateLike);
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
    // "You are here" vertical line plugin for categorical charts
    const todayLabel = chartMonthLabel(chartMonthKey(today));
    const todayLinePlugin = {
      id: "todayLine",
      afterDraw(chart) {
        const idx = chart.data.labels.indexOf(todayLabel);
        if (idx < 0) return;
        const meta = chart.getDatasetMeta(0);
        if (!meta.data[idx]) return;
        const x = meta.data[idx].x,
          yScale = chart.scales.y,
          ctx2 = chart.ctx;
        ctx2.save();
        ctx2.beginPath();
        ctx2.moveTo(x, yScale.top);
        ctx2.lineTo(x, yScale.bottom);
        ctx2.strokeStyle = "rgba(13,102,125,0.55)";
        ctx2.lineWidth = 2;
        ctx2.setLineDash([4, 4]);
        ctx2.stroke();
        ctx2.font = "11px sans-serif";
        ctx2.fillStyle = "rgba(13,102,125,0.8)";
        ctx2.fillText("today", x + 4, yScale.top + 14);
        ctx2.restore();
      },
    };
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
                label: "Base-plan projected path",
                data: normalize(review.projectedBrokerage),
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
          plugins: [todayLinePlugin],
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
                label: "Base-plan projected path",
                data: normalize(review.projected401k),
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
          plugins: [todayLinePlugin],
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
    saveToServer();
    fillInputs();
    renderSavedScenarios();
    try {
      const currentTab = activeTab(),
        planningRates = baselinePlanningRates(state),
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
          iyw: {
            bridge: earliest(scenarioState, "iyw", rates),
            full: earliestFullPlan(scenarioState, "iyw", rates),
          },
          qqqm: {
            bridge: earliest(scenarioState, "qqqm", rates),
            full: earliestFullPlan(scenarioState, "qqqm", rates),
          },
        };
      if (currentTab === "track") {
        renderHeroDashboard(planningRates);
        renderHistory();
        renderBasePlanSnapshot(planningRates);
        renderBasePlanMathBreakdown(planningRates);
        renderContributionFlexibility(planningRates);
        renderTrackStatusCards(planningRates);
        renderChangeCards();
        renderAssumptionHistory();
        renderReviewNote(planningRates);
        paintActualCharts(planningRates);
      } else {
        ui.scenarioNote.textContent = `${rates.note} Scenario retirement age is ${age(scenarioState.targetRetirementAge)}. The brokerage comparison changes between ${blendLabel("blendA")} and ${blendLabel("blendB")}; the 401k path only changes when retirement timing or 401k return assumptions change.`;
        renderCards(res, early, scenarioState);
        renderStatus(res, scenarioState);
        renderWarning(early, rates, scenarioState);
        ui.summary.textContent = renderSummary(res, early, scenarioState);
        renderMonteCarlo(scenarioState, rates);
        paintCharts(res, bridgeNeed(scenarioState, rates), scenarioState);
      }
    } catch (err) {
      console.error("Render failed", err);
      ui.scenarioNote.textContent =
        "Some projections could not render, but your saved inputs are still loaded.";
      renderHistory();
      if (ui.basePlanSnapshot) ui.basePlanSnapshot.innerHTML = "";
      if (ui.basePlanMathSummary) ui.basePlanMathSummary.innerHTML = "";
      if (ui.basePlanMathRows) ui.basePlanMathRows.innerHTML = "";
      if (ui.contributionFlexCards) ui.contributionFlexCards.innerHTML = "";
      if (ui.contributionFlexSummary) ui.contributionFlexSummary.innerHTML = "";
      ui.trackStatusCards.innerHTML = "";
      renderChangeCards();
      renderAssumptionHistory();
      ui.cards.innerHTML = "";
      ui.status.innerHTML = "";
      ui.summary.textContent =
        "Saved inputs loaded, but the projection engine hit an error. Use Reset defaults if stale data caused this.";
      if (ui.monteCarloSummary) ui.monteCarloSummary.textContent = "";
      if (ui.monteCarloCards) ui.monteCarloCards.innerHTML = "";
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
      ui.monteCarloChart?.classList.add("hidden");
      ui.monteCarloFallback?.classList.remove("hidden");
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
    state.monteCarloRuns = Math.max(
      100,
      Math.min(
        5000,
        Math.round(n(ui.monteCarloRuns?.value, state.monteCarloRuns)),
      ),
    );
    state.monteBrokerageVol = Math.max(
      0,
      n(ui.monteBrokerageVol?.value, state.monteBrokerageVol),
    );
    state.monte401kVol = Math.max(
      0,
      n(ui.monte401kVol?.value, state.monte401kVol),
    );
    const priorContributionPct = normalizeContributionPct(
        state.contributionPct,
        base.contributionPct,
      ),
      nextContributionPct = normalizeContributionPct(
        ui.contributionPct.value,
        state.contributionPct,
      );
    state.contributionPct = nextContributionPct;
    state.employerMatchPct = nextEmployerMatchPct(
      nextContributionPct,
      priorContributionPct,
      state.employerMatchPct,
    );
    state.ssClaimAge = n(ui.ssClaimAge.value, state.ssClaimAge);
    saveToServer();
  }
  function update(k, v) {
    const priorContributionPct =
        k === "contributionPct"
          ? normalizeContributionPct(state.contributionPct, base.contributionPct)
          : null,
      priorEmployerMatchPct =
        k === "contributionPct" ? state.employerMatchPct : null;
    state[k] = v;
    if (k === "contributionPct") {
      state.contributionPct = normalizeContributionPct(
        state.contributionPct,
        base.contributionPct,
      );
      state.employerMatchPct = nextEmployerMatchPct(
        state.contributionPct,
        priorContributionPct,
        priorEmployerMatchPct,
      );
    }
    if (
      [
        "monthlyBrokerageContribution",
        "annualSalary",
        "contributionPct",
      ].includes(k)
    )
      upsertAssumptionHistory();
    if (["currentBrokerageBalance", "current401kBalance"].includes(k))
      upsertBalanceHistory();
    scheduleRender();
  }
  function previewRangeValue(targetId, value, type = "plain") {
    const target = ui[targetId];
    if (!target) return;
    if (type === "currency") target.value = money(value);
    else if (type === "age")
      target.value = num(value, Number(value) % 1 === 0 ? 0 : 1);
    else target.value = String(value);
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
      ),
      contributionPct = normalizeContributionPct(state.contributionPct),
      employerMatchPct = existing
        ? nextEmployerMatchPct(
            contributionPct,
            existing.contributionPct,
            existing.employerMatchPct,
          )
        : resolveEmployerMatchPct(
        contributionPct,
        state.employerMatchPct,
      );
    if (existing) {
      existing.monthlyBrokerageContribution = n(
        state.monthlyBrokerageContribution,
      );
      existing.annualSalary = n(state.annualSalary);
      existing.contributionPct = contributionPct;
      existing.employerMatchPct = employerMatchPct;
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
        contributionPct,
        employerMatchPct,
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
    ["monteCarloRuns", "monteCarloRuns"],
    ["monteBrokerageVol", "monteBrokerageVol"],
    ["monte401kVol", "monte401kVol"],
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
      scheduleRender();
    });
  });
  [ui.showBlendAChart, ui.showBlendBChart].forEach((field) => {
    field?.addEventListener("change", () => {
      persistVisibleState();
      scheduleRender();
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
    scheduleRender();
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
  ui.contributionPct?.addEventListener(
    "input",
    refreshMain401DerivedDisplays,
  );
  ui.contributionPct?.addEventListener("change", () =>
    update(
      "contributionPct",
      normalizeContributionPct(ui.contributionPct.value, state.contributionPct),
    ),
  );
  ui.annualSalary?.addEventListener("input", refreshMain401DerivedDisplays);
  ui.annualSalary?.addEventListener("change", refreshMain401DerivedDisplays);
  ui.ssClaimAge?.addEventListener("input", persistVisibleState);
  ui.ssClaimAge?.addEventListener("change", () =>
    update("ssClaimAge", n(ui.ssClaimAge.value, 62)),
  );
  ui.monthlyBrokerageContributionRange?.addEventListener("input", () =>
    previewRangeValue(
      "monthlyBrokerageContribution",
      n(ui.monthlyBrokerageContributionRange.value, 2000),
      "currency",
    ),
  );
  ui.monthlyBrokerageContributionRange?.addEventListener("change", () =>
    update(
      "monthlyBrokerageContribution",
      n(ui.monthlyBrokerageContributionRange.value, 2000),
    ),
  );
  ui.targetRetirementAgeRange?.addEventListener("input", () =>
    previewRangeValue(
      "targetRetirementAge",
      n(ui.targetRetirementAgeRange.value, 50),
      "age",
    ),
  );
  ui.targetRetirementAgeRange?.addEventListener("change", () =>
    update(
      "targetRetirementAge",
      n(ui.targetRetirementAgeRange.value, 50),
    ),
  );
  ui.scenarioTargetRetirementAgeRange?.addEventListener("input", () =>
    previewRangeValue(
      "scenarioTargetRetirementAge",
      n(ui.scenarioTargetRetirementAgeRange.value, 50),
      "age",
    ),
  );
  ui.scenarioTargetRetirementAgeRange?.addEventListener("change", () =>
    update(
      "scenarioTargetRetirementAge",
      n(ui.scenarioTargetRetirementAgeRange.value, 50),
    ),
  );
  ui.annualRetirementSpendRange?.addEventListener("input", () =>
    previewRangeValue(
      "annualRetirementSpend",
      n(ui.annualRetirementSpendRange.value, 55000),
      "currency",
    ),
  );
  ui.annualRetirementSpendRange?.addEventListener("change", () =>
    update(
      "annualRetirementSpend",
      n(ui.annualRetirementSpendRange.value, 55000),
    ),
  );
  window.addEventListener("beforeunload", () => {
    if (_appReady) {
      persistVisibleState();
      flushSaveToServer(true);
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (_appReady && document.visibilityState === "hidden") {
      persistVisibleState();
      flushSaveToServer(true);
    }
  });
  $$(".pill").forEach((b) =>
    b.addEventListener("click", () => update("scenario", b.dataset.s)),
  );
  ui.syncScenarioAgeBtn?.addEventListener("click", () =>
    update("scenarioTargetRetirementAge", n(state.targetRetirementAge)),
  );
  ui.promoteBlendToBasePlan?.addEventListener("click", () => {
    syncBasePlanBlendFromScenario();
    render();
  });

  /* ===== MODAL HELPERS ===== */
  function assumptionModalSeed(dateValue) {
    const seed =
      activeAssumptionEntry(dateValue) || {
        monthlyBrokerageContribution: state.monthlyBrokerageContribution,
        annualSalary: state.annualSalary,
        contributionPct: state.contributionPct,
        employerMatchPct: state.employerMatchPct,
      };
    const contributionPct = normalizeContributionPct(
      seed.contributionPct,
      state.contributionPct,
    );
    return {
      ...seed,
      contributionPct,
      employerMatchPct: resolveEmployerMatchPct(
        contributionPct,
        seed.employerMatchPct,
      ),
    };
  }
  function refreshAssumptionModalMonthly401() {
    const contributionPct = normalizeContributionPct(
      ui.assumptionModalContributionPct.value,
      state.contributionPct,
    );
    const employerMatchPct = nextEmployerMatchPct(
      contributionPct,
      assumptionModalSeedContributionPct,
      assumptionModalSeedMatchPct,
    );
    ui.assumptionModalMatchPct.value = pct(employerMatchPct);
    ui.assumptionModalMonthly401.textContent = money(
      k401MonthlyFromValues(
        n(ui.assumptionModalSalary.value, state.annualSalary),
        contributionPct,
        employerMatchPct,
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
    assumptionModalSeedContributionPct = normalizeContributionPct(
      seed.contributionPct,
      state.contributionPct,
    );
    assumptionModalSeedMatchPct = resolveEmployerMatchPct(
      assumptionModalSeedContributionPct,
      seed.employerMatchPct,
    );
    ui.assumptionModalDate.value = effectiveDate;
    ui.assumptionModalBrokerageContribution.value = money(
      seed.monthlyBrokerageContribution,
    );
    ui.assumptionModalSalary.value = money(seed.annualSalary);
    ui.assumptionModalContributionPct.value = num(
      normalizeContributionPct(seed.contributionPct, state.contributionPct),
      n(seed.contributionPct) % 1 === 0 ? 0 : 1,
    );
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
    assumptionModalSeedContributionPct = null;
    assumptionModalSeedMatchPct = null;
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
            contributionPct: normalizeContributionPct(state.contributionPct),
            employerMatchPct: employerMatchPctFromContributionPct(
              state.contributionPct,
            ),
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
      contributionPct = normalizeContributionPct(
        ui.assumptionModalContributionPct.value,
        state.contributionPct,
      ),
      preservedMatchPct = nextEmployerMatchPct(
        contributionPct,
        assumptionModalSeedContributionPct,
        assumptionModalSeedMatchPct,
      ),
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
        contributionPct,
        employerMatchPct: preservedMatchPct,
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
        "Reset the planner back to its original defaults? This clears all saved data.",
      )
    )
      return;
    state = {
      ...base,
      currentDate: today,
      savedScenarios: [],
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
    localStorage.removeItem(KEY);
    render();
  });

  /* ===== EXPORT / IMPORT ===== */
  el("exportDataBtn")?.addEventListener("click", () => {
    window.open("/api/export");
  });
  el("importDataBtn")?.addEventListener("click", () => {
    el("importFileInput")?.click();
  });
  el("importFileInput")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        let message = `Import failed with status ${res.status}`;
        try {
          const body = await res.json();
          message = body?.detail || body?.error || message;
        } catch {}
        throw new Error(message);
      }
      window.location.reload();
    } catch (err) {
      alert(`Import failed: ${err.message || err}`);
    } finally {
      e.target.value = "";
    }
  });

  /* ===== INFLATION TOGGLE ===== */
  el("inflationAdjustedToggle")?.addEventListener("change", (e) => {
    state.inflationAdjusted = e.target.checked;
    el("inflationRateField")?.classList.toggle("hidden", !state.inflationAdjusted);
    scheduleRender();
  });
  el("inflationRate")?.addEventListener("input", () => {
    state.inflationRate = n(el("inflationRate").value, 2.5);
    saveToServer();
  });
  el("inflationRate")?.addEventListener("change", () => {
    state.inflationRate = Math.max(0, n(el("inflationRate").value, 2.5));
    scheduleRender();
  });

  /* ===== FIRST-RUN BANNER DISMISS ===== */
  document.addEventListener("click", (e) => {
    if (e.target.id === "dismissFirstRun") {
      el("firstRunBanner")?.classList.add("hidden");
    }
  });

  /* ===== SAVED SCENARIOS ===== */
  el("saveScenarioBtn")?.addEventListener("click", () => {
    const form = el("saveScenarioForm");
    if (form) form.classList.toggle("hidden");
    el("newScenarioName")?.focus();
  });
  el("cancelSaveScenario")?.addEventListener("click", () => {
    el("saveScenarioForm")?.classList.add("hidden");
    if (el("newScenarioName")) el("newScenarioName").value = "";
  });
  el("confirmSaveScenario")?.addEventListener("click", () => {
    const nameInput = el("newScenarioName");
    const name = (nameInput?.value || "").trim();
    if (!name) { nameInput?.focus(); return; }
    const scenarios = state.savedScenarios || [];
    if (scenarios.length >= 5) {
      alert("You can save up to 5 named scenarios. Delete one first.");
      return;
    }
    scenarios.push({
      id: Date.now().toString(36),
      name,
      timestamp: new Date().toISOString(),
      scenario: state.scenario,
      scenarioTargetRetirementAge: state.scenarioTargetRetirementAge,
      customIywAccumReturn: state.customIywAccumReturn,
      customQqqmAccumReturn: state.customQqqmAccumReturn,
      customPostRetirementReturn: state.customPostRetirementReturn,
      customK401AccumReturn: state.customK401AccumReturn,
      customK401PostReturn: state.customK401PostReturn,
    });
    state.savedScenarios = scenarios;
    if (nameInput) nameInput.value = "";
    el("saveScenarioForm")?.classList.add("hidden");
    scheduleRender();
  });
  el("savedScenariosList")?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    const scenarios = state.savedScenarios || [];
    if (btn.dataset.action === "loadScenario") {
      const sc = scenarios.find((s) => s.id === id);
      if (!sc) return;
      state.scenario = sc.scenario;
      state.scenarioTargetRetirementAge = sc.scenarioTargetRetirementAge;
      state.customIywAccumReturn = sc.customIywAccumReturn;
      state.customQqqmAccumReturn = sc.customQqqmAccumReturn;
      state.customPostRetirementReturn = sc.customPostRetirementReturn;
      state.customK401AccumReturn = sc.customK401AccumReturn;
      state.customK401PostReturn = sc.customK401PostReturn;
      scheduleRender();
    } else if (btn.dataset.action === "deleteScenario") {
      if (!confirm("Delete this saved scenario?")) return;
      state.savedScenarios = scenarios.filter((s) => s.id !== id);
      scheduleRender();
    }
  });

  /* ===== INITIAL RENDER ===== */
  el("appLoader")?.classList.remove("hidden");
  try {
    state = await loadFromServer();
  } catch {
    state = buildState(null);
  }
  el("appLoader")?.classList.add("hidden");
  render();         // first render: _appReady is false → saveToServer is a no-op
  _appReady = true; // enable saves for all subsequent user interactions
})();
