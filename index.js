require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

// Routes
app.use("/api", require("./src/routes/patient"));

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "SATUSEHAT Patient Registration API",
    endpoints: {
      registerPatient: "POST /api/register-patient",
      getToken: "GET  /api/token",
      postToken: "POST /api/token",
      getPatient: "GET  /api/patient/:nik",
      getPractitioner: "GET  /api/practitioner/:nik",
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📋 Endpoints tersedia:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   POST http://localhost:${PORT}/api/register-patient`);
  console.log(`   GET  http://localhost:${PORT}/api/token`);
  console.log(`   POST http://localhost:${PORT}/api/token`);
  console.log(`   GET  http://localhost:${PORT}/api/patient/:nik`);
  console.log(`   GET  http://localhost:${PORT}/api/practitioner/:nik`);
});
