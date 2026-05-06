import { z } from "zod";

const canonicalTaskSubmitSchema = z.object({
  submissionLink: z.string().url("Link submission harus URL valid")
});

const legacyTaskSubmitSchema = z.object({
  submission_link: z.string().url("Link submission harus URL valid")
});

export const taskSubmitSchema = z
  .union([canonicalTaskSubmitSchema, legacyTaskSubmitSchema])
  .transform((value) => ({
    submissionLink: "submissionLink" in value ? value.submissionLink : value.submission_link
  }));
