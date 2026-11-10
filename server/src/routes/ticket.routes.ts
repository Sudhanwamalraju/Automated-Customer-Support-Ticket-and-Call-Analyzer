// ============================================================
// Ticket Routes — /api/tickets
// ============================================================

import { Router } from "express";
import * as ticketController from "../controllers/ticket.controller";
import * as dashboardController from "../controllers/dashboard.controller";
import { validateRequest } from "../middleware/validate";
import { idParamSchema } from "../validators/common.validator";
import {
  createTicketSchema,
  updateTicketSchema,
  getTicketsQuerySchema,
  regenerateResponseSchema,
} from "../validators/ticket.validator";

export const ticketRouter = Router();

// GET /api/tickets/stats/dashboard - stats alias
ticketRouter.get("/stats/dashboard", dashboardController.getDashboardStats);

// GET /api/tickets - paginated, search, filter, sort
ticketRouter.get(
  "/",
  validateRequest({ query: getTicketsQuerySchema }),
  ticketController.getTickets
);

// GET /api/tickets/:id - complete ticket info
ticketRouter.get(
  "/:id",
  validateRequest({ params: idParamSchema }),
  ticketController.getTicketById
);

// POST /api/tickets - create ticket
ticketRouter.post(
  "/",
  validateRequest({ body: createTicketSchema }),
  ticketController.createTicket
);

// PUT /api/tickets/:id - update ticket
ticketRouter.put(
  "/:id",
  validateRequest({ params: idParamSchema, body: updateTicketSchema }),
  ticketController.updateTicket
);

// DELETE /api/tickets/:id - delete ticket
ticketRouter.delete(
  "/:id",
  validateRequest({ params: idParamSchema }),
  ticketController.deleteTicket
);

// POST /api/tickets/:id/analyze - trigger AI analysis
ticketRouter.post(
  "/:id/analyze",
  validateRequest({ params: idParamSchema }),
  ticketController.analyzeTicket
);

// POST /api/tickets/:id/regenerate-response - generate a new response draft
ticketRouter.post(
  "/:id/regenerate-response",
  validateRequest({ params: idParamSchema, body: regenerateResponseSchema }),
  ticketController.regenerateResponse
);
