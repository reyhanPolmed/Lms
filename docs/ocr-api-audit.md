# Audit REST API OCR di Akara LMS

Dokumen ini mengaudit endpoint REST OCR/visual-originality yang benar-benar dipakai oleh project `Akara-lms`, baik ke provider eksternal maupun proxy internal LMS.

Tanggal audit: `2026-06-12`

## Ruang lingkup

Audit ini hanya mencakup jalur OCR yang aktif dipakai kode:

- backend LMS mengirim submission ke provider originality/Winnowing
- provider menjalankan ekstraksi teks/OCR untuk file gambar atau dokumen scan
- guru membuka halaman `Integrity Check`
- frontend guru memuat preview visual, source file, annotated PDF, dan OCR image asset melalui backend LMS

Tidak semua endpoint provider didokumentasikan di sini. Yang dicatat hanya endpoint yang benar-benar dipakai implementasi saat ini.

## Ringkasan arsitektur

Alur yang berjalan:

1. siswa upload file tugas ke LMS
2. backend LMS menyimpan submission akademik
3. backend LMS memanggil provider `POST /api/v1/documents`
4. provider menjalankan `EXTRACTING_TEXT` atau `RUNNING_OCR` bila file membutuhkan OCR
5. backend LMS polling status dokumen
6. saat guru membuka `Integrity Check`, backend LMS memanggil endpoint pair/detail/visual provider
7. frontend guru tidak memanggil provider langsung; semua aset visual disajikan melalui proxy backend LMS

## Endpoint provider yang dipakai

Base URL provider saat ini:

```text
http://34.66.71.7:3000
```

Autentikasi:

```http
Authorization: Bearer <WINNOWING_API_KEY>
```

Tenant:

```text
?tenantId=<TENANT_ID>
```

### 1. `POST /api/v1/documents`

Fungsi:
- membuat dokumen originality baru
- memicu ekstraksi teks dan OCR bila file berupa gambar atau scan

Dipakai oleh:
- backend LMS di `backend/src/services/winnowing.service.ts`

Request multipart yang dipakai LMS:

```text
tenantId
submissionId
assignmentId
studentId
courseId
title
languages
metadata
file
```

Field `metadata` yang saat ini dikirim LMS:

```json
{
  "studentName": "Nama siswa",
  "className": "Nama kelas",
  "courseTitle": "Judul mapel/modul",
  "assignmentTitle": "Judul tugas",
  "submissionTitle": "Judul tugas - Nama siswa",
  "submissionFileName": "nama-file-asli.ext"
}
```

Contoh payload efektif yang digunakan LMS:

```text
tenantId=school_001
submissionId=19
assignmentId=29
studentId=7
courseId=8
title=soal jaringan komputer 3 - reyhan batubara
languages=id
metadata={"studentName":"reyhan batubara","className":"TRPL","courseTitle":"jaringan komputer","assignmentTitle":"soal jaringan komputer 3","submissionTitle":"soal jaringan komputer 3 - reyhan batubara","submissionFileName":"submission.jpg"}
file=@submission.jpg
```

Attribute response yang dipakai LMS:

- `data.document.id`
- `data.document.processingStatus`
- `data.document.maxSimilarity`
- `data.document.similarityLevel`
- `data.document.revision`
- `data.job.id`
- `data.job.status`

Contoh response ringkas:

```json
{
  "success": true,
  "data": {
    "operation": "created",
    "document": {
      "id": "cmq8zyzun0008cvfd70sl3a8t",
      "tenantId": "school_001",
      "externalId": "17",
      "assignmentId": "29",
      "studentId": "7",
      "courseId": "8",
      "title": "soal jaringan komputer 3 - reyhan batubara",
      "fileName": "submission.jpg",
      "mimeType": "image/jpeg",
      "processingStatus": "QUEUED",
      "revision": 1,
      "maxSimilarity": 0,
      "similarityLevel": "low"
    },
    "job": {
      "id": "cmq8zy...",
      "status": "QUEUED"
    }
  }
}
```

### 2. `GET /api/v1/documents/{documentId}/status?tenantId=<TENANT_ID>`

Fungsi:
- mengecek status proses originality dan OCR

Dipakai oleh:
- background worker LMS di `backend/src/services/winnowing.service.ts`

