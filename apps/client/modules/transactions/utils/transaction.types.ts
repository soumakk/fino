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
};
