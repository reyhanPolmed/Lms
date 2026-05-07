import type {
  ChangePasswordPayload,
  LoginPayload,
  ProfileUpdatePayload,
  QuizSubmitPayload,
  StudentProfileView,
  TaskSubmissionView,
  TrackDurationPayload,
  DashboardMetricView,
  AgendaItemView,
  CourseSummaryView,
  SidebarItemType as SharedSidebarItemType,
  SidebarEntryView,
  CourseSectionView,
  CourseDetailView,
  MaterialDetailView,
  QuizQuestionView,
  QuizDetailView,
  QuizAttemptView,
  AssignmentDetailView,
} from "@akara/shared/types/contracts";

export type ContentType = "video" | "pdf" | "text" | "link";

export type UserProfile = StudentProfileView;

export type DashboardMetric = DashboardMetricView;
export type AgendaItem = AgendaItemView;
export type ModuleSummary = CourseSummaryView;

export type SidebarItemType = SharedSidebarItemType;
export type SidebarEntry = SidebarEntryView;
export type ModuleSection = CourseSectionView;
export type ModuleDetail = CourseDetailView;

export interface DashboardData {
  user: UserProfile;
  metrics: DashboardMetric[];
  modules: ModuleSummary[];
  upcomingQuizzes: AgendaItem[];
  upcomingTasks: AgendaItem[];
}

export type LessonDetail = MaterialDetailView;
export type QuizQuestion = QuizQuestionView;
export type QuizDetail = QuizDetailView;
export type QuizAttempt = QuizAttemptView;

export type CurrentSubmission = TaskSubmissionView;
export type TaskDetail = AssignmentDetailView;

export type ProfileDetail = StudentProfileView;
export type ProfilePayload = ProfileUpdatePayload;
export type PasswordPayload = ChangePasswordPayload;

export type { LoginPayload, QuizSubmitPayload, TrackDurationPayload };
