import { readFile } from "node:fs/promises";
import path from "node:path";

import type { TaskSubmissionSimilarityCheck } from "@prisma/client";

import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../utils/app-error.js";

export type OriginalityCheckStatus =
  | "not_requested"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

type WinnowingDocument = {
  id: string;
  processingStatus?: string;
  revision?: number;
  maxSimilarity?: number;
  similarityLevel?: string;
  processedAt?: string | null;
  processingError?: string | null;
};

type WinnowingJob = {
  id: string;
  status?: string;
};

type WinnowingResponse<T> = {
  success: boolean;
  data: T;
};

type SimilarityProviderPayload = {
  document?: WinnowingDocument;
  job?: WinnowingJob;
  processingStatus?: string;
  status?: string;
  maxSimilarity?: number;
  similarityLevel?: string;
  processedAt?: string | null;
  processingError?: string | null;
};

const ACTIVE_STATUSES = ["queued", "processing"];
const DISPATCH_BATCH_SIZE = 10;
const SYNC_BATCH_SIZE = 25;

export function isWinnowingConfigured() {
  return Boolean(env.WINNOWING_API_BASE_URL && env.WINNOWING_TENANT_ID);
}

export function mapProviderStatus(status?: string | null): OriginalityCheckStatus {
  switch (status?.toUpperCase()) {
    case "QUEUED":
      return "queued";
    case "EXTRACTING_TEXT":
    case "RUNNING_OCR":
    case "FINGERPRINTING":
    case "COMPARING":
    case "PROCESSING":
      return "processing";
    case "COMPLETED":
      return "completed";
    case "FAILED":
      return "failed";
    default:
      return "not_requested";
  }
}

export function buildOriginalitySummary(check: TaskSubmissionSimilarityCheck | null | undefined) {
  return {
    status: (check?.similarityStatus ?? "not_requested") as OriginalityCheckStatus,
    providerStatus: check?.providerStatus ?? null,
    maxSimilarity: check?.maxSimilarity ?? 0,
    similarityLevel: check?.similarityLevel ?? null,
    revision: check?.revision ?? 0,
    checkedAt: check?.checkedAt?.toISOString() ?? null,
    lastSyncedAt: check?.lastSyncedAt?.toISOString() ?? null,
    errorMessage: check?.similarityError ?? null,
  };
}

async function winnowingFetch<T>(pathname: string, init?: RequestInit) {
  if (!env.WINNOWING_API_BASE_URL || !env.WINNOWING_TENANT_ID) {
    throw new AppError("Winnowing API belum dikonfigurasi", 503);
  }

  const headers = new Headers(init?.headers);
  if (env.WINNOWING_API_KEY) {
    headers.set("Authorization", `Bearer ${env.WINNOWING_API_KEY}`);
  }

  const response = await fetch(new URL(pathname, env.WINNOWING_API_BASE_URL), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`Winnowing API ${response.status}: ${message || response.statusText}`);
  }

  return response.json() as Promise<WinnowingResponse<T>>;
}

function toAbsoluteUploadPath(filePath: string) {
  return path.resolve(process.cwd(), filePath.replace(/^[/\\]+/, ""));
}

function extractDocument(payload: SimilarityProviderPayload): WinnowingDocument {
  return payload.document ?? {
    id: "",
    processingStatus: payload.processingStatus ?? payload.status,
    maxSimilarity: payload.maxSimilarity,
    similarityLevel: payload.similarityLevel,
    processedAt: payload.processedAt,
    processingError: payload.processingError,
  };
}

