import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  ICategoryList,
  IFetchTransactionBody,
  ITransactionList,
} from "./transaction.types";

export const QureryKeys = {
  transactionsList: "transactions",
  categoriesList: "categories",
};

export function useTransactions(body: IFetchTransactionBody) {
  return useQuery({
    queryKey: [QureryKeys.transactionsList, body],
    queryFn: () =>
      api.post<ITransactionList[], IFetchTransactionBody>(
        "/api/transactions",
        body,
      ),
    select: (data) => data.data,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [QureryKeys.categoriesList],
    queryFn: () => api.get<ICategoryList[]>("/api/categories"),
    select: (data) => data.data,
  });
}
