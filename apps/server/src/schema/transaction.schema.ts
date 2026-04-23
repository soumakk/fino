import z from "zod";

export const CreateTransactionSchema = z.object({
  description: z.string(),
  amount: z.number(),
  date: z.string(),
  type: z.string(),
  categoryId: z.string(),
});
