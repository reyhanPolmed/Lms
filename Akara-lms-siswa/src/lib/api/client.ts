import { ensureCsrfCookie, http } from "@/lib/api/http";
import {
  initialItemCompletionState,
  initialLessonProgressState,
  initialQuizScoreState,
  initialTaskSubmissionState,
  mockModuleBlueprints,
  mockProfile,
  MockModuleBlueprint,
  MockModuleItemSeed
} from "@/lib/mocks/data";
import {
  AgendaItem,
  CurrentSubmission,
  DashboardData,
  LessonDetail,
  LoginPayload,
  ModuleDetail,
  ModuleSummary,
  PasswordPayload,
  ProfileDetail,
  ProfilePayload,
  QuizAttempt,
  QuizAttemptSavePayload,
  QuizDetail,
  QuizSubmitPayload,
  SidebarEntry,
  TaskDetail,
  TrackDurationPayload
} from "@/lib/types";
import {
  buildModuleItemRoutes,
  normalizeModuleDetailRoutes,
  normalizeSidebarRoutes
} from "@/lib/learning-routes";

// When NEXT_PUBLIC_USE_MOCK_API is not explicitly "false", use mock data
const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

type ItemLookupEntry = {
  module: MockModuleBlueprint;
  item: MockModuleItemSeed;
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string;
};

const moduleById = Object.fromEntries(mockModuleBlueprints.map((module) => [module.id, module]));
const itemLookup = mockModuleBlueprints.reduce<Record<string, ItemLookupEntry>>((acc, module) => {
  module.sections.forEach((section) => {
    section.items.forEach((item) => {
      acc[item.id] = {
        module,
        item,
        sectionId: section.id,
        sectionTitle: section.title,
        sectionDescription: section.description
      };
    });
  });

  return acc;
}, {});

let profileState = clone(mockProfile);
let itemCompletionState = clone(initialItemCompletionState);
let lessonProgressState = clone(initialLessonProgressState);
let quizScoreState = clone(initialQuizScoreState);
let taskSubmissionState = clone(initialTaskSubmissionState);
let quizAttemptState: Record<string, QuizAttempt[]> = {};

