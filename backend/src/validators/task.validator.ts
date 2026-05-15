import { z } from "zod";

export const taskSubmitSchema = z
  .union([
    z.object({ submissionLink: z.string().url("Link submission harus URL valid") }),
    z.object({ submission_link: z.string().url("Link submission harus URL valid") }),
  ])
  .transform((value) => ({
    submissionLink: "submissionLink" in value ? value.submissionLink : value.submission_link,
  }));
