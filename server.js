const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3456;
const HOST = process.env.HOST || "127.0.0.1";
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "planner-data.json");

/* ===== MIDDLEWARE ===== */
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

function isPlannerPayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }
  const has = (key) => Object.prototype.hasOwnProperty.call(payload, key);
  const finiteNumber = (value) => Number.isFinite(Number(value));
  return (
    typeof payload.currentDate === "string" &&
    typeof payload.dateOfBirth === "string" &&
    typeof payload.scenario === "string" &&
    Array.isArray(payload.balanceHistory) &&
    Array.isArray(payload.assumptionHistory) &&
    has("targetRetirementAge") &&
    has("annualRetirementSpend") &&
    has("annualSalary") &&
    has("monthlyBrokerageContribution") &&
    has("contributionPct") &&
    has("currentBrokerageBalance") &&
    has("current401kBalance") &&
    finiteNumber(payload.targetRetirementAge) &&
    finiteNumber(payload.annualRetirementSpend) &&
    finiteNumber(payload.annualSalary) &&
    finiteNumber(payload.monthlyBrokerageContribution) &&
    finiteNumber(payload.contributionPct) &&
    finiteNumber(payload.currentBrokerageBalance) &&
    finiteNumber(payload.current401kBalance)
  );
}

/* ===== ENSURE DATA DIRECTORY EXISTS ===== */
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

/* ===== API: LOAD DATA ===== */
app.get("/api/data", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // First run — return null so the client initialises with defaults
      return res.json({ firstRun: true, data: null });
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    if (!isPlannerPayload(data)) {
      return res.status(500).json({
        error: "Invalid planner data file",
        detail: "planner-data.json is missing required Retirement Planner fields.",
      });
    }
    res.json({ firstRun: false, data });
  } catch (err) {
    console.error("Failed to read data file:", err.message);
    res.status(500).json({ error: "Could not read data file", detail: err.message });
  }
});

/* ===== API: SAVE DATA ===== */
app.post("/api/data", (req, res) => {
  try {
    const payload = req.body;
    if (!isPlannerPayload(payload)) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    // Write atomically: temp file → rename
    const tmp = DATA_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), "utf8");
    fs.renameSync(tmp, DATA_FILE);
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to write data file:", err.message);
    res.status(500).json({ error: "Could not write data file", detail: err.message });
  }
});

/* ===== API: EXPORT (download raw JSON) ===== */
app.get("/api/export", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(404).json({ error: "No data file yet" });
    }
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="planner-data-${new Date().toISOString().slice(0, 10)}.json"`
    );
    res.send(fs.readFileSync(DATA_FILE, "utf8"));
  } catch (err) {
    res.status(500).json({ error: "Export failed", detail: err.message });
  }
});

/* ===== API: IMPORT (upload JSON to replace data file) ===== */
app.post("/api/import", (req, res) => {
  try {
    const payload = req.body;
    if (!isPlannerPayload(payload)) {
      return res.status(400).json({
        error: "Invalid planner backup",
        detail: "Expected a Retirement Planner export JSON file.",
      });
    }
    const tmp = DATA_FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2), "utf8");
    fs.renameSync(tmp, DATA_FILE);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Import failed", detail: err.message });
  }
});

/* ===== START ===== */
app.listen(PORT, HOST, () => {
  console.log(`\n  Retirement Planner`);
  console.log(`  Running at → http://${HOST}:${PORT}`);
  console.log(`  Data file  → ${DATA_FILE}`);
  console.log(`  (data/ is gitignored — your numbers stay local)\n`);
});
