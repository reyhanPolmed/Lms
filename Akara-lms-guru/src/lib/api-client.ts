/**
 * Akara LMS — Teacher API Client
 * Semua call ke backend /api/teacher/* terpusat di sini.
 */

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

type FetchOptions = RequestInit & { params?: Record<string, string | undefined> };

function extractApiErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;

  const maybePayload = payload as {
    message?: string;
    errors?: {
      formErrors?: string[];
      fieldErrors?: Record<string, string[] | undefined>;
    };
  };

  const formError = maybePayload.errors?.formErrors?.find(Boolean);
  if (formError) return formError;

  const fieldError = Object.values(maybePayload.errors?.fieldErrors ?? {})
    .flat()
    .find(Boolean);
  if (fieldError) return fieldError;

  return maybePayload.message ?? null;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;

  let url = `${BASE}${path}`;
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as Record<string, string>
    );
    if (qs.toString()) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(extractApiErrorMessage(err) ?? `API error ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ────────────────────────────────────────────────────────────────────────────────
// Types — minimal shapes yang digunakan frontend
// ────────────────────────────────────────────────────────────────────────────────

export type KpiData = {
  activeModules: number;
  activeClasses: number;
  draftItems: number;
  needReview: number;
  pendingRevision: number;
};

export type TeacherProfile = {
  id: string;
  name: string;
  nip: string;
  department: string;
};

export type ModuleSummary = {
  id: string;
  moduleId?: string;
  title: string;
  department: string;
  gradeLevel: string;
  chapters: number;
  lessons: number;
  quizzes: number;
  tasks: number;
  draftItems?: number;
  completionRate: number;
  status: string;
};

export type RecentSubmission = {
  id: string;
  studentName: string;
  className: string;
  courseTitle: string;
  assignmentTitle: string;
  submittedAt: string | null;
  status: string;
  score: number | null;
};

export type DashboardData = {
  teacher: TeacherProfile;
  kpi: KpiData;
  modules: ModuleSummary[];
  recentSubmissions: RecentSubmission[];
};

export type QuizItem = {
  id: string;
  moduleId?: string;
  title: string;
  position: number;
  passScore: number;
  durationMinutes: number | null;
  isActive: boolean;
  availableAt: string | null;
  deadline: string | null;
  sectionId: string | null;
  moduleStudentClassId: string;
  questionCount: number;
  moduleName?: string;
  questions: {
    id: string;
    pertanyaan: string;
    opsiA: string;
    opsiB: string;
    opsiC: string;
    opsiD: string;
    opsiBenar: string;
    questionImage: string | null;
  }[];
};

export type TaskSubmissionSummary = {
  id: string;
  studentName: string;
  className: string;
  submittedAt: string | null;
  status: string;
  score: number | null;
  teacherFeedback: string;
  originalityCheck: OriginalityCheckSummary;
};

export type OriginalityCheckSummary = {
  status: "not_requested" | "queued" | "processing" | "completed" | "failed";
  providerStatus: string | null;
  maxSimilarity: number;
  similarityLevel: string | null;
  revision: number;
  checkedAt: string | null;
  lastSyncedAt: string | null;
  errorMessage: string | null;
};

export type RubricScore = {
  id: string;
  name: string;
  maxScore: number;
  score: number | null;
};

export type TaskSubmissionDetail = {
  id: string;
  studentName: string;
  className: string;
  courseTitle: string;
  assignmentTitle: string;
  submittedAt: string | null;
  status: string;
  score: number | null;
  submissionLink: string;
  submissionFile: {
    fileName: string;
    mimeType: string;
    url: string;
  } | null;
  teacherFeedback: string;
  teacherNote: string;
  originalityCheck: OriginalityCheckSummary;
  rubrics: RubricScore[];
};

export type IntegrityVisualDocument = {
  id: string | null;
  side: "A" | "B";
  fileName: string | null;
  annotatedPdfUrl: string | null;
  layoutMap: {
    kind: string | null;
    pages: {
      pageIndex: number;
      width: number;
      height: number;
      imageUrl: string | null;
      pdfWidth: number;
      pdfHeight: number;
    }[];
  } | null;
  highlights: {
    pageIndex: number;
    text: string | null;
    bboxNormalized: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    } | null;
  }[];
};

export type IntegrityVisualContext = {
  comparisonId: string;
  similarityScore: number;
  similarityLevel: string | null;
  matchedFingerprintCount: number;
  sourceDocument: IntegrityVisualDocument;
  comparisonDocument: IntegrityVisualDocument;
};

export type QuizSubmissionSummary = {
  id: string;
  attemptNumber: number;
  studentName: string;
  className: string;
  courseTitle: string;
  assignmentTitle: string;
  score: number | null;
  status: string;
  submittedAt: string | null;
};

export type QuizReviewQuestion = {
  id: string;
  type: "multiple-choice" | "essay";
  question: string;
  studentAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean | null;
  points: number;
  maxPoints: number;
  teacherNote: string;
};

export type QuizAttemptDetail = {
  id: string;
  attemptNumber: number;
  studentName: string;
  className: string;
  courseTitle: string;
  assignmentTitle: string;
  status: string;
  score: number | null;
  submittedAt: string | null;
  attemptHistory: {
    id: string;
    attemptNumber: number;
    score: number | null;
    status: string;
    submittedAt: string | null;
    isLatest: boolean;
  }[];
  questions: QuizReviewQuestion[];
};

export type ProgressRow = {
  id: string;
  studentName: string;
  className: string;
  courseTitle: string;
  activeChapter: string;
  completedItemsCount: string;
  latestQuizScore: number | null;
  taskStatus: string;
  riskLevel: "rendah" | "sedang" | "tinggi";
  lastActivityAt: string | null;
};

export type StudentProgressDetail = {
  student: {
    id: string;
    name: string;
    className: string;
  };
  module: {
    id: string;
    title: string;
  };
  timeline: {
    id: string;
    item: string;
    status: string;
    note: string;
    timestamp: string | null;
  }[];
  internalNote?: string;
};

export type ModuleDetail = {
  id: string;
  moduleId?: string;
  title: string;
  description: string;
  department: string;
  gradeLevel: string;
  isActive: boolean;
  sections: { id: string; title: string; order: number }[];
  lessons: {
    id: string;
    createdAt: string | null;
    title: string;
    contentType: string;
    body: string;
    contentUrl: string;
    position: number;
    status: string;
    availableAt: string | null;
    durationMinutes: number | null;
    sectionId: string | null;
  }[];
  quizzes: {
    id: string;
    createdAt: string | null;
    title: string;
    position: number;
    isActive: boolean;
    availableAt: string | null;
    deadline: string | null;
    passScore: number;
    durationMinutes: number | null;
    questionCount: number;
    sectionId: string | null;
  }[];
  tasks: {
    id: string;
    createdAt: string | null;
    title: string;
    description: string;
    availableAt: string | null;
    deadline: string;
    position: number;
    status: string;
    submitMethod: "link" | "file" | "file_link";
    isActive: boolean;
    allowRevision: boolean;
    submissionCount: number;
    sectionId: string | null;
    attachment: {
      fileName: string;
      mimeType: string;
      url: string;
    } | null;
  }[];
};

export type LessonDetail = {
  id: string;
  title: string;
  contentType: string;
  body: string;
  contentUrl: string;
  durationMinutes: number | null;
  position: number;
  status: string;
  availableAt: string | null;
  sectionId: string | null;
  moduleStudentClassId: string;
};

export type TaskDetail = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  availableAt: string | null;
  position?: number;
  status: string;
  isActive: boolean;
  allowRevision: boolean;
  submitMethod: "link" | "file" | "file_link";
  lessonId: string | null;
  sectionId: string | null;
  moduleStudentClassId: string;
  attachment: {
    fileName: string;
    mimeType: string;
    url: string;
  } | null;
  rubrics?: {
    id: string;
    name: string;
    maxScore: number;
    order: number;
  }[];
};

export function resolveApiUrl(path: string | null | undefined) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BASE}${path}`;
}

