import { prisma } from "../lib/prisma.js";
import { requireTeacherContext, requireTeacherOwnsOffering } from "./teacher-context.service.js";
import { AppError } from "../utils/app-error.js";
import { toBigIntId } from "./lms-context.service.js";

export type CreateLessonPayload = {
  moduleStudentClassId: string;
  sectionId?: string;
  judul: string;
  tipeKonten: "text" | "video" | "pdf" | "link";
  konten: string;
  urlKonten?: string;
  durasi?: number;
  tersediaPada?: string;
  posisi?: number;
  status?: "draft" | "published";
};

export type UpdateLessonPayload = Partial<Omit<CreateLessonPayload, "moduleStudentClassId">>;

async function assertTeacherOwnsLesson(lessonId: bigint, userId: string) {
  const teacher = await requireTeacherContext(userId);
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      moduleStudentClass: { teacherId: teacher.id },
    },
  });
  if (!lesson) throw new AppError("Materi tidak ditemukan atau tidak bisa diakses", 404);
  return { teacher, lesson };
}

export async function createLesson(userId: string, payload: CreateLessonPayload) {
  const offeringId = toBigIntId(payload.moduleStudentClassId, "ModuleStudentClass ID");
  await requireTeacherOwnsOffering(offeringId, userId);

  // Auto-calculate posisi
  let posisi = payload.posisi;
  if (!posisi) {
    const maxPos = await prisma.lesson.aggregate({
      where: { moduleStudentClassId: offeringId },
      _max: { posisi: true },
    });
    posisi = (maxPos._max.posisi ?? 0) + 1;
  }

  const lesson = await prisma.lesson.create({
    data: {
      moduleStudentClassId: offeringId,
      sectionId: payload.sectionId ? toBigIntId(payload.sectionId) : null,
      judul: payload.judul,
      tipeKonten: payload.tipeKonten,
      konten: payload.konten,
      urlKonten: payload.urlKonten ?? null,
      durasi: payload.durasi ?? null,
      tersediaPada: payload.tersediaPada ? new Date(payload.tersediaPada) : null,
      posisi,
      status: payload.status ?? "draft",
      urutan: posisi,
    },
  });

  return formatLesson(lesson);
}

export async function updateLesson(
  lessonId: string,
  userId: string,
  payload: UpdateLessonPayload
) {
  const bigId = toBigIntId(lessonId, "Lesson ID");
  await assertTeacherOwnsLesson(bigId, userId);

  const updated = await prisma.lesson.update({
    where: { id: bigId },
    data: {
      ...(payload.judul !== undefined && { judul: payload.judul }),
      ...(payload.tipeKonten !== undefined && { tipeKonten: payload.tipeKonten }),
      ...(payload.konten !== undefined && { konten: payload.konten }),
      ...(payload.urlKonten !== undefined && { urlKonten: payload.urlKonten }),
      ...(payload.durasi !== undefined && { durasi: payload.durasi }),
      ...(payload.tersediaPada !== undefined && {
        tersediaPada: payload.tersediaPada ? new Date(payload.tersediaPada) : null,
      }),
      ...(payload.posisi !== undefined && { posisi: payload.posisi, urutan: payload.posisi }),
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.sectionId !== undefined && {
        sectionId: payload.sectionId ? toBigIntId(payload.sectionId) : null,
      }),
    },
  });

  return formatLesson(updated);
}

export async function publishLesson(lessonId: string, userId: string, status: "draft" | "published") {
  const bigId = toBigIntId(lessonId, "Lesson ID");
  await assertTeacherOwnsLesson(bigId, userId);

  const updated = await prisma.lesson.update({
    where: { id: bigId },
    data: { status },
  });

  return formatLesson(updated);
}

export async function deleteLesson(lessonId: string, userId: string) {
  const bigId = toBigIntId(lessonId, "Lesson ID");
  await assertTeacherOwnsLesson(bigId, userId);
  await prisma.lesson.delete({ where: { id: bigId } });
  return { success: true };
}

export async function getLessonById(lessonId: string, userId: string) {
  const bigId = toBigIntId(lessonId, "Lesson ID");
  const { lesson } = await assertTeacherOwnsLesson(bigId, userId);
  return formatLesson(lesson);
}

function formatLesson(lesson: {
  id: bigint;
  judul: string;
  tipeKonten: string;
  konten: string;
  urlKonten: string | null;
  durasi: number | null;
  posisi: number;
  status: string;
  tersediaPada: Date | null;
  sectionId: bigint | null;
  moduleStudentClassId: bigint;
}) {
  return {
    id: String(lesson.id),
    title: lesson.judul,
    contentType: lesson.tipeKonten,
    body: lesson.konten,
    contentUrl: lesson.urlKonten ?? "",
    durationMinutes: lesson.durasi,
    position: lesson.posisi,
    status: lesson.status,
    availableAt: lesson.tersediaPada?.toISOString() ?? null,
    sectionId: lesson.sectionId ? String(lesson.sectionId) : null,
    moduleStudentClassId: String(lesson.moduleStudentClassId),
  };
}
