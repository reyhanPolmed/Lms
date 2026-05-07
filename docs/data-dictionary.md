# Data Dictionary (Canonical)

This document standardizes the names of all entities and attributes used across the Akara LMS project. All frontend and backend applications must adhere to this naming convention.

## Base Entity Attributes
- `id`: string (UUID or standard ID)
- `createdAt`: string (ISO-8601 Date)
- `updatedAt`: string (ISO-8601 Date)

## Entities

### `User`
- `id`: string
- `fullName`: string (Legacy DB map: `nama` / `name`)
- `email`: string
- `role`: enum (`student`, `teacher`, `admin`)
- `avatarUrl`: string | null (Legacy DB map: `foto` / `image`)
- `isActive`: boolean

### `StudentProfile`
- `id`: string
- `userId`: string
- `nisn`: string | null
- `classId`: string | null (Legacy DB map: `kelasId`)

### `TeacherProfile`
- `id`: string
- `userId`: string
- `employeeId`: string | null (Legacy DB map: `nip`)
- `subjectSpecialization`: string | null

### `AdminProfile`
- `id`: string
- `userId`: string

### `ClassRoom` (replaces `StudentClass` / `kelas`)
- `id`: string
- `name`: string (Legacy DB map: `namaKelas`)
- `gradeLevel`: string
- `academicYear`: string
- `homeroomTeacherId`: string | null

### `Course` (replaces `Module` / `mapel`)
- `id`: string
- `title`: string (Legacy DB map: `judul`)
- `description`: string (Legacy DB map: `deskripsi`)
- `teacherId`: string | null
- `classId`: string | null

### `Enrollment` (replaces `ModuleStudentClass`)
- `id`: string
- `studentId`: string
- `classId`: string

### `Material` (replaces `Lesson`)
- `id`: string
- `courseId`: string
- `title`: string (Legacy DB map: `judul`)
- `description`: string
- `fileUrl`: string | null
- `content`: string (Legacy DB map: `konten`)
- `isPublished`: boolean

### `Assignment` (replaces `Task`)
- `id`: string
- `courseId`: string
- `title`: string (Legacy DB map: `judul`)
- `description`: string (Legacy DB map: `deskripsi`)
- `dueAt`: string
- `maxScore`: number | null
- `isPublished`: boolean

### `Submission` (replaces `TaskSubmission`)
- `id`: string
- `assignmentId`: string
- `studentId`: string
- `content`: string | null
- `fileUrl`: string | null (Legacy DB map: `submissionLink`)
- `submittedAt`: string | null
- `score`: number | null
- `feedback`: string | null (Legacy DB map: `teacherNote`)
- `status`: enum (`draft`, `submitted`, `late`, `graded`, `returned`)

### `Quiz`
- `id`: string
- `courseId`: string
- `title`: string (Legacy DB map: `judul`)
- `description`: string
- `startsAt`: string | null
- `endsAt`: string | null
- `durationMinutes`: number
- `isPublished`: boolean

### `Grade`
- `id`: string
- `studentId`: string
- `courseId`: string
- `assignmentId`: string | null
- `quizId`: string | null
- `score`: number
- `maxScore`: number
- `feedback`: string | null

### `Attendance`
- `id`: string
- `studentId`: string
- `classId`: string
- `courseId`: string | null
- `date`: string
- `status`: enum (`present`, `absent`, `late`, `excused`)
- `note`: string | null

### `Announcement`
- `id`: string
- `title`: string
- `content`: string
- `targetRole`: enum (`all`, `student`, `teacher`, `admin`)
- `createdById`: string

### `Notification`
- `id`: string
- `userId`: string
- `title`: string
- `message`: string
- `isRead`: boolean

## Legacy Name Mapping Rule
If the backend database currently uses a legacy name (e.g., `nama_jurusan`, `nip`), the backend controllers/mappers **MUST** transform these keys into the canonical camelCase attributes defined above before sending the JSON response. The frontend must only consume canonical names.
