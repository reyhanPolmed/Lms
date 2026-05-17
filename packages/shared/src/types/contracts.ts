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
  attemptId: string;
  answers: Record<string, string>;
  fullscreenViolation: boolean;
}

export interface QuizAttemptSavePayload {
  attemptId: string;
  answers: Record<string, string>;
}

export interface TaskSubmitPayload {
  submissionLink?: string;
  submissionFile?: {
    fileName: string;
    mimeType: string;
    base64Data: string;
  };
}

export type TaskSubmitMethod = "link" | "file" | "file_link";

export interface TaskAttachmentView {
  fileName: string;
  mimeType: string;
  url: string;
}

export interface TaskSubmissionView {
  link?: string;
  file?: TaskAttachmentView;
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

export type StatusTone = "draft" | "published" | "scheduled" | SubmissionStatus;

export interface CourseSummaryView {
  id: string;
  title: string;
  department: string;
  gradeLevel?: string;
  teacherName?: string;
  chapters?: number;
  lessons?: number;
  materials?: number;
  quizzes?: number;
  tasks?: number;
  assignments?: number;
  completionRate?: number;
  status?: StatusTone;
  
  // UI-specific metadata
  totalItems?: number;
  nextItemTitle?: string;
  accent?: string;
  bannerLabel?: string;
}

export interface SubmissionReviewView {
  id: string;
  studentName: string;
  className: string;
  courseTitle: string;
  assignmentTitle: string;
  submittedAt: string;
  status: SubmissionStatus;
  score: number | null;
}

export interface StudentProgressView {
  id: string;
  studentName: string;
  className: string;
  courseTitle: string;
  activeChapter: string;
  completedItemsCount: string;
  latestQuizScore: number | null;
  taskStatus: SubmissionStatus;
  riskLevel: "rendah" | "sedang" | "tinggi" | "low" | "medium" | "high";
  lastActivityAt: string;
}

export interface DashboardMetricView {
  label: string;
  value: number | string;
  helper?: string;
  delta?: string;
  tone?: "gold" | "sky" | "mint" | "primary" | "danger" | "success";
}

export interface AgendaItemView {
  id: string;
  title: string;
  type: "quiz" | "assignment" | "task";
  dueAt: string;
  courseTitle: string;
  status: "due-soon" | "scheduled" | "revision" | "late";
  href: string;
}

export type SidebarItemType = "lesson" | "quiz" | "task" | "assignment" | "material";

export interface SidebarEntryView {
  id: string;
  title: string;
  type: SidebarItemType;
  href: string;
  isLocked: boolean;
  isCompleted: boolean;
  chapter: string;
}

export interface CourseSectionView {
  id: string;
  title: string;
  description: string;
  items: SidebarEntryView[];
}

export interface CourseDetailView extends CourseSummaryView {
  description: string;
  sections: CourseSectionView[];
}

export interface MaterialDetailView {
  id: string;
  courseId: string;
  title: string;
  contentType: "video" | "pdf" | "text" | "link";
  contentUrl: string | null;
  excerpt: string;
  content: string;
  durationTargetSeconds: number;
  trackedSeconds: number;
  isCompleted: boolean;
  sidebar: SidebarEntryView[];
  tips: string[];
}

export interface QuizQuestionView {
  id: string;
  prompt: string;
  options: {
    key: string;
    label: string;
  }[];
  correctOption?: string;
}

export interface QuizDetailView {
  id: string;
  courseId: string;
  title: string;
  intro: string;
  passScore: number;
  durationMinutes: number;
  serverNow: string;
  maxAttempts: number;
  attemptsUsed: number;
  attemptsRemaining: number;
  questionOrder: string[];
  questions: QuizQuestionView[];
  penaltyNote: string;
  sidebar: SidebarEntryView[];
  lastScore?: number;
  activeAttempt?: QuizAttemptView | null;
  latestSubmittedAttempt?: QuizAttemptView | null;
}

export interface QuizAttemptView {
  id: string;
  quizId: string;
  attemptNumber: number;
  status: "in_progress" | "submitted";
  questionOrder: string[];
  answers: Record<string, string>;
  startedAt: string;
  submittedAt: string | null;
  durationSeconds: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  isExpired: boolean;
  submissionTiming: "on_time" | "late" | null;
  score?: number;
  isPassed?: boolean;
  serverNow: string;
}

export interface AssignmentDetailView {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueAt: string;
  allowRevision: boolean;
  submitMethod?: TaskSubmitMethod;
  attachment?: TaskAttachmentView;
  currentSubmission?: TaskSubmissionView;
  sidebar: SidebarEntryView[];
  checklist: string[];
}
