import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import { LabelIcon, Tag01Icon } from "@hugeicons/core-free-icons";

export function MultiSelectDropdown(props: {
  id?: string;
  selected: any[];
  onSelect: (selected: any[]) => void;
  options: { label: string; value: any; icon?: string }[];
  title: string;
  trigger?: React.ReactNode;
  hideSearch?: boolean;
  disabled?: boolean;
}) {
  const {
    id,
    options,
    title,
    selected,
    trigger,
    onSelect,
    hideSearch,
    disabled,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredOptions = options?.filter((opt) =>
    search ? opt.label?.toLowerCase().includes(search?.toLowerCase()) : true,
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            variant="secondary"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className="font-normal border border-border"
          >
            <HugeiconsIcon icon={Tag01Icon} data-icon="inline-start" />
            {trigger ?? <span className="capitalize">{title}</span>}
            {selected?.length ? (
              <Badge className="ml-1 text-xs h-4 w-4 p-0 grid place-content-center">
                {selected?.length}
              </Badge>
            ) : null}
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 gap-0" align="start">
        <Command shouldFilter={false}>
          {!hideSearch && (
            <CommandInput
              value={search}
              onValueChange={setSearch}
              placeholder={`Search ${title}`}
            />
          )}
          <CommandEmpty>No {title} found.</CommandEmpty>
          <CommandGroup className="max-h-[200px] overflow-auto">
            {filteredOptions?.map((opt) => (
              <CommandItem
                key={opt.value}
                value={opt.value}
                onSelect={() => {
                  const temp = new Set(selected);
                  if (temp.has(opt.value)) {
                    temp.delete(opt.value);
                  } else {
                    temp.add(opt.value);
                  }
                  onSelect(Array.from(temp));
                }}
                className="text-sm p-2"
              >
                <Checkbox
                  checked={selected?.includes(opt.value)}
                  className="mr-1"
                />

                {opt?.icon ? opt.icon : null}

                <span>{opt.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>

        {selected?.length ? (
          <div className="m-1">
            <Button
              variant="secondary"
              size="sm"
              className="w-full "
              onClick={() => {
                onSelect([]);
              }}
            >
              Clear
            </Button>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
}
