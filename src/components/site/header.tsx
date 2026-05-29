"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Github, ShieldCheck } from "lucide-react";

import { opnChain } from "@/config/chains";

export function Header() {
  return (
    <header className="border-b border-border/70 bg-background/78 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <ShieldCheck className="h-4 w-4" />
            CodeX-Builder
          </div>
          <p className="mt-1 text-sm text-muted-foreground">OPN DeFi Safety Dashboard</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            href="https://github.com/maho0638/opn-defi-dashboard"
            rel="noreferrer"
            target="_blank"
          >
            <Github className="h-4 w-4" />
            Source
          </a>
          <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs text-muted-foreground">
            Chain ID {opnChain.id}
          </div>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>
    </header>
  );
}