Attribute response yang dipakai LMS:

- `data.id`
- `data.externalId`
- `data.processingStatus`
- `data.processingError`
- `data.ocrLlmProvider`
- `data.ocrLlmModel`
- `data.ocrLlmStatus`
- `data.ocrTextSource`
- `data.revision`
- `data.processedAt`

Contoh response:

```json
{
  "success": true,
  "data": {
    "id": "cmq8zyzun0008cvfd70sl3a8t",
    "externalId": "17",
    "processingStatus": "COMPLETED",
    "processingError": null,
    "ocrLlmProvider": "deepseek",
    "ocrLlmModel": "deepseek-v4-flash",
    "ocrLlmStatus": "success",
    "ocrTextSource": "llm_corrected_words",
    "revision": 1,
    "processedAt": "2026-06-10T11:15:36.239Z"
  }
}
```

Status provider yang dipetakan LMS:

- `QUEUED`
- `EXTRACTING_TEXT`
- `RUNNING_OCR`
- `FINGERPRINTING`
- `COMPARING`
- `COMPLETED`
- `FAILED`

Mapping ke status LMS:

- `QUEUED` -> `queued`
- `EXTRACTING_TEXT`, `RUNNING_OCR`, `FINGERPRINTING`, `COMPARING` -> `processing`
- `COMPLETED` -> `completed`
- `FAILED` -> `failed`

### 3. `GET /api/v1/documents/{documentId}/pairs?tenantId=<TENANT_ID>`

Fungsi:
- mengambil daftar dokumen pembanding terhadap satu dokumen sumber

Dipakai oleh:
- backend LMS untuk menghitung `maxSimilarity` lokal
- backend LMS untuk daftar dokumen pembanding guru

Attribute response yang dipakai LMS:

- `id` atau `comparisonId`
- `similarityScore`
- `similarityLevel`
- `matchedFingerprintCount`
- `pairedDocumentId`
- `pairedExternalId`
- `pairedDocument.metadata.studentName`
- `pairedDocument.metadata.className`

Contoh response ringkas:

```json
{
  "success": true,
  "data": {
    "pairs": [
      {
        "id": "cmq8zzbjh0d92eifduls65wcv",
        "similarityScore": 100,
        "jaccardScore": 100,
        "containmentScoreA": 100,
        "containmentScoreB": 100,
        "matchedFingerprintCount": 1606,
        "similarityLevel": "high",
        "pairedDocumentId": "cmq8zz0dk000ccvfd9tbl1pii",
        "pairedExternalId": "19",
        "pairedDocument": {
          "studentId": "8",
          "metadata": {
            "studentName": "reyhan batubara",
            "className": "TRPL"
          }
        }
      }
    ]
  }
}
```

### 4. `GET /api/v1/comparisons/{comparisonId}`

Fungsi:
- detail similarity tekstual
- fallback untuk halaman guru ketika butuh segmen teks mirip

Dipakai oleh:
- backend LMS
- frontend guru via endpoint proxy LMS `integrity-pairs/:comparisonId`

Attribute response yang dipakai LMS/guru:

- `id`
- `documentAId`
- `documentBId`
- `similarityScore`
- `jaccardScore`
- `containmentScoreA`
- `containmentScoreB`
- `matchedFingerprintCount`
- `matchedRangesA`
- `matchedRangesB`
- `similarityLevel`

Contoh response ringkas:

```json
{
  "success": true,
  "data": {
    "id": "cmq8zzbjh0d92eifduls65wcv",
    "documentAId": "cmq8zyzun0008cvfd70sl3a8t",
    "documentBId": "cmq8zz0dk000ccvfd9tbl1pii",
    "similarityScore": 100,
    "jaccardScore": 100,
    "containmentScoreA": 100,
    "containmentScoreB": 100,
    "matchedFingerprintCount": 1606,
    "matchedRangesA": [[0, 209]],
    "matchedRangesB": [[0, 209]],
    "similarityLevel": "high"
  }
}
```

### 5. `GET /api/v1/comparisons/{comparisonId}/visual?tenantId=<TENANT_ID>`

Fungsi:
- mengembalikan konteks visual untuk preview OCR/gambar/PDF scan
- sumber utama mode `Highlight visual` di guru

Dipakai oleh:
- backend LMS di `teacher-integrity.service.ts`

