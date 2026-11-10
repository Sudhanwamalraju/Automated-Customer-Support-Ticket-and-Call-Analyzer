// ============================================================
// Standard API Response Helpers
// ============================================================

import type { Response } from "express";

export interface StandardSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface StandardErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

/**
 * Send a standardized success response
 */
export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): Response {
  const body: StandardSuccessResponse<T> = {
    success: true,
    data,
    ...(message ? { message } : {}),
  };
  return res.status(statusCode).json(body);
}

/**
 * Send a standardized error response
 */
export function sendError(
  res: Response,
  message: string,
  code: string = "INTERNAL_SERVER_ERROR",
  statusCode: number = 500,
  details?: unknown
): Response {
  const body: StandardErrorResponse = {
    success: false,
    error: {
      message,
      code,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return res.status(statusCode).json(body);
}
