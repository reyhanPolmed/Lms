# Dokumentasi Alur Program: Modul Winnowing & External OCR

> Dokumen ini menjelaskan nama file, peran, dan alur kerja setiap file yang berkaitan
> dengan fitur **deteksi kemiripan (plagiarisme)** menggunakan engine Winnowing eksternal
> yang di dalamnya menjalankan proses OCR untuk membaca teks dari file submission siswa.

---

## Gambaran Besar Sistem

```
[Siswa submit tugas] ──► [Backend simpan file + enqueue check]
                                      │
                         [Worker background cek berkala]
                                      │
                         [Kirim file ke Winnowing API]
                                      │
                    ┌─────────────────▼──────────────────┐
                    │     Winnowing Provider (External)   │
                    │  1. OCR  → ekstrak teks dari PDF    │
                    │  2. Fingerprinting → hashing k-gram │
                    │  3. Comparing → bandingkan semua doc │
                    └─────────────────┬──────────────────┘
                                      │
                    [Backend polling status & sinkronisasi]
                                      │
                    [Guru lihat hasil di halaman Integrity Check]
```

---

## 1. BACKEND

### 1.1 `backend/src/server.ts`

**Peran:** Entry point server Express. Bertanggung jawab **menjalankan background worker** saat server nyala.

**Alur:**
1. Buat instance Express app.
2. Server mulai listen di port yang dikonfigurasi.
3. Langsung memanggil `startSimilarityWorker()` — worker mulai berjalan di background.
4. Saat server mati (SIGINT/SIGTERM), `stopSimilarityWorker()` dipanggil untuk membersihkan interval.

```
server.listen(port)
  └─► startSimilarityWorker()   ← mulai polling ke Winnowing API setiap N detik
```

---

### 1.2 `backend/src/services/similarity-worker.service.ts`

**Peran:** Mengelola **background worker** berbasis `setInterval`. Worker ini yang secara periodik menjalankan siklus cek kemiripan tanpa perlu request dari user.

**Alur:**
1. `startSimilarityWorker()` dipanggil dari `server.ts`.
2. Cek apakah konfigurasi Winnowing tersedia (`WINNOWING_API_BASE_URL` & `WINNOWING_TENANT_ID`).
   - Jika tidak ada → worker **tidak dijalankan**, log warning.
3. Langsung jalankan satu siklus awal (`runCycle()`).
4. Set `setInterval` dengan interval dari env `WINNOWING_SYNC_INTERVAL_MS`.
5. Setiap interval: panggil `runSimilarityWorkerCycle()` dari `winnowing.service.ts`.
6. Flag `running` digunakan agar siklus tidak tumpang tindih (tidak masuk ke siklus baru jika masih berjalan).

```
startSimilarityWorker()
  └─► runCycle() setiap WINNOWING_SYNC_INTERVAL_MS ms
        └─► runSimilarityWorkerCycle()  [dari winnowing.service.ts]
```

---

### 1.3 `backend/src/services/winnowing.service.ts`

**Peran:** **Inti dari seluruh logika kemiripan.** File ini mengandung semua fungsi untuk berkomunikasi dengan Winnowing API eksternal, mendispatch dokumen, sinkronisasi status, dan mengelola data di database.

**Fungsi-fungsi penting dan alurnya:**

#### A. `isWinnowingConfigured()`
Cek apakah env variable `WINNOWING_API_BASE_URL` dan `WINNOWING_TENANT_ID` sudah diset. Digunakan sebagai guard sebelum semua operasi API.

#### B. `mapProviderStatus(status)`
Mengkonversi status dari Winnowing API (`"RUNNING_OCR"`, `"FINGERPRINTING"`, `"COMPARING"`, dll.) ke status internal LMS (`queued`, `processing`, `completed`, `failed`).

> **Catatan:** Status `"RUNNING_OCR"` dari provider berarti engine sedang membaca teks dari PDF menggunakan OCR. Ini adalah bukti bahwa sistem menggunakan OCR eksternal dari Winnowing.

#### C. `buildOriginalitySummary(check)`
Membangun objek ringkasan yang dikembalikan ke frontend berisi: status, skor kemiripan tertinggi, level kemiripan, dll.

