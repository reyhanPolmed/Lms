import type { NextFunction, Request, Response } from "express";

import { studentAuth, teacherAuth } from "../config/auth.js";
import { AppError } from "../utils/app-error.js";
import { buildHeaders } from "../utils/request-headers.js";

export async function authMiddleware(request: Request, _response: Response, next: NextFunction) {
  const isTeacherRoute = request.originalUrl.includes("/api/teacher");
  const authInstance = isTeacherRoute ? teacherAuth : studentAuth;

  const sessionResult = await authInstance.api.getSession({
    headers: buildHeaders(request)
  });

  if (!sessionResult?.session || !sessionResult.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  request.authSession = sessionResult.session;
  request.authUser = sessionResult.user;
  next();
}
