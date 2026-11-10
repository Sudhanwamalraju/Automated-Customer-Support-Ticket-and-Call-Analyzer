import type {
  ApiResponse,
  PaginatedResponse,
  Ticket,
  TicketFilters,
  CreateTicketPayload,
  CreateCallPayload,
  UpdateTicketPayload,
  DashboardStats,
  HealthCheck,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// ─── Core Fetch Wrapper ────────────────────────────────────────────────────────

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const json = await response.json().catch(() => ({ success: false, error: "Unexpected response" }));

  if (!response.ok) {
    const errMsg =
      typeof json.error === "object"
        ? json.error?.message
        : json.error || `HTTP ${response.status}`;
    throw new Error(errMsg || `HTTP ${response.status}`);
  }

  return json as T;
}

// ─── Helper to build query string ─────────────────────────────────────────────

function buildQuery(params: Record<string, unknown>): string {
  const clean = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (clean.length === 0) return "";
  return "?" + new URLSearchParams(clean.map(([k, v]) => [k, String(v)])).toString();
}

// ─── Health ───────────────────────────────────────────────────────────────────

export const healthApi = {
  check: () => request<ApiResponse<HealthCheck>>("/health"),
};

// ─── Tickets ──────────────────────────────────────────────────────────────────

export const ticketsApi = {
  list: (filters: TicketFilters = {}) =>
    request<ApiResponse<PaginatedResponse<Ticket>>>(
      `/tickets${buildQuery(filters as Record<string, unknown>)}`
    ),

  get: (id: string) =>
    request<ApiResponse<Ticket>>(`/tickets/${id}`),

  create: (payload: CreateTicketPayload) =>
    request<ApiResponse<Ticket>>("/tickets", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: UpdateTicketPayload) =>
    request<ApiResponse<Ticket>>(`/tickets/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    request<ApiResponse<{ deleted: boolean }>>(`/tickets/${id}`, {
      method: "DELETE",
    }),

  analyze: (id: string) =>
    request<ApiResponse<Ticket>>(`/tickets/${id}/analyze`, {
      method: "POST",
    }),

  regenerateResponse: (id: string, body?: { tone?: string; customInstructions?: string }) =>
    request<ApiResponse<Ticket>>(`/tickets/${id}/regenerate-response`, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
};

// ─── Call Transcripts ─────────────────────────────────────────────────────────

export const callsApi = {
  create: (payload: CreateCallPayload) =>
    request<ApiResponse<Ticket>>("/calls", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  get: (id: string) =>
    request<ApiResponse<{ ticket: Ticket }>>(`/calls/${id}`),
};

// ─── Dashboard / Analytics ────────────────────────────────────────────────────

export const analyticsApi = {
  getDashboard: () =>
    request<ApiResponse<DashboardStats>>("/dashboard/stats"),
};
