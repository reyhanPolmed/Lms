# Dokumentasi Backend Integrasi API Originalitas / OCR

Dokumen ini menjelaskan bagaimana `backend` Akara LMS mengelola integrasi dengan sistem pendeteksi kemiripan dokumen dan OCR, berdasarkan implementasi aktual di repo saat ini.

## 1. Tujuan Integrasi

Backend LMS bertindak sebagai _orchestrator_ utama:

- menyimpan submission akademik siswa,
- mengirim file ke provider originalitas,
- melakukan sinkronisasi status secara asinkron,
- menyediakan endpoint guru untuk daftar pair, detail comparison, dan preview visual highlight,
- mem-proxy aset OCR agar frontend guru tidak mengakses provider langsung.

Blok alur utama:

```latex
\[
\text{Siswa Submit Tugas}
\rightarrow
\text{Backend Simpan Submission}
\rightarrow
\text{Enqueue Similarity Check}
\rightarrow
\text{Provider Membuat Document + Job}
\rightarrow
\text{Worker Polling Status}
\rightarrow
\text{Guru Membaca Hasil dari Backend LMS}
\]
```

## 2. Komponen Backend yang Terlibat

Implementasi utama berada di:

- `backend/src/services/task.service.ts`
- `backend/src/services/winnowing.service.ts`
- `backend/src/services/teacher-integrity.service.ts`
- `backend/src/controllers/teacher-integrity.controller.ts`
- `backend/src/routes/teacher.routes.ts`

## 3. Konfigurasi Environment

Backend mengandalkan environment berikut:

```env
WINNOWING_API_BASE_URL=http://34.66.71.7:3000
WINNOWING_API_KEY=local-dev-key
WINNOWING_TENANT_ID=school_001
WINNOWING_MAX_RETRIES=...
```

Secara logika:

```latex
\[
\text{isWinnowingConfigured}
=
(\text{WINNOWING\_API\_BASE\_URL} \neq \varnothing)
\land
(\text{WINNOWING\_TENANT\_ID} \neq \varnothing)
\]
```

Jika konfigurasi tidak lengkap, submission akademik tetap disimpan, tetapi similarity akan masuk status lokal error seperti `winnowing_not_configured`.

## 4. Fase Submit Tugas Siswa

Saat siswa mengumpulkan tugas file:

1. backend memvalidasi metode submit,
2. file disimpan ke storage lokal LMS,
3. row `task_submissions` dibuat atau diupdate,
4. backend memanggil `enqueueTaskSubmissionSimilarityCheck(savedSubmission.id)`.

Relasi logika submit:

```latex
\[
\text{TaskSubmission Saved}
\Rightarrow
\text{TaskSubmissionSimilarityCheck Upserted}
\]
```

Entry point aktual:

- `task.service.ts`
- setelah `create` atau `update` submission, backend memanggil:

```ts
await enqueueTaskSubmissionSimilarityCheck(savedSubmission.id);
```

## 5. Payload Submit ke Provider Originalitas

Backend mengirim multipart `POST /api/v1/documents` ke provider.

Field yang dikirim:

- `tenantId`
- `submissionId`
- `assignmentId`
- `studentId`
- `courseId`
- `title`
- `languages`
- `metadata`
- `file`

Metadata yang saat ini dikirim:

- `studentName`
- `className`
- `courseTitle`
- `assignmentTitle`
- `submissionTitle`
- `submissionFileName`

Representasi payload:

```latex
\[
\text{DocumentPayload} =
\{
\text{tenantId},
\text{submissionId},
\text{assignmentId},
\text{studentId},
\text{courseId},
\text{title},
\text{languages},
\text{metadata},
\text{file}
\}
\]
```

## 6. Penyimpanan Status Lokal di LMS

Backend menyimpan tracking similarity per submission pada tabel lokal `taskSubmissionSimilarityCheck`.

Field yang dikelola backend meliputi:

- `taskSubmissionId`
- `tenantId`
- `externalId`
- `similarityDocumentId`
- `similarityJobId`
- `similarityStatus`
- `providerStatus`
- `maxSimilarity`
- `similarityLevel`
- `revision`
- `retryCount`
- `nextRetryAt`
- `checkedAt`
- `lastSyncedAt`
- `similarityError`

Model status internal:

```latex
\[
\text{SimilarityStatus}_{LMS}
\in
\{
\text{not\_requested},
\text{queued},
\text{processing},
\text{completed},
\text{failed}
\}
\]
```

