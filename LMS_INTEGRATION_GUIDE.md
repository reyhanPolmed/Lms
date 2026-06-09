# Panduan Integrasi Winnowing API untuk LMS

Dokumen ini ditujukan untuk tim backend LMS yang ingin mengintegrasikan service
pendeteksi kemiripan tugas siswa berbasis Winnowing ke sistem mereka. Fokus
dokumen ini adalah integrasi teknis dan alur bisnis, bukan implementasi UI.

## Ringkasan

Service ini menerima file atau teks submission siswa, memprosesnya secara async,
memanggil OCR API untuk gambar tulisan tangan, lalu menghitung kemiripan dengan
submission lain dalam scope yang relevan.

Karakter utama service:

- API-only, tanpa frontend
- Mendukung input file dan teks
- Mendukung OCR untuk gambar tulisan tangan
- Pemrosesan async dengan worker background
- Isolasi data antar sekolah dengan `tenantId`
- Idempotent submit dengan `tenantId + externalId`

## Arsitektur yang Disarankan

Gunakan service ini sebagai subsistem, bukan sebagai source of truth utama.

Arsitektur yang disarankan:

1. `Frontend LMS siswa` mengirim tugas ke backend LMS.
2. `Backend LMS` menyimpan submission, file asli, dan metadata akademik.
3. `Backend LMS` mengirim file atau teks ke Winnowing API.
4. `Winnowing API` membuat record dokumen dan job queue, lalu membalas `202 Accepted`.
5. `Worker` memproses job di background.
6. `Backend LMS guru` membaca status dan hasil dari Winnowing API.

Komponen:

- `LMS Backend`: orchestrator utama
- `Winnowing API`: penerima request dan penyaji hasil
- `Worker`: pemrosesan OCR dan Winnowing
- `PostgreSQL`: penyimpanan dokumen, fingerprint, hasil similarity, dan queue
- `OCR API`: ekstraksi teks untuk gambar tulisan tangan

## Kapan Backend LMS Harus Memanggil API Ini

Panggil Winnowing API setelah submission berhasil disimpan oleh LMS.

Urutan yang benar:

1. Validasi deadline, hak akses siswa, format file, dan ukuran file di LMS.
2. Simpan submission ke database LMS.
3. Simpan file asli ke storage LMS.
4. Kirim metadata submission ke Winnowing API.
5. Tampilkan status `submitted` ke siswa tanpa menunggu hasil similarity.

Jangan memanggil service ini langsung dari frontend siswa.

## Konsep Data yang Wajib Dipahami

### `tenantId`

`tenantId` mewakili sekolah atau instansi. Semua pembandingan dibatasi dalam
tenant yang sama.

Contoh:

- `smkn1-bandung`
- `smp-islam-al-ikhlas`
- `kampus-a`

### `externalId`

`externalId` adalah ID submission dari LMS Anda. Field ini bisa dikirim sebagai
`externalId` atau `submissionId`.

Fungsi:

- menjaga idempotensi submit
- mendukung resubmit tanpa membuat dokumen duplikat liar
- menjaga keterkaitan hasil similarity dengan submission LMS

### Scope Pembandingan

Urutan scope yang dipakai service:

1. jika `assignmentId` ada, bandingkan dalam tugas yang sama
2. jika `assignmentId` kosong tetapi `courseId` ada, bandingkan dalam kelas yang sama
3. jika keduanya kosong, bandingkan dalam tenant yang sama

Untuk LMS sekolah, hampir selalu sebaiknya kirim `assignmentId`.

## Authentication

Set `WINNOWING_API_KEY` pada environment service. Backend LMS mengirim salah
satu header berikut:

```text
Authorization: Bearer <api-key>
```

atau:

```text
x-api-key: <api-key>
```

Untuk development lokal, autentikasi akan nonaktif jika `WINNOWING_API_KEY`
tidak diisi.

## Endpoint yang Digunakan LMS

### 1. Submit dokumen

```text
POST /api/v1/documents
```

Fungsi:

- membuat atau memperbarui dokumen submission
- membuat job async
- tidak memproses similarity secara sinkron

### 2. Ambil daftar dokumen

```text
GET /api/v1/documents
```

Dipakai untuk:

- dashboard guru
- daftar submission per assignment
- filtering berdasarkan status proses

### 3. Ambil ringkasan satu dokumen

```text
GET /api/v1/documents/:id
```

### 4. Ambil status proses dokumen

```text
GET /api/v1/documents/:id/status
```

### 5. Retry dokumen gagal

```text
POST /api/v1/documents/:id/retry
```

### 6. Ambil daftar pasangan mirip

```text
GET /api/v1/documents/:id/pairs
```

### 7. Ambil detail comparison

