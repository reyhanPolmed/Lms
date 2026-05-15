import type { NextFunction, Request, Response } from "express";

import { teacherAuth } from "../config/auth.js";
import { AppError } from "../utils/app-error.js";
import { buildHeaders } from "../utils/request-headers.js";
import { requireTeacherContext } from "../services/teacher-context.service.js";

export async function teacherMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  // Auth check
  const sessionResult = await teacherAuth.api.getSession({
    headers: buildHeaders(request),
  });

  if (!sessionResult?.session || !sessionResult.user) {
    next(new AppError("Unauthorized", 401));
    return;
  }

  // Teacher role check
  try {
    await requireTeacherContext(sessionResult.user.id);
  } catch {
    next(new AppError("Akses hanya untuk guru", 403));
    return;
  }

  request.authSession = sessionResult.session;
  request.authUser = sessionResult.user;
  next();
}
