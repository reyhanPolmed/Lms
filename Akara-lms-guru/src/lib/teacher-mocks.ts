import type { SubmissionStatus } from "@akara/shared/constants/enums";
import type {
  CourseSummaryView,
  SubmissionReviewView,
  StudentProgressView,
  StatusTone
} from "@akara/shared/types/contracts";
import type { DashboardData } from "@/lib/api-client";

export type ModuleSummary = CourseSummaryView;
export type ReviewRow = SubmissionReviewView;
export type ProgressRow = StudentProgressView;

export const dashboardKpi = [
  { label: "Modul Aktif", value: "24", delta: "+12%" },
  { label: "Kelas Aktif", value: "8", delta: "+5%" },
  { label: "Draft Item", value: "15", delta: "-10%" },
  { label: "Need Review", value: "18", delta: "+18%" },
  { label: "Menunggu Revisi", value: "7", delta: "-3%" },
];

export const modules: ModuleSummary[] = [
  {
    id: "matematika-8",
    title: "Matematika Inti",
    department: "Matematika",
    gradeLevel: "Kelas 8",
    chapters: 6,
    lessons: 18,
    quizzes: 6,
    tasks: 8,
    completionRate: 72,
    status: "published",
  },
  {
    id: "sains-8",
    title: "Sains Terapan",
    department: "Sains",
    gradeLevel: "Kelas 8",
    chapters: 5,
    lessons: 16,
    quizzes: 5,
    tasks: 7,
    completionRate: 65,
    status: "published",
  },
  {
    id: "english-10",
    title: "English Literature",
    department: "Bahasa Inggris",
    gradeLevel: "Kelas 10",
    chapters: 4,
    lessons: 12,
    quizzes: 4,
    tasks: 6,
    completionRate: 48,
    status: "draft",
  },
  {
    id: "history-9",
    title: "Sejarah Nusantara",
    department: "Sejarah",
    gradeLevel: "Kelas 9",
    chapters: 6,
    lessons: 14,
    quizzes: 5,
    tasks: 5,
    completionRate: 30,
    status: "scheduled",
  },
];

export const reviews: ReviewRow[] = [
  {
    id: "rv-1",
    studentName: "Liam Johnson",
    className: "9A",
    courseTitle: "Sains Terapan",
    assignmentTitle: "Newton's Laws Assignment",
    submittedAt: "20m ago",
    status: "submitted",
    score: 82,
  },
  {
    id: "rv-2",
    studentName: "Ava Davis",
    className: "10B",
    courseTitle: "English Literature",
    assignmentTitle: "Shakespeare Essay",
    submittedAt: "1h ago",
    status: "returned",
    score: 74,
  },
  {
    id: "rv-3",
    studentName: "Noah Williams",
    className: "8C",
    courseTitle: "Matematika Inti",
    assignmentTitle: "Algebra Basics Quiz",
    submittedAt: "2h ago",
    status: "submitted",
    score: 88,
  },
  {
    id: "rv-4",
    studentName: "Mia Anderson",
    className: "8B",
    courseTitle: "Sains Terapan",
    assignmentTitle: "Cell Structure Worksheet",
    submittedAt: "3h ago",
    status: "late",
    score: 69,
  },
];

export const progressRows: ProgressRow[] = [
  {
    id: "st-1",
    studentName: "Sophia Martinez",
    className: "8A",
    courseTitle: "Matematika Inti",
    activeChapter: "Bab 4 - Persamaan Linear",
    completedItemsCount: "14/18",
    latestQuizScore: 92,
    taskStatus: "graded",
    riskLevel: "rendah",
    lastActivityAt: "15m ago",
  },
  {
    id: "st-2",
    studentName: "Liam Johnson",
    className: "9A",
    courseTitle: "Sains Terapan",
    activeChapter: "Bab 3 - Gaya dan Gerak",
    completedItemsCount: "10/16",
    latestQuizScore: 78,
    taskStatus: "submitted",
    riskLevel: "sedang",
    lastActivityAt: "35m ago",
  },
  {
    id: "st-3",
    studentName: "Ava Thompson",
    className: "8C",
    courseTitle: "Matematika Inti",
    activeChapter: "Bab 2 - Operasi Pecahan",
    completedItemsCount: "6/18",
    latestQuizScore: 58,
    taskStatus: "returned",
    riskLevel: "tinggi",
    lastActivityAt: "2h ago",
  },
  {
    id: "st-4",
    studentName: "Ethan Brown",
    className: "9B",
    courseTitle: "Sejarah Nusantara",
    activeChapter: "Bab 1 - Kerajaan Awal",
    completedItemsCount: "4/14",
    latestQuizScore: 64,
    taskStatus: "late",
    riskLevel: "tinggi",
    lastActivityAt: "5h ago",
  },
];

export const notifications = [
  {
    id: "ntf-1",
    title: "Submission baru dari Liam Johnson",
    description: "Newton's Laws Assignment - Kelas 9A",
    time: "8 menit lalu",
    action: "Review sekarang",
  },
  {
    id: "ntf-2",
    title: "Deadline tugas hari ini",
    description: "Cell Structure Worksheet akan berakhir pukul 23:59",
    time: "32 menit lalu",
    action: "Lihat modul",
  },
  {
    id: "ntf-3",
    title: "Kuis banyak tidak lulus",
    description: "Algebra Basics: 9 siswa di bawah passing grade",
    time: "1 jam lalu",
    action: "Buka progres",
  },
];

export const quizMonitoring = [
  { label: "Belum Mulai", value: 14 },
  { label: "Sedang Berjalan", value: 6 },
  { label: "Submit", value: 28 },
  { label: "Lulus", value: 22 },
  { label: "Tidak Lulus", value: 6 },
];

export const dashboardSnapshot: DashboardData = {
  teacher: {
    id: "teacher-demo",
    name: "Ninda Prameswari",
    nip: "19870612 201001 2 004",
    department: "Matematika",
  },
  kpi: {
    activeModules: 4,
    activeClasses: 8,
    draftItems: 15,
    needReview: 18,
    pendingRevision: 7,
  },
  modules: modules.map((module) => ({
    id: module.id,
    moduleId: module.id,
    title: module.title,
    department: module.department,
    gradeLevel: module.gradeLevel ?? "-",
    chapters: module.chapters ?? 0,
    lessons: module.lessons ?? 0,
    quizzes: module.quizzes ?? 0,
    tasks: module.tasks ?? 0,
    draftItems: Math.max(0, (module.tasks ?? 0) - 2),
    completionRate: module.completionRate ?? 0,
    status: module.status ?? "draft",
  })),
  recentSubmissions: reviews.map((review) => ({
    id: review.id,
    studentName: review.studentName,
    className: review.className,
    courseTitle: review.courseTitle,
    assignmentTitle: review.assignmentTitle,
    submittedAt: review.submittedAt,
    status: review.status,
    score: review.score,
  })),
};