function sleep(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function flattenModuleItems(module: MockModuleBlueprint) {
  return module.sections.flatMap((section) => section.items);
}

function getModuleOrThrow(id: string) {
  const found = moduleById[id];
  if (!found) {
    throw new Error("Modul tidak ditemukan");
  }
  return found;
}

function getItemOrThrow<T extends MockModuleItemSeed["type"]>(
  id: string,
  type: T
): Extract<MockModuleItemSeed, { type: T }> & { moduleId: string } {
  const found = itemLookup[id];
  if (!found || found.item.type !== type) {
    throw new Error(
      type === "lesson"
        ? "Lesson tidak ditemukan"
        : type === "quiz"
          ? "Quiz tidak ditemukan"
          : "Tugas tidak ditemukan"
    );
  }

  return {
    ...(found.item as Extract<MockModuleItemSeed, { type: T }>),
    moduleId: found.module.id
  };
}

function buildSidebar(moduleId: string): SidebarEntry[] {
  const moduleData = getModuleOrThrow(moduleId);
  const items = flattenModuleItems(moduleData);
  const routeEntries = buildModuleItemRoutes(moduleId, items);

  return items.map((item, index) => {
    const isCompleted = Boolean(itemCompletionState[item.id]);
    const hasIncompleteBefore = items.slice(0, index).some((previous) => !itemCompletionState[previous.id]);
    const routeEntry = routeEntries[index];

    return {
      id: item.id,
      title: item.title,
      type: item.type,
      href: routeEntry.href,
      isCompleted,
      isLocked: isCompleted ? false : hasIncompleteBefore,
      chapter: item.bab
    };
  });
}

function buildModuleSummary(module: MockModuleBlueprint): ModuleSummary {
  const sidebar = buildSidebar(module.id);
  const completedCount = sidebar.filter((item) => item.isCompleted).length;
  const totalItems = sidebar.length;
  const completionPercent = totalItems === 0 ? 0 : Math.round((completedCount / totalItems) * 100);
  const nextItemTitle = sidebar.find((item) => !item.isCompleted)?.title ?? "Complete";
  const lessonCount = sidebar.filter((item) => item.type === "lesson").length;
  const quizCount = sidebar.filter((item) => item.type === "quiz").length;
  const taskCount = sidebar.filter((item) => item.type === "task").length;

  return {
    id: module.id,
    title: module.title,
    department: module.department,
    teacherName: module.teacher,
    totalItems,
    completionRate: completionPercent,
    nextItemTitle,
    accent: module.accent,
    bannerLabel: `${lessonCount} lesson • ${quizCount} quiz • ${taskCount} task`
  };
}

function buildModuleDetail(moduleId: string): ModuleDetail {
  const moduleData = getModuleOrThrow(moduleId);
  const sidebar = buildSidebar(moduleId);

  return normalizeModuleDetailRoutes({
    ...buildModuleSummary(moduleData),
    description: moduleData.description,
    sections: moduleData.sections.map((section) => ({
      id: section.id,
      title: section.title,
      description: section.description,
      items: section.items.map((item) => {
        const sidebarItem = sidebar.find((entry) => entry.id === item.id);
        if (!sidebarItem) {
          throw new Error("Item modul tidak ditemukan");
        }
        return sidebarItem;
      })
    }))
  });
}

function buildLessonDetail(id: string): LessonDetail {
  const entry = itemLookup[id];
  if (!entry || entry.item.type !== "lesson" || !entry.item.lesson) {
    throw new Error("Lesson tidak ditemukan");
  }

  const lesson = entry.item.lesson;
  const isCompleted = Boolean(itemCompletionState[id]);
  const trackedSeconds = lessonProgressState[id] ?? 0;

  return {
    id,
    courseId: entry.module.id,
    title: entry.item.title,
    contentType: lesson.contentType,
    contentUrl: lesson.contentUrl,
    excerpt: lesson.excerpt,
    content: lesson.content,
    durationTargetSeconds: lesson.durationTargetSeconds,
    trackedSeconds: isCompleted
      ? Math.max(trackedSeconds, lesson.durationTargetSeconds)
      : trackedSeconds,
    isCompleted,
    sidebar: normalizeSidebarRoutes(entry.module.id, buildSidebar(entry.module.id)),
    tips: lesson.tips
  };
}

function buildQuizDetail(id: string): QuizDetail {
  const entry = itemLookup[id];
  if (!entry || entry.item.type !== "quiz" || !entry.item.quiz) {
    throw new Error("Quiz tidak ditemukan");
  }

  const quiz = entry.item.quiz;
  const attempts = [...(quizAttemptState[id] ?? [])].sort((left, right) =>
    new Date(right.startedAt).getTime() - new Date(left.startedAt).getTime()
  );
  const activeAttempt = attempts.find((attempt) => attempt.status === "in_progress") ?? null;
  const latestSubmittedAttempt = attempts.find((attempt) => attempt.status === "submitted") ?? null;
  const attemptsUsed = attempts.length;
  const attemptsRemaining = Math.max(0, 2 - attemptsUsed);

  return {
    id,
    courseId: entry.module.id,
    title: entry.item.title,
    intro: quiz.intro,
    passScore: quiz.passScore,
    durationMinutes: quiz.durationMinutes,
    serverNow: new Date().toISOString(),
    maxAttempts: 2,
    attemptsUsed,
    attemptsRemaining,
    questionOrder: quiz.questions.map((question) => question.id),
    questions: quiz.questions,
    penaltyNote: quiz.penaltyNote,
    sidebar: normalizeSidebarRoutes(entry.module.id, buildSidebar(entry.module.id)),
    lastScore: latestSubmittedAttempt?.score ?? quizScoreState[id],
    activeAttempt,
    latestSubmittedAttempt
  };
}

function buildMockQuizAttempt(id: string, attemptNumber: number): QuizAttempt {
  const quiz = buildQuizDetailWithoutAttempts(id);
  const questionOrder = quiz.questionOrder;

  return {
    id: `attempt-${id}-${attemptNumber}`,
    quizId: id,
    attemptNumber,
    status: "in_progress",
    questionOrder,
    answers: {},
    startedAt: new Date().toISOString(),
    submittedAt: null,
    durationSeconds: quiz.durationMinutes * 60,
    elapsedSeconds: 0,
    remainingSeconds: quiz.durationMinutes * 60,
    isExpired: false,
    submissionTiming: null,
    serverNow: new Date().toISOString()
  };
}

function buildQuizDetailWithoutAttempts(id: string) {
  const entry = itemLookup[id];
  if (!entry || entry.item.type !== "quiz" || !entry.item.quiz) {
    throw new Error("Quiz tidak ditemukan");
  }

  const quiz = entry.item.quiz;

  return {
    id,
    courseId: entry.module.id,
    title: entry.item.title,
    intro: quiz.intro,
    passScore: quiz.passScore,
    durationMinutes: quiz.durationMinutes,
    questionOrder: quiz.questions.map((question) => question.id),
    questions: quiz.questions,
    penaltyNote: quiz.penaltyNote,
    sidebar: normalizeSidebarRoutes(entry.module.id, buildSidebar(entry.module.id))
  };
}

function buildTaskDetail(id: string): TaskDetail {
  const entry = itemLookup[id];
  if (!entry || entry.item.type !== "task" || !entry.item.task) {
    throw new Error("Tugas tidak ditemukan");
  }

  const task = entry.item.task;

  return {
    id,
    courseId: entry.module.id,
    title: entry.item.title,
    description: task.description,
    dueAt: task.dueAt,
    allowRevision: task.allowRevision,
    submitMethod: task.submitMethod ?? "link",
    attachment: task.attachment,
    currentSubmission: taskSubmissionState[id],
    sidebar: normalizeSidebarRoutes(entry.module.id, buildSidebar(entry.module.id)),
    checklist: task.checklist
  };
}

function markModuleItemComplete(moduleId: string, itemId: string) {
  itemCompletionState[itemId] = true;

  const moduleData = getModuleOrThrow(moduleId);
  const moduleItems = flattenModuleItems(moduleData);
  const completedCount = moduleItems.filter((item) => itemCompletionState[item.id]).length;

  profileState = {
    ...profileState,
    weeklyProgress: Math.round(
      mockModuleBlueprints.reduce((sum, currentModule) => {
        const items = flattenModuleItems(currentModule);
        const done = items.filter((item) => itemCompletionState[item.id]).length;
        return sum + Math.round((done / items.length) * 100);
      }, 0) / mockModuleBlueprints.length
    )
  };

  if (completedCount === moduleItems.length) {
    const finalItem = moduleItems[moduleItems.length - 1];
    if (finalItem?.type === "lesson") {
      const lesson = itemLookup[finalItem.id]?.item.lesson;
      if (lesson) {
        lessonProgressState[finalItem.id] = lesson.durationTargetSeconds;
      }
    }
  }
}

function buildDashboardData(): DashboardData {
  const modules = mockModuleBlueprints.map((module) => buildModuleSummary(module));

  const upcomingQuizzes = mockModuleBlueprints
    .flatMap((module) =>
      flattenModuleItems(module)
        .filter((item) => item.type === "quiz" && item.quiz)
        .map((item) => {
          const sidebarItem = buildSidebar(module.id).find((entry) => entry.id === item.id);
          if (!sidebarItem || sidebarItem.isCompleted || sidebarItem.isLocked || !item.quiz) {
            return null;
          }

          return {
            id: item.id,
            title: item.title,
            type: "quiz" as const,
            dueAt: item.quiz.dueAt,
            courseTitle: module.title,
            status: "scheduled" as const,
            href:
              buildModuleItemRoutes(module.id, flattenModuleItems(module)).find(
                (entry) => entry.id === item.id
              )?.href ?? `/modules/${module.id}`
          };
        })
    )
    .filter(Boolean) as AgendaItem[];
  const trimmedUpcomingQuizzes = upcomingQuizzes.slice(0, 3);

  const upcomingTasks = mockModuleBlueprints
    .flatMap((module) =>
      flattenModuleItems(module)
        .filter((item) => item.type === "task" && item.task)
        .map((item) => {
          const sidebarItem = buildSidebar(module.id).find((entry) => entry.id === item.id);
          if (!sidebarItem || sidebarItem.isCompleted || sidebarItem.isLocked || !item.task) {
            return null;
          }

          return {
            id: item.id,
            title: item.title,
            type: "task" as const,
            dueAt: item.task.dueAt,
            courseTitle: module.title,
            status: "due-soon" as const,
            href:
              buildModuleItemRoutes(module.id, flattenModuleItems(module)).find(
                (entry) => entry.id === item.id
              )?.href ?? `/modules/${module.id}`
          };
        })
    )
    .filter(Boolean) as AgendaItem[];
  const trimmedUpcomingTasks = upcomingTasks.slice(0, 3);

  const revisionCount = Object.values(taskSubmissionState).filter(
    (submission) => submission?.status === "revision"
  ).length;

  return {
    user: clone(profileState),
    metrics: [
      {
        label: "Modul aktif",
        value: modules.length,
        helper: "Gabungan mata pelajaran dan praktik lintas jurusan yang sedang diikuti.",
        tone: "gold"
      },
      {
        label: "Progress mingguan",
        value: profileState.weeklyProgress,
        helper: "Rata-rata progres aktif dari semua modul yang sedang berjalan.",
        tone: "sky"
      },
      {
        label: "Perlu revisi",
        value: revisionCount,
        helper: "Task yang masih membutuhkan revisi atau tindak lanjut.",
        tone: "mint"
      }
    ],
    modules,
    upcomingQuizzes: trimmedUpcomingQuizzes,
    upcomingTasks: trimmedUpcomingTasks
  };
}

function unwrapApiData<T>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    const envelope = payload as { data: T; success?: unknown; message?: unknown };
    if ("success" in envelope || "message" in envelope) {
      return envelope.data;
    }
  }

  return payload as T;
}

