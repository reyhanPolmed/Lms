export type SidebarItemType = "lesson" | "quiz" | "task";
export type ContentType = "video" | "pdf" | "text" | "link";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  className: string;
  department: string;
  weeklyProgress: number;
}

export interface DashboardMetric {
  label: string;
  value: number;
  helper: string;
  tone: "gold" | "sky" | "mint";
}

export interface AgendaItem {
  id: string;
  title: string;
  type: "quiz" | "task";
  dueAt: string;
  moduleTitle: string;
  status: "due-soon" | "scheduled" | "revision";
  href: string;
}

export interface ModuleSummary {
  id: string;
  title: string;
  department: string;
  teacher: string;
  totalItems: number;
  completionPercent: number;
  nextItemTitle: string;
  accent: string;
  bannerLabel: string;
}

export interface SidebarEntry {
  id: string;
  title: string;
  type: SidebarItemType;
  href: string;
  isLocked: boolean;
  isCompleted: boolean;
  section: string;
}

export interface ModuleSection {
  id: string;
  title: string;
  description: string;
  items: SidebarEntry[];
}

export interface ModuleDetail extends ModuleSummary {
  description: string;
  sections: ModuleSection[];
}

export interface DashboardData {
  user: UserProfile;
  metrics: DashboardMetric[];
  modules: ModuleSummary[];
  upcomingQuizzes: AgendaItem[];
  upcomingTasks: AgendaItem[];
}

export interface LessonDetail {
  id: string;
  moduleId: string;
  title: string;
  contentType: ContentType;
  contentUrl: string;
  excerpt: string;
  body: string;
  durationTargetSeconds: number;
  trackedSeconds: number;
  isCompleted: boolean;
  sidebar: SidebarEntry[];
  tips: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: {
    key: string;
    label: string;
  }[];
  correctOption: string;
}

export interface QuizDetail {
  id: string;
  moduleId: string;
  title: string;
  intro: string;
  passScore: number;
  durationMinutes: number;
  questionOrder: string[];
  questions: QuizQuestion[];
  penaltyNote: string;
  sidebar: SidebarEntry[];
  lastScore?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  status: "in_progress" | "submitted";
  questionOrder: string[];
}

export interface CurrentSubmission {
  link: string;
  status: "submitted" | "revision" | "approved";
  teacherNote?: string;
  submittedAt: string | null;
}

export interface TaskDetail {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  deadline: string;
  allowRevision: boolean;
  currentSubmission?: CurrentSubmission;
  sidebar: SidebarEntry[];
  checklist: string[];
}

export interface ProfileDetail extends UserProfile {
  phone: string;
  bio: string;
  nisn: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TrackDurationPayload {
  seconds: number;
}

export interface QuizSubmitPayload {
  answers: Record<string, string>;
  fullscreenViolation: boolean;
}

export interface ProfilePayload {
  name: string;
  email: string;
  phone: string;
  bio: string;
}

export interface PasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
