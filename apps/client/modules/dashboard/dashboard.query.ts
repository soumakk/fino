import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  IDashboardFilterReq,
  IDashboardSummary,
  IExpenseByCategoryRes,
  ITotalAmountByMonthRes,
} from "./dashboard.types";

export function useDashboardSummary(body: IDashboardFilterReq) {
  return useQuery({
    queryKey: ["dashboard-summary", body],
    queryFn: () =>
      api.post<IDashboardSummary, IDashboardFilterReq>(
        "/api/dashboard/summary",
        body,
      ),
    select: (data) => data.data,
  });
}

export function useTotalAmountByMonth(body: { year: string | null }) {
  return useQuery({
    queryKey: ["total-amount-by-month", body],
    queryFn: () =>
      api.post<ITotalAmountByMonthRes[]>(
        "/api/dashboard/total-amount-by-month",
        body,
      ),
    select: (data) => data.data,
  });
}

export function useExpenseByCategory(body: IDashboardFilterReq) {
  return useQuery({
    queryKey: ["expense-by-category", body],
    queryFn: () =>
      api.post<IExpenseByCategoryRes[], IDashboardFilterReq>(
        "/api/dashboard/expense-by-category",
        body,
      ),
    select: (data) => data.data,
  });
}