Attribute response yang dipakai backend LMS:

- `data.id`
- `data.similarityScore`
- `data.similarityLevel`
- `data.documentA.id`
- `data.documentA.sourceUrl`
- `data.documentA.annotatedPdfUrl`
- `data.documentA.layoutMap.pages[]`
- `data.documentA.highlights[]`
- `data.documentB.id`
- `data.documentB.sourceUrl`
- `data.documentB.annotatedPdfUrl`
- `data.documentB.layoutMap.pages[]`
- `data.documentB.highlights[]`

Attribute `layoutMap.pages[]` yang dipakai:

- `pageIndex`
- `width`
- `height`
- `imageUrl`
- `alignedImageUrl`
- `originalImageUrl`
- `processedImageUrl`
- `pdfWidth`
- `pdfHeight`

Attribute `highlights[]` yang dipakai:

- `pageIndex`
- `text`
- `bboxNormalized.x1`
- `bboxNormalized.y1`
- `bboxNormalized.x2`
- `bboxNormalized.y2`

Contoh response ringkas:

```json
{
  "success": true,
  "data": {
    "id": "cmq8zzbjh0d92eifduls65wcv",
    "similarityScore": 100,
    "similarityLevel": "high",
    "documentA": {
      "id": "cmq8zyzun0008cvfd70sl3a8t",
      "sourceUrl": "/api/v1/documents/cmq8zyzun0008cvfd70sl3a8t/source?tenantId=school_001",
      "annotatedPdfUrl": "/api/v1/comparisons/cmq8zzbjh0d92eifduls65wcv/annotated-pdf?tenantId=school_001&document=A",
      "layoutMap": {
        "kind": "image",
        "pages": [
          {
            "pageIndex": 0,
            "width": 1654,
            "height": 2339,
            "imageUrl": "/api/v1/ocr-assets/results/ed9cbe2c-1a6a-42e2-a74b-0c68ae0300b9.jpg",
            "alignedImageUrl": "/api/v1/ocr-assets/results/ed9cbe2c-1a6a-42e2-a74b-0c68ae0300b9.jpg",
            "originalImageUrl": "/api/v1/ocr-assets/results/c7a913af-c59c-4731-ae56-580b8ee37dc1.jpg",
            "processedImageUrl": "/api/v1/ocr-assets/results/c80641d8-140e-43ad-8ceb-978c49b2c2f9.jpg",
            "pdfWidth": 1654,
            "pdfHeight": 2339
          }
        ]
      },
      "highlights": [
        {
          "pageIndex": 0,
          "text": "segmen mirip",
          "bboxNormalized": {
            "x1": 0.123,
            "y1": 0.421,
            "x2": 0.744,
            "y2": 0.465
          }
        }
      ]
    }
  }
}
```

Catatan:

- sebelum perbaikan OCR, `imageUrl` sempat mengarah ke host internal seperti `localhost`
- setelah perbaikan OCR, project mengobservasi path relatif seperti `/api/v1/ocr-assets/results/...jpg`
- karena path ini relatif, backend LMS sekarang wajib memproxy URL tersebut sebelum diberikan ke frontend guru

### 6. `GET /api/v1/documents/{documentId}/source?tenantId=<TENANT_ID>`

Fungsi:
- mengambil file sumber asli dokumen

Dipakai oleh:
- backend LMS proxy untuk preview `Dokumen asli`

Response:
- file binary
- `Content-Type` mengikuti mime file sumber, misalnya `application/pdf` atau `image/jpeg`

### 7. `GET /api/v1/comparisons/{comparisonId}/annotated-pdf?tenantId=<TENANT_ID>&document=A|B`

Fungsi:
- mengambil PDF hasil anotasi/highlight dari provider

Dipakai oleh:
- backend LMS proxy untuk preview `Versi anotasi`

Response:
- file binary PDF
- `Content-Type: application/pdf`

### 8. `GET /api/v1/ocr-assets/results/{filename}`

Fungsi:
- endpoint asset OCR image yang dipanggil tidak langsung
- URL ini muncul di payload `visual.layoutMap.pages[]`

Dipakai oleh:
- backend LMS proxy `visual-asset`

Format yang terobservasi:

```text
/api/v1/ocr-assets/results/<uuid>.jpg
```

