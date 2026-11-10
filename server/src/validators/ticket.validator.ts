// ============================================================
// Ticket Zod Validators
// ============================================================

import { z } from "zod";

export const SourceEnum = z.enum(["TICKET", "CALL"]);
export const StatusEnum = z.enum(["NEW", "ANALYZED", "IN_PROGRESS", "RESOLVED"]);
export const CategoryEnum = z.enum(["BILLING", "TECHNICAL", "ACCOUNT", "GENERAL", "OTHER"]);
export const UrgencyEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const SentimentEnum = z.enum(["ANGRY", "FRUSTRATED", "NEUTRAL", "HAPPY"]);

export const createTicketSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Customer name must be at least 2 characters")
    .max(100, "Customer name must not exceed 100 characters"),
  customerEmail: z
    .string()
    .trim()
    .email("Invalid customer email address"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must not exceed 200 characters"),
  content: z
    .string()
    .trim()
    .min(5, "Ticket content must be at least 5 characters")
    .max(10000, "Content cannot exceed 10,000 characters"),
  source: SourceEnum.optional().default("TICKET"),
  category: CategoryEnum.optional().default("GENERAL"),
  urgency: UrgencyEnum.optional().default("MEDIUM"),
});

export const updateTicketSchema = z.object({
  customerName: z.string().trim().min(2).max(100).optional(),
  customerEmail: z.string().trim().email().optional(),
  subject: z.string().trim().min(3).max(200).optional(),
  content: z.string().trim().min(5).max(10000).optional(),
  status: StatusEnum.optional(),
  category: CategoryEnum.optional(),
  urgency: UrgencyEnum.optional(),
  sentiment: SentimentEnum.optional().nullable(),
  summary: z.string().optional().nullable(),
  draftResponse: z.string().optional().nullable(),
  tags: z.array(z.string().trim().min(1)).optional(),
});

export const getTicketsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().trim().optional(),
  status: StatusEnum.optional(),
  category: CategoryEnum.optional(),
  urgency: UrgencyEnum.optional(),
  sentiment: SentimentEnum.optional(),
  source: SourceEnum.optional(),
  sortBy: z.enum(["createdAt", "urgency"]).optional().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const regenerateResponseSchema = z.object({
  tone: z
    .string()
    .trim()
    .toLowerCase()
    .transform((val) => (val === "professional" ? "formal" : val))
    .pipe(z.enum(["empathetic", "formal", "concise", "technical"]))
    .optional()
    .default("empathetic"),
  customInstructions: z.string().trim().max(500).optional(),
});

export type CreateTicketDto = z.infer<typeof createTicketSchema>;
export type UpdateTicketDto = z.infer<typeof updateTicketSchema>;
export type GetTicketsQueryDto = z.infer<typeof getTicketsQuerySchema>;
export type RegenerateResponseDto = z.infer<typeof regenerateResponseSchema>;
