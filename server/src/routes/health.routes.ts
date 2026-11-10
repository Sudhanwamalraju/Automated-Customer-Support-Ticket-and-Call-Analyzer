import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";

export const healthRouter = Router();

healthRouter.get("/health", async (_req: Request, res: Response) => {
  // Verify DB connectivity
  let dbStatus: "ok" | "error" = "error";
  let dbLatencyMs: number | null = null;

  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - start;
    dbStatus = "ok";
  } catch {
    dbStatus = "error";
  }

  const statusCode = dbStatus === "ok" ? 200 : 503;

  res.status(statusCode).json({
    status: dbStatus === "ok" ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    services: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
    },
  });
});
