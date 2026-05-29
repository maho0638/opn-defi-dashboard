"use client";

import { ArrowDownUp, CheckCircle2, Lock, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { useAccount, useChainId } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { opnChain } from "@/config/chains";

const MOCK_RATE = 2.4;

export function SwapSimulatorPanel() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [fromAmount, setFromAmount] = useState("");
  const [fromToken, setFromToken] = useState<"OPN" | "USDC">("OPN");

  const toToken = fromToken === "OPN" ? "USDC" : "OPN";
  const isCorrectNetwork = isConnected && chainId === opnChain.id;

  const estimatedOutput = useMemo(() => {
    const value = Number(fromAmount);
    if (!Number.isFinite(value) || value <= 0) return "";
    const output = fromToken === "OPN" ? value * MOCK_RATE : value / MOCK_RATE;
    return output.toLocaleString("en-US", { maximumFractionDigits: 6 });
  }, [fromAmount, fromToken]);

  return (
    <Card className="border-primary/20 bg-card/85">
      <CardHeader>
        <CardTitle>Swap simulator</CardTitle>
        <CardDescription>Preview flow only. Execution stays locked until real routing and simulation exist.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TokenInput label="From" token={fromToken} value={fromAmount} onChange={setFromAmount} />
        <div className="flex justify-center">
          <Button
            onClick={() => setFromToken((token) => (token === "OPN" ? "USDC" : "OPN"))}
            size="icon"
            type="button"
            variant="secondary"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
        <TokenInput label="To" readOnly token={toToken} value={estimatedOutput} />
        <div className="grid gap-2 sm:grid-cols-3">
          <Check active={isConnected} label="Wallet" />
          <Check active={isCorrectNetwork} label="Network" />
          <Check active={Boolean(estimatedOutput)} label="Amount" />
        </div>
        <Button className="w-full" disabled type="button">
          <Lock className="mr-2 h-4 w-4" />
          Execution locked
        </Button>
        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          Real swaps will require verified route source, token allowlist, slippage disclosure, and transaction simulation.
        </p>
      </CardContent>
    </Card>
  );
}

function TokenInput({
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
    <div className="rounded-md border border-border bg-background/60 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
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

function Check({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 p-3 text-xs">
      <CheckCircle2 className={active ? "h-4 w-4 text-primary" : "h-4 w-4 text-muted-foreground"} />
      <span>{label}</span>
    </div>
  );
}
