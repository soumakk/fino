import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { IDashboardSummary } from "./dashboard.types";

export function useDashboardSummary(body = {}) {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => api.post<IDashboardSummary>("/api/dashboard/summary", body),
    select: (data) => data.data,
  });
}
