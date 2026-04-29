import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL wajib diisi"),
  BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET minimal 32 karakter"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL harus URL valid"),
  BETTER_AUTH_TRUSTED_ORIGINS: z.string().default("http://localhost:3000"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  CSRF_ENABLED: z
    .string()
    .default("false")
    .transform((value) => value === "true")
});

export const env = envSchema.parse(process.env);

export function getTrustedOrigins() {
  return env.BETTER_AUTH_TRUSTED_ORIGINS.split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}
