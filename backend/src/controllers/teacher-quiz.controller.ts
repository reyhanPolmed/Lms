import type { Request, Response } from "express";
import { z } from "zod";
import {
  createQuiz,
  deleteQuiz,
  getQuizById,
  listTeacherQuizzes,
  updateQuiz,
  updateQuizStatus,
} from "../services/teacher-quiz.service.js";
import { idParamSchema } from "../validators/common.validator.js";

const questionSchema = z.object({
  pertanyaan: z.string().min(1),
  questionImage: z.string().optional(),
  opsiA: z.string().min(1),
  opsiB: z.string().min(1),
  opsiC: z.string().min(1),
  opsiD: z.string().min(1),
  opsiBenar: z.enum(["A", "B", "C", "D"]),
});

const createQuizSchema = z.object({
  moduleStudentClassId: z.string(),
  sectionId: z.string().optional(),
  lessonId: z.string().optional(),
  judul: z.string().min(1),
  posisi: z.number().int().positive().optional(),
  skorLulus: z.number().int().min(0).max(100).optional(),
  durasiMenit: z.number().int().positive().optional(),
  availableAt: z.string().optional(),
  deadline: z.string().optional(),
  isAktif: z.boolean().optional(),
  questions: z.array(questionSchema).min(1),
});

const updateQuizSchema = createQuizSchema
  .omit({ moduleStudentClassId: true })
  .extend({ questions: z.array(questionSchema).min(1).optional() })
  .partial();

const statusSchema = z.object({
  isAktif: z.boolean(),
});

export async function listTeacherQuizzesController(
  request: Request,
  response: Response
) {
  const { offeringId } = request.query as { offeringId?: string };
  const quizzes = await listTeacherQuizzes(request.authUser!.id, offeringId);
  response.json(quizzes);
}

export async function createQuizController(
  request: Request,
  response: Response
) {
  const payload = createQuizSchema.parse(request.body);
  const quiz = await createQuiz(request.authUser!.id, payload);
  response.status(201).json(quiz);
}

export async function getQuizTeacherController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  const quiz = await getQuizById(id, request.authUser!.id);
  response.json(quiz);
}

export async function updateQuizController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  const payload = updateQuizSchema.parse(request.body);
  const quiz = await updateQuiz(id, request.authUser!.id, payload);
  response.json(quiz);
}

export async function patchQuizStatusController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  const { isAktif } = statusSchema.parse(request.body);
  const quiz = await updateQuizStatus(id, request.authUser!.id, isAktif);
  response.json(quiz);
}

export async function deleteQuizController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  const result = await deleteQuiz(id, request.authUser!.id);
  response.json(result);
}
