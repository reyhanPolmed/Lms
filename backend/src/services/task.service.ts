import { SubmissionStatus } from "@prisma/client";

import { prisma } from "../lib/prisma.js";
import {
  buildSequentialSidebar,
  ensureStringArray,
  requireStudentContext,
  toBigIntId
} from "./lms-context.service.js";
import { AppError } from "../utils/app-error.js";

async function getTaskGraph(taskId: string, userId: string) {
  const student = await requireStudentContext(userId);
  const task = await prisma.task.findFirst({
    where: {
      id: toBigIntId(taskId, "Task ID"),
      moduleStudentClass: {
        studentClassId: student.kelas.id
      }
    },
    include: {
      submissions: {
        where: {
          userId: student.userId
        },
        take: 1
      },
      lesson: true,
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
              lesson: true,
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

  if (!task) {
    throw new AppError("Tugas tidak ditemukan", 404);
  }

  return task;
}

export async function getStudentTaskDetail(taskId: string, userId: string) {
  const task = await getTaskGraph(taskId, userId);
  const { sidebar } = buildSequentialSidebar({
    sections: task.moduleStudentClass.sections.map((section) => ({
      id: section.id,
      title: section.judul,
      description: null,
      order: section.urutan
    })),
    lessons: task.moduleStudentClass.lessons.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "lesson" as const,
      sectionId: item.sectionId,
      position: item.posisi,
      href: `/lessons/${item.id}`,
      availableAt: item.tersediaPada,
      isCompleted: item.lessonUsers.some((progress) => progress.isCompleted)
    })),
    quizzes: task.moduleStudentClass.quizzes.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "quiz" as const,
      sectionId: item.sectionId,
      position: item.posisi,
      href: `/quizzes/${item.id}`,
      availableAt: item.availableAt,
      isCompleted: item.attempts.length > 0
    })),
    tasks: task.moduleStudentClass.tasks.map((item) => ({
      id: item.id,
      title: item.judul,
      type: "task" as const,
      sectionId: item.lesson.sectionId,
      position: Number(item.id),
      href: `/tasks/${item.id}`,
      availableAt: item.availableAt,
      isCompleted: item.submissions.length > 0
    }))
  });

  const currentSubmission = task.submissions[0];

  return {
    id: String(task.id),
    courseId: String(task.moduleStudentClass.id),
    title: task.judul,
    description: task.deskripsi ?? "",
    dueAt: task.deadline.toISOString(),
    allowRevision: task.allowRevision,
    currentSubmission: currentSubmission
      ? {
          link: currentSubmission.submissionLink,
          status: currentSubmission.status.toLowerCase(),
          teacherNote: currentSubmission.teacherNote ?? undefined,
          submittedAt: currentSubmission.submittedAt?.toISOString() ?? null
        }
      : undefined,
    sidebar,
    checklist: ensureStringArray(null, [
      "Pastikan link submission dapat diakses.",
      "Gunakan format nama file yang konsisten.",
      "Periksa deadline sebelum mengirim."
    ])
  };
}

export async function submitTaskSubmission(taskId: string, userId: string, submissionLink: string) {
  const student = await requireStudentContext(userId);
  const task = await getTaskGraph(taskId, userId);
  const currentSubmission = task.submissions[0];

  if (currentSubmission && !task.allowRevision) {
    throw new AppError("Tugas ini tidak mengizinkan revisi", 422);
  }

  if (currentSubmission) {
    await prisma.taskSubmission.update({
      where: {
        id: currentSubmission.id
      },
      data: {
        submissionLink,
        submittedAt: new Date(),
        status: SubmissionStatus.SUBMITTED,
        teacherNote: null
      }
    });
  } else {
    await prisma.taskSubmission.create({
      data: {
        taskId: task.id,
        userId: student.userId,
        submissionLink,
        submittedAt: new Date(),
        status: SubmissionStatus.SUBMITTED
      }
    });
  }

  return getStudentTaskDetail(taskId, userId);
}
