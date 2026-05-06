import type { AuthoredQuiz } from "@/lib/quiz-authoring";

export type MonitoringQuizRecord = {
  id: string;
  title: string;
  moduleName: string;
  passScore: number;
  durationMinutes: number;
  questionCount: number;
  status: "draft" | "published";
  deadline?: string;
  updatedAt: string;
};

export const defaultMonitoringQuizzes: MonitoringQuizRecord[] = [
  {
    id: "seed-1",
    title: "Kuis Bab 1: Dasar Konsep",
    moduleName: "Matematika Inti",
    passScore: 70,
    durationMinutes: 30,
    questionCount: 10,
    status: "published",
    deadline: "2026-05-10T20:00",
    updatedAt: "2026-05-01T09:00",
  },
  {
    id: "seed-2",
    title: "Kuis Bab 2: Studi Kasus",
    moduleName: "Sains Terapan",
    passScore: 75,
    durationMinutes: 45,
    questionCount: 12,
    status: "draft",
    updatedAt: "2026-05-02T13:30",
  },
];

export function mapAuthoredQuizToMonitoringRecord(item: AuthoredQuiz): MonitoringQuizRecord {
  return {
    id: item.id,
    title: item.title,
    moduleName: item.moduleName,
    passScore: item.passScore,
    durationMinutes: item.durationMinutes,
    questionCount: item.questions.length,
    status: item.status,
    deadline: item.deadline,
    updatedAt: item.updatedAt,
  };
}
