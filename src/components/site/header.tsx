"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Activity, ShieldCheck } from "lucide-react";

import { opnChain } from "@/config/chains";

export function Header() {
  return (
    <header className="border-b border-border/70 bg-background/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <Activity className="h-4 w-4" />
            CodeX-Builder
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">OPN Chain DeFi Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Wallet balances, a mock swap flow, and recent activity for OPN Chain builders.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Chain ID {opnChain.id}
          </div>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>
    </header>
  );
}
