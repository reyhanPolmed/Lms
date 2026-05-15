import { prisma } from "../lib/prisma.js";
import { requireTeacherContext, requireTeacherOwnsOffering } from "./teacher-context.service.js";
import { AppError } from "../utils/app-error.js";
import { toBigIntId } from "./lms-context.service.js";

export type QuizQuestionPayload = {
  pertanyaan: string;
  questionImage?: string;
  opsiA: string;
  opsiB: string;
  opsiC: string;
  opsiD: string;
  opsiBenar: "A" | "B" | "C" | "D";
};

export type CreateQuizPayload = {
  moduleStudentClassId: string;
  sectionId?: string;
  lessonId?: string;
  judul: string;
  posisi?: number;
  skorLulus?: number;
  durasiMenit?: number;
  availableAt?: string;
  deadline?: string;
  isAktif?: boolean;
  questions: QuizQuestionPayload[];
};

export type UpdateQuizPayload = Partial<Omit<CreateQuizPayload, "moduleStudentClassId">>;

async function assertTeacherOwnsQuiz(quizId: bigint, userId: string) {
  const teacher = await requireTeacherContext(userId);
  const quiz = await prisma.quiz.findFirst({
    where: {
      id: quizId,
      moduleStudentClass: { teacherId: teacher.id },
    },
    include: { questions: { orderBy: { id: "asc" } } },
  });
  if (!quiz) throw new AppError("Kuis tidak ditemukan atau tidak bisa diakses", 404);
  return { teacher, quiz };
}

export async function createQuiz(userId: string, payload: CreateQuizPayload) {
  const offeringId = toBigIntId(payload.moduleStudentClassId, "ModuleStudentClass ID");
  await requireTeacherOwnsOffering(offeringId, userId);

  let posisi = payload.posisi;
  if (!posisi) {
    const maxPos = await prisma.quiz.aggregate({
      where: { modulesStudentClassId: offeringId },
      _max: { posisi: true },
    });
    posisi = (maxPos._max.posisi ?? 0) + 1;
  }

  const quiz = await prisma.quiz.create({
    data: {
      modulesStudentClassId: offeringId,
      sectionId: payload.sectionId ? toBigIntId(payload.sectionId) : null,
      lessonId: payload.lessonId ? toBigIntId(payload.lessonId) : null,
      judul: payload.judul,
      posisi,
      skorLulus: payload.skorLulus ?? 70,
      durasiMenit: payload.durasiMenit ?? null,
      availableAt: payload.availableAt ? new Date(payload.availableAt) : null,
      deadline: payload.deadline ? new Date(payload.deadline) : null,
      isAktif: payload.isAktif ?? false,
      questions: {
        create: payload.questions.map((q) => ({
          pertanyaan: q.pertanyaan,
          questionImage: q.questionImage ?? null,
          opsiA: q.opsiA,
          opsiB: q.opsiB,
          opsiC: q.opsiC,
          opsiD: q.opsiD,
          opsiBenar: q.opsiBenar,
          jawabanBenar: null,
        })),
      },
    },
    include: { questions: true },
  });

  return formatQuiz(quiz, quiz.questions);
}