#### D. `enqueueTaskSubmissionSimilarityCheck(taskSubmissionId)` — dipanggil saat siswa submit
```
Siswa submit tugas
  └─► task.service.ts::submitStudentTask()
        └─► enqueueTaskSubmissionSimilarityCheck(submissionId)
              └─► Upsert record di tabel TaskSubmissionSimilarityCheck
                  - status: "not_requested"
                  - nextRetryAt: now()   ← tandai siap untuk di-dispatch
```

#### E. `runSimilarityWorkerCycle()` — dipanggil oleh worker setiap interval
```
runSimilarityWorkerCycle()
  ├─► Cek Winnowing terkonfigurasi? → jika tidak, return
  ├─► Ambil max 10 check dengan status "not_requested" yang nextRetryAt sudah lewat
  │     └─► Untuk setiap check: dispatchSimilarityCheck(checkId)
  └─► Ambil max 25 check dengan status "queued" atau "processing"
        └─► Untuk setiap check: syncSimilarityCheck(check)
```

#### F. `dispatchSimilarityCheck(checkId)` — kirim dokumen ke Winnowing
```
dispatchSimilarityCheck(checkId)
  ├─► Klaim check dengan atomic update (status "not_requested" → "processing")
  │   agar tidak double-dispatch
  ├─► Ambil data submission dari DB (termasuk path file)
  ├─► createWinnowingDocument(taskSubmissionId)
  │     ├─► Baca file dari disk (readFile)
  │     ├─► Buat FormData: tenantId, submissionId, assignmentId, studentId,
  │     │   courseId, title, languages:"id", metadata (nama siswa, kelas), file
  │     └─► POST ke /api/v1/documents  [Winnowing API]
  │           └─► Provider mulai proses: OCR → Fingerprinting → Comparing
  └─► Update DB:
        - Sukses: simpan documentId, jobId, status dari provider
        - Gagal: retry dengan exponential backoff (2^retryCount detik)
                 jika sudah maxRetries → status "failed"
```

#### G. `syncSimilarityCheck(check)` — polling status dari Winnowing
```
syncSimilarityCheck(check)
  ├─► GET /api/v1/documents/{documentId}/status?tenantId=...
  ├─► Konversi providerStatus → internal status (via mapProviderStatus)
  ├─► Jika status === "completed":
  │     └─► getSimilaritySummaryFromPairs(documentId)
  │           ├─► GET /api/v1/documents/{documentId}/pairs?tenantId=...
  │           ├─► normalizePairSummaries() → ambil skor tertinggi
  │           └─► syncRelatedChecksFromPairs() → update skor submission lain
  │                 yang menjadi "pasangan" dokumen ini
  └─► Update DB: status, maxSimilarity, similarityLevel, checkedAt, lastSyncedAt
```

#### H. `syncSimilaritySummaryFromPairs(check)` — dipanggil saat guru buka halaman integrity
Menyinkronkan data pairs terbaru dari Winnowing API ke DB saat guru melihat halaman integrity check.

#### I. Fungsi-fungsi query untuk guru
- `getTaskSubmissionIntegrityPairs(documentId)` → GET daftar pairs dari Winnowing
- `getTaskSubmissionIntegrityComparison(comparisonId)` → GET detail 1 comparison
- `getTaskSubmissionIntegrityComparisonVisual(comparisonId)` → GET data visual highlight
- `fetchTaskSubmissionIntegrityAsset(assetPath)` → Proxy streaming aset gambar/PDF dari Winnowing
- `retryTaskSubmissionIntegrityCheck(check)` → POST retry ke Winnowing atau reset status

---

### 1.4 `backend/src/services/teacher-integrity.service.ts`

**Peran:** Layer service khusus untuk **endpoint yang diakses guru**. Berisi validasi konteks guru, cache context, dan normalisasi data dari Winnowing API ke format yang dimengerti frontend.

**Fungsi-fungsi penting:**

#### A. `getTaskSubmissionIntegritySummary(submissionId, userId)`
```
Guru request summary
  ├─► getTeacherSubmissionRecord() → validasi guru punya akses ke submission ini
  ├─► Jika check sudah "completed" → sync ulang dari pairs API (data terbaru)
  └─► buildOriginalitySummary(check) → kembalikan ringkasan ke frontend
```

