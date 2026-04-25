import { api } from "@/lib/api";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  IAddTransactionBody,
  ICategoryList,
  IFetchTransactionBody,
  ITransactionList,
} from "./transaction.types";

export const QueryKeys = {
  transactionsList: "transactions",
  categoriesList: "categories",
};

export function useTransactions(body: IFetchTransactionBody) {
  return useQuery({
    queryKey: [QueryKeys.transactionsList, body],
    queryFn: () =>
      api.post<ITransactionList[], IFetchTransactionBody>(
        "/api/transactions",
        body,
      ),
    select: (data) => data.data,
    placeholderData: keepPreviousData,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: [QueryKeys.categoriesList],
    queryFn: () => api.get<ICategoryList[]>("/api/categories"),
    select: (data) => data.data,
  });
}

export function useAddTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: IAddTransactionBody) =>
      api.post("/api/transactions/create", body),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.transactionsList],
      });
      // queryClient.setQueryData([QureryKeys.transactionsList], (prev) => {
      //   console.log(prev);
      // });
    },
  });
}
