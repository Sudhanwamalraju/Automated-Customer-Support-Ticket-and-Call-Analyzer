// ============================================================
// Express App Configuration
// ============================================================

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiRouter } from "./routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp(clientUrl: string) {
  const app = express();

  // Security middleware
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: clientUrl,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Request parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Logging (in non-test environments)
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  // Mount API Routes under /api
  app.use("/api", apiRouter);

  // 404 Handler
  app.use(notFoundHandler);

  // Centralized Global Error Handler
  app.use(errorHandler);

  return app;
}
