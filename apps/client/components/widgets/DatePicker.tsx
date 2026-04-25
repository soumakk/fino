"use client";

import * as React from "react";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // Assuming you have this utility from shadcn/base-ui
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            data-empty={!value}
            className={cn(
              "w-full rounded-xl justify-between text-left font-normal data-[empty=true]:text-muted-foreground",
              className,
            )}
          >
            {value ? (
              dayjs(value).format("MMM DD, YYYY")
            ) : (
              <span>Pick a date</span>
            )}
            <HugeiconsIcon icon={Calendar01Icon} data-icon="inline-end" />
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          defaultMonth={value}
        />
      </PopoverContent>
    </Popover>
  );
}
