export const USER_ROLES = ["student", "teacher", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SUBMISSION_STATUSES = ["draft", "submitted", "late", "graded", "returned"] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUSES)[number];

export const ATTENDANCE_STATUSES = ["present", "absent", "late", "excused"] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];

export const TARGET_ROLES = ["all", "student", "teacher", "admin"] as const;
export type TargetRole = (typeof TARGET_ROLES)[number];
