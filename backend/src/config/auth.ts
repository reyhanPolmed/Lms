import { randomUUID } from "node:crypto";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { env, getTrustedOrigins } from "./env.js";
import { prisma } from "../lib/prisma.js";

export const auth = betterAuth({
  appName: "Akara LMS",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: getTrustedOrigins(),
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  advanced: {
    database: {
      generateId: ({ model }) => {
        const normalizedModel = model.toLowerCase();

        if (normalizedModel === "user" || normalizedModel === "users") {
          return false;
        }

        return randomUUID();
      }
    }
  },
  emailAndPassword: {
    enabled: true
  },
  telemetry: {
    enabled: false
  }
});
