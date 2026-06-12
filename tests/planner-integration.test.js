const test = require("node:test");
const assert = require("node:assert/strict");

const {
  fireEvent,
  loadPlannerHooks,
  makeState,
  wait,
  waitFor,
} = require("./helpers");

test("drawer marks ACA edits as a pending draft before apply", async () => {
  const { hooks, dom } = await loadPlannerHooks();
  const { window } = dom;
  const document = window.document;
  hooks.setState(
    makeState(hooks, {
      acaHealthcareMode: "manual",
    }),
  );
  hooks.render();
  await wait(25);

  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const acaMode = document.getElementById("acaHealthcareMode");
  const applyBtn = document.getElementById("applySettingsBtn");
  const draftBadge = document.getElementById("settingsDraftBadge");
  hooks.openSettingsDrawer();
  await waitFor(() => drawerBackdrop.classList.contains("open"));

  assert.equal(acaMode.value, "manual");
  acaMode.value = "incomeSensitive";
  fireEvent(acaMode, "change", window);
  await wait(25);

  assert.equal(applyBtn.disabled, false);
  assert.equal(draftBadge.classList.contains("hidden"), false);
  assert.equal(hooks.getState().acaHealthcareMode, "incomeSensitive");
});

test("drawer-only ACA mode edits do not leak until applied and discard resets the drawer state", async () => {
  const { hooks, dom } = await loadPlannerHooks();
  const { window } = dom;
  const document = window.document;
  hooks.setState(
    makeState(hooks, {
      acaHealthcareMode: "manual",
    }),
  );
  hooks.render();
  await wait(25);

  const openSettings = document.getElementById("openSettings");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const acaMode = document.getElementById("acaHealthcareMode");
  const discardBtn = document.getElementById("discardSettingsBtn");
  const householdField = document.getElementById("acaHouseholdSize")?.closest(".field");

  openSettings.click();
  await waitFor(() => drawerBackdrop.classList.contains("open"));
  assert.equal(acaMode.value, "manual");

  acaMode.value = "incomeSensitive";
  fireEvent(acaMode, "change", window);
  await wait(25);

  assert.equal(hooks.getState().acaHealthcareMode, "incomeSensitive");
  assert.equal(householdField.classList.contains("hidden"), false);

  discardBtn.click();
  await waitFor(() => !drawerBackdrop.classList.contains("open"));
  assert.equal(hooks.getState().acaHealthcareMode, "manual");

  openSettings.click();
  await waitFor(() => drawerBackdrop.classList.contains("open"));
  assert.equal(acaMode.value, "manual");
  assert.equal(householdField.classList.contains("hidden"), true);
});

test("What If retirement-age controls do not overwrite the base-plan retirement target", async () => {
  const { hooks, dom } = await loadPlannerHooks();
  const document = dom.window.document;
  hooks.setState(
    makeState(hooks, {
      targetRetirementAge: 50,
      scenarioTargetRetirementAge: 55,
      monteCarloRuns: 100,
    }),
  );
  hooks.render();
  await wait(25);

  const whatIfTab = [...document.querySelectorAll(".tabBtn")].find(
    (btn) => btn.dataset.tab === "whatif",
  );
  const trackTab = [...document.querySelectorAll(".tabBtn")].find(
    (btn) => btn.dataset.tab === "track",
  );
  const scenarioNote = document.getElementById("scenarioNote");
  const heroTarget = document.getElementById("hTarget");

  whatIfTab.click();
  await waitFor(() => whatIfTab.classList.contains("active"), 1000);
  hooks.render();
  await waitFor(() => scenarioNote.textContent.includes("Scenario retirement age"), 3000);
  assert.ok(scenarioNote.textContent.includes("55.0"));

  hooks.setState(
    makeState(hooks, {
      targetRetirementAge: 50,
      scenarioTargetRetirementAge: 58,
      monteCarloRuns: 100,
    }),
  );
  hooks.render();
  await waitFor(() => scenarioNote.textContent.includes("58.0"), 3000);

  assert.equal(Number(hooks.getState().targetRetirementAge), 50);

  trackTab.click();
  await waitFor(() => trackTab.classList.contains("active"), 1000);
  await waitFor(() => heroTarget.textContent.trim() === "Age 50.0", 3000);
  assert.equal(Number(hooks.getState().targetRetirementAge), 50);
});

