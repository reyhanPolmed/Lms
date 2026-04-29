import { SubmissionStatus } from "@prisma/client";

import { prisma } from "../lib/prisma.js";
import { listStudentModules } from "./module.service.js";
import { getStudentProfile } from "./profile.service.js";
import { requireStudentContext } from "./lms-context.service.js";

function isDueSoon(date: Date | null | undefined) {
  if (!date) {
    return false;
  }

  const now = Date.now();
  const diff = date.getTime() - now;
  return diff <= 1000 * 60 * 60 * 48;
}

export async function getStudentDashboard(userId: string) {
  const student = await requireStudentContext(userId);
  const [profile, modules, quizzes, tasks] = await Promise.all([
    getStudentProfile(userId),
    listStudentModules(userId),
    prisma.quiz.findMany({
      where: {
        moduleStudentClass: {
          studentClassId: student.kelas.id
        },
        isAktif: true
      },
      include: {
        moduleStudentClass: {
          include: {
            module: true
          }
        },
        attempts: {
          where: {
            userId: student.userId,
            submittedAt: {
              not: null
            }
          },
          take: 1
        }
      },
      orderBy: {
        deadline: "asc"
      },
      take: 5
    }),
    prisma.task.findMany({
      where: {
        moduleStudentClass: {
          studentClassId: student.kelas.id
        },
        isAktif: true
      },
      include: {
        moduleStudentClass: {
          include: {
            module: true
          }
        },
        submissions: {
          where: {
            userId: student.userId
          },
          take: 1
        }
      },
      orderBy: {
        deadline: "asc"
      },
      take: 5
    })
  ]);

  const revisionCount = tasks.filter((task) => task.submissions[0]?.status === SubmissionStatus.REVISED).length;
  const completedModules = modules.filter((item) => item.completionPercent === 100).length;

  return {
    user: {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      className: profile.className,
      department: profile.department,
      weeklyProgress: profile.weeklyProgress
    },
    metrics: [
      {
        label: "Modul aktif",
        value: modules.length,
        helper: `${completedModules} modul selesai penuh`,
        tone: "gold"
      },
      {
        label: "Progress minggu ini",
        value: profile.weeklyProgress,
        helper: "Rata-rata progres dari modul aktif",
        tone: "sky"
      },
      {
        label: "Perlu revisi",
        value: revisionCount,
        helper: "Submission yang perlu tindak lanjut",
        tone: "mint"
      }
    ],
    modules,
    upcomingQuizzes: quizzes.map((quiz) => ({
      id: String(quiz.id),
      title: quiz.judul,
      type: "quiz",
      dueAt: quiz.deadline?.toISOString() ?? new Date().toISOString(),
      moduleTitle: quiz.moduleStudentClass.module.judul,
      status: isDueSoon(quiz.deadline) ? "due-soon" : "scheduled",
      href: `/quizzes/${quiz.id}`
    })),
    upcomingTasks: tasks.map((task) => ({
      id: String(task.id),
      title: task.judul,
      type: "task",
      dueAt: task.deadline.toISOString(),
      moduleTitle: task.moduleStudentClass.module.judul,
      status:
        task.submissions[0]?.status === SubmissionStatus.REVISED
          ? "revision"
          : isDueSoon(task.deadline)
            ? "due-soon"
            : "scheduled",
      href: `/tasks/${task.id}`
    }))
  };
}
