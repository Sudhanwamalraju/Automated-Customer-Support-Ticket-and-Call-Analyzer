// ============================================================
// Analysis Service — High-level AI Workflow Orchestration
// ============================================================

import prisma from "../../lib/prisma";
import { requestClaudeAnalysis, requestClaudeRegeneration } from "./claude.service";
import type { TicketWithTranscript } from "../../types";
import { NotFoundError, BadRequestError } from "../../utils/errors";

/**
 * Complete AI Analysis workflow for a Ticket:
 * 1. Retrieve ticket from database.
 * 2. Validate ticket content.
 * 3. Send analysis request to Claude.
 * 4. Parse structured response.
 * 5. Validate AI output using Zod.
 * 6. Store: category, urgency, sentiment, summary, draftResponse, confidence.
 * 7. Mark ticket as ANALYZED.
 * 8. Return updated ticket.
 */
export async function analyzeTicketById(ticketId: string): Promise<TicketWithTranscript> {
  // Step 1: Retrieve ticket from database
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { callTranscript: true },
  });

  if (!ticket) {
    throw new NotFoundError(`Ticket with ID '${ticketId}' not found`);
  }

  // Step 2: Validate ticket content
  const content = ticket.content?.trim();
  if (!content || content.length < 5) {
    throw new BadRequestError("Ticket content is insufficient for AI analysis (minimum 5 characters required)");
  }

  // Step 3, 4, 5: Send request, parse, and validate via Claude service
  const aiOutput = await requestClaudeAnalysis({
    ticketId: ticket.id,
    customerName: ticket.customerName,
    customerEmail: ticket.customerEmail,
    subject: ticket.subject,
    content: ticket.content,
    source: ticket.source,
  });

  // Combine extracted tags
  const combinedTags = Array.from(new Set([...ticket.tags, ...(aiOutput.tags || [])]));

  // Step 6 & 7: Store structured AI output and mark ticket as ANALYZED
  const updatedTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      category: aiOutput.category,
      urgency: aiOutput.urgency,
      sentiment: aiOutput.sentiment,
      summary: aiOutput.summary,
      draftResponse: aiOutput.draftResponse,
      aiConfidence: aiOutput.confidence,
      tags: combinedTags,
      status: "ANALYZED",
    },
    include: { callTranscript: true },
  });

  // Step 8: Return updated ticket
  return updatedTicket;
}

/**
 * Regenerate ONLY the draft response while preserving the existing classification
 */
export async function regenerateTicketResponse(
  ticketId: string,
  options?: {
    tone?: "empathetic" | "formal" | "concise" | "technical";
    customInstructions?: string;
  }
): Promise<TicketWithTranscript> {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { callTranscript: true },
  });

  if (!ticket) {
    throw new NotFoundError(`Ticket with ID '${ticketId}' not found`);
  }

  const content = ticket.content?.trim();
  if (!content) {
    throw new BadRequestError("Ticket content is empty; cannot regenerate response");
  }

  // Regenerate response while preserving classification
  const newDraft = await requestClaudeRegeneration({
    ticketId: ticket.id,
    customerName: ticket.customerName,
    customerEmail: ticket.customerEmail,
    subject: ticket.subject,
    content: ticket.content,
    source: ticket.source,
    category: ticket.category,
    urgency: ticket.urgency,
    sentiment: ticket.sentiment,
    tone: options?.tone || "empathetic",
    customInstructions: options?.customInstructions,
  });

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      draftResponse: newDraft,
    },
    include: { callTranscript: true },
  });

  return updatedTicket;
}

/**
 * Analyze a Phone Call Transcript interaction using the same AI pipeline
 */
export async function analyzeCallById(callId: string): Promise<TicketWithTranscript> {
  const ticket = await prisma.ticket.findFirst({
    where: {
      OR: [{ id: callId }, { callTranscript: { id: callId } }],
    },
    include: { callTranscript: true },
  });

  if (!ticket || !ticket.callTranscript) {
    throw new NotFoundError(`Call interaction with ID '${callId}' not found`);
  }

  const rawTranscript = ticket.callTranscript.rawText?.trim();
  if (!rawTranscript || rawTranscript.length < 10) {
    throw new BadRequestError("Call transcript content is insufficient for AI analysis");
  }

  const aiOutput = await requestClaudeAnalysis({
    ticketId: ticket.id,
    customerName: ticket.customerName,
    customerEmail: ticket.customerEmail,
    subject: ticket.subject,
    content: rawTranscript,
    source: "CALL",
  });

  const combinedTags = Array.from(
    new Set([...ticket.tags, "call-analyzed", ...(aiOutput.tags || [])])
  );

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      category: aiOutput.category,
      urgency: aiOutput.urgency,
      sentiment: aiOutput.sentiment,
      summary: aiOutput.summary,
      draftResponse: aiOutput.draftResponse,
      aiConfidence: aiOutput.confidence,
      tags: combinedTags,
      status: "ANALYZED",
    },
    include: { callTranscript: true },
  });

  return updatedTicket;
}
