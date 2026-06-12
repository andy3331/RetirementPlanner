(() => {
  const RetirementPolicyConfig = Object.freeze({
    socialSecurity: Object.freeze({
      // Current planner simplification for delayed claiming beyond FRA.
      fraToAge70Multiplier: 1.24,
    }),
    aca: Object.freeze({
      // 2026 contiguous U.S. federal poverty guideline baseline.
      fpl2026: Object.freeze({
        householdOne: 15960,
        eachAdditionalPerson: 5680,
      }),
      policyPresets: Object.freeze([
        Object.freeze({ key: "current", label: "Current policy", multiplier: 100 }),
        Object.freeze({ key: "reduced", label: "Reduced subsidies", multiplier: 150 }),
        Object.freeze({ key: "severe", label: "Severe stress", multiplier: 200 }),
        Object.freeze({ key: "custom", label: "Custom", multiplier: null }),
      ]),
      // Planner-side approximation of the premium tax credit applicable percentage schedule.
      applicableFigureBrackets: Object.freeze([
        Object.freeze({ maxFplPct: 150, startRate: 0, endRate: 0 }),
        Object.freeze({ maxFplPct: 200, startRate: 0, endRate: 0.02 }),
        Object.freeze({ maxFplPct: 250, startRate: 0.02, endRate: 0.04 }),
        Object.freeze({ maxFplPct: 300, startRate: 0.04, endRate: 0.06 }),
        Object.freeze({ maxFplPct: 400, startRate: 0.06, endRate: 0.085 }),
        Object.freeze({ maxFplPct: Infinity, startRate: 0.085, endRate: 0.085 }),
      ]),
    }),
  });

  window.RetirementPolicyConfig = RetirementPolicyConfig;
})();
