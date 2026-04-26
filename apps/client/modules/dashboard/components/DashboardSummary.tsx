"use client";
import { HugeiconsIcon } from "@hugeicons/react";
import { useDashboardSummary } from "../dashboard.query";
import {
  ArrowDown02Icon,
  ArrowUp02Icon,
  MoneyReceiveSquareIcon,
  MoneySendSquareIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { dashboardFilterAtom } from "../dashboard.utils";
import { useAtomValue } from "jotai";

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

type CardProps = {
  label: string;
  amount: number;
  percentageChange: number;
  variant: "balance" | "income" | "expense";
};

const variantStyles = {
  balance: {
    bar: "#378ADD",
    iconBg: "#E6F1FB",
    amountColor: "var(--color-text-primary)",
  },
  income: {
    bar: "#1D9E75",
    iconBg: "#E1F5EE",
    amountColor: "#0F6E56",
  },
  expense: {
    bar: "#E24B4A",
    iconBg: "#FCEBEB",
    amountColor: "#A32D2D",
  },
};

function SummaryCard({ label, amount, percentageChange, variant }: CardProps) {
  const styles = variantStyles[variant];
  const isUp = percentageChange >= 0;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5">
      <div
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
        style={{ background: styles.bar }}
      />

      <div className="flex items-start gap-4">
        <div
          className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: styles.iconBg }}
        >
          {variant === "balance" && (
            <HugeiconsIcon icon={Wallet01Icon} size={16} color={styles.bar} />
          )}
          {variant === "income" && (
            <HugeiconsIcon
              icon={MoneyReceiveSquareIcon}
              size={16}
              color={styles.bar}
            />
          )}
          {variant === "expense" && (
            <HugeiconsIcon
              icon={MoneySendSquareIcon}
              size={16}
              color={styles.bar}
            />
          )}
        </div>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">{label}</p>
          <p
            className="mb-2.5 text-2xl font-medium tracking-tight"
            style={{ color: styles.amountColor }}
          >
            {formatAmount(amount)}
          </p>
          {/*<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium ${
                isUp ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {isUp ? (
                <HugeiconsIcon icon={ArrowUp02Icon} size={10} />
              ) : (
                <HugeiconsIcon icon={ArrowDown02Icon} size={10} />
              )}
              {Math.abs(percentageChange)}%
            </span>
            <span>vs last month</span>
          </div>*/}
        </div>
      </div>
    </div>
  );
}

export default function DashboardSummary() {
  const dateFilterRange = useAtomValue(dashboardFilterAtom);

  const { data: summary, isLoading } = useDashboardSummary({
    from: dateFilterRange?.from?.toISOString(),
    to: dateFilterRange?.to?.toISOString(),
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 ">
      <SummaryCard
        label="Total balance"
        amount={summary?.balance ?? 0}
        percentageChange={0}
        variant="balance"
      />
      <SummaryCard
        label="Total income"
        amount={summary?.income ?? 0}
        percentageChange={0}
        variant="income"
      />
      <SummaryCard
        label="Total expenses"
        amount={summary?.expense ?? 0}
        percentageChange={0}
        variant="expense"
      />
    </div>
  );
}
