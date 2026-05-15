import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { pinoHttp } from "pino-http";
import { toNodeHandler } from "better-auth/node";

import { studentAuth, teacherAuth } from "./config/auth.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { issueCsrfCookie, csrfMiddleware } from "./middlewares/csrf.middleware.js";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { createApiRouter } from "./routes/api.routes.js";
import { createTeacherRouter } from "./routes/teacher.routes.js";
import { loginController, logoutController } from "./controllers/auth.controller.js";
import { asyncHandler } from "./utils/async-handler.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((value) => value.trim()),
      credentials: true
    })
  );
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  app.get("/health", (_request, response) => {
    response.json({
      status: "ok"
    });
  });

  app.get("/api/csrf-cookie", issueCsrfCookie);

  app.all("/api/auth/siswa/*splat", toNodeHandler(studentAuth));
  app.all("/api/auth/guru/*splat", toNodeHandler(teacherAuth));

  app.use(express.json());
  app.use(csrfMiddleware);

  app.post("/login", asyncHandler(loginController));
  app.post("/logout", asyncHandler(logoutController));
  app.use("/api", createApiRouter());
  app.use("/api/teacher", createTeacherRouter());

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}
