# LMS Data Dictionary

## Canonical Naming Rules
- API/frontend attributes: `camelCase`
- Database physical columns: may remain `snake_case` via ORM mapping
- Canonical person name attribute: `fullName`
- Canonical task payload attribute: `submissionLink`

## Canonical Enums
- `UserRole`: `student | teacher | admin`
- `SubmissionStatus`: `draft | submitted | late | graded | returned`
- `AttendanceStatus`: `present | absent | late | excused`
- `TargetRole`: `all | student | teacher | admin`

## Canonical Entities

### User
- `id`
- `fullName`
- `email`
- `role`
- `avatarUrl`
- `isActive`
- `createdAt`
- `updatedAt`

### StudentProfile
- `id`
- `userId`
- `nisn`
- `classId`
- `createdAt`
- `updatedAt`

### TeacherProfile
- `id`
- `userId`
- `employeeId`
- `subjectSpecialization`
- `createdAt`
- `updatedAt`

### ClassRoom
- `id`
- `name`
- `gradeLevel`
- `academicYear`
- `homeroomTeacherId`
- `createdAt`
- `updatedAt`

### Course
- `id`
- `title`
- `description`
- `teacherId`
- `classId`
- `createdAt`
- `updatedAt`

### Material
- `id`
- `courseId`
- `title`
- `description`
- `fileUrl`
- `content`
- `isPublished`
- `createdAt`
- `updatedAt`

### Assignment
- `id`
- `courseId`
- `title`
- `description`
- `dueAt`
- `maxScore`
- `isPublished`
- `createdAt`
- `updatedAt`

### Submission
- `id`
- `assignmentId`
- `studentId`
- `content`
- `fileUrl`
- `submittedAt`
- `score`
- `feedback`
- `status`
- `createdAt`
- `updatedAt`

### Quiz
- `id`
- `courseId`
- `title`
- `description`
- `startsAt`
- `endsAt`
- `durationMinutes`
- `isPublished`
- `createdAt`
- `updatedAt`

### Grade
- `id`
- `studentId`
- `courseId`
- `assignmentId`
- `quizId`
- `score`
- `maxScore`
- `feedback`
- `createdAt`
- `updatedAt`

### Attendance
- `id`
- `studentId`
- `classId`
- `courseId`
- `date`
- `status`
- `note`
- `createdAt`
- `updatedAt`

### Announcement
- `id`
- `title`
- `content`
- `targetRole`
- `createdById`
- `createdAt`
- `updatedAt`
