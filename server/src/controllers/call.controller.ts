// ============================================================
// Call Controller
// Routes → Controllers → Services → Prisma
// ============================================================

import type { Request, Response, NextFunction } from "express";
import * as callService from "../services/callTranscript.service";
import * as ticketService from "../services/ticket.service";
import * as aiService from "../services/ai.service";
import { sendSuccess } from "../utils/response";
import { NotFoundError } from "../utils/errors";
import type { CreateCallDto } from "../validators/call.validator";

/** POST /api/calls */
export async function createCall(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as CreateCallDto;
    const rawText = body.rawText || body.transcript || "";
    const interaction = await callService.createCallInteraction({
      ...body,
      rawText,
    });
    sendSuccess(res, interaction, "Call interaction created successfully", 201);
  } catch (error) {
    next(error);
  }
}

/** GET /api/calls/:id */
export async function getCallById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const call = await callService.getCallDetails(id);

    if (!call || !call.callTranscript) {
      throw new NotFoundError(`Call interaction with ID '${id}' not found`);
    }

    sendSuccess(res, call, "Call details retrieved successfully");
  } catch (error) {
    next(error);
  }
}

/** POST /api/calls/:id/analyze */
export async function analyzeCall(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const updated = await aiService.analyzeCallById(id);
    sendSuccess(res, updated, "Call transcript analyzed successfully");
  } catch (error) {
    next(error);
  }
}
