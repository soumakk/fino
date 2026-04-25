"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/widgets/DateRangePicker";
import { MultiSelectDropdown } from "@/components/widgets/MultiSelectDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  CancelCircleIcon,
  FilterMailIcon,
  SearchIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { useCategories, useTransactions } from "../utils/transaction.query";
import {
  IFetchTransactionBody,
  ITransactionList,
  TransactionType,
} from "../utils/transaction.types";
import AddTransactionForm from "./AddTransactionForm";
import { DataTable } from "./DataTable";

export default function TransactionTable() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const reqBody: IFetchTransactionBody = {
    filters: {
      type: activeTab === "all" ? undefined : activeTab,
      category: selectedCategories?.length ? selectedCategories : undefined,
      date:
        dateRange !== undefined && dateRange?.from
          ? dateRange?.to && dateRange.from !== dateRange.to
            ? [dateRange.from.toISOString(), dateRange.to.toISOString()]
            : [dateRange.from.toISOString()]
          : undefined,
      search: debouncedSearch,
    },
  };
  const { data: transactions, isLoading } = useTransactions(reqBody);
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const columns: ColumnDef<ITransactionList>[] = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => <p>{formatDate(row.original.date)}</p>,
      },
      {
        accessorKey: "category.name",
        header: "Category",
        cell: ({ row }) => (
          <div>
            {row.original.category.icon} {row.original.category.name}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "amount",
        header: "Amout",
        cell: ({ row }) => (
          <p
            className={cn(
              row.original.type === TransactionType.EXPENSE
                ? "text-rose-500"
                : "text-emerald-500",
            )}
          >
            {row.original.type === TransactionType.EXPENSE ? "-" : "+"}{" "}
            {formatCurrency(Number(row.original.amount))}
          </p>
        ),
      },
    ],
    [],
  );

  return (
    <div>
      <div className="my-2 flex justify-between items-center ">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-[400px]"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value={TransactionType.EXPENSE}>Expense</TabsTrigger>
            <TabsTrigger value={TransactionType.INCOME}>Income</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Button variant="secondary" size="icon-sm">
            <HugeiconsIcon icon={FilterMailIcon} />
          </Button>
          <AddTransactionForm />
        </div>
      </div>

      <div className="flex items-center justify-start gap-3 mb-3">
        <Input
          startIcon={<HugeiconsIcon icon={SearchIcon} size={18} />}
          endIcon={
            searchQuery ? (
              <HugeiconsIcon
                icon={CancelCircleIcon}
                size={18}
                onClick={() => setSearchQuery("")}
                className="cursor-pointer"
              />
            ) : null
          }
          className="w-80"
          type="text"
          placeholder="Search transactions like 'Rent' or '500'"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <MultiSelectDropdown
          trigger={
            <>
              <span>Category</span>
            </>
          }
          options={
            categories?.map((c) => ({
              label: c.name,
              value: c.id,
              icon: c.icon,
            })) ?? []
          }
          title="status"
          selected={selectedCategories}
          onSelect={(selected) => setSelectedCategories(selected)}
          disabled={isCategoriesLoading}
        />

        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      <DataTable<ITransactionList>
        columns={columns}
        data={transactions}
        isLoading={isLoading}
      />
    </div>
  );
}
