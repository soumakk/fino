"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useState } from "react";
import { dashboardFilterAtom } from "../dashboard.utils";

const filterOptions = [
  {
    id: "this-month",
    name: "This month",
    onSelect: () => ({
      from: dayjs().startOf("month").toDate(),
      to: dayjs().toDate(),
    }),
  },
  {
    id: "last-month",
    name: "Last month",
    onSelect: () => ({
      from: dayjs().subtract(1, "month").startOf("month").toDate(),
      to: dayjs().subtract(1, "month").endOf("month").toDate(),
    }),
  },
  {
    id: "last-6-month",
    name: "Last 6 months",
    onSelect: () => ({
      from: dayjs().subtract(6, "month").startOf("month").toDate(),
      to: dayjs().toDate(),
    }),
  },
  {
    id: "this-year",
    name: "This year",
    onSelect: () => ({
      from: dayjs().startOf("year").toDate(),
      to: dayjs().toDate(),
    }),
  },
  {
    id: "last-year",
    name: "Last year",
    onSelect: () => ({
      from: dayjs().subtract(1, "year").startOf("year").toDate(),
      to: dayjs().subtract(1, "year").endOf("year").toDate(),
    }),
  },
];

export default function DashboardDateFilter() {
  const [range, setRange] = useAtom(dashboardFilterAtom);
  const [selected, setSelected] = useState<string | null>("this-month");

  return (
    <Select value={selected} onValueChange={setSelected}>
      <div className="flex items-center gap-1">
        <SelectTrigger
          render={
            <Button
              variant="outline"
              id="date-picker-range"
              className={`justify-start px-4 font-normal`}
            >
              <HugeiconsIcon icon={Calendar01Icon} data-icon="inline-start" />
              {filterOptions?.find((f) => f.id === selected)?.name ?? ""}
              {/*{range?.from ? (
                range.to && range?.from !== range.to ? (
                  <>
                    {dayjs(range.from).format("MMM DD, YYYY")} -{" "}
                    {dayjs(range.to).format("MMM DD, YYYY")}
                  </>
                ) : (
                  dayjs(range.from).format("MMM DD, YYYY")
                )
              ) : (
                <span>Pick a date</span>
              )}*/}
            </Button>
          }
        />
      </div>

      <SelectContent align="start">
        <SelectGroup>
          {filterOptions?.map((filter) => (
            <SelectItem
              value={filter.id}
              key={filter.name}
              onClick={() => {
                setRange(filter.onSelect());
              }}
            >
              {filter.name}
            </SelectItem>
          ))}
        </SelectGroup>
        {/*<Calendar
          mode="range"
          defaultMonth={range?.from}
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          captionLayout="dropdown"
        />*/}
      </SelectContent>
    </Select>
  );
}