```text
GET /api/v1/comparisons/:id
```

### 8. Ambil status job

```text
GET /api/v1/jobs/:id
```

### 9. Health check

```text
GET /api/v1/health
```

## Pola Submit yang Disarankan

Service menerima dua jenis input:

1. `multipart/form-data`
2. `application/json`

### Opsi A: Kirim file langsung

Gunakan ini jika LMS Anda ingin Winnowing service yang menentukan sendiri apakah
file diparse lokal atau perlu OCR.

Contoh:

```bash
curl -X POST "http://localhost:3000/api/v1/documents" \
  -H "Authorization: Bearer change-me" \
  -F "tenantId=smkn1-bandung" \
  -F "submissionId=subm_20260601_001" \
  -F "assignmentId=essay_biologi_01" \
  -F "studentId=siswa_123" \
  -F "courseId=kelas_8a" \
  -F "title=Tugas Sistem Pencernaan - Budi" \
  -F "languages=id" \
  -F "file=@tugas-budi.jpg"
```

Format yang efektif:

- `.txt`
- `.docx`
- PDF dengan text layer
- `.jpg`, `.jpeg`, `.png`, `.webp`, `.tif`, `.tiff`

Catatan:

- gambar akan dikirim ke OCR API
- scanned PDF saat ini belum di-OCR langsung oleh service ini
- jika LMS Anda banyak memakai scanned PDF, rasterisasi dulu halaman PDF menjadi gambar

### Opsi B: Kirim teks langsung

Gunakan ini jika LMS Anda sudah punya ekstraksi teks sendiri.

Contoh:

```bash
curl -X POST "http://localhost:3000/api/v1/documents" \
  -H "Authorization: Bearer change-me" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "smkn1-bandung",
    "submissionId": "subm_20260601_001",
    "assignmentId": "essay_biologi_01",
    "studentId": "siswa_123",
    "courseId": "kelas_8a",
    "title": "Tugas Sistem Pencernaan - Budi",
    "fileName": "subm_20260601_001.txt",
    "content": "isi tugas siswa",
    "metadata": {
      "studentName": "Budi",
      "assignmentTitle": "Essay Sistem Pencernaan"
    }
  }'
```

## Struktur Request yang Direkomendasikan

Field minimum yang direkomendasikan:

- `tenantId`
- `submissionId` atau `externalId`
- `assignmentId`
- `studentId`
- `courseId`
- `file` atau `content`

Field tambahan yang berguna:

- `title`
- `studentName`
- `assignmentTitle`
- `sourceSystem`
- `submittedAt`
- `metadata`
- `languages`

## Bentuk Response Submit

Response submit sengaja ringkas karena proses utama jalan di background.

Contoh:

```json
{
  "success": true,
  "data": {
    "operation": "created",
    "document": {
      "id": "cm_document_001",
      "tenantId": "smkn1-bandung",
      "externalId": "subm_20260601_001",
      "processingStatus": "QUEUED",
      "revision": 1,
      "maxSimilarity": 0,
      "similarityLevel": "low",
      "algorithmVersion": "2.0.0"
    },
    "job": {
      "id": "cm_job_001",
      "status": "QUEUED",
      "attempts": 0,
      "maxAttempts": 3
    }
  }
}
```

HTTP status:

```text
202 Accepted
```

## Status Processing

Status dokumen:

- `QUEUED`
- `EXTRACTING_TEXT`
- `RUNNING_OCR`
- `FINGERPRINTING`
- `COMPARING`
- `COMPLETED`
- `FAILED`

Makna:

- `QUEUED`: job sudah masuk antrean
- `EXTRACTING_TEXT`: worker sedang membaca teks dari dokumen
- `RUNNING_OCR`: worker sedang memanggil OCR API
- `FINGERPRINTING`: fingerprint sedang dibentuk
- `COMPARING`: similarity sedang dihitung
- `COMPLETED`: hasil siap dipakai guru
- `FAILED`: proses gagal dan bisa di-retry

## Pola Polling yang Disarankan

Backend LMS atau frontend guru dapat melakukan polling ringan.

Pola yang disarankan:

1. setelah submit, simpan `document.id` dan `job.id`
2. cek status dokumen setiap 5-10 detik
3. berhenti polling saat status `COMPLETED` atau `FAILED`

Contoh:

```text
GET /api/v1/documents/cm_document_001/status?tenantId=smkn1-bandung
```

## Integrasi untuk LMS Siswa

Yang sebaiknya terjadi di sisi siswa:

1. siswa submit tugas ke LMS
2. LMS simpan submission
3. LMS kirim dokumen ke Winnowing API
4. siswa langsung mendapat pesan `tugas berhasil dikirim`
5. status similarity berjalan di belakang layar

