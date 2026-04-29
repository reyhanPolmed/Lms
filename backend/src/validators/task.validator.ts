import { z } from "zod";

export const taskSubmitSchema = z.object({
  submission_link: z.string().url("Link submission harus URL valid")
});
