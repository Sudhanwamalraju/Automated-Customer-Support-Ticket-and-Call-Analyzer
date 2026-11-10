// ============================================================
// CallTranscript Service — Prisma operations for CallTranscripts
// ============================================================

import prisma from "../lib/prisma";
import type { CreateCallTranscriptInput, TicketWithTranscript } from "../types";
import type { CallTranscript, Category, Urgency } from "@prisma/client";

export interface CreateCallInteractionInput {
  customerName: string;
  customerEmail: string;
  subject: string;
  rawText: string;
  duration?: number;
  speakerCount?: number;
  agentName?: string;
  category?: Category;
  urgency?: Urgency;
  keywords?: string[];
}

/** Helper to generate ticket number for calls */
async function generateCallTicketNumber(): Promise<string> {
  const today = new Date();
  const datePart = today
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const count = await prisma.ticket.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });

  const seq = String(count + 1).padStart(4, "0");
  return `CALL-${datePart}-${seq}`;
}

/** Create a full Call interaction (Ticket + CallTranscript) */
export async function createCallInteraction(
  input: CreateCallInteractionInput
): Promise<TicketWithTranscript> {
  const ticketNumber = await generateCallTicketNumber();

  return prisma.$transaction(async (tx) => {
    const ticket = await tx.ticket.create({
      data: {
        ticketNumber,
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        subject: input.subject,
        content: input.rawText,
        source: "CALL",
        status: "NEW",
        category: input.category ?? "GENERAL",
        urgency: input.urgency ?? "MEDIUM",
        tags: ["call-interaction", ...(input.keywords ?? [])],
      },
    });

    const transcript = await tx.callTranscript.create({
      data: {
        ticketId: ticket.id,
        rawText: input.rawText,
        duration: input.duration,
        speakerCount: input.speakerCount ?? 2,
        agentName: input.agentName,
        keywords: input.keywords ?? [],
      },
    });

    return {
      ...ticket,
      callTranscript: transcript,
    };
  });
}

/** Attach a new call transcript to an existing ticket */
export async function createCallTranscript(
  input: CreateCallTranscriptInput
): Promise<CallTranscript> {
  return prisma.callTranscript.create({
    data: {
      ticketId: input.ticketId,
      rawText: input.rawText,
      duration: input.duration,
      speakerCount: input.speakerCount,
      agentName: input.agentName,
      keywords: input.keywords ?? [],
    },
  });
}

/** Get the transcript for a specific ticket */
export async function getTranscriptByTicketId(
  ticketId: string
): Promise<CallTranscript | null> {
  return prisma.callTranscript.findUnique({
    where: { ticketId },
  });
}

/** Get call details by either transcript ID or ticket ID */
export async function getCallDetails(id: string): Promise<TicketWithTranscript | null> {
  // First attempt to find ticket by ID where source is CALL
  const ticket = await prisma.ticket.findFirst({
    where: {
      OR: [{ id }, { callTranscript: { id } }],
    },
    include: { callTranscript: true },
  });

  return ticket;
}

/** Update transcript metadata */
export async function updateCallTranscript(
  ticketId: string,
  data: Partial<
    Pick<CallTranscript, "duration" | "speakerCount" | "agentName" | "keywords" | "rawText">
  >
): Promise<CallTranscript> {
  return prisma.callTranscript.update({
    where: { ticketId },
    data,
  });
}

/** Delete transcript */
export async function deleteCallTranscript(ticketId: string): Promise<void> {
  await prisma.callTranscript.delete({ where: { ticketId } });
}