#### B. `listTaskSubmissionIntegrityPairs(submissionId, userId)`
```
Guru request daftar dokumen pembanding
  ├─► getTeacherSubmissionRecord() → validasi akses
  ├─► Jika check belum completed → return []
  ├─► getTaskSubmissionIntegrityPairs(documentId) → ambil dari Winnowing API
  ├─► enrichPairsWithLmsMetadata(rawPairs) → tambahkan nama siswa & kelas
  │   dari database LMS berdasarkan studentId yang ada di metadata Winnowing
  └─► Cache setiap pair ke comparisonContextCache (TTL 2 menit)
```

#### C. `getTaskSubmissionIntegrityPairDetail(submissionId, comparisonId, userId)`
```
Guru klik satu dokumen pembanding
  ├─► getValidatedComparisonContext() → cek cache dulu, kalau tidak ada ambil dari API
  └─► getTaskSubmissionIntegrityComparison(comparisonId) → detail comparison dari Winnowing
```

#### D. `getTaskSubmissionIntegrityPairVisual(submissionId, comparisonId, userId)`
```
Guru lihat preview visual dokumen
  ├─► getValidatedComparisonContext() → validasi + ambil pair record
  ├─► getTaskSubmissionIntegrityComparisonVisual(comparisonId) → data layout/highlight
  ├─► resolveSourceSide() → tentukan mana documentA mana documentB
  ├─► normalizeVisualPages() → buat URL gambar via proxy endpoint backend
  └─► normalizeVisualHighlights() → koordinat bounding box highlight teks mirip
```

#### E. `getTaskSubmissionIntegrityVisualAsset(submissionId, comparisonId, side, userId, rawAssetPath)`
```
Browser minta gambar/PDF highlight
  ├─► Validasi context (cache atau fetch ulang dari API)
  ├─► Cek rawAssetPath: harus dimulai dari path yang aman
  │   (/api/v1/ocr-assets/, /static/results/, /api/v1/comparisons/, /api/v1/documents/)
  └─► fetchTaskSubmissionIntegrityAsset(providerPath) → proxy stream dari Winnowing
```

Path `/api/v1/ocr-assets/` adalah direktori aset yang dihasilkan oleh proses OCR di sisi Winnowing provider.

#### F. `retryTaskSubmissionIntegrity(submissionId, userId)`
Guru minta ulang pemeriksaan saat status "failed". Memanggil `retryTaskSubmissionIntegrityCheck(check)`.

---

### 1.5 `backend/src/controllers/teacher-integrity.controller.ts`

**Peran:** Layer controller HTTP untuk endpoint-endpoint integrity guru. Menerima request Express, parse params, panggil service, kembalikan response.

**Endpoint yang dihandle:**

| Controller Function | HTTP Method | Path |
|---|---|---|
| `getTaskSubmissionIntegritySummaryController` | GET | `/api/teacher/task-submissions/:id/integrity-summary` |
| `listTaskSubmissionIntegrityPairsController` | GET | `/api/teacher/task-submissions/:id/integrity-pairs` |
| `getTaskSubmissionIntegrityPairDetailController` | GET | `/api/teacher/task-submissions/:id/integrity-pairs/:comparisonId` |
| `getTaskSubmissionIntegrityPairVisualController` | GET | `/api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/visual` |
| `getTaskSubmissionIntegrityPairVisualAssetController` | GET | `/api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/visual-asset` |
| `retryTaskSubmissionIntegrityController` | POST | `/api/teacher/task-submissions/:id/integrity-retry` |

**Khusus `visualAsset`:** Controller menggunakan `streamAssetResponse()` yang melakukan **pipe stream** dari response Winnowing API langsung ke response browser (tidak di-buffer ke memori). Ini penting agar file besar seperti PDF tidak membebani memory server.

---

### 1.6 `backend/src/routes/teacher.routes.ts`

**Peran:** Mendaftarkan semua route guru ke Express Router, termasuk route-route integrity check. Semua route diproteksi oleh `teacherMiddleware` (auth guard guru).

**Route yang relevan dengan Winnowing:**
```
GET  /task-submissions/:id/integrity-summary
GET  /task-submissions/:id/integrity-pairs
GET  /task-submissions/:id/integrity-pairs/:comparisonId
GET  /task-submissions/:id/integrity-pairs/:comparisonId/visual
GET  /task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/visual-asset
POST /task-submissions/:id/integrity-retry
```

---

### 1.7 `backend/src/services/task.service.ts` (bagian terkait)

