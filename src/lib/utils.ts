import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBalance(value?: string, symbol?: string) {
  if (!value) return `0.0000 ${symbol ?? ""}`.trim();

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return `${value} ${symbol ?? ""}`.trim();

  return `${numeric.toLocaleString("en-US", {
    maximumFractionDigits: numeric >= 1 ? 4 : 6
  })} ${symbol ?? ""}`.trim();
}
