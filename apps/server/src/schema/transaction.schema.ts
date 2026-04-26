import z from "zod";

export const CreateTransactionSchema = z.object({
  description: z.string(),
  amount: z.number(),
  date: z.string(),
  type: z.string(),
  categoryId: z.string(),
  paymentMethod: z.string(),
});

export const TransactionFiltersSchema = z
  .object({
    type: z.enum(["EXPENSE", "INCOME"]).optional(),
    category: z.array(z.string()).optional(),
    date: z
      .object({
        from: z.iso.datetime().optional(),
        to: z.iso.datetime().optional(),
      })
      .optional(),
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
    page: z.number().default(1),
    limit: z.number().default(20),
  })
  .optional()
  .nullable();

export const TransactionType = {
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
};
export const PaymentMethod = {
  CASH: "CASH",
  CREDIT_CARD: "CREDIT_CARD",
  DEBIT_CARD: "DEBIT_CARD",
  UPI: "UPI",
  NET_BANKING: "NET_BANKING",
  WALLET: "WALLET",
  BANK_TRANSFER: "BANK_TRANSFER",
  CHEQUE: "CHEQUE",
  EMI: "EMI",
  CRYPTO: "CRYPTO",
  OTHER: "OTHER",
};
