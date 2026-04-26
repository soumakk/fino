"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DatePicker } from "@/components/widgets/DatePicker";
import { SelectField } from "@/components/widgets/SelectField";
import { TransactionTypeToggle } from "@/components/widgets/TransactionTypeToggle";
import {
  AddIcon,
  Lab,
  Loading,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useAddTransaction, useCategories } from "../utils/transaction.query";
import {
  addTransactionSchema,
  IAddTransactionBody,
  PaymentMethod,
  PaymentMethodList,
  TransactionType,
} from "../utils/transaction.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export default function AddTransactionForm() {
  const { data: categories } = useCategories();
  const { mutate: addTransactionFn, isPending } = useAddTransaction();

  const { handleSubmit, control, register, formState, reset } = useForm({
    defaultValues: {
      description: "",
      categoryId: "",
      type: TransactionType.EXPENSE,
      amount: "",
      date: new Date().toISOString(),
      paymentMethod: PaymentMethod.CASH,
    },
    resolver: zodResolver(addTransactionSchema),
  });

  const activeType = useWatch({ name: "type", control });
  const categoriesOptions = useMemo(() => {
    return (
      categories
        ?.filter((c) => c.type === activeType)
        ?.map((c) => ({
          label: c.name,
          value: c.id,
          icon: c.icon,
        })) ?? []
    );
  }, [activeType, categories]);

  const paymentMethodOptions = useMemo(() => {
    return Object.entries(PaymentMethodList).map(([key, value]) => ({
      value: key,
      label: value.label,
      icon: value.emoji,
    }));
  }, []);

  function onSubmit(values: IAddTransactionBody) {
    addTransactionFn(values, {
      onSuccess: () => {
        toast.success("Transaction added 🎉");
        reset();
      },
      onError: () => {
        toast.error("Failed to add transaction 😥");
      },
    });
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button>
            <HugeiconsIcon icon={AddIcon} data-icon="inline-start" />
            Add Transaction
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <TransactionTypeToggle
                onChange={(selected) => field.onChange(selected)}
              />
            )}
          />

          <Field>
            <Input
              type="text"
              placeholder="Cold coffee"
              {...register("description")}
            />
            <FieldError>{formState.errors.description?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field>
              <Input
                type="number"
                placeholder="100"
                startIcon="₹"
                {...register("amount")}
              />
              <FieldError>{formState.errors.amount?.message}</FieldError>
            </Field>

            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={new Date(field.value)}
                  onChange={(value) => field.onChange(value?.toISOString())}
                />
              )}
            />

            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <SelectField
                  value={field.value}
                  onChange={field.onChange}
                  options={categoriesOptions}
                  placeholder="Category"
                />
              )}
            />

            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <SelectField
                  value={field.value}
                  onChange={field.onChange}
                  options={paymentMethodOptions}
                  placeholder="Payment Method"
                />
              )}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />{" "}
                Hold on
              </>
            ) : (
              "Add"
            )}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