export const lmsClient = {
  async login(payload: LoginPayload) {
    if (useMockApi) {
      await sleep();
      if (!payload.email.includes("@")) {
        throw new Error("Email tidak valid");
      }
      if (!payload.password.trim()) {
        throw new Error("Password wajib diisi");
      }
      return clone(profileState);
    }

    await ensureCsrfCookie();
    const response = await http.post("/login", payload);
    return unwrapApiData<ProfileDetail>(response.data);
  },

  async logout() {
    if (useMockApi) {
      await sleep();
      return { success: true };
    }

    await ensureCsrfCookie();
    const response = await http.post("/logout");
    return unwrapApiData<{ success: boolean }>(response.data);
  },

  async getDashboard() {
    if (useMockApi) {
      await sleep();
      return buildDashboardData();
    }

    const response = await http.get("/api/dashboard");
    return unwrapApiData<DashboardData>(response.data);
  },

  async getModules() {
    if (useMockApi) {
      await sleep();
      return mockModuleBlueprints.map((module) => buildModuleSummary(module));
    }

    const response = await http.get("/api/modules");
    return unwrapApiData<ModuleSummary[]>(response.data);
  },

  async getModuleById(id: string) {
    if (useMockApi) {
      await sleep();
      return buildModuleDetail(id);
    }

    const response = await http.get(`/api/modules/${id}`);
    return normalizeModuleDetailRoutes(unwrapApiData<ModuleDetail>(response.data));
  },

  async getLessonById(id: string) {
    if (useMockApi) {
      await sleep();
      return buildLessonDetail(id);
    }

    const response = await http.get(`/api/lessons/${id}`);
    const data = unwrapApiData<LessonDetail>(response.data);
    return {
      ...data,
      sidebar: normalizeSidebarRoutes(data.courseId, data.sidebar)
    };
  },

  async trackLessonDuration(id: string, payload: TrackDurationPayload) {
    if (useMockApi) {
      await sleep();
      const lesson = buildLessonDetail(id);
      lessonProgressState[id] = Math.min(
        lesson.durationTargetSeconds,
        (lessonProgressState[id] ?? 0) + payload.seconds
      );
      return buildLessonDetail(id);
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/lessons/${id}/duration`, payload);
    return unwrapApiData<LessonDetail>(response.data);
  },

  async completeLesson(id: string) {
    if (useMockApi) {
      await sleep();
      const lesson = buildLessonDetail(id);
      lessonProgressState[id] = lesson.durationTargetSeconds;
      markModuleItemComplete(lesson.courseId, id);
      return buildLessonDetail(id);
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/lessons/${id}/complete`);
    return unwrapApiData<LessonDetail>(response.data);
  },

  async getQuizById(id: string) {
    if (useMockApi) {
      await sleep();
      return buildQuizDetail(id);
    }

    const response = await http.get(`/api/quizzes/${id}`);
    const data = unwrapApiData<QuizDetail>(response.data);
    return {
      ...data,
      sidebar: normalizeSidebarRoutes(data.courseId, data.sidebar)
    };
  },

  async startQuiz(id: string) {
    if (useMockApi) {
      await sleep();
      const attempts = [...(quizAttemptState[id] ?? [])].sort(
        (left, right) => new Date(left.startedAt).getTime() - new Date(right.startedAt).getTime()
      );
      const activeAttempt = attempts.find((attempt) => attempt.status === "in_progress");
      if (activeAttempt) {
        return activeAttempt;
      }

      if (attempts.length >= 2) {
        throw new Error("Batas maksimal attempt quiz adalah 2 kali");
      }

      const nextAttempt = buildMockQuizAttempt(id, attempts.length + 1);
      quizAttemptState[id] = [...attempts, nextAttempt];
      return nextAttempt;
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/quizzes/${id}/start`);
    return unwrapApiData<QuizAttempt>(response.data);
  },

  async saveQuizAttempt(id: string, payload: QuizAttemptSavePayload) {
    if (useMockApi) {
      await sleep();
      const attempts = quizAttemptState[id] ?? [];
      const targetAttempt = attempts.find((attempt) => attempt.id === payload.attemptId);

      if (!targetAttempt) {
        throw new Error("Attempt quiz tidak ditemukan");
      }

      if (targetAttempt.status === "submitted") {
        return targetAttempt;
      }

      const updatedAttempt = {
        ...targetAttempt,
        answers: payload.answers,
        serverNow: new Date().toISOString()
      } satisfies QuizAttempt;

      quizAttemptState[id] = attempts.map((attempt) =>
        attempt.id === targetAttempt.id ? updatedAttempt : attempt
      );

      return updatedAttempt;
    }

    await ensureCsrfCookie();
    const response = await http.put(`/api/quizzes/${id}/attempt`, payload);
    return unwrapApiData<QuizAttempt>(response.data);
  },

  async submitQuiz(id: string, payload: QuizSubmitPayload) {
    if (useMockApi) {
      await sleep();
      const quiz = buildQuizDetailWithoutAttempts(id);
      const attempts = quizAttemptState[id] ?? [];
      const targetAttempt = attempts.find((attempt) => attempt.id === payload.attemptId);

      if (!targetAttempt) {
        throw new Error("Attempt quiz tidak ditemukan");
      }

      if (targetAttempt.status === "submitted") {
        return targetAttempt;
      }

      const correctAnswers = quiz.questions.reduce((count, question) => {
        return count + (payload.answers[question.id] === question.correctOption ? 1 : 0);
      }, 0);

      const baseScore = Math.round((correctAnswers / quiz.questions.length) * 100);
      const score = payload.fullscreenViolation ? Math.max(0, baseScore - 15) : baseScore;
      const isPassed = score >= quiz.passScore;

      quizScoreState[id] = score;

      if (isPassed) {
        markModuleItemComplete(quiz.courseId, id);
      }

      const submittedAt = new Date().toISOString();
      const updatedAttempt = {
        ...targetAttempt,
        status: "submitted",
        answers: payload.answers,
        submittedAt,
        elapsedSeconds: Math.max(
          0,
          Math.floor((Date.now() - new Date(targetAttempt.startedAt).getTime()) / 1000)
        ),
        remainingSeconds: 0,
        score,
        isPassed,
        isExpired: false,
        submissionTiming: "on_time",
        serverNow: submittedAt
      } satisfies QuizAttempt;

      quizAttemptState[id] = attempts.map((attempt) =>
        attempt.id === targetAttempt.id ? updatedAttempt : attempt
      );

      return updatedAttempt;
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/quizzes/${id}/submit`, payload);
    return unwrapApiData<QuizAttempt>(response.data);
  },

  async getTaskById(id: string) {
    if (useMockApi) {
      await sleep();
      return buildTaskDetail(id);
    }

    const response = await http.get(`/api/tasks/${id}`);
    const data = unwrapApiData<TaskDetail>(response.data);
    return {
      ...data,
      sidebar: normalizeSidebarRoutes(data.courseId, data.sidebar)
    };
  },

  async submitTask(
    id: string,
    payload: {
      submissionLink?: string;
      submissionFile?: {
        fileName: string;
        mimeType: string;
        base64Data: string;
      };
    }
  ) {
    if (useMockApi) {
      await sleep();
      const task = buildTaskDetail(id);
      const submitMethod = task.submitMethod ?? "link";
      const trimmedLink = payload.submissionLink?.trim();

      if (submitMethod === "link" && !trimmedLink) {
        throw new Error("Link submission wajib diisi");
      }
      if (submitMethod === "file" && !payload.submissionFile) {
        throw new Error("File submission wajib diunggah");
      }
      if (submitMethod === "file_link" && (!trimmedLink || !payload.submissionFile)) {
        throw new Error("Link dan file submission wajib diisi");
      }
      if (task.currentSubmission) {
        throw new Error("Tugas sudah dikumpulkan");
      }

      taskSubmissionState[id] = {
        link: trimmedLink,
        file: payload.submissionFile
          ? {
              fileName: payload.submissionFile.fileName,
              mimeType: payload.submissionFile.mimeType,
              url: `data:${payload.submissionFile.mimeType};base64,${payload.submissionFile.base64Data}`,
            }
          : undefined,
        status: "submitted",
        originalityCheck: {
          status: "queued",
          providerStatus: "QUEUED",
          maxSimilarity: 0,
          similarityLevel: null,
          revision: 1,
          checkedAt: null,
          lastSyncedAt: new Date().toISOString(),
          errorMessage: null,
        },
        submittedAt: new Date().toISOString()
      } satisfies CurrentSubmission;
      markModuleItemComplete(task.courseId, id);
      return buildTaskDetail(id);
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/tasks/${id}/submit`, payload);
    return unwrapApiData<TaskDetail>(response.data);
  },

  async getProfile() {
    if (useMockApi) {
      await sleep();
      return clone(profileState);
    }

    const response = await http.get("/api/user");
    return unwrapApiData<ProfileDetail>(response.data);
  },

  async updateProfile(payload: ProfilePayload) {
    if (useMockApi) {
      await sleep();
      profileState = {
        ...profileState,
        ...payload
      };
      return clone(profileState);
    }

    await ensureCsrfCookie();
    const response = await http.put("/api/profile", payload);
    return unwrapApiData<ProfileDetail>(response.data);
  },

  async changePassword(payload: PasswordPayload) {
    if (useMockApi) {
      await sleep();
      if (payload.newPassword.length < 8) {
        throw new Error("Password baru minimal 8 karakter");
      }
      if (payload.newPassword !== payload.confirmPassword) {
        throw new Error("Konfirmasi password tidak cocok");
      }
      return { success: true };
    }

    await ensureCsrfCookie();
    const response = await http.post("/api/profile/change-password", payload);
    return unwrapApiData<{ success: boolean }>(response.data);
  }
};
