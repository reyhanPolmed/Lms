LMS API Production Quickstart

Dokumen ini ditujukan untuk tim backend LMS yang hanya membutuhkan endpoint final
production dan contoh payload yang siap dipakai.

## Base URL

```text
http://34.66.71.7:3000
```

## Authentication

Kirim salah satu header berikut:

```http
Authorization: Bearer <WINNOWING_API_KEY>
```

atau:

```http
x-api-key: <WINNOWING_API_KEY>
```

Untuk semua endpoint yang membutuhkan scope tenant, kirim salah satu:

```http
x-tenant-id: <TENANT_ID>
```

atau query:

```text
?tenantId=<TENANT_ID>
```

## Format Response

Response sukses:

```json
{
  "success": true,
  "data": {}
}
```

Response error:

```json
{
  "success": false,
  "error": "Pesan error"
}
```

## Alur Integrasi Minimum

1. LMS submit dokumen ke `POST /api/v1/documents`
2. LMS simpan `document.id` dan `job.id`
3. LMS polling `GET /api/v1/documents/{id}/status`
4. Jika `COMPLETED`, LMS ambil `GET /api/v1/documents/{id}/pairs`
5. Jika user membuka detail similarity, LMS ambil `GET /api/v1/comparisons/{id}` atau `GET /api/v1/comparisons/{id}/visual`

## Endpoint Final

### 1. Health Check

```http
GET /api/v1/health
```

Contoh:

```bash
curl -X GET "http://34.66.71.7:3000/api/v1/health"
```

Contoh response:

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "algorithmVersion": "2.1.0"
  }
}
```

### 2. Submit Dokumen File

```http
POST /api/v1/documents
Content-Type: multipart/form-data
```

Field produksi yang disarankan:

| Field | Wajib | Keterangan |
| --- | --- | --- |
| `tenantId` | ya | tenant sekolah/institusi |
| `submissionId` | ya | id submission dari LMS |
| `assignmentId` | ya | id tugas |
| `studentId` | ya | id siswa |
| `courseId` | ya | id kelas/course |
| `title` | ya | judul submission |
| `languages` | tidak | default `id` |
| `file` | ya | file submission |
| `metadata` | tidak | object JSON string |

Contoh:

```bash
curl -X POST "http://34.66.71.7:3000/api/v1/documents" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>" \
  -H "x-tenant-id: school_001" \
  -F "tenantId=school_001" \
  -F "submissionId=subm_20260610_001" \
  -F "assignmentId=assignment_biologi_01" \
  -F "studentId=student_001" \
  -F "courseId=class_8a" \
  -F "title=Tugas Sistem Pencernaan - Budi" \
  -F "languages=id" \
  -F 'metadata={"studentName":"Budi","assignmentTitle":"Essay Sistem Pencernaan"}' \
  -F "file=@/path/to/tugas-budi.jpg"
```

Contoh response:

```json
{
  "success": true,
  "data": {
    "operation": "created",
    "document": {
      "id": "cmq7jzdlh00001sfdk0mvkqbw",
      "tenantId": "school_001",
      "externalId": "subm_20260610_001",
      "assignmentId": "assignment_biologi_01",
      "studentId": "student_001",
      "courseId": "class_8a",
      "title": "Tugas Sistem Pencernaan - Budi",
      "fileName": "tugas-budi.jpg",
      "mimeType": "image/jpeg",
      "processingStatus": "QUEUED",
      "revision": 1,
      "maxSimilarity": 0,
      "similarityLevel": "low",
      "algorithmVersion": "2.1.0"
    },
    "job": {
      "id": "cmq7jzdpq00011sfd5l2et42b",
      "status": "QUEUED",
      "attempts": 0,
      "maxAttempts": 3,
      "availableAt": "2026-06-10T04:12:57.517Z"
    }
  }
}
```

### 3. Submit Dokumen Teks Langsung

```http
POST /api/v1/documents
Content-Type: application/json
```

Contoh:

```bash
curl -X POST "http://34.66.71.7:3000/api/v1/documents" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>" \
  -H "x-tenant-id: school_001" \
  -H "Content-Type: application/json" \
  -d '{
    "tenantId": "school_001",
    "submissionId": "subm_20260610_002",
    "assignmentId": "assignment_biologi_01",
    "studentId": "student_002",
    "courseId": "class_8a",
    "title": "Essay Sistem Pencernaan",
    "fileName": "submission_002.txt",
    "content": "Sistem pencernaan manusia terdiri dari beberapa organ utama yang bekerja bersama untuk memproses makanan.",
    "languages": ["id"],
    "metadata": {
      "studentName": "Siti",
      "assignmentTitle": "Essay Sistem Pencernaan"
    }
  }'
