"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { TransactionType } from "@/modules/transactions/utils/transaction.types";
import { useTotalAmountByMonth } from "../dashboard.query";

export const description = "An interactive bar chart";
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const chartConfig = {
  expense: {
    label: "Expense",
    color: "var(--chart-2)",
  },
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function getLast10Years() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i < 5; i++) {
    years.push(currentYear - i);
  }
  return years;
}

export function AmountByMonthChart() {
  const [activeYear, setActiveYear] = React.useState<string | null>(
    new Date().getFullYear().toString(),
  );
  const { data: chartRes } = useTotalAmountByMonth({
    year: activeYear,
  });

  const yearOptions = React.useMemo(() => {
    return getLast10Years().map((y) => ({
      label: y.toString(),
      value: y.toString(),
    }));
  }, []);

  const chartData = monthNames?.map((month, idx) => ({
    month: month,
    expense: chartRes?.find(
      (d) => d.type === TransactionType.EXPENSE && Number(d.month) === idx + 1,
    )?.total,
    income: chartRes?.find(
      (d) => d.type === TransactionType.INCOME && Number(d.month) === idx + 1,
    )?.total,
  }));

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-center py-4! px-0! border-b sm:flex-row ">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Income vs expenses</CardTitle>
          <CardDescription>Monthly breakdown for {activeYear}</CardDescription>
        </div>

        <div className=" px-6 ">
          <Select value={activeYear} onValueChange={setActiveYear}>
            <SelectTrigger>
              Year
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {yearOptions?.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    <span>{item.label}</span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Bar dataKey="expense" fill={`var(--color-chart-2)`} radius={4} />
            <Bar dataKey="income" fill={`var(--color-chart-1)`} radius={4} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value, a) => {
                    return `${value} transactions`;
                  }}
                  valueFormatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
