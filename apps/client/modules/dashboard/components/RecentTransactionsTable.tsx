"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { DataTable } from "@/modules/transactions/components/DataTable";
import { useTransactions } from "@/modules/transactions/utils/transaction.query";
import {
  ITransactionList,
  PaymentMethodList,
  TransactionType,
} from "@/modules/transactions/utils/transaction.types";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { dashboardFilterAtom } from "../dashboard.utils";
import { useAtomValue } from "jotai";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight } from "@hugeicons/core-free-icons";
import Link from "next/link";

export default function RecentTransactionsTable() {
  const dateFilterRange = useAtomValue(dashboardFilterAtom);
  const { data: transactions, isLoading } = useTransactions({
    page: 1,
    limit: 10,
    filters: {
      date: {
        from: dateFilterRange?.from?.toISOString(),
        to: dateFilterRange?.to?.toISOString(),
      },
    },
  });

  const columns: ColumnDef<ITransactionList>[] = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => <p>{formatDate(row.original.date)}</p>,
      },
      {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ row }) => (
          <div>
            {row.original.category.icon} {row.original.category.name}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "paymentMethod",
        header: "Category",
        cell: ({ row }) => {
          const method = PaymentMethodList[row.original.paymentMethod];
          return (
            <div>
              {method.emoji} {method.label}
            </div>
          );
        },
      },
      {
        accessorKey: "amount",
        header: () => <p className="text-right">Amount</p>,
        cell: ({ row }) => (
          <p
            className={cn(
              "text-right",
              row.original.type === TransactionType.EXPENSE
                ? "text-rose-500"
                : "text-emerald-500",
            )}
          >
            {row.original.type === TransactionType.EXPENSE ? "-" : "+"}{" "}
            {formatCurrency(Number(row.original.amount))}
          </p>
        ),
      },
    ],
    [],
  );

  return (
    <Card className="flex flex-col col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Recent Transactions</CardTitle>
        {/*<CardDescription>January - June 2024</CardDescription>*/}
        <CardAction>
          <Link href="/transactions">
            <Button variant="link">
              View all
              <HugeiconsIcon icon={ArrowRight} />
            </Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <DataTable<ITransactionList>
          columns={columns}
          data={transactions?.data ?? []}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
