# SATUSEHAT Patient Registration — Node.js

Simulasi alur pendaftaran pasien ke platform **SATUSEHAT** menggunakan FHIR R4 (Sandbox/Development environment).

## Alur Sistem

```
Step 1: OAuth2 → Access Token
Step 2: Lookup IHS Number (Pasien + Dokter)
Step 3: POST Location (Ruang Poli Umum)
Step 4: POST Encounter (status: arrived, class: AMB)
```

## Endpoint Token

Token OAuth2 bisa diambil lewat:

- `GET /api/token`
- `POST /api/token`

## Dokumentasi API

File export Postman ada di [docs/SATUSEHAT.postman_collection.json](docs/SATUSEHAT.postman_collection.json). Isinya mencakup:

- Step 1: ambil access token
- Step 2: lookup IHS Pasien dan Dokter
- Step 3-4: jalankan pendaftaran pasien lengkap lewat `POST /api/register-patient`

Kalau ingin impor cepat, set environment variable `baseUrl` ke `http://localhost:3000`.

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

Endpoint utama yang biasa dipakai saat testing:

- `GET /` untuk health check
- `GET /api/token` atau `POST /api/token` untuk akses token
- `GET /api/patient/:nik` untuk lookup IHS pasien
- `GET /api/practitioner/:nik` untuk lookup IHS dokter
- `POST /api/register-patient` untuk alur lengkap Step 1 sampai 4

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

| Role       | NIK               |
| ---------- | ----------------- |
| Pasien     | 1000000000000001  |
| Dokter     | 1000000000000002  |
| Organisasi | 10000004 (static) |

## Error Handling

| HTTP Code | Keterangan                                 |
| --------- | ------------------------------------------ |
| 401       | Token tidak valid / CLIENT_ID/SECRET salah |
| 404       | NIK tidak ditemukan di SATUSEHAT           |
| 422       | Payload FHIR tidak valid                   |
| Network   | Koneksi timeout atau DNS gagal             |
