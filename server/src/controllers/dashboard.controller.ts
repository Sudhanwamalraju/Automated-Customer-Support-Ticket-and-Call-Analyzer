// ============================================================
// Dashboard Controller
// Routes → Controllers → Services → Prisma
// ============================================================

import type { Request, Response, NextFunction } from "express";
import * as ticketService from "../services/ticket.service";
import { sendSuccess } from "../utils/response";

/** GET /api/dashboard/stats */
export async function getDashboardStats(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const stats = await ticketService.getDashboardStats();
    sendSuccess(res, stats, "Dashboard statistics retrieved successfully");
  } catch (error) {
    next(error);
  }
}
