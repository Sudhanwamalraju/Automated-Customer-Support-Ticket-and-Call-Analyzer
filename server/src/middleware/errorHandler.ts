// ============================================================
// Centralized Express Error Handling Middleware
// ============================================================

import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { AppError } from "../utils/errors";
import { sendError } from "../utils/response";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // 1. Handled AppError (custom domain errors)
  if (err instanceof AppError) {
    sendError(res, err.message, err.code, err.statusCode, err.details);
    return;
  }

  // 2. Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));
    sendError(
      res,
      "Validation failed: " + formattedErrors.map((e) => e.message).join(", "),
      "VALIDATION_ERROR",
      400,
      formattedErrors
    );
    return;
  }

  // 3. Prisma Known Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      sendError(res, "Resource not found", "NOT_FOUND", 404);
      return;
    }
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[])?.join(", ") || "field";
      sendError(res, `A record with this ${target} already exists`, "DUPLICATE_ENTRY", 409);
      return;
    }
  }

  // 4. JSON parse error
  if (err instanceof SyntaxError && "body" in err) {
    sendError(res, "Malformed JSON payload", "BAD_REQUEST", 400);
    return;
  }

  // 5. Unhandled unexpected errors
  console.error("Unhandled Server Error:", err);
  const isDev = process.env.NODE_ENV === "development";
  sendError(
    res,
    isDev && err instanceof Error ? err.message : "Internal server error",
    "INTERNAL_SERVER_ERROR",
    500
  );
}

/** 404 Not Found Middleware */
export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, `Endpoint ${req.method} ${req.originalUrl} not found`, "ROUTE_NOT_FOUND", 404);
}
