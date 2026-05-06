import type { SubmissionStatus } from "../constants/enums.js";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileUpdatePayload {
  fullName: string;
  email: string;
  phone?: string;
  bio?: string;
}

export interface TrackDurationPayload {
  seconds: number;
}

export interface QuizSubmitPayload {
  answers: Record<string, string>;
  fullscreenViolation: boolean;
}

export interface TaskSubmitPayload {
  submissionLink: string;
}

export interface TaskSubmissionView {
  link: string;
  status: SubmissionStatus | "approved" | "revision";
  teacherNote?: string;
  submittedAt: string | null;
}

export interface StudentDashboardUserView {
  id: string;
  fullName: string;
  email: string;
  className: string;
  department: string;
  weeklyProgress: number;
}

export interface StudentProfileView extends StudentDashboardUserView {
  phone: string;
  bio: string;
  nisn: string | null;
}
