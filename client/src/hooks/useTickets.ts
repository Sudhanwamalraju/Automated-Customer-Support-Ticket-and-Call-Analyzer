import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ticketsApi, analyticsApi } from "@/services/api";
import type {
  TicketFilters,
  CreateTicketPayload,
  UpdateTicketPayload,
} from "@/types";

// ─── Query Keys ────────────────────────────────────────────────────────────────

export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (filters: TicketFilters) => [...ticketKeys.lists(), filters] as const,
  details: () => [...ticketKeys.all, "detail"] as const,
  detail: (id: string) => [...ticketKeys.details(), id] as const,
  dashboard: () => ["dashboard"] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useTickets(filters: TicketFilters = {}) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: async () => {
      const res = await ticketsApi.list(filters);
      return res.data!;
    },
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: async () => {
      const res = await ticketsApi.get(id);
      return res.data!;
    },
    enabled: Boolean(id),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ticketKeys.dashboard(),
    queryFn: async () => {
      const res = await analyticsApi.getDashboard();
      return res.data!;
    },
    staleTime: 2 * 60 * 1000,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useCreateTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTicketPayload) => ticketsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      qc.invalidateQueries({ queryKey: ticketKeys.dashboard() });
    },
  });
}

export function useUpdateTicket(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTicketPayload) =>
      ticketsApi.update(id, payload),
    onSuccess: (result) => {
      if (result.data) {
        qc.setQueryData(ticketKeys.detail(id), result.data);
      }
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      qc.invalidateQueries({ queryKey: ticketKeys.dashboard() });
    },
  });
}

export function useDeleteTicket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ticketsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      qc.invalidateQueries({ queryKey: ticketKeys.dashboard() });
    },
  });
}

export function useAnalyzeTicket(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => ticketsApi.analyze(id),
    onSuccess: (result) => {
      if (result.data) {
        qc.setQueryData(ticketKeys.detail(id), result.data);
      }
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      qc.invalidateQueries({ queryKey: ticketKeys.dashboard() });
    },
  });
}

export function useRegenerateResponse(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body?: { tone?: string; customInstructions?: string }) =>
      ticketsApi.regenerateResponse(id, body),
    onSuccess: (result) => {
      if (result.data) {
        qc.setQueryData(ticketKeys.detail(id), result.data);
      }
      qc.invalidateQueries({ queryKey: ticketKeys.detail(id) });
      qc.invalidateQueries({ queryKey: ticketKeys.lists() });
    },
  });
}
