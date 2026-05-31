// src/routes/patient.js
// Endpoint Express untuk alur pendaftaran pasien SATUSEHAT

const express = require("express");
const router = express.Router();

const { getAccessToken } = require("../auth");
const { getPatientIHS, getPractitionerIHS } = require("../masterData");
const { createLocation } = require("../location");
const { createEncounter } = require("../encounter");

const PATIENT_NIK = "1000000000000001";
const PRACTITIONER_NIK = "1000000000000002";

// ─────────────────────────────────────────────────────────────
// GET /api/token
// Test koneksi OAuth2 — ambil access token saja
// ─────────────────────────────────────────────────────────────
async function handleTokenRequest(req, res) {
  try {
    const token = await getAccessToken();
    res.json({
      success: true,
      message: "Token berhasil didapat",
      access_token: token,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
}

router.get("/token", handleTokenRequest);
router.post("/token", handleTokenRequest);

// ─────────────────────────────────────────────────────────────
// GET /api/patient/:nik
// Lookup IHS Number Pasien berdasarkan NIK
// ─────────────────────────────────────────────────────────────
router.get("/patient/:nik", async (req, res) => {
  try {
    const token = await getAccessToken();
    const ihsNumber = await getPatientIHS(token, req.params.nik);
    res.json({
      success: true,
      nik: req.params.nik,
      ihs_number: ihsNumber,
    });
  } catch (error) {
    const statusCode = error.message.includes("404")
      ? 404
      : error.message.includes("401")
        ? 401
        : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/practitioner/:nik
// Lookup IHS Number Dokter berdasarkan NIK
// ─────────────────────────────────────────────────────────────
router.get("/practitioner/:nik", async (req, res) => {
  try {
    const token = await getAccessToken();
    const ihsNumber = await getPractitionerIHS(token, req.params.nik);
    res.json({
      success: true,
      nik: req.params.nik,
      ihs_number: ihsNumber,
    });
  } catch (error) {
    const statusCode = error.message.includes("404")
      ? 404
      : error.message.includes("401")
        ? 401
        : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/register-patient
// Jalankan alur lengkap Step 1 → 2 → 3 → 4
// ─────────────────────────────────────────────────────────────
router.post("/register-patient", async (req, res) => {
  try {
    const organizationId = process.env.ORGANIZATION_ID;

    // Step 1: Token
    const token = await getAccessToken();

    // Step 2: IHS Numbers
    const patientIHS = await getPatientIHS(token, PATIENT_NIK);
    const practitionerIHS = await getPractitionerIHS(token, PRACTITIONER_NIK);

    // Step 3: Location
    const locationId = await createLocation(token, organizationId);

    // Step 4: Encounter
    const encounter = await createEncounter(
      token,
      patientIHS,
      practitionerIHS,
      locationId,
      organizationId,
    );

    // Response 201 Created
    res.status(201).json({
      success: true,
      message: "Pendaftaran pasien berhasil",
      data: {
        patient_ihs: patientIHS,
        practitioner_ihs: practitionerIHS,
        organization_id: organizationId,
        location_id: locationId,
        encounter_id: encounter.id,
        encounter_status: encounter.status,
        encounter_class: encounter.class?.code,
        timestamp: encounter.period?.start,
        encounter: encounter,
      },
    });
  } catch (error) {
    const statusCode = error.message.includes("401")
      ? 401
      : error.message.includes("404")
        ? 404
        : error.message.includes("422")
          ? 422
          : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
});

module.exports = router;
