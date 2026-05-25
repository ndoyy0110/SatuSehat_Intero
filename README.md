# SATUSEHAT Patient Registration — Node.js

Simulasi alur pendaftaran pasien ke platform **SATUSEHAT** menggunakan FHIR R4 (Sandbox/Development environment).

## Alur Sistem

```
Step 1: OAuth2 → Access Token
Step 2: Lookup IHS Number (Pasien + Dokter)
Step 3: POST Location (Ruang Poli Umum)
Step 4: POST Encounter (status: arrived, class: AMB)
```

## Prasyarat

- Node.js v18+
- Akun SATUSEHAT Developer (https://platform.satusehat.kemkes.go.id)
- `CLIENT_ID` dan `CLIENT_SECRET` dari portal SATUSEHAT

## Instalasi

```bash
git clone <repo-url>
cd satusehat-patient-registration
npm install
```

## Konfigurasi

Salin `.env.example` menjadi `.env` dan isi dengan credential Anda:

```bash
cp .env.example .env
```

```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
AUTH_URL=https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken
BASE_URL=https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1
ORGANIZATION_ID=10000004
```

## Menjalankan

```bash
npm start
```

## Struktur Project

```
satusehat-patient-registration/
├── src/
│   ├── auth.js          # Step 1: OAuth2 token
│   ├── masterData.js    # Step 2: IHS Number lookup
│   ├── location.js      # Step 3: POST Location
│   └── encounter.js     # Step 4: POST Encounter
├── index.js             # Main orchestrator
├── .env.example
└── README.md
```

## NIK Dummy (Sandbox)

| Role         | NIK              |
|--------------|------------------|
| Pasien       | 1000000000000001 |
| Dokter       | 1000000000000002 |
| Organisasi   | 10000004 (static)|

## Error Handling

| HTTP Code | Keterangan                                      |
|-----------|-------------------------------------------------|
| 401       | Token tidak valid / CLIENT_ID/SECRET salah      |
| 404       | NIK tidak ditemukan di SATUSEHAT                |
| 422       | Payload FHIR tidak valid                        |
| Network   | Koneksi timeout atau DNS gagal                  |
