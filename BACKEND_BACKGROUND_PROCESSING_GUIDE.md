# Panduan Backend LMS untuk Menjalankan Winnowing di Background

Dokumen ini menjelaskan bagaimana backend LMS dapat mengintegrasikan Winnowing
API dengan pola background processing, sehingga pemeriksaan kemiripan tetap
berjalan walaupun siswa sudah logout, browser ditutup, atau OCR membutuhkan
waktu lama.

## Tujuan

Target arsitektur:

1. siswa submit tugas ke LMS
2. backend LMS menyimpan submission terlebih dahulu
3. backend LMS mengirim submission ke Winnowing API
4. Winnowing API membuat job async
5. worker server memproses OCR dan Winnowing di background
6. backend LMS membaca status dan hasilnya belakangan

Dengan pola ini:

- request submit siswa tetap cepat
- tidak ada ketergantungan pada sesi login siswa
- OCR yang lambat tidak menyebabkan timeout pada submit
- retry bisa dilakukan tanpa meminta siswa upload ulang

## Prinsip Inti

Backend LMS harus memperlakukan pemeriksaan similarity sebagai proses terpisah
dari submit akademik.

Artinya:

- `submit tugas` adalah transaksi utama LMS
- `cek kemiripan` adalah proses background setelah submit berhasil

Jangan menunggu hasil Winnowing di request submit siswa.

## Arsitektur yang Disarankan

Komponen yang terlibat:

1. `Frontend LMS siswa`
2. `Backend LMS`
3. `Database LMS`
4. `File storage LMS`
5. `Winnowing API`
6. `Winnowing worker`
7. `OCR API`

Alur antarkomponen:

```text
Siswa -> Frontend LMS -> Backend LMS -> Database LMS
                                   -> File Storage
                                   -> Winnowing API -> PostgreSQL Winnowing
                                                      -> Worker -> OCR API
                                                      -> Worker -> Winnowing
```

## Flow Submit Siswa

Flow backend yang disarankan:

1. terima request submit dari siswa
2. validasi auth, deadline, assignment, dan format file
3. simpan submission ke database LMS
4. simpan file asli ke storage LMS
5. set status submission menjadi `submitted`
6. kirim request ke Winnowing API
7. simpan `documentId` dan `jobId` dari response Winnowing API
8. response sukses ke frontend siswa

Urutan ini penting. LMS tidak boleh menggantungkan keberhasilan submit pada OCR
atau Winnowing.

## Kenapa Bisa Tetap Berjalan Walaupun Siswa Logout

Setelah backend LMS berhasil:

- menyimpan submission
- menyimpan file
- mengirim dokumen ke Winnowing API

maka proses berikutnya sepenuhnya dijalankan server.

Yang bekerja setelah itu:

- database
- job queue
- worker background
- OCR API
- Winnowing processor

Jadi logout siswa tidak mempengaruhi proses.

## Data yang Sebaiknya Disimpan di Backend LMS

Setiap submission di LMS sebaiknya menyimpan field tambahan seperti:

- `submission_id`
- `assignment_id`
- `student_id`
- `course_id`
- `tenant_id`
- `original_file_url` atau `storage_key`
- `similarity_document_id`
- `similarity_job_id`
- `similarity_status`
- `similarity_score`
- `similarity_checked_at`
- `similarity_error`

Contoh status similarity di LMS:

- `not_requested`
- `queued`
- `processing`
- `completed`
- `failed`

## Kapan Backend LMS Memanggil Winnowing API

Panggil Winnowing API hanya setelah submission sukses disimpan.

Waktu yang benar:

1. sesudah database LMS commit
2. sesudah file berhasil tersimpan
3. sebelum response final ke siswa, atau segera setelahnya melalui internal job

Ada dua pendekatan backend yang valid.

### Pendekatan A: langsung panggil Winnowing API setelah submit

Flow:

1. backend LMS simpan submission
2. backend LMS memanggil `POST /api/v1/documents`
3. backend LMS simpan `documentId` dan `jobId`
4. backend LMS balas ke siswa

Kelebihan:

- implementasi lebih sederhana
- cocok untuk traffic kecil sampai menengah

Kekurangan:

- request submit tetap tergantung pada satu request outbound ke Winnowing API

### Pendekatan B: backend LMS membuat internal queue dulu

Flow:

1. backend LMS simpan submission
2. backend LMS membuat internal job `enqueue_similarity_check`
3. response ke siswa langsung dikirim
4. worker internal LMS memanggil Winnowing API