**Peran:** Service untuk operasi tugas oleh siswa. **Titik awal trigger alur winnowing** ada di fungsi `submitStudentTask()`.

**Alur yang relevan (baris ~307):**
```
submitStudentTask(taskId, userId, payload)
  ├─► Validasi siswa, tugas, dan file submission
  ├─► Simpan file ke disk (uploadDir)
  ├─► Upsert/create record TaskSubmission di database
  └─► enqueueTaskSubmissionSimilarityCheck(savedSubmission.id)
        └─► [trigger alur winnowing — lihat winnowing.service.ts]
```

---

## 2. GURU (Akara-lms-guru)

### 2.1 `Akara-lms-guru/src/app/(workspace)/review-tugas/kelas/[kelasId]/mata-pelajaran/[mapelId]/pengumpulan/[submissionId]/integrity-check/page.tsx`

**Peran:** Halaman Next.js yang diakses guru untuk melihat hasil pemeriksaan kemiripan satu submission.

**Alur:**
1. Halaman menerima params dari URL: `kelasId`, `mapelId`, `submissionId`.
2. Decode nama kelas dan mata pelajaran dari URL.
3. Render komponen `<TaskIntegrityCheckView>` dengan props `submissionId` dan `backHref`.

---

### 2.2 `Akara-lms-guru/src/app/(workspace)/review-tugas/review-tugas-integrity-utils.ts`

**Peran:** Utility layer di sisi frontend untuk **memanggil API backend** dan **menormalisasi data** dari berbagai format response Winnowing ke tipe data yang digunakan komponen UI.

**Fungsi penting:**

#### A. `loadTaskIntegrityContext(submissionId)`
```
Dipanggil saat halaman integrity dibuka:
  ├─► teacherApi.getTaskSubmissionDetail(submissionId) → detail submission
  ├─► teacherApi.getTaskSubmissionIntegritySummary(submissionId) → status & skor
  └─► teacherApi.getTaskSubmissionIntegrityPairs(submissionId) → daftar doc pembanding
        └─► normalizePair() untuk setiap pair → ekstrak comparisonId, studentName,
            documentLabel, similarityScore dari berbagai kemungkinan field name
```

#### B. `loadTaskIntegrityPairDetail(submissionId, comparisonId)`
```
Saat guru klik satu dokumen pembanding:
  ├─► teacherApi.getTaskSubmissionIntegrityPairDetail(submissionId, comparisonId)
  ├─► Ekstrak skor: similarityScore, jaccardScore, containmentScoreA/B
  └─► normalizeHighlights() → ambil pasangan teks mirip (sourceText + comparisonText)
```

#### C. `loadTaskIntegrityPairVisual(submissionId, comparisonId)`
```
Untuk preview visual dokumen:
  ├─► teacherApi.getTaskSubmissionIntegrityPairVisual(submissionId, comparisonId)
  └─► normalizePreviewAsset() untuk sourceDocument dan comparisonDocument
        └─► resolveApiUrl() → ubah path relative ke URL absolut backend
            agar gambar/PDF bisa di-fetch langsung oleh browser
```

---

### 2.3 `Akara-lms-guru/src/components/review-tugas/task-integrity-check-view.tsx`

**Peran:** Komponen utama UI halaman integrity check. Mengatur state, polling otomatis, dan menyusun tampilan keseluruhan.

**Alur state:**
```
Mount komponen
  └─► loadData() → loadTaskIntegrityContext(submissionId)
        ├─► Jika status "queued"/"processing":
        │     setInterval 6 detik → loadData(silent=true) [polling otomatis]
        └─► Jika status "completed" & activeComparisonId berubah:
              loadTaskIntegrityPairVisual() + loadTaskIntegrityPairDetail()

Guru klik dokumen di daftar pembanding (IntegrityComparisonList)
  └─► setActiveComparisonId(comparisonId)
        └─► useEffect → load visual + detail untuk comparison tersebut

Guru klik "Coba lagi" (saat status "failed")
  └─► teacherApi.retryTaskSubmissionIntegrity(submissionId)
        └─► loadData() ulang
```

