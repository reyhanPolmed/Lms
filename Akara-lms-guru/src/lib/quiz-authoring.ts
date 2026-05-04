export type QuizAuthoringStatus = "draft" | "published";

export type AuthoredQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
};

export type AuthoredQuiz = {
  id: string;
  title: string;
  moduleName: string;
  className: string;
  passScore: number;
  durationMinutes: number;
  deadline?: string;
  penaltyNote?: string;
  status: QuizAuthoringStatus;
  createdAt: string;
  updatedAt: string;
  questions: AuthoredQuizQuestion[];
};

const STORAGE_KEY = "akara_teacher_authored_quizzes_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getAuthoredQuizzes(): AuthoredQuiz[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as AuthoredQuiz[];
    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
}

function saveAuthoredQuizzes(quizzes: AuthoredQuiz[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}

export function upsertAuthoredQuiz(quiz: AuthoredQuiz) {
  if (!canUseStorage()) return;

  const current = getAuthoredQuizzes();
  const index = current.findIndex((item) => item.id === quiz.id);

  if (index === -1) {
    current.unshift(quiz);
  } else {
    current[index] = quiz;
  }

  saveAuthoredQuizzes(current);
}

export function deleteAuthoredQuiz(quizId: string) {
  if (!canUseStorage()) return;
  const current = getAuthoredQuizzes();
  saveAuthoredQuizzes(current.filter((item) => item.id !== quizId));
}