```

Response sama dengan submit file.

### 4. Cek Status Dokumen

```http
GET /api/v1/documents/{documentId}/status?tenantId=<TENANT_ID>
```

Contoh:

```bash
curl -X GET "http://34.66.71.7:3000/api/v1/documents/cmq7jzdlh00001sfdk0mvkqbw/status?tenantId=school_001" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>"
```

Contoh response:

```json
{
  "success": true,
  "data": {
    "id": "cmq7jzdlh00001sfdk0mvkqbw",
    "externalId": "subm_20260610_001",
    "processingStatus": "COMPLETED",
    "processingError": null,
    "ocrLlmProvider": "deepseek",
    "ocrLlmModel": "deepseek-v4-flash",
    "ocrLlmStatus": "success",
    "ocrTextSource": "llm_corrected_words",
    "revision": 1,
    "processedAt": "2026-06-10T04:13:01.596Z"
  }
}
```

Status yang perlu ditangani LMS:

- `QUEUED`
- `EXTRACTING_TEXT`
- `RUNNING_OCR`
- `FINGERPRINTING`
- `COMPARING`
- `COMPLETED`
- `FAILED`

### 5. Daftar Pasangan Mirip

```http
GET /api/v1/documents/{documentId}/pairs?tenantId=<TENANT_ID>
```

Contoh:

```bash
curl -X GET "http://34.66.71.7:3000/api/v1/documents/cmq7jzdlh00001sfdk0mvkqbw/pairs?tenantId=school_001" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>"
```

Contoh response:

```json
{
  "success": true,
  "data": {
    "document": {
      "id": "cmq7jzdlh00001sfdk0mvkqbw",
      "title": "OCR E2E Test",
      "fileName": "ocr-e2e-sample.png",
      "externalId": "subm_20260610_001"
    },
    "pairs": [
      {
        "id": "cmq7k7uj6001k3rfdr1p4rdpt",
        "similarityScore": 100,
        "jaccardScore": 100,
        "containmentScoreA": 100,
        "containmentScoreB": 100,
        "matchedFingerprintCount": 28,
        "pairedDocument": {
          "id": "cmq7k7rmx00021sfd9rdpxz5d",
          "externalId": "subm_20260610_002",
          "assignmentId": "assignment_biologi_01",
          "studentId": "student_002",
          "courseId": "class_8a"
        },
        "sourceIsA": false,
        "similarityLevel": "high"
      }
    ]
  }
}
```

### 6. Detail Comparison

```http
GET /api/v1/comparisons/{comparisonId}?tenantId=<TENANT_ID>
```

Contoh:

```bash
curl -X GET "http://34.66.71.7:3000/api/v1/comparisons/cmq7k7uj6001k3rfdr1p4rdpt?tenantId=school_001" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>"
```

Contoh response ringkas:

```json
{
  "success": true,
  "data": {
    "id": "cmq7k7uj6001k3rfdr1p4rdpt",
    "documentAId": "cmq7k7rmx00021sfd9rdpxz5d",
    "documentBId": "cmq7jzdlh00001sfdk0mvkqbw",
    "similarityScore": 100,
    "jaccardScore": 100,
    "containmentScoreA": 100,
    "containmentScoreB": 100,
    "matchedFingerprintCount": 28,
    "matchedRangesA": [[0, 209]],
    "matchedRangesB": [[0, 209]],
    "similarityLevel": "high",
    "algorithmVersion": "2.1.0"
  }
}
```

### 7. Visual Comparison

Gunakan ini jika LMS ingin merender highlight pada preview gambar atau PDF scan.

Catatan penting production:

- Asset preview OCR tidak lagi dikirim sebagai URL internal OCR seperti
  `http://localhost:29999/static/...`
- Payload visual sekarang mengembalikan path proxy dari API utama:
  `/api/v1/ocr-assets/...`
- Untuk dipakai di frontend LMS, gabungkan path itu dengan base URL API:
  `http://34.66.71.7:3000/api/v1/ocr-assets/...`

```http
GET /api/v1/comparisons/{comparisonId}/visual?tenantId=<TENANT_ID>
```

Contoh:

```bash
curl -X GET "http://34.66.71.7:3000/api/v1/comparisons/cmq7k7uj6001k3rfdr1p4rdpt/visual?tenantId=school_001" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>"
```

Contoh response ringkas:

