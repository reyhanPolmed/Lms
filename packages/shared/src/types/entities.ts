import type {
  AttendanceStatus,
  SubmissionStatus,
  TargetRole,
  UserRole
} from "../constants/enums.js";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  fullName: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
}

export interface StudentProfile extends BaseEntity {
  userId: string;
  nisn: string | null;
  classId: string | null;
}

export interface TeacherProfile extends BaseEntity {
  userId: string;
  employeeId: string | null;
  subjectSpecialization: string | null;
}

export interface AdminProfile extends BaseEntity {
  userId: string;
}

export interface ClassRoom extends BaseEntity {
  name: string;
  gradeLevel: string;
  academicYear: string;
  homeroomTeacherId: string | null;
}

export interface Course extends BaseEntity {
  title: string;
  description: string;
  teacherId: string | null;
  classId: string | null;
}

export interface Enrollment extends BaseEntity {
  studentId: string;
  classId: string;
}

export interface Material extends BaseEntity {
  courseId: string;
  title: string;
  description: string;
  fileUrl: string | null;
  content: string;
  isPublished: boolean;
}

export interface Assignment extends BaseEntity {
  courseId: string;
  title: string;
  description: string;
  dueAt: string;
  maxScore: number | null;
  isPublished: boolean;
}

export interface Submission extends BaseEntity {
  assignmentId: string;
  studentId: string;
  content: string | null;
  fileUrl: string | null;
  submittedAt: string | null;
  score: number | null;
  feedback: string | null;
  status: SubmissionStatus;
}

export interface Quiz extends BaseEntity {
  courseId: string;
  title: string;
  description: string;
  startsAt: string | null;
  endsAt: string | null;
  durationMinutes: number;
  isPublished: boolean;
}

export interface Grade extends BaseEntity {
  studentId: string;
  courseId: string;
  assignmentId: string | null;
  quizId: string | null;
  score: number;
  maxScore: number;
  feedback: string | null;
}

export interface Attendance extends BaseEntity {
  studentId: string;
  classId: string;
  courseId: string | null;
  date: string;
  status: AttendanceStatus;
  note: string | null;
}

export interface Announcement extends BaseEntity {
  title: string;
  content: string;
  targetRole: TargetRole;
  createdById: string;
}

export interface Notification extends BaseEntity {
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
}
