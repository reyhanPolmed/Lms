import { prisma } from "../lib/prisma.js";
import {
  buildSequentialSidebar,
  ensureStringArray,
  requireStudentContext,
  toBigIntId
} from "./lms-context.service.js";
import { AppError } from "../utils/app-error.js";

function mapContentType(type: string) {
  return type.toLowerCase();
}

async function getLessonGraph(lessonId: string, userId: string) {
  const student = await requireStudentContext(userId);
  const normalizedLessonId = toBigIntId(lessonId, "Lesson ID");
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: normalizedLessonId,
      moduleStudentClass: {
        studentClassId: student.kelas.id
      }
    },
    include: {
      lessonUsers: {
        where: {
          userId: student.userId
        }
      },
      lessonDurations: {
        where: {
          userId: student.userId
        }
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
          },
          module: true
        }
      }
    }
  });

  if (!lesson) {
    throw new AppError("Lesson tidak ditemukan", 404);
  }

  return lesson;
}

export async function getStudentLessonDetail(lessonId: string, userId: string) {
  const lesson = await getLessonGraph(lessonId, userId);
  const { sidebar } = buildSequentialSidebar({
    sections: lesson.moduleStudentClass.sections.map((section) => ({
      id: section.id,
      title: section.judul,
      description: null,
      order: section.urutan
    })),
    lessons: lesson.moduleStudentClass.lessons.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "lesson" as const,
      sectionId: item.sectionId,
      position: item.posisi,
      href: `/lessons/${item.id}`,
      availableAt: item.tersediaPada,
      isCompleted: item.lessonUsers.some((progress) => progress.isCompleted)
    })),
    quizzes: lesson.moduleStudentClass.quizzes.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "quiz" as const,
      sectionId: item.sectionId,
      position: item.posisi,
      href: `/quizzes/${item.id}`,
      availableAt: item.availableAt,
      isCompleted: item.attempts.length > 0
    })),
    tasks: lesson.moduleStudentClass.tasks.map((item) => ({
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

  const durationTargetSeconds = lesson.durasi ?? 0;
  const trackedSeconds = lesson.lessonDurations[0]?.seconds ?? 0;

  return {
    id: String(lesson.id),
    moduleId: String(lesson.moduleStudentClass.id),
    title: lesson.judul,
    contentType: mapContentType(lesson.tipeKonten),
    contentUrl: lesson.urlKonten ?? "",
    excerpt: lesson.konten.slice(0, 160),
    body: lesson.konten,
    durationTargetSeconds,
    trackedSeconds,
    isCompleted: lesson.lessonUsers.some((progress) => progress.isCompleted),
    sidebar,
    tips: ensureStringArray(null, [
      "Kirim durasi berkala ke endpoint tracking.",
      "Tombol selesai aktif setelah durasi minimum tercapai.",
      "Sidebar diproses server-side."
    ])
  };
}

export async function trackLessonDuration(lessonId: string, userId: string, seconds: number) {
  const student = await requireStudentContext(userId);
  const lesson = await getLessonGraph(lessonId, userId);
  const normalizedLessonId = lesson.id;
  const existing = lesson.lessonDurations[0];
  const durationTargetSeconds = lesson.durasi ?? 0;
  const nextSeconds = durationTargetSeconds > 0
    ? Math.min(durationTargetSeconds, (existing?.seconds ?? 0) + seconds)
    : (existing?.seconds ?? 0) + seconds;

  await prisma.lessonUserDuration.upsert({
    where: {
      userId_lessonId: {
        userId: student.userId,
        lessonId: normalizedLessonId
      }
    },
    create: {
      userId: student.userId,
      lessonId: normalizedLessonId,
      seconds: nextSeconds
    },
    update: {
      seconds: nextSeconds
    }
  });

  return getStudentLessonDetail(lessonId, userId);
}

export async function completeLesson(lessonId: string, userId: string) {
  const student = await requireStudentContext(userId);
  const lesson = await getLessonGraph(lessonId, userId);
  const trackedSeconds = lesson.lessonDurations[0]?.seconds ?? 0;
  const durationTargetSeconds = lesson.durasi ?? 0;

  if (trackedSeconds < durationTargetSeconds) {
    throw new AppError("Durasi minimum belum terpenuhi", 422);
  }

  await prisma.lessonUser.upsert({
    where: {
      userId_lessonId: {
        userId: student.userId,
        lessonId: lesson.id
      }
    },
    create: {
      userId: student.userId,
      lessonId: lesson.id,
      isCompleted: true
    },
    update: {
      isCompleted: true
    }
  });

  return getStudentLessonDetail(lessonId, userId);
}
