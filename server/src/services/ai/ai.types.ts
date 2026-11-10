// ============================================================
// AI Service Types & Zod Output Validation Schemas
// ============================================================

import { z } from "zod";
import type { Category, Urgency, Sentiment, Source } from "@prisma/client";

// Allowed enums
export const AICategoryEnum = z.enum(["BILLING", "TECHNICAL", "ACCOUNT", "GENERAL", "OTHER"]);
export const AIUrgencyEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const AISentimentEnum = z.enum(["ANGRY", "FRUSTRATED", "NEUTRAL", "HAPPY"]);

/**
 * Strict Zod validation schema for Claude's structured response
 */
export const aiAnalysisOutputSchema = z.object({
  category: AICategoryEnum,
  urgency: AIUrgencyEnum,
  sentiment: AISentimentEnum,
  summary: z.string().trim().min(5, "Summary must be at least 5 characters"),
  draftResponse: z.string().trim().min(10, "Draft response must be at least 10 characters"),
  confidence: z.number().min(0).max(1),
  tags: z.array(z.string().trim()).optional().default([]),
});

export type AIAnalysisOutput = z.infer<typeof aiAnalysisOutputSchema>;

/**
 * Input interaction to be analyzed by AI
 */
export interface AIAnalysisInput {
  ticketId?: string;
  customerName: string;
  customerEmail?: string | null;
  subject: string;
  content: string;
  source: Source;
}

/**
 * Input for regenerating only the response draft
 */
export interface AIRegenerateResponseInput {
  ticketId?: string;
  customerName: string;
  customerEmail?: string | null;
  subject: string;
  content: string;
  source: Source;
  category: Category;
  urgency: Urgency;
  sentiment?: Sentiment | null;
  tone?: "empathetic" | "formal" | "concise" | "technical";
  customInstructions?: string;
}

/**
 * Response for draft regeneration
 */
export interface AIRegenerateResponseOutput {
  draftResponse: string;
}
