import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";
import { toBigIntId } from "./lms-context.service.js";
import { requireTeacherContext } from "./teacher-context.service.js";
import {
  buildOriginalitySummary,
  getTaskSubmissionIntegrityComparison,
  getTaskSubmissionIntegrityPairs,
  retryTaskSubmissionIntegrityCheck,
} from "./winnowing.service.js";

function containsComparisonId(value: unknown, comparisonId: string): boolean {
  if (typeof value === "string") return value === comparisonId;
  if (Array.isArray(value)) return value.some((item) => containsComparisonId(item, comparisonId));
  if (!value || typeof value !== "object") return false;

  return Object.values(value).some((item) => containsComparisonId(item, comparisonId));
}

async function getTeacherSubmissionCheck(submissionId: string, userId: string) {
  const teacher = await requireTeacherContext(userId);
  const submission = await prisma.taskSubmission.findFirst({
    where: {
      id: toBigIntId(submissionId, "Submission ID"),
      task: { moduleStudentClass: { teacherId: teacher.id } },
    },
    include: {
      similarityCheck: true,
    },
  });

  if (!submission) {
    throw new AppError("Submission tidak ditemukan atau tidak bisa diakses", 404);
  }

  return submission.similarityCheck;
}

export async function getTaskSubmissionIntegritySummary(submissionId: string, userId: string) {
  const check = await getTeacherSubmissionCheck(submissionId, userId);
  return buildOriginalitySummary(check);
}

export async function listTaskSubmissionIntegrityPairs(submissionId: string, userId: string) {
  const check = await getTeacherSubmissionCheck(submissionId, userId);

  if (!check?.similarityDocumentId || check.similarityStatus !== "completed") {
    return [];
  }

  const response = await getTaskSubmissionIntegrityPairs(check.similarityDocumentId);
  return response.data;
}

export async function getTaskSubmissionIntegrityPairDetail(
  submissionId: string,
  comparisonId: string,
  userId: string
) {
  const check = await getTeacherSubmissionCheck(submissionId, userId);

  if (!check?.similarityDocumentId || check.similarityStatus !== "completed") {
    throw new AppError("Hasil pemeriksaan kemiripan belum tersedia", 409);
  }

  const pairs = await getTaskSubmissionIntegrityPairs(check.similarityDocumentId);
  if (!containsComparisonId(pairs.data, comparisonId)) {
    throw new AppError("Comparison tidak ditemukan atau tidak bisa diakses", 404);
  }

  const response = await getTaskSubmissionIntegrityComparison(comparisonId);
  return response.data;
}

export async function retryTaskSubmissionIntegrity(submissionId: string, userId: string) {
  const check = await getTeacherSubmissionCheck(submissionId, userId);

  if (!check) {
    throw new AppError("Pemeriksaan kemiripan belum tersedia untuk submission ini", 404);
  }

  await retryTaskSubmissionIntegrityCheck(check);
  return getTaskSubmissionIntegritySummary(submissionId, userId);
}
