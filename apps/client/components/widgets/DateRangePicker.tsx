"use client";

import * as React from "react";
import dayjs from "dayjs";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar01Icon, X } from "@hugeicons/core-free-icons";

interface DateRangePickerProps {
  value: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  return (
    <Popover>
      <div className="flex items-center gap-1">
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id="date-picker-range"
              className={`justify-start px-4 font-normal ${className || ""}`}
            >
              <HugeiconsIcon icon={Calendar01Icon} data-icon="inline-start" />
              {value?.from ? (
                value.to && value?.from !== value.to ? (
                  <>
                    {dayjs(value.from).format("MMM DD, YYYY")} -{" "}
                    {dayjs(value.to).format("MMM DD, YYYY")}
                  </>
                ) : (
                  dayjs(value.from).format("MMM DD, YYYY")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          }
        />
        {value?.from ? (
          <Button
            variant="secondary"
            size="icon-xs"
            className="border border-border"
            onClick={() => onChange(undefined)}
          >
            <HugeiconsIcon icon={X} />
          </Button>
        ) : null}
      </div>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