**Render logic:**
- Status belum completed → tampilkan `EmptyState` dengan label sesuai status.
- Tidak ada pairs → tampilkan pesan "belum ada dokumen pembanding".
- Sudah completed & ada pairs → tampilkan 3-column layout:
  - Kiri: `IntegrityComparisonList` (daftar dokumen pembanding)
  - Tengah: `IntegrityDocumentPreview` (dokumen sumber/submission yang diperiksa)
  - Kanan: `IntegrityDocumentPreview` (dokumen pembanding yang dipilih)
  - Bawah: tabel segmen teks yang mirip (`highlights`)

---

### 2.4 `Akara-lms-guru/src/components/review-tugas/integrity-comparison-list.tsx`

**Peran:** Komponen sidebar kiri yang menampilkan **daftar semua dokumen yang mirip** dengan submission yang sedang diperiksa.

**Alur:**
1. Menerima `items: IntegrityPairSummary[]` (hasil normalisasi dari utils).
2. Render setiap item sebagai button dengan nama siswa, label dokumen, dan skor kemiripan.
3. Saat di-klik → panggil `onSelect(comparisonId)` → parent update `activeComparisonId`.
4. Item yang aktif diberi highlight warna indigo.

---

### 2.5 `Akara-lms-guru/src/components/review-tugas/integrity-document-preview.tsx`

**Peran:** Komponen untuk menampilkan **preview visual** satu dokumen (sumber maupun pembanding) dengan highlight bagian yang mirip.

**Alur:**
1. Menerima `document: IntegrityPreviewAsset` berisi URL gambar/PDF dari backend (proxy ke Winnowing).
2. Jika dokumen adalah PDF dan ada `annotatedPdfUrl`:
   - `requestPdfBlobUrl()` → fetch PDF dengan credentials (URL diproteksi auth backend).
   - Konversi response ke Blob URL (`URL.createObjectURL`).
   - Render `<iframe src={blobUrl}>` untuk menampilkan PDF dengan annotation dari Winnowing.
3. Jika dokumen bukan PDF (gambar per halaman dari OCR):
   - Render `<img>` untuk setiap halaman.
   - Overlay `<span>` dengan posisi absolut berdasarkan `bboxNormalized` untuk menampilkan highlight merah di atas gambar.
4. Cleanup: `URL.revokeObjectURL(objectUrl)` saat komponen unmount untuk membebaskan memori.

---

### 2.6 `Akara-lms-guru/src/lib/api-client.ts` (bagian integrity)

**Peran:** Client HTTP terpusat untuk aplikasi guru. Berisi method-method `teacherApi` yang memanggil endpoint integrity backend.

**Method yang relevan:**
```
teacherApi.getTaskSubmissionIntegritySummary(submissionId)
  → GET /api/teacher/task-submissions/:id/integrity-summary

teacherApi.getTaskSubmissionIntegrityPairs(submissionId)
  → GET /api/teacher/task-submissions/:id/integrity-pairs

teacherApi.getTaskSubmissionIntegrityPairDetail(submissionId, comparisonId)
  → GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId

teacherApi.getTaskSubmissionIntegrityPairVisual(submissionId, comparisonId)
  → GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/visual

teacherApi.retryTaskSubmissionIntegrity(submissionId)
  → POST /api/teacher/task-submissions/:id/integrity-retry
```

---

## 3. SISWA (Akara-lms-siswa)

### 3.1 `Akara-lms-siswa/src/components/task/task-submission-form.tsx` (bagian terkait)

**Peran:** Form pengumpulan tugas siswa. Tidak langsung menggunakan Winnowing, tetapi **menampilkan status pemeriksaan orisinalitas** setelah siswa submit.

**Alur yang relevan:**
```
Setelah siswa submit tugas:
  └─► task.currentSubmission.originalityCheck?.status tersedia dari response API
        └─► getOriginalityStatusLabel(status) → tampilkan pesan sesuai status:
              - "queued"     → "Pemeriksaan orisinalitas masuk antrean."
              - "processing" → "Sedang memeriksa orisinalitas dokumen."
              - "completed"  → "Pemeriksaan orisinalitas selesai."
              - "failed"     → "Gagal. Guru dapat menjalankan ulang."
              - undefined    → "Belum dijalankan."
```

Siswa **tidak bisa melihat detail skor kemiripan** — hanya status. Detail hanya bisa dilihat oleh guru.

---

### 3.2 `Akara-lms-siswa/src/lib/api/client.ts` (bagian terkait)

