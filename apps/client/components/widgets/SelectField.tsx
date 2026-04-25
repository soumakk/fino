"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  label: string;
  value: string;
  icon?: string;
}

export interface SelectFieldProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SelectField({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled,
}: SelectFieldProps) {
  const selectedOption = options?.find((opt) => opt.value === value);
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn("w-full rounded-xl", className)}>
        {selectedOption
          ? `${selectedOption?.icon} ${selectedOption?.label}`
          : placeholder}
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              <div className="flex items-center gap-2">
                {item.icon && (
                  <span className="flex-shrink-0">{item.icon}</span>
                )}
                <span>{item.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
