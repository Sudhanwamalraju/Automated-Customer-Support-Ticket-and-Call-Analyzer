import { useMutation, useQueryClient } from "@tanstack/react-query";
import { callsApi } from "@/services/api";
import type { CreateCallPayload } from "@/types";
import { ticketKeys } from "./useTickets";

export function useCreateCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCallPayload) => callsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ticketKeys.lists() });
      qc.invalidateQueries({ queryKey: ticketKeys.dashboard() });
    },
  });
}
