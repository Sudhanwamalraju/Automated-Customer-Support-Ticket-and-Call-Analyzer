// ============================================================
// Call Transcript Zod Validators
// ============================================================

import { z } from "zod";
import { CategoryEnum, UrgencyEnum } from "./ticket.validator";

export const createCallSchema = z
  .object({
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
    rawText: z
      .string()
      .trim()
      .min(10, "Call transcript raw text must be at least 10 characters")
      .max(50000, "Transcript cannot exceed 50,000 characters")
      .optional(),
    transcript: z
      .string()
      .trim()
      .min(10, "Call transcript must be at least 10 characters")
      .max(50000, "Transcript cannot exceed 50,000 characters")
      .optional(),
    callerPhone: z.string().trim().max(50).optional(),
    duration: z.coerce.number().int().min(0, "Duration must be positive").optional(),
    speakerCount: z.coerce.number().int().min(1, "Speaker count must be at least 1").optional().default(2),
    agentName: z.string().trim().max(100).optional(),
    category: CategoryEnum.optional().default("GENERAL"),
    urgency: UrgencyEnum.optional().default("MEDIUM"),
    keywords: z.array(z.string().trim()).optional().default([]),
  })
  .refine((data) => Boolean(data.rawText || data.transcript), {
    message: "Transcript text is required",
    path: ["transcript"],
  });

export type CreateCallDto = z.infer<typeof createCallSchema>;
