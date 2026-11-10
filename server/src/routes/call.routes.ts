// ============================================================
// Call Transcript Routes — /api/calls
// ============================================================

import { Router } from "express";
import * as callController from "../controllers/call.controller";
import { validateRequest } from "../middleware/validate";
import { idParamSchema } from "../validators/common.validator";
import { createCallSchema } from "../validators/call.validator";

export const callRouter = Router();

// POST /api/calls - create a call transcript interaction
callRouter.post(
  "/",
  validateRequest({ body: createCallSchema }),
  callController.createCall
);

// GET /api/calls/:id - return call transcript details
callRouter.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  callController.getCallById
);

// POST /api/calls/:id/analyze - analyze call transcript with AI pipeline
callRouter.post(
  "/:id/analyze",
  validateRequest({ params: idParamSchema }),
  callController.analyzeCall
);