Yang sebaiknya ditampilkan ke siswa:

- `submitted`
- `checking originality`
- `checked`
- `check failed`

Yang sebaiknya tidak ditampilkan ke siswa:

- pasangan dokumen pembanding
- isi dokumen siswa lain
- highlight comparison antar siswa

## Integrasi untuk LMS Guru

Alur guru yang disarankan:

1. guru membuka daftar submission per assignment
2. LMS memanggil `GET /api/v1/documents?tenantId=...&assignmentId=...`
3. LMS menampilkan status proses dan skor tertinggi
4. guru membuka submission tertentu
5. LMS memanggil `GET /api/v1/documents/:id/pairs`
6. guru memilih salah satu pasangan
7. LMS memanggil `GET /api/v1/comparisons/:id`
8. LMS menampilkan skor, metrik, dan highlight

## Arti Metrik Similarity

Service mengembalikan beberapa metrik:

- `similarityScore`
- `jaccardScore`
- `containmentScoreA`
- `containmentScoreB`
- `matchedFingerprintCount`

Makna praktis:

- `jaccardScore` cocok untuk dokumen yang ukurannya mirip
- `containmentScore` membantu mendeteksi bagian yang disalin dari dokumen lebih besar
- `similarityScore` adalah skor utama yang dipakai service untuk klasifikasi level

Kategori level:

- `low`
- `medium`
- `high`

Hasil ini adalah indikator risiko, bukan keputusan akademik final.

## OCR dan Tulisan Tangan

Service ini akan memanggil OCR API hanya ketika file berupa gambar.

Urutan pemilihan teks OCR:

1. `llm_postprocess.corrected_text` jika valid
2. `full_text` jika corrected text tidak tersedia

OCR mentah dan metadata disimpan untuk audit.

OCR saat ini tidak ditanam langsung ke `winnowing.ts`. Keputusan itu sengaja
diambil agar:

- OCR provider bisa diganti
- algoritma Winnowing tetap bersih
- pipeline lebih mudah diuji

## Retry dan Fault Tolerance

Jika job gagal:

```text
POST /api/v1/documents/:id/retry?tenantId=smkn1-bandung
```

Service juga memiliki perilaku ini:

- retry otomatis dengan exponential backoff
- job `PROCESSING` yang tertinggal karena worker mati akan dikembalikan ke antrean
- resubmit dengan `externalId` yang sama akan membatalkan job lama dan membuat revision baru

## Rekomendasi Penyimpanan File

Implementasi saat ini menyimpan file sumber di PostgreSQL agar worker bisa
memproses submission setelah siswa logout.

Untuk deployment kecil sampai menengah, ini masih layak.

Untuk deployment besar, lebih baik:

1. simpan file asli di object storage seperti S3 atau MinIO
2. simpan object key di database
3. ubah service agar worker membaca file dari object storage

## Checklist Integrasi untuk Tim LMS

Checklist minimum:

1. Tentukan `tenantId` permanen untuk sekolah Anda.
2. Pastikan setiap submission punya `submissionId` yang stabil.
3. Kirim `assignmentId` pada semua tugas yang diperiksa.
4. Simpan `document.id` dan `job.id` dari response submit.
5. Bangun polling status di backend LMS atau dashboard guru.
6. Tampilkan hasil detail hanya untuk guru atau reviewer yang berwenang.
7. Jalankan API dan worker sebagai dua proses terpisah.
8. Isi `WINNOWING_API_KEY` pada production.
9. Hubungkan `OCR_API_URL` jika ingin memproses gambar tulisan tangan.
10. Tambahkan retry untuk status `FAILED`.

## Checklist Production

Sebelum dipakai lintas sekolah:

1. aktifkan autentikasi API key
2. gunakan HTTPS di reverse proxy
3. pisahkan database production dan development
4. tambahkan monitoring worker dan health check
5. pindahkan file source ke object storage jika volume dokumen besar
6. buat baseline migration Prisma jika ingin lifecycle migration formal
7. uji resubmit, retry, dan concurrent submit dalam assignment yang sama

## Endpoint Ringkas

Untuk integrator yang hanya butuh daftar cepat:

```text
GET    /api/v1/health
POST   /api/v1/documents
GET    /api/v1/documents
GET    /api/v1/documents/:id
DELETE /api/v1/documents/:id
GET    /api/v1/documents/:id/status
POST   /api/v1/documents/:id/retry
GET    /api/v1/documents/:id/pairs
GET    /api/v1/comparisons/:id
GET    /api/v1/jobs/:id
```

## Penutup

Cara paling aman menggunakan service ini adalah menjadikannya subsistem deteksi
di belakang backend LMS, sementara LMS tetap memegang logika akademik, deadline,
review guru, dan keputusan nilai akhir.
