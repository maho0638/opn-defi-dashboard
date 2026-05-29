import { AlertTriangle, BadgeCheck, ShieldAlert } from "lucide-react";
import { zeroAddress } from "viem";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OPN_TOKEN, USDC_TOKEN } from "@/config/tokens";

const tokens = [
  {
    address: "Native asset",
    label: "Native OPN asset",
    risk: "Low",
    status: "Allowed",
    symbol: OPN_TOKEN.symbol
  },
  {
    address: USDC_TOKEN.address,
    label: USDC_TOKEN.address && USDC_TOKEN.address !== zeroAddress ? "Configured ERC-20" : "Address missing",
    risk: USDC_TOKEN.address && USDC_TOKEN.address !== zeroAddress ? "Medium" : "Blocked",
    status: USDC_TOKEN.address && USDC_TOKEN.address !== zeroAddress ? "Review required" : "Disabled",
    symbol: USDC_TOKEN.symbol
  }
];

export function TokenAllowlistPanel() {
  return (
    <Card className="bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Token allowlist
        </CardTitle>
        <CardDescription>Assets are blocked unless they have a clear role and address state.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {tokens.map((token) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={token.symbol}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  {token.risk === "Low" ? (
                    <BadgeCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  )}
                  <p className="font-semibold">{token.symbol}</p>
                </div>
                <p className="mt-1 break-all text-xs text-muted-foreground">{token.address}</p>
              </div>
              <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs font-medium">
                {token.risk}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
              <span>{token.status}</span>
              <span>{token.label}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
