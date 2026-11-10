// ============================================================
// Ticket Controller
// Routes → Controllers → Services → Prisma
// ============================================================

import type { Request, Response, NextFunction } from "express";
import * as ticketService from "../services/ticket.service";
import * as aiService from "../services/ai.service";
import { sendSuccess } from "../utils/response";
import { NotFoundError } from "../utils/errors";
import type {
  CreateTicketDto,
  UpdateTicketDto,
  GetTicketsQueryDto,
  RegenerateResponseDto,
} from "../validators/ticket.validator";

/** GET /api/tickets */
export async function getTickets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as GetTicketsQueryDto;
    const filters = {
      status: query.status,
      category: query.category,
      urgency: query.urgency,
      sentiment: query.sentiment,
      source: query.source,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    };
    const pagination = {
      page: query.page,
      limit: query.limit,
    };

    const result = await ticketService.getTickets(filters, pagination);
    sendSuccess(res, result, "Tickets retrieved successfully");
  } catch (error) {
    next(error);
  }
}

/** GET /api/tickets/:id */
export async function getTicketById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      throw new NotFoundError(`Ticket with ID '${id}' not found`);
    }

    sendSuccess(res, ticket, "Ticket retrieved successfully");
  } catch (error) {
    next(error);
  }
}

/** POST /api/tickets */
export async function createTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as CreateTicketDto;
    const ticket = await ticketService.createTicket(body);
    sendSuccess(res, ticket, "Ticket created successfully", 201);
  } catch (error) {
    next(error);
  }
}

/** PUT /api/tickets/:id */
export async function updateTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const existing = await ticketService.getTicketById(id);
    if (!existing) {
      throw new NotFoundError(`Ticket with ID '${id}' not found`);
    }

    const body = req.body as UpdateTicketDto;
    const updated = await ticketService.updateTicket(id, body);
    sendSuccess(res, updated, "Ticket updated successfully");
  } catch (error) {
    next(error);
  }
}

/** DELETE /api/tickets/:id */
export async function deleteTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const existing = await ticketService.getTicketById(id);
    if (!existing) {
      throw new NotFoundError(`Ticket with ID '${id}' not found`);
    }

    await ticketService.deleteTicket(id);
    sendSuccess(res, { id }, "Ticket deleted successfully");
  } catch (error) {
    next(error);
  }
}

/** POST /api/tickets/:id/analyze */
export async function analyzeTicket(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const updated = await aiService.analyzeTicketById(id);
    sendSuccess(res, updated, "Ticket analyzed successfully");
  } catch (error) {
    next(error);
  }
}

/** POST /api/tickets/:id/regenerate-response */
export async function regenerateResponse(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params.id);
    const { tone, customInstructions } = req.body as RegenerateResponseDto;

    const updated = await aiService.regenerateTicketResponse(id, {
      tone,
      customInstructions,
    });

    sendSuccess(res, updated, "Response draft regenerated successfully");
  } catch (error) {
    next(error);
  }
}
