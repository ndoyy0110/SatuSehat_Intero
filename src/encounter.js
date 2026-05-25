// src/encounter.js
// Step 4: POST Encounter resource ke SATUSEHAT

const axios = require("axios");

async function createEncounter(token, patientIHS, practitionerIHS, locationId, organizationId) {
  console.log("📋 [Encounter] Mendaftarkan kunjungan pasien...");

  const now = new Date().toISOString(); // ISO 8601 UTC+0

  const payload = {
    resourceType: "Encounter",
    status: "arrived",
    class: {
      system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
      code: "AMB",
      display: "ambulatory",
    },
    subject: {
      reference: `Patient/${patientIHS}`,
      display: "Pasien",
    },
    participant: [
      {
        type: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
                code: "ATND",
                display: "attender",
              },
            ],
          },
        ],
        individual: {
          reference: `Practitioner/${practitionerIHS}`,
          display: "Dokter",
        },
      },
    ],
    period: {
      start: now,
    },
    location: [
      {
        location: {
          reference: `Location/${locationId}`,
          display: "Ruang Poli Umum",
        },
      },
    ],
    serviceProvider: {
      reference: `Organization/${organizationId}`,
    },
  };

  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/Encounter`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ [Encounter] Encounter berhasil dibuat. ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) throw new Error("401 Unauthorized — Token tidak valid atau expired.");
      if (status === 422) throw new Error(`422 Unprocessable Entity — ${JSON.stringify(error.response.data)}`);
      throw new Error(`HTTP ${status} — ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`Network error: ${error.message}`);
  }
}

module.exports = { createEncounter };