Contoh observasi runtime:

```json
{
  "StatusCode": 200,
  "ContentType": "image/jpeg",
  "ContentLength": "279308"
}
```

## Endpoint proxy internal LMS yang terkait OCR

Frontend guru tidak memakai provider langsung. Yang dipakai UI adalah endpoint backend LMS berikut.

### 1. `GET /api/teacher/task-submissions/:id/integrity-summary`

Fungsi:
- membaca ringkasan originality lokal LMS

Response yang dipakai frontend:

```json
{
  "status": "completed",
  "providerStatus": "COMPLETED",
  "maxSimilarity": 100,
  "similarityLevel": "high",
  "revision": 1,
  "checkedAt": "2026-06-10T11:15:36.239Z",
  "lastSyncedAt": "2026-06-12T10:15:00.000Z",
  "errorMessage": null
}
```

### 2. `GET /api/teacher/task-submissions/:id/integrity-pairs`

Fungsi:
- daftar pair pembanding untuk halaman guru

Response yang dipakai frontend:

- `comparisonId`
- `studentName`
- `documentLabel`
- `similarityScore`
- `similarityLevel`

Contoh shape efektif setelah dinormalisasi frontend:

```json
[
  {
    "comparisonId": "cmq8zzbjh0d92eifduls65wcv",
    "studentName": "reyhan batubara",
    "documentLabel": "soal jaringan komputer 3 - reyhan batubara",
    "similarityScore": 100,
    "similarityLevel": "high"
  }
]
```

### 3. `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId`

Fungsi:
- detail pair tekstual untuk bagian `Segmen mirip`

Response yang dipakai frontend:

- `similarityScore`
- `jaccardScore`
- `containmentScoreA`
- `containmentScoreB`
- `matchedFingerprintCount`
- `highlights[]` atau segmen teks sejenis

### 4. `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/visual`

Fungsi:
- payload visual final yang dipakai UI guru

Response yang dipakai frontend:

```json
{
  "comparisonId": "cmq8zzbjh0d92eifduls65wcv",
  "similarityScore": 100,
  "similarityLevel": "high",
  "matchedFingerprintCount": 1606,
  "sourceDocument": {
    "id": "cmq8zyzun0008cvfd70sl3a8t",
    "side": "A",
    "sourceUrl": "/api/teacher/task-submissions/17/integrity-pairs/cmq8zzbjh0d92eifduls65wcv/documents/A/source",
    "annotatedPdfUrl": "/api/teacher/task-submissions/17/integrity-pairs/cmq8zzbjh0d92eifduls65wcv/documents/A/annotated-pdf",
    "layoutMap": {
      "kind": "image",
      "pages": [
        {
          "pageIndex": 0,
          "width": 1654,
          "height": 2339,
          "imageUrl": "/api/teacher/task-submissions/17/integrity-pairs/cmq8zzbjh0d92eifduls65wcv/documents/A/visual-asset?path=%2Fapi%2Fv1%2Focr-assets%2Fresults%2Fed9cbe2c-1a6a-42e2-a74b-0c68ae0300b9.jpg",
          "alignedImageUrl": "/api/teacher/task-submissions/17/integrity-pairs/cmq8zzbjh0d92eifduls65wcv/documents/A/visual-asset?path=%2Fapi%2Fv1%2Focr-assets%2Fresults%2Fed9cbe2c-1a6a-42e2-a74b-0c68ae0300b9.jpg",
          "originalImageUrl": "/api/teacher/task-submissions/17/integrity-pairs/cmq8zzbjh0d92eifduls65wcv/documents/A/visual-asset?path=%2Fapi%2Fv1%2Focr-assets%2Fresults%2Fc7a913af-c59c-4731-ae56-580b8ee37dc1.jpg",
          "processedImageUrl": "/api/teacher/task-submissions/17/integrity-pairs/cmq8zzbjh0d92eifduls65wcv/documents/A/visual-asset?path=%2Fapi%2Fv1%2Focr-assets%2Fresults%2Fc80641d8-140e-43ad-8ceb-978c49b2c2f9.jpg",
          "pdfWidth": 1654,
          "pdfHeight": 2339
        }
      ]
    },
    "highlights": []
  },
  "comparisonDocument": {
    "id": "cmq8zz0dk000ccvfd9tbl1pii",
    "side": "B",
    "sourceUrl": "/api/teacher/task-submissions/17/integrity-pairs/cmq8zzbjh0d92eifduls65wcv/documents/B/source",
    "annotatedPdfUrl": "/api/teacher/task-submissions/17/integrity-pairs/cmq8zzbjh0d92eifduls65wcv/documents/B/annotated-pdf",
    "layoutMap": {
      "kind": "image",
      "pages": []
    },
    "highlights": []
  }
}
```