```json
{
  "success": true,
  "data": {
    "id": "cmq7k7uj6001k3rfdr1p4rdpt",
    "similarityScore": 100,
    "similarityLevel": "high",
    "documentA": {
      "id": "cmq7k7rmx00021sfd9rdpxz5d",
      "sourceUrl": "/api/v1/documents/cmq7k7rmx00021sfd9rdpxz5d/source?tenantId=school_001",
      "annotatedPdfUrl": "/api/v1/comparisons/cmq7k7uj6001k3rfdr1p4rdpt/annotated-pdf?tenantId=school_001&document=A",
      "layoutMap": {
        "pages": [
          {
            "imageUrl": "/api/v1/ocr-assets/results/0aed1632-9ab7-4360-8be0-10b91ffe9b9a.jpg"
          }
        ]
      },
      "highlights": [
        {
          "imageUrl": "/api/v1/ocr-assets/results/0aed1632-9ab7-4360-8be0-10b91ffe9b9a.jpg"
        }
      ]
    },
    "documentB": {
      "id": "cmq7jzdlh00001sfdk0mvkqbw",
      "sourceUrl": "/api/v1/documents/cmq7jzdlh00001sfdk0mvkqbw/source?tenantId=school_001",
      "annotatedPdfUrl": "/api/v1/comparisons/cmq7k7uj6001k3rfdr1p4rdpt/annotated-pdf?tenantId=school_001&document=B",
      "layoutMap": {
        "pages": [
          {
            "imageUrl": "/api/v1/ocr-assets/results/686cbbc5-8673-434a-b063-b9a1aebafde4.jpg"
          }
        ]
      },
      "highlights": [
        {
          "imageUrl": "/api/v1/ocr-assets/results/686cbbc5-8673-434a-b063-b9a1aebafde4.jpg"
        }
      ]
    }
  }
}
```

Contoh URL asset final yang bisa diakses publik:

```text
http://34.66.71.7:3000/api/v1/ocr-assets/results/0aed1632-9ab7-4360-8be0-10b91ffe9b9a.jpg
```

### 8. Ambil File Sumber Dokumen

```http
GET /api/v1/documents/{documentId}/source?tenantId=<TENANT_ID>
```

Contoh:

```bash
curl -X GET "http://34.66.71.7:3000/api/v1/documents/cmq7jzdlh00001sfdk0mvkqbw/source?tenantId=school_001" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>" \
  --output source-file
```

### 9. Retry Dokumen Gagal

```http
POST /api/v1/documents/{documentId}/retry?tenantId=<TENANT_ID>
```

Contoh:

```bash
curl -X POST "http://34.66.71.7:3000/api/v1/documents/cmq7jzdlh00001sfdk0mvkqbw/retry?tenantId=school_001" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>"
```

### 10. Detail Job

```http
GET /api/v1/jobs/{jobId}?tenantId=<TENANT_ID>
```

Contoh:

```bash
curl -X GET "http://34.66.71.7:3000/api/v1/jobs/cmq7jzdpq00011sfd5l2et42b?tenantId=school_001" \
  -H "Authorization: Bearer <WINNOWING_API_KEY>"
```

Contoh response ringkas:

```json
{
  "success": true,
  "data": {
    "id": "cmq7jzdpq00011sfd5l2et42b",
    "documentId": "cmq7jzdlh00001sfdk0mvkqbw",
    "documentRevision": 1,
    "status": "COMPLETED",
    "attempts": 1,
    "maxAttempts": 3,
    "startedAt": "2026-06-10T04:12:58.667Z",
    "completedAt": "2026-06-10T04:13:01.719Z",
    "lastError": null
  }
}
```

## Payload Produksi yang Disarankan

### Multipart file upload

```text
tenantId=school_001
submissionId=subm_20260610_001
assignmentId=assignment_biologi_01
studentId=student_001
courseId=class_8a
title=Tugas Sistem Pencernaan - Budi
languages=id
metadata={"studentName":"Budi","assignmentTitle":"Essay Sistem Pencernaan"}
file=@/path/to/file
```

### JSON text upload

```json
{
  "tenantId": "school_001",
  "submissionId": "subm_20260610_002",
  "assignmentId": "assignment_biologi_01",
  "studentId": "student_002",
  "courseId": "class_8a",
  "title": "Essay Sistem Pencernaan",
  "fileName": "submission_002.txt",
  "content": "Isi tugas siswa...",
  "languages": ["id"],
  "metadata": {
    "studentName": "Siti",
    "assignmentTitle": "Essay Sistem Pencernaan"
  }
}
```

## Data Minimum yang Harus Disimpan LMS

- `tenantId`
- `submissionId`
- `document.id`
- `job.id`
- `revision`
- `processingStatus`
- `processedAt`
- `similarityScore` tertinggi
- `comparisonId` untuk detail similarity

## Catatan Integrasi

- Gunakan `submissionId` LMS sebagai identifier utama yang dikirim ke API.
- Polling utama sebaiknya ke endpoint status dokumen, bukan ke job.
- Jika dokumen diupload ulang dengan `submissionId` yang sama dalam tenant yang sama, dokumen akan dianggap revisi.
- Untuk tampilan highlight gambar atau PDF scan, gunakan endpoint `visual`.
- Payload visual sekarang hanya mengandalkan `imageUrl`.
- `imageUrl` diproxy lewat `/api/v1/ocr-assets/...` pada API utama.
- `imageUrl` menunjuk ke gambar aligned/deskewed agar overlay highlight tetap rapi.