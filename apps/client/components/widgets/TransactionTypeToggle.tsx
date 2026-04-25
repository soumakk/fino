"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoneyReceiveFlowIcon,
  MoneyReceiveSquareIcon,
  MoneySendFlowIcon,
} from "@hugeicons/core-free-icons";
import { TransactionType } from "@/modules/transactions/utils/transaction.types";

// You can pass these in as props if you want it reusable!
const options = [
  {
    id: TransactionType.EXPENSE,
    name: "Expense",
    icon: MoneySendFlowIcon,
  },
  {
    id: TransactionType.INCOME,
    name: "Income",
    icon: MoneyReceiveFlowIcon,
  },
];

export function TransactionTypeToggle({
  onChange,
}: {
  onChange: (id: string) => void;
}) {
  const [active, setActive] = useState(TransactionType.EXPENSE);

  return (
    <div className="flex w-full items-center rounded-full bg-muted/50 p-1">
      {options?.map((option) => (
        <button
          type="button"
          key={option.id}
          onClick={() => {
            setActive(option.id);
            onChange?.(option.id);
          }}
          className={cn(
            "relative px-4 py-1.5 flex-1 text-sm font-medium transition-colors outline-none",
            active === option.id
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {/* The animated white pill background */}
          {active === option.id && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 z-0 rounded-full bg-primary/10"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}

          <div className="flex items-center gap-2 justify-center">
            <HugeiconsIcon
              icon={option.icon}
              className="relative z-10"
              size={20}
            />

            {/* The text needs to sit above the absolute positioned pill */}
            <span className="relative z-10">{option.name}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