### 5. `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/source`

Fungsi:
- proxy LMS ke provider source file

Response:
- binary file
- header dipertahankan dari upstream:
  - `Content-Type`
  - `Content-Length`
  - `Cache-Control`
  - `ETag`
  - `Last-Modified`
  - `Content-Disposition: inline`

### 6. `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/annotated-pdf`

Fungsi:
- proxy LMS ke annotated PDF provider

Response:
- binary PDF
- header proxy sama seperti endpoint source

### 7. `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/visual-asset?path=<providerPath>`

Fungsi:
- proxy LMS ke asset OCR image
- endpoint ini dibuat agar frontend guru tidak memuat `/api/v1/ocr-assets/...` langsung

Query:

- `path`: wajib

Nilai `path` yang diterima backend saat ini:

- `/api/v1/ocr-assets/...`
- `/static/results/...`

Response:
- binary image
- `Content-Type` dari upstream, umumnya `image/jpeg`

## Field yang benar-benar dipakai UI guru

Saat halaman `Integrity Check` dirender, field yang aktif dipakai frontend adalah:

### Summary

- `originalityCheck.status`
- `originalityCheck.maxSimilarity`
- `originalityCheck.similarityLevel`
- `originalityCheck.errorMessage`

### Daftar pembanding

- `comparisonId`
- `studentName`
- `documentLabel`
- `similarityScore`
- `similarityLevel`

### Preview visual

- `sourceDocument.sourceUrl`
- `sourceDocument.annotatedPdfUrl`
- `sourceDocument.layoutMap.pages[].alignedImageUrl`
- `sourceDocument.layoutMap.pages[].originalImageUrl`
- `sourceDocument.layoutMap.pages[].processedImageUrl`
- `sourceDocument.layoutMap.pages[].imageUrl`
- `sourceDocument.highlights[].bboxNormalized`
- field yang sama untuk `comparisonDocument`

### Detail pair

- `similarityScore`
- `jaccardScore`
- `containmentScoreA`
- `containmentScoreB`
- `matchedFingerprintCount`
- segmen teks mirip

## Temuan audit

### Sudah baik

- backend LMS sudah menjadi satu-satunya pihak yang menyimpan API key provider
- guru tidak memanggil provider langsung
- status OCR/originality sudah dipisahkan dari status akademik submission
- provider OCR asset kini mengembalikan asset publik yang bisa diambil

### Titik rawan yang perlu dijaga

- field `layoutMap.pages[].imageUrl` dari provider bisa berupa path relatif, jadi wajib selalu di-resolve atau diproxy
- `visual-asset` proxy saat ini hanya mengizinkan path yang diawali:
  - `/api/v1/ocr-assets/`
  - `/static/results/`
- jika provider nanti mengubah host/path OCR asset, whitelist proxy LMS perlu ikut diperbarui
- payload `visual` bisa berat; UI guru harus tetap siap fallback ke source/annotated PDF

## Kesimpulan

Secara teknis, REST API OCR yang digunakan project ini bukan OCR terpisah yang dipanggil frontend secara langsung. OCR berjalan di balik provider originality/Winnowing, lalu hasil visualnya dipakai lewat endpoint:

- `POST /api/v1/documents`
- `GET /api/v1/documents/{id}/status`
- `GET /api/v1/comparisons/{id}/visual`
- `GET /api/v1/ocr-assets/...`

Di sisi aplikasi LMS, jalur yang dipakai guru adalah proxy internal:

- `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/visual`
- `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/source`
- `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/annotated-pdf`
- `GET /api/teacher/task-submissions/:id/integrity-pairs/:comparisonId/documents/:side/visual-asset`

Itulah endpoint OCR/visual yang saat ini benar-benar menjadi bagian dari implementasi Akara LMS.
