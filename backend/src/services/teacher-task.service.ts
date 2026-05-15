import { prisma } from "../lib/prisma.js";
import { requireTeacherContext, requireTeacherOwnsOffering } from "./teacher-context.service.js";
import { AppError } from "../utils/app-error.js";
import { toBigIntId } from "./lms-context.service.js";

export type RubricPayload = {
  name: string;
  maxScore: number;
  urutan?: number;
};

export type CreateTaskPayload = {
  moduleStudentClassId: string;
  lessonId: string;
  judul: string;
  deskripsi?: string;
  deadline: string;
  availableAt?: string;
  allowRevision?: boolean;
  isAktif?: boolean;
  status?: "draft" | "published";
  rubrics?: RubricPayload[];
};

export type UpdateTaskPayload = Partial<
  Omit<CreateTaskPayload, "moduleStudentClassId" | "lessonId">
>;

async function assertTeacherOwnsTask(taskId: bigint, userId: string) {
  const teacher = await requireTeacherContext(userId);
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      moduleStudentClass: { teacherId: teacher.id },
    },
    include: { rubrics: { orderBy: { urutan: "asc" } } },
  });
  if (!task) throw new AppError("Tugas tidak ditemukan atau tidak bisa diakses", 404);
  return { teacher, task };
}

export async function createTask(userId: string, payload: CreateTaskPayload) {
  const offeringId = toBigIntId(payload.moduleStudentClassId, "ModuleStudentClass ID");
  const lessonId = toBigIntId(payload.lessonId, "Lesson ID");
  await requireTeacherOwnsOffering(offeringId, userId);

  const task = await prisma.task.create({
    data: {
      modulesStudentClassId: offeringId,
      lessonId,
      judul: payload.judul,
      deskripsi: payload.deskripsi ?? null,
      deadline: new Date(payload.deadline),
      availableAt: payload.availableAt ? new Date(payload.availableAt) : null,
      allowRevision: payload.allowRevision ?? false,
      isAktif: payload.isAktif ?? false,
      status: payload.status ?? "draft",
      rubrics: payload.rubrics
        ? {
            create: payload.rubrics.map((r, idx) => ({
              name: r.name,
              maxScore: r.maxScore,
              urutan: r.urutan ?? idx + 1,
            })),
          }
        : undefined,
    },
    include: { rubrics: { orderBy: { urutan: "asc" } } },
  });

  return formatTask(task, task.rubrics);
}

export async function updateTask(
  taskId: string,
  userId: string,
  payload: UpdateTaskPayload
) {
  const bigId = toBigIntId(taskId, "Task ID");
  await assertTeacherOwnsTask(bigId, userId);

  const task = await prisma.$transaction(async (tx) => {
    const updated = await tx.task.update({
      where: { id: bigId },
      data: {
        ...(payload.judul !== undefined && { judul: payload.judul }),
        ...(payload.deskripsi !== undefined && { deskripsi: payload.deskripsi }),
        ...(payload.deadline !== undefined && { deadline: new Date(payload.deadline) }),
        ...(payload.availableAt !== undefined && {
          availableAt: payload.availableAt ? new Date(payload.availableAt) : null,
        }),
        ...(payload.allowRevision !== undefined && { allowRevision: payload.allowRevision }),
        ...(payload.isAktif !== undefined && { isAktif: payload.isAktif }),
        ...(payload.status !== undefined && { status: payload.status }),
      },
    });

    // Jika rubrics diupdate, hapus semua lalu buat ulang
    if (payload.rubrics !== undefined) {
      await tx.taskRubric.deleteMany({ where: { taskId: bigId } });
      if (payload.rubrics.length > 0) {
        await tx.taskRubric.createMany({
          data: payload.rubrics.map((r, idx) => ({
            taskId: bigId,
            name: r.name,
            maxScore: r.maxScore,
            urutan: r.urutan ?? idx + 1,
          })),
        });
      }
    }

    const rubrics = await tx.taskRubric.findMany({
      where: { taskId: bigId },
      orderBy: { urutan: "asc" },
    });

    return { updated, rubrics };
  });

  return formatTask(task.updated, task.rubrics);
}

export async function updateTaskStatus(
  taskId: string,
  userId: string,
  isAktif: boolean,
  status?: "draft" | "published"
) {
  const bigId = toBigIntId(taskId, "Task ID");
  await assertTeacherOwnsTask(bigId, userId);

  const updated = await prisma.task.update({
    where: { id: bigId },
    data: {
      isAktif,
      ...(status !== undefined && { status }),
    },
    include: { rubrics: { orderBy: { urutan: "asc" } } },
  });

  return formatTask(updated, updated.rubrics);
}

export async function deleteTask(taskId: string, userId: string) {
  const bigId = toBigIntId(taskId, "Task ID");
  await assertTeacherOwnsTask(bigId, userId);
  await prisma.task.delete({ where: { id: bigId } });
  return { success: true };
}

export async function getTaskById(taskId: string, userId: string) {
  const bigId = toBigIntId(taskId, "Task ID");
  const { task } = await assertTeacherOwnsTask(bigId, userId);
  return formatTask(task, task.rubrics);
}

function formatTask(
  task: {
    id: bigint;
    judul: string;
    deskripsi: string | null;
    deadline: Date;
    availableAt: Date | null;
    allowRevision: boolean;
    isAktif: boolean;
    status: string;
    modulesStudentClassId: bigint;
    lessonId: bigint;
  },
  rubrics: {
    id: bigint;
    name: string;
    maxScore: number;
    urutan: number;
  }[]
) {
  return {
    id: String(task.id),
    title: task.judul,
    description: task.deskripsi ?? "",
    deadline: task.deadline.toISOString(),
    availableAt: task.availableAt?.toISOString() ?? null,
    allowRevision: task.allowRevision,
    isActive: task.isAktif,
    status: task.status,
    moduleStudentClassId: String(task.modulesStudentClassId),
    lessonId: String(task.lessonId),
    rubrics: rubrics.map((r) => ({
      id: String(r.id),
      name: r.name,
      maxScore: r.maxScore,
      order: r.urutan,
    })),
  };
}
