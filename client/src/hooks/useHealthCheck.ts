import { useQuery } from "@tanstack/react-query";
import { healthApi } from "@/services/api";

export function useHealthCheck() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await healthApi.check();
      return (res as any).data ?? res;
    },
    refetchInterval: 30_000,
  });
}
