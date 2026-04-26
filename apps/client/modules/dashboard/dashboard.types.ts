import { TransactionType } from "../transactions/utils/transaction.types";

export interface IDashboardSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface IDashboardFilterReq {
  from?: string;
  to?: string;
}

export interface ITotalAmountByMonthRes {
  month: string;
  total: string;
  type: TransactionType;
}

export interface IExpenseByCategoryRes {
  id: string;
  name: string;
  icon: string;
  color: string;
  total: string;
}