async function createWinnowingDocument(taskSubmissionId: bigint) {
  const submission = await prisma.taskSubmission.findUnique({
    where: { id: taskSubmissionId },
    include: {
      task: true,
      user: true,
    },
  });

  if (!submission?.submissionFilePath) {
    throw new Error("File submission tidak tersedia untuk pemeriksaan kemiripan");
  }

  const fileBytes = await readFile(toAbsoluteUploadPath(submission.submissionFilePath));
  const form = new FormData();
  form.append("tenantId", env.WINNOWING_TENANT_ID!);
  form.append("submissionId", String(submission.id));
  form.append("assignmentId", String(submission.taskId));
  form.append("studentId", String(submission.userId));
  form.append("courseId", String(submission.task.modulesStudentClassId));
  form.append("title", `${submission.task.judul} - ${submission.user.name}`);
  form.append("languages", "id");
  form.append(
    "file",
    new Blob([fileBytes], {
      type: submission.submissionFileType ?? "application/octet-stream",
    }),
    path.basename(submission.submissionFilePath)
  );

  return winnowingFetch<SimilarityProviderPayload>("/api/v1/documents", {
    method: "POST",
    body: form,
  });
}

export async function enqueueTaskSubmissionSimilarityCheck(taskSubmissionId: bigint) {
  const submission = await prisma.taskSubmission.findUnique({
    where: { id: taskSubmissionId },
    select: { id: true, submissionFilePath: true },
  });

  if (!submission) return;

  const canDispatch = Boolean(submission.submissionFilePath && isWinnowingConfigured());
  const errorMessage = submission.submissionFilePath
    ? isWinnowingConfigured()
      ? null
      : "winnowing_not_configured"
    : "file_submission_required";

  await prisma.taskSubmissionSimilarityCheck.upsert({
    where: { taskSubmissionId },
    create: {
      taskSubmissionId,
      tenantId: env.WINNOWING_TENANT_ID ?? "unconfigured",
      externalId: String(taskSubmissionId),
      similarityStatus: canDispatch ? "not_requested" : "not_requested",
      similarityError: errorMessage,
      nextRetryAt: canDispatch ? new Date() : null,
    },
    update: {
      tenantId: env.WINNOWING_TENANT_ID ?? "unconfigured",
      externalId: String(taskSubmissionId),
      similarityDocumentId: null,
      similarityJobId: null,
      similarityStatus: "not_requested",
      providerStatus: null,
      maxSimilarity: 0,
      similarityLevel: null,
      revision: 0,
      retryCount: 0,
      nextRetryAt: canDispatch ? new Date() : null,
      checkedAt: null,
      similarityError: errorMessage,
    },
  });
}

async function dispatchSimilarityCheck(checkId: bigint) {
  const claim = await prisma.taskSubmissionSimilarityCheck.updateMany({
    where: { id: checkId, similarityStatus: "not_requested" },
    data: { similarityStatus: "processing", providerStatus: "DISPATCHING" },
  });

  if (claim.count === 0) return;

  const check = await prisma.taskSubmissionSimilarityCheck.findUniqueOrThrow({
    where: { id: checkId },
  });

  try {
    const response = await createWinnowingDocument(check.taskSubmissionId);
    const document = extractDocument(response.data);
    const providerStatus = document.processingStatus ?? response.data.job?.status ?? "QUEUED";

    await prisma.taskSubmissionSimilarityCheck.update({
      where: { id: check.id },
      data: {
        similarityDocumentId: document.id,
        similarityJobId: response.data.job?.id ?? null,
        similarityStatus: mapProviderStatus(providerStatus),
        providerStatus,
        maxSimilarity: document.maxSimilarity ?? 0,
        similarityLevel: document.similarityLevel ?? null,
        revision: document.revision ?? 1,
        nextRetryAt: null,
        lastSyncedAt: new Date(),
        similarityError: null,
      },
    });
  } catch (error) {
    const retryCount = check.retryCount + 1;
    const isExhausted = retryCount > env.WINNOWING_MAX_RETRIES;
    const delayMs = Math.min(60_000, 2 ** retryCount * 1000);
    const message = error instanceof Error ? error.message : "submit_to_winnowing_failed";

    await prisma.taskSubmissionSimilarityCheck.update({
      where: { id: check.id },
      data: {
        similarityStatus: isExhausted ? "failed" : "not_requested",
        providerStatus: "DISPATCH_FAILED",
        retryCount,
        nextRetryAt: isExhausted ? null : new Date(Date.now() + delayMs),
        lastSyncedAt: new Date(),
        similarityError: message,
      },
    });

    logger.warn({ err: error, taskSubmissionId: String(check.taskSubmissionId) }, "Winnowing dispatch failed");
  }
}