Kelebihan:

- submit siswa paling cepat
- lebih tahan jika Winnowing API sedang down sementara

Kekurangan:

- arsitektur backend LMS sedikit lebih kompleks

Untuk production yang serius, pendekatan B lebih kuat.

## Request yang Dikirim Backend LMS

Backend LMS dapat mengirim file atau teks.

### Opsi 1: kirim file ke Winnowing API

Gunakan ini jika Anda ingin service Winnowing yang memutuskan apakah perlu OCR.

Contoh field:

- `tenantId`
- `submissionId`
- `assignmentId`
- `studentId`
- `courseId`
- `title`
- `file`
- `languages`

Contoh:

```bash
curl -X POST "http://localhost:3000/api/v1/documents" \
  -H "Authorization: Bearer change-me" \
  -F "tenantId=school_001" \
  -F "submissionId=subm_001" \
  -F "assignmentId=assignment_01" \
  -F "studentId=student_99" \
  -F "courseId=kelas_8a" \
  -F "languages=id" \
  -F "file=@jawaban-budi.jpg"
```

### Opsi 2: backend LMS kirim teks langsung

Gunakan ini jika LMS sudah punya OCR atau ekstraksi teks sendiri.

Contoh:

```json
{
  "tenantId": "school_001",
  "submissionId": "subm_001",
  "assignmentId": "assignment_01",
  "studentId": "student_99",
  "courseId": "kelas_8a",
  "title": "Tugas Sistem Pencernaan - Budi",
  "fileName": "subm_001.txt",
  "content": "isi tugas siswa"
}
```

## Bentuk Response yang Perlu Disimpan Backend LMS

Response submit dari Winnowing API berisi dua hal penting:

1. `document.id`
2. `job.id`

Contoh response:

```json
{
  "success": true,
  "data": {
    "operation": "created",
    "document": {
      "id": "cm_document_001",
      "externalId": "subm_001",
      "processingStatus": "QUEUED",
      "revision": 1
    },
    "job": {
      "id": "cm_job_001",
      "status": "QUEUED"
    }
  }
}
```

Backend LMS sebaiknya menyimpan:

- `similarity_document_id = document.id`
- `similarity_job_id = job.id`
- `similarity_status = document.processingStatus`

## Bagaimana Worker Background Bekerja

Di service Winnowing, worker berjalan terpisah dari API server.

Tugas worker:

1. mengambil job dari queue
2. membaca file atau teks sumber
3. jika file gambar, memanggil OCR API
4. menyiapkan teks final
5. menjalankan fingerprinting Winnowing
6. menghitung similarity dengan dokumen lain
7. menyimpan hasil
8. mengubah status menjadi `COMPLETED` atau `FAILED`

Ini yang membuat proses tetap berjalan di server tanpa kehadiran user.

## Cara Backend LMS Mengetahui Proses Sudah Selesai

Ada dua cara utama.

### Opsi A: polling

Backend LMS atau dashboard guru memanggil:

```text
GET /api/v1/documents/:id/status?tenantId=school_001
```

atau:

```text
GET /api/v1/jobs/:id?tenantId=school_001
```

Pola polling yang disarankan:

1. mulai polling 5-10 detik setelah submit
2. interval 5-15 detik untuk proses aktif
3. berhenti jika status `COMPLETED` atau `FAILED`

### Opsi B: scheduler sinkronisasi backend LMS

Backend LMS menjalankan cron atau worker internal:

1. cari submission dengan status `queued` atau `processing`
2. query status ke Winnowing API
3. update database LMS

Untuk kebanyakan LMS, opsi B lebih rapi daripada polling dari frontend siswa.

## Status yang Akan Ditemui Backend LMS

Dari Winnowing service:

- `QUEUED`
- `EXTRACTING_TEXT`
- `RUNNING_OCR`
- `FINGERPRINTING`
- `COMPARING`
- `COMPLETED`
- `FAILED`

Mapping sederhana ke status LMS:

- `QUEUED` -> `queued`
- `EXTRACTING_TEXT`, `RUNNING_OCR`, `FINGERPRINTING`, `COMPARING` -> `processing`
- `COMPLETED` -> `completed`
- `FAILED` -> `failed`

## Flow yang Disarankan untuk Dashboard Guru

Backend LMS guru sebaiknya bekerja seperti ini:

1. ambil daftar submission dari database LMS
2. tampilkan status similarity per submission
3. untuk submission yang selesai, sediakan tombol lihat detail
4. saat guru membuka detail, backend LMS memanggil:
   - `GET /api/v1/documents/:id/pairs`
   - `GET /api/v1/comparisons/:id`