export async function updateQuiz(
  quizId: string,
  userId: string,
  payload: UpdateQuizPayload
) {
  const bigId = toBigIntId(quizId, "Quiz ID");
  await assertTeacherOwnsQuiz(bigId, userId);

  const quiz = await prisma.$transaction(async (tx) => {
    const updated = await tx.quiz.update({
      where: { id: bigId },
      data: {
        ...(payload.judul !== undefined && { judul: payload.judul }),
        ...(payload.posisi !== undefined && { posisi: payload.posisi }),
        ...(payload.skorLulus !== undefined && { skorLulus: payload.skorLulus }),
        ...(payload.durasiMenit !== undefined && { durasiMenit: payload.durasiMenit }),
        ...(payload.availableAt !== undefined && {
          availableAt: payload.availableAt ? new Date(payload.availableAt) : null,
        }),
        ...(payload.deadline !== undefined && {
          deadline: payload.deadline ? new Date(payload.deadline) : null,
        }),
        ...(payload.isAktif !== undefined && { isAktif: payload.isAktif }),
        ...(payload.sectionId !== undefined && {
          sectionId: payload.sectionId ? toBigIntId(payload.sectionId) : null,
        }),
      },
    });

    // Jika ada update soal — hapus semua lalu buat ulang
    if (payload.questions !== undefined) {
      await tx.quizQuestion.deleteMany({ where: { quizId: bigId } });
      await tx.quizQuestion.createMany({
        data: payload.questions.map((q) => ({
          quizId: bigId,
          pertanyaan: q.pertanyaan,
          questionImage: q.questionImage ?? null,
          opsiA: q.opsiA,
          opsiB: q.opsiB,
          opsiC: q.opsiC,
          opsiD: q.opsiD,
          opsiBenar: q.opsiBenar,
          jawabanBenar: null,
        })),
      });
    }

    const questions = await tx.quizQuestion.findMany({
      where: { quizId: bigId },
      orderBy: { id: "asc" },
    });

    return { updated, questions };
  });

  return formatQuiz(quiz.updated, quiz.questions);
}

export async function updateQuizStatus(quizId: string, userId: string, isAktif: boolean) {
  const bigId = toBigIntId(quizId, "Quiz ID");
  await assertTeacherOwnsQuiz(bigId, userId);

  const updated = await prisma.quiz.update({
    where: { id: bigId },
    data: { isAktif },
    include: { questions: true },
  });

  return formatQuiz(updated, updated.questions);
}

export async function deleteQuiz(quizId: string, userId: string) {
  const bigId = toBigIntId(quizId, "Quiz ID");
  await assertTeacherOwnsQuiz(bigId, userId);
  await prisma.quiz.delete({ where: { id: bigId } });
  return { success: true };
}

export async function getQuizById(quizId: string, userId: string) {
  const bigId = toBigIntId(quizId, "Quiz ID");
  const { quiz } = await assertTeacherOwnsQuiz(bigId, userId);
  return formatQuiz(quiz, quiz.questions);
}

export async function listTeacherQuizzes(
  userId: string,
  offeringId?: string
) {
  const teacher = await requireTeacherContext(userId);
  const offeringBigId = offeringId ? toBigIntId(offeringId) : undefined;

  const quizzes = await prisma.quiz.findMany({
    where: {
      moduleStudentClass: { teacherId: teacher.id },
      ...(offeringBigId && { modulesStudentClassId: offeringBigId }),
    },
    include: {
      questions: true,
      moduleStudentClass: { include: { module: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return quizzes.map((q) => ({
    ...formatQuiz(q, q.questions),
    moduleName: q.moduleStudentClass.module.judul,
  }));
}

function formatQuiz(
  quiz: {
    id: bigint;
    judul: string;
    posisi: number;
    skorLulus: number;
    durasiMenit: number | null;
    isAktif: boolean;
    availableAt: Date | null;
    deadline: Date | null;
    sectionId: bigint | null;
    modulesStudentClassId: bigint;
  },
  questions: {
    id: bigint;
    pertanyaan: string;
    questionImage: string | null;
    opsiA: string;
    opsiB: string;
    opsiC: string;
    opsiD: string;
    opsiBenar: string;
  }[]
) {
  return {
    id: String(quiz.id),
    title: quiz.judul,
    position: quiz.posisi,
    passScore: quiz.skorLulus,
    durationMinutes: quiz.durasiMenit,
    isActive: quiz.isAktif,
    availableAt: quiz.availableAt?.toISOString() ?? null,
    deadline: quiz.deadline?.toISOString() ?? null,
    sectionId: quiz.sectionId ? String(quiz.sectionId) : null,
    moduleStudentClassId: String(quiz.modulesStudentClassId),
    questionCount: questions.length,
    questions: questions.map((q) => ({
      id: String(q.id),
      pertanyaan: q.pertanyaan,
      questionImage: q.questionImage,
      opsiA: q.opsiA,
      opsiB: q.opsiB,
      opsiC: q.opsiC,
      opsiD: q.opsiD,
      opsiBenar: q.opsiBenar,
    })),
  };
}
