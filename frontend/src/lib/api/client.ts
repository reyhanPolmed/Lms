import { ensureCsrfCookie, http } from "@/lib/api/http";
import {
  buildDashboardData,
  mockLesson,
  mockModuleDetails,
  mockModules,
  mockProfile,
  mockQuiz,
  mockTask
} from "@/lib/mocks/data";
import {
  DashboardData,
  LessonDetail,
  LoginPayload,
  ModuleDetail,
  ModuleSummary,
  PasswordPayload,
  ProfileDetail,
  ProfilePayload,
  QuizAttempt,
  QuizDetail,
  QuizSubmitPayload,
  TaskDetail,
  TrackDurationPayload
} from "@/lib/types";

const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

let profileState = { ...mockProfile };
let lessonState = { ...mockLesson };
let quizState = { ...mockQuiz };
let taskState = {
  ...mockTask,
  currentSubmission: mockTask.currentSubmission ? { ...mockTask.currentSubmission } : undefined
};

function sleep(ms = 250) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function getModuleOrThrow(id: string) {
  const found = mockModuleDetails.find((item) => item.id === id);
  if (!found) {
    throw new Error("Modul tidak ditemukan");
  }
  return found;
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
    return unwrapApiData<unknown>(response.data);
  },

  async logout() {
    if (useMockApi) {
      await sleep();
      return { success: true };
    }

    await ensureCsrfCookie();
    const response = await http.post("/logout");
    return unwrapApiData<unknown>(response.data);
  },

  async getDashboard() {
    if (useMockApi) {
      await sleep();
      const dashboard = buildDashboardData();
      dashboard.user = clone(profileState);
      dashboard.upcomingTasks = dashboard.upcomingTasks.map((item) => ({
        ...item,
        status: taskState.currentSubmission?.status === "revision" ? "revision" : "due-soon"
      }));
      dashboard.metrics = dashboard.metrics.map((metric) =>
        metric.label === "Perlu revisi"
          ? {
              ...metric,
              value: taskState.currentSubmission?.status === "revision" ? 1 : 0
            }
          : metric
      );
      return dashboard;
    }

    const response = await http.get("/api/dashboard");
    return unwrapApiData<DashboardData>(response.data);
  },

  async getModules() {
    if (useMockApi) {
      await sleep();
      return clone(mockModules);
    }

    const response = await http.get("/api/modules");
    return unwrapApiData<ModuleSummary[]>(response.data);
  },

  async getModuleById(id: string) {
    if (useMockApi) {
      await sleep();
      return clone(getModuleOrThrow(id));
    }

    const response = await http.get(`/api/modules/${id}`);
    return unwrapApiData<ModuleDetail>(response.data);
  },

  async getLessonById(id: string) {
    if (useMockApi) {
      await sleep();
      if (lessonState.id !== id) {
        throw new Error("Lesson tidak ditemukan");
      }
      return clone(lessonState);
    }

    const response = await http.get(`/api/lessons/${id}`);
    return unwrapApiData<LessonDetail>(response.data);
  },

  async trackLessonDuration(id: string, payload: TrackDurationPayload) {
    if (useMockApi) {
      await sleep();
      if (lessonState.id !== id) {
        throw new Error("Lesson tidak ditemukan");
      }
      lessonState = {
        ...lessonState,
        trackedSeconds: Math.min(
          lessonState.durationTargetSeconds,
          lessonState.trackedSeconds + payload.seconds
        )
      };
      return clone(lessonState);
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/lessons/${id}/duration`, payload);
    return unwrapApiData<LessonDetail>(response.data);
  },

  async completeLesson(id: string) {
    if (useMockApi) {
      await sleep();
      if (lessonState.id !== id) {
        throw new Error("Lesson tidak ditemukan");
      }
      if (lessonState.trackedSeconds < lessonState.durationTargetSeconds) {
        throw new Error("Durasi minimum belum terpenuhi");
      }
      lessonState = {
        ...lessonState,
        isCompleted: true,
        sidebar: lessonState.sidebar.map((item) =>
          item.id === id ? { ...item, isCompleted: true } : item
        )
      };
      return clone(lessonState);
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/lessons/${id}/complete`);
    return unwrapApiData<LessonDetail>(response.data);
  },

  async getQuizById(id: string) {
    if (useMockApi) {
      await sleep();
      if (quizState.id !== id) {
        throw new Error("Quiz tidak ditemukan");
      }
      return clone(quizState);
    }

    const response = await http.get(`/api/quizzes/${id}`);
    return unwrapApiData<QuizDetail>(response.data);
  },

  async startQuiz(id: string) {
    if (useMockApi) {
      await sleep();
      if (quizState.id !== id) {
        throw new Error("Quiz tidak ditemukan");
      }
      return {
        id: `attempt-${Date.now()}`,
        quizId: id,
        status: "in_progress",
        questionOrder: quizState.questionOrder
      } satisfies QuizAttempt;
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/quizzes/${id}/start`);
    return unwrapApiData<QuizAttempt>(response.data);
  },

  async submitQuiz(id: string, payload: QuizSubmitPayload) {
    if (useMockApi) {
      await sleep();
      if (quizState.id !== id) {
        throw new Error("Quiz tidak ditemukan");
      }

      const correctAnswers = quizState.questions.reduce((count, question) => {
        return count + (payload.answers[question.id] === question.correctOption ? 1 : 0);
      }, 0);

      const baseScore = Math.round((correctAnswers / quizState.questions.length) * 100);
      const score = payload.fullscreenViolation ? Math.max(0, baseScore - 15) : baseScore;
      const isPassed = score >= quizState.passScore;

      quizState = {
        ...quizState,
        lastScore: score
      };

      return {
        score,
        isPassed
      };
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/quizzes/${id}/submit`, payload);
    return unwrapApiData<{ score: number; isPassed: boolean }>(response.data);
  },

  async getTaskById(id: string) {
    if (useMockApi) {
      await sleep();
      if (taskState.id !== id) {
        throw new Error("Tugas tidak ditemukan");
      }
      return clone(taskState);
    }

    const response = await http.get(`/api/tasks/${id}`);
    return unwrapApiData<TaskDetail>(response.data);
  },

  async submitTask(id: string, submissionLink: string) {
    if (useMockApi) {
      await sleep();
      if (taskState.id !== id) {
        throw new Error("Tugas tidak ditemukan");
      }
      if (!submissionLink.trim()) {
        throw new Error("Link submission wajib diisi");
      }
      if (taskState.currentSubmission && !taskState.allowRevision) {
        throw new Error("Tugas ini tidak mengizinkan revisi");
      }

      taskState = {
        ...taskState,
        currentSubmission: {
          link: submissionLink,
          status: "submitted",
          submittedAt: new Date().toISOString()
        }
      };
      return clone(taskState);
    }

    await ensureCsrfCookie();
    const response = await http.post(`/api/tasks/${id}/submit`, {
      submission_link: submissionLink
    });
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