Guru tidak perlu melihat job queue. Guru cukup melihat status hasil review.

## Retry Jika Gagal

Jika dokumen gagal diproses, backend LMS dapat memanggil:

```text
POST /api/v1/documents/:id/retry?tenantId=school_001
```

Sebaiknya backend LMS melakukan retry jika:

- OCR timeout
- service sedang overload
- terjadi kegagalan sementara

Jangan retry tanpa batas. Simpan jumlah retry di sisi LMS juga jika perlu.

## Resubmit Tugas Siswa

Kasus resubmit harus ditangani dengan benar.

Aturan yang disarankan:

1. LMS tetap memakai `submissionId` yang stabil atau ID versi submission yang jelas
2. jika submission yang sama diperbarui, Winnowing API akan membuat revision baru
3. job lama dibatalkan
4. worker hanya memproses revision terbaru

Backend LMS harus memperbarui relasi `similarity_document_id` dan status sesuai
response terbaru.

## Pseudocode Backend LMS

Contoh flow submit:

```ts
async function submitAssignment(req, res) {
  const submission = await lmsSubmissionService.saveSubmission(req);

  try {
    const similarity = await winnowingApi.createDocument({
      tenantId: submission.tenantId,
      submissionId: submission.id,
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
      courseId: submission.courseId,
      title: submission.title,
      file: submission.file,
    });

    await lmsSubmissionService.updateSimilarityTracking(submission.id, {
      similarityDocumentId: similarity.data.document.id,
      similarityJobId: similarity.data.job.id,
      similarityStatus: similarity.data.document.processingStatus,
    });
  } catch (error) {
    await lmsSubmissionService.markSimilarityPending(submission.id, {
      similarityStatus: "queued",
      similarityError: "submit_to_winnowing_failed",
    });
  }

  return res.json({
    success: true,
    submissionId: submission.id,
    status: "submitted",
  });
}
```

Contoh flow sinkronisasi status:

```ts
async function syncSimilarityStatus(submission) {
  if (!submission.similarityDocumentId) return;

  const status = await winnowingApi.getDocumentStatus(
    submission.similarityDocumentId,
    submission.tenantId,
  );

  await lmsSubmissionService.updateSimilarityTracking(submission.id, {
    similarityStatus: mapStatus(status.data.processingStatus),
    similarityCheckedAt: status.data.processedAt,
    similarityError: status.data.processingError,
  });
}
```

## Kesalahan yang Harus Dihindari

Kesalahan umum:

1. menunggu hasil Winnowing di request submit siswa
2. memanggil API dari frontend siswa langsung
3. tidak menyimpan `documentId` dan `jobId`
4. tidak mengirim `tenantId`
5. tidak mengirim `assignmentId`
6. menampilkan detail comparison ke siswa
7. menganggap similarity sebagai vonis otomatis

## Rekomendasi Production

Untuk production, backend LMS sebaiknya:

1. menggunakan API key
2. mencatat request dan response error ke log
3. mempunyai internal retry jika submit ke Winnowing API gagal
4. mempunyai scheduler untuk sinkronisasi status
5. membatasi akses hasil detail hanya ke guru atau admin yang berwenang
6. menyimpan hasil summary di database LMS agar dashboard lebih cepat

## Checklist Implementasi Backend LMS

Checklist minimum:

1. tambahkan kolom tracking similarity di tabel submission LMS
2. pastikan backend LMS menyimpan file sebelum memanggil Winnowing API
3. panggil `POST /api/v1/documents` setelah submit sukses
4. simpan `documentId`, `jobId`, dan `processingStatus`
5. buat scheduler untuk sinkronisasi status
6. tampilkan hasil similarity hanya di portal guru
7. gunakan endpoint retry untuk dokumen gagal
8. kirim `assignmentId` dan `tenantId` secara konsisten

## Endpoint Ringkas untuk Backend LMS

```text
POST /api/v1/documents
GET  /api/v1/documents/:id/status
GET  /api/v1/jobs/:id
POST /api/v1/documents/:id/retry
GET  /api/v1/documents/:id/pairs
GET  /api/v1/comparisons/:id
```

## Penutup

Jika backend LMS menerapkan pola ini, maka pemeriksaan kemiripan akan benar-benar
berjalan di background atau server, terpisah dari request siswa, dan tetap aman
untuk skenario OCR lambat, logout setelah submit, resubmit, serta retry saat
gagal.
