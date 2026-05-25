// src/masterData.js
// Step 2: Lookup IHS Number Pasien dan Dokter berdasarkan NIK

const axios = require("axios");

async function getIHSNumber(token, resource, nik) {
  const label = resource === "Patient" ? "Pasien" : "Dokter";
  console.log(`🔍 [Master Data] Mencari IHS ${label} — NIK: ${nik}`);

  try {
    const response = await axios.get(`${process.env.BASE_URL}/${resource}`, {
      params: {
        identifier: `https://fhir.kemkes.go.id/id/nik|${nik}`,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const bundle = response.data;

    if (!bundle.entry || bundle.entry.length === 0) {
      throw new Error(`404 Not Found — ${label} dengan NIK ${nik} tidak ditemukan.`);
    }

    const ihsNumber = bundle.entry[0].resource.id;
    console.log(`✅ [Master Data] IHS ${label} ditemukan: ${ihsNumber}`);
    return ihsNumber;
  } catch (error) {
    if (error.message.includes("404") || error.message.includes("Not Found")) {
      throw error;
    }
    if (error.response) {
      const status = error.response.status;
      if (status === 401) throw new Error("401 Unauthorized — Token tidak valid atau expired.");
      if (status === 404) throw new Error(`404 Not Found — ${label} dengan NIK ${nik} tidak ditemukan.`);
      throw new Error(`HTTP ${status} — ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`Network error: ${error.message}`);
  }
}

async function getPatientIHS(token, nik) {
  return getIHSNumber(token, "Patient", nik);
}

async function getPractitionerIHS(token, nik) {
  return getIHSNumber(token, "Practitioner", nik);
}

module.exports = { getPatientIHS, getPractitionerIHS };
