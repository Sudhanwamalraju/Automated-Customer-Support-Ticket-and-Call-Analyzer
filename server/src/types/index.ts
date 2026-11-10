// ============================================================
// Shared TypeScript types & interfaces — Server
// ============================================================

import type {
  Ticket,
  CallTranscript,
  Source,
  Status,
  Category,
  Urgency,
  Sentiment,
} from "@prisma/client";

// Re-export Prisma types so the rest of the app imports from one place
export type { Ticket, CallTranscript, Source, Status, Category, Urgency, Sentiment };

// ── Generic API envelope ─────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
  message?: string;
}

// ── Ticket with relations ────────────────────────────────────
export type TicketWithTranscript = Ticket & {
  callTranscript: CallTranscript | null;
};

// ── Service-layer input types ────────────────────────────────
export interface CreateTicketInput {
  customerName: string;
  customerEmail: string;
  subject: string;
  content: string;
  source?: Source;
  category?: Category;
  urgency?: Urgency;
}

export interface UpdateTicketInput {
  customerName?: string;
  customerEmail?: string;
  subject?: string;
  content?: string;
  status?: Status;
  category?: Category;
  urgency?: Urgency;
  sentiment?: Sentiment | null;
  summary?: string | null;
  draftResponse?: string | null;
  aiConfidence?: number | null;
  tags?: string[];
}

export interface CreateCallTranscriptInput {
  ticketId: string;
  rawText: string;
  duration?: number;
  speakerCount?: number;
  agentName?: string;
  keywords?: string[];
}

// ── Query / filter types ─────────────────────────────────────
export interface TicketFilters {
  status?: Status;
  category?: Category;
  urgency?: Urgency;
  sentiment?: Sentiment;
  source?: Source;
  search?: string;
  sortBy?: "createdAt" | "urgency";
  sortOrder?: "asc" | "desc";
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  items?: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── Dashboard Statistics Type ────────────────────────────────
export interface DashboardStats {
  totalTickets: number;
  newTickets: number;
  analyzedTickets: number;
  criticalTickets: number;
  highPriorityTickets: number;
  categoryDistribution: Record<Category, number>;
  sentimentDistribution: Record<Sentiment, number>;
  urgencyDistribution: Record<Urgency, number>;
  ticketSourceDistribution: Record<Source, number>;
  ticketStatusDistribution?: Record<Status, number>;
  byCategory?: Record<Category, number>;
  bySentiment?: Record<Sentiment, number>;
  byUrgency?: Record<Urgency, number>;
  bySource?: Record<Source, number>;
  byStatus?: Record<Status, number>;
}
