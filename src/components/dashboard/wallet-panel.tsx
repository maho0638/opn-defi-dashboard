"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AlertTriangle, CheckCircle2, Circle, Gauge, Wallet } from "lucide-react";
import { erc20Abi, formatUnits, zeroAddress } from "viem";
import { useMemo, useState } from "react";
import { useAccount, useBalance, useChainId, useReadContract, useSwitchChain } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { opnChain } from "@/config/chains";
import { USDC_TOKEN } from "@/config/tokens";
import { cn, compactAddress, formatBalance } from "@/lib/utils";

const manualChecks = [
  "Official URL verified",
  "Contract address checked",
  "Spender and amount reviewed",
  "Wallet popup text understood",
  "Ready to reject unclear prompts"
];

export function WalletPanel() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const nativeBalance = useBalance({
    address,
    chainId: opnChain.id,
    query: { enabled: Boolean(address) }
  });

  const shouldReadUsdc = Boolean(address && USDC_TOKEN.address && USDC_TOKEN.address !== zeroAddress);
  const usdcBalance = useReadContract({
    address: USDC_TOKEN.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: opnChain.id,
    query: { enabled: shouldReadUsdc }
  });

  const score = useMemo(() => {
    const wallet = isConnected ? 25 : 0;
    const network = isConnected && chainId === opnChain.id ? 25 : 0;
    const checklist = Object.values(checked).filter(Boolean).length * 10;
    return Math.min(100, wallet + network + checklist);
  }, [chainId, checked, isConnected]);

  const readiness = score >= 80 ? "Ready" : score >= 50 ? "Review" : "Unsafe";
  const usdcFormatted =
    typeof usdcBalance.data === "bigint" ? `${formatUnits(usdcBalance.data, USDC_TOKEN.decimals)} USDC` : "0 USDC";

  return (
    <Card className="border-primary/20 bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet safety
        </CardTitle>
        <CardDescription>Connection, network, balances, and manual pre-signing readiness.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 rounded-md border border-border bg-background/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Connected wallet</p>
            <p className="mt-1 font-semibold">{compactAddress(address)}</p>
          </div>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="OPN balance" value={formatBalance(nativeBalance.data?.formatted, nativeBalance.data?.symbol || "OPN")} />
          <Metric label="USDC balance" value={shouldReadUsdc ? usdcFormatted : "Address disabled"} />
          <Metric label="Chain" value={isConnected ? String(chainId) : "None"} />
        </div>

        {isConnected && chainId !== opnChain.id ? (
          <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-4">
            <div className="flex items-start gap-2 text-sm text-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Wrong network. Expected OPN Chain Testnet ID {opnChain.id}.
            </div>
            <Button className="mt-3" disabled={isPending} onClick={() => switchChain({ chainId: opnChain.id })} type="button">
              {isPending ? "Switching..." : "Switch to OPN"}
            </Button>
          </div>
        ) : null}

        <div className="rounded-md border border-border bg-background/60 p-4">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="h-4 w-4" />
                Signing readiness
              </p>
              <p className="mt-1 text-4xl font-bold">{score}</p>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-sm font-semibold",
                readiness === "Ready"
                  ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
                  : readiness === "Review"
                    ? "border-amber-300/30 bg-amber-300/10 text-amber-100"
                    : "border-red-400/30 bg-red-400/10 text-red-100"
              )}
            >
              {readiness}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {manualChecks.map((item) => {
            const active = Boolean(checked[item]);
            return (
              <button
                className="flex w-full items-start gap-3 rounded-md border border-border bg-background/60 p-3 text-left text-sm transition-colors hover:bg-muted/40"
                key={item}
                onClick={() => setChecked((state) => ({ ...state, [item]: !active }))}
                type="button"
              >
                {active ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className={active ? "text-foreground" : "text-muted-foreground"}>{item}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