## 7. Worker Background Processing

Backend tidak menunggu hasil similarity saat siswa submit. Semua proses similarity dilanjutkan oleh worker internal.

### 7.1 Dispatch

Worker mengambil row lokal yang:

- `similarityStatus = not_requested`
- `nextRetryAt <= now`

Lalu backend:

1. meng-claim row,
2. mengubahnya sementara ke `processing` + `providerStatus=DISPATCHING`,
3. memanggil provider `POST /api/v1/documents`.

### 7.2 Sync Status

Worker juga mengambil row aktif yang:

- `similarityStatus ∈ { queued, processing }`
- `similarityDocumentId != null`

Lalu backend memanggil:

- `GET /api/v1/documents/{documentId}/status?tenantId=...`

Status provider kemudian dipetakan ke status internal LMS.

Representasi fungsi:

```latex
\[
f(\text{providerStatus}) = \text{similarityStatus}_{LMS}
\]
```

Contoh pemetaan konseptual:

```latex
\[
\begin{aligned}
\text{QUEUED} &\mapsto \text{queued} \\
\text{EXTRACTING\_TEXT} &\mapsto \text{processing} \\
\text{RUNNING\_OCR} &\mapsto \text{processing} \\
\text{FINGERPRINTING} &\mapsto \text{processing} \\
\text{COMPARING} &\mapsto \text{processing} \\
\text{COMPLETED} &\mapsto \text{completed} \\
\text{FAILED} &\mapsto \text{failed}
\end{aligned}
\]
```

### 7.3 Retry

Jika dispatch gagal:

- `retryCount` dinaikkan,
- `nextRetryAt` dijadwalkan ulang dengan _exponential backoff_,
- status akan menjadi `failed` jika retry habis.

Rumus backoff saat ini:

```latex
\[
\text{delayMs} = \min(60000, 2^{\text{retryCount}} \times 1000)
\]
```

## 8. Normalisasi Summary Similarity

Backend tidak hanya percaya pada endpoint `status`.

Jika provider sudah `COMPLETED`, backend akan mengambil summary dari endpoint `pairs` agar skor indeks kemiripan di LMS memakai skor tertinggi yang benar.

Endpoint provider yang dipakai:

- `GET /api/v1/documents/{documentId}/pairs?tenantId=...`

Normalisasi summary:

```latex
\[
\text{maxSimilarity}(d)
=
\max_{p \in \text{Pairs}(d)}(\text{similarityScore}(p))
\]
```

Artinya, setiap dokumen di daftar pengumpulan tugas harus menampilkan skor kemiripan tertinggi yang sudah ditemukan terhadap dokumen lain.

## 9. Endpoint Backend untuk Guru

Backend LMS mengekspos endpoint berikut:

```text
GET  /api/teacher/task-submissions/:id/integrity-summary
GET  /api/teacher/task-submissions/:id/integrity-pairs
GET  /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId
GET  /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/visual
GET  /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/visual-asset?path=...
POST /api/teacher/task-submissions/:id/integrity-retry
```

### 9.1 Integrity Summary

Mengembalikan ringkasan originality per submission:

- status,
- provider status,
- `maxSimilarity`,
- `similarityLevel`,
- `revision`,
- `checkedAt`,
- `errorMessage`.

### 9.2 Integrity Pairs

Backend mengambil pair dari provider lalu memperkaya metadata lokal LMS.

Pengayaan yang dilakukan:

- `studentName`
- `className`

Jika provider tidak memberi nama siswa yang rapi, backend akan fallback ke database LMS berdasarkan `studentId`.

## 10. Validasi Akses Guru

Sebelum guru boleh membaca pair atau visual:

1. backend memverifikasi bahwa submission milik kelas guru,
2. backend memverifikasi similarity submission sudah `completed`,
3. backend memastikan `comparisonId` memang ada pada pair dokumen sumber itu.

Model validasi:

```latex
\[
\text{Access Granted}
\iff
\text{Teacher Owns Submission}
\land
\text{Similarity Completed}
\land
\text{ComparisonId} \in \text{Pairs}(\text{sourceDocument})
\]
```

## 11. Kontrak Visual untuk Integrity Check

Endpoint guru:

```text
GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/visual
```

Backend mengambil data dari provider:

- `GET /api/v1/comparisons/{comparisonId}/visual?tenantId=...`

