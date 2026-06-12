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
    annualSalaryGrowthRate: 0,
    employerMatchPct: 3.5,
    targetRetirementAge: 55,
    scenarioTargetRetirementAge: 55,
    annualRetirementSpend: 60000,
    preMedicareHealthcareCost: 0,
    acaHealthcareMode: "manual",
    acaSubsidyRule: "irsSchedule",
    acaBenchmarkAnnualPremium: 12000,
    acaIncomeCapPct: 8.5,
    acaHouseholdSize: 1,
    acaStressMultiplier: 100,
    acaPolicyPreset: "current",
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
    ssEstimateMode: "manual",
    ss62: 0,
    ssFRA: 0,
    ssClaimAge: 62,
    ssStatementFileName: "",
    ssStatementImportedAt: "",
    ssStatementDob: "",
    ssStatementFraYears: 67,
    ssStatementFraMonths: 0,
    ssStatementBenefitMap: {},
    ssStatementEarningsHistory: [],
    scenario: "bull",
    scenarioStrategyFund: "iyw",
    scenarioWithdrawalStrategy: "k401First",
    scenarioOptimizationGoal: "balanced",
    scenarioBrokerageReserveYears: 2,
    scenarioTaxAwareAnnualCap: 30000,
    scenarioTaxFilingStatus: "single",
    scenarioBrokerageGainRate: 60,
    scenarioStateTaxRate: 0,
    customIywAccumReturn: 16.2,
    customQqqmAccumReturn: 13.5,
    customPostRetirementReturn: 5,
    customK401AccumReturn: 7,
    customK401PostReturn: 7,
    monteCarloRuns: 1000,
    monteBrokerageVol: 22,
    monte401kVol: 14,
    monteTargetAge: 95,
    monteTargetSuccess: 85,
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
    "monteTargetAge",
    "monteTargetSuccess",
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
  const SETTINGS_DRAFT_KEYS = [
    "currentDate",
    "dateOfBirth",
    "currentAge",
    "monthlyBrokerageContribution",
    "contributionPct",
    "annualSalary",
    "annualSalaryGrowthRate",
    "employerMatchPct",
    "targetRetirementAge",
    "annualRetirementSpend",
    "preMedicareHealthcareCost",
    "acaHealthcareMode",
    "acaSubsidyRule",
    "acaBenchmarkAnnualPremium",
    "acaIncomeCapPct",
    "acaHouseholdSize",
    "acaStressMultiplier",
    "acaPolicyPreset",
    "unlockAge",
    "chartEndAge",
    "postRetirementReturn",
    "k401AccumReturn",
    "k401PostReturn",
    "ssEstimateMode",
    "ss62",
    "ssFRA",
    "ssClaimAge",
    "ssStatementFileName",
    "iywAccumReturn",
    "customIywAccumReturn",
    "customQqqmAccumReturn",
    "customPostRetirementReturn",
    "customK401AccumReturn",
    "customK401PostReturn",
    "inflationAdjusted",
    "inflationRate",
  ];

  /* ===== DOM HELPERS ===== */
  const el = (id) => document.getElementById(id);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const ui = {
    appLoader: el("appLoader"),
    appLoaderText: el("appLoaderText"),
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
    trackConstraintCards: el("trackConstraintCards"),
    trackActionSummary: el("trackActionSummary"),
    trackActionCards: el("trackActionCards"),
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
    annualSalaryGrowthRate: el("annualSalaryGrowthRate"),
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
    preMedicareHealthcareCost: el("preMedicareHealthcareCost"),
    acaHealthcareMode: el("acaHealthcareMode"),
    acaSubsidyRule: el("acaSubsidyRule"),
    acaBenchmarkAnnualPremium: el("acaBenchmarkAnnualPremium"),
    acaIncomeCapPct: el("acaIncomeCapPct"),
    acaHouseholdSize: el("acaHouseholdSize"),
    acaStressMultiplier: el("acaStressMultiplier"),
    acaPolicyPreset: el("acaPolicyPreset"),
    acaManualField: el("acaManualField"),
    acaBenchmarkField: el("acaBenchmarkField"),
    acaSubsidyRuleField: el("acaSubsidyRuleField"),
    acaIncomeCapField: el("acaIncomeCapField"),
    acaHouseholdField: el("acaHouseholdField"),
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
    ssEstimateMode: el("ssEstimateMode"),
    ssManualFields: el("ssManualFields"),
    ssXmlImportBtn: el("ssXmlImportBtn"),
    ssXmlFile: el("ssXmlFile"),
    clearSsXml: el("clearSsXml"),
    ssStatementSummary: el("ssStatementSummary"),
    scenarioStrategyFund: el("scenarioStrategyFund"),
    scenarioWithdrawalStrategy: el("scenarioWithdrawalStrategy"),
    scenarioOptimizationGoal: el("scenarioOptimizationGoal"),
    scenarioBrokerageReserveYears: el("scenarioBrokerageReserveYears"),
    scenarioTaxAwareAnnualCap: el("scenarioTaxAwareAnnualCap"),
    scenarioTaxFilingStatus: el("scenarioTaxFilingStatus"),
    scenarioBrokerageGainRate: el("scenarioBrokerageGainRate"),
    scenarioStateTaxRate: el("scenarioStateTaxRate"),
    scenarioReserveField: el("scenarioReserveField"),
    scenarioTaxCapField: el("scenarioTaxCapField"),
    scenarioTaxStatusField: el("scenarioTaxStatusField"),
    scenarioTaxGainField: el("scenarioTaxGainField"),
    scenarioStateTaxField: el("scenarioStateTaxField"),
    strategyControlNote: el("strategyControlNote"),
    strategySummary: el("strategySummary"),
    strategyDriverCards: el("strategyDriverCards"),
    strategyCards: el("strategyCards"),
    strategyAuditSummary: el("strategyAuditSummary"),
    strategyAuditRows: el("strategyAuditRows"),
    strategyTaxSummary: el("strategyTaxSummary"),
    strategyTaxSnapshot: el("strategyTaxSnapshot"),
    strategyTaxRows: el("strategyTaxRows"),
    savingsStrategySummary: el("savingsStrategySummary"),
    savingsStrategyCards: el("savingsStrategyCards"),
    scenarioActionSummary: el("scenarioActionSummary"),
    scenarioActionCards: el("scenarioActionCards"),
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
    monteTargetAge: el("monteTargetAge"),
    monteTargetSuccess: el("monteTargetSuccess"),
    whatIfOverlay: el("whatIfOverlay"),
    whatIfRecalcBar: el("whatIfRecalcBar"),
    whatIfRecalcBtn: el("whatIfRecalcBtn"),
    monteCarloSummary: el("monteCarloSummary"),
    monteCarloCards: el("monteCarloCards"),
    monteActionSummary: el("monteActionSummary"),
    monteActionCards: el("monteActionCards"),
    confidenceSummary: el("confidenceSummary"),
    confidenceCards: el("confidenceCards"),
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
    applySettingsBtn: el("applySettingsBtn"),
    discardSettingsBtn: el("discardSettingsBtn"),
    settingsDraftBar: el("settingsDraftBar"),
    settingsDraftStatus: el("settingsDraftStatus"),
    settingsApplyLoading: el("settingsApplyLoading"),
    settingsDraftBadge: el("settingsDraftBadge"),
    resetDefaultsBtn: el("resetDefaultsBtn"),
    drawerBackdrop: el("drawerBackdrop"),
    settingsDrawer: el("settingsDrawer"),
  };

  /* ===== STATE ===== */
  // _appReady prevents the initial render from saving defaults back to disk
  // before the user has had a chance to migrate their data.
  let _appReady = false;
  // Monte Carlo quick-mode: during rapid user input, use fewer runs so the UI stays
  // responsive. After 1.5 s of idle, the cache is invalidated and a full-quality
  // render is scheduled automatically.
  let _mcIsQuick = false,
    _mcQuickTimer = null,
    _mcDeferralTimer = null,
    // True when What If inputs have changed but the user hasn't clicked Recalculate yet.
    _whatIfDirty = false;
  let _mcRunId = 0;  // incremented each time a new MC computation starts; used to abort stale async runs
  let state = buildState(null),
    actualBrokerageReviewChart,
    actual401kReviewChart,
    bChart,
    kChart,
    mixChart,
    monteChart,
    monteCacheKey = null,
    monteCacheValue = null,
    monteTargetCache = new Map(),
    editingHistoryId = null,
    editingAssumptionId = null,
    assumptionModalSeedContributionPct = null,
    assumptionModalSeedMatchPct = null,
    pendingSaveTimer = null,
    pendingRenderTimer = null,
    drawerPointerDownOnBackdrop = false,
    settingsDraftSnapshot = null,
    settingsDraftDirty = false,
    settingsApplying = false;

  /* ===== TAB NAVIGATION ===== */
  // Internal tab keys stay "track"/"whatif" for compatibility; the visible
  // labels and URL hashes use the view names (Today/Explore/History/Data).
  const TAB_HASHES = { track: "today", whatif: "explore", history: "history", data: "data" };
  function tabKeyFromHash(hash) {
    const clean = String(hash || "").replace(/^#/, "");
    return Object.keys(TAB_HASHES).find((key) => TAB_HASHES[key] === clean) || null;
  }
  async function activateTab(tab, { updateHash = true } = {}) {
    $$(".tabBtn").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    $$(".tabContent").forEach((c) => c.classList.toggle("active", c.dataset.tab === tab));
    if (updateHash && TAB_HASHES[tab]) {
      try {
        window.history.replaceState(null, "", `#${TAB_HASHES[tab]}`);
      } catch (err) {
        /* sandboxed contexts may block history access */
      }
    }
    // For the Explore tab, show overlay before the (potentially slow) render.
    if (tab === "whatif" && ui.whatIfOverlay) {
      ui.whatIfOverlay.classList.remove("hidden");
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      );
      // renderMonteCarlo (async) hides the overlay when done — don't hide here.
      render();
    } else {
      scheduleRender(0);
    }
  }
  $$(".tabBtn").forEach((btn) =>
    btn.addEventListener("click", () => activateTab(btn.dataset.tab)),
  );
  // Deep-link: #today / #explore / #history / #data
  {
    const initialTab = tabKeyFromHash(window.location.hash);
    if (initialTab && initialTab !== "track") {
      $$(".tabBtn").forEach((b) => b.classList.toggle("active", b.dataset.tab === initialTab));
      $$(".tabContent").forEach((c) => c.classList.toggle("active", c.dataset.tab === initialTab));
    }
  }
  window.addEventListener("hashchange", () => {
    const tab = tabKeyFromHash(window.location.hash);
    if (tab && tab !== activeTab()) activateTab(tab, { updateHash: false });
  });

  /* ===== SETTINGS DRAWER ===== */
  function isSettingsDrawerOpen() {
    return ui.drawerBackdrop?.classList.contains("open");
  }
  function clonePlannerState(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function setAppBusy(active, message = "Loading your plan…") {
    if (!ui.appLoader) return;
    if (ui.appLoaderText) ui.appLoaderText.textContent = message;
    ui.appLoader.classList.toggle("overlay", !!active);
    ui.appLoader.classList.toggle("hidden", !active);
  }
  function settingsDraftValueChanged(prevValue, nextValue) {
    const prevType = typeof prevValue,
      nextType = typeof nextValue;
    if (prevType === "number" || nextType === "number") {
      return n(prevValue, 0) !== n(nextValue, 0);
    }
    if (prevType === "boolean" || nextType === "boolean") {
      return !!prevValue !== !!nextValue;
    }
    return String(prevValue ?? "") !== String(nextValue ?? "");
  }
  function settingsDraftChangeCount() {
    if (!settingsDraftSnapshot) return 0;
    return SETTINGS_DRAFT_KEYS.reduce(
      (count, key) =>
        count +
        (settingsDraftValueChanged(settingsDraftSnapshot?.[key], state?.[key])
          ? 1
          : 0),
      0,
    );
  }
  function updateSettingsDraftUi() {
    const changeCount = settingsDraftChangeCount(),
      showDraftUi = settingsDraftDirty || settingsApplying;
    if (ui.applySettingsBtn) {
      ui.applySettingsBtn.disabled = !settingsDraftDirty || settingsApplying;
      ui.applySettingsBtn.textContent = settingsApplying
        ? "Applying…"
        : "Apply Settings";
    }
    if (ui.discardSettingsBtn)
      ui.discardSettingsBtn.disabled = !settingsDraftDirty || settingsApplying;
    if (ui.settingsDraftStatus)
      ui.settingsDraftStatus.textContent = settingsApplying
        ? "Applying your plan-setting changes now."
        : settingsDraftDirty
          ? `${changeCount || 1} unapplied setting${changeCount === 1 ? "" : "s"} ready to apply.`
        : "Changes stay in the drawer until you click Apply settings.";
    if (ui.settingsApplyLoading)
      ui.settingsApplyLoading.classList.toggle("hidden", !settingsApplying);
    if (ui.settingsDraftBar) {
      ui.settingsDraftBar.classList.toggle("hidden", !showDraftUi);
      ui.settingsDraftBar.classList.toggle("isDirty", settingsDraftDirty);
    }
    if (ui.settingsDraftBadge) {
      ui.settingsDraftBadge.classList.toggle(
        "hidden",
        !(settingsDraftDirty && !settingsApplying),
      );
      ui.settingsDraftBadge.textContent = settingsDraftDirty
        ? `${Math.max(1, changeCount)} Draft`
        : "Draft";
    }
  }
  function markSettingsDraftDirty() {
    if (!isSettingsDrawerOpen() || settingsApplying) return;
    settingsDraftDirty = true;
    updateSettingsDraftUi();
  }
  function restoreSettingsDraftSnapshot() {
    if (!settingsDraftSnapshot) return;
    state = buildState(clonePlannerState(settingsDraftSnapshot));
    fillInputs();
    updateAcaHealthcareModeUi(state);
    updateStrategyControlState(state);
    renderSsSettingsPanel();
    refreshMain401DerivedDisplays();
  }
  function settingsAffectAssumptionHistory(previousState, nextState) {
    return [
      "monthlyBrokerageContribution",
      "annualSalary",
      "contributionPct",
      "employerMatchPct",
    ].some((key) => n(previousState?.[key], 0) !== n(nextState?.[key], 0));
  }
  function closeSettingsDrawer(options = {}) {
    const { apply = false, force = false } = options;
    if (!force && settingsApplying) return;
    if (!apply && settingsDraftDirty && !force) {
      const discard = confirm("Discard unapplied plan setting changes?");
      if (!discard) return;
    }
    if (!apply && settingsDraftDirty) {
      restoreSettingsDraftSnapshot();
    }
    ui.drawerBackdrop?.classList.remove("open");
    settingsDraftSnapshot = null;
    settingsDraftDirty = false;
    settingsApplying = false;
    updateSettingsDraftUi();
  }
  async function applySettingsDraft() {
    if (settingsApplying) return;
    const priorState = settingsDraftSnapshot
      ? buildState(clonePlannerState(settingsDraftSnapshot))
      : buildState(clonePlannerState(state));
    persistVisibleState();
    if (settingsAffectAssumptionHistory(priorState, state)) {
      upsertAssumptionHistory();
    }
    settingsApplying = true;
    settingsDraftDirty = false;
    updateSettingsDraftUi();
    setAppBusy(true, "Applying settings and recalculating your plan…");
    setTimeout(() => {
      try {
        render();
        settingsDraftSnapshot = clonePlannerState(state);
        closeSettingsDrawer({ apply: true, force: true });
      } finally {
        setAppBusy(false);
      }
    }, 30);
  }
  function openSettingsDrawer() {
    settingsDraftSnapshot = clonePlannerState(state);
    settingsDraftDirty = false;
    settingsApplying = false;
    fillInputs();
    updateAcaHealthcareModeUi(state);
    updateStrategyControlState(state);
    renderSsSettingsPanel();
    refreshMain401DerivedDisplays();
    updateSettingsDraftUi();
    ui.drawerBackdrop.classList.add("open");
  }
  el("openSettings")?.addEventListener("click", () => {
    openSettingsDrawer();
  });
  el("closeSettings")?.addEventListener("click", () => {
    closeSettingsDrawer();
  });
  ui.applySettingsBtn?.addEventListener("click", applySettingsDraft);
  ui.discardSettingsBtn?.addEventListener("click", () => {
    closeSettingsDrawer({ apply: false, force: true });
  });
  ui.settingsDrawer?.addEventListener("pointerdown", () => {
    drawerPointerDownOnBackdrop = false;
  });
  ui.drawerBackdrop?.addEventListener("pointerdown", (e) => {
    drawerPointerDownOnBackdrop = e.target === ui.drawerBackdrop;
  });
  ui.drawerBackdrop?.addEventListener("click", (e) => {
    if (e.target === ui.drawerBackdrop && drawerPointerDownOnBackdrop) {
      closeSettingsDrawer();
    }
    drawerPointerDownOnBackdrop = false;
  });
  updateSettingsDraftUi();

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
  function maybeString(v, fallback = "") {
    return typeof v === "string" ? v : fallback;
  }
  function normalizeSsEstimateMode(v) {
    return v === "statementXml" ? "statementXml" : "manual";
  }
  function hasStatementBenefits(s) {
    const map = s?.ssStatementBenefitMap;
    return !!(map && typeof map === "object" && Object.keys(map).length);
  }
  function xmlNodeName(node) {
    return String(node?.localName || node?.nodeName || "").toLowerCase();
  }
  function xmlChild(node, wantedName) {
    const name = String(wantedName || "").toLowerCase();
    return Array.from(node?.children || []).find(
      (child) => xmlNodeName(child) === name,
    ) || null;
  }
  function xmlNestedText(node, path) {
    let cur = node;
    for (const name of path) {
      cur = xmlChild(cur, name);
      if (!cur) return "";
    }
    return String(cur.textContent || "").trim();
  }
  function xmlFindAll(node, predicate, acc = []) {
    if (!node) return acc;
    if (predicate(node)) acc.push(node);
    Array.from(node.children || []).forEach((child) =>
      xmlFindAll(child, predicate, acc),
    );
    return acc;
  }
  function xmlAttr(node, name) {
    return String(node?.getAttribute?.(name) || "").trim();
  }
  function moneyTextToNumber(v) {
    return n(
      String(v || "")
        .replace(/[$,\s]/g, "")
        .replace(/[()]/g, "")
        .trim(),
      0,
    );
  }
  function parseSsStatementXml(xmlText, fileName = "") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, "application/xml");
    if (doc.querySelector("parsererror")) {
      throw new Error("Could not parse SSA XML file.");
    }
    const benefitMap = {},
      retirementNodes = xmlFindAll(
        doc.documentElement,
        (node) => /retirementestimate$/.test(xmlNodeName(node)),
      );
    let fraYears = null,
      fraMonths = 0;
    retirementNodes.forEach((node) => {
      const tagName = xmlNodeName(node),
        yearsText =
          xmlNestedText(node, ["retirementage", "years"]) ||
          xmlNestedText(node, ["years"]),
        monthsText =
          xmlNestedText(node, ["retirementage", "months"]) ||
          xmlNestedText(node, ["months"]),
        estimateText =
          xmlNestedText(node, ["estimate"]) ||
          xmlNestedText(node, ["monthlybenefit"]) ||
          xmlNestedText(node, ["benefitamount"]),
        parsedYears = maybeNumber(yearsText),
        parsedMonths = maybeNumber(monthsText) || 0,
        ageFromName = maybeNumber((tagName.match(/age(\d+)/) || [])[1]),
        claimAge =
          parsedYears != null
            ? parsedYears + parsedMonths / 12
            : ageFromName != null
              ? ageFromName
              : null,
        estimate = moneyTextToNumber(estimateText);
      if (estimate > 0 && claimAge != null) {
        benefitMap[String(Math.round(claimAge))] = estimate;
      }
      if (tagName.includes("full")) {
        if (parsedYears != null) {
          fraYears = parsedYears;
          fraMonths = parsedMonths;
        }
      }
    });
    const earningsNodes = xmlFindAll(
      doc.documentElement,
      (node) => xmlNodeName(node) === "earnings",
    );
    const earningsByYear = new Map();
    earningsNodes.forEach((node) => {
      const year =
          maybeNumber(xmlAttr(node, "endYear")) ??
          maybeNumber(xmlAttr(node, "startYear")) ??
          maybeNumber(xmlNestedText(node, ["taxyear"])) ??
          maybeNumber(xmlNestedText(node, ["year"])) ??
          maybeNumber(xmlNestedText(node, ["endyear"])) ??
          maybeNumber(xmlNestedText(node, ["startyear"])),
        amount =
          moneyTextToNumber(xmlNestedText(node, ["ficaearnings"])) ||
          moneyTextToNumber(
            xmlNestedText(node, ["taxedsocialsecurityearnings"]),
          ) ||
          moneyTextToNumber(xmlNestedText(node, ["socialsecurityearnings"])) ||
          moneyTextToNumber(xmlNestedText(node, ["oasdiearnings"])) ||
          moneyTextToNumber(xmlNestedText(node, ["medicareearnings"]));
      if (year != null) {
        earningsByYear.set(
          String(Math.round(year)),
          amount < 0 ? 0 : amount,
        );
      }
    });
    const earningsHistory = Array.from(earningsByYear.entries())
      .map(([year, amount]) => ({
        year: Number(year),
        amount: n(amount, 0),
      }))
      .sort((a, b) => a.year - b.year);
    const statementDob =
      xmlNestedText(doc.documentElement, ["userinfo", "dateofbirth"]) ||
      xmlNestedText(doc.documentElement, ["userinformation", "dateofbirth"]) ||
      xmlNestedText(doc.documentElement, ["dateofbirth"]);
    if (!Object.keys(benefitMap).length) {
      throw new Error("No retirement benefit estimates were found in the SSA XML file.");
    }
    return {
      fileName: maybeString(fileName),
      importedAt: new Date().toISOString(),
      statementDob: /^\d{4}-\d{2}-\d{2}$/.test(statementDob) ? statementDob : "",
      fraYears: fraYears ?? 67,
      fraMonths,
      benefitMap,
      earningsHistory,
    };
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
  // Conversational age — whole ages drop the ".0" ("52", "59.5").
  function ageLabel(v) {
    if (!isFinite(v)) return "Not viable";
    return Number(v) % 1 === 0 ? num(v, 0) : num(v, 1);
  }
  // Approximate money for projections — dollar-exact figures imply false
  // precision on decade-out estimates ("$3.03M", "$927k").
  function moneyApprox(v) {
    const abs = Math.abs(n(v, 0)),
      sign = n(v, 0) < 0 ? "-" : "";
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(abs >= 1e7 ? 1 : 2)}M`;
    if (abs >= 1e4) return `${sign}$${Math.round(abs / 1000)}k`;
    return money(v);
  }
  // Chart colors come from the active theme's tokens so light/dark stay in sync.
  function chartColor(varName) {
    return (
      getComputedStyle(document.documentElement).getPropertyValue(varName).trim() ||
      "#888"
    );
  }
  function chartColorA(varName, alpha) {
    const hex = chartColor(varName).replace("#", "");
    if (hex.length !== 6) return chartColor(varName);
    const r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
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
      s.ssEstimateMode = normalizeSsEstimateMode(x.ssEstimateMode);
      s.acaPolicyPreset = acaPolicyPresets().some(
        (entry) => entry.key === x.acaPolicyPreset,
      )
        ? x.acaPolicyPreset
        : inferAcaPolicyPreset(s.acaStressMultiplier);
      s.acaHealthcareMode =
        x.acaHealthcareMode === "incomeSensitive" ? "incomeSensitive" : "manual";
      s.acaSubsidyRule =
        x.acaSubsidyRule === "customCap" ? "customCap" : "irsSchedule";
      s.ssStatementFileName = maybeString(x.ssStatementFileName);
      s.ssStatementImportedAt = maybeString(x.ssStatementImportedAt);
      s.ssStatementDob = maybeString(x.ssStatementDob);
      s.ssStatementFraYears = n(x.ssStatementFraYears, base.ssStatementFraYears);
      s.ssStatementFraMonths = n(
        x.ssStatementFraMonths,
        base.ssStatementFraMonths,
      );
      s.ssStatementBenefitMap =
        x.ssStatementBenefitMap && typeof x.ssStatementBenefitMap === "object"
          ? Object.fromEntries(
              Object.entries(x.ssStatementBenefitMap).map(([k, v]) => [
                String(k),
                n(v, 0),
              ]),
            )
          : {};
      s.ssStatementEarningsHistory = Array.isArray(x.ssStatementEarningsHistory)
        ? x.ssStatementEarningsHistory
            .map((row) => ({
              year: Math.round(n(row?.year, 0)),
              amount: n(row?.amount, 0),
            }))
            .filter((row) => row.year > 0)
            .sort((a, b) => a.year - b.year)
        : [];
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
        // First run: open Plan Settings so the user can start entering their
        // numbers instead of staring at placeholder zeros.
        setTimeout(() => {
          if (!isSettingsDrawerOpen()) openSettingsDrawer();
        }, 400);
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

  function stateForPersistence() {
    if (isSettingsDrawerOpen() && settingsDraftDirty && settingsDraftSnapshot) {
      return buildState(clonePlannerState(settingsDraftSnapshot));
    }
    return state;
  }

  function flushSaveToServer(useKeepalive = false) {
    if (!_appReady) return; // never save during initial page load
    clearTimeout(pendingSaveTimer);
    pendingSaveTimer = null;
    const persistState = stateForPersistence();
    persistState.currentAge = computeAge(persistState);
    const payload = JSON.stringify(persistState);
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
    if (isSettingsDrawerOpen() && !settingsApplying) {
      markSettingsDraftDirty();
      return;
    }
    state.currentAge = computeAge(state);
    localStorage.setItem(KEY, JSON.stringify(state));
    clearTimeout(pendingSaveTimer);
    pendingSaveTimer = setTimeout(flushSaveToServer, 180);
  }
  function activeTab() {
    return document.querySelector(".tabBtn.active")?.dataset.tab || "track";
  }
  function scheduleRender(delay = 90) {
    if (isSettingsDrawerOpen() && !settingsApplying) {
      markSettingsDraftDirty();
      return;
    }
    // Explore-tab changes recalculate live: debounce a little harder than the
    // fast Today renders and use Monte Carlo quick mode while the user is
    // actively adjusting, then the deferred full-quality MC pass catches up.
    if (_appReady && delay > 0 && activeTab() === "whatif") {
      enterMcQuickMode();
      clearTimeout(pendingRenderTimer);
      pendingRenderTimer = setTimeout(() => {
        pendingRenderTimer = null;
        render();
      }, Math.max(delay, 300));
      return;
    }
    clearTimeout(pendingRenderTimer);
    pendingRenderTimer = setTimeout(() => {
      pendingRenderTimer = null;
      render();
    }, delay);
  }

  // Quick mode is no longer used for auto-renders (the Apply gate stops What If
  // renders entirely until the user clicks Recalculate). Keep the function for
  // explicit calls but remove the background re-render timer.
  function enterMcQuickMode() {
    _mcIsQuick = true;
    clearTimeout(_mcQuickTimer);
    _mcQuickTimer = setTimeout(() => {
      _mcIsQuick = false;
      _mcQuickTimer = null;
      // Invalidate quick-mode cached results so next Recalculate uses full runs.
      monteCacheKey = null;
      monteTargetCache.clear();
    }, 1500);
  }

  // Show the "Settings changed — Recalculate" bar on the What If tab.
  function markWhatIfDirty() {
    _whatIfDirty = true;
    ui.whatIfRecalcBar?.classList.remove("hidden");
  }
  // Hide the bar and clear the flag (called before a user-requested render).
  function clearWhatIfDirty() {
    _whatIfDirty = false;
    ui.whatIfRecalcBar?.classList.add("hidden");
  }

  /* ===== FINANCIAL MATH ===== */
  function mRate(a) {
    return Math.pow(1 + a / 100, 1 / 12) - 1;
  }
  function policyConfig() {
    return (
      window.RetirementPolicyConfig || {
        socialSecurity: {
          fraToAge70Multiplier: 1.24,
        },
        aca: {
          fpl2026: {
            householdOne: 15960,
            eachAdditionalPerson: 5680,
          },
          policyPresets: [
            { key: "current", label: "Current policy", multiplier: 100 },
            { key: "reduced", label: "Reduced subsidies", multiplier: 150 },
            { key: "severe", label: "Severe stress", multiplier: 200 },
            { key: "custom", label: "Custom", multiplier: null },
          ],
          applicableFigureBrackets: [
            { maxFplPct: 150, startRate: 0, endRate: 0 },
            { maxFplPct: 200, startRate: 0, endRate: 0.02 },
            { maxFplPct: 250, startRate: 0.02, endRate: 0.04 },
            { maxFplPct: 300, startRate: 0.04, endRate: 0.06 },
            { maxFplPct: 400, startRate: 0.06, endRate: 0.085 },
            { maxFplPct: Infinity, startRate: 0.085, endRate: 0.085 },
          ],
        },
      }
    );
  }
  function realRate(nominal) {
    if (!state.inflationAdjusted) return nominal;
    const inf = Math.max(0, n(state.inflationRate, 2.5));
    return ((1 + nominal / 100) / (1 + inf / 100) - 1) * 100;
  }
  function ssProjectedAnnualCoveredEarnings(s) {
    const fromSalary = n(s.annualSalary, 0);
    if (fromSalary > 0) return fromSalary;
    const rows = [...(s.ssStatementEarningsHistory || [])]
      .filter((row) => n(row.amount, 0) > 0)
      .sort((a, b) => b.year - a.year);
    return rows.length ? n(rows[0].amount, 0) : 0;
  }
  function ssProjectedEntriesUntilAge(s, workUntilAge) {
    const currentAge = computeAge(s),
      months = Math.max(
        0,
        Math.ceil((Math.max(currentAge, n(workUntilAge, currentAge)) - currentAge) * 12 - 1e-9),
      ),
      annual = ssProjectedAnnualCoveredEarnings(s),
      growthRate = Math.max(0, n(s.annualSalaryGrowthRate, 0)),
      fullYears = Math.floor(months / 12),
      remainderMonths = months % 12,
      entries = Array.from({ length: fullYears }, (_, yearIndex) =>
        annual * Math.pow(1 + growthRate / 100, yearIndex),
      );
    if (remainderMonths > 0) {
      entries.push(
        (annual * Math.pow(1 + growthRate / 100, fullYears) * remainderMonths) /
          12,
      );
    }
    return entries;
  }
  function ssTop35EarningsSum(historyAmounts, projectedAmounts) {
    const values = [...historyAmounts, ...projectedAmounts]
      .map((value) => Math.max(0, n(value, 0)))
      .sort((a, b) => b - a)
      .slice(0, 35);
    return values.reduce((sum, value) => sum + value, 0);
  }
  function statementBenefitForClaimAge(s, claimAge = n(s.ssClaimAge, 62)) {
    if (!hasStatementBenefits(s)) return null;
    const roundedClaimAge = String(Math.round(n(claimAge, 62))),
      baseEstimate = maybeNumber(s.ssStatementBenefitMap?.[roundedClaimAge]);
    if (baseEstimate == null) return null;
    const stopWorkAge = Math.max(
        computeAge(s),
        n(s.targetRetirementAge, computeAge(s)),
      ),
      historyAmounts = (s.ssStatementEarningsHistory || []).map((row) =>
        n(row.amount, 0),
      ),
      statementTop35 = ssTop35EarningsSum(
        historyAmounts,
        ssProjectedEntriesUntilAge(s, claimAge),
      ),
      stopWorkTop35 = ssTop35EarningsSum(
        historyAmounts,
        ssProjectedEntriesUntilAge(
          s,
          Math.min(stopWorkAge, n(claimAge, 62)),
        ),
      ),
      ratio =
        statementTop35 > 0
          ? Math.max(0, Math.min(1, stopWorkTop35 / statementTop35))
          : 1;
    return baseEstimate * ratio;
  }
  function ssStatementDataQuality(s) {
    if (normalizeSsEstimateMode(s.ssEstimateMode) !== "statementXml") return null;
    if (!hasStatementBenefits(s)) {
      return {
        level: "warn",
        text: "Statement XML mode is selected, but no retirement benefit estimates are loaded yet. The planner will fall back to manual Social Security values.",
      };
    }
    const earningsCount = (s.ssStatementEarningsHistory || []).length;
    if (!earningsCount) {
      return {
        level: "warn",
        text: "The imported SSA statement did not yield any yearly earnings rows. Early-retirement Social Security reductions will be overstated until earnings history is imported correctly.",
      };
    }
    if (earningsCount < 10) {
      return {
        level: "warn",
        text: `Only ${earningsCount} yearly earnings rows were imported from the SSA statement. Review the XML import because low earnings-history coverage can distort the stop-work adjustment.`,
      };
    }
    return {
      level: "ok",
      text: `${earningsCount} yearly earnings rows were imported from the SSA statement and are being used in the stop-work adjustment.`,
    };
  }
  function ssEstimateSourceLabel(s) {
    return normalizeSsEstimateMode(s.ssEstimateMode) === "statementXml" &&
      hasStatementBenefits(s)
      ? "statement-based stop-work estimate"
      : "manual input";
  }
  function ssMonthly(s) {
    const mode = normalizeSsEstimateMode(s.ssEstimateMode);
    if (mode === "statementXml") {
      const statementEstimate = statementBenefitForClaimAge(
        s,
        n(s.ssClaimAge, 62),
      );
      if (statementEstimate != null) return statementEstimate;
    }
    return s.ssClaimAge <= 62
      ? n(s.ss62)
      : s.ssClaimAge >= 70
        ? n(s.ssFRA) * n(policyConfig().socialSecurity.fraToAge70Multiplier, 1.24)
        : n(s.ssFRA);
  }
  function annualHealthcareCostAtAge(s, agePoint, context = {}) {
    if (n(agePoint, 0) >= 65) return 0;
    if ((s.acaHealthcareMode || "manual") === "incomeSensitive") {
      const benchmark = Math.max(
          0,
          n(s.acaBenchmarkAnnualPremium, n(s.preMedicareHealthcareCost, 0)),
        ) * (Math.max(0, n(s.acaStressMultiplier, 100)) / 100),
        contribution = acaContributionRateAtAge(s, agePoint, context),
        incomeProxy = contribution.incomeInfo.proxyIncome,
        expectedContribution = incomeProxy * contribution.rate;
      return Math.min(benchmark, expectedContribution);
    }
    return (
      Math.max(0, n(s.preMedicareHealthcareCost, 0)) *
      Math.max(0, n(s.acaStressMultiplier, 100)) /
      100
    );
  }
  function annualRetirementNeedAtAge(s, agePoint, context = {}) {
    return (
      Math.max(0, n(s.annualRetirementSpend, 0)) +
      annualHealthcareCostAtAge(s, agePoint, context)
    );
  }
  function monthlyRetirementNeedAtAge(s, agePoint, context = {}) {
    return annualRetirementNeedAtAge(s, agePoint, context) / 12;
  }
  function federalPovertyLevel(householdSize) {
    const size = Math.max(1, Math.round(n(householdSize, 1))),
      fpl = policyConfig().aca.fpl2026 || {},
      baseOne = n(fpl.householdOne, 15960),
      additional = n(fpl.eachAdditionalPerson, 5680);
    return baseOne + Math.max(0, size - 1) * additional;
  }
  function acaIncomeProxyAtAge(s, agePoint, context = {}) {
    const
      retirementAge = Math.max(computeAge(s), n(s.targetRetirementAge)),
      annualWages =
        context.annualWages != null
          ? Math.max(0, n(context.annualWages, 0))
          : n(agePoint, 0) < retirementAge
            ? Math.max(0, n(s.annualSalary, 0))
            : 0,
      annualOrdinaryIncome = Math.max(0, n(context.annualOrdinaryIncome, 0)),
      annualCapitalGains = Math.max(0, n(context.annualCapitalGains, 0)),
      annualSSIncome =
        context.annualSSIncome != null
          ? Math.max(0, n(context.annualSSIncome, 0))
          : n(agePoint, 0) >= n(s.ssClaimAge, 62)
            ? ssMonthly(s) * 12
            : 0,
      spendProxy =
        annualWages +
        annualOrdinaryIncome +
        annualCapitalGains +
        annualSSIncome,
      fpl = federalPovertyLevel(n(s.acaHouseholdSize, 1));
    return {
      proxyIncome: Math.max(spendProxy, fpl),
      rawIncome: spendProxy,
      fpl,
    };
  }
  function acaPolicyPresets() {
    return [...(policyConfig().aca.policyPresets || [])];
  }
  function inferAcaPolicyPreset(multiplier) {
    const value = Math.round(n(multiplier, 100) * 10) / 10;
    if (Math.abs(value - 100) < 0.05) return "current";
    if (Math.abs(value - 150) < 0.05) return "reduced";
    if (Math.abs(value - 200) < 0.05) return "severe";
    return "custom";
  }
  function applyAcaPolicyPreset(presetKey, currentMultiplier) {
    const preset = acaPolicyPresets().find((entry) => entry.key === presetKey);
    if (!preset) return Math.max(0, n(currentMultiplier, 100));
    return preset.multiplier == null
      ? Math.max(0, n(currentMultiplier, 100))
      : preset.multiplier;
  }
  function acaPolicyPresetLabel(presetKey) {
    return (
      acaPolicyPresets().find((entry) => entry.key === presetKey)?.label ||
      "Custom"
    );
  }
  function acaSubsidyRuleLabel(ruleKey) {
    return ruleKey === "customCap"
      ? "Custom cap %"
      : "IRS premium tax credit schedule";
  }
  function acaApplicablePctForFplRatio(fplRatioPct) {
    const fplPct = Math.max(0, n(fplRatioPct, 0)),
      brackets = policyConfig().aca.applicableFigureBrackets || [];
    let priorMax = 0;
    for (const bracket of brackets) {
      const max = n(bracket?.maxFplPct, Infinity),
        startRate = Math.max(0, n(bracket?.startRate, 0)),
        endRate = Math.max(0, n(bracket?.endRate, startRate));
      if (fplPct <= max) {
        if (!(max > priorMax) || Math.abs(endRate - startRate) < 1e-9) {
          return endRate;
        }
        const progress = Math.max(
          0,
          Math.min(1, (fplPct - priorMax) / (max - priorMax)),
        );
        return startRate + (endRate - startRate) * progress;
      }
      priorMax = max;
    }
    return 0.085;
  }
  function acaContributionRateAtAge(s, agePoint, context = {}) {
    const incomeInfo = acaIncomeProxyAtAge(s, agePoint, context);
    if ((s.acaSubsidyRule || "irsSchedule") === "customCap") {
      return {
        rate:
          (Math.max(0, n(s.acaIncomeCapPct, 8.5)) / 100) *
          (Math.max(0, n(s.acaStressMultiplier, 100)) / 100),
        source: "customCap",
        incomeInfo,
      };
    }
    return {
      rate: acaApplicablePctForFplRatio(
        (incomeInfo.proxyIncome / Math.max(1, incomeInfo.fpl)) * 100,
      ),
      source: "irsSchedule",
      incomeInfo,
    };
  }
  function brokerageGainRateProxy(s) {
    return Math.max(0, Math.min(1, n(s.scenarioBrokerageGainRate, 60) / 100));
  }
  function startingBrokerageBasis(balance, stateLike) {
    const safeBalance = Math.max(0, n(balance, 0)),
      embeddedGainRate = brokerageGainRateProxy(stateLike);
    return Math.max(0, safeBalance * (1 - embeddedGainRate));
  }
  function brokerageGainRatio(balance, basis, fallbackRate) {
    const safeBalance = Math.max(0, n(balance, 0)),
      safeBasis = Math.max(0, Math.min(safeBalance, n(basis, 0))),
      fallback = Math.max(0, Math.min(1, n(fallbackRate, 0)));
    if (!(safeBalance > 0.01)) return fallback;
    return Math.max(0, Math.min(1, (safeBalance - safeBasis) / safeBalance));
  }
  function withdrawBrokerageWithBasis(
    balance,
    basis,
    amount,
    fallbackGainRate = 0,
  ) {
    const safeBalance = Math.max(0, n(balance, 0)),
      withdrawal = Math.min(safeBalance, Math.max(0, n(amount, 0))),
      safeBasis = Math.max(0, Math.min(safeBalance, n(basis, 0))),
      gainRate = brokerageGainRatio(safeBalance, safeBasis, fallbackGainRate),
      taxableGains = withdrawal * gainRate,
      nextBalance = Math.max(0, safeBalance - withdrawal),
      basisPortionWithdrawn = Math.max(0, withdrawal - taxableGains),
      nextBasis = Math.max(
        0,
        Math.min(nextBalance, safeBasis - basisPortionWithdrawn),
      );
    return {
      withdrawal,
      taxableGains,
      nextBalance,
      nextBasis,
      gainRate,
    };
  }
  function acaRetirementIncomeContext(
    stateLike,
    monthlySSIncome,
    ytd401kWithdrawn,
    ytdBrokerageGains,
    monthsCompleted,
    fallbackAnnualNeed = null,
  ) {
    const completed = Math.max(1, n(monthsCompleted, 1)),
      fallbackNeed = Math.max(
        0,
        n(
          fallbackAnnualNeed,
          Math.max(0, n(stateLike.annualRetirementSpend, 0)),
        ),
      );
    return {
      annualOrdinaryIncome:
        ytd401kWithdrawn > 0
          ? (ytd401kWithdrawn / completed) * 12
          : fallbackNeed,
      annualCapitalGains:
        ytdBrokerageGains > 0
          ? (ytdBrokerageGains / completed) * 12
          : fallbackNeed * brokerageGainRateProxy(stateLike),
      annualSSIncome: Math.max(0, n(monthlySSIncome, 0)) * 12,
    };
  }
  function updateAcaHealthcareModeUi(currentState = state) {
    const incomeSensitive = (currentState.acaHealthcareMode || "manual") === "incomeSensitive";
    ui.acaManualField?.classList.toggle("hidden", incomeSensitive);
    ui.acaBenchmarkField?.classList.toggle("hidden", !incomeSensitive);
    ui.acaSubsidyRuleField?.classList.toggle("hidden", !incomeSensitive);
    ui.acaIncomeCapField?.classList.toggle("hidden", !incomeSensitive);
    ui.acaHouseholdField?.classList.toggle("hidden", !incomeSensitive);
    setFieldEnabled(ui.preMedicareHealthcareCost, !incomeSensitive);
    setFieldEnabled(ui.acaBenchmarkAnnualPremium, incomeSensitive);
    setFieldEnabled(ui.acaSubsidyRule, incomeSensitive);
    const customCap = (currentState.acaSubsidyRule || "irsSchedule") === "customCap";
    ui.acaIncomeCapField?.classList.toggle("hidden", !incomeSensitive || !customCap);
    setFieldEnabled(ui.acaIncomeCapPct, incomeSensitive && customCap);
    setFieldEnabled(ui.acaHouseholdSize, incomeSensitive);
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
  function monthsBetweenDates(fromDate, toDate) {
    const from = new Date(`${fromDate}T12:00:00`),
      to = new Date(`${toDate}T12:00:00`);
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
    return Math.max(
      0,
      (to.getFullYear() - from.getFullYear()) * 12 +
        (to.getMonth() - from.getMonth()),
    );
  }
  function grownSalaryForDate(baseSalary, effectiveDate, date, annualGrowthRate) {
    const salary = Math.max(0, n(baseSalary, 0)),
      growthRate = Math.max(0, n(annualGrowthRate, 0));
    if (!(salary > 0) || !(growthRate > 0) || !effectiveDate || !date) {
      return salary;
    }
    const elapsedMonths = monthsBetweenDates(effectiveDate, date);
    if (!(elapsedMonths > 0)) return salary;
    return salary * Math.pow(1 + growthRate / 100, elapsedMonths / 12);
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
          annualSalary: grownSalaryForDate(
            n(entry.annualSalary, s.annualSalary),
            entry.effectiveDate || entry.date || date,
            date,
            s.annualSalaryGrowthRate,
          ),
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
          annualSalary: grownSalaryForDate(
            n(s.annualSalary),
            s.currentDate || today,
            date,
            s.annualSalaryGrowthRate,
          ),
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
  function withdrawalStrategies(stateLike = state) {
    const reserveYears = Math.max(
      0,
      n(stateLike.scenarioBrokerageReserveYears, 2),
    );
    return [
      {
        key: "k401First",
        label: "401k first",
        description: "Preserve brokerage as reserve after unlock and draw 401k first.",
      },
      {
        key: "brokerageFirst",
        label: "Brokerage first",
        description: "Spend brokerage first after unlock and preserve 401k longer.",
      },
      {
        key: "proRata",
        label: "Pro-rata",
        description: "Draw from brokerage and 401k based on their current balances each month.",
      },
      {
        key: "brokerageReserve",
        label: "Brokerage reserve",
        description: `Keep about ${num(reserveYears, reserveYears % 1 === 0 ? 0 : 1)} years of spending in brokerage when possible and draw other assets around that reserve.`,
      },
      {
        key: "taxAware",
        label: "Tax-aware heuristic",
        description: `Try to keep annual 401k withdrawals near ${money(
          n(stateLike.scenarioTaxAwareAnnualCap, 30000),
          0,
        )} before leaning harder on brokerage.`,
      },
      {
        key: "goalAware",
        label: "Adaptive optimizer",
        description: "Re-evaluate the withdrawal style during retirement using your selected optimization goal, taxes, and reserve settings.",
      },
    ];
  }
  function strategyLabel(key, stateLike = state) {
    return (
      withdrawalStrategies(stateLike).find((s) => s.key === key)?.label ||
      "401k first"
    );
  }
  function strategyUsesReserveInputs(strategyKey) {
    return strategyKey === "brokerageReserve" || strategyKey === "goalAware";
  }
  function strategyUsesTaxInputs(strategyKey) {
    return strategyKey === "taxAware" || strategyKey === "goalAware";
  }
  function withdrawalStrategyDisplayLabel(strategyKey, stateLike = state) {
    if (strategyKey === "noneNeeded") return "No draw needed";
    if (strategyKey === "unfunded") return "Unfunded gap";
    if (strategyKey === "bridge") return "Brokerage bridge";
    if (strategyKey === "accumulation") return "Accumulation";
    return strategyLabel(strategyKey, stateLike);
  }
  function summarizeStrategyMix(strategyKeys, stateLike = state) {
    const keys = [...new Set((strategyKeys || []).filter(Boolean))];
    if (!keys.length) return "-";
    const labels = keys.map((key) => withdrawalStrategyDisplayLabel(key, stateLike));
    return labels.length <= 2
      ? labels.join(" / ")
      : `${labels.slice(0, 2).join(" / ")} +${labels.length - 2} more`;
  }
  function summarizeAdaptiveChoices(monthlyBreakdown, stateLike = state) {
    const counts = new Map();
    let activeMonths = 0;
    for (const row of monthlyBreakdown || []) {
      const strategyKey = row?.withdrawalStrategy;
      if (
        !strategyKey ||
        strategyKey === "noneNeeded" ||
        strategyKey === "unfunded" ||
        strategyKey === "bridge" ||
        strategyKey === "accumulation"
      )
        continue;
      if (
        n(row?.brokerageWithdrawal, 0) <= 0 &&
        n(row?.k401Withdrawal, 0) <= 0
      )
        continue;
      activeMonths += 1;
      counts.set(strategyKey, (counts.get(strategyKey) || 0) + 1);
    }
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    return {
      totalMonths: activeMonths,
      dominantKey: ranked[0]?.[0] || "",
      dominantLabel: ranked[0]?.[0]
        ? withdrawalStrategyDisplayLabel(ranked[0][0], stateLike)
        : "",
      mixLabel: ranked.length
        ? ranked
            .map(
              ([key, count]) =>
                `${withdrawalStrategyDisplayLabel(key, stateLike)} (${count})`,
            )
            .join(", ")
        : "No withdrawals required yet",
    };
  }
  function optimizationGoals() {
    return [
      { key: "balanced", label: "Balanced recommendation" },
      { key: "age75", label: "Maximize age-75 balance" },
      { key: "tax", label: "Minimize estimated tax" },
      { key: "brokerage", label: "Preserve brokerage" },
    ];
  }
  function optimizationGoalLabel(key) {
    return (
      optimizationGoals().find((goal) => goal.key === key)?.label ||
      "Balanced recommendation"
    );
  }
  function recommendedStrategyForGoal(evaluations, goalKey) {
    const pool = [...((evaluations || []).filter(Boolean))];
    const candidates = pool.some((entry) => entry.viable)
      ? pool.filter((entry) => entry.viable)
      : pool;
    if (!candidates.length) return null;
    const sorted = candidates.sort((a, b) => {
      if (goalKey === "tax") {
        return (
          a.totalEstimatedTaxTo75 - b.totalEstimatedTaxTo75 ||
          b.age75Balance - a.age75Balance ||
          b.brokerageAt75 - a.brokerageAt75
        );
      }
      if (goalKey === "brokerage") {
        return (
          b.brokerageAt75 - a.brokerageAt75 ||
          b.age75Balance - a.age75Balance ||
          a.totalEstimatedTaxTo75 - b.totalEstimatedTaxTo75
        );
      }
      if (goalKey === "age75") {
        return (
          b.age75Balance - a.age75Balance ||
          a.totalEstimatedTaxTo75 - b.totalEstimatedTaxTo75 ||
          b.brokerageAt75 - a.brokerageAt75
        );
      }
      const scoreA =
          a.age75Balance +
          a.brokerageAt75 * 0.25 -
          a.totalEstimatedTaxTo75 * 0.35 -
          a.totalGap * 25,
        scoreB =
          b.age75Balance +
          b.brokerageAt75 * 0.25 -
          b.totalEstimatedTaxTo75 * 0.35 -
          b.totalGap * 25;
      return (
        scoreB - scoreA ||
        b.age75Balance - a.age75Balance ||
        a.totalEstimatedTaxTo75 - b.totalEstimatedTaxTo75
      );
    });
    return sorted[0];
  }
  function dominantStrategyDriver(selected, recommended) {
    if (!selected || !recommended) return null;
    const candidates = [
      {
        key: "age75",
        score: Math.abs(n(recommended.age75Balance, 0) - n(selected.age75Balance, 0)),
      },
      {
        key: "tax",
        score: Math.abs(
          n(selected.totalEstimatedTaxTo75, 0) -
            n(recommended.totalEstimatedTaxTo75, 0),
        ),
      },
      {
        key: "brokerage",
        score: Math.abs(
          n(recommended.brokerageAt75, 0) - n(selected.brokerageAt75, 0),
        ),
      },
    ].sort((a, b) => b.score - a.score);
    return candidates[0]?.key || null;
  }
  function strategyWhyChangedText(
    stateLike,
    selected,
    recommended,
    baseline,
    optimizationGoal,
  ) {
    if (!selected || !recommended || !baseline) return "";
    const reasons = [];
    if (recommended.key === selected.key) {
      reasons.push(
        `The selected strategy already fits the current goal, ${optimizationGoalLabel(optimizationGoal).toLowerCase()}.`,
      );
    } else {
      const delta75 =
          n(recommended.age75Balance, 0) - n(selected.age75Balance, 0),
        deltaTax =
          n(selected.totalEstimatedTaxTo75, 0) -
          n(recommended.totalEstimatedTaxTo75, 0),
        deltaBrokerage =
          n(recommended.brokerageAt75, 0) - n(selected.brokerageAt75, 0),
        driver = dominantStrategyDriver(selected, recommended);
      if (optimizationGoal === "tax" || driver === "tax") {
        reasons.push(
          `${recommended.label} is coming out ahead mainly because it trims estimated tax by about ${money(deltaTax)} through age 75.`,
        );
      } else if (optimizationGoal === "brokerage" || driver === "brokerage") {
        reasons.push(
          `${recommended.label} is being favored mainly because it preserves about ${money(deltaBrokerage)} more brokerage by age 75.`,
        );
      } else {
        reasons.push(
          `${recommended.label} is being favored mainly because it leaves about ${money(delta75)} more combined balance by age 75.`,
        );
      }
    }
    if (n(stateLike.annualSalaryGrowthRate, 0) > 0) {
      reasons.push(
        `Your scenario also includes ${pct(n(stateLike.annualSalaryGrowthRate, 0))} annual salary growth before retirement, which boosts future 401k contributions and can make later retirement ages look materially stronger.`,
      );
    }
    if (n(stateLike.preMedicareHealthcareCost, 0) > 0) {
      reasons.push(
        `Pre-65 healthcare cost is active, so the bridge years before age 65 are carrying extra spending pressure under the current ACA setting.`,
      );
    }
    if (recommended.key !== baseline.key) {
      reasons.push(
        `Compared with 401k first, ${recommended.label.toLowerCase()} changes the modeled age-75 balance by ${money(n(recommended.age75Balance, 0) - n(baseline.age75Balance, 0))} and brokerage-at-75 by ${money(n(recommended.brokerageAt75, 0) - n(baseline.brokerageAt75, 0))}.`,
      );
    }
    return reasons.join(" ");
  }
  function strategyDriverBadges(
    stateLike,
    selected,
    recommended,
    baseline,
    optimizationGoal,
  ) {
    if (!selected || !recommended || !baseline) return [];
    const badges = [];
    if (optimizationGoal === "tax") {
      badges.push({ label: "Tax-driven", cls: "okay" });
    } else if (optimizationGoal === "brokerage") {
      badges.push({ label: "Brokerage-preserving", cls: "okay" });
    } else if (optimizationGoal === "age75") {
      badges.push({ label: "Longevity-driven", cls: "good" });
    } else {
      const driver = dominantStrategyDriver(selected, recommended);
      if (driver === "tax") badges.push({ label: "Tax-driven", cls: "okay" });
      else if (driver === "brokerage")
        badges.push({ label: "Brokerage-preserving", cls: "okay" });
      else badges.push({ label: "Longevity-driven", cls: "good" });
    }
    if (n(stateLike.annualSalaryGrowthRate, 0) > 0) {
      badges.push({ label: "Salary-growth-driven", cls: "good" });
    }
    if (n(stateLike.preMedicareHealthcareCost, 0) > 0) {
      badges.push({ label: "Healthcare-pressure", cls: "bad" });
    }
    if (recommended.key !== baseline.key) {
      badges.push({ label: "Not 401k-first", cls: "okay" });
    }
    return badges;
  }
  function totalPre65HealthcareLoad(result, stateLike) {
    return (result?.monthlyBreakdown || []).reduce((sum, row) => {
      if (n(row?.age, 0) >= 65) return sum;
      const baselineSpend = Math.max(0, n(stateLike.annualRetirementSpend, 0)) / 12,
        extraHealthcare = Math.max(0, n(row?.spend, 0) - baselineSpend);
      return sum + extraHealthcare;
    }, 0);
  }
  function statusClassFromGap(gap, okayThreshold = 0) {
    if (gap >= 0) return "good";
    return Math.abs(gap) <= okayThreshold ? "okay" : "bad";
  }
  function primaryTrackConstraint(benchmark, healthcareLoad) {
    if (!benchmark || benchmark.impossible) {
      return {
        label: "Plan shortfall",
        cls: "bad",
        note: "The current target age is not viable under the saved base-plan assumptions.",
      };
    }
    const brokerageGap = n(benchmark.actualBrokerage, 0) - Math.max(0, n(benchmark.requiredBrokerage, 0)),
      k401Gap = n(benchmark.actual401k, 0) - Math.max(0, n(benchmark.required401k, 0)),
      candidates = [
        {
          key: "bridge",
          gap: brokerageGap,
          label: brokerageGap >= 0 ? "Bridge funded" : "Brokerage bridge",
          note:
            brokerageGap >= 0
              ? "Brokerage is covering the current bridge requirement."
              : "Brokerage is the tightest current constraint relative to the bridge requirement.",
        },
        {
          key: "k401",
          gap: k401Gap,
          label: k401Gap >= 0 ? "401k funded" : "401k requirement",
          note:
            k401Gap >= 0
              ? "401k is covering the current post-unlock requirement."
              : "401k is the tightest current constraint relative to the post-unlock requirement.",
        },
      ].sort((a, b) => a.gap - b.gap);
    const weakest = candidates[0];
    if (weakest.gap >= 0 && healthcareLoad > Math.max(15000, n(benchmark.actualTotal, 0) * 0.03)) {
      return {
        label: "Healthcare pressure",
        cls: "okay",
        note: "Balances are currently covering the base plan, but pre-65 healthcare is a meaningful drag on the bridge years.",
      };
    }
    return {
      label: weakest.label,
      cls: weakest.gap >= 0 ? "good" : "bad",
      note: weakest.note,
    };
  }
  function maxAnnualSpendForTarget(
    stateLike,
    fundKey,
    rates,
    withdrawalConfig = { strategy: "k401First", reserveYears: 2 },
  ) {
    const retirementAge = Math.max(
        computeAge(stateLike),
        n(stateLike.targetRetirementAge),
      ),
      tester = (annualSpend) =>
        fullPlanViableAtAge(
          { ...stateLike, annualRetirementSpend: Math.max(0, annualSpend) },
          fundKey,
          retirementAge,
          rates,
          withdrawalConfig,
        ).viable;
    let lo = 0,
      hi = Math.max(100000, n(stateLike.annualRetirementSpend, 0));
    while (tester(hi) && hi < 1000000) hi *= 1.5;
    for (let i = 0; i < 45; i += 1) {
      const mid = (lo + hi) / 2;
      if (tester(mid)) lo = mid;
      else hi = mid;
    }
    return Math.floor(lo / 500) * 500;
  }
  function renderTrackConstraintCards(rates) {
    if (!ui.trackConstraintCards) return;
    const benchmark = latestProgressBenchmark(rates);
    if (!benchmark) {
      ui.trackConstraintCards.innerHTML =
        `<article class="card"><div class="top"><div><h3>Current bottleneck</h3><p class="sub">Save a balance snapshot to diagnose the plan.</p></div><span class="badge okay">Needs data</span></div></article>`;
      return;
    }
    if (benchmark.impossible) {
      ui.trackConstraintCards.innerHTML = `<article class="card"><div class="top"><div><h3>Current bottleneck</h3><p class="sub">The target age does not currently solve under the saved assumptions.</p></div><span class="badge bad">Off track</span></div><div class="rowGrid"><div class="row"><span>Target age</span><strong>${age(state.targetRetirementAge)}</strong></div><div class="row"><span>Status</span><strong class="deltaDown">Not currently solvable</strong></div></div><p class="sub" style="margin-top:.7rem">This means the full base plan needs a later retirement age, lower spend, higher savings, or a different return/tax/healthcare setup.</p></article>`;
      return;
    }
    const brokerageGap = n(benchmark.actualBrokerage, 0) - Math.max(0, n(benchmark.requiredBrokerage, 0)),
      k401Gap = n(benchmark.actual401k, 0) - Math.max(0, n(benchmark.required401k, 0)),
      oneYearGap = n(benchmark.actualTotal, 0) - Math.max(0, n(benchmark.requiredTotal, 0)),
      healthcareLoad = totalPre65HealthcareLoad(benchmark.projectedBasePlan, state),
      annualHealthcareAtRetirement = annualHealthcareCostAtAge(
        state,
        Math.max(computeAge(state), n(state.targetRetirementAge, 0)),
      ),
      bottleneck = primaryTrackConstraint(benchmark, healthcareLoad),
      bridgeCls = statusClassFromGap(brokerageGap, Math.max(15000, n(benchmark.requiredBrokerage, 0) * 0.08)),
      k401Cls = statusClassFromGap(k401Gap, Math.max(25000, n(benchmark.required401k, 0) * 0.08)),
      healthCls =
        healthcareLoad <= 1
          ? "good"
          : healthcareLoad <= Math.max(15000, n(state.annualRetirementSpend, 0) * 0.35)
            ? "okay"
            : "bad";
    ui.trackConstraintCards.innerHTML = [
      {
        title: "Bridge requirement",
        cls: bridgeCls,
        badge:
          brokerageGap >= 0
            ? `${money(Math.abs(brokerageGap))} cushion`
            : `${money(Math.abs(brokerageGap))} short`,
        rows: [
          ["Actual brokerage", money(benchmark.actualBrokerage)],
          ["Needed today", money(benchmark.requiredBrokerage)],
          ["Projected at retirement", money(benchmark.projectedBasePlan.brokerageAtRetirement)],
        ],
        note:
          brokerageGap >= 0
            ? "Brokerage is currently covering the bridge requirement for the base plan."
            : "Brokerage is currently below the minimum balance needed to keep the bridge viable.",
      },
      {
        title: "401k requirement",
        cls: k401Cls,
        badge:
          k401Gap >= 0
            ? `${money(Math.abs(k401Gap))} cushion`
            : `${money(Math.abs(k401Gap))} short`,
        rows: [
          ["Actual 401k", money(benchmark.actual401k)],
          ["Needed today", money(benchmark.required401k)],
          ["Projected at unlock", money(benchmark.projectedBasePlan.k401AtUnlock)],
        ],
        note:
          k401Gap >= 0
            ? "401k is currently covering the post-unlock side of the base plan."
            : "401k is currently below the minimum balance needed to support the post-unlock path.",
      },
      {
        title: "Pre-65 healthcare",
        cls: healthCls,
        badge: healthcareLoad <= 1 ? "Low" : money(healthcareLoad),
        rows: [
          ["Extra spend to 65", money(healthcareLoad)],
          ["Annual cost at retirement", money(annualHealthcareAtRetirement)],
          ["Modeled pre-65 spend", money(annualRetirementNeedAtAge(state, Math.max(computeAge(state), n(state.targetRetirementAge, 0))))],
        ],
        note:
          healthcareLoad <= 1
            ? "Healthcare is not materially changing the base-plan bridge right now."
            : "This is the added pre-Medicare healthcare load currently pressuring the bridge years.",
      },
      {
        title: "Primary bottleneck",
        cls: bottleneck.cls,
        badge: bottleneck.label,
        rows: [
          ["Total ahead / behind", oneYearGap >= 0 ? `+${money(Math.abs(oneYearGap))}` : `-${money(Math.abs(oneYearGap))}`],
          ["Bridge coverage", pct(benchmark.brokerageRatio * 100)],
          ["401k coverage", pct(benchmark.k401Ratio * 100)],
        ],
        note: bottleneck.note,
      },
    ]
      .map(
        (card) => `<article class="card"><div class="top"><div><h3>${card.title}</h3><p class="sub">${card.note}</p></div><span class="badge ${card.cls}">${card.badge}</span></div><div class="rowGrid">${card.rows
          .map(([label, value]) => `<div class="row"><span>${label}</span><strong>${value}</strong></div>`)
          .join("")}</div></article>`,
      )
      .join("");
  }
  function renderTrackActionPlan(rates) {
    if (!ui.trackActionSummary || !ui.trackActionCards) return;
    const benchmark = latestProgressBenchmark(rates);
    if (!benchmark) {
      ui.trackActionSummary.innerHTML =
        "<p>Save a balance snapshot first, then the planner can solve which levers would clear your current target-age plan.</p>";
      ui.trackActionCards.innerHTML = "";
      return;
    }
    const fundKey = currentPlanFundKey(),
      withdrawalConfig = { strategy: "k401First", reserveYears: 2 },
      currentBrokerage = Math.max(0, n(state.monthlyBrokerageContribution, 0)),
      current401kPct = normalizeContributionPct(state.contributionPct, 0),
      earliestSafeAge = earliestFullPlan(state, fundKey, rates, withdrawalConfig),
      minBrokerage = minBrokerageContributionForTarget(
        state,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      min401kPct = min401kContributionPctForTarget(
        state,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      maxSpend = maxAnnualSpendForTarget(
        state,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      healthcareLoad = totalPre65HealthcareLoad(benchmark.projectedBasePlan, state),
      bottleneck = primaryTrackConstraint(benchmark, healthcareLoad),
      brokerageDelta =
        minBrokerage == null ? null : Math.max(0, minBrokerage - currentBrokerage),
      k401Delta =
        min401kPct == null ? null : Math.max(0, min401kPct - current401kPct),
      spendDelta = Math.max(0, n(state.annualRetirementSpend, 0) - maxSpend),
      ageDelay =
        earliestSafeAge == null
          ? null
          : Math.max(0, earliestSafeAge - Math.max(computeAge(state), n(state.targetRetirementAge))),
      recommendation =
        bottleneck.label === "Brokerage bridge"
          ? `Bridge pressure is the main limiter right now. The cleanest first lever is brokerage savings: about ${brokerageDelta && brokerageDelta > 0 ? money(brokerageDelta) : money(0)} more per month would bring you to the minimum modeled brokerage contribution for the current target age.`
          : bottleneck.label === "401k requirement"
            ? `The post-unlock 401k requirement is the main limiter right now. The clearest first lever is your 401k rate: the model points to about ${pct(min401kPct ?? current401kPct)} total employee contribution to clear the current target-age plan.`
            : bottleneck.label === "Healthcare pressure"
              ? `Healthcare drag is the most meaningful extra pressure right now. A later retirement age, lower pre-65 healthcare assumption, or lower spend target would relieve it faster than only nudging one account.`
              : `The current target age is already covered under the saved assumptions. These cards show the nearest edges if you want extra cushion rather than a rescue move.`;
    ui.trackActionSummary.innerHTML = `<p>${recommendation}</p>`;
    ui.trackActionCards.innerHTML = [
      {
        title: "Retirement age",
        cls:
          earliestSafeAge == null
            ? "bad"
            : ageDelay <= 0.01
              ? "good"
              : ageDelay <= 1.0
                ? "okay"
                : "bad",
        badge:
          earliestSafeAge == null
            ? "No safe age found"
            : ageDelay <= 0.01
              ? "Current age holds"
              : `+${age(ageDelay)} delay`,
        rows: [
          ["Current target", age(state.targetRetirementAge)],
          ["Earliest full-plan-safe", earliestSafeAge == null ? "65+" : age(earliestSafeAge)],
          ["Delay needed", earliestSafeAge == null ? "Unknown" : ageDelay <= 0.01 ? "None" : age(ageDelay)],
        ],
        note:
          earliestSafeAge == null
            ? "The solver could not find a full-plan-safe retirement age in the current search window."
            : ageDelay <= 0.01
              ? "Your current target age is already viable under the base plan."
              : "This is the later retirement age that clears the current plan without changing spending or contributions.",
      },
      {
        title: "Brokerage contribution",
        cls:
          brokerageDelta == null
            ? "bad"
            : brokerageDelta <= 0
              ? "good"
              : brokerageDelta <= 500
                ? "okay"
                : "bad",
        badge:
          brokerageDelta == null
            ? "Not solved"
            : brokerageDelta <= 0
              ? "Already enough"
              : `+${money(brokerageDelta)}/mo`,
        rows: [
          ["Current / mo", money(currentBrokerage)],
          ["Minimum / mo", minBrokerage == null ? "Unknown" : money(minBrokerage)],
          ["Increase needed", brokerageDelta == null ? "Unknown" : brokerageDelta <= 0 ? money(0) : money(brokerageDelta)],
        ],
        note:
          brokerageDelta == null
            ? "The solver could not find a brokerage contribution level inside the current search range."
            : brokerageDelta <= 0
              ? "Current brokerage saving is already enough to clear the target-age plan."
              : "This is the minimum ongoing brokerage contribution that clears the current target age if the rest of the plan stays the same.",
      },
      {
        title: "401k contribution",
        cls:
          k401Delta == null
            ? "bad"
            : k401Delta <= 0
              ? "good"
              : k401Delta <= 2
                ? "okay"
                : "bad",
        badge:
          k401Delta == null
            ? "Not solved"
            : k401Delta <= 0
              ? "Already enough"
              : `+${pct(k401Delta)}`,
        rows: [
          ["Current employee %", pct(current401kPct)],
          ["Minimum employee %", min401kPct == null ? "Unknown" : pct(min401kPct)],
          ["Increase needed", k401Delta == null ? "Unknown" : k401Delta <= 0 ? pct(0) : pct(k401Delta)],
        ],
        note:
          k401Delta == null
            ? "The solver could not find a 401k rate inside the current search range."
            : k401Delta <= 0
              ? "Current 401k contribution is already enough to clear the target-age plan."
              : "This is the minimum employee 401k rate that clears the target age if brokerage saving and spending stay the same.",
      },
      {
        title: "Spending",
        cls:
          spendDelta <= 0
            ? "good"
            : spendDelta <= 5000
              ? "okay"
              : "bad",
        badge:
          spendDelta <= 0
            ? "Within limit"
            : `-${money(spendDelta)}/yr`,
        rows: [
          ["Current annual spend", money(state.annualRetirementSpend)],
          ["Max spend at target age", money(maxSpend)],
          ["Reduction needed", spendDelta <= 0 ? money(0) : money(spendDelta)],
        ],
        note:
          spendDelta <= 0
            ? "The current spend target still fits inside the modeled target-age plan."
            : "This is the highest annual spend the solver found while still keeping the current target age viable.",
      },
    ]
      .map(
        (card) => `<article class="card"><div class="top"><div><h3>${card.title}</h3><p class="sub">${card.note}</p></div><span class="badge ${card.cls}">${card.badge}</span></div><div class="rowGrid">${card.rows
          .map(([label, value]) => `<div class="row"><span>${label}</span><strong>${value}</strong></div>`)
          .join("")}</div></article>`,
      )
      .join("");
  }
  function scenarioPrimaryConstraint(stateLike, rates, selectedEvaluation) {
    const withdrawalConfig = scenarioWithdrawalConfig(stateLike),
      needProfile = retirementNeedProfile(stateLike, rates, withdrawalConfig),
      bridgeGap =
        Math.max(0, n(selectedEvaluation?.result?.brokerageAtRetirement, 0)) -
        Math.max(0, n(needProfile.requiredBrokerageAtRetirement, 0)),
      unlockGap =
        Math.max(0, n(selectedEvaluation?.result?.totalAtUnlock, 0)) -
        Math.max(0, n(needProfile.requiredCombinedAtUnlock, 0)),
      healthcareLoad = totalPre65HealthcareLoad(selectedEvaluation?.result, stateLike);
    if (bridgeGap < 0 && bridgeGap <= unlockGap) {
      return {
        key: "bridge",
        label: "Brokerage bridge",
        note: "Brokerage at retirement is the tightest part of the selected scenario right now.",
      };
    }
    if (unlockGap < 0) {
      return {
        key: "unlock",
        label: "Post-unlock pool",
        note: "The combined pool at unlock is still too light for the selected scenario.",
      };
    }
    if (healthcareLoad > Math.max(15000, n(stateLike.annualRetirementSpend, 0) * 0.35)) {
      return {
        key: "healthcare",
        label: "Pre-65 healthcare",
        note: "Healthcare load is a major drag on this scenario before age 65.",
      };
    }
    return {
      key: "margin",
      label: "General cushion",
      note: "The selected scenario is currently viable; these levers show how close to the edge it is.",
    };
  }
  function renderScenarioActionPlan(stateLike, rates) {
    if (!ui.scenarioActionSummary || !ui.scenarioActionCards) return;
    const fundKey = scenarioFundKey(stateLike),
      withdrawalConfig = scenarioWithdrawalConfig(stateLike),
      targetAge = Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge)),
      selected = evaluateWithdrawalStrategy(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      earliestSafeAge = earliestFullPlan(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      minBrokerage = minBrokerageContributionForTarget(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      min401kPct = min401kContributionPctForTarget(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      maxSpend = maxAnnualSpendForTarget(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      currentBrokerage = Math.max(0, n(stateLike.monthlyBrokerageContribution, 0)),
      current401kPct = normalizeContributionPct(stateLike.contributionPct, 0),
      brokerageDelta =
        minBrokerage == null ? null : Math.max(0, minBrokerage - currentBrokerage),
      k401Delta =
        min401kPct == null ? null : Math.max(0, min401kPct - current401kPct),
      spendDelta = Math.max(0, n(stateLike.annualRetirementSpend, 0) - maxSpend),
      ageDelay =
        earliestSafeAge == null ? null : Math.max(0, earliestSafeAge - targetAge),
      constraint = scenarioPrimaryConstraint(stateLike, rates, selected),
      recommendation =
        constraint.key === "bridge"
          ? `The selected scenario is mostly being limited by the brokerage bridge. The cleanest first fix is brokerage savings: about ${brokerageDelta && brokerageDelta > 0 ? money(brokerageDelta) : money(0)} more per month would bring this scenario to the minimum modeled brokerage contribution for age ${age(targetAge)}.`
          : constraint.key === "unlock"
            ? `The selected scenario is mostly being limited by the post-unlock pool. The cleanest first fix is usually a stronger 401k path: the model points to about ${pct(min401kPct ?? current401kPct)} employee contribution, a later retirement age, or both.`
            : constraint.key === "healthcare"
              ? `Pre-65 healthcare pressure is a major drag in this scenario. A later retirement age, lower spend, or a lighter healthcare assumption will move the result faster than only changing draw order.`
              : `The selected scenario is currently viable. These levers show how much cushion you have before the scenario would start to fall short.`;
    ui.scenarioActionSummary.innerHTML = `<p>${recommendation}</p>`;
    ui.scenarioActionCards.innerHTML = [
      {
        title: "Retirement age",
        cls:
          earliestSafeAge == null
            ? "bad"
            : ageDelay <= 0.01
              ? "good"
              : ageDelay <= 1.0
                ? "okay"
                : "bad",
        badge:
          earliestSafeAge == null
            ? "No safe age found"
            : ageDelay <= 0.01
              ? "Current age holds"
              : `+${age(ageDelay)} delay`,
        rows: [
          ["Scenario target", age(targetAge)],
          ["Earliest full-plan-safe", earliestSafeAge == null ? "65+" : age(earliestSafeAge)],
          ["Delay needed", earliestSafeAge == null ? "Unknown" : ageDelay <= 0.01 ? "None" : age(ageDelay)],
        ],
        note:
          earliestSafeAge == null
            ? "The solver could not find a full-plan-safe age for this scenario in the current search window."
            : ageDelay <= 0.01
              ? "This scenario age already holds under the selected path and withdrawal strategy."
              : "This is the later retirement age that clears the selected What If scenario without changing other levers.",
      },
      {
        title: "Brokerage contribution",
        cls:
          brokerageDelta == null
            ? "bad"
            : brokerageDelta <= 0
              ? "good"
              : brokerageDelta <= 500
                ? "okay"
                : "bad",
        badge:
          brokerageDelta == null
            ? "Not solved"
            : brokerageDelta <= 0
              ? "Already enough"
              : `+${money(brokerageDelta)}/mo`,
        rows: [
          ["Current / mo", money(currentBrokerage)],
          ["Minimum / mo", minBrokerage == null ? "Unknown" : money(minBrokerage)],
          ["Increase needed", brokerageDelta == null ? "Unknown" : brokerageDelta <= 0 ? money(0) : money(brokerageDelta)],
        ],
        note:
          brokerageDelta == null
            ? "The solver could not find a brokerage contribution inside the current search range for this scenario."
            : brokerageDelta <= 0
              ? "Current brokerage saving is already enough for this scenario."
              : "This is the minimum brokerage contribution that clears the selected scenario at the current target age.",
      },
      {
        title: "401k contribution",
        cls:
          k401Delta == null
            ? "bad"
            : k401Delta <= 0
              ? "good"
              : k401Delta <= 2
                ? "okay"
                : "bad",
        badge:
          k401Delta == null
            ? "Not solved"
            : k401Delta <= 0
              ? "Already enough"
              : `+${pct(k401Delta)}`,
        rows: [
          ["Current employee %", pct(current401kPct)],
          ["Minimum employee %", min401kPct == null ? "Unknown" : pct(min401kPct)],
          ["Increase needed", k401Delta == null ? "Unknown" : k401Delta <= 0 ? pct(0) : pct(k401Delta)],
        ],
        note:
          k401Delta == null
            ? "The solver could not find a 401k contribution rate inside the current search range for this scenario."
            : k401Delta <= 0
              ? "Current 401k contribution is already enough for this scenario."
              : "This is the minimum 401k employee contribution that clears the selected scenario if the rest stays the same.",
      },
      {
        title: "Spending",
        cls:
          spendDelta <= 0
            ? "good"
            : spendDelta <= 5000
              ? "okay"
              : "bad",
        badge:
          spendDelta <= 0
            ? "Within limit"
            : `-${money(spendDelta)}/yr`,
        rows: [
          ["Current annual spend", money(stateLike.annualRetirementSpend)],
          ["Max spend at target age", money(maxSpend)],
          ["Reduction needed", spendDelta <= 0 ? money(0) : money(spendDelta)],
        ],
        note:
          spendDelta <= 0
            ? "The current spend target still fits inside the selected scenario."
            : "This is the highest annual spend the solver found while still keeping the selected scenario viable.",
      },
    ]
      .map(
        (card) => `<article class="card"><div class="top"><div><h3>${card.title}</h3><p class="sub">${card.note}</p></div><span class="badge ${card.cls}">${card.badge}</span></div><div class="rowGrid">${card.rows
          .map(([label, value]) => `<div class="row"><span>${label}</span><strong>${value}</strong></div>`)
          .join("")}</div></article>`,
      )
      .join("");
  }
  function strategyConstraintCards(stateLike, rates, selected, baseline, evaluations) {
    if (!selected) return [];
    const withdrawalConfig = scenarioWithdrawalConfig(stateLike),
      needProfile = retirementNeedProfile(stateLike, rates, withdrawalConfig),
      lowestTax = [...(evaluations || [])].sort(
        (a, b) => n(a?.totalEstimatedTaxTo75, 0) - n(b?.totalEstimatedTaxTo75, 0),
      )[0] || selected,
      bridgeProjected = Math.max(0, n(selected.result?.brokerageAtRetirement, 0)),
      bridgeRequired = Math.max(0, n(needProfile.requiredBrokerageAtRetirement, 0)),
      bridgeCushion = bridgeProjected - bridgeRequired,
      unlockProjected = Math.max(0, n(selected.result?.totalAtUnlock, 0)),
      unlockRequired = Math.max(0, n(needProfile.requiredCombinedAtUnlock, 0)),
      unlockCushion = unlockProjected - unlockRequired,
      healthcareLoad = totalPre65HealthcareLoad(selected.result, stateLike),
      annualHealthcareAtRetirement = annualHealthcareCostAtAge(
        stateLike,
        Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge, 0)),
      ),
      healthcareYears = new Set(
        (selected.result?.monthlyBreakdown || [])
          .filter((row) => n(row?.age, 0) < 65 && n(row?.spend, 0) > 0)
          .map((row) => String(row.date || "").slice(0, 4))
          .filter(Boolean),
      ).size,
      extraTaxVsLowest = Math.max(
        0,
        n(selected.totalEstimatedTaxTo75, 0) - n(lowestTax.totalEstimatedTaxTo75, 0),
      ),
      bridgeCls = bridgeCushion >= 0 ? "good" : "bad",
      unlockCls = unlockCushion >= 0 ? "good" : "bad",
      taxCls =
        extraTaxVsLowest <= 1
          ? "good"
          : extraTaxVsLowest <= Math.max(25000, n(selected.totalEstimatedTaxTo75, 0) * 0.2)
            ? "okay"
            : "bad",
      healthcareCls =
        healthcareLoad <= 1
          ? "good"
          : healthcareLoad <= Math.max(15000, n(stateLike.annualRetirementSpend, 0) * 0.35)
            ? "okay"
            : "bad";
    return [
      {
        title: "Bridge Constraint",
        cls: bridgeCls,
        badge:
          bridgeCushion >= 0
            ? `${money(bridgeCushion)} cushion`
            : `${money(Math.abs(bridgeCushion))} short`,
        rows: [
          ["Need at retirement", money(bridgeRequired)],
          ["Projected at retirement", money(bridgeProjected)],
          ["Retirement age", age(stateLike.targetRetirementAge)],
        ],
        note:
          bridgeCushion >= 0
            ? "Brokerage is covering the bridge requirement under this scenario."
            : "Brokerage is the current weak point for making it to unlock.",
      },
      {
        title: "Post-Unlock Constraint",
        cls: unlockCls,
        badge:
          unlockCushion >= 0
            ? `${money(unlockCushion)} cushion`
            : `${money(Math.abs(unlockCushion))} short`,
        rows: [
          ["Need at unlock", money(unlockRequired)],
          ["Projected at unlock", money(unlockProjected)],
          ["Unlock age", age(stateLike.unlockAge)],
        ],
        note:
          unlockCushion >= 0
            ? "The combined pool at unlock is covering the modeled post-unlock requirement."
            : "Post-unlock spending pressure is still heavier than the projected pool at unlock.",
      },
      {
        title: "Tax Drag To 75",
        cls: taxCls,
        badge:
          extraTaxVsLowest <= 1
            ? "Lowest modeled"
            : `${money(extraTaxVsLowest)} above best`,
        rows: [
          ["Selected strategy tax", money(selected.totalEstimatedTaxTo75)],
          ["Lowest modeled tax", money(lowestTax.totalEstimatedTaxTo75)],
          ["Taxable SS through 75", money(selected.totalEstimatedTaxableSSTo75)],
        ],
        note:
          extraTaxVsLowest <= 1
            ? `${selected.label} is already the lowest-tax option among the modeled strategies.`
            : `${lowestTax.label} is the current low-tax benchmark among the modeled strategies.`,
      },
      {
        title: "Pre-65 healthcare",
        cls: healthcareCls,
        badge:
          healthcareLoad <= 1
            ? "No extra load"
            : money(healthcareLoad),
        rows: [
          ["Extra spend to 65", money(healthcareLoad)],
          ["Annual cost at retirement", money(annualHealthcareAtRetirement)],
          ["Years affected", healthcareYears ? String(healthcareYears) : "0"],
        ],
        note:
          healthcareLoad <= 1
            ? "Healthcare is not materially changing the modeled bridge years right now."
            : "This is the added pre-Medicare spending pressure carried into the bridge and post-retirement math.",
      },
    ];
  }
  function scenarioFundKey(stateLike = state) {
    return stateLike.scenarioStrategyFund === "qqqm" ? "qqqm" : "iyw";
  }
  function fundLabelForKey(fundKey) {
    return fundKey === "qqqm" ? blendLabel("blendB") : blendLabel("blendA");
  }
  function scenarioWithdrawalConfig(stateLike = state) {
    return {
      strategy:
        stateLike.scenarioWithdrawalStrategy || "k401First",
      optimizationGoal:
        stateLike.scenarioOptimizationGoal || "balanced",
      reserveYears: Math.max(
        0,
        n(stateLike.scenarioBrokerageReserveYears, 2),
      ),
      taxAwareAnnualCap: Math.max(
        0,
        n(stateLike.scenarioTaxAwareAnnualCap, 30000),
      ),
      brokerageGainRate: Math.max(
        0,
        Math.min(100, n(stateLike.scenarioBrokerageGainRate, 60)),
      ),
      stateTaxRate: Math.max(
        0,
        Math.min(20, n(stateLike.scenarioStateTaxRate, 0)),
      ),
    };
  }
  function drawFromAccounts(
    brokerageBalance,
    k401Balance,
    need,
    config,
    spend,
    context = {},
  ) {
    let brokerage = Math.max(0, n(brokerageBalance, 0)),
      k401 = Math.max(0, n(k401Balance, 0)),
      remainingNeed = Math.max(0, n(need, 0)),
      brokerageWithdraw = 0,
      k401Withdraw = 0,
      brokerageTaxableGainsRealized = 0;
    const strategy = config?.strategy || "k401First",
      reserveTarget =
        Math.max(0, n(config?.reserveYears, 0)) *
        Math.max(0, n(spend, 0)) *
        12,
      brokerageGainRate = Math.max(
        0,
        Math.min(1, n(config?.brokerageGainRate, 60) / 100),
      ),
      taxAwareCapRemaining = Math.max(
        0,
        n(context?.taxAwareCapRemaining, n(config?.taxAwareAnnualCap, 0)),
      ),
      ytd401kWithdrawn = Math.max(0, n(context?.ytd401kWithdrawn, 0)),
      ytdBrokerageGains = Math.max(0, n(context?.ytdBrokerageGains, 0)),
      ytdSSIncome = Math.max(0, n(context?.ytdSSIncome, 0)),
      taxFilingStatus = context?.taxFilingStatus || "single",
      stateTaxRate = Math.max(0, n(context?.stateTaxRate, n(config?.stateTaxRate, 0)));
    let brokerageBasis =
      context?.brokerageBasis != null
        ? Math.max(0, Math.min(brokerage, n(context?.brokerageBasis, 0)))
        : startingBrokerageBasis(
            brokerage,
            {
              scenarioBrokerageGainRate: n(config?.brokerageGainRate, 60),
            },
          );
    const effectiveBrokerageGainRate = brokerageGainRatio(
      brokerage,
      brokerageBasis,
      brokerageGainRate,
    );
    const takeBrokerage = (desiredAmount) => {
      const result = withdrawBrokerageWithBasis(
        brokerage,
        brokerageBasis,
        desiredAmount,
        effectiveBrokerageGainRate,
      );
      brokerageWithdraw += result.withdrawal;
      brokerageTaxableGainsRealized += result.taxableGains;
      brokerage = result.nextBalance;
      brokerageBasis = result.nextBasis;
      remainingNeed -= result.withdrawal;
      return result.withdrawal;
    };
    const incrementalTaxForCandidate = (candidate) =>
      estimatePlannerTaxBreakdown(
        ytd401kWithdrawn + Math.max(0, n(candidate?.k401Withdraw, 0)),
        ytdBrokerageGains +
          Math.max(0, n(candidate?.brokerageTaxableGainsRealized, 0)),
        ytdSSIncome,
        taxFilingStatus,
        stateTaxRate,
      ).totalTax -
      estimatePlannerTaxBreakdown(
        ytd401kWithdrawn,
        ytdBrokerageGains,
        ytdSSIncome,
        taxFilingStatus,
        stateTaxRate,
      ).totalTax;
    if (remainingNeed > 0 && strategy === "goalAware") {
      const candidateStrategies = [
          "k401First",
          "brokerageFirst",
          "proRata",
          "brokerageReserve",
          "taxAware",
        ],
        optimizationGoal = config?.optimizationGoal || "balanced",
        postReturnAnnual = Math.max(0, n(context?.postReturnAnnual, 0)),
        k401PostReturnAnnual = Math.max(0, n(context?.k401PostReturnAnnual, 0)),
        growthBias = (k401PostReturnAnnual - postReturnAnnual) / 100,
        reserveValue = Math.max(0, reserveTarget),
        ranked = candidateStrategies
          .map((strategyKey) => {
            const candidate = drawFromAccounts(
                brokerageBalance,
                k401Balance,
                need,
                { ...config, strategy: strategyKey },
                spend,
                context,
              ),
              incrementalTax = incrementalTaxForCandidate(candidate),
              totalAfter =
                Math.max(0, n(candidate?.brokerage, 0)) +
                Math.max(0, n(candidate?.k401, 0)),
              gapPenalty = Math.max(0, n(candidate?.gap, 0)) * 1000,
              brokerageAfter = Math.max(0, n(candidate?.brokerage, 0)),
              k401After = Math.max(0, n(candidate?.k401, 0)),
              reserveScore = Math.min(brokerageAfter, reserveValue || brokerageAfter);
            let score = -gapPenalty;
            if (optimizationGoal === "tax") {
              score += totalAfter * 0.0001 - incrementalTax;
            } else if (optimizationGoal === "brokerage") {
              score += brokerageAfter + reserveScore * 0.15 - incrementalTax * 0.1;
            } else if (optimizationGoal === "age75") {
              score +=
                totalAfter +
                growthBias * (growthBias >= 0 ? k401After : brokerageAfter) -
                incrementalTax * 0.15;
            } else {
              score +=
                totalAfter +
                reserveScore * 0.12 +
                growthBias * (growthBias >= 0 ? k401After * 0.4 : brokerageAfter * 0.4) -
                incrementalTax * 0.15;
            }
            return {
              strategyKey,
              candidate,
              score,
            };
          })
          .sort((a, b) => b.score - a.score),
        best = ranked[0];
      return {
        ...best.candidate,
        chosenStrategy: best.strategyKey,
      };
    }
    if (remainingNeed > 0 && strategy === "brokerageFirst") {
      takeBrokerage(remainingNeed);
      k401Withdraw = Math.min(k401, remainingNeed);
      k401 -= k401Withdraw;
      remainingNeed -= k401Withdraw;
    } else if (remainingNeed > 0 && strategy === "proRata") {
      const total = brokerage + k401;
      if (total > 0) {
        const brokerageShare = brokerage / total,
          desiredBrokerage = remainingNeed * brokerageShare;
        takeBrokerage(desiredBrokerage);
        k401Withdraw = Math.min(k401, remainingNeed);
        k401 -= k401Withdraw;
        remainingNeed -= k401Withdraw;
        if (remainingNeed > 0) {
          takeBrokerage(remainingNeed);
        }
      }
    } else if (remainingNeed > 0 && strategy === "brokerageReserve") {
      const excessBrokerage = Math.max(0, brokerage - reserveTarget);
      takeBrokerage(Math.min(excessBrokerage, remainingNeed));
      if (remainingNeed > 0) {
        k401Withdraw = Math.min(k401, remainingNeed);
        k401 -= k401Withdraw;
        remainingNeed -= k401Withdraw;
      }
      if (remainingNeed > 0) {
        takeBrokerage(remainingNeed);
      }
    } else if (remainingNeed > 0 && strategy === "taxAware") {
      const cap401Withdraw = Math.min(k401, remainingNeed, taxAwareCapRemaining);
      k401Withdraw = cap401Withdraw;
      k401 -= cap401Withdraw;
      remainingNeed -= cap401Withdraw;
      if (remainingNeed > 0) {
        const brokerageTaxCost =
            estimatePlannerTaxBreakdown(
              ytd401kWithdrawn + k401Withdraw,
              ytdBrokerageGains + remainingNeed * effectiveBrokerageGainRate,
              ytdSSIncome,
              taxFilingStatus,
              stateTaxRate,
            ).totalTax -
            estimatePlannerTaxBreakdown(
              ytd401kWithdrawn + k401Withdraw,
              ytdBrokerageGains,
              ytdSSIncome,
              taxFilingStatus,
              stateTaxRate,
            ).totalTax,
          k401TaxCost =
            estimatePlannerTaxBreakdown(
              ytd401kWithdrawn + k401Withdraw + remainingNeed,
              ytdBrokerageGains,
              ytdSSIncome,
              taxFilingStatus,
              stateTaxRate,
            ).totalTax -
            estimatePlannerTaxBreakdown(
              ytd401kWithdrawn + k401Withdraw,
              ytdBrokerageGains,
              ytdSSIncome,
              taxFilingStatus,
              stateTaxRate,
            ).totalTax;
        if (brokerageTaxCost <= k401TaxCost) {
          takeBrokerage(remainingNeed);
          if (remainingNeed > 0) {
            const overflow401Withdraw = Math.min(k401, remainingNeed);
            k401Withdraw += overflow401Withdraw;
            k401 -= overflow401Withdraw;
            remainingNeed -= overflow401Withdraw;
          }
        } else {
          const overflow401Withdraw = Math.min(k401, remainingNeed);
          k401Withdraw += overflow401Withdraw;
          k401 -= overflow401Withdraw;
          remainingNeed -= overflow401Withdraw;
          if (remainingNeed > 0) {
            takeBrokerage(remainingNeed);
          }
        }
      }
    } else if (remainingNeed > 0) {
      k401Withdraw = Math.min(k401, remainingNeed);
      k401 -= k401Withdraw;
      remainingNeed -= k401Withdraw;
      takeBrokerage(remainingNeed);
    }
    return {
      brokerage,
      k401,
      nextBrokerageBasis: brokerageBasis,
      brokerageWithdraw,
      k401Withdraw,
      gap: Math.max(0, remainingNeed),
      brokerageTaxableGainsRealized,
      nextTaxAwareCapRemaining: Math.max(
        0,
        taxAwareCapRemaining - k401Withdraw,
      ),
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
      startDate = s.currentDate || today;
    let b = n(s.currentBrokerageBalance),
      k = n(s.current401kBalance),
      bBasis = startingBrokerageBasis(n(s.currentBrokerageBalance), s),
      bridgeTaxYear = null,
      bridgeYtdBrokerageGains = 0;
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
      bBasis = Math.min(Math.max(0, b), Math.max(0, bBasis + bContrib));
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
      const datePoint = addMonthsIso(startDate, mRet + i + 1),
        yearKey = String(datePoint || "").slice(0, 4);
      if (bridgeTaxYear !== yearKey) {
        bridgeTaxYear = yearKey;
        bridgeYtdBrokerageGains = 0;
      }
      const agePoint = actual + (i + 1) / 12,
        monthOfYear = Math.max(1, Number(String(datePoint || "").slice(5, 7)) || 1),
        monthsCompleted = Math.max(1, monthOfYear - 1),
        spend = monthlyRetirementNeedAtAge(s, agePoint, {
          annualCapitalGains:
            bridgeYtdBrokerageGains > 0
              ? (bridgeYtdBrokerageGains / monthsCompleted) * 12
              : Math.max(0, n(s.annualRetirementSpend, 0)) *
                brokerageGainRateProxy(s),
          annualSSIncome:
            agePoint >= n(s.ssClaimAge, 62) ? ssMonthly(s) * 12 : 0,
        });
      const grownBrokerage = b * (1 + bPost),
        bridgeDraw = withdrawBrokerageWithBasis(
          grownBrokerage,
          bBasis,
          spend,
          brokerageGainRateProxy(s),
        );
      b = bridgeDraw.nextBalance;
      bBasis = bridgeDraw.nextBasis;
      bridgeYtdBrokerageGains += bridgeDraw.taxableGains;
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
  function project(s, f, retAge, r, withdrawalConfig = { strategy: "k401First", reserveYears: 2 }) {
    const cur = computeAge(s),
      unlock = n(s.unlockAge),
      claim = n(s.ssClaimAge),
      chartEndAge = Math.max(unlock, n(s.chartEndAge, 80)),
      bAccum = mRate(f === "iyw" ? r.iyw : r.qqqm),
      bPost = mRate(r.post),
      kAccum = mRate(r.kacc),
      kPost = mRate(r.kpost),
      ss = ssMonthly(s),
      startDate = s.currentDate || today;
    let b = n(s.currentBrokerageBalance),
      k = n(s.current401kBalance),
      bBasis = startingBrokerageBasis(n(s.currentBrokerageBalance), s),
      bridgeTaxYear = null,
      bridgeYtdBrokerageGains = 0;
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
        employee401Contrib =
          (Math.max(0, n(entry.annualSalary, 0)) *
            normalizeContributionPct(entry.contributionPct, 0)) /
          100 /
          12,
        employer401Contrib =
          (Math.max(0, n(entry.annualSalary, 0)) *
            resolveEmployerMatchPct(
              entry.contributionPct,
              entry.employerMatchPct,
            )) /
          100 /
          12,
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
          salaryAnnualized: entry.annualSalary,
          brokerageMonthlyPlanned: bContrib,
          contributionPctPlanned: entry.contributionPct,
          employerMatchPctPlanned: entry.employerMatchPct,
          k401EmployeeContribution: employee401Contrib,
          k401EmployerContribution: employer401Contrib,
          brokerageStart: bStart,
          brokerageEnd: b,
          k401Start: kStart,
        k401End: k,
        brokerageContribution: bContrib,
        k401Contribution: kContrib,
        brokerageWithdrawal: 0,
        k401Withdrawal: 0,
        brokerageTaxableGains: 0,
        wagesIncome: Math.max(0, n(entry.annualSalary, 0)) / 12,
        withdrawalStrategy: "accumulation",
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
        const datePoint = addMonthsIso(startDate, mRet + i),
          yearKey = String(datePoint || "").slice(0, 4);
        if (bridgeTaxYear !== yearKey) {
          bridgeTaxYear = yearKey;
          bridgeYtdBrokerageGains = 0;
        }
        const bStart = b,
          kStart = k,
          agePoint = actual + i / 12,
          monthOfYear = Math.max(1, Number(String(datePoint || "").slice(5, 7)) || 1),
          monthsCompleted = Math.max(1, monthOfYear - 1),
          acaContext = {
            annualCapitalGains:
              bridgeYtdBrokerageGains > 0
                ? (bridgeYtdBrokerageGains / monthsCompleted) * 12
                : Math.max(0, n(s.annualRetirementSpend, 0)) *
                  brokerageGainRateProxy(s),
            annualSSIncome: agePoint >= claim ? ss * 12 : 0,
          },
          spend = monthlyRetirementNeedAtAge(s, agePoint, acaContext),
          annualSpend = annualRetirementNeedAtAge(s, agePoint, acaContext),
          grownBrokerage = b * (1 + bPost),
          bridgeDraw = withdrawBrokerageWithBasis(
            grownBrokerage,
            bBasis,
            spend,
            brokerageGainRateProxy(s),
          ),
          bridgeWithdraw = bridgeDraw.withdrawal,
          bridgeGap = Math.max(0, spend - bridgeWithdraw);
        b = bridgeDraw.nextBalance;
        bBasis = bridgeDraw.nextBasis;
        bridgeYtdBrokerageGains += bridgeDraw.taxableGains;
        k = k * (1 + kPost);
        pushB(agePoint, b);
        pushK(agePoint, k);
        pushCash(agePoint, 0, annualSpend, 0, bridgeWithdraw * 12, bridgeGap * 12);
        pushMonth({
          date: datePoint,
          age: agePoint,
          phase: "Bridge",
          salaryAnnualized: 0,
          brokerageMonthlyPlanned: 0,
          contributionPctPlanned: 0,
          employerMatchPctPlanned: 0,
          k401EmployeeContribution: 0,
          k401EmployerContribution: 0,
          brokerageStart: bStart,
          brokerageEnd: b,
          k401Start: kStart,
          k401End: k,
          brokerageContribution: 0,
          k401Contribution: 0,
          brokerageWithdrawal: bridgeWithdraw,
          k401Withdrawal: 0,
          brokerageTaxableGains: bridgeDraw.taxableGains,
          wagesIncome: 0,
          withdrawalStrategy: "bridge",
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
      bsBasis = Math.max(0, Math.min(bUnlock, bBasis)),
      kOnly = Math.max(0, kUnlock),
      life = null,
      taxAwareYear = null,
      taxAwareCapRemaining = Math.max(
        0,
        n(withdrawalConfig?.taxAwareAnnualCap, 0),
      ),
      ytd401kWithdrawn = 0,
      ytdBrokerageGains = 0,
      ytdSSIncome = 0;
    cSeries.push({ x: start, y: bs + ks });
    const totalMonths = Math.max(0, Math.round((110 - start) * 12));
    for (let i = 1; i <= totalMonths; i++) {
      const a = start + i / 12,
        income = a >= claim ? ss : 0,
        before = bs + ks,
        datePoint = addMonthsIso(startDate, mRet + Math.max(0, Math.ceil((start - actual) * 12 - 1e-9)) + i),
        yearKey = String(datePoint || "").slice(0, 4),
        bStart = bs,
        kStart = ks;
      if (
        strategyUsesTaxInputs(withdrawalConfig?.strategy) &&
        taxAwareYear !== yearKey
      ) {
        taxAwareYear = yearKey;
        taxAwareCapRemaining = Math.max(
          0,
          n(withdrawalConfig?.taxAwareAnnualCap, 0),
        );
        ytd401kWithdrawn = 0;
        ytdBrokerageGains = 0;
        ytdSSIncome = 0;
      }
      const monthOfYear = Math.max(1, Number(String(datePoint || "").slice(5, 7)) || 1),
        monthsCompleted = Math.max(1, monthOfYear - 1),
        acaContext = acaRetirementIncomeContext(
          s,
          income,
          ytd401kWithdrawn,
          ytdBrokerageGains,
          monthsCompleted,
        ),
        spend = monthlyRetirementNeedAtAge(s, a, acaContext),
        annualSpend = annualRetirementNeedAtAge(s, a, acaContext),
        need = Math.max(0, spend - income);
      const previewDraw = drawFromAccounts(
        0,
        kOnly,
        need,
        { strategy: "k401First", reserveYears: 0 },
        spend,
      ),
      kWithdraw = previewDraw.k401Withdraw,
      bWithdraw = previewDraw.brokerageWithdraw;
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
          salaryAnnualized: 0,
          brokerageMonthlyPlanned: 0,
          contributionPctPlanned: 0,
          employerMatchPctPlanned: 0,
          k401EmployeeContribution: 0,
          k401EmployerContribution: 0,
          brokerageStart: bStart,
          brokerageEnd: 0,
          k401Start: kStart,
          k401End: 0,
          brokerageContribution: 0,
          k401Contribution: 0,
          brokerageWithdrawal: 0,
          k401Withdrawal: 0,
          brokerageTaxableGains: 0,
          wagesIncome: 0,
          withdrawalStrategy: need > 0 ? "unfunded" : "noneNeeded",
          ssIncome: income,
          spend,
          gap: need,
        });
        break;
      }
      let actualKWithdraw = 0,
        actualBWithdraw = 0,
        actualGap = 0,
        actualBrokerageGains = 0,
        actualChosenStrategy =
          need > 0
            ? withdrawalConfig?.strategy || "k401First"
            : "noneNeeded";
      if (need > 0) {
        const draw = drawFromAccounts(
          bs,
          ks,
          need,
          withdrawalConfig,
          spend,
          {
            taxAwareCapRemaining,
            ytd401kWithdrawn,
            ytdBrokerageGains,
            ytdSSIncome,
            brokerageBasis: bsBasis,
            taxFilingStatus: s.scenarioTaxFilingStatus,
            stateTaxRate: s.scenarioStateTaxRate,
            postReturnAnnual: r.post,
            k401PostReturnAnnual: r.kpost,
          },
        );
        bs = draw.brokerage;
        ks = draw.k401;
        actualKWithdraw = draw.k401Withdraw;
        actualBWithdraw = draw.brokerageWithdraw;
        actualGap = draw.gap;
        actualBrokerageGains = draw.brokerageTaxableGainsRealized;
        actualChosenStrategy =
          draw.chosenStrategy || withdrawalConfig?.strategy || "k401First";
        bsBasis = draw.nextBrokerageBasis;
        taxAwareCapRemaining = draw.nextTaxAwareCapRemaining;
        ytd401kWithdrawn += draw.k401Withdraw;
        ytdBrokerageGains += draw.brokerageTaxableGainsRealized;
        ytdSSIncome += income;
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
        salaryAnnualized: 0,
        brokerageMonthlyPlanned: 0,
        contributionPctPlanned: 0,
        employerMatchPctPlanned: 0,
        k401EmployeeContribution: 0,
        k401EmployerContribution: 0,
        brokerageStart: bStart,
        brokerageEnd: bs,
        k401Start: kStart,
        k401End: ks,
        brokerageContribution: 0,
        k401Contribution: 0,
        brokerageWithdrawal: actualBWithdraw,
        k401Withdrawal: actualKWithdraw,
        brokerageTaxableGains: actualBrokerageGains,
        wagesIncome: 0,
        withdrawalStrategy: actualChosenStrategy,
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
      annualSS = ss * 12,
      annualNeedAtUnlock = annualRetirementNeedAtAge(s, Math.max(start, unlock));
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
      annualGapOrSurplus: sustain + annualSS - annualNeedAtUnlock,
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
  function fullPlanViableAtAge(
    s,
    f,
    retirementAge,
    r,
    withdrawalConfig = { strategy: "k401First", reserveYears: 2 },
  ) {
    const result = project(
        s,
        f,
        retirementAge,
        r,
        withdrawalConfig,
      ),
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
  function earliestFullPlan(
    s,
    f,
    r,
    withdrawalConfig = { strategy: "k401First", reserveYears: 2 },
  ) {
    const cur = computeAge(s),
      max = Math.max(0, Math.round((75 - cur) * 12));
    for (let i = 0; i <= max; i++) {
      const a = cur + i / 12,
        outcome = fullPlanViableAtAge(s, f, a, r, withdrawalConfig);
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
    if (
      normalizeSsEstimateMode(stateLike.ssEstimateMode) === "statementXml" &&
      hasStatementBenefits(stateLike)
    ) {
      return {
        annualSS,
        claimAge,
        retireAge,
        yearsEarly,
        text: `Statement XML mode is active. The planner uses your imported SSA estimate for age ${num(claimAge, 0)} and reduces it when work stops around age ${age(retireAge)} by comparing top-35 covered earnings with and without those future work years.`,
      };
    }
    return {
      annualSS,
      claimAge,
      retireAge,
      yearsEarly,
      text: `The planner currently treats Social Security as a fixed ${money(annualSS)}/year beginning at age ${age(claimAge)}. If you stop working around age ${age(retireAge)}, that estimate may be overstated if it came from a projection assuming more future earnings before claim age.`,
    };
  }
  function strategyConfidenceNote(stateLike) {
    const notes = [
      "Withdrawal strategy results are still heuristic because brokerage basis starts from an embedded gain estimate rather than true lots, and full multi-year tax optimization is not modeled yet.",
    ];
    const ssQuality = ssStatementDataQuality(stateLike);
    if (ssQuality?.level === "warn") notes.push(ssQuality.text);
    else
      notes.push(
        "Estimated federal tax now includes ordinary-income tax on 401k withdrawals, evolving realized brokerage gains from the planner’s basis estimate, and partial Social Security taxation.",
      );
    if (n(stateLike.preMedicareHealthcareCost, 0) <= 0)
      notes.push(
      "Pre-65 healthcare cost is currently zero, so ACA policy risk is not adding any extra spending pressure to the plan.",
      );
    if ((stateLike.acaHealthcareMode || "manual") === "incomeSensitive")
      notes.push(
        `Income-sensitive ACA mode is using ${acaSubsidyRuleLabel(stateLike.acaSubsidyRule).toLowerCase()}. It estimates ACA-sensitive income from wages before retirement, then from 401k withdrawals, taxable brokerage gains, and Social Security after retirement, until a fuller MAGI-based subsidy model is added.`,
      );
    return notes.join(" ");
  }
  function confidenceSignals(stateLike) {
    const signals = [];
    const ssQuality = ssStatementDataQuality(stateLike),
      earningsCount = (stateLike.ssStatementEarningsHistory || []).length,
      healthcareIncomeSensitive =
        (stateLike.acaHealthcareMode || "manual") === "incomeSensitive",
      healthcareConfigured =
        n(stateLike.preMedicareHealthcareCost, 0) > 0 ||
        (healthcareIncomeSensitive &&
          n(stateLike.acaBenchmarkAnnualPremium, 0) > 0 &&
          ((stateLike.acaSubsidyRule || "irsSchedule") === "irsSchedule" ||
            n(stateLike.acaIncomeCapPct, 0) > 0)),
      taxAware = strategyUsesTaxInputs(stateLike.scenarioWithdrawalStrategy),
      gainRateConfigured = n(stateLike.scenarioBrokerageGainRate, 0) > 0,
      monteRuns = n(stateLike.monteCarloRuns, 1000);
    if (normalizeSsEstimateMode(stateLike.ssEstimateMode) === "statementXml") {
      signals.push(
        ssQuality?.level === "warn"
          ? {
              title: "Social Security Data",
              cls: "bad",
              badge: "Low",
              note: ssQuality.text,
              action: "importSsXml",
              actionLabel: "Import SSA XML",
            }
          : {
              title: "Social Security Data",
              cls: earningsCount >= 20 ? "good" : "okay",
              badge: earningsCount >= 20 ? "Strong" : "Medium",
              note:
                earningsCount >= 20
                  ? "Statement-based Social Security estimates and earnings history are loaded for the stop-work adjustment."
                  : `Statement-based Social Security is active, but only ${earningsCount} yearly earnings rows were imported, so the stop-work adjustment is still somewhat fragile.`,
              action: earningsCount >= 20 ? null : "importSsXml",
              actionLabel: earningsCount >= 20 ? null : "Re-import SSA XML",
            },
      );
    } else {
      const ssRisk = ssEstimateRisk(stateLike, stateLike.targetRetirementAge);
      signals.push({
        title: "Social Security Data",
        cls: ssRisk ? "okay" : "bad",
        badge: ssRisk ? "Medium" : "Low",
        note:
          ssRisk?.text ||
          "Manual Social Security input is active. That keeps the planner usable, but it is less reliable than statement-based stop-work modeling.",
        action: "importSsXml",
        actionLabel: "Import SSA XML",
      });
    }
    signals.push({
      title: "Healthcare Model",
      cls:
        healthcareIncomeSensitive &&
        healthcareConfigured &&
        (stateLike.acaSubsidyRule || "irsSchedule") === "irsSchedule"
          ? "good"
          : healthcareConfigured
            ? "okay"
            : "bad",
      badge:
        healthcareIncomeSensitive &&
        healthcareConfigured &&
        (stateLike.acaSubsidyRule || "irsSchedule") === "irsSchedule"
          ? "Stronger"
          : healthcareConfigured
            ? "Medium"
            : "Low",
      note:
        healthcareIncomeSensitive && healthcareConfigured
          ? (stateLike.acaSubsidyRule || "irsSchedule") === "irsSchedule"
            ? "Income-sensitive ACA mode is active with household size, benchmark premium, and the planner’s IRS premium-tax-credit schedule option, which is the strongest healthcare setup currently available in the planner."
            : "Income-sensitive ACA mode is active, but the subsidy side still depends on your custom premium-cap assumption rather than the planner’s IRS schedule option."
          : n(stateLike.preMedicareHealthcareCost, 0) > 0
            ? "Manual pre-Medicare healthcare cost is active, which is better than omitting healthcare entirely, but still not a full ACA subsidy model."
            : "Pre-Medicare healthcare cost is set to $0, so the planner is likely understating early-retirement spending risk before age 65.",
      action:
        healthcareIncomeSensitive
          ? "openSettings"
          : "enableIncomeAca",
      actionLabel:
        healthcareIncomeSensitive
          ? "Open ACA settings"
          : "Use income-sensitive ACA",
    });
    signals.push({
      title: "Tax Model",
      cls:
        taxAware && gainRateConfigured
          ? "okay"
          : "bad",
      badge:
        taxAware && gainRateConfigured
          ? "Medium"
          : "Low",
      note:
        taxAware && gainRateConfigured
          ? "The planner models federal ordinary income, LTCG tax, partial Social Security taxation, and flat state tax, but not lot basis, ACA cliffs, or a full multi-year optimizer."
          : "The selected withdrawal strategy is not tax-aware, so the recommendation is being made without optimizing around estimated tax drag.",
      action:
        taxAware
          ? "openStrategySettings"
          : "enableTaxAware",
      actionLabel:
        taxAware
          ? "Review tax settings"
          : "Enable tax-aware mode",
    });
    signals.push({
      title: "Monte Carlo Guidance",
      cls: monteRuns >= 2000 ? "good" : monteRuns >= 1000 ? "okay" : "bad",
      badge: monteRuns >= 2000 ? "Stronger" : monteRuns >= 1000 ? "Medium" : "Low",
      note: `The main Monte Carlo panel uses ${num(monteRuns, 0)} runs, but the target-success action solver uses a reduced run count for responsiveness. Treat the action cards as planning guidance, not precise probability guarantees.`,
      action: "raiseMonteRuns",
      actionLabel: "Increase MC runs",
    });
    return signals;
  }
  function renderConfidencePanel(stateLike) {
    if (!ui.confidenceSummary || !ui.confidenceCards) return;
    const signals = confidenceSignals(stateLike),
      score = signals.reduce(
        (sum, signal) =>
          sum + (signal.cls === "good" ? 2 : signal.cls === "okay" ? 1 : 0),
        0,
      ),
      overall =
        score >= 6
          ? { cls: "good", badge: "Higher confidence" }
          : score >= 3
            ? { cls: "okay", badge: "Mixed confidence" }
            : { cls: "bad", badge: "Lower confidence" },
      weakest = signals
        .filter((signal) => signal.cls !== "good")
        .map((signal) => signal.title.toLowerCase())
        .join(", ");
    ui.confidenceSummary.innerHTML = `<p><span class="badge ${overall.cls}">${overall.badge}</span> The current What If recommendations are strongest when Social Security data is statement-based, pre-65 healthcare is modeled realistically, and tax-aware strategy mode is active. ${weakest ? `Right now the weakest confidence areas are ${weakest}.` : "The major modeling inputs are currently in relatively strong shape."}</p>`;
    ui.confidenceCards.innerHTML = signals
      .map(
        (signal) => `<article class="card"><div class="top"><div><h3>${signal.title}</h3><p class="sub">${signal.note}</p></div><span class="badge ${signal.cls}">${signal.badge}</span></div>${signal.action ? `<div style="margin-top:.8rem"><button class="miniBtn" type="button" data-confidence-action="${signal.action}">${signal.actionLabel || "Take action"}</button></div>` : ""}</article>`,
      )
      .join("");
  }
  function setFieldEnabled(element, enabled) {
    if (!element) return;
    element.disabled = !enabled;
    element.closest(".field")?.classList.toggle("isDisabled", !enabled);
  }
  function updateStrategyControlState(currentState = state) {
    const strategy = currentState.scenarioWithdrawalStrategy || "k401First",
      reserveEnabled = strategyUsesReserveInputs(strategy),
      taxCapEnabled = strategyUsesTaxInputs(strategy);
    ui.scenarioReserveField?.classList.toggle("hidden", !reserveEnabled);
    ui.scenarioTaxCapField?.classList.toggle("hidden", !taxCapEnabled);
    ui.scenarioTaxStatusField?.classList.toggle("hidden", !taxCapEnabled);
    ui.scenarioTaxGainField?.classList.toggle("hidden", !taxCapEnabled);
    ui.scenarioStateTaxField?.classList.toggle("hidden", !taxCapEnabled);
    setFieldEnabled(ui.scenarioBrokerageReserveYears, reserveEnabled);
    setFieldEnabled(ui.scenarioTaxAwareAnnualCap, taxCapEnabled);
    setFieldEnabled(ui.scenarioTaxFilingStatus, taxCapEnabled);
    setFieldEnabled(ui.scenarioBrokerageGainRate, taxCapEnabled);
    setFieldEnabled(ui.scenarioStateTaxRate, taxCapEnabled);
    if (!ui.strategyControlNote) return;
    const conditionalText =
      strategy === "goalAware"
        ? `Adaptive optimizer is active. It can switch month by month between 401k first, brokerage first, pro-rata, brokerage reserve, and tax-aware behavior based on your ${optimizationGoalLabel(currentState.scenarioOptimizationGoal || "balanced").toLowerCase()} goal. Reserve years is set to ${num(
            n(currentState.scenarioBrokerageReserveYears, 2),
            1,
          )}, and the tax-aware cap is ${money(
            n(currentState.scenarioTaxAwareAnnualCap, 30000),
            0,
          )}/year.`
        : reserveEnabled
          ? `Reserve years is active and keeps about ${num(
              n(currentState.scenarioBrokerageReserveYears, 2),
              1,
            )} years of spending in brokerage when possible.`
          : taxCapEnabled
            ? `The tax-aware cap is active and tries to keep annual 401k withdrawals near ${money(
                n(currentState.scenarioTaxAwareAnnualCap, 30000),
                0,
              )} before leaning harder on brokerage, while estimating tax with ${pct(
                n(currentState.scenarioBrokerageGainRate, 60),
              )} as the starting embedded brokerage gain estimate, a flat ${pct(
                n(currentState.scenarioStateTaxRate, 0),
              )} state tax layer, and partial Social Security taxation.`
            : "Reserve years and the annual 401k cap are inactive for the selected strategy.";
    ui.strategyControlNote.textContent = `These controls affect only the What If withdrawal strategy panels, scenario charts, scenario summary, and Monte Carlo. They do not change Am I On Track? The optimization goal changes which strategy gets the recommendation badge. ${conditionalText}`;
  }
  function taxProfileForStatus(status) {
    if (status === "marriedJoint") {
      return {
        label: "Married filing jointly",
        standardDeduction: 32200,
        brackets: [
          { cap: 24800, rate: 0.1 },
          { cap: 100800, rate: 0.12 },
          { cap: 211400, rate: 0.22 },
          { cap: 403550, rate: 0.24 },
          { cap: 512450, rate: 0.32 },
          { cap: 768700, rate: 0.35 },
          { cap: Infinity, rate: 0.37 },
        ],
        capitalGainsZeroCap: 98900,
        capitalGainsFifteenCap: 613700,
      };
    }
    return {
      label: "Single",
      standardDeduction: 16100,
      brackets: [
        { cap: 12400, rate: 0.1 },
        { cap: 50400, rate: 0.12 },
        { cap: 105700, rate: 0.22 },
        { cap: 201775, rate: 0.24 },
        { cap: 256225, rate: 0.32 },
        { cap: 640600, rate: 0.35 },
        { cap: Infinity, rate: 0.37 },
      ],
      capitalGainsZeroCap: 49450,
      capitalGainsFifteenCap: 545500,
    };
  }
  function estimateFederalOrdinaryTax(grossOrdinaryIncome, filingStatus) {
    const profile = taxProfileForStatus(filingStatus),
      taxableIncome = Math.max(0, n(grossOrdinaryIncome, 0) - profile.standardDeduction);
    let tax = 0,
      priorCap = 0,
      remaining = taxableIncome;
    for (const bracket of profile.brackets) {
      if (remaining <= 0) break;
      const width = Math.min(remaining, bracket.cap - priorCap);
      tax += Math.max(0, width) * bracket.rate;
      remaining -= Math.max(0, width);
      priorCap = bracket.cap;
    }
    return tax;
  }
  function estimateTaxableSocialSecurity(ssBenefits, otherIncome, filingStatus) {
    const benefits = Math.max(0, n(ssBenefits, 0)),
      other = Math.max(0, n(otherIncome, 0));
    if (!(benefits > 0)) return 0;
    const isJoint = filingStatus === "marriedJoint",
      base1 = isJoint ? 32000 : 25000,
      base2 = isJoint ? 44000 : 34000,
      tier1Max = isJoint ? 6000 : 4500,
      provisionalIncome = other + benefits * 0.5;
    if (provisionalIncome <= base1) return 0;
    if (provisionalIncome <= base2) {
      return Math.min(benefits * 0.5, (provisionalIncome - base1) * 0.5);
    }
    return Math.min(
      benefits * 0.85,
      (provisionalIncome - base2) * 0.85 + Math.min(tier1Max, benefits * 0.5),
    );
  }
  function estimateFederalTaxBreakdown(
    grossOrdinaryIncome,
    grossCapitalGains,
    ssBenefits,
    filingStatus,
  ) {
    const profile = taxProfileForStatus(filingStatus),
      ordinaryIncome = Math.max(0, n(grossOrdinaryIncome, 0)),
      capitalGains = Math.max(0, n(grossCapitalGains, 0)),
      benefits = Math.max(0, n(ssBenefits, 0)),
      taxableSS = estimateTaxableSocialSecurity(
        benefits,
        ordinaryIncome + capitalGains,
        filingStatus,
      ),
      totalOrdinaryIncome = ordinaryIncome + taxableSS,
      standardDeduction = profile.standardDeduction,
      taxableOrdinary = Math.max(0, totalOrdinaryIncome - standardDeduction),
      deductionLeftForGains = Math.max(0, standardDeduction - totalOrdinaryIncome),
      taxableGains = Math.max(0, capitalGains - deductionLeftForGains),
      ordinaryTax = estimateFederalOrdinaryTax(totalOrdinaryIncome, filingStatus);
    let capitalGainsTax = 0;
    if (taxableGains > 0) {
      const zeroRoom = Math.max(
          0,
          profile.capitalGainsZeroCap - taxableOrdinary,
        ),
        gainsAtZero = Math.min(taxableGains, zeroRoom),
        remainingAfterZero = taxableGains - gainsAtZero,
        fifteenRoom = Math.max(
          0,
          profile.capitalGainsFifteenCap -
            (taxableOrdinary + gainsAtZero),
        ),
        gainsAtFifteen = Math.min(remainingAfterZero, fifteenRoom),
        gainsAtTwenty = Math.max(0, remainingAfterZero - gainsAtFifteen);
      capitalGainsTax = gainsAtFifteen * 0.15 + gainsAtTwenty * 0.2;
    }
    return {
      ordinaryTax,
      capitalGainsTax,
      totalTax: ordinaryTax + capitalGainsTax,
      taxableSS,
      taxableOrdinary,
      taxableGains,
    };
  }
  function estimatePlannerTaxBreakdown(
    grossOrdinaryIncome,
    grossCapitalGains,
    ssBenefits,
    filingStatus,
    stateTaxRate,
  ) {
    const federal = estimateFederalTaxBreakdown(
        grossOrdinaryIncome,
        grossCapitalGains,
        ssBenefits,
        filingStatus,
      ),
      flatStateRate = Math.max(0, Math.min(0.2, n(stateTaxRate, 0) / 100)),
      stateTaxBase = Math.max(
        0,
        n(grossOrdinaryIncome, 0) + n(grossCapitalGains, 0),
      ),
      stateTax = stateTaxBase * flatStateRate;
    return {
      ...federal,
      stateTax,
      totalTax: federal.totalTax + stateTax,
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
      rate = mRate(r.post);
    let lo = 0,
      hi = 1e7;
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2;
      let bal = mid;
      for (let m = 0; m < months; m++) {
        const agePoint = target + (m + 1) / 12,
          spend = monthlyRetirementNeedAtAge(s, agePoint, {
            annualCapitalGains:
              Math.max(0, n(s.annualRetirementSpend, 0)) * brokerageGainRateProxy(s),
            annualSSIncome:
              agePoint >= n(s.ssClaimAge, 62) ? ssMonthly(s) * 12 : 0,
          });
        bal = Math.max(0, bal * (1 + rate) - spend);
      }
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
  function isFullPlanViable(
    stateLike,
    fundKey,
    rates,
    withdrawalConfig = { strategy: "k401First", reserveYears: 2 },
  ) {
    const retirementAge = Math.max(
        computeAge(stateLike),
        n(stateLike.targetRetirementAge),
      ),
      result = project(
        stateLike,
        fundKey,
        retirementAge,
        rates,
        withdrawalConfig,
      ),
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
  function stateWithForwardContributionOverrides(stateLike, overrides = {}) {
    const effectiveDate = stateLike.currentDate || today,
      seed =
        activeAssumptionEntryForState(stateLike, effectiveDate) || {
          monthlyBrokerageContribution: n(stateLike.monthlyBrokerageContribution),
          annualSalary: n(stateLike.annualSalary),
          contributionPct: normalizeContributionPct(stateLike.contributionPct),
          employerMatchPct: resolveEmployerMatchPct(
            stateLike.contributionPct,
            stateLike.employerMatchPct,
          ),
        };
    const nextContributionPct =
        overrides.contributionPct == null
          ? normalizeContributionPct(seed.contributionPct, stateLike.contributionPct)
          : normalizeContributionPct(overrides.contributionPct, seed.contributionPct),
      nextEmployerMatchPct =
        overrides.employerMatchPct == null
          ? resolveEmployerMatchPct(nextContributionPct, seed.employerMatchPct)
          : Math.max(
              0,
              n(
                overrides.employerMatchPct,
                resolveEmployerMatchPct(nextContributionPct, seed.employerMatchPct),
              ),
            ),
      nextBrokerageContribution =
        overrides.monthlyBrokerageContribution == null
          ? n(seed.monthlyBrokerageContribution, stateLike.monthlyBrokerageContribution)
          : Math.max(
              0,
              n(
                overrides.monthlyBrokerageContribution,
                seed.monthlyBrokerageContribution,
              ),
            ),
      nextSalary =
        overrides.annualSalary == null
          ? n(seed.annualSalary, stateLike.annualSalary)
          : Math.max(0, n(overrides.annualSalary, seed.annualSalary)),
      rows = [...(stateLike.assumptionHistory || [])].map((row) => {
        const effective = row.effectiveDate || row.date || effectiveDate,
          next = { ...row, effectiveDate: effective };
        if (effective >= effectiveDate) {
          next.monthlyBrokerageContribution = nextBrokerageContribution;
          next.annualSalary = nextSalary;
          next.contributionPct = nextContributionPct;
          next.employerMatchPct = nextEmployerMatchPct;
        }
        return next;
      }),
      hasExact = rows.some((row) => row.effectiveDate === effectiveDate);
    if (!hasExact) {
      rows.push({
        timestamp: `scenario-${effectiveDate}`,
        effectiveDate,
        monthlyBrokerageContribution: nextBrokerageContribution,
        annualSalary: nextSalary,
        contributionPct: nextContributionPct,
        employerMatchPct: nextEmployerMatchPct,
      });
    }
    return {
      ...stateLike,
      monthlyBrokerageContribution: nextBrokerageContribution,
      annualSalary: nextSalary,
      contributionPct: nextContributionPct,
      employerMatchPct: nextEmployerMatchPct,
      assumptionHistory: rows,
    };
  }
  function seriesValueAtAge(series, targetAge) {
    const points = Array.isArray(series) ? series : [];
    if (!points.length) return 0;
    let prior = points[0];
    for (const point of points) {
      if (n(point?.x, 0) > targetAge + 1e-9) break;
      prior = point;
    }
    return Math.max(0, n(prior?.y, 0));
  }
  function totalWithdrawn(monthlyBreakdown, key) {
    return (monthlyBreakdown || []).reduce(
      (sum, row) => sum + Math.max(0, n(row?.[key], 0)),
      0,
    );
  }
  function evaluateWithdrawalStrategy(stateLike, fundKey, rates, withdrawalConfig) {
    const targetAge = Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge)),
      full = fullPlanViableAtAge(
        stateLike,
        fundKey,
        targetAge,
        rates,
        withdrawalConfig,
      ),
      result = full.result,
      yearlyRows = buildYearlyPlanRows(result, stateLike),
      adaptiveSummary = summarizeAdaptiveChoices(result.monthlyBreakdown, stateLike),
      taxes = yearlyTaxTotals(
        yearlyRows.filter((row) => n(row.ageStart, 0) < 75.999),
        stateLike,
      ),
      gapTotal = (result.cashflowGapSeries || []).reduce(
        (sum, point) => sum + Math.max(0, n(point?.y, 0)),
        0,
      );
    return {
      key: withdrawalConfig.strategy,
      label: strategyLabel(withdrawalConfig.strategy, stateLike),
      description:
        withdrawalStrategies(stateLike).find(
          (entry) => entry.key === withdrawalConfig.strategy,
        )?.description || "",
      viable: full.viable,
      result,
      age75Balance: seriesValueAtAge(result.combinedSeries, 75),
      brokerageAt75: seriesValueAtAge(result.brokerageSeries, 75),
      k401At75: seriesValueAtAge(result.k401Series, 75),
      totalBrokerageWithdrawn: totalWithdrawn(
        result.monthlyBreakdown,
        "brokerageWithdrawal",
      ),
      total401kWithdrawn: totalWithdrawn(
        result.monthlyBreakdown,
        "k401Withdrawal",
      ),
      totalEstimatedTaxTo75: taxes.totalTax,
      totalEstimatedFederalTaxTo75: taxes.federalTax,
      totalEstimatedStateTaxTo75: taxes.stateTax,
      totalEstimatedCapitalGainsTaxTo75: taxes.capitalGainsTax,
      totalEstimatedTaxableSSTo75: taxes.taxableSS,
      totalGap: gapTotal,
      adaptiveSummary,
    };
  }
  function minBrokerageContributionForTarget(
    stateLike,
    fundKey,
    rates,
    withdrawalConfig,
  ) {
    const retirementAge = Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge)),
      tester = (amount) =>
        fullPlanViableAtAge(
          stateWithForwardContributionOverrides(stateLike, {
            monthlyBrokerageContribution: amount,
          }),
          fundKey,
          retirementAge,
          rates,
          withdrawalConfig,
        ).viable;
    if (tester(0)) return 0;
    let lo = 0,
      hi = Math.max(1000, n(stateLike.monthlyBrokerageContribution, 0));
    while (!tester(hi) && hi < 100000) hi *= 2;
    if (hi >= 100000 && !tester(hi)) return null;
    for (let i = 0; i < 45; i += 1) {
      const mid = (lo + hi) / 2;
      if (tester(mid)) hi = mid;
      else lo = mid;
    }
    return Math.ceil(hi / 50) * 50;
  }
  function min401kContributionPctForTarget(
    stateLike,
    fundKey,
    rates,
    withdrawalConfig,
  ) {
    const retirementAge = Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge)),
      tester = (pctValue) =>
        fullPlanViableAtAge(
          stateWithForwardContributionOverrides(stateLike, {
            contributionPct: pctValue,
          }),
          fundKey,
          retirementAge,
          rates,
          withdrawalConfig,
        ).viable;
    if (tester(0)) return 0;
    let lo = 0,
      hi = Math.max(1, normalizeContributionPct(stateLike.contributionPct, 0));
    while (!tester(hi) && hi < 40) hi += 1;
    if (hi >= 40 && !tester(hi)) return null;
    for (let i = 0; i < 35; i += 1) {
      const mid = (lo + hi) / 2;
      if (tester(mid)) hi = mid;
      else lo = mid;
    }
    return Math.ceil(hi * 10) / 10;
  }
  function buildSavingsTradeoffExamples(
    stateLike,
    fundKey,
    rates,
    withdrawalConfig,
  ) {
    const currentPct = normalizeContributionPct(stateLike.contributionPct, 0),
      samplePcts = Array.from(
        new Set([0, Math.min(6, currentPct), 6, currentPct, 8].map((value) => Math.max(0, value))),
      )
        .sort((a, b) => a - b)
        .slice(0, 5);
    return samplePcts
      .map((pctValue) => ({
        pct: pctValue,
        brokerage: minBrokerageContributionForTarget(
          stateWithForwardContributionOverrides(stateLike, {
            contributionPct: pctValue,
          }),
          fundKey,
          rates,
          withdrawalConfig,
        ),
      }))
      .filter((row) => row.brokerage != null)
      .sort((a, b) => a.brokerage - b.brokerage);
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
    setVal(
      "annualSalaryGrowthRate",
      state.annualSalaryGrowthRate,
      "percent",
    );
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
    setVal(
      "preMedicareHealthcareCost",
      state.preMedicareHealthcareCost,
      "currency",
    );
    if (ui.acaHealthcareMode)
      ui.acaHealthcareMode.value = String(
        state.acaHealthcareMode || "manual",
      );
    if (ui.acaSubsidyRule)
      ui.acaSubsidyRule.value = String(
        state.acaSubsidyRule || "irsSchedule",
      );
    setVal(
      "acaBenchmarkAnnualPremium",
      state.acaBenchmarkAnnualPremium,
      "currency",
    );
    setVal("acaIncomeCapPct", state.acaIncomeCapPct, "percent");
    setVal("acaHouseholdSize", state.acaHouseholdSize, "select");
    setVal("acaStressMultiplier", state.acaStressMultiplier, "percent");
    if (ui.acaPolicyPreset)
      ui.acaPolicyPreset.value = String(
        inferAcaPolicyPreset(state.acaStressMultiplier),
      );
    updateAcaHealthcareModeUi(state);
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
    if (ui.monteTargetAge)
      ui.monteTargetAge.value = String(
        Math.max(90, Math.min(100, Math.round(n(state.monteTargetAge, 95)))),
      );
    setVal("monteTargetSuccess", state.monteTargetSuccess, "percent");
    if (ui.scenarioStrategyFund)
      ui.scenarioStrategyFund.value = String(state.scenarioStrategyFund || "iyw");
    if (ui.scenarioWithdrawalStrategy)
      ui.scenarioWithdrawalStrategy.value = String(
        state.scenarioWithdrawalStrategy || "k401First",
      );
    if (ui.scenarioOptimizationGoal)
      ui.scenarioOptimizationGoal.value = String(
        state.scenarioOptimizationGoal || "balanced",
      );
    setVal("scenarioBrokerageReserveYears", state.scenarioBrokerageReserveYears);
    setVal("scenarioTaxAwareAnnualCap", state.scenarioTaxAwareAnnualCap, "currency");
    if (ui.scenarioTaxFilingStatus)
      ui.scenarioTaxFilingStatus.value = String(
        state.scenarioTaxFilingStatus || "single",
      );
    setVal("scenarioBrokerageGainRate", state.scenarioBrokerageGainRate, "percent");
    setVal("scenarioStateTaxRate", state.scenarioStateTaxRate, "percent");
    updateStrategyControlState(state);
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
    renderSsSettingsPanel();
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
    if (days <= 0) return "Today";
    if (days === 1) return "1 day ago";
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
  function buildYearlyPlanRows(result, stateLike = state) {
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
            salaryStart: n(row.salaryAnnualized, 0),
            salaryEnd: n(row.salaryAnnualized, 0),
            brokerageMonthlyStart: n(row.brokerageMonthlyPlanned, 0),
            brokerageMonthlyEnd: n(row.brokerageMonthlyPlanned, 0),
            contributionPctStart: n(row.contributionPctPlanned, 0),
            contributionPctEnd: n(row.contributionPctPlanned, 0),
            employerMatchPctStart: n(row.employerMatchPctPlanned, 0),
            employerMatchPctEnd: n(row.employerMatchPctPlanned, 0),
            brokerageStart: n(row.brokerageStart),
            brokerageEnd: n(row.brokerageEnd),
            k401Start: n(row.k401Start),
            k401End: n(row.k401End),
            brokerageContribution: 0,
            k401Contribution: 0,
            k401EmployeeContribution: 0,
            k401EmployerContribution: 0,
            brokerageWithdrawal: 0,
            k401Withdrawal: 0,
            brokerageTaxableGains: 0,
            wagesIncome: 0,
            ssIncome: 0,
            spend: 0,
            gap: 0,
            withdrawalStrategies: new Set(),
          });
      }
      const bucket = grouped.get(year);
      bucket.endDate = row.date;
      bucket.ageEnd = row.age;
      bucket.phases.add(row.phase);
      bucket.salaryEnd = n(row.salaryAnnualized, 0);
      bucket.brokerageMonthlyEnd = n(row.brokerageMonthlyPlanned, 0);
      bucket.contributionPctEnd = n(row.contributionPctPlanned, 0);
      bucket.employerMatchPctEnd = n(row.employerMatchPctPlanned, 0);
      bucket.brokerageEnd = n(row.brokerageEnd);
      bucket.k401End = n(row.k401End);
      bucket.brokerageContribution += n(row.brokerageContribution);
      bucket.k401Contribution += n(row.k401Contribution);
      bucket.k401EmployeeContribution += n(row.k401EmployeeContribution);
      bucket.k401EmployerContribution += n(row.k401EmployerContribution);
      bucket.brokerageWithdrawal += n(row.brokerageWithdrawal);
      bucket.k401Withdrawal += n(row.k401Withdrawal);
      bucket.brokerageTaxableGains += n(row.brokerageTaxableGains);
      bucket.wagesIncome += n(row.wagesIncome);
      bucket.ssIncome += n(row.ssIncome);
      bucket.spend += n(row.spend);
      bucket.gap += n(row.gap);
      if (row.withdrawalStrategy) {
        bucket.withdrawalStrategies.add(row.withdrawalStrategy);
      }
    }
    return [...grouped.values()].map((row) => ({
      ...row,
      phaseLabel: [...row.phases].join(" / "),
      salaryLabel:
        Math.abs(n(row.salaryStart, 0) - n(row.salaryEnd, 0)) < 0.5
          ? `Salary ${money(row.salaryEnd)}`
          : `Salary ${money(row.salaryStart)} -> ${money(row.salaryEnd)}`,
      brokeragePlanLabel:
        Math.abs(n(row.brokerageMonthlyStart, 0) - n(row.brokerageMonthlyEnd, 0)) < 0.5
          ? money(row.brokerageMonthlyEnd)
          : `${money(row.brokerageMonthlyStart)} -> ${money(row.brokerageMonthlyEnd)}`,
      k401RateLabel:
        Math.abs(n(row.contributionPctStart, 0) - n(row.contributionPctEnd, 0)) < 0.05 &&
        Math.abs(n(row.employerMatchPctStart, 0) - n(row.employerMatchPctEnd, 0)) < 0.05
          ? `${pct(row.contributionPctEnd)} + ${pct(row.employerMatchPctEnd)} match`
          : `${pct(row.contributionPctStart)} + ${pct(row.employerMatchPctStart)} -> ${pct(row.contributionPctEnd)} + ${pct(row.employerMatchPctEnd)} match`,
      k401SplitLabel:
        `You ${money(row.k401EmployeeContribution)} / Match ${money(row.k401EmployerContribution)}`,
      withdrawalStrategyLabel: summarizeStrategyMix(
        [...row.withdrawalStrategies],
        stateLike,
      ),
      estimatedAcaMagi:
        Math.max(0, n(row.wagesIncome, 0)) +
        Math.max(0, n(row.k401Withdrawal, 0)) +
        Math.max(0, n(row.brokerageTaxableGains, 0)) +
        Math.max(0, n(row.ssIncome, 0)),
      totalStart: row.brokerageStart + row.k401Start,
      totalEnd: row.brokerageEnd + row.k401End,
    }));
  }
  function yearlyTaxTotals(rows, stateLike) {
    const filingStatus = stateLike.scenarioTaxFilingStatus || "single",
      stateTaxRate = n(stateLike.scenarioStateTaxRate, 0);
    return (Array.isArray(rows) ? rows : []).reduce(
      (totals, row) => {
        const taxes = estimatePlannerTaxBreakdown(
          row.k401Withdrawal,
          row.brokerageTaxableGains,
          row.ssIncome,
          filingStatus,
          stateTaxRate,
        );
        totals.federalTax += taxes.ordinaryTax + taxes.capitalGainsTax;
        totals.stateTax += taxes.stateTax || 0;
        totals.totalTax += taxes.totalTax;
        totals.capitalGainsTax += taxes.capitalGainsTax;
        totals.taxableSS += taxes.taxableSS;
        return totals;
      },
      { federalTax: 0, stateTax: 0, totalTax: 0, capitalGainsTax: 0, taxableSS: 0 },
    );
  }
  function bridgeBalanceAtUnlockFromRetirementBalance(
    retirementBalance,
    retirementAge,
    stateLike,
    rates,
  ) {
    const unlock = n(stateLike.unlockAge, 59.5),
      rate = mRate(rates.post),
      months = monthsBetweenAges(retirementAge, unlock);
    let balance = Math.max(0, retirementBalance),
      basis = startingBrokerageBasis(balance, stateLike),
      taxYear = null,
      ytdBrokerageGains = 0;
    for (let i = 0; i < months; i += 1) {
      const agePoint = retirementAge + (i + 1) / 12,
        datePoint = addMonthsIso(
          stateLike.currentDate || today,
          monthsBetweenAges(computeAge(stateLike), retirementAge) + i + 1,
        ),
        yearKey = String(datePoint || "").slice(0, 4);
      if (taxYear !== yearKey) {
        taxYear = yearKey;
        ytdBrokerageGains = 0;
      }
      const monthOfYear = Math.max(1, Number(String(datePoint || "").slice(5, 7)) || 1),
        monthsCompleted = Math.max(1, monthOfYear - 1),
        spend = monthlyRetirementNeedAtAge(stateLike, agePoint, {
          annualCapitalGains:
            ytdBrokerageGains > 0
              ? (ytdBrokerageGains / monthsCompleted) * 12
              : Math.max(0, n(stateLike.annualRetirementSpend, 0)) *
                brokerageGainRateProxy(stateLike),
          annualSSIncome:
            agePoint >= n(stateLike.ssClaimAge, 62) ? ssMonthly(stateLike) * 12 : 0,
        });
      const bridgeDraw = withdrawBrokerageWithBasis(
        balance * (1 + rate),
        basis,
        spend,
        brokerageGainRateProxy(stateLike),
      );
      balance = bridgeDraw.nextBalance;
      basis = bridgeDraw.nextBasis;
      ytdBrokerageGains += bridgeDraw.taxableGains;
    }
    return balance;
  }
  function survivesPostUnlockPlan(
    stateLike,
    rates,
    starting401k,
    startingBrokerage,
    withdrawalConfig = { strategy: "k401First", reserveYears: 2 },
  ) {
    const unlock = n(stateLike.unlockAge, 59.5),
      claim = n(stateLike.ssClaimAge),
      ss = ssMonthly(stateLike),
      kPost = mRate(rates.kpost),
      bPost = mRate(rates.post),
      maxAge = 110;
    let k = Math.max(0, starting401k),
      b = Math.max(0, startingBrokerage),
      bBasis = startingBrokerageBasis(Math.max(0, startingBrokerage), stateLike),
      taxAwareYear = null,
      taxAwareCapRemaining = Math.max(
        0,
        n(withdrawalConfig?.taxAwareAnnualCap, 0),
      ),
      ytd401kWithdrawn = 0,
      ytdBrokerageGains = 0,
      ytdSSIncome = 0;
    const totalMonths = Math.max(0, Math.round((maxAge - unlock) * 12));
    for (let i = 1; i <= totalMonths; i += 1) {
      const agePoint = unlock + i / 12,
        datePoint = addMonthsIso(stateLike.currentDate || today, monthsBetweenAges(computeAge(stateLike), unlock) + i),
        yearKey = String(datePoint || "").slice(0, 4),
        income = agePoint >= claim ? ss : 0;
      if (
        strategyUsesTaxInputs(withdrawalConfig?.strategy) &&
        taxAwareYear !== yearKey
      ) {
        taxAwareYear = yearKey;
        taxAwareCapRemaining = Math.max(
          0,
          n(withdrawalConfig?.taxAwareAnnualCap, 0),
        );
        ytd401kWithdrawn = 0;
        ytdBrokerageGains = 0;
        ytdSSIncome = 0;
      }
      const monthOfYear = Math.max(1, Number(String(datePoint || "").slice(5, 7)) || 1),
        monthsCompleted = Math.max(1, monthOfYear - 1),
        acaContext = acaRetirementIncomeContext(
          stateLike,
          income,
          ytd401kWithdrawn,
          ytdBrokerageGains,
          monthsCompleted,
        ),
        spend = monthlyRetirementNeedAtAge(stateLike, agePoint, acaContext);
      const draw = drawFromAccounts(
        b,
        k,
        Math.max(0, spend - income),
        withdrawalConfig,
        spend,
        {
          taxAwareCapRemaining,
          ytd401kWithdrawn,
          ytdBrokerageGains,
          ytdSSIncome,
          brokerageBasis: bBasis,
          taxFilingStatus: stateLike.scenarioTaxFilingStatus,
          stateTaxRate: stateLike.scenarioStateTaxRate,
          postReturnAnnual: rates.post,
          k401PostReturnAnnual: rates.kpost,
        },
      );
      b = draw.brokerage;
      k = draw.k401;
      bBasis = draw.nextBrokerageBasis;
      taxAwareCapRemaining = draw.nextTaxAwareCapRemaining;
      ytd401kWithdrawn += draw.k401Withdraw;
      ytdBrokerageGains += draw.brokerageTaxableGainsRealized;
      ytdSSIncome += income;
      if (draw.gap > 0.01) {
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
  function required401kAtUnlockForPlan(stateLike, rates, brokerageAtUnlock, withdrawalConfig = { strategy: "k401First", reserveYears: 2 }) {
    const annualSpend = annualRetirementNeedAtAge(
        stateLike,
        n(stateLike.unlockAge, 59.5),
      ),
      annualSS = ssMonthly(stateLike) * 12,
      tester = (amount) =>
        survivesPostUnlockPlan(
          stateLike,
          rates,
          amount,
          brokerageAtUnlock,
          withdrawalConfig,
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
  function retirementNeedProfile(stateLike, rates, withdrawalConfig = { strategy: "k401First", reserveYears: 2 }) {
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
        withdrawalConfig,
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
      ss = ssMonthly(currentState),
      withdrawalConfig = {
        strategy: "k401First",
        reserveYears: 2,
        taxAwareAnnualCap: n(currentState.scenarioTaxAwareAnnualCap, 30000),
        brokerageGainRate: n(currentState.scenarioBrokerageGainRate, 60),
      },
      brokerage = {},
      k401 = {};
    let b = n(snapshot.currentBrokerageBalance),
      k = n(snapshot.current401kBalance),
      bBasis = startingBrokerageBasis(n(snapshot.currentBrokerageBalance), currentState),
      bridgeTaxYear = null,
      bridgeYtdBrokerageGains = 0,
      taxAwareYear = null,
      taxAwareCapRemaining = Math.max(
        0,
        n(withdrawalConfig?.taxAwareAnnualCap, 0),
      ),
      ytd401kWithdrawn = 0,
      ytdBrokerageGains = 0,
      ytdSSIncome = 0,
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
      bBasis = Math.min(Math.max(0, b), Math.max(0, bBasis + bContrib));
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
          monthKey = chartMonthKey(nextDate),
          yearKey = String(nextDate || "").slice(0, 4);
        if (bridgeTaxYear !== yearKey) {
          bridgeTaxYear = yearKey;
          bridgeYtdBrokerageGains = 0;
        }
        const agePoint = actualRetirementAge + i / 12,
          monthOfYear = Math.max(1, Number(String(nextDate || "").slice(5, 7)) || 1),
          monthsCompleted = Math.max(1, monthOfYear - 1),
          spend = monthlyRetirementNeedAtAge(currentState, agePoint, {
            annualCapitalGains:
              bridgeYtdBrokerageGains > 0
                ? (bridgeYtdBrokerageGains / monthsCompleted) * 12
                : Math.max(0, n(currentState.annualRetirementSpend, 0)) *
                  brokerageGainRateProxy(currentState),
            annualSSIncome:
              agePoint >= n(currentState.ssClaimAge, 62)
                ? ssMonthly(currentState) * 12
                : 0,
          });
        const grownBrokerage = b * (1 + brokeragePostRate),
          bridgeDraw = withdrawBrokerageWithBasis(
            grownBrokerage,
            bBasis,
            spend,
            brokerageGainRateProxy(currentState),
          );
        b = bridgeDraw.nextBalance;
        bBasis = bridgeDraw.nextBasis;
        bridgeYtdBrokerageGains += bridgeDraw.taxableGains;
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
        monthKey = chartMonthKey(nextDate),
        yearKey = String(nextDate || "").slice(0, 4);
      if (
        strategyUsesTaxInputs(withdrawalConfig?.strategy) &&
        taxAwareYear !== yearKey
      ) {
        taxAwareYear = yearKey;
        taxAwareCapRemaining = Math.max(
          0,
          n(withdrawalConfig?.taxAwareAnnualCap, 0),
        );
        ytd401kWithdrawn = 0;
        ytdBrokerageGains = 0;
        ytdSSIncome = 0;
      }
      const monthOfYear = Math.max(1, Number(String(nextDate || "").slice(5, 7)) || 1),
        monthsCompleted = Math.max(1, monthOfYear - 1),
        acaContext = acaRetirementIncomeContext(
          currentState,
          income,
          ytd401kWithdrawn,
          ytdBrokerageGains,
          monthsCompleted,
        ),
        spend = monthlyRetirementNeedAtAge(currentState, agePoint, acaContext);
      const draw = drawFromAccounts(
        b,
        k,
        Math.max(0, spend - income),
        withdrawalConfig,
        spend,
        {
          taxAwareCapRemaining,
          ytd401kWithdrawn,
          ytdBrokerageGains,
          ytdSSIncome,
          brokerageBasis: bBasis,
          taxFilingStatus: currentState.scenarioTaxFilingStatus,
          stateTaxRate: currentState.scenarioStateTaxRate,
          postReturnAnnual: rates.post,
          k401PostReturnAnnual: rates.kpost,
        },
      );
      b = draw.brokerage;
      k = draw.k401;
      bBasis = draw.nextBrokerageBasis;
      taxAwareCapRemaining = draw.nextTaxAwareCapRemaining;
      ytd401kWithdrawn += draw.k401Withdraw;
      ytdBrokerageGains += draw.brokerageTaxableGainsRealized;
      ytdSSIncome += income;
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
        monthKeys: [],
        startAge: null,
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
      monthKeys,
      // Age at the first plotted month — lets charts use an age axis.
      startAge: computeAge({ ...currentState, currentDate: `${monthKeys[0]}-01` }),
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

  /* ===== RENDER: EXPLORE VERDICT ===== */
  // One sentence at the top of Explore: does the scenario age hold, what does
  // it leave at 75, and how does that compare with the base target age.
  function renderExploreVerdict(res, early, scenarioState, rates, withdrawalConfig) {
    const verdictEl = el("exploreVerdict");
    if (!verdictEl) return;
    try {
      const fundKey = scenarioFundKey(scenarioState),
        sel = res[fundKey] || res.iyw,
        fullSafe = early[fundKey]?.full,
        scenAge = n(scenarioState.targetRetirementAge),
        baseAge = Math.max(n(scenarioState.currentAge), n(state.targetRetirementAge)),
        holds = fullSafe != null && fullSafe <= scenAge + 1e-9,
        combined75 = seriesValueAtAge(sel?.combinedSeries, 75);
      let html;
      if (!holds) {
        html = `Retiring at <em>${ageLabel(scenAge)}</em> doesn’t clear the full plan in this scenario${
          fullSafe != null ? ` — the earliest safe age is <em>${ageLabel(fullSafe)}</em>` : ""
        }.`;
      } else if (Math.abs(scenAge - baseAge) < 0.05) {
        html = `Your plan holds at <em>${ageLabel(scenAge)}</em> in this scenario, with about ${moneyApprox(combined75)} combined at 75.`;
      } else {
        const baseProjection = project(
            { ...scenarioState, targetRetirementAge: baseAge },
            fundKey,
            baseAge,
            rates,
            withdrawalConfig,
          ),
          delta = combined75 - seriesValueAtAge(baseProjection?.combinedSeries, 75),
          lead = scenAge < baseAge ? `Retiring earlier at` : `Waiting until`;
        html = `${lead} <em>${ageLabel(scenAge)}</em> holds in this scenario — about ${moneyApprox(combined75)} combined at 75, ${
          delta >= 0 ? "+" : "−"
        }${moneyApprox(Math.abs(delta))} vs your base age ${ageLabel(baseAge)}.`;
      }
      verdictEl.innerHTML = html;
    } catch (err) {
      verdictEl.textContent = "";
    }
  }

  /* ===== RENDER: HERO VERDICT ===== */
  function renderHeroDashboard(rates) {
    const benchmark = latestProgressBenchmark(rates);
    const yearsToRetire = Math.max(0, n(state.targetRetirementAge) - computeAge(state));
    const verdictEl = el("heroVerdict"),
      statusDot = el("heroStatusDot"),
      targetAgeText = ageLabel(n(state.targetRetirementAge)),
      setStatus = (cls, words) => {
        if (statusDot) statusDot.className = `statusDot ${cls || ""}`;
        ui.hOverallBadge.textContent = words;
      };

    ui.hTarget.textContent = `Age ${age(state.targetRetirementAge)}`;
    ui.hTargetDetail.textContent = `${num(yearsToRetire, 1)} years away`;
    ui.hUpdated.textContent = fmtDate(latestHistoryEntry()?.date || today);
    ui.hUpdatedDetail.textContent = lastUpdated();

    if (!benchmark) {
      setStatus("", "Needs data");
      ui.hOverallDetail.textContent = "The plan needs at least one balance snapshot";
      if (verdictEl)
        verdictEl.textContent = "Save a balance snapshot to see where you stand.";
      ui.hBrokerageCoverage.textContent = "–";
      ui.h401kCoverage.textContent = "–";
      ui.hBrokerageDetail.textContent = "";
      ui.h401kDetail.textContent = "";
      return;
    }
    if (benchmark.impossible) {
      setStatus("bad", "Off track");
      ui.hOverallDetail.textContent =
        "The target age does not solve under the saved assumptions";
      if (verdictEl)
        verdictEl.innerHTML = `Retiring at <em>${targetAgeText}</em> isn’t currently viable with these assumptions.`;
      ui.hBrokerageCoverage.textContent =
        benchmark.requiredBrokerage == null ? "Not viable" : pct(benchmark.brokerageRatio * 100);
      ui.h401kCoverage.textContent =
        benchmark.required401k == null ? "Not viable" : pct(benchmark.k401Ratio * 100);
      ui.hBrokerageDetail.textContent = "";
      ui.h401kDetail.textContent = "";
      return;
    }

    const ratio = benchmark.totalRatio,
      aheadPct = pct(Math.abs(ratio - 1) * 100),
      pathWord = ratio >= 1 ? "ahead of" : "behind";
    let statusWords, statusClass, verdictHtml;
    if (ratio >= 1.05) {
      statusWords = "Ahead";
      statusClass = "good";
      verdictHtml = `You’re ahead of plan to retire at <em>${targetAgeText}</em>.`;
    } else if (ratio >= 0.95) {
      statusWords = "On track";
      statusClass = "good";
      verdictHtml = `You’re on track to retire at <em>${targetAgeText}</em>.`;
    } else if (ratio >= 0.88) {
      statusWords = "Slightly behind";
      statusClass = "okay";
      verdictHtml = `You’re slightly behind plan for retiring at <em>${targetAgeText}</em>.`;
    } else {
      statusWords = "Behind";
      statusClass = "bad";
      verdictHtml = `You’re behind plan for retiring at <em>${targetAgeText}</em>.`;
    }

    setStatus(statusClass, statusWords);
    ui.hOverallDetail.textContent =
      benchmark.requiredTotal <= 0
        ? "Today's balances already cover the plan with room to spare"
        : `Total assets are ${aheadPct} ${pathWord} the required path${state.inflationAdjusted ? `, in real (inflation-adjusted) terms` : ""}`;
    if (verdictEl) verdictEl.innerHTML = verdictHtml;

    const coverage = (actual, required, coverageEl, detailEl) => {
      if (required == null) return;
      if (required <= 0) {
        coverageEl.textContent = "Covered";
        detailEl.textContent = `${money(actual)} on hand — none required yet`;
      } else {
        coverageEl.textContent = pct((actual / required) * 100);
        detailEl.textContent = `${money(actual)} of ${money(required)} needed`;
      }
    };
    coverage(benchmark.actualBrokerage, benchmark.requiredBrokerage, ui.hBrokerageCoverage, ui.hBrokerageDetail);
    coverage(benchmark.actual401k, benchmark.required401k, ui.h401kCoverage, ui.h401kDetail);
  }

  /* ===== RENDER: BASE PLAN SNAPSHOT ===== */
  function renderBasePlanSnapshot(rates) {
    if (!ui.basePlanSnapshot) return;
    const active = activeAssumptionEntry() || {},
      profile = retirementNeedProfile(state, rates),
      retirementAge = Math.max(computeAge(state), n(state.targetRetirementAge)),
      retirementDate = addMonthsIso(
        state.currentDate || today,
        monthsBetweenAges(computeAge(state), retirementAge),
      ),
      projectedSalaryAtRetirement = assumptionsForDate(
        state,
        retirementDate,
      ).annualSalary,
      projectedBasePlan = project(
        state,
        currentPlanFundKey(),
        retirementAge,
        rates,
      ),
      statementQuality = ssStatementDataQuality(state),
      earningsCount = (state.ssStatementEarningsHistory || []).length,
      ssRisk = ssEstimateRisk(state, state.targetRetirementAge),
      pre65Health = annualHealthcareCostAtAge(state, retirementAge),
      modeledPre65Spend = annualRetirementNeedAtAge(
        state,
        retirementAge,
      ),
      acaProxy = acaIncomeProxyAtAge(
        state,
        retirementAge,
      ),
      acaContribution = acaContributionRateAtAge(state, retirementAge),
      latest = latestHistoryEntry(),
      latestDate = latest ? fmtDate(latest.date) : "No snapshots yet";
    ui.basePlanSnapshot.innerHTML = [
      `<article class="card"><div class="top"><div><h3>Timeline</h3><p class="sub">Dates that define the benchmark.</p></div></div><div class="rowGrid"><div class="row"><span>Target retirement age</span><strong>${age(state.targetRetirementAge)}</strong></div><div class="row"><span>401k unlock age</span><strong>${age(state.unlockAge)}</strong></div><div class="row"><span>SS claim age</span><strong>${num(state.ssClaimAge, 0)}</strong></div><div class="row"><span>Latest snapshot</span><strong>${latestDate}</strong></div></div></article>`,
        `<article class="card"><div class="top"><div><h3>Spending</h3><p class="sub">Used for on-track review only.</p></div></div><div class="rowGrid"><div class="row"><span>Annual spend target</span><strong>${money(state.annualRetirementSpend)}</strong></div><div class="row"><span>ACA healthcare mode</span><strong>${state.acaHealthcareMode === "incomeSensitive" ? "Income-sensitive heuristic" : "Manual flat cost"}</strong></div><div class="row"><span>ACA subsidy rule</span><strong>${state.acaHealthcareMode === "incomeSensitive" ? acaSubsidyRuleLabel(state.acaSubsidyRule) : "N/A"}</strong></div><div class="row"><span>Pre-Medicare health cost</span><strong>${money(state.preMedicareHealthcareCost)}</strong></div><div class="row"><span>ACA benchmark premium</span><strong>${money(state.acaBenchmarkAnnualPremium)}</strong></div><div class="row"><span>ACA custom cap %</span><strong>${state.acaHealthcareMode === "incomeSensitive" ? pct(n(state.acaIncomeCapPct, 8.5)) : "N/A"}</strong></div><div class="row"><span>ACA household size</span><strong>${num(n(state.acaHouseholdSize, 1), 0)}</strong></div><div class="row"><span>2026 FPL baseline</span><strong>${money(acaProxy.fpl)}</strong></div><div class="row"><span>ACA proxy income</span><strong>${money(acaProxy.proxyIncome)}</strong></div><div class="row"><span>Proxy income / FPL</span><strong>${num((acaProxy.proxyIncome / Math.max(1, acaProxy.fpl)) * 100, 0)}%</strong></div><div class="row"><span>ACA contribution rate</span><strong>${state.acaHealthcareMode === "incomeSensitive" ? pct(acaContribution.rate * 100) : "N/A"}</strong></div><div class="row"><span>ACA policy preset</span><strong>${acaPolicyPresetLabel(state.acaPolicyPreset)}</strong></div><div class="row"><span>ACA stress multiplier</span><strong>${pct(n(state.acaStressMultiplier, 100))}</strong></div><div class="row"><span>Modeled pre-65 spend</span><strong>${money(modeledPre65Spend)}</strong></div><div class="row"><span>Social Security at claim (${ssEstimateSourceLabel(state)})</span><strong>${money(ssMonthly(state) * 12)}/yr</strong></div><div class="row"><span>Bridge needed at retirement</span><strong>${money(profile.requiredBrokerageAtRetirement)}</strong></div><div class="row"><span>Projected brokerage at unlock</span><strong>${money(projectedBasePlan.brokerageAtUnlock)}</strong></div><div class="row"><span>401k needed at unlock for 401k role</span><strong>${money(profile.required401kAtUnlock)}</strong></div></div><p class="sub" style="margin-top:.75rem">${pre65Health > 0 ? `Before age 65, the planner adds ${money(pre65Health)}/year of healthcare cost on top of base retirement spending.` : "No extra pre-Medicare healthcare cost is currently layered into retirement spending."} ${state.acaHealthcareMode === "incomeSensitive" ? `Income-sensitive mode estimates ACA-sensitive income from wages before retirement, then from 401k withdrawals, taxable brokerage gains, and Social Security after retirement. It currently uses ${acaSubsidyRuleLabel(state.acaSubsidyRule).toLowerCase()} rather than a full Marketplace subsidy engine.` : ""}</p>${ssRisk ? `<p class="sub" style="margin-top:.75rem;color:var(--warn)">${ssRisk.text}</p>` : ""}</article>`,
        `<article class="card"><div class="top"><div><h3>Accumulation</h3><p class="sub">Current contribution settings, salary path, and returns.</p></div></div><div class="rowGrid"><div class="row"><span>Base-plan brokerage path</span><strong>${basePlanLabel()} at ${pct(rates.iyw)}</strong></div><div class="row"><span>Brokerage / mo</span><strong>${money(active.monthlyBrokerageContribution ?? state.monthlyBrokerageContribution)}</strong></div><div class="row"><span>Current salary anchor</span><strong>${money(active.annualSalary ?? state.annualSalary)}</strong></div><div class="row"><span>Annual salary growth</span><strong>${pct(n(state.annualSalaryGrowthRate, 0))}</strong></div><div class="row"><span>Projected salary at retirement</span><strong>${money(projectedSalaryAtRetirement)}</strong></div><div class="row"><span>401k contribution</span><strong>${pct(active.contributionPct ?? state.contributionPct)} + ${pct(resolveEmployerMatchPct(active.contributionPct ?? state.contributionPct, active.employerMatchPct ?? state.employerMatchPct))} match</strong></div><div class="row"><span>401k growth (accum / post-ret.)</span><strong>${pct(rates.kacc)} / ${pct(rates.kpost)}</strong></div><div class="row"><span>Return display mode</span><strong>${state.inflationAdjusted ? `Real (${pct(n(state.inflationRate, 2.5))} inflation)` : "Nominal"}</strong></div></div></article>`,
        `<article class="card"><div class="top"><div><h3>Input Realism</h3><p class="sub">How complete the base-plan healthcare and Social Security assumptions are.</p></div><span class="badge ${normalizeSsEstimateMode(state.ssEstimateMode) === "statementXml" && statementQuality?.level !== "warn" && ((state.acaHealthcareMode === "incomeSensitive" && state.acaSubsidyRule === "irsSchedule") || state.acaHealthcareMode !== "incomeSensitive") ? "good" : state.preMedicareHealthcareCost > 0 ? "okay" : "bad"}">${normalizeSsEstimateMode(state.ssEstimateMode) === "statementXml" && statementQuality?.level !== "warn" && ((state.acaHealthcareMode === "incomeSensitive" && state.acaSubsidyRule === "irsSchedule") || state.acaHealthcareMode !== "incomeSensitive") ? "Stronger" : state.preMedicareHealthcareCost > 0 ? "Mixed" : "Lighter"}</span></div><div class="rowGrid"><div class="row"><span>SS source</span><strong>${ssEstimateSourceLabel(state)}</strong></div><div class="row"><span>SSA earnings rows</span><strong>${earningsCount || 0}</strong></div><div class="row"><span>ACA mode</span><strong>${state.acaHealthcareMode === "incomeSensitive" ? "Income-sensitive" : "Manual flat"}</strong></div><div class="row"><span>ACA rule</span><strong>${acaSubsidyRuleLabel(state.acaSubsidyRule)}</strong></div><div class="row"><span>ACA household size</span><strong>${num(n(state.acaHouseholdSize, 1), 0)}</strong></div></div><p class="sub" style="margin-top:.75rem">${statementQuality?.text || "Manual Social Security input is active. Importing SSA XML will improve stop-work realism."}</p></article>`,
      ].join("");
    }
  function renderBasePlanMathBreakdown(rates) {
    if (!ui.basePlanMathSummary || !ui.basePlanMathRows) return;
      const retirementAge = Math.max(computeAge(state), n(state.targetRetirementAge)),
      result = project(state, currentPlanFundKey(), retirementAge, rates),
      rows = buildYearlyPlanRows(result),
      chartEndAge = Math.max(n(state.unlockAge, 59.5), n(state.chartEndAge, 80));
    ui.basePlanMathSummary.innerHTML = `<p>Base-plan path uses <strong>${basePlanLabel()}</strong>, retires at <strong>age ${age(retirementAge)}</strong>, bridges to <strong>${age(state.unlockAge)}</strong>, and rolls forward through <strong>age ${age(chartEndAge)}</strong>. Rows below are grouped by calendar year and include the same monthly contributions, salary-based 401k math, modeled salary growth, withdrawals, compounding, Social Security timing, and pre-65 healthcare spend used in the planner. <strong>Salary path</strong> is annual salary for that year, not brokerage contributions.</p>`;
    if (!rows.length) {
      ui.basePlanMathRows.innerHTML =
        `<tr><td colspan="21" class="mutedValue">No projected rows available yet.</td></tr>`;
      return;
    }
    ui.basePlanMathRows.innerHTML = rows
      .map((row) => {
        const gapClass = row.gap > 1 ? "deltaDown" : "mutedValue";
        return `<tr><td>${row.year}</td><td>${age(row.ageStart)} - ${age(row.ageEnd)}</td><td>${row.phaseLabel}</td><td>${row.salaryLabel}</td><td>${row.brokeragePlanLabel}</td><td>${row.k401RateLabel}</td><td>${row.k401SplitLabel}</td><td>${money(row.brokerageStart)}</td><td>${money(row.brokerageContribution)}</td><td>${money(row.brokerageWithdrawal)}</td><td>${money(row.brokerageEnd)}</td><td>${money(row.k401Start)}</td><td>${money(row.k401Contribution)}</td><td>${money(row.k401EmployeeContribution)}</td><td>${money(row.k401EmployerContribution)}</td><td>${money(row.k401Withdrawal)}</td><td>${money(row.k401End)}</td><td>${money(row.ssIncome)}</td><td>${money(row.spend)}</td><td class="${gapClass}">${money(row.gap)}</td><td>${money(row.totalEnd)}</td></tr>`;
      })
      .join("");
  }
  function renderContributionFlexibility(rates) {
    if (!ui.contributionFlexCards || !ui.contributionFlexSummary) return;
    const brokerage = earliestContributionStop(state, rates, "brokerage"),
      k401 = earliestContributionStop(state, rates, "k401");
    if (!brokerage.viableBasePlan || !k401.viableBasePlan) {
      ui.contributionFlexCards.innerHTML = [
        `<article class="card"><div class="top"><div><h3>Brokerage contributions</h3><p class="sub">Restore base-plan viability before using stop analysis.</p></div><span class="badge bad">Unavailable</span></div><p class="sub" style="margin-top:.7rem">The current target age is not viable under the saved assumptions, so there is no safe brokerage stop date to report yet.</p></article>`,
        `<article class="card"><div class="top"><div><h3>401k contributions</h3><p class="sub">Restore base-plan viability before using stop analysis.</p></div><span class="badge bad">Unavailable</span></div><p class="sub" style="margin-top:.7rem">The current target age is not viable under the saved assumptions, so there is no safe 401k stop date to report yet.</p></article>`,
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
      return `<article class="card"><div class="top"><div><h3>${label}</h3><p class="sub">Earliest point you could stop this contribution stream while keeping the full base plan viable.</p></div><span class="badge ${canStopNow ? "good" : "okay"}">${canStopNow ? "Can stop now" : "Can stop later"}</span></div><div class="rowGrid"><div class="row"><span>Earliest safe stop date</span><strong>${stopDateText}</strong></div><div class="row"><span>Stop age</span><strong>${stopAgeText}</strong></div><div class="row"><span>Timing</span><strong>${monthsText}</strong></div><div class="row"><span>Projected balance at retirement</span><strong>${money(projectedRetirementValue)}</strong></div><div class="row"><span>Projected balance at ${age(state.unlockAge)}</span><strong>${money(projectedUnlockValue)}</strong></div></div><p class="sub" style="margin-top:.7rem">${canStopNow ? `Under the current base plan, this contribution stream could stop immediately and the plan would still remain viable.` : `Under the current base plan, keep this contribution stream running until ${fmtDate(result.stopDate)} and then it could drop to zero without breaking the plan.`}</p></article>`;
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
        `<article class="card"><div class="top"><div><h3>Brokerage</h3><p class="sub">Save a balance snapshot to compare against your base plan.</p></div><span class="badge okay">Needs data</span></div></article><article class="card"><div class="top"><div><h3>401k</h3><p class="sub">Save a balance snapshot to compare against your base plan.</p></div><span class="badge okay">Needs data</span></div></article>`;
      return;
    }
    if (benchmark.impossible) {
      const makeImpossibleCard = (title, actual, label) =>
        `<article class="card"><div class="top"><div><h3>${title}</h3><p class="sub">Current target age is not viable under the saved assumptions.</p></div><span class="badge bad">Off track</span></div><div class="rowGrid"><div class="row"><span>Actual ${label} today</span><strong>${money(actual)}</strong></div><div class="row"><span>Target age</span><strong>${age(state.targetRetirementAge)}</strong></div><div class="row"><span>Status</span><strong class="deltaDown">Not currently solvable</strong></div><div class="row"><span>Next step</span><strong>Adjust age, spend, or contributions</strong></div></div><p class="sub" style="margin-top:.7rem">This is not missing data. It means the current target age does not produce a viable full-plan path with the saved assumptions and balances.</p></article>`;
      ui.trackStatusCards.innerHTML = [
        makeImpossibleCard("Brokerage", benchmark.actualBrokerage, "brokerage"),
        makeImpossibleCard("401k", benchmark.actual401k, "401k"),
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
        return `<article class="card"><div class="top"><div><h3>${title}</h3><p class="sub">Minimum current balance needed to keep the full age-${age(state.targetRetirementAge)} plan viable, assuming everything else stays the same.</p></div><span class="badge ${cls}">${status}</span></div><div class="rowGrid"><div class="row"><span>Actual ${label} today</span><strong>${money(actual)}</strong></div><div class="row"><span>Minimum current balance needed</span><strong>${money(reqNow)}</strong></div><div class="row"><span>Ahead / behind</span><strong class="${currentGap <= 0 ? "deltaUp" : "deltaDown"}">${currentGap <= 0 ? `+${money(Math.abs(currentGap))}` : `-${money(currentGap)}`}</strong></div><div class="row"><span>Minimum current balance if retiring at ${age(n(state.targetRetirementAge) + 1)}</span><strong>${money(reqSoft)}</strong></div><div class="row"><span>${projectedRetirementLabel}</span><strong>${money(projectedRetirementValue)}</strong></div><div class="row"><span>${projectedUnlockLabel}</span><strong>${money(projectedUnlockValue)}</strong></div></div><p class="sub" style="margin-top:.7rem">${note}</p></article>`;
      };
    ui.trackStatusCards.innerHTML = [
      makeCard(
        "Brokerage",
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
        "401k",
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
      { label: "Latest brokerage", main: money(m.brokerage), sub: fmtDate(m.latest.date) },
      { label: "Latest 401k", main: money(m.k401), sub: fmtDate(m.latest.date) },
      { label: "Latest total", main: money(m.total), sub: fmtDate(m.latest.date) },
    ];
    ui.changeCards.innerHTML = cards
      .map(
        (c) =>
          `<article class="card"><span class="mini">${c.label}</span><strong style="display:block;margin-top:.35rem;font-size:1.15rem">${c.main}</strong><div class="sub" style="margin-top:.3rem">${c.sub}</div></article>`,
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
      bottleneck = primaryTrackConstraint(
        benchmark,
        totalPre65HealthcareLoad(benchmark.projectedBasePlan, state),
      ),
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
      ui.reviewNote.textContent = `You are ahead of the balance path needed for ${benchmark.label}. Total assets are running ${totalCoverage} versus the required path, with brokerage at ${brokerageCoverage} and 401k at ${k401Coverage}. This is comfortably within range. Current limiting factor: ${bottleneck.label.toLowerCase()}.`;
      return;
    }
    if (benchmark.totalRatio >= 0.95) {
      ui.reviewNote.textContent = weakMonth
        ? `You are still within a normal tracking band for ${benchmark.label}. Total assets are ${totalCoverage} relative to the required path, and the latest softness looks more like a short-term drawdown than a structural miss. Current limiting factor: ${bottleneck.label.toLowerCase()}.`
        : `You are within range of the required path for ${benchmark.label}. Total assets are ${totalCoverage} relative to the needed balance, with brokerage at ${brokerageCoverage} and 401k at ${k401Coverage}. Current limiting factor: ${bottleneck.label.toLowerCase()}.`;
      return;
    }
    if (benchmark.totalRatio >= 0.88) {
      ui.reviewNote.textContent = weakMonth
        ? `You are a bit below the required path for ${benchmark.label}, but the gap is moderate. Current bottleneck: ${bottleneck.label.toLowerCase()}. Consider adding about ${moderateBrokerageStep ? money(moderateBrokerageStep) : "$100-$300"} per month to brokerage ${contributionStep}.`
        : `You are modestly behind the required path for ${benchmark.label}. Total assets are ${totalCoverage} versus required. Current bottleneck: ${bottleneck.label.toLowerCase()}. Consider adding about ${moderateBrokerageStep ? money(moderateBrokerageStep) : "$100-$300"} per month to brokerage ${contributionStep}.`;
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
    ui.reviewNote.textContent = `You are meaningfully behind the balance path for ${benchmark.label}. Total assets are ${totalCoverage} relative to required. Current bottleneck: ${bottleneck.label.toLowerCase()}. Consider brokerage contributions about ${fullGapText} higher ${contributionStep}, or a later retirement age / lower spend.`;
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
        return `<article class="card"><div class="top"><div><h3>${f.title}</h3><p class="sub">Accumulation ${pct(f.rate)}. ${res.rates.label} at age ${age(stateLike.targetRetirementAge)}.</p></div><div class="age ${cls}">${e == null ? "65+" : age(e)}<small>earliest full-plan-safe</small></div></div><div class="rowGrid"><div class="row"><span>Bridge-safe age</span><strong>${bridgeAge == null ? "65+" : age(bridgeAge)}</strong></div><div class="row"><span>Brokerage at retirement</span><strong>${money(x.brokerageAtRetirement)}</strong></div><div class="row"><span>401k at retirement</span><strong>${money(x.k401AtRetirement)}</strong></div><div class="row"><span>Brokerage at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.brokerageAtUnlock)}</strong></div><div class="row"><span>401k at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.k401AtUnlock)}</strong></div><div class="row"><span>Combined at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.totalAtUnlock)}</strong></div><div class="row"><span>4% withdrawal / year</span><strong>${money(x.sustainableWithdrawal)}</strong></div><div class="row"><span>${gapLabel}</span><strong>${money(Math.abs(x.annualGapOrSurplus))}</strong></div><div class="row"><span>Portfolio longevity</span><strong>${lon(x.longevityAge)}</strong></div></div></article>`;
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
        return `<article class="card"><div class="top"><h3 style="margin:0">${f.title}</h3><span class="badge ${cls}">${txt}</span></div><div class="rowGrid"><div class="row"><span>Retirement age</span><strong>${age(x.actualRetirementAge)}</strong></div><div class="row"><span>Brokerage at retirement</span><strong>${money(x.brokerageAtRetirement)}</strong></div><div class="row"><span>Brokerage at ${num(stateLike.unlockAge, 1)}</span><strong>${money(x.brokerageAtUnlock)}</strong></div><div class="row"><span>Bridge threshold</span><strong>${x.viable ? ">= $5,000" : "< $5,000"}</strong></div></div></article>`;
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
      strategyNote = ` Using ${strategyLabel(
        stateLike.scenarioWithdrawalStrategy,
        stateLike,
      ).toLowerCase()} after unlock.`,
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
    const taxNote =
      strategyUsesTaxInputs(stateLike.scenarioWithdrawalStrategy)
        ? ` The tax-aware heuristic starts brokerage basis from an embedded gain estimate of ${pct(n(stateLike.scenarioBrokerageGainRate, 60))}, updates that basis over time as the brokerage account grows and is spent down, uses the 2026 ${taxProfileForStatus(stateLike.scenarioTaxFilingStatus).label.toLowerCase()} federal thresholds, layers on a flat ${pct(n(stateLike.scenarioStateTaxRate, 0))} state tax rate, and partially models Social Security taxation.`
        : "";
    const healthcareNote =
      n(stateLike.preMedicareHealthcareCost, 0) > 0
        ? ` The plan also adds ${money(annualHealthcareCostAtAge(stateLike, Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge))))}/year of pre-Medicare healthcare cost before age 65 under the current ACA stress setting.`
        : "";
    const ssRiskNote = ssRisk ? ` ${ssRisk.text}` : "";
    if (bridgeAge == null || bridgeAge > 65)
      return `${res.rates.label} does not produce a bridge-safe retirement before age 65 for either path. At target age ${age(target)}, ${blendLabel("blendA")} leaves ${money(res.iyw.brokerageAtUnlock)} in brokerage at ${num(stateLike.unlockAge, 1)} and ${blendLabel("blendB")} leaves ${money(res.qqqm.brokerageAtUnlock)}.${strategyNote}${taxNote}${healthcareNote}${scheduledNote}${ssRiskNote}`;
    if (fullAge == null || fullAge > 65)
      return `With ${money(stateLike.monthlyBrokerageContribution)}/month into ${best.label}, the earliest bridge-safe age in the ${res.rates.label.toLowerCase()} is ${age(bridgeAge)}, but the planner does not find a full-plan-safe retirement before age 65 on that path.${strategyNote}${taxNote}${healthcareNote}${scheduledNote}${ssRiskNote}`;
    return `With ${money(stateLike.monthlyBrokerageContribution)}/month into ${best.label}, the earliest full-plan-safe age in the ${res.rates.label.toLowerCase()} is ${age(fullAge)}. The bridge-safe age is ${age(bridgeAge)}. At target age ${age(target)}, the ${best.label} path reaches ${money(x.totalAtUnlock)} combined at ${num(stateLike.unlockAge, 1)} and supports ${money(x.sustainableWithdrawal)}/year at 4%. Social Security adds ${money(x.annualSS)}/year at age ${stateLike.ssClaimAge}, leaving ${gap}. Portfolio longevity: age ${lon(x.longevityAge)}.${strategyNote}${taxNote}${healthcareNote}${scheduledNote}${ssRiskNote}`;
  }

  function renderStrategyComparison(stateLike, rates) {
    if (!ui.strategySummary || !ui.strategyCards) return;
    const fundKey = scenarioFundKey(stateLike),
      evaluations = withdrawalStrategies(stateLike).map((entry) =>
        evaluateWithdrawalStrategy(stateLike, fundKey, rates, {
          strategy: entry.key,
          reserveYears: Math.max(0, n(stateLike.scenarioBrokerageReserveYears, 2)),
          taxAwareAnnualCap: Math.max(
            0,
            n(stateLike.scenarioTaxAwareAnnualCap, 30000),
          ),
        }),
      ),
      selected = evaluations.find(
        (entry) => entry.key === stateLike.scenarioWithdrawalStrategy,
      ) || evaluations[0],
      baseline = evaluations.find((entry) => entry.key === "k401First") || evaluations[0],
      viable = evaluations.filter((entry) => entry.viable),
      sortedBy75 = [...(viable.length ? viable : evaluations)].sort(
        (a, b) => b.age75Balance - a.age75Balance,
      ),
      best = sortedBy75[0],
      bestBrokerageKeeper = [...(viable.length ? viable : evaluations)].sort(
        (a, b) => b.brokerageAt75 - a.brokerageAt75,
      )[0],
      lowest401kDraw = [...(viable.length ? viable : evaluations)].sort(
        (a, b) => a.total401kWithdrawn - b.total401kWithdrawn,
      )[0],
      lowestTax = [...(viable.length ? viable : evaluations)].sort(
        (a, b) => a.totalEstimatedTaxTo75 - b.totalEstimatedTaxTo75,
      )[0],
      optimizationGoal = stateLike.scenarioOptimizationGoal || "balanced",
      recommended = recommendedStrategyForGoal(evaluations, optimizationGoal) || selected,
      confidence = strategyConfidenceNote(stateLike),
      taxProfile = taxProfileForStatus(stateLike.scenarioTaxFilingStatus),
      delta75 = selected.age75Balance - baseline.age75Balance,
      deltaUnlock = selected.result.totalAtUnlock - baseline.result.totalAtUnlock,
      whyChanged = strategyWhyChangedText(
        stateLike,
        selected,
        recommended,
        baseline,
        optimizationGoal,
      ),
      driverBadges = strategyDriverBadges(
        stateLike,
        selected,
        recommended,
        baseline,
        optimizationGoal,
      ),
      constraintCards = strategyConstraintCards(
        stateLike,
        rates,
        selected,
        baseline,
        evaluations,
      ),
      badgeHtml = driverBadges.length
        ? `<div style="display:flex;gap:.45rem;flex-wrap:wrap;margin:.55rem 0 .2rem">${driverBadges
            .map((badge) => `<span class="badge ${badge.cls}">${badge.label}</span>`)
            .join("")}</div>`
        : "",
      impactText =
        selected.key === baseline.key
          ? "This is the reference strategy for comparison."
          : `Compared with 401k first, it changes combined balance at unlock by ${deltaUnlock >= 0 ? "+" : ""}${money(deltaUnlock)} and age-75 balance by ${delta75 >= 0 ? "+" : ""}${money(delta75)}.`;
    ui.strategySummary.innerHTML = selected
      ? `<p>${fundLabelForKey(fundKey)} is currently using ${selected.label.toLowerCase()} after unlock. ${impactText} ${best.key === selected.key ? "That is also the strongest of the modeled draw orders by age-75 ending balance." : `${best.label} looks stronger by about ${money(best.age75Balance - selected.age75Balance)} at age 75 under this deterministic scenario.`} Under the current objective, ${optimizationGoalLabel(optimizationGoal).toLowerCase()}, the planner recommends ${recommended.label.toLowerCase()}.</p>${badgeHtml}<p style="margin-top:.55rem">${whyChanged}</p><p style="margin-top:.55rem">Through age 75, the selected strategy is estimating about ${money(selected.totalEstimatedTaxTo75)} of combined tax, with ${money(selected.totalEstimatedFederalTaxTo75)} federal, ${money(selected.totalEstimatedStateTaxTo75)} state, ${money(selected.totalEstimatedCapitalGainsTaxTo75)} coming from long-term capital gains, and about ${money(selected.totalEstimatedTaxableSSTo75)} of Social Security counted as taxable income. The yearly audit uses 2026 ${taxProfile.label.toLowerCase()} federal thresholds, starts brokerage basis from an embedded gain estimate of ${pct(n(stateLike.scenarioBrokerageGainRate, 60))}, updates that basis as the account grows and is spent down, and layers on a flat ${pct(n(stateLike.scenarioStateTaxRate, 0))} state tax rate. ${confidence}</p>`
      : "";
    if (ui.strategyDriverCards) {
      ui.strategyDriverCards.innerHTML = constraintCards
        .map(
          (card) => `<article class="card"><div class="top"><div><h3>${card.title}</h3><p class="sub">${card.note}</p></div><span class="badge ${card.cls}">${card.badge}</span></div><div class="rowGrid">${card.rows
            .map(
              ([label, value]) => `<div class="row"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}</div></article>`,
        )
        .join("");
    }
    // A comparison is a table, not a grid of cards — strategies as rows,
    // outcomes as aligned columns.
    ui.strategyCards.innerHTML = `<div class="tableWrap"><table class="compareTable">
      <thead><tr>
        <th>Strategy</th>
        <th>Target age</th>
        <th>Combined at ${num(stateLike.unlockAge, 1)}</th>
        <th>Combined at 75</th>
        <th>Brokerage at 75</th>
        <th>401k at 75</th>
        <th>Est. tax to 75</th>
        <th>Vs 401k first at 75</th>
      </tr></thead>
      <tbody>${evaluations
        .map((entry) => {
          const tags = [
              entry.key === stateLike.scenarioWithdrawalStrategy ? "Selected" : "",
              recommended.key === entry.key ? "Recommended" : "",
              best.key === entry.key ? "Strongest at 75" : "",
              bestBrokerageKeeper.key === entry.key ? "Keeps most brokerage" : "",
              lowest401kDraw.key === entry.key ? "Lowest 401k draw" : "",
              lowestTax.key === entry.key ? "Lowest est. tax" : "",
              entry.key === "goalAware" && entry.adaptiveSummary?.dominantLabel
                ? `Leans on ${entry.adaptiveSummary.dominantLabel.toLowerCase()}`
                : "",
            ].filter(Boolean),
            delta = entry.age75Balance - baseline.age75Balance,
            deltaCell =
              entry.key === baseline.key
                ? `<td class="mutedValue">Reference</td>`
                : `<td class="${delta >= 0 ? "deltaUp" : "deltaDown"}">${delta >= 0 ? "+" : "-"}${money(Math.abs(delta))}</td>`;
          return `<tr${entry.key === stateLike.scenarioWithdrawalStrategy ? ' class="isSelected"' : ""} title="${entry.description}">
            <td><div class="cellTitle">${entry.label}</div>${tags.length ? `<div class="cellTags">${tags.join(" · ")}</div>` : ""}</td>
            <td><span class="badge ${entry.viable ? "good" : "bad"}">${entry.viable ? "Holds" : "Falls short"}</span></td>
            <td>${money(entry.result.totalAtUnlock)}</td>
            <td>${money(entry.age75Balance)}</td>
            <td>${money(entry.brokerageAt75)}</td>
            <td>${money(entry.k401At75)}</td>
            <td>${money(entry.totalEstimatedTaxTo75)}</td>
            ${deltaCell}
          </tr>`;
        })
        .join("")}</tbody>
    </table></div>`;
    if (ui.strategyAuditSummary && ui.strategyAuditRows) {
      const yearly = buildYearlyPlanRows(selected.result, stateLike),
        selectedFundLabel = fundLabelForKey(fundKey),
        adaptiveNote =
          selected.key === "goalAware" && selected.adaptiveSummary?.totalMonths
            ? ` During months with actual withdrawals, the adaptive optimizer leaned most on ${selected.adaptiveSummary.dominantLabel.toLowerCase()} and rotated through ${selected.adaptiveSummary.mixLabel}.`
            : "";
      ui.strategyAuditSummary.textContent = `${selectedFundLabel} using ${selected.label.toLowerCase()} after unlock. This table shows the yearly flow of brokerage, 401k, Social Security, spending, and any gap through age ${num(
        n(stateLike.chartEndAge, 80),
        0,
      )}. Estimated tax here applies 2026 ${taxProfile.label.toLowerCase()} federal ordinary-income rates to 401k withdrawals, uses a starting brokerage embedded gain estimate of ${pct(
        n(stateLike.scenarioBrokerageGainRate, 60),
      )}, carries that brokerage basis forward over time, applies a flat ${pct(n(stateLike.scenarioStateTaxRate, 0))} state tax rate on ordinary income and realized gains, and partially models Social Security taxation. Estimated ACA MAGI uses wages, 401k withdrawals, realized brokerage gains, and full Social Security income as a proxy.`;
      ui.strategyAuditSummary.textContent += adaptiveNote;
      ui.strategyAuditRows.innerHTML = yearly
        .map(
            (row) => {
              const taxes = estimatePlannerTaxBreakdown(
                row.k401Withdrawal,
                row.brokerageTaxableGains,
                row.ssIncome,
                stateLike.scenarioTaxFilingStatus,
                stateLike.scenarioStateTaxRate,
              );
              return `<tr><td>${row.year}</td><td>${age(row.ageStart)} -> ${age(row.ageEnd)}</td><td>${row.phaseLabel}</td><td>${row.withdrawalStrategyLabel}</td><td>${row.salaryLabel}</td><td>${row.brokeragePlanLabel}</td><td>${row.k401RateLabel}</td><td>${row.k401SplitLabel}</td><td>${money(row.brokerageStart)}</td><td>${money(row.brokerageWithdrawal)}</td><td>${money(row.brokerageEnd)}</td><td>${money(row.k401Start)}</td><td>${money(row.k401Withdrawal)}</td><td>${money(row.k401End)}</td><td>${money(row.brokerageTaxableGains)}</td><td>${money(row.estimatedAcaMagi)}</td><td>${money(taxes.capitalGainsTax)}</td><td>${money(taxes.taxableSS)}</td><td>${money(taxes.stateTax)}</td><td>${money(taxes.totalTax)}</td><td>${money(row.ssIncome)}</td><td>${money(row.spend)}</td><td class="${row.gap > 0 ? "bad" : "mutedValue"}">${money(row.gap)}</td><td>${money(row.totalEnd)}</td></tr>`;
            },
          )
          .join("");
    }
    if (ui.strategyTaxSummary && ui.strategyTaxRows) {
      const yearly = buildYearlyPlanRows(selected.result, stateLike),
        selectedFundLabel = fundLabelForKey(fundKey),
        filingLabel = taxProfile.label.toLowerCase(),
        ssMode = normalizeSsEstimateMode(stateLike.ssEstimateMode),
        ssSourceLabel =
          ssMode === "statementXml"
            ? `SSA XML${(stateLike.ssStatementEarningsHistory || []).length ? ` (${(stateLike.ssStatementEarningsHistory || []).length} earnings rows)` : " (benefits only)"}`
            : "Manual estimate",
        acaModeLabel =
          (stateLike.acaHealthcareMode || "manual") === "incomeSensitive"
            ? `Income-sensitive, household ${num(n(stateLike.acaHouseholdSize, 1), 0)}`
            : "Manual flat healthcare cost",
        snapshotCards = [
          {
            title: "Tax Assumptions",
            rows: [
              ["Federal filing status", taxProfile.label],
              ["State tax rate", pct(n(stateLike.scenarioStateTaxRate, 0))],
            ],
          },
          {
            title: "Brokerage Basis Start",
            rows: [
              [
                "Embedded gain estimate",
                pct(n(stateLike.scenarioBrokerageGainRate, 60)),
              ],
              [
                "Mode",
                strategyUsesTaxInputs(stateLike.scenarioWithdrawalStrategy)
                  ? "Basis carried forward"
                  : "Reference only",
              ],
            ],
          },
          {
            title: "ACA Inputs",
            rows: [
              ["Healthcare mode", acaModeLabel],
              ["Subsidy rule", acaSubsidyRuleLabel(stateLike.acaSubsidyRule)],
              [
                "Policy stress",
                `${acaPolicyPresetLabel(
                  inferAcaPolicyPreset(stateLike.acaStressMultiplier),
                )} (${pct(n(stateLike.acaStressMultiplier, 100))})`,
              ],
            ],
          },
          {
            title: "Social Security Source",
            rows: [
              ["Source", ssSourceLabel],
              ["Claim age", age(n(stateLike.ssClaimAge, 62))],
            ],
          },
        ];
      ui.strategyTaxSummary.textContent = `${selectedFundLabel} using ${selected.label.toLowerCase()} after unlock. This worksheet isolates the income and tax pieces behind the selected strategy: wages, 401k ordinary income, realized brokerage gains, Social Security, taxable Social Security, ACA MAGI proxy, and estimated tax by year using 2026 ${filingLabel} thresholds plus the configured flat state tax rate.`;
      if (ui.strategyTaxSnapshot) {
        ui.strategyTaxSnapshot.innerHTML = snapshotCards
          .map(
            (card) =>
              `<article class="card"><h3>${card.title}</h3><div class="rowGrid">${card.rows
                .map(
                  ([label, value]) =>
                    `<div class="row"><span>${label}</span><strong>${value}</strong></div>`,
                )
                .join("")}</div></article>`,
          )
          .join("");
      }
      ui.strategyTaxRows.innerHTML = yearly
        .map((row) => {
          const taxes = estimatePlannerTaxBreakdown(
            row.k401Withdrawal,
            row.brokerageTaxableGains,
            row.ssIncome,
            stateLike.scenarioTaxFilingStatus,
            stateLike.scenarioStateTaxRate,
          );
          return `<tr><td>${row.year}</td><td>${age(row.ageStart)} -> ${age(row.ageEnd)}</td><td>${row.withdrawalStrategyLabel}</td><td>${money(row.wagesIncome)}</td><td>${money(row.k401Withdrawal)}</td><td>${money(row.brokerageTaxableGains)}</td><td>${money(row.ssIncome)}</td><td>${money(taxes.taxableSS)}</td><td>${money(row.estimatedAcaMagi)}</td><td>${money(taxes.ordinaryTax)}</td><td>${money(taxes.capitalGainsTax)}</td><td>${money(taxes.stateTax)}</td><td>${money(taxes.totalTax)}</td></tr>`;
        })
        .join("");
    }
  }
  function renderSavingsStrategySuggestions(stateLike, rates) {
    if (!ui.savingsStrategySummary || !ui.savingsStrategyCards) return;
    const fundKey = scenarioFundKey(stateLike),
      fundLabel = fundLabelForKey(fundKey),
      withdrawalConfig = scenarioWithdrawalConfig(stateLike),
      retirementAge = Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge)),
      current = fullPlanViableAtAge(
        stateLike,
        fundKey,
        retirementAge,
        rates,
        withdrawalConfig,
      ),
      currentPct = normalizeContributionPct(stateLike.contributionPct, 0),
      confidence = strategyConfidenceNote(stateLike),
      minBrokerage = minBrokerageContributionForTarget(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      min401kPct = min401kContributionPctForTarget(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      fullMatchBrokerage = minBrokerageContributionForTarget(
        stateWithForwardContributionOverrides(stateLike, { contributionPct: 6 }),
        fundKey,
        rates,
        withdrawalConfig,
      ),
      no401Brokerage = minBrokerageContributionForTarget(
        stateWithForwardContributionOverrides(stateLike, { contributionPct: 0 }),
        fundKey,
        rates,
        withdrawalConfig,
      ),
      tradeoffs = buildSavingsTradeoffExamples(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      selectedStrategy = evaluateWithdrawalStrategy(
        stateLike,
        fundKey,
        rates,
        withdrawalConfig,
      ),
      baselineStrategy = evaluateWithdrawalStrategy(
        stateLike,
        fundKey,
        rates,
        {
          ...withdrawalConfig,
          strategy: "k401First",
        },
      ),
      recommendedStrategy =
        recommendedStrategyForGoal(
          withdrawalStrategies(stateLike).map((entry) =>
            evaluateWithdrawalStrategy(stateLike, fundKey, rates, {
              strategy: entry.key,
              reserveYears: Math.max(
                0,
                n(stateLike.scenarioBrokerageReserveYears, 2),
              ),
              taxAwareAnnualCap: Math.max(
                0,
                n(stateLike.scenarioTaxAwareAnnualCap, 30000),
              ),
            }),
          ),
          stateLike.scenarioOptimizationGoal || "balanced",
        ) || selectedStrategy,
      whyChanged = strategyWhyChangedText(
        stateLike,
        selectedStrategy,
        recommendedStrategy,
        baselineStrategy,
        stateLike.scenarioOptimizationGoal || "balanced",
      ),
      driverBadges = strategyDriverBadges(
        stateLike,
        selectedStrategy,
        recommendedStrategy,
        baselineStrategy,
        stateLike.scenarioOptimizationGoal || "balanced",
      ),
      badgeHtml = driverBadges.length
        ? `<div style="display:flex;gap:.45rem;flex-wrap:wrap;margin:.55rem 0 .2rem">${driverBadges
            .map((badge) => `<span class="badge ${badge.cls}">${badge.label}</span>`)
            .join("")}</div>`
        : "";
      ui.savingsStrategySummary.innerHTML = current.viable
        ? `<p>${fundLabel} is already viable for age ${age(stateLike.targetRetirementAge)} under ${strategyLabel(withdrawalConfig.strategy, stateLike).toLowerCase()}. These cards show the minimum brokerage or 401k contribution changes needed if you want to re-balance where the saving happens.</p>${badgeHtml}<p style="margin-top:.55rem">${whyChanged}</p><p style="margin-top:.55rem">${confidence}</p>`
        : `<p>${fundLabel} is not yet full-plan-safe at age ${age(stateLike.targetRetirementAge)} under ${strategyLabel(withdrawalConfig.strategy, stateLike).toLowerCase()}. These cards show the minimum brokerage or 401k contribution levels the planner finds for the current target age.</p>${badgeHtml}<p style="margin-top:.55rem">${whyChanged}</p><p style="margin-top:.55rem">${confidence}</p>`;
    ui.savingsStrategyCards.innerHTML = [
      {
        title: "Keep current 401k rate",
        rows: [
          ["401k contribution", pct(currentPct)],
          [
            "Brokerage needed / month",
            minBrokerage == null ? "Not found" : money(minBrokerage),
          ],
          [
            "Change vs today",
            minBrokerage == null
              ? "-"
              : `${minBrokerage >= stateLike.monthlyBrokerageContribution ? "+" : ""}${money(minBrokerage - n(stateLike.monthlyBrokerageContribution))}`,
          ],
        ],
      },
      {
        title: "Keep current brokerage",
        rows: [
          ["Brokerage / month", money(stateLike.monthlyBrokerageContribution)],
          [
            "401k needed %",
            min401kPct == null ? "Not found" : pct(min401kPct),
          ],
          [
            "Change vs today",
            min401kPct == null
              ? "-"
              : `${min401kPct >= currentPct ? "+" : ""}${pct(min401kPct - currentPct)}`,
          ],
        ],
      },
      {
        title: "Example mixes",
        rows: [
          [
            "Full-match 401k (6%)",
            fullMatchBrokerage == null ? "Not found" : money(fullMatchBrokerage),
          ],
          [
            "Brokerage-heavy (0% 401k)",
            no401Brokerage == null ? "Not found" : money(no401Brokerage),
          ],
          [
            "Best sampled mix",
            tradeoffs[0]
              ? `${pct(tradeoffs[0].pct)} 401k + ${money(tradeoffs[0].brokerage)}/mo brokerage`
              : "Need a wider search",
          ],
        ],
      },
    ]
      .map(
        (card) =>
          `<article class="card"><h3>${card.title}</h3><div class="rowGrid">${card.rows
            .map(
              ([label, value]) =>
                `<div class="row"><span>${label}</span><strong>${value}</strong></div>`,
            )
            .join("")}</div></article>`,
      )
      .join("");
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
  function monteSuccessAtTarget(row, targetAge) {
    const rounded = Math.max(90, Math.min(100, Math.round(n(targetAge, 95))));
    if (rounded >= 100) return n(row?.success100, 0);
    if (rounded >= 95) return n(row?.success95, 0);
    return n(row?.success90, 0);
  }
  function simulateMonteCarloPath(stateLike, fundKey, rates, config, runIndex, agePoints, horizonMonths) {
    const cur = computeAge(stateLike),
      retirementAge = Math.max(cur, n(stateLike.targetRetirementAge)),
      unlockAge = n(stateLike.unlockAge, 59.5),
      claimAge = n(stateLike.ssClaimAge, 62),
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
      bBasis = startingBrokerageBasis(n(stateLike.currentBrokerageBalance), stateLike),
      depletedAge = null,
      bridgeTaxYear = null,
      bridgeYtdBrokerageGains = 0,
      taxAwareYear = null,
      taxAwareCapRemaining = Math.max(
        0,
        n(config.withdrawalConfig?.taxAwareAnnualCap, 0),
      ),
      ytd401kWithdrawn = 0,
      ytdBrokerageGains = 0,
      ytdSSIncome = 0;
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
        bBasis = Math.min(Math.max(0, b), Math.max(0, bBasis + bContrib));
        k = Math.max(0, k * (1 + kRet) + kContrib);
        totals.push(b + k);
        continue;
      }
      if (month <= mRet + mUnlock) {
        const yearKey = String(datePoint || "").slice(0, 4);
        if (bridgeTaxYear !== yearKey) {
          bridgeTaxYear = yearKey;
          bridgeYtdBrokerageGains = 0;
        }
        const bRet = monteMonthlyReturn(rates.post, config.brokerageVol, rng),
          kRet = monteMonthlyReturn(rates.kpost, config.k401Vol, rng),
          monthOfYear = Math.max(1, Number(String(datePoint || "").slice(5, 7)) || 1),
          monthsCompleted = Math.max(1, monthOfYear - 1),
          spend = monthlyRetirementNeedAtAge(stateLike, agePoint, {
            annualCapitalGains:
              bridgeYtdBrokerageGains > 0
                ? (bridgeYtdBrokerageGains / monthsCompleted) * 12
                : Math.max(0, n(stateLike.annualRetirementSpend, 0)) *
                  brokerageGainRateProxy(stateLike),
            annualSSIncome:
              agePoint >= claimAge ? ss * 12 : 0,
          }),
          grownBrokerage = Math.max(0, b * (1 + bRet)),
          bridgeDraw = withdrawBrokerageWithBasis(
            grownBrokerage,
            bBasis,
            spend,
            brokerageGainRateProxy(stateLike),
          ),
          bridgeWithdraw = bridgeDraw.withdrawal,
          gap = Math.max(0, spend - bridgeWithdraw);
        b = bridgeDraw.nextBalance;
        bBasis = bridgeDraw.nextBasis;
        bridgeYtdBrokerageGains += bridgeDraw.taxableGains;
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
        const yearKey = String(datePoint || "").slice(0, 4);
      if (
        strategyUsesTaxInputs(config.withdrawalConfig?.strategy) &&
        taxAwareYear !== yearKey
      ) {
        taxAwareYear = yearKey;
        taxAwareCapRemaining = Math.max(
          0,
          n(config.withdrawalConfig?.taxAwareAnnualCap, 0),
        );
        ytd401kWithdrawn = 0;
        ytdBrokerageGains = 0;
        ytdSSIncome = 0;
      }
      const monthOfYear = Math.max(1, Number(String(datePoint || "").slice(5, 7)) || 1),
        monthsCompleted = Math.max(1, monthOfYear - 1),
        acaContext = acaRetirementIncomeContext(
          stateLike,
          income,
          ytd401kWithdrawn,
          ytdBrokerageGains,
          monthsCompleted,
        ),
        spend = monthlyRetirementNeedAtAge(stateLike, agePoint, acaContext);
      const draw = drawFromAccounts(
        b,
        k,
        Math.max(0, spend - income),
        config.withdrawalConfig,
        spend,
        {
          taxAwareCapRemaining,
          ytd401kWithdrawn,
          ytdBrokerageGains,
          ytdSSIncome,
          brokerageBasis: bBasis,
          taxFilingStatus: stateLike.scenarioTaxFilingStatus,
          stateTaxRate: stateLike.scenarioStateTaxRate,
          postReturnAnnual: rates.post,
          k401PostReturnAnnual: rates.kpost,
        },
      );
      b = draw.brokerage;
      k = draw.k401;
      bBasis = draw.nextBrokerageBasis;
      taxAwareCapRemaining = draw.nextTaxAwareCapRemaining;
      ytd401kWithdrawn += draw.k401Withdraw;
      ytdBrokerageGains += draw.brokerageTaxableGainsRealized;
      ytdSSIncome += income;
      if (draw.gap > 1) {
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
  async function runMonteCarloForPath(stateLike, fundKey, rates, config, runId) {
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
    const CHUNK = 20; // runs per yield point — keeps each batch ≈ 15 ms so UI stays smooth
    for (let run = 0; run < config.runs; run += 1) {
      // Abort if a newer computation has started
      if (runId !== undefined && _mcRunId !== runId) return null;
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
      // Yield to main thread every CHUNK runs so the UI stays interactive
      if ((run + 1) % CHUNK === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (runId !== undefined && _mcRunId !== runId) return null;
      }
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
  function runMonteCarloForPathSync(stateLike, fundKey, rates, config) {
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
      withdrawalConfig: scenarioWithdrawalConfig(stateLike),
      seedKey: {
        currentDate: stateLike.currentDate,
        targetRetirementAge: stateLike.targetRetirementAge,
        unlockAge: stateLike.unlockAge,
        chartEndAge: stateLike.chartEndAge,
        annualRetirementSpend: stateLike.annualRetirementSpend,
        preMedicareHealthcareCost: stateLike.preMedicareHealthcareCost,
        acaStressMultiplier: stateLike.acaStressMultiplier,
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
        scenarioWithdrawalStrategy: stateLike.scenarioWithdrawalStrategy,
        scenarioOptimizationGoal: stateLike.scenarioOptimizationGoal,
        scenarioBrokerageReserveYears: stateLike.scenarioBrokerageReserveYears,
        scenarioTaxAwareAnnualCap: stateLike.scenarioTaxAwareAnnualCap,
        scenarioTaxFilingStatus: stateLike.scenarioTaxFilingStatus,
        scenarioBrokerageGainRate: stateLike.scenarioBrokerageGainRate,
        scenarioStateTaxRate: stateLike.scenarioStateTaxRate,
        balanceHistory: stateLike.balanceHistory,
        assumptionHistory: stateLike.assumptionHistory,
      },
    };
  }
  function monteTargetConfig(stateLike, rates) {
    const baseConfig = monteCarloConfig(stateLike, rates);
    // Cap at 20 runs — each binary-search iteration stays under ~15 ms so the
    // async solver never blocks the main thread for a noticeable duration.
    // Solvers need directional answers (±0.5 yr / $500), not precision.
    return {
      ...baseConfig,
      runs: Math.max(15, Math.min(20, Math.round(baseConfig.runs / 40))),
    };
  }
  async function getMonteCarloResults(stateLike, rates, runId) {
    const config = monteCarloConfig(stateLike, rates);
    // In quick mode use ~1/6 the configured runs (min 80) for fast interaction feedback.
    if (_mcIsQuick) {
      config.runs = Math.max(80, Math.round(config.runs / 6));
    }
    const cacheKey = JSON.stringify({
        config,
        rates,
        showA: stateLike.showBlendAChart,
        showB: stateLike.showBlendBChart,
        blendA: blendLabel("blendA"),
        blendB: blendLabel("blendB"),
      });
    if (monteCacheKey === cacheKey && monteCacheValue) return monteCacheValue;
    const [iywResult, qqqmResult] = await Promise.all([
      runMonteCarloForPath(stateLike, "iyw", rates, config, runId),
      runMonteCarloForPath(stateLike, "qqqm", rates, config, runId),
    ]);
    // Check abort after async work
    if (runId !== undefined && _mcRunId !== runId) return null;
    if (!iywResult || !qqqmResult) return null;
    const result = { config, iyw: iywResult, qqqm: qqqmResult };
    monteCacheKey = cacheKey;
    monteCacheValue = result;
    return result;
  }
  async function getMonteTargetResult(stateLike, fundKey, rates, runId) {
    const config = monteTargetConfig(stateLike, rates),
      cacheKey = JSON.stringify({
        target: {
          fundKey,
          age: stateLike.monteTargetAge,
          success: stateLike.monteTargetSuccess,
        },
        config,
        rates,
      });
    if (monteTargetCache.has(cacheKey)) return monteTargetCache.get(cacheKey);
    // Use the async path so each 20-run solver call yields to the browser.
    const result = await runMonteCarloForPath(stateLike, fundKey, rates, config, runId);
    if (!result || (runId !== undefined && _mcRunId !== runId)) return null;
    monteTargetCache.set(cacheKey, result);
    if (monteTargetCache.size > 40) {
      const firstKey = monteTargetCache.keys().next().value;
      monteTargetCache.delete(firstKey);
    }
    return result;
  }
  async function solveMonteRetirementAgeTarget(stateLike, fundKey, rates, targetAge, targetSuccess, runId) {
    const step = _mcIsQuick ? 2.0 : 0.5;
    const currentAge = Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge));
    const candidates = [];
    for (let a = currentAge; a <= 65.001; a += step) candidates.push(a);
    if (candidates.length === 0) return null;
    // Check upper bound — if even age 65 can't meet target, nothing works.
    const hiRes = await getMonteTargetResult(
      { ...stateLike, targetRetirementAge: candidates[candidates.length - 1] },
      fundKey, rates, runId,
    );
    if (!hiRes || (runId !== undefined && _mcRunId !== runId)) return null;
    if (monteSuccessAtTarget(hiRes, targetAge) < targetSuccess) return null;
    // Check lower bound — current age may already meet target.
    const loRes = await getMonteTargetResult(
      { ...stateLike, targetRetirementAge: candidates[0] },
      fundKey, rates, runId,
    );
    if (!loRes || (runId !== undefined && _mcRunId !== runId)) return null;
    if (monteSuccessAtTarget(loRes, targetAge) >= targetSuccess) {
      return { age: candidates[0], success: monteSuccessAtTarget(loRes, targetAge), runs: loRes.runs };
    }
    // Binary search — each await yields to the browser between iterations.
    let lo = 0, hi = candidates.length - 1;
    while (lo < hi) {
      if (runId !== undefined && _mcRunId !== runId) return null;
      const mid = Math.floor((lo + hi) / 2);
      const res = await getMonteTargetResult(
        { ...stateLike, targetRetirementAge: candidates[mid] }, fundKey, rates, runId,
      );
      if (!res || (runId !== undefined && _mcRunId !== runId)) return null;
      if (monteSuccessAtTarget(res, targetAge) >= targetSuccess) { hi = mid; } else { lo = mid + 1; }
    }
    const finalRes = await getMonteTargetResult(
      { ...stateLike, targetRetirementAge: candidates[lo] }, fundKey, rates, runId,
    );
    if (!finalRes || (runId !== undefined && _mcRunId !== runId)) return null;
    const finalSuccess = monteSuccessAtTarget(finalRes, targetAge);
    if (finalSuccess < targetSuccess) return null;
    return { age: candidates[lo], success: finalSuccess, runs: finalRes.runs };
  }
  async function solveMontePrimaryLeverTarget(stateLike, fundKey, rates, targetAge, targetSuccess, constraintKey, runId) {
    const quickMode = _mcIsQuick;
    if (constraintKey === "bridge") {
      const current = Math.max(0, n(stateLike.monthlyBrokerageContribution, 0));
      const step = quickMode ? 500 : 100;
      const candidates = [];
      for (let amt = current; amt <= current + 6000; amt += step) candidates.push(amt);
      const hiRes = await getMonteTargetResult(
        stateWithForwardContributionOverrides(stateLike, { monthlyBrokerageContribution: candidates[candidates.length - 1] }),
        fundKey, rates, runId,
      );
      if (!hiRes || (runId !== undefined && _mcRunId !== runId)) return null;
      if (monteSuccessAtTarget(hiRes, targetAge) < targetSuccess) return null;
      let lo = 0, hi = candidates.length - 1;
      while (lo < hi) {
        if (runId !== undefined && _mcRunId !== runId) return null;
        const mid = Math.floor((lo + hi) / 2);
        const res = await getMonteTargetResult(
          stateWithForwardContributionOverrides(stateLike, { monthlyBrokerageContribution: candidates[mid] }),
          fundKey, rates, runId,
        );
        if (!res || (runId !== undefined && _mcRunId !== runId)) return null;
        monteSuccessAtTarget(res, targetAge) >= targetSuccess ? (hi = mid) : (lo = mid + 1);
      }
      const finalRes = await getMonteTargetResult(
        stateWithForwardContributionOverrides(stateLike, { monthlyBrokerageContribution: candidates[lo] }),
        fundKey, rates, runId,
      );
      if (!finalRes || (runId !== undefined && _mcRunId !== runId)) return null;
      const s = monteSuccessAtTarget(finalRes, targetAge);
      if (s < targetSuccess) return null;
      return { type: "brokerage", value: candidates[lo], delta: candidates[lo] - current, success: s, runs: finalRes.runs };
    }
    if (constraintKey === "unlock") {
      const current = normalizeContributionPct(stateLike.contributionPct, 0);
      const step = quickMode ? 2.0 : 0.5;
      const candidates = [];
      for (let p = current; p <= 20.001; p += step) candidates.push(p);
      const hiRes = await getMonteTargetResult(
        stateWithForwardContributionOverrides(stateLike, { contributionPct: candidates[candidates.length - 1] }),
        fundKey, rates, runId,
      );
      if (!hiRes || (runId !== undefined && _mcRunId !== runId)) return null;
      if (monteSuccessAtTarget(hiRes, targetAge) < targetSuccess) return null;
      let lo = 0, hi = candidates.length - 1;
      while (lo < hi) {
        if (runId !== undefined && _mcRunId !== runId) return null;
        const mid = Math.floor((lo + hi) / 2);
        const res = await getMonteTargetResult(
          stateWithForwardContributionOverrides(stateLike, { contributionPct: candidates[mid] }),
          fundKey, rates, runId,
        );
        if (!res || (runId !== undefined && _mcRunId !== runId)) return null;
        monteSuccessAtTarget(res, targetAge) >= targetSuccess ? (hi = mid) : (lo = mid + 1);
      }
      const finalRes = await getMonteTargetResult(
        stateWithForwardContributionOverrides(stateLike, { contributionPct: candidates[lo] }),
        fundKey, rates, runId,
      );
      if (!finalRes || (runId !== undefined && _mcRunId !== runId)) return null;
      const s = monteSuccessAtTarget(finalRes, targetAge);
      if (s < targetSuccess) return null;
      return { type: "k401", value: candidates[lo], delta: candidates[lo] - current, success: s, runs: finalRes.runs };
    }
    const currentSpend = Math.max(0, n(stateLike.annualRetirementSpend, 0));
    const step = quickMode ? 5000 : 1000;
    const candidates = [];
    for (let sp = currentSpend; sp >= Math.max(12000, currentSpend - 30000); sp -= step) candidates.push(sp);
    const hiRes = await getMonteTargetResult({ ...stateLike, annualRetirementSpend: candidates[0] }, fundKey, rates, runId);
    if (!hiRes || (runId !== undefined && _mcRunId !== runId)) return null;
    if (monteSuccessAtTarget(hiRes, targetAge) >= targetSuccess) {
      const s = monteSuccessAtTarget(hiRes, targetAge);
      return { type: "spend", value: candidates[0], delta: currentSpend - candidates[0], success: s, runs: hiRes.runs };
    }
    const loRes = await getMonteTargetResult({ ...stateLike, annualRetirementSpend: candidates[candidates.length - 1] }, fundKey, rates, runId);
    if (!loRes || (runId !== undefined && _mcRunId !== runId)) return null;
    if (monteSuccessAtTarget(loRes, targetAge) < targetSuccess) return null;
    let lo = 0, hi = candidates.length - 1;
    while (lo < hi) {
      if (runId !== undefined && _mcRunId !== runId) return null;
      const mid = Math.floor((lo + hi) / 2);
      const res = await getMonteTargetResult({ ...stateLike, annualRetirementSpend: candidates[mid] }, fundKey, rates, runId);
      if (!res || (runId !== undefined && _mcRunId !== runId)) return null;
      monteSuccessAtTarget(res, targetAge) >= targetSuccess ? (hi = mid) : (lo = mid + 1);
    }
    const finalRes = await getMonteTargetResult({ ...stateLike, annualRetirementSpend: candidates[lo] }, fundKey, rates, runId);
    if (!finalRes || (runId !== undefined && _mcRunId !== runId)) return null;
    const s = monteSuccessAtTarget(finalRes, targetAge);
    if (s < targetSuccess) return null;
    return { type: "spend", value: candidates[lo], delta: currentSpend - candidates[lo], success: s, runs: finalRes.runs };
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
        { label: `${blendLabel("blendA")} p10`, data: monte.iyw.p10Series, parsing: false, borderColor: chartColorA("--chartActual", 0.35), borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0, fill: "+2", backgroundColor: chartColorA("--chartActual", 0.07) },
        { label: `${blendLabel("blendA")} median`, data: monte.iyw.p50Series, parsing: false, borderColor: chartColor("--chartActual"), borderWidth: 2.5, pointRadius: 0 },
        { label: `${blendLabel("blendA")} p90`, data: monte.iyw.p90Series, parsing: false, borderColor: chartColorA("--chartActual", 0.6), borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 },
      );
    }
    if (showB) {
      datasets.push(
        { label: `${blendLabel("blendB")} p10`, data: monte.qqqm.p10Series, parsing: false, borderColor: chartColorA("--chartAlt", 0.35), borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0, fill: "+2", backgroundColor: chartColorA("--chartAlt", 0.05) },
        { label: `${blendLabel("blendB")} median`, data: monte.qqqm.p50Series, parsing: false, borderColor: chartColor("--chartAlt"), borderWidth: 2.5, pointRadius: 0 },
        { label: `${blendLabel("blendB")} p90`, data: monte.qqqm.p90Series, parsing: false, borderColor: chartColorA("--chartAlt", 0.6), borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 },
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
  // Wrapper that shows stale results + a "Recalculating" badge immediately, then
  // defers the actual (potentially slow) Monte Carlo compute until after the
  // browser has had a chance to paint the rest of the What If? tab.
  function renderMonteCarloDeferred(stateLike, rates) {
    // Cancel any previously scheduled deferred run — it's now stale.
    if (_mcDeferralTimer) {
      clearTimeout(_mcDeferralTimer);
      _mcDeferralTimer = null;
    }
    // Build the same cache key that getMonteCarloResults() will use so we can
    // check for a cache hit without running the full simulation.
    const quickConfig = monteCarloConfig(stateLike, rates);
    if (_mcIsQuick) quickConfig.runs = Math.max(80, Math.round(quickConfig.runs / 6));
    const cacheKey = JSON.stringify({
      config: quickConfig,
      rates,
      showA: stateLike.showBlendAChart,
      showB: stateLike.showBlendBChart,
      blendA: blendLabel("blendA"),
      blendB: blendLabel("blendB"),
    });
    if (monteCacheKey === cacheKey && monteCacheValue) {
      // Cache hit — results are already available, render immediately (async but fast).
      renderMonteCarlo(stateLike, rates).catch(() => {});
      return;
    }
    // Cache miss — show a "Recalculating" indicator immediately so the user
    // knows something is happening, then run the simulation asynchronously
    // (i.e. after the browser paints the rest of the tab).
    if (ui.monteCarloSummary) {
      ui.monteCarloSummary.innerHTML =
        '<span class="mcRecalcBadge">⟳ Recalculating…</span>';
    }
    // Cancel any in-flight async Monte Carlo computation.
    ++_mcRunId;
    // Capture args at this moment in case state mutates before the timer fires.
    const deferState = stateLike, deferRates = rates;
    _mcDeferralTimer = setTimeout(() => {
      _mcDeferralTimer = null;
      renderMonteCarlo(deferState, deferRates).catch(() => {});
    }, 0);
  }

  async function renderMonteCarlo(stateLike, rates) {
    if (!ui.monteCarloCards || !ui.monteCarloSummary) {
      if (ui.whatIfOverlay) ui.whatIfOverlay.classList.add("hidden");
      return;
    }
    const runId = ++_mcRunId;
    try {
    const monte = await getMonteCarloResults(stateLike, rates, runId);
    if (!monte || _mcRunId !== runId) return; // aborted by newer interaction
    const
      fundKey = scenarioFundKey(stateLike),
      selectedRow = monte[fundKey],
      targetAge = Math.max(90, Math.min(100, Math.round(n(stateLike.monteTargetAge, 95)))),
      targetSuccess = Math.max(1, Math.min(99, n(stateLike.monteTargetSuccess, 85))),
      currentTargetSuccess = monteSuccessAtTarget(selectedRow, targetAge),
      primaryConstraint = scenarioPrimaryConstraint(
        stateLike,
        rates,
        evaluateWithdrawalStrategy(
          stateLike,
          fundKey,
          rates,
          scenarioWithdrawalConfig(stateLike),
        ),
      );
    // Await solvers — each binary-search step awaits async MC, yielding to the
    // browser between iterations so the UI never blocks for more than ~15 ms.
    const ageTarget = currentTargetSuccess >= targetSuccess
        ? { age: Math.max(computeAge(stateLike), n(stateLike.targetRetirementAge)), success: currentTargetSuccess, runs: 20 }
        : await solveMonteRetirementAgeTarget(stateLike, fundKey, rates, targetAge, targetSuccess, runId);
    if (_mcRunId !== runId) return;
    const leverTarget = currentTargetSuccess >= targetSuccess
        ? null
        : await solveMontePrimaryLeverTarget(
            stateLike, fundKey, rates, targetAge, targetSuccess, primaryConstraint.key, runId,
          );
    if (_mcRunId !== runId) return;
    const
      paths = [
        { key: "iyw", label: blendLabel("blendA"), visible: stateLike.showBlendAChart !== false },
        { key: "qqqm", label: blendLabel("blendB"), visible: stateLike.showBlendBChart !== false },
      ].filter((row) => row.visible);
    ui.monteCarloSummary.textContent =
      `Monte Carlo uses ${num(monte.config.runs, 0)} seeded runs with randomized monthly returns around the active scenario assumptions. Brokerage volatility is ${pct(monte.config.brokerageVol)}, 401k volatility is ${pct(monte.config.k401Vol)}, and success means the plan avoids an unfunded gap before the shown age threshold. The selected path is currently at ${pct(currentTargetSuccess)} success to age ${num(targetAge, 0)} versus a target of ${pct(targetSuccess)}.`;
    ui.monteCarloCards.innerHTML = paths
      .map((path) => {
        const row = monte[path.key];
        return `<article class="card"><div class="top"><div><h3>${path.label}</h3><p class="sub">Probability view of the current scenario path.</p></div><span class="badge ${row.success100 >= 70 ? "good" : row.success100 >= 50 ? "okay" : "bad"}">${pct(row.success100)} to age 100</span></div><div class="rowGrid"><div class="row"><span>Success to age 90</span><strong>${pct(row.success90)}</strong></div><div class="row"><span>Success to age 95</span><strong>${pct(row.success95)}</strong></div><div class="row"><span>Success to age 100</span><strong>${pct(row.success100)}</strong></div><div class="row"><span>Median ending balance at 90</span><strong>${money(row.medianEnding90)}</strong></div><div class="row"><span>Median ending balance at 95</span><strong>${money(row.medianEnding95)}</strong></div><div class="row"><span>Median ending balance at 100</span><strong>${money(row.medianEnding100)}</strong></div><div class="row"><span>Median depletion age</span><strong>${formatMonteAge(row.medianDepletionAge)}</strong></div></div></article>`;
      })
      .join("");
    if (ui.monteActionSummary && ui.monteActionCards) {
      const leverText =
        !leverTarget
          ? "The selected path already meets the current success target, so the Monte Carlo action layer is showing cushion rather than rescue moves."
          : leverTarget.type === "brokerage"
            ? `Based on the current bottleneck, the cleanest Monte Carlo lever is brokerage savings. About ${money(Math.max(0, leverTarget.delta))}/month more would bring the selected path to roughly ${pct(leverTarget.success)} success by age ${num(targetAge, 0)} in the reduced-run target solver.`
            : leverTarget.type === "k401"
              ? `Based on the current bottleneck, the cleanest Monte Carlo lever is the 401k contribution rate. About ${pct(Math.max(0, leverTarget.delta))} more employee contribution would bring the selected path to roughly ${pct(leverTarget.success)} success by age ${num(targetAge, 0)} in the reduced-run target solver.`
              : `Based on the current bottleneck, the cleanest Monte Carlo lever is lowering spend. About ${money(Math.max(0, leverTarget.delta))}/year less spend would bring the selected path to roughly ${pct(leverTarget.success)} success by age ${num(targetAge, 0)} in the reduced-run target solver.`;
      ui.monteActionSummary.innerHTML = `<p>${fundLabelForKey(fundKey)} is the active Monte Carlo path. ${leverText} This target solver uses a reduced run count for responsiveness, so treat it as a planning guide rather than a precise probability guarantee.</p>`;
      ui.monteActionCards.innerHTML = [
        {
          title: "Current Confidence",
          cls:
            currentTargetSuccess >= targetSuccess
              ? "good"
              : currentTargetSuccess >= Math.max(50, targetSuccess - 10)
                ? "okay"
                : "bad",
          badge: `${pct(currentTargetSuccess)} @ ${num(targetAge, 0)}`,
          rows: [
            ["Path", fundLabelForKey(fundKey)],
            ["Target success", pct(targetSuccess)],
            ["Bottleneck", primaryConstraint.label],
          ],
          note: primaryConstraint.note,
        },
        {
          title: "Age Needed For Target",
          cls: ageTarget ? "okay" : "bad",
          badge: ageTarget ? age(ageTarget.age) : "Not found",
          rows: [
            ["Current scenario age", age(stateLike.targetRetirementAge)],
            ["Target success", pct(targetSuccess)],
            ["Modeled success", ageTarget ? pct(ageTarget.success) : "Below target"],
          ],
          note:
            ageTarget
              ? `A later retirement age around ${age(ageTarget.age)} is the first age the reduced-run solver found that reaches the target confidence.`
              : "The reduced-run solver did not find a retirement age up to 65 that hits the target confidence.",
        },
        {
          title: "Primary Lever For Target",
          cls: leverTarget ? "okay" : currentTargetSuccess >= targetSuccess ? "good" : "bad",
          badge:
            !leverTarget
              ? currentTargetSuccess >= targetSuccess
                ? "Already there"
                : "Not found"
              : leverTarget.type === "brokerage"
                ? `+${money(Math.max(0, leverTarget.delta))}/mo`
                : leverTarget.type === "k401"
                  ? `+${pct(Math.max(0, leverTarget.delta))}`
                  : `-${money(Math.max(0, leverTarget.delta))}/yr`,
          rows: [
            ["Lever type", !leverTarget ? (currentTargetSuccess >= targetSuccess ? "No change needed" : "No quick lever found") : leverTarget.type === "brokerage" ? "Brokerage contribution" : leverTarget.type === "k401" ? "401k contribution" : "Annual spend"],
            ["Target success", pct(targetSuccess)],
            ["Modeled success", leverTarget ? pct(leverTarget.success) : pct(currentTargetSuccess)],
          ],
          note:
            !leverTarget
              ? currentTargetSuccess >= targetSuccess
                ? "The selected path already clears the current Monte Carlo target."
                : "The reduced-run solver did not find a quick primary-lever fix in its current search range."
              : "This is the first primary-lever adjustment the reduced-run Monte Carlo target solver found for the current bottleneck.",
        },
      ]
        .map(
          (card) => `<article class="card"><div class="top"><div><h3>${card.title}</h3><p class="sub">${card.note}</p></div><span class="badge ${card.cls}">${card.badge}</span></div><div class="rowGrid">${card.rows.map(([label, value]) => `<div class="row"><span>${label}</span><strong>${value}</strong></div>`).join("")}</div></article>`,
        )
        .join("");
    }
    paintMonteCarloChart(monte, stateLike);
    } finally {
      // Hide the loading overlay when this computation finishes — whether it
      // completed normally, was aborted, or threw an error.  Only the active
      // computation (matching runId) owns the overlay.
      if (_mcRunId === runId && ui.whatIfOverlay) {
        ui.whatIfOverlay.classList.add("hidden");
      }
    }
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
      muted = css.getPropertyValue("--muted").trim(),
      hairline = css.getPropertyValue("--border").trim(),
      actualColor = css.getPropertyValue("--chartActual").trim(),
      planColor = css.getPropertyValue("--chartPlan").trim(),
      startAgeMonths = Math.round(n(review.startAge, 0) * 12),
      ageAtIndex = (index) => (startAgeMonths + index) / 12,
      fmtAxisMoney = (v) =>
        Math.abs(v) >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${Math.round(v / 1000)}k`,
      lineBase = {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title(items) {
                if (!items.length) return "";
                return `Age ${num(ageAtIndex(items[0].dataIndex), 1)} — ${items[0].label}`;
              },
              label(c) {
                return `${c.dataset.label}: ${money(c.parsed.y)}`;
              },
            },
          },
        },
        scales: {
          // The x-axis speaks in ages, not calendar months — the plan's whole
          // mental model is "at 59.5, at 65", so the chart should be too.
          x: {
            ticks: {
              color: muted,
              autoSkip: false,
              maxRotation: 0,
              callback(value, index) {
                const months = startAgeMonths + index;
                return months % 60 === 0 ? `${months / 12}` : null;
              },
            },
            grid: { display: false },
          },
          y: {
            ticks: { color: muted, maxTicksLimit: 5, callback: (v) => fmtAxisMoney(v) },
            grid: { color: hairline },
            border: { display: false },
          },
        },
      };
    const normalize = (data) => data.map((v) => (v == null ? null : Math.max(0, v)));
    // Life-event markers: today, retirement age, 401k unlock.
    const todayLabel = chartMonthLabel(chartMonthKey(today));
    const eventMarkers = (chart) => {
      const events = [];
      const todayIdx = chart.data.labels.indexOf(todayLabel);
      if (todayIdx >= 0) events.push({ index: todayIdx, label: "today", emphasis: true });
      [
        { atAge: n(state.targetRetirementAge, 0), label: `retire ${ageLabel(n(state.targetRetirementAge))}` },
        { atAge: n(state.unlockAge, 0), label: "401k unlock" },
      ].forEach((event) => {
        if (!event.atAge) return;
        const index = Math.round(event.atAge * 12) - startAgeMonths;
        if (index > 0 && index < chart.data.labels.length)
          events.push({ index, label: event.label, emphasis: false });
      });
      return events;
    };
    const eventLinePlugin = {
      id: "eventLines",
      afterDraw(chart) {
        const xScale = chart.scales.x,
          yScale = chart.scales.y,
          ctx2 = chart.ctx;
        eventMarkers(chart).forEach(({ index, label, emphasis }) => {
          const x = xScale.getPixelForValue(index);
          if (!Number.isFinite(x)) return;
          ctx2.save();
          ctx2.beginPath();
          ctx2.moveTo(x, yScale.top);
          ctx2.lineTo(x, yScale.bottom);
          ctx2.strokeStyle = emphasis ? actualColor : hairline;
          ctx2.globalAlpha = emphasis ? 0.5 : 1;
          ctx2.lineWidth = 1;
          ctx2.setLineDash([3, 4]);
          ctx2.stroke();
          ctx2.globalAlpha = 1;
          ctx2.font = "11px system-ui, sans-serif";
          ctx2.fillStyle = muted;
          ctx2.fillText(label, x + 5, yScale.top + 12);
          ctx2.restore();
        });
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
                borderColor: actualColor,
                backgroundColor: "transparent",
                borderWidth: 2.2,
                pointRadius: 2,
                pointBackgroundColor: actualColor,
                tension: 0.2,
              },
              {
                label: "Base-plan path",
                data: normalize(review.projectedBrokerage),
                borderColor: planColor,
                backgroundColor: "transparent",
                borderWidth: 1.6,
                pointRadius: 0,
                borderDash: [6, 5],
                spanGaps: true,
                tension: 0.15,
              },
            ],
          },
          options: lineBase,
          plugins: [eventLinePlugin],
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
                borderColor: actualColor,
                backgroundColor: "transparent",
                borderWidth: 2.2,
                pointRadius: 2,
                pointBackgroundColor: actualColor,
                tension: 0.2,
              },
              {
                label: "Base-plan path",
                data: normalize(review.projected401k),
                borderColor: planColor,
                backgroundColor: "transparent",
                borderWidth: 1.6,
                pointRadius: 0,
                borderDash: [6, 5],
                spanGaps: true,
                tension: 0.15,
              },
            ],
          },
          options: lineBase,
          plugins: [eventLinePlugin],
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
            borderColor: chartColor("--chartPlan"),
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
            borderColor: chartColor("--chartPlan"),
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
                    borderColor: chartColor("--chartActual"),
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
                    borderColor: chartColor("--chartAlt"),
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
              borderColor: chartColor("--chartPlan"),
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
              borderColor: chartColor("--ok"),
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
                    backgroundColor: chartColorA("--chartPlan", 0.75),
                    borderColor: chartColor("--chartPlan"),
                    borderWidth: 1,
                    stack: "pathA",
                  },
                  {
                    label: `${aLabel} 401k withdrawal`,
                    data: fundingBucketsA.k401,
                    backgroundColor: "rgba(47, 122, 88, 0.85)",
                    borderColor: chartColor("--ok"),
                    borderWidth: 1,
                    stack: "pathA",
                  },
                  {
                    label: `${aLabel} brokerage withdrawal`,
                    data: fundingBucketsA.brokerage,
                    backgroundColor: chartColorA("--chartActual", 0.88),
                    borderColor: chartColor("--chartActual"),
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
                    backgroundColor: chartColorA("--chartPlan", 0.4),
                    borderColor: chartColor("--chartPlan"),
                    borderWidth: 1,
                    stack: "pathB",
                  },
                  {
                    label: `${bLabel} 401k withdrawal`,
                    data: fundingBucketsB.k401,
                    backgroundColor: "rgba(47, 122, 88, 0.5)",
                    borderColor: chartColor("--ok"),
                    borderWidth: 1,
                    stack: "pathB",
                  },
                  {
                    label: `${bLabel} brokerage withdrawal`,
                    data: fundingBucketsB.brokerage,
                    backgroundColor: chartColorA("--chartAlt", 0.85),
                    borderColor: chartColor("--chartAlt"),
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
    // When a full render runs on the What If tab, the results are now current.
    if (activeTab() !== "track") clearWhatIfDirty();
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
        withdrawalConfig = scenarioWithdrawalConfig(scenarioState),
        rates = scenarioRates(state),
        target = Math.max(
          scenarioState.currentAge,
          n(scenarioState.targetRetirementAge),
        ),
        res = {
          rates,
          iyw: project(scenarioState, "iyw", target, rates, withdrawalConfig),
          qqqm: project(scenarioState, "qqqm", target, rates, withdrawalConfig),
        },
        early = {
          iyw: {
            bridge: earliest(scenarioState, "iyw", rates),
            full: earliestFullPlan(
              scenarioState,
              "iyw",
              rates,
              withdrawalConfig,
            ),
          },
          qqqm: {
            bridge: earliest(scenarioState, "qqqm", rates),
            full: earliestFullPlan(
              scenarioState,
              "qqqm",
              rates,
              withdrawalConfig,
            ),
          },
        };
      if (currentTab !== "whatif") {
        // Today / History / Data all render from the same fast base-plan pass.
        renderHeroDashboard(planningRates);
        renderHistory();
        renderBasePlanSnapshot(planningRates);
        renderBasePlanMathBreakdown(planningRates);
        renderContributionFlexibility(planningRates);
        renderTrackStatusCards(planningRates);
        renderTrackConstraintCards(planningRates);
        renderTrackActionPlan(planningRates);
        renderChangeCards();
        renderAssumptionHistory();
        renderReviewNote(planningRates);
        if (currentTab === "track") paintActualCharts(planningRates);
      } else {
        renderExploreVerdict(res, early, scenarioState, rates, withdrawalConfig);
        ui.scenarioNote.textContent = `${rates.note} Scenario retirement age is ${age(scenarioState.targetRetirementAge)} and post-unlock draws use ${strategyLabel(withdrawalConfig.strategy, scenarioState).toLowerCase()}. The brokerage comparison changes between ${blendLabel("blendA")} and ${blendLabel("blendB")}; the 401k path only changes when retirement timing, withdrawal order, or 401k return assumptions change.`;
        renderCards(res, early, scenarioState);
        renderStatus(res, scenarioState);
        renderWarning(early, rates, scenarioState);
        ui.summary.textContent = renderSummary(res, early, scenarioState);
        renderStrategyComparison(scenarioState, rates);
        renderSavingsStrategySuggestions(scenarioState, rates);
        renderScenarioActionPlan(scenarioState, rates);
        renderMonteCarloDeferred(scenarioState, rates);
        renderConfidencePanel(scenarioState);
        paintCharts(res, bridgeNeed(scenarioState, rates), scenarioState);
      }
    } catch (err) {
      console.error("Render failed", err);
      const exploreVerdictEl = el("exploreVerdict");
      if (exploreVerdictEl) exploreVerdictEl.textContent = "";
      ui.scenarioNote.textContent =
        "Some projections could not render, but your saved inputs are still loaded.";
      renderHistory();
      if (ui.basePlanSnapshot) ui.basePlanSnapshot.innerHTML = "";
      if (ui.basePlanMathSummary) ui.basePlanMathSummary.innerHTML = "";
      if (ui.basePlanMathRows) ui.basePlanMathRows.innerHTML = "";
      if (ui.contributionFlexCards) ui.contributionFlexCards.innerHTML = "";
      if (ui.contributionFlexSummary) ui.contributionFlexSummary.innerHTML = "";
      ui.trackStatusCards.innerHTML = "";
      if (ui.trackConstraintCards) ui.trackConstraintCards.innerHTML = "";
      if (ui.trackActionSummary) ui.trackActionSummary.innerHTML = "";
      if (ui.trackActionCards) ui.trackActionCards.innerHTML = "";
      renderChangeCards();
      renderAssumptionHistory();
      ui.cards.innerHTML = "";
      ui.status.innerHTML = "";
      ui.summary.textContent =
        "Saved inputs loaded, but the projection engine hit an error. Use Reset defaults if stale data caused this.";
      if (ui.strategySummary) ui.strategySummary.textContent = "";
      if (ui.strategyCards) ui.strategyCards.innerHTML = "";
      if (ui.strategyAuditSummary) ui.strategyAuditSummary.textContent = "";
      if (ui.strategyAuditRows) ui.strategyAuditRows.innerHTML = "";
      if (ui.strategyTaxSummary) ui.strategyTaxSummary.textContent = "";
      if (ui.strategyTaxSnapshot) ui.strategyTaxSnapshot.innerHTML = "";
      if (ui.strategyTaxRows) ui.strategyTaxRows.innerHTML = "";
      if (ui.savingsStrategySummary) ui.savingsStrategySummary.textContent = "";
      if (ui.savingsStrategyCards) ui.savingsStrategyCards.innerHTML = "";
      if (ui.scenarioActionSummary) ui.scenarioActionSummary.innerHTML = "";
      if (ui.scenarioActionCards) ui.scenarioActionCards.innerHTML = "";
      if (ui.monteCarloSummary) ui.monteCarloSummary.textContent = "";
      if (ui.monteCarloCards) ui.monteCarloCards.innerHTML = "";
      if (ui.monteActionSummary) ui.monteActionSummary.innerHTML = "";
      if (ui.monteActionCards) ui.monteActionCards.innerHTML = "";
      if (ui.confidenceSummary) ui.confidenceSummary.innerHTML = "";
      if (ui.confidenceCards) ui.confidenceCards.innerHTML = "";
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
    state.annualSalaryGrowthRate = Math.max(
      0,
      n(ui.annualSalaryGrowthRate?.value, state.annualSalaryGrowthRate),
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
    state.preMedicareHealthcareCost = Math.max(
      0,
      n(
        ui.preMedicareHealthcareCost?.value,
        state.preMedicareHealthcareCost,
      ),
    );
    state.acaHealthcareMode =
      ui.acaHealthcareMode?.value === "incomeSensitive"
        ? "incomeSensitive"
        : "manual";
    state.acaSubsidyRule =
      ui.acaSubsidyRule?.value === "customCap"
        ? "customCap"
        : "irsSchedule";
    state.acaBenchmarkAnnualPremium = Math.max(
      0,
      n(
        ui.acaBenchmarkAnnualPremium?.value,
        state.acaBenchmarkAnnualPremium,
      ),
    );
    state.acaIncomeCapPct = Math.max(
      0,
      n(
        ui.acaIncomeCapPct?.value,
        state.acaIncomeCapPct,
      ),
    );
    state.acaHouseholdSize = Math.max(
      1,
      Math.round(n(ui.acaHouseholdSize?.value, state.acaHouseholdSize)),
    );
    state.acaStressMultiplier = Math.max(
      0,
      n(
        ui.acaStressMultiplier?.value,
        state.acaStressMultiplier,
      ),
    );
    state.acaPolicyPreset = ui.acaPolicyPreset?.value || inferAcaPolicyPreset(state.acaStressMultiplier);
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
    state.ssEstimateMode = normalizeSsEstimateMode(
      ui.ssEstimateMode?.value || state.ssEstimateMode,
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
    state.monteTargetAge = Math.max(
      90,
      Math.min(100, Math.round(n(ui.monteTargetAge?.value, state.monteTargetAge))),
    );
    state.monteTargetSuccess = Math.max(
      1,
      Math.min(99, n(ui.monteTargetSuccess?.value, state.monteTargetSuccess)),
    );
    state.scenarioStrategyFund =
      ui.scenarioStrategyFund?.value || state.scenarioStrategyFund || "iyw";
    state.scenarioWithdrawalStrategy =
      ui.scenarioWithdrawalStrategy?.value ||
      state.scenarioWithdrawalStrategy ||
      "k401First";
    state.scenarioOptimizationGoal =
      ui.scenarioOptimizationGoal?.value ||
      state.scenarioOptimizationGoal ||
      "balanced";
    state.scenarioBrokerageReserveYears = Math.max(
      0,
      n(
        ui.scenarioBrokerageReserveYears?.value,
        state.scenarioBrokerageReserveYears,
      ),
    );
    state.scenarioTaxAwareAnnualCap = Math.max(
      0,
      n(
        ui.scenarioTaxAwareAnnualCap?.value,
        state.scenarioTaxAwareAnnualCap,
      ),
    );
    state.scenarioTaxFilingStatus =
      ui.scenarioTaxFilingStatus?.value ||
      state.scenarioTaxFilingStatus ||
      "single";
    state.scenarioBrokerageGainRate = Math.max(
      0,
      Math.min(
        100,
        n(
          ui.scenarioBrokerageGainRate?.value,
          state.scenarioBrokerageGainRate,
        ),
      ),
    );
    state.scenarioStateTaxRate = Math.max(
      0,
      Math.min(
        20,
        n(
          ui.scenarioStateTaxRate?.value,
          state.scenarioStateTaxRate,
        ),
      ),
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
    if (isSettingsDrawerOpen() && !settingsApplying) {
      markSettingsDraftDirty();
      return;
    }
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
    if (isSettingsDrawerOpen() && !settingsApplying) {
      markSettingsDraftDirty();
      return;
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
  function renderSsSettingsPanel() {
    if (!ui.ssStatementSummary || !ui.ssEstimateMode) return;
    const statementMode =
        normalizeSsEstimateMode(state.ssEstimateMode) === "statementXml",
      fileLabel = state.ssStatementFileName || "No SSA statement imported",
      importedDate = state.ssStatementImportedAt
        ? new Date(state.ssStatementImportedAt).toLocaleDateString("en-US")
        : "-",
      earningsCount = (state.ssStatementEarningsHistory || []).length,
      dataQuality = ssStatementDataQuality(state),
      age62Estimate = maybeNumber(state.ssStatementBenefitMap?.["62"]),
      fraEstimate =
        maybeNumber(
          state.ssStatementBenefitMap?.[String(Math.round(n(state.ssStatementFraYears, 67)))],
        ) ?? n(state.ssFRA, 0),
      age70Estimate = maybeNumber(state.ssStatementBenefitMap?.["70"]),
      adjustedApplied = ssMonthly(state),
      stopWorkAge = Math.max(computeAge(state), n(state.targetRetirementAge));
    ui.ssEstimateMode.value = normalizeSsEstimateMode(state.ssEstimateMode);
    ui.ssManualFields?.classList.toggle("hidden", statementMode);
    ui.clearSsXml.disabled = !hasStatementBenefits(state);
    ui.ssStatementSummary.innerHTML = statementMode
      ? hasStatementBenefits(state)
        ? `<strong>${fileLabel}</strong><br/><span class="mini">Imported ${importedDate} · FRA ${num(n(state.ssStatementFraYears, 67), 0)}y ${num(n(state.ssStatementFraMonths, 0), 0)}m · ${earningsCount} earnings rows</span><br/><span class="mini">Statement estimates: ${age62Estimate != null ? `62 ${money(age62Estimate)}/mo` : "62 n/a"} · FRA ${fraEstimate > 0 ? `${money(fraEstimate)}/mo` : "n/a"} · ${age70Estimate != null ? `70 ${money(age70Estimate)}/mo` : "70 n/a"}</span><br/><span class="mini">Current planner use: ${money(adjustedApplied)}/mo at claim age ${num(n(state.ssClaimAge, 62), 0)}, adjusted for stop-work around age ${age(stopWorkAge)} using a top-35 earnings proxy.</span>${dataQuality ? `<br/><span class="mini" style="color:${dataQuality.level === "warn" ? "var(--warn)" : "var(--muted)"}">${dataQuality.text}</span>` : ""}`
        : `Statement XML mode is selected, but no valid SSA statement has been imported yet. Import your XML file to switch the planner from manual benefits to statement-based estimates.`
      : `Manual mode is active. The planner uses the monthly values you enter for age 62 and full retirement age. Importing SSA Statement XML is optional and will not overwrite your manual values unless you switch to statement mode.`;
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
    ["annualSalaryGrowthRate", "annualSalaryGrowthRate"],
    ["targetRetirementAge", "targetRetirementAge"],
    ["scenarioTargetRetirementAge", "scenarioTargetRetirementAge"],
    ["annualRetirementSpend", "annualRetirementSpend"],
    ["preMedicareHealthcareCost", "preMedicareHealthcareCost"],
    ["acaBenchmarkAnnualPremium", "acaBenchmarkAnnualPremium"],
    ["acaIncomeCapPct", "acaIncomeCapPct"],
    ["acaHouseholdSize", "acaHouseholdSize"],
    ["acaStressMultiplier", "acaStressMultiplier"],
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
    ["monteTargetSuccess", "monteTargetSuccess"],
    ["scenarioBrokerageReserveYears", "scenarioBrokerageReserveYears"],
    ["scenarioTaxAwareAnnualCap", "scenarioTaxAwareAnnualCap"],
    ["scenarioBrokerageGainRate", "scenarioBrokerageGainRate"],
    ["scenarioStateTaxRate", "scenarioStateTaxRate"],
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
  ui.ssEstimateMode?.addEventListener("change", () =>
    update(
      "ssEstimateMode",
      normalizeSsEstimateMode(ui.ssEstimateMode.value),
    ),
  );
  ui.scenarioStrategyFund?.addEventListener("change", () =>
    update("scenarioStrategyFund", ui.scenarioStrategyFund.value || "iyw"),
  );
  ui.scenarioWithdrawalStrategy?.addEventListener("change", () =>
    {
      const nextValue = ui.scenarioWithdrawalStrategy.value || "k401First";
      state.scenarioWithdrawalStrategy = nextValue;
      updateStrategyControlState(state);
      update("scenarioWithdrawalStrategy", nextValue);
    },
  );
  ui.scenarioOptimizationGoal?.addEventListener("change", () =>
    update(
      "scenarioOptimizationGoal",
      ui.scenarioOptimizationGoal.value || "balanced",
    ),
  );
  ui.scenarioTaxFilingStatus?.addEventListener("change", () =>
    update("scenarioTaxFilingStatus", ui.scenarioTaxFilingStatus.value || "single"),
  );
  ui.acaPolicyPreset?.addEventListener("change", () => {
    const preset = ui.acaPolicyPreset.value || "current",
      multiplier = applyAcaPolicyPreset(preset, state.acaStressMultiplier);
    state.acaPolicyPreset = preset;
    state.acaStressMultiplier = multiplier;
    if (ui.acaStressMultiplier) setVal("acaStressMultiplier", multiplier, "percent");
    persistVisibleState();
    scheduleRender();
  });
  ui.monteTargetAge?.addEventListener("change", () =>
    update(
      "monteTargetAge",
      Math.max(90, Math.min(100, Math.round(n(ui.monteTargetAge.value, 95)))),
    ),
  );
  ui.acaHealthcareMode?.addEventListener("change", () => {
    state.acaHealthcareMode =
      ui.acaHealthcareMode.value === "incomeSensitive"
        ? "incomeSensitive"
        : "manual";
    updateAcaHealthcareModeUi(state);
    persistVisibleState();
    scheduleRender();
  });
  ui.acaSubsidyRule?.addEventListener("change", () => {
    state.acaSubsidyRule =
      ui.acaSubsidyRule.value === "customCap" ? "customCap" : "irsSchedule";
    updateAcaHealthcareModeUi(state);
    persistVisibleState();
    scheduleRender();
  });
  ui.scenarioStateTaxRate?.addEventListener("change", () =>
    update(
      "scenarioStateTaxRate",
      Math.max(0, Math.min(20, n(ui.scenarioStateTaxRate.value, 0))),
    ),
  );
  ui.ssClaimAge?.addEventListener("input", persistVisibleState);
  ui.ssClaimAge?.addEventListener("change", () =>
    update("ssClaimAge", n(ui.ssClaimAge.value, 62)),
  );
  ui.acaStressMultiplier?.addEventListener("change", () => {
    state.acaPolicyPreset = inferAcaPolicyPreset(
      n(ui.acaStressMultiplier.value, state.acaStressMultiplier),
    );
  });
  ui.ssXmlImportBtn?.addEventListener("click", () =>
    ui.ssXmlFile?.click(),
  );
  ui.confidenceCards?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-confidence-action]");
    if (!btn) return;
    const action = btn.dataset.confidenceAction;
    if (action === "openSettings") {
      openSettingsDrawer();
      return;
    }
    if (action === "importSsXml") {
      openSettingsDrawer();
      state.ssEstimateMode = "statementXml";
      if (ui.ssEstimateMode) ui.ssEstimateMode.value = "statementXml";
      renderSsSettingsPanel();
      ui.ssXmlFile?.click();
      return;
    }
    if (action === "enableIncomeAca") {
      openSettingsDrawer();
      state.acaHealthcareMode = "incomeSensitive";
      if (ui.acaHealthcareMode) ui.acaHealthcareMode.value = "incomeSensitive";
      updateAcaHealthcareModeUi(state);
      scheduleRender();
      return;
    }
    if (action === "enableTaxAware") {
      state.scenarioWithdrawalStrategy = "taxAware";
      if (ui.scenarioWithdrawalStrategy)
        ui.scenarioWithdrawalStrategy.value = "taxAware";
      updateStrategyControlState(state);
      scheduleRender();
      return;
    }
    if (action === "openStrategySettings") {
      if (ui.scenarioWithdrawalStrategy) ui.scenarioWithdrawalStrategy.focus();
      return;
    }
    if (action === "raiseMonteRuns") {
      const nextRuns = Math.min(5000, Math.max(1500, n(state.monteCarloRuns, 1000) + 500));
      state.monteCarloRuns = nextRuns;
      if (ui.monteCarloRuns) ui.monteCarloRuns.value = String(nextRuns);
      scheduleRender();
    }
  });
  ui.ssXmlFile?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = parseSsStatementXml(await file.text(), file.name);
      state.ssEstimateMode = "statementXml";
      state.ssStatementFileName = parsed.fileName;
      state.ssStatementImportedAt = parsed.importedAt;
      state.ssStatementDob = parsed.statementDob;
      state.ssStatementFraYears = parsed.fraYears;
      state.ssStatementFraMonths = parsed.fraMonths;
      state.ssStatementBenefitMap = parsed.benefitMap;
      state.ssStatementEarningsHistory = parsed.earningsHistory;
      renderSsSettingsPanel();
      scheduleRender(0);
    } catch (err) {
      alert(`SSA XML import failed: ${err.message || err}`);
    } finally {
      e.target.value = "";
    }
  });
  ui.clearSsXml?.addEventListener("click", () => {
    state.ssStatementFileName = "";
    state.ssStatementImportedAt = "";
    state.ssStatementDob = "";
    state.ssStatementFraYears = base.ssStatementFraYears;
    state.ssStatementFraMonths = base.ssStatementFraMonths;
    state.ssStatementBenefitMap = {};
    state.ssStatementEarningsHistory = [];
    if (state.ssEstimateMode === "statementXml") {
      state.ssEstimateMode = "manual";
    }
    renderSsSettingsPanel();
    scheduleRender(0);
  });
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
      if (!(isSettingsDrawerOpen() && settingsDraftDirty)) {
        persistVisibleState();
      }
      flushSaveToServer(true);
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (_appReady && document.visibilityState === "hidden") {
      if (!(isSettingsDrawerOpen() && settingsDraftDirty)) {
        persistVisibleState();
      }
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
      scenarioStrategyFund: state.scenarioStrategyFund,
      scenarioWithdrawalStrategy: state.scenarioWithdrawalStrategy,
      scenarioOptimizationGoal: state.scenarioOptimizationGoal,
      scenarioBrokerageReserveYears: state.scenarioBrokerageReserveYears,
      scenarioTaxAwareAnnualCap: state.scenarioTaxAwareAnnualCap,
      scenarioTaxFilingStatus: state.scenarioTaxFilingStatus,
      scenarioBrokerageGainRate: state.scenarioBrokerageGainRate,
      scenarioStateTaxRate: state.scenarioStateTaxRate,
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
      state.scenarioStrategyFund = sc.scenarioStrategyFund || state.scenarioStrategyFund;
      state.scenarioWithdrawalStrategy =
        sc.scenarioWithdrawalStrategy || state.scenarioWithdrawalStrategy;
      state.scenarioOptimizationGoal =
        sc.scenarioOptimizationGoal || state.scenarioOptimizationGoal;
      state.scenarioBrokerageReserveYears = n(
        sc.scenarioBrokerageReserveYears,
        state.scenarioBrokerageReserveYears,
      );
      state.scenarioTaxAwareAnnualCap = n(
        sc.scenarioTaxAwareAnnualCap,
        state.scenarioTaxAwareAnnualCap,
      );
      state.scenarioTaxFilingStatus =
        sc.scenarioTaxFilingStatus || state.scenarioTaxFilingStatus;
      state.scenarioBrokerageGainRate = n(
        sc.scenarioBrokerageGainRate,
        state.scenarioBrokerageGainRate,
      );
      state.scenarioStateTaxRate = n(
        sc.scenarioStateTaxRate,
        state.scenarioStateTaxRate,
      );
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

  if (window.__RETIREMENT_PLANNER_TEST__) {
    window.__plannerTestHooks = {
      appReady: () => _appReady,
      baseState: () => clonePlannerState(base),
      buildState: (rawData) => buildState(clonePlannerState(rawData)),
      getState: () => clonePlannerState(state),
      setState: (rawData) => {
        state = buildState(clonePlannerState(rawData));
        fillInputs();
        updateAcaHealthcareModeUi(state);
        updateStrategyControlState(state);
        renderSsSettingsPanel();
        refreshMain401DerivedDisplays();
        return clonePlannerState(state);
      },
      computeAge,
      resolveEmployerMatchPct,
      k401MonthlyFromValues,
      assumptionsForDate,
      baselinePlanningRates,
      scenarioRates,
      currentPlanFundKey,
      ssMonthly,
      statementBenefitForClaimAge,
      annualHealthcareCostAtAge,
      annualRetirementNeedAtAge,
      bridgeNeedAtAge,
      bridgeSim,
      project,
      fullPlanViableAtAge,
      earliest,
      earliestFullPlan,
      drawFromAccounts,
      estimatePlannerTaxBreakdown,
      buildYearlyPlanRows,
      monteCarloConfig,
      simulateMonteCarloPath,
      runMonteCarloForPath,
      getMonteCarloResults,
      openSettingsDrawer,
      closeSettingsDrawer,
      applySettingsDraft,
      isSettingsDrawerOpen,
      update,
      activeTab,
      render,
    };
  }

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
