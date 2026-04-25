import { z } from "zod";

export interface ITransactionList {
  id: string;
  description: string;
  date: string;
  amount: string;
  type: string;
  userId: string;
  category: ICategoryList;
}

export interface ICategoryList {
  id: string;
  name: string;
  color: string;
  icon: string;
  type?: string;
  isDefault?: boolean;
}

export enum TransactionType {
  EXPENSE = "EXPENSE",
  INCOME = "INCOME",
}

export type IFetchTransactionBody = {
  filters?: {
    type?: string;
    category?: string[];
    search?: string;
    amount?: number[];
    date?: string[];
  };
  sort?: {
    path: string;
    direction: string;
  };
  page: number;
  limit: number;
};

export const addTransactionSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  date: z.string().datetime({ message: "Must be a valid ISO date string" }),
  type: z.enum(["EXPENSE", "INCOME"]),
  categoryId: z.string().min(1, "Category is required"),
});

// Pro-tip: You can delete your manual interface and just infer it from Zod
export type IAddTransactionBody = z.infer<typeof addTransactionSchema>;