test("load falls back to cached local planner data when /api/data returns a non-OK response", async () => {
  const cachedPlan = {
    targetRetirementAge: 53,
    scenarioTargetRetirementAge: 56,
    annualRetirementSpend: 47000,
  };
  const { hooks } = await loadPlannerHooks({
    initialLocalStorage: {
      "retirementPlanner.v1": JSON.stringify(cachedPlan),
    },
    fetchImpl: async (url) => {
      const pathName = typeof url === "string" ? url : url?.url || "";
      if (pathName.includes("/api/data")) {
        return {
          ok: false,
          status: 500,
          json: async () => ({ error: "broken" }),
        };
      }
      throw new Error(`Unexpected fetch in test harness: ${pathName}`);
    },
  });

  assert.equal(Number(hooks.getState().targetRetirementAge), 53);
  assert.equal(Number(hooks.getState().scenarioTargetRetirementAge), 56);
  assert.equal(Number(hooks.getState().annualRetirementSpend), 47000);
});

test("unsynced local data reconciles silently to disk on load when the save works", async () => {
  let reconcilePosts = 0;
  const { dom, hooks } = await loadPlannerHooks({
    initialLocalStorage: {
      "retirementPlanner.v1": JSON.stringify({
        targetRetirementAge: 58,
        annualRetirementSpend: 42000,
      }),
      "retirementPlanner.v1.unsynced": "Local changes newer than file",
    },
    fetchImpl: async (url, options = {}) => {
      const pathName = typeof url === "string" ? url : url?.url || "";
      if (pathName.includes("/api/data")) {
        if ((options.method || "GET").toUpperCase() === "POST") {
          reconcilePosts += 1;
          return { ok: true, status: 200, json: async () => ({ ok: true }) };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            firstRun: false,
            data: {
              targetRetirementAge: 50,
              annualRetirementSpend: 60000,
            },
          }),
        };
      }
      throw new Error(`Unexpected fetch in test harness: ${pathName}`);
    },
  });
  const banner = dom.window.document.getElementById("firstRunBanner");

  // Local copy still wins...
  assert.equal(Number(hooks.getState().targetRetirementAge), 58);
  assert.equal(Number(hooks.getState().annualRetirementSpend), 42000);
  // ...but it was written back to disk, the flag cleared, and no banner shown.
  assert.ok(reconcilePosts >= 1);
  assert.equal(dom.window.localStorage.getItem("retirementPlanner.v1.unsynced"), null);
  assert.notEqual(banner.dataset.bannerKind, "unsynced");
});

test("unsynced local data keeps the warning banner when the reconcile save fails", async () => {
  const { dom, hooks } = await loadPlannerHooks({
    initialLocalStorage: {
      "retirementPlanner.v1": JSON.stringify({
        targetRetirementAge: 58,
        annualRetirementSpend: 42000,
      }),
      "retirementPlanner.v1.unsynced": "Local changes newer than file",
    },
    fetchImpl: async (url, options = {}) => {
      const pathName = typeof url === "string" ? url : url?.url || "";
      if (pathName.includes("/api/data")) {
        if ((options.method || "GET").toUpperCase() === "POST") {
          return { ok: false, status: 500, json: async () => ({ error: "disk" }) };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({
            firstRun: false,
            data: {
              targetRetirementAge: 50,
              annualRetirementSpend: 60000,
            },
          }),
        };
      }
      throw new Error(`Unexpected fetch in test harness: ${pathName}`);
    },
  });
  const banner = dom.window.document.getElementById("firstRunBanner");

  assert.equal(Number(hooks.getState().targetRetirementAge), 58);
  assert.equal(Number(hooks.getState().annualRetirementSpend), 42000);
  assert.equal(banner.dataset.bannerKind, "unsynced");
  assert.ok(banner.innerHTML.includes("Using newer local changes."));
});

test("failed import surfaces an error instead of silently reloading", async () => {
  const { dom } = await loadPlannerHooks({
    fetchImpl: async (url) => {
      const pathName = typeof url === "string" ? url : url?.url || "";
      if (pathName.includes("/api/data")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ firstRun: true, data: null }),
        };
      }
      if (pathName.includes("/api/import")) {
        return {
          ok: false,
          status: 400,
          json: async () => ({ detail: "Import payload rejected" }),
        };
      }
      throw new Error(`Unexpected fetch in test harness: ${pathName}`);
    },
  });
  const { window } = dom;
  const document = window.document;
  const input = document.getElementById("importFileInput");
  const alerts = window.__plannerTestAlerts;

  Object.defineProperty(input, "files", {
    configurable: true,
    value: [
      {
        text: async () => JSON.stringify({ bad: true }),
      },
    ],
  });
  fireEvent(input, "change", window);
  await waitFor(() => alerts.length > 0, 3000);

  assert.ok(alerts[0].includes("Import failed: Import payload rejected"));
});
