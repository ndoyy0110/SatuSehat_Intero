// src/auth.js
// Step 1: Get OAuth2 Access Token dari SATUSEHAT

const axios = require("axios");

let cachedToken = null;
let tokenExpiresAt = null;

async function getAccessToken() {
  const now = Date.now();

  // Gunakan cached token jika masih valid (buffer 60 detik)
  if (cachedToken && tokenExpiresAt && now < tokenExpiresAt - 60000) {
    console.log("✅ [Auth] Menggunakan cached token");
    return cachedToken;
  }

  console.log("🔐 [Auth] Meminta access token baru...");

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  try {
    const response = await axios.post(process.env.AUTH_URL, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.CLIENT_ID,
        password: process.env.CLIENT_SECRET,
      },
    });

    const { access_token, expires_in } = response.data;

    cachedToken = access_token;
    tokenExpiresAt = now + expires_in * 1000;

    console.log(`✅ [Auth] Token berhasil didapat. Expires in: ${expires_in}s`);
    return access_token;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        throw new Error("401 Unauthorized — CLIENT_ID atau CLIENT_SECRET salah.");
      }
      throw new Error(`HTTP ${status} — ${JSON.stringify(error.response.data)}`);
    }
    throw new Error(`Network error: ${error.message}`);
  }
}

module.exports = { getAccessToken };