async function syncSimilarityCheck(check: TaskSubmissionSimilarityCheck) {
  if (!check.similarityDocumentId || !env.WINNOWING_TENANT_ID) return;

  try {
    const response = await winnowingFetch<SimilarityProviderPayload>(
      `/api/v1/documents/${encodeURIComponent(check.similarityDocumentId)}/status?tenantId=${encodeURIComponent(env.WINNOWING_TENANT_ID)}`
    );
    const document = extractDocument(response.data);
    const providerStatus = document.processingStatus ?? response.data.status ?? "QUEUED";
    const status = mapProviderStatus(providerStatus);

    await prisma.taskSubmissionSimilarityCheck.update({
      where: { id: check.id },
      data: {
        similarityStatus: status,
        providerStatus,
        maxSimilarity: document.maxSimilarity ?? check.maxSimilarity,
        similarityLevel: document.similarityLevel ?? check.similarityLevel,
        checkedAt: status === "completed" ? new Date(document.processedAt ?? Date.now()) : check.checkedAt,
        lastSyncedAt: new Date(),
        similarityError: document.processingError ?? null,
      },
    });
  } catch (error) {
    logger.warn({ err: error, checkId: String(check.id) }, "Winnowing status sync failed");
  }
}

export async function runSimilarityWorkerCycle() {
  if (!isWinnowingConfigured()) return;

  const pendingChecks = await prisma.taskSubmissionSimilarityCheck.findMany({
    where: {
      similarityStatus: "not_requested",
      nextRetryAt: { lte: new Date() },
    },
    take: DISPATCH_BATCH_SIZE,
    orderBy: { updatedAt: "asc" },
  });

  for (const check of pendingChecks) {
    await dispatchSimilarityCheck(check.id);
  }

  const activeChecks = await prisma.taskSubmissionSimilarityCheck.findMany({
    where: {
      similarityStatus: { in: ACTIVE_STATUSES },
      similarityDocumentId: { not: null },
    },
    take: SYNC_BATCH_SIZE,
    orderBy: { lastSyncedAt: "asc" },
  });

  for (const check of activeChecks) {
    await syncSimilarityCheck(check);
  }
}

export async function getTaskSubmissionIntegrityPairs(documentId: string) {
  return winnowingFetch<unknown>(
    `/api/v1/documents/${encodeURIComponent(documentId)}/pairs?tenantId=${encodeURIComponent(env.WINNOWING_TENANT_ID!)}`
  );
}

export async function getTaskSubmissionIntegrityComparison(comparisonId: string) {
  return winnowingFetch<unknown>(
    `/api/v1/comparisons/${encodeURIComponent(comparisonId)}?tenantId=${encodeURIComponent(env.WINNOWING_TENANT_ID!)}`
  );
}

export async function retryTaskSubmissionIntegrityCheck(check: TaskSubmissionSimilarityCheck) {
  if (!check.similarityDocumentId) {
    await prisma.taskSubmissionSimilarityCheck.update({
      where: { id: check.id },
      data: {
        similarityStatus: "not_requested",
        providerStatus: null,
        retryCount: 0,
        nextRetryAt: new Date(),
        similarityError: null,
      },
    });
    return;
  }

  await winnowingFetch<unknown>(
    `/api/v1/documents/${encodeURIComponent(check.similarityDocumentId)}/retry?tenantId=${encodeURIComponent(env.WINNOWING_TENANT_ID!)}`,
    { method: "POST" }
  );

  await prisma.taskSubmissionSimilarityCheck.update({
    where: { id: check.id },
    data: {
      similarityStatus: "queued",
      providerStatus: "QUEUED",
      retryCount: 0,
      nextRetryAt: null,
      similarityError: null,
      lastSyncedAt: new Date(),
    },
  });
}
