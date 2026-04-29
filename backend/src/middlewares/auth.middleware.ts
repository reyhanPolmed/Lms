import type { NextFunction, Request, Response } from "express";

import { auth } from "../config/auth.js";
import { AppError } from "../utils/app-error.js";
import { buildHeaders } from "../utils/request-headers.js";

export async function authMiddleware(request: Request, _response: Response, next: NextFunction) {
  const sessionResult = await auth.api.getSession({
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
