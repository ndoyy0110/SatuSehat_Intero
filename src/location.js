// src/location.js
// Step 3: POST Location resource ke SATUSEHAT

const axios = require("axios");

async function createLocation(token, organizationId) {
  console.log("🏥 [Location] Membuat resource Location 'Ruang Poli Umum'...");

  const payload = {
    resourceType: "Location",
    status: "active",
    name: "Ruang Poli Umum",
    description: "Ruang Poliklinik Umum",
    mode: "instance",
    telecom: [
      {
        system: "phone",
        value: "(021) 00000000",
        use: "work",
      },
    ],
    address: {
      use: "work",
      line: ["Jalan Contoh No. 1"],
      city: "Jakarta",
      postalCode: "10110",
      country: "ID",
    },
    physicalType: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/location-physical-type",
          code: "ro",
          display: "Room",
        },
      ],
    },
    managingOrganization: {
      reference: `Organization/${organizationId}`,
    },
  };

  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/Location`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const locationId = response.data.id;
    console.log(`✅ [Location] Location berhasil dibuat. ID: ${locationId}`);
    return locationId;
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

module.exports = { createLocation };
