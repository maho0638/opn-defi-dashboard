"use client";

import { ArrowDownUp, Info } from "lucide-react";
import { useMemo } from "react";
import { useAccount, useChainId } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { opnChain } from "@/config/chains";
import { useSwapStore } from "@/store/swap-store";

const MOCK_RATE = 2.4;

export function SwapInterface() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { flipTokens, fromAmount, fromToken, setFromAmount, toToken } = useSwapStore();
  const isWrongNetwork = isConnected && chainId !== opnChain.id;

  const estimatedOutput = useMemo(() => {
    const value = Number(fromAmount);
    if (!Number.isFinite(value) || value <= 0) return "";
    const output = fromToken === "OPN" ? value * MOCK_RATE : value / MOCK_RATE;
    return output.toLocaleString("en-US", { maximumFractionDigits: 6 });
  }, [fromAmount, fromToken]);

  return (
    <Card className="border-primary/20 bg-card/80">
      <CardHeader>
        <CardTitle>Swap</CardTitle>
        <CardDescription>UI-only swap preview. Router and execution will be added after contracts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TokenAmountInput label="From" token={fromToken} value={fromAmount} onChange={setFromAmount} />
        <div className="flex justify-center">
          <Button variant="secondary" size="icon" type="button" onClick={flipTokens} aria-label="Flip tokens">
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        <TokenAmountInput label="To" token={toToken} value={estimatedOutput} readOnly />
        <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          <div className="mb-1 flex items-center gap-2 font-medium text-foreground">
            <Info className="h-4 w-4 text-primary" />
            Mock quote
          </div>
          1 OPN = {MOCK_RATE} USDC. This quote is not executable.
        </div>
        <Button className="w-full" disabled={!isConnected || isWrongNetwork} type="button">
          {!isConnected ? "Connect wallet" : isWrongNetwork ? "Switch to OPN Chain" : "Preview swap"}
        </Button>
      </CardContent>
    </Card>
  );
}

function TokenAmountInput({
  label,
  onChange,
  readOnly,
  token,
  value
}: {
  label: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  token: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/70 p-4">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="mt-2 flex items-center gap-3">
        <Input
          inputMode="decimal"
          min="0"
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="0.00"
          readOnly={readOnly}
          type="number"
          value={value}
        />
        <div className="min-w-20 rounded-md border border-border bg-secondary px-3 py-2 text-center text-sm font-semibold">
          {token}
        </div>
      </div>
    </div>
  );
}
