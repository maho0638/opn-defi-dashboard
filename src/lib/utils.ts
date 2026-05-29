import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function compactAddress(value?: string) {
  if (!value) return "Not connected";
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

export function formatNumber(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(value);
}

export function formatBalance(value: number | string | bigint | undefined, maximumFractionDigits = 4) {
  if (value === undefined || value === null || value === "") return "0";
  const numberValue = typeof value === "bigint" ? Number(value) : Number(value);
  if (!Number.isFinite(numberValue)) return "0";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(numberValue);
}
