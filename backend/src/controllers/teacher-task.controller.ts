import type { Request, Response } from "express";
import { z } from "zod";
import {
  createTask,
  deleteTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
} from "../services/teacher-task.service.js";
import { idParamSchema } from "../validators/common.validator.js";

const rubricSchema = z.object({
  name: z.string().min(1),
  maxScore: z.number().int().positive(),
  urutan: z.number().int().positive().optional(),
});

const createTaskSchema = z.object({
  moduleStudentClassId: z.string(),
  lessonId: z.string(),
  judul: z.string().min(1),
  deskripsi: z.string().optional(),
  deadline: z.string(),
  availableAt: z.string().optional(),
  allowRevision: z.boolean().optional(),
  isAktif: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
  rubrics: z.array(rubricSchema).optional(),
});

const updateTaskSchema = createTaskSchema
  .omit({ moduleStudentClassId: true, lessonId: true })
  .partial();

const statusSchema = z.object({
  isAktif: z.boolean(),
  status: z.enum(["draft", "published"]).optional(),
});

export async function createTaskController(
  request: Request,
  response: Response
) {
  const payload = createTaskSchema.parse(request.body);
  const task = await createTask(request.authUser!.id, payload);
  response.status(201).json(task);
}

export async function getTaskTeacherController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  const task = await getTaskById(id, request.authUser!.id);
  response.json(task);
}

export async function updateTaskController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  const payload = updateTaskSchema.parse(request.body);
  const task = await updateTask(id, request.authUser!.id, payload);
  response.json(task);
}

export async function patchTaskStatusController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  const { isAktif, status } = statusSchema.parse(request.body);
  const task = await updateTaskStatus(id, request.authUser!.id, isAktif, status);
  response.json(task);
}

export async function deleteTaskController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  const result = await deleteTask(id, request.authUser!.id);
  response.json(result);
}
