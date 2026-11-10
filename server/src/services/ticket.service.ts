// ============================================================
// Ticket Service — all Prisma operations for Ticket model
// Controllers delegate to this service instead of calling
// Prisma directly.
// ============================================================

import prisma from "../lib/prisma";
import type {
  CreateTicketInput,
  UpdateTicketInput,
  TicketFilters,
  PaginationParams,
  PaginatedResult,
  TicketWithTranscript,
  DashboardStats,
} from "../types";
import type { Prisma, Category, Urgency, Sentiment, Source, Status } from "@prisma/client";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

/** Generate a human-readable ticket number e.g. TKT-20260929-0001 */
async function generateTicketNumber(): Promise<string> {
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
  return `TKT-${datePart}-${seq}`;
}

// ─────────────────────────────────────────────────────────────
// READ
// ─────────────────────────────────────────────────────────────

/** Get all tickets with optional filtering, search, sorting, and pagination */
export async function getTickets(
  filters: TicketFilters = {},
  pagination: PaginationParams = {}
): Promise<PaginatedResult<TicketWithTranscript>> {
  const { status, category, urgency, sentiment, source, search, sortBy, sortOrder } = filters;
  const page = Math.max(1, pagination.page ?? 1);
  const limit = Math.min(100, Math.max(1, pagination.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.TicketWhereInput = {
    ...(status && { status }),
    ...(category && { category }),
    ...(urgency && { urgency }),
    ...(sentiment && { sentiment }),
    ...(source && { source }),
    ...(search && {
      OR: [
        { subject: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { ticketNumber: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const direction = sortOrder === "asc" ? "asc" : "desc";
  let orderBy: Prisma.TicketOrderByWithRelationInput[];

  if (sortBy === "urgency") {
    orderBy = [{ urgency: direction }, { createdAt: "desc" }];
  } else {
    orderBy = [{ createdAt: direction }, { urgency: "desc" }];
  }

  const [data, total] = await prisma.$transaction([
    prisma.ticket.findMany({
      where,
      include: { callTranscript: true },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.ticket.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  return {
    items: data,
    data,
    total,
    page,
    limit,
    totalPages,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}

/** Get a single ticket by its cuid */
export async function getTicketById(
  id: string
): Promise<TicketWithTranscript | null> {
  return prisma.ticket.findUnique({
    where: { id },
    include: { callTranscript: true },
  });
}

/** Get a ticket by its human-readable ticketNumber */
export async function getTicketByNumber(
  ticketNumber: string
): Promise<TicketWithTranscript | null> {
  return prisma.ticket.findUnique({
    where: { ticketNumber },
    include: { callTranscript: true },
  });
}

// ─────────────────────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────────────────────

/** Create a new ticket */
export async function createTicket(
  input: CreateTicketInput
): Promise<TicketWithTranscript> {
  const ticketNumber = await generateTicketNumber();

  return prisma.ticket.create({
    data: {
      ticketNumber,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      subject: input.subject,
      content: input.content,
      source: input.source ?? "TICKET",
      category: input.category ?? "GENERAL",
      urgency: input.urgency ?? "MEDIUM",
      status: "NEW",
      tags: [],
    },
    include: { callTranscript: true },
  });
}

// ─────────────────────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────────────────────

/** Update ticket fields (used by AI analysis, manual edits, and status changes) */
export async function updateTicket(
  id: string,
  input: UpdateTicketInput
): Promise<TicketWithTranscript> {
  return prisma.ticket.update({
    where: { id },
    data: {
      ...(input.customerName !== undefined && { customerName: input.customerName }),
      ...(input.customerEmail !== undefined && { customerEmail: input.customerEmail }),
      ...(input.subject !== undefined && { subject: input.subject }),
      ...(input.content !== undefined && { content: input.content }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.urgency !== undefined && { urgency: input.urgency }),
      ...(input.sentiment !== undefined && { sentiment: input.sentiment }),
      ...(input.summary !== undefined && { summary: input.summary }),
      ...(input.draftResponse !== undefined && {
        draftResponse: input.draftResponse,
      }),
      ...(input.aiConfidence !== undefined && {
        aiConfidence: input.aiConfidence,
      }),
      ...(input.tags !== undefined && { tags: input.tags }),
    },
    include: { callTranscript: true },
  });
}

// ─────────────────────────────────────────────────────────────
// DELETE
// ─────────────────────────────────────────────────────────────

/** Permanently delete a ticket (and its transcript via cascade) */
export async function deleteTicket(id: string): Promise<void> {
  await prisma.ticket.delete({ where: { id } });
}

// ─────────────────────────────────────────────────────────────
// ANALYTICS & DASHBOARD
// ─────────────────────────────────────────────────────────────

/** Aggregate metrics for the dashboard */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalTickets,
    newTickets,
    analyzedTickets,
    criticalTickets,
    highPriorityTickets,
    byCategory,
    bySentiment,
    byUrgency,
    bySource,
    byStatus,
  ] = await prisma.$transaction([
    // Total count
    prisma.ticket.count(),
    // Status counts
    prisma.ticket.count({ where: { status: "NEW" } }),
    prisma.ticket.count({ where: { status: "ANALYZED" } }),
    // Urgency counts
    prisma.ticket.count({ where: { urgency: "CRITICAL" } }),
    prisma.ticket.count({ where: { urgency: "HIGH" } }),
    // Groupings
    prisma.ticket.groupBy({
      by: ["category"],
      _count: { _all: true },
      orderBy: { category: "asc" },
    }),
    prisma.ticket.groupBy({
      by: ["sentiment"],
      _count: { _all: true },
      orderBy: { sentiment: "asc" },
    }),
    prisma.ticket.groupBy({
      by: ["urgency"],
      _count: { _all: true },
      orderBy: { urgency: "asc" },
    }),
    prisma.ticket.groupBy({
      by: ["source"],
      _count: { _all: true },
      orderBy: { source: "asc" },
    }),
    prisma.ticket.groupBy({
      by: ["status"],
      _count: { _all: true },
      orderBy: { status: "asc" },
    }),
  ]);

  // Transform group results into clean key-value records
  const getCount = (item: unknown): number => {
    return (item as { _count?: { _all?: number } })?._count?._all ?? 0;
  };

  const categoryDistribution: Record<Category, number> = {
    BILLING: 0,
    TECHNICAL: 0,
    ACCOUNT: 0,
    GENERAL: 0,
    OTHER: 0,
  };
  byCategory.forEach((item) => {
    categoryDistribution[item.category] = getCount(item);
  });

  const sentimentDistribution: Record<Sentiment, number> = {
    ANGRY: 0,
    FRUSTRATED: 0,
    NEUTRAL: 0,
    HAPPY: 0,
  };
  bySentiment.forEach((item) => {
    if (item.sentiment) {
      sentimentDistribution[item.sentiment] = getCount(item);
    }
  });

  const urgencyDistribution: Record<Urgency, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0,
  };
  byUrgency.forEach((item) => {
    urgencyDistribution[item.urgency] = getCount(item);
  });

  const ticketSourceDistribution: Record<Source, number> = {
    TICKET: 0,
    CALL: 0,
  };
  bySource.forEach((item) => {
    ticketSourceDistribution[item.source] = getCount(item);
  });

  const statusDistribution: Record<Status, number> = {
    NEW: 0,
    ANALYZED: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
  };
  byStatus.forEach((item) => {
    statusDistribution[item.status] = getCount(item);
  });

  return {
    totalTickets,
    newTickets,
    analyzedTickets,
    criticalTickets,
    highPriorityTickets,
    categoryDistribution,
    sentimentDistribution,
    urgencyDistribution,
    ticketSourceDistribution,
    ticketStatusDistribution: statusDistribution,
    byCategory: categoryDistribution,
    bySentiment: sentimentDistribution,
    byUrgency: urgencyDistribution,
    bySource: ticketSourceDistribution,
    byStatus: statusDistribution,
  };
}
