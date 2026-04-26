import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return dayjs(date).format("DD MMM, YYYY");
}

export function formatCurrency(amount?: number | string) {
  if (amount) {
    return Intl.NumberFormat("en-IN", {
      currency: "INR",
      style: "currency",
      maximumFractionDigits: 0,
    }).format(Number(amount));
  }
  return 0;
}
