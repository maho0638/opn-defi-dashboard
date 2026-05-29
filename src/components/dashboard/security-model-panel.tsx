import { AlertTriangle, LockKeyhole, ScanSearch, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const safeguards = [
  {
    icon: ShieldCheck,
    label: "Read-only first",
    text: "Balance, network, token, market, and API panels do not request token approvals."
  },
  {
    icon: ScanSearch,
    label: "Inspect before signing",
    text: "Users can paste calldata, hash, address, or wallet text into the inspector before approving anything."
  },
  {
    icon: AlertTriangle,
    label: "Risk labels",
    text: "Unknown tokens, placeholder addresses, approval patterns, permit signatures, and bridges are flagged."
  },
  {
    icon: LockKeyhole,
    label: "No custody",
    text: "The dashboard never asks for seed phrases, private keys, or direct fund custody."
  }
];

const riskRules = [
  "Block swaps when the connected chain is not OPN Chain.",
  "Block token actions without an allowlist entry or verified address.",
  "Warn before unlimited approval, permit, or setApprovalForAll patterns.",
  "Show testnet/mainnet state clearly before any signing action.",
  "Keep execution disabled while quote data is simulated or stale.",
  "Keep stocks and RWA data read-only until licensed data and verified contracts exist."
];

export function SecurityModelPanel() {
  return (
    <Card className="border-primary/20 bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LockKeyhole className="h-5 w-5 text-primary" />
          Security model
        </CardTitle>
        <CardDescription>Professional DeFi UX starts by preventing unsafe actions by default.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {safeguards.map((item) => {
            const Icon = item.icon;
            return (
              <div className="rounded-md border border-border bg-background/60 p-4" key={item.label}>
                <div className="flex items-center gap-2 font-semibold">
                  <Icon className="h-4 w-4 text-primary" />
                  {item.label}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            );
          })}
        </div>
        <div className="rounded-md border border-border bg-muted/30 p-4">
          <p className="mb-3 text-sm font-semibold">Risk engine rules</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {riskRules.map((rule) => (
              <div className="flex items-start gap-2 text-sm text-muted-foreground" key={rule}>
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