Kemudian backend menormalisasi dua hal:

1. `layoutMap.pages`
2. `highlights`

### 11.1 Layout Map

Field yang dipakai LMS:

- `pageIndex`
- `width`
- `height`
- `imageUrl`
- `pdfWidth`
- `pdfHeight`

`imageUrl` tidak diteruskan mentah. Backend mengubahnya menjadi URL proxy LMS:

```latex
\[
\text{imageUrl}_{LMS}
=
/api/teacher/task-submissions/{id}/integrity-pairs/{comparisonId}/documents/{side}/visual-asset?path=\cdots
\]
```

### 11.2 Highlights

Backend mengekstrak segment highlight dari provider, lalu menyederhanakan tiap item menjadi:

- `pageIndex`
- `text`
- `bboxNormalized`

Bentuk konseptual:

```latex
\[
\text{Highlight} =
\{
\text{pageIndex},
\text{text},
\text{bboxNormalized} = (x_1, y_1, x_2, y_2)
\}
\]
```

Sebuah bbox dianggap valid jika:

```latex
\[
x_2 > x_1 \land y_2 > y_1
\]
```

## 12. Proxy Aset OCR / Highlight Image

Frontend guru tidak boleh mengambil file visual langsung ke provider.

Karena itu backend menyediakan proxy:

```text
GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/visual-asset?path=...
```

Provider path yang diterima backend saat ini:

- `/api/v1/ocr-assets/...`
- `/static/results/...`

Jika path tidak termasuk bentuk yang diizinkan, backend me-return `404`.

Model pembatasan:

```latex
\[
\text{assetPath valid}
\iff
\text{prefix}(path) \in
\{
/api/v1/ocr-assets/,
/static/results/
\}
\]
```

## 13. Mengapa Preview Bisa Tampil tetapi Highlight Hilang

Secara arsitektur, ada tiga lapisan yang harus sinkron:

```latex
\[
\text{Provider Visual Payload}
\rightarrow
\text{Backend Normalization}
\rightarrow
\text{Frontend Overlay Renderer}
\]
```

Jika salah satu lapisan tertinggal:

- preview gambar bisa tetap tampil,
- tetapi overlay highlight bisa hilang,
- atau hanya halaman pertama yang tampil.

Pada implementasi LMS saat ini, backend dan frontend sudah disesuaikan agar:

- semua halaman `layoutMap.pages` dirender,
- overlay highlight digambar dari `bboxNormalized`,
- `highlights` fallback ke array kosong agar UI tidak crash.

## 14. Retry dari Halaman Guru

Jika similarity gagal atau perlu dipicu ulang, backend menyediakan:

```text
POST /api/teacher/task-submissions/:id/integrity-retry
```

Perilaku:

- jika `similarityDocumentId` belum ada:
  - row direset ke `not_requested`
  - retry akan dimulai ulang oleh worker
- jika `similarityDocumentId` sudah ada:
  - backend memanggil provider:
    - `POST /api/v1/documents/{documentId}/retry?tenantId=...`
  - status lokal diubah ke `queued`

## 15. Ringkasan Arsitektur

Arsitektur final backend:

```latex
\[
\begin{aligned}
\text{LMS Backend} &= \text{Academic Source of Truth} \\
\text{Winnowing/OCR Provider} &= \text{Similarity + OCR Engine} \\
\text{Teacher Frontend} &= \text{Consumer of Backend-normalized Integrity API}
\end{aligned}
\]
```

Atau secara alur penuh:

```latex
\[
\text{Student Submission}
\rightarrow
\text{Task Submission Saved}
\rightarrow
\text{Similarity Check Enqueued}
\rightarrow
\text{Provider Document Created}
\rightarrow
\text{Worker Status Sync}
\rightarrow
\text{Pair Summary Normalized}
\rightarrow
\text{Teacher Integrity Endpoints}
\rightarrow
\text{Visual Highlight Preview}
\]
```

## 16. Catatan Operasional

- Submission akademik tidak boleh gagal hanya karena provider originalitas gagal.
- Indeks kemiripan di daftar pengumpulan harus berasal dari skor tertinggi pair, bukan hanya dari status dokumen.
- Endpoint visual guru harus selalu memakai proxy backend, bukan URL provider langsung.
- Highlight preview PDF/jpg hanya akan benar jika provider, backend normalizer, dan frontend renderer sama-sama sinkron terhadap kontrak visual terbaru.