**Peran:** Client HTTP dan mock data untuk aplikasi siswa. Bagian relevan adalah saat mode mock API digunakan untuk development.

**Alur mock submit (baris ~710-740):**
```
submitTask() dalam mode mock:
  └─► Langsung set taskSubmissionState[id] dengan:
        originalityCheck: { status: "queued", ... }
      → simulasi bahwa setelah submit, check sudah masuk antrean
```

Pada mode **real API**: memanggil `POST /api/tasks/:id/submit` → backend menjalankan `enqueueTaskSubmissionSimilarityCheck()` yang sebenarnya.

---

## 4. Alur Lengkap End-to-End

```
1. SISWA mengumpulkan tugas
   └─► POST /api/tasks/:id/submit (file + link)
         └─► task.service.ts::submitStudentTask()
               ├─► simpan file ke disk
               └─► enqueueTaskSubmissionSimilarityCheck(id) → record di DB

2. BACKGROUND WORKER (setiap N detik, diatur di .env WINNOWING_SYNC_INTERVAL_MS)
   └─► similarity-worker.service.ts::runCycle()
         └─► winnowing.service.ts::runSimilarityWorkerCycle()
               ├─► Dispatch pending checks (max 10):
               │     dispatchSimilarityCheck()
               │       └─► POST file ke Winnowing API /api/v1/documents
               │             Provider: OCR → Fingerprint → Compare
               └─► Sync active checks (max 25):
                     syncSimilarityCheck()
                       ├─► GET status dari Winnowing API
                       └─► Jika completed: ambil pairs, update skor di DB

3. GURU membuka halaman Integrity Check
   └─► integrity-check/page.tsx → <TaskIntegrityCheckView>
         └─► loadTaskIntegrityContext(submissionId)
               ├─► GET /integrity-summary → status & skor max
               └─► GET /integrity-pairs  → daftar dokumen mirip (diperkaya nama siswa)

4. GURU klik dokumen pembanding
   └─► setActiveComparisonId → useEffect trigger
         ├─► loadTaskIntegrityPairVisual() → data highlight per halaman
         │     └─► IntegrityDocumentPreview render PDF annotated / gambar + bbox
         └─► loadTaskIntegrityPairDetail() → skor jaccard, containment, segmen teks

5. SISWA melihat status di form submission
   └─► originalityCheck.status dari response GET /api/tasks/:id
         └─► getOriginalityStatusLabel() → teks status ditampilkan di UI
```

---

## 5. Istilah Kunci

| Istilah | Penjelasan |
|---|---|
| **OCR** | Optical Character Recognition — proses Winnowing membaca teks dari PDF/gambar. Ditandai status `RUNNING_OCR` dari provider. |
| **Fingerprinting** | Hashing dokumen menjadi kumpulan fingerprint (hash dari k-gram teks) menggunakan algoritma Winnowing. |
| **Winnowing** | Algoritma pemilihan fingerprint efisien — ambil nilai minimum dari setiap window, kurangi ukuran index sambil pertahankan akurasi. |
| **Comparison / Pair** | Hasil perbandingan dua dokumen oleh engine. Setiap pair punya `comparisonId`, skor kemiripan, dan data visual highlight. |
| **Similarity Score** | Persentase kemiripan antar dua dokumen (0-100%). |
| **Jaccard Score** | Metrik kemiripan: \|A ∩ B\| / \|A ∪ B\| — semakin tinggi, semakin mirip. |
| **Containment Score** | Seberapa banyak dokumen A "terkandung" di dokumen B, atau sebaliknya. |
| **Bounding Box** | Koordinat area di halaman dokumen yang terdeteksi mirip, ditampilkan sebagai highlight merah overlay di atas gambar halaman. |
| **Tenant** | Identitas organisasi/sekolah di Winnowing API, untuk memisahkan data antar institusi. |
| **Enqueue** | Mendaftarkan submission ke antrean pemeriksaan di database LMS. |
| **Dispatch** | Pengiriman file submission ke Winnowing API untuk mulai diproses. |
| **Sync** | Polling status terbaru dari Winnowing API dan memperbaruinya di database LMS. |
| **Proxy** | Backend bertindak sebagai perantara — gambar/PDF dari Winnowing dikirim melalui backend ke browser, sehingga URL Winnowing tidak terekspos langsung ke frontend. |
