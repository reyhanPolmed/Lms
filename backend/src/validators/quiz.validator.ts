import { z } from "zod";

export const quizSubmitSchema = z.object({
  answers: z.record(z.string(), z.string()),
  fullscreenViolation: z.boolean().default(false),
});
