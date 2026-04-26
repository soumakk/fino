import { z } from "zod";

export interface ITransactionList {
  id: string;
  description: string;
  date: string;
  amount: string;
  type: string;
  userId: string;
  category: ICategoryList;
  paymentMethod: PaymentMethod;
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

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  UPI = "UPI",
  NET_BANKING = "NET_BANKING",
  WALLET = "WALLET",
  BANK_TRANSFER = "BANK_TRANSFER",
  CHEQUE = "CHEQUE",
  EMI = "EMI",
  CRYPTO = "CRYPTO",
  OTHER = "OTHER",
}

export type IFetchTransactionBody = {
  filters?: {
    type?: string;
    category?: string[];
    search?: string;
    amount?: number[];
    date?: {
      from?: string;
      to?: string;
    };
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
  paymentMethod: z.enum(PaymentMethod),
});

export type IAddTransactionBody = z.infer<typeof addTransactionSchema>;

export const PaymentMethodList: Record<
  PaymentMethod,
  { label: string; emoji: string }
> = {
  [PaymentMethod.CASH]: { label: "Cash", emoji: "💵" },
  [PaymentMethod.CREDIT_CARD]: { label: "Credit card", emoji: "💳" },
  [PaymentMethod.DEBIT_CARD]: { label: "Debit card", emoji: "🏧" },
  [PaymentMethod.UPI]: { label: "UPI", emoji: "📱" },
  [PaymentMethod.NET_BANKING]: { label: "Net banking", emoji: "🏦" },
  [PaymentMethod.WALLET]: { label: "Wallet", emoji: "👛" },
  [PaymentMethod.BANK_TRANSFER]: { label: "Bank transfer", emoji: "🔁" },
  [PaymentMethod.CHEQUE]: { label: "Cheque", emoji: "📝" },
  [PaymentMethod.EMI]: { label: "EMI", emoji: "📅" },
  [PaymentMethod.CRYPTO]: { label: "Crypto", emoji: "🪙" },
  [PaymentMethod.OTHER]: { label: "Other", emoji: "💰" },
} as const;
