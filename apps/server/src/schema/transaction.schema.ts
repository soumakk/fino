import z from "zod";

export const CreateTransactionSchema = z.object({
  description: z.string(),
  amount: z.number(),
  date: z.string(),
  type: z.string(),
  categoryId: z.string(),
});

export const TransactionFiltersSchema = z
  .object({
    type: z.enum(["EXPENSE", "INCOME"]).optional(),
    category: z.array(z.string()).optional(),
    date: z.array(z.string()).optional(),
    search: z.string().optional(),
    amount: z.array(z.number()).optional(),
  })
  .optional();
export type ITransactionFilters = z.infer<typeof TransactionFiltersSchema>;

export const TransactionSortSchema = z
  .object({
    path: z.enum(["date", "category", "amount"]).default("date"),
    direction: z.enum(["asc", "desc"]).default("desc"),
  })
  .optional();
export type ITransactionSort = z.infer<typeof TransactionSortSchema>;

export const FetchTransactionSchema = z
  .object({
    filters: TransactionFiltersSchema,
    sort: TransactionSortSchema,
  })
  .optional()
  .nullable();
