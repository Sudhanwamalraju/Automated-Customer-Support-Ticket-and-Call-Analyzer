// ─── Core Enums ────────────────────────────────────────────────────────────────

export type TicketSource = "TICKET" | "CALL";
export type TicketStatus = "NEW" | "ANALYZED" | "IN_PROGRESS" | "RESOLVED";
export type TicketCategory =
  | "BILLING"
  | "TECHNICAL"
  | "ACCOUNT"
  | "GENERAL"
  | "OTHER";
export type TicketUrgency = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type TicketSentiment = "ANGRY" | "FRUSTRATED" | "NEUTRAL" | "HAPPY";

// ─── Domain Models ─────────────────────────────────────────────────────────────

export interface CallTranscript {
  id: string;
  ticketId: string;
  transcript: string;
  rawText?: string;
  duration?: number;
  callerPhone?: string;
  speakerCount?: number;
  agentName?: string;
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  content: string;
  source: TicketSource;
  status: TicketStatus;
  category?: TicketCategory;
  urgency?: TicketUrgency;
  sentiment?: TicketSentiment;
  summary?: string;
  draftResponse?: string;
  aiConfidence?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  callTranscript?: CallTranscript;
}

// ─── API Response Wrappers ─────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { message: string; code?: string } | string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── Ticket Query & Mutation Params ───────────────────────────────────────────

export interface TicketFilters {
  search?: string;
  category?: TicketCategory | "";
  urgency?: TicketUrgency | "";
  sentiment?: TicketSentiment | "";
  status?: TicketStatus | "";
  source?: TicketSource | "";
  sortBy?: "createdAt" | "urgency";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface CreateTicketPayload {
  customerName: string;
  customerEmail: string;
  subject: string;
  content: string;
  source: TicketSource;
}

export interface CreateCallPayload {
  customerName: string;
  customerEmail: string;
  subject: string;
  transcript: string;
  rawText?: string;
  duration?: number;
  callerPhone?: string;
}

export interface UpdateTicketPayload {
  status?: TicketStatus;
  draftResponse?: string;
  category?: TicketCategory;
  urgency?: TicketUrgency;
}

// ─── Dashboard / Analytics ────────────────────────────────────────────────────

export interface DashboardStats {
  totalTickets: number;
  newTickets: number;
  analyzedTickets: number;
  criticalTickets: number;
  highPriorityTickets: number;
  byCategory?: Record<string, number>;
  byUrgency?: Record<string, number>;
  bySentiment?: Record<string, number>;
  byStatus?: Record<string, number>;
  bySource?: Record<string, number>;
  categoryDistribution?: Record<string, number>;
  urgencyDistribution?: Record<string, number>;
  sentimentDistribution?: Record<string, number>;
  ticketSourceDistribution?: Record<string, number>;
}

// ─── Health Check ─────────────────────────────────────────────────────────────

export interface HealthCheck {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}