// ────────────────────────────────────────────────────────────────────────────────
// Dashboard
// ────────────────────────────────────────────────────────────────────────────────

export const teacherApi = {
  getDashboard: () => apiFetch<DashboardData>("/api/teacher/dashboard"),

  // ─── Modules ───────────────────────────────────────────────────────────────
  // ─── Modules & Sections ──────────────────────────────────────────────────
  getModules: () => apiFetch<ModuleSummary[]>("/api/teacher/modules"),
  getModuleDetail: (id: string) => apiFetch<ModuleDetail>(`/api/teacher/modules/${id}`),

  createSection: (data: { offeringId: string; judul: string; urutan?: number }) =>
    apiFetch<{ id: string; title: string; order: number }>("/api/teacher/sections", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateSection: (id: string, data: { judul?: string; urutan?: number }) =>
    apiFetch<{ id: string; title: string; order: number }>(`/api/teacher/sections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSection: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/teacher/sections/${id}`, {
      method: "DELETE",
    }),

  // ─── Lessons ─────────────────────────────────────────────────────────────
  getLesson: (id: string) => apiFetch<LessonDetail>(`/api/teacher/lessons/${id}`),

  createLesson: (data: {
    moduleStudentClassId: string;
    sectionId?: string;
    judul: string;
    tipeKonten: string;
    konten: string;
    urlKonten?: string;
    contentFile?: {
      fileName: string;
      mimeType: string;
      base64Data: string;
    };
    durasi?: number;
    tersediaPada?: string;
    status?: string;
  }) =>
    apiFetch<LessonDetail>("/api/teacher/lessons", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateLesson: (
    id: string,
      data: Partial<LessonDetail> & {
        title?: string;
        contentType?: string;
        body?: string;
        contentUrl?: string;
        contentFile?: {
          fileName: string;
          mimeType: string;
          base64Data: string;
        };
        durationMinutes?: number | null;
        availableAt?: string | null;
      }
  ) =>
    apiFetch<LessonDetail>(`/api/teacher/lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...(data.title !== undefined && { judul: data.title }),
        ...(data.contentType !== undefined && { tipeKonten: data.contentType }),
        ...(data.body !== undefined && { konten: data.body }),
        ...(data.contentUrl !== undefined && { urlKonten: data.contentUrl }),
        ...(data.contentFile !== undefined && { contentFile: data.contentFile }),
        ...(data.durationMinutes !== undefined && { durasi: data.durationMinutes ?? undefined }),
        ...(data.availableAt !== undefined && { tersediaPada: data.availableAt ?? undefined }),
        ...(data.position !== undefined && { posisi: data.position }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.sectionId !== undefined && { sectionId: data.sectionId ?? "" }),
      }),
    }),

  deleteLesson: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/teacher/lessons/${id}`, {
      method: "DELETE",
    }),

  // ─── Quizzes ───────────────────────────────────────────────────────────────
  getQuizzes: (offeringId?: string, scope: "assigned" | "all" = "assigned") =>
    apiFetch<QuizItem[]>("/api/teacher/quizzes", {
      params: { offeringId, scope },
    }),

  getQuizBanks: (moduleId?: string) =>
    apiFetch<QuizItem[]>("/api/teacher/quiz-banks", {
      params: { moduleId },
    }),

  getQuiz: (id: string) => apiFetch<QuizItem>(`/api/teacher/quizzes/${id}`),

  createQuiz: (data: {
    moduleStudentClassId: string;
    judul: string;
    skorLulus?: number;
    durasiMenit?: number;
    isAktif?: boolean;
    questions: {
      pertanyaan: string;
      opsiA: string;
      opsiB: string;
      opsiC: string;
      opsiD: string;
      opsiBenar: "A" | "B" | "C" | "D";
    }[];
  }) =>
    apiFetch<QuizItem>("/api/teacher/quizzes", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  createQuizBank: (data: {
    moduleId: string;
    judul: string;
    skorLulus?: number;
    durasiMenit?: number;
    isAktif?: boolean;
    questions: {
      pertanyaan: string;
      opsiA: string;
      opsiB: string;
      opsiC: string;
      opsiD: string;
      opsiBenar: "A" | "B" | "C" | "D";
    }[];
  }) =>
    apiFetch<QuizItem>("/api/teacher/quiz-banks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateQuiz: (
    id: string,
    data: Partial<{
      judul: string;
      skorLulus: number;
      durasiMenit: number;
      isAktif: boolean;
      sectionId: string;
      availableAt: string;
      deadline: string;
      questions: {
        pertanyaan: string;
        opsiA: string;
        opsiB: string;
        opsiC: string;
        opsiD: string;
        opsiBenar: "A" | "B" | "C" | "D";
      }[];
    }>
  ) =>
    apiFetch<QuizItem>(`/api/teacher/quizzes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  updateQuizStatus: (id: string, isAktif: boolean) =>
    apiFetch<QuizItem>(`/api/teacher/quizzes/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isAktif }),
    }),

  instantiateQuizFromBank: (data: {
    sourceQuizId: string;
    moduleStudentClassId: string;
    sectionId?: string;
    availableAt?: string;
    deadline?: string;
    isAktif?: boolean;
  }) =>
    apiFetch<QuizItem>("/api/teacher/quizzes/from-bank", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteQuiz: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/teacher/quizzes/${id}`, {
      method: "DELETE",
    }),

  // ─── Tasks ───────────────────────────────────────────────────────────────
  getTask: (id: string) => apiFetch<TaskDetail>(`/api/teacher/tasks/${id}`),

  createTask: (data: {
    moduleStudentClassId: string;
    lessonId?: string;
    sectionId?: string;
    judul: string;
    deskripsi: string;
    deadline: string;
    availableAt?: string;
    isAktif?: boolean;
    status?: string;
    allowRevision?: boolean;
    submitMethod?: "link" | "file" | "file_link";
    attachment?: {
      fileName: string;
      mimeType: string;
      base64Data: string;
    };
  }) =>
    apiFetch<TaskDetail>("/api/teacher/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateTask: (
    id: string,
    data: Partial<{
      judul: string;
      deskripsi: string;
      deadline: string;
      availableAt: string;
      isAktif: boolean;
      status: string;
      allowRevision: boolean;
      submitMethod: "link" | "file" | "file_link";
      lessonId: string;
      sectionId: string;
      attachment: {
        fileName: string;
        mimeType: string;
        base64Data: string;
      };
    }>
  ) =>
    apiFetch<TaskDetail>(`/api/teacher/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteTask: (id: string) =>
    apiFetch<{ success: boolean }>(`/api/teacher/tasks/${id}`, {
      method: "DELETE",
    }),

  // ─── Task Reviews ──────────────────────────────────────────────────────────
  getTaskSubmissions: async (taskId: string, filters?: { classId?: string; status?: string }) => {
    return apiFetch<TaskSubmissionSummary[]>(`/api/teacher/tasks/${taskId}/submissions`, {
      params: filters,
    });
  },

  getTaskSubmissionDetail: (submissionId: string) =>
    apiFetch<TaskSubmissionDetail>(`/api/teacher/task-submissions/${submissionId}`),

  gradeTaskSubmission: (
    submissionId: string,
    data: {
      score?: number;
      rubricScores?: { rubricId: string; score: number }[];
      teacherFeedback?: string;
      action: "draft" | "revision" | "publish";
    }
  ) =>
    apiFetch<TaskSubmissionDetail>(`/api/teacher/task-submissions/${submissionId}/grade`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getTaskSubmissionIntegritySummary: (submissionId: string) =>
    apiFetch<OriginalityCheckSummary>(
      `/api/teacher/task-submissions/${submissionId}/integrity-summary`
    ),

  getTaskSubmissionIntegrityPairs: (submissionId: string) =>
    apiFetch<unknown>(`/api/teacher/task-submissions/${submissionId}/integrity-pairs`),

  getTaskSubmissionIntegrityPairDetail: (submissionId: string, comparisonId: string) =>
    apiFetch<unknown>(
      `/api/teacher/task-submissions/${submissionId}/integrity-pairs/${encodeURIComponent(comparisonId)}`
    ),

  getTaskSubmissionIntegrityPairVisual: (submissionId: string, comparisonId: string) =>
    apiFetch<IntegrityVisualContext>(
      `/api/teacher/task-submissions/${submissionId}/integrity-pairs/${encodeURIComponent(comparisonId)}/visual`
    ),

  retryTaskSubmissionIntegrity: (submissionId: string) =>
    apiFetch<OriginalityCheckSummary>(`/api/teacher/task-submissions/${submissionId}/integrity-retry`, {
      method: "POST",
    }),

  // ─── Quiz Reviews ──────────────────────────────────────────────────────────
  getQuizSubmissions: (quizId: string, filters?: { status?: string; scope?: "latest" | "all" }) =>
    apiFetch<QuizSubmissionSummary[]>(`/api/teacher/quizzes/${quizId}/submissions`, {
      params: filters,
    }),

  getQuizAttemptDetail: (attemptId: string) =>
    apiFetch<QuizAttemptDetail>(`/api/teacher/quiz-attempts/${attemptId}`),

  gradeQuizAttempt: (attemptId: string, action: "draft" | "publish" | "retake") =>
    apiFetch<QuizAttemptDetail>(`/api/teacher/quiz-attempts/${attemptId}/grade`, {
      method: "PUT",
      body: JSON.stringify({ action }),
    }),

  // ─── Progress ──────────────────────────────────────────────────────────────
  getStudentProgress: (filters?: {
    moduleStudentClassId?: string;
    riskLevel?: string;
  }) =>
    apiFetch<ProgressRow[]>("/api/teacher/progress", { params: filters }),

  getStudentProgressDetail: (offeringId: string, studentId: string) =>
    apiFetch<StudentProgressDetail>(`/api/teacher/progress/${offeringId}/${studentId}`),
};
