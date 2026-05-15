import { QuizAttemptsStatus } from "@prisma/client";

import { prisma } from "../lib/prisma.js";
import {
  buildSequentialSidebar,
  requireStudentContext,
  toBigIntId
} from "./lms-context.service.js";
import { AppError } from "../utils/app-error.js";
import { shuffle } from "../utils/shuffle.js";

function parseQuestionOrder(value: string | null, fallback: string[]) {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((entry): entry is string => typeof entry === "string");
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function normalizeOption(value: string | undefined) {
  const option = value?.trim().toUpperCase() ?? "";
  return /^[A-D]$/.test(option) ? option : " ";
}

async function getQuizGraph(quizId: string, userId: string) {
  const student = await requireStudentContext(userId);
  const quiz = await prisma.quiz.findFirst({
    where: {
      id: toBigIntId(quizId, "Quiz ID"),
      moduleStudentClass: {
        studentClassId: student.kelas.id
      }
    },
    include: {
      questions: {
        orderBy: {
          id: "asc"
        }
      },
      attempts: {
        where: {
          userId: student.userId
        },
        orderBy: {
          startedAt: "desc"
        },
        take: 5
      },
      moduleStudentClass: {
        include: {
          sections: {
            orderBy: {
              urutan: "asc"
            }
          },
          lessons: {
            orderBy: {
              posisi: "asc"
            },
            include: {
              lessonUsers: {
                where: {
                  userId: student.userId
                }
              }
            }
          },
          quizzes: {
            orderBy: {
              posisi: "asc"
            },
            include: {
              attempts: {
                where: {
                  userId: student.userId,
                  submittedAt: {
                    not: null
                  }
                },
                take: 1
              }
            }
          },
          tasks: {
            orderBy: {
              id: "asc"
            },
            include: {
              submissions: {
                where: {
                  userId: student.userId
                },
                take: 1
              }
            }
          }
        }
      }
    }
  });

  if (!quiz) {
    throw new AppError("Quiz tidak ditemukan", 404);
  }

  return quiz;
}

export async function getStudentQuizDetail(quizId: string, userId: string) {
  const quiz = await getQuizGraph(quizId, userId);
  const latestAttempt = quiz.attempts[0];
  const fallbackOrder = quiz.questions.map((question) => String(question.id));
  const questionOrder = parseQuestionOrder(latestAttempt?.questionOrder ?? null, fallbackOrder);
  const { sidebar } = buildSequentialSidebar({
    sections: quiz.moduleStudentClass.sections.map((section) => ({
      id: section.id,
      title: section.judul,
      description: null,
      order: section.urutan
    })),
    lessons: quiz.moduleStudentClass.lessons.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "lesson" as const,
      sectionId: item.sectionId,
      position: item.posisi,
      href: `/lessons/${item.id}`,
      availableAt: item.tersediaPada,
      isCompleted: item.lessonUsers.some((progress) => progress.isCompleted)
    })),
    quizzes: quiz.moduleStudentClass.quizzes.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "quiz" as const,
      sectionId: item.sectionId,
      position: item.posisi,
      href: `/quizzes/${item.id}`,
      availableAt: item.availableAt,
      isCompleted: item.attempts.length > 0
    })),
    tasks: quiz.moduleStudentClass.tasks.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "task" as const,
      sectionId: item.lessonId,
      position: Number(item.id),
      href: `/tasks/${item.id}`,
      availableAt: item.availableAt,
      isCompleted: item.submissions.length > 0
    }))
  });

  return {
    id: String(quiz.id),
    courseId: String(quiz.moduleStudentClass.id),
    title: quiz.judul,
    intro: "",
    passScore: quiz.skorLulus,
    durationMinutes: quiz.durasiMenit,
    questionOrder,
    questions: quiz.questions.map((question) => ({
      id: String(question.id),
      prompt: question.pertanyaan,
      options: [
        { key: "A", label: question.opsiA },
        { key: "B", label: question.opsiB },
        { key: "C", label: question.opsiC },
        { key: "D", label: question.opsiD }
      ],
      correctOption: ""
    })),
    penaltyNote: "Fullscreen violation akan menurunkan skor sesuai aturan backend.",
    sidebar,
    lastScore: latestAttempt?.submittedAt ? latestAttempt.score : undefined
  };
}

export async function startQuizAttempt(quizId: string, userId: string) {
  const student = await requireStudentContext(userId);
  const quiz = await getQuizGraph(quizId, userId);
  const questionOrder = shuffle(quiz.questions.map((question) => String(question.id)));
  const attempt = await prisma.quizAttempt.create({
    data: {
      quizId: quiz.id,
      userId: student.userId,
      questionOrder: JSON.stringify(questionOrder),
      status: QuizAttemptsStatus.ON_TIME
    }
  });

  return {
    id: String(attempt.id),
    quizId: String(attempt.quizId),
    status: "in_progress",
    questionOrder
  };
}

export async function submitQuizAttempt(
  quizId: string,
  userId: string,
  payload: {
    answers: Record<string, string>;
    fullscreenViolation: boolean;
  }
) {
  const student = await requireStudentContext(userId);
  const quiz = await getQuizGraph(quizId, userId);
  const attempt = quiz.attempts.find((item) => item.submittedAt === null);

  if (!attempt) {
    throw new AppError("Attempt quiz belum dimulai", 422);
  }

  const answerRows = quiz.questions.map((question) => {
    const selectedOption = normalizeOption(payload.answers[String(question.id)]);
    return {
      quizAttemptId: attempt.id,
      quizQuestionId: question.id,
      userId: student.userId,
      selectedOption,
      isCorrect: selectedOption === question.opsiBenar.toUpperCase()
    };
  });

  const correctAnswers = answerRows.filter((answer) => answer.isCorrect).length;
  const baseScore = Math.round((correctAnswers / Math.max(quiz.questions.length, 1)) * 100);
  const score = payload.fullscreenViolation ? Math.max(0, baseScore - 10) : baseScore;
  const isPassed = score >= quiz.skorLulus;
  const submittedAt = new Date();
  const status = quiz.deadline && submittedAt > quiz.deadline
    ? QuizAttemptsStatus.LATE
    : QuizAttemptsStatus.ON_TIME;

  await prisma.$transaction([
    prisma.quizUserAnswer.deleteMany({
      where: {
        quizAttemptId: attempt.id
      }
    }),
    prisma.quizUserAnswer.createMany({
      data: answerRows
    }),
    prisma.quizAttempt.update({
      where: {
        id: attempt.id
      },
      data: {
        score,
        isPassed,
        submittedAt,
        durationSeconds: Math.max(0, Math.floor((submittedAt.getTime() - attempt.startedAt.getTime()) / 1000)),
        status
      }
    }),
    prisma.quizUser.deleteMany({
      where: {
        quizId: quiz.id,
        userId: student.userId
      }
    }),
    prisma.quizUser.create({
      data: {
        quizId: quiz.id,
        userId: student.userId,
        score,
        isPassed
      }
    })
  ]);

  return {
    score,
    isPassed
  };
}

export async function getQuizResult(quizId: string, userId: string) {
  const quiz = await getQuizGraph(quizId, userId);
  const attempt = quiz.attempts.find((item) => item.submittedAt !== null);

  if (!attempt) {
    throw new AppError("Belum ada hasil quiz", 404);
  }

  return {
    attemptId: String(attempt.id),
    quizId: String(quiz.id),
    score: attempt.score ?? 0,
    isPassed: attempt.isPassed ?? false,
    submittedAt: attempt.submittedAt
  };
}
