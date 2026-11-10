// ============================================================
// Dashboard Routes — /api/dashboard
// ============================================================

import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller";

export const dashboardRouter = Router();

// GET /api/dashboard/stats - overall metrics and distribution breakdown
dashboardRouter.get("/stats", dashboardController.getDashboardStats);
