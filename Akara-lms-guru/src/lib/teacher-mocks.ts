import type { SubmissionStatus } from "@akara/shared/constants/enums";

export type StatusTone = "draft" | "published" | "scheduled" | SubmissionStatus;

export type ModuleSummary = {
  id: string;
  name: string;
  subject: string;
  grade: string;
  chapters: number;
  lessons: number;
  quizzes: number;
  tasks: number;
  completionRate: number;
  status: StatusTone;
};

export type ReviewRow = {
  id: string;
  student: string;
  className: string;
  module: string;
  task: string;
  submittedAt: string;
  status: SubmissionStatus;
  score: number;
};

export type ProgressRow = {
  id: string;
  student: string;
  className: string;
  module: string;
  activeBab: string;
  doneItems: string;
  latestQuiz: number;
  taskStatus: SubmissionStatus;
  risk: "rendah" | "sedang" | "tinggi";
  lastActivity: string;
};

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
    name: "Matematika Inti",
    subject: "Matematika",
    grade: "Kelas 8",
    chapters: 6,
    lessons: 18,
    quizzes: 6,
    tasks: 8,
    completionRate: 72,
    status: "published",
  },
  {
    id: "sains-8",
    name: "Sains Terapan",
    subject: "Sains",
    grade: "Kelas 8",
    chapters: 5,
    lessons: 16,
    quizzes: 5,
    tasks: 7,
    completionRate: 65,
    status: "published",
  },
  {
    id: "english-10",
    name: "English Literature",
    subject: "Bahasa Inggris",
    grade: "Kelas 10",
    chapters: 4,
    lessons: 12,
    quizzes: 4,
    tasks: 6,
    completionRate: 48,
    status: "draft",
  },
  {
    id: "history-9",
    name: "Sejarah Nusantara",
    subject: "Sejarah",
    grade: "Kelas 9",
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
    student: "Liam Johnson",
    className: "9A",
    module: "Sains Terapan",
    task: "Newton's Laws Assignment",
    submittedAt: "20m ago",
    status: "submitted",
    score: 82,
  },
  {
    id: "rv-2",
    student: "Ava Davis",
    className: "10B",
    module: "English Literature",
    task: "Shakespeare Essay",
    submittedAt: "1h ago",
    status: "returned",
    score: 74,
  },
  {
    id: "rv-3",
    student: "Noah Williams",
    className: "8C",
    module: "Matematika Inti",
    task: "Algebra Basics Quiz",
    submittedAt: "2h ago",
    status: "submitted",
    score: 88,
  },
  {
    id: "rv-4",
    student: "Mia Anderson",
    className: "8B",
    module: "Sains Terapan",
    task: "Cell Structure Worksheet",
    submittedAt: "3h ago",
    status: "late",
    score: 69,
  },
];

export const progressRows: ProgressRow[] = [
  {
    id: "st-1",
    student: "Sophia Martinez",
    className: "8A",
    module: "Matematika Inti",
    activeBab: "Bab 4 - Persamaan Linear",
    doneItems: "14/18",
    latestQuiz: 92,
    taskStatus: "graded",
    risk: "rendah",
    lastActivity: "15m ago",
  },
  {
    id: "st-2",
    student: "Liam Johnson",
    className: "9A",
    module: "Sains Terapan",
    activeBab: "Bab 3 - Gaya dan Gerak",
    doneItems: "10/16",
    latestQuiz: 78,
    taskStatus: "submitted",
    risk: "sedang",
    lastActivity: "35m ago",
  },
  {
    id: "st-3",
    student: "Ava Thompson",
    className: "8C",
    module: "Matematika Inti",
    activeBab: "Bab 2 - Operasi Pecahan",
    doneItems: "6/18",
    latestQuiz: 58,
    taskStatus: "returned",
    risk: "tinggi",
    lastActivity: "2h ago",
  },
  {
    id: "st-4",
    student: "Ethan Brown",
    className: "9B",
    module: "Sejarah Nusantara",
    activeBab: "Bab 1 - Kerajaan Awal",
    doneItems: "4/14",
    latestQuiz: 64,
    taskStatus: "late",
    risk: "tinggi",
    lastActivity: "5h ago",
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
