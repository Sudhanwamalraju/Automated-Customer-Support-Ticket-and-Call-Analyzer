// ============================================================
// Master API Router
// ============================================================

import { Router } from "express";
import { healthRouter } from "./health.routes";
import { ticketRouter } from "./ticket.routes";
import { callRouter } from "./call.routes";
import { dashboardRouter } from "./dashboard.routes";

export const apiRouter = Router();

apiRouter.use(healthRouter);
apiRouter.use("/tickets", ticketRouter);
apiRouter.use("/calls", callRouter);
apiRouter.use("/dashboard", dashboardRouter);
