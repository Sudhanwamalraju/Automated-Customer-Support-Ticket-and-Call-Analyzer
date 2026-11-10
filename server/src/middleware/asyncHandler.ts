import { Request, Response, NextFunction } from "express";

/**
 * Generic async error wrapper for route handlers.
 * Catches any thrown errors and passes them to Express error handler.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
