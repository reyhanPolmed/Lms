import type { Request, Response } from "express";
import { z } from "zod";

import {
  getTaskSubmissionIntegrityPairDetail,
  getTaskSubmissionIntegritySummary,
  listTaskSubmissionIntegrityPairs,
  retryTaskSubmissionIntegrity,
} from "../services/teacher-integrity.service.js";
import { idParamSchema } from "../validators/common.validator.js";

const pairParamSchema = idParamSchema.extend({
  comparisonId: z.string().min(1),
});

export async function getTaskSubmissionIntegritySummaryController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  response.json(await getTaskSubmissionIntegritySummary(id, request.authUser!.id));
}

export async function listTaskSubmissionIntegrityPairsController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  response.json(await listTaskSubmissionIntegrityPairs(id, request.authUser!.id));
}

export async function getTaskSubmissionIntegrityPairDetailController(
  request: Request,
  response: Response
) {
  const { id, comparisonId } = pairParamSchema.parse(request.params);
  response.json(
    await getTaskSubmissionIntegrityPairDetail(id, comparisonId, request.authUser!.id)
  );
}

export async function retryTaskSubmissionIntegrityController(
  request: Request,
  response: Response
) {
  const { id } = idParamSchema.parse(request.params);
  response.json(await retryTaskSubmissionIntegrity(id, request.authUser!.id));
}
