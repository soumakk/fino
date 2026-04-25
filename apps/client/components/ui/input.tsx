import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

function Input({ className, type, startIcon, endIcon, ...props }: InputProps) {
  return (
    <div className="relative" data-slot="input-wrapper">
      {startIcon && (
        <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground">
          {startIcon}
        </div>
      )}

      <InputPrimitive
        type={type}
        data-slot="input"
        className={cn(
          "h-9 w-full min-w-0 rounded-xl border border-input bg-input/30 px-3 py-1 text-base transition-colors outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          startIcon && "pl-9", // Add left padding if startIcon exists
          endIcon && "pr-9", // Add right padding if endIcon exists
          className,
        )}
        {...props}
      />

      {endIcon && (
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground">
          {endIcon}
        </div>
      )}
    </div>
  );
}

export { Input };
