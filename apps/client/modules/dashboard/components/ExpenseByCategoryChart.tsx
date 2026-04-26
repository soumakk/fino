"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useExpenseByCategory } from "../dashboard.query";
import { formatCurrency } from "@/lib/utils";
import { dashboardFilterAtom } from "../dashboard.utils";
import { useAtom, useAtomValue } from "jotai";

export const description = "A donut chart with text";

const chartConfig = {} satisfies ChartConfig;

export function ExpenseByCategoryChart() {
  const dateFilterRange = useAtomValue(dashboardFilterAtom);

  const { data: chartRes } = useExpenseByCategory({
    from: dateFilterRange?.from?.toISOString(),
    to: dateFilterRange?.to?.toISOString(),
  });

  const chartData = chartRes?.map((c, idx) => ({
    category: `${c.icon} ${c.name}`,
    total: Number(c.total),
    // fill: `${c.color}CC`,
    fill: `var(--chart-${(idx % 5) + 1})`,
  }));

  const totalExpense =
    chartRes?.reduce((acc, item) => acc + Number(item.total), 0) ?? 0;

  console.log(chartData);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by category</CardTitle>
        <CardDescription>
          Your top expense categories this month
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  valueFormatter={(value) => formatCurrency(Number(value))}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="category"
              innerRadius={80}
              outerRadius={120}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {formatCurrency(totalExpense)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Expense
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      {/*<CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>*/}
    </Card>
  );
}
