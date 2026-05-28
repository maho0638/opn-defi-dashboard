"use client";

import { AlertCircle, Coins } from "lucide-react";
import { erc20Abi, formatUnits, zeroAddress } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { opnChain } from "@/config/chains";
import { USDC_TOKEN } from "@/config/tokens";
import { formatBalance } from "@/lib/utils";

export function BalanceCard() {
  const { address, isConnected } = useAccount();
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

  const usdcFormatted =
    typeof usdcBalance.data === "bigint" ? `${formatUnits(usdcBalance.data, USDC_TOKEN.decimals)} USDC` : "0 USDC";

  return (
    <Card className="border-primary/20 bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-primary" />
          Balances
        </CardTitle>
        <CardDescription>Native OPN and configured USDC balance for the connected wallet.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isConnected ? (
          <div className="rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            Connect a wallet to read balances.
          </div>
        ) : (
          <>
            <BalanceRow
              error={nativeBalance.error?.message}
              isLoading={nativeBalance.isLoading}
              label="OPN"
              value={formatBalance(nativeBalance.data?.formatted, nativeBalance.data?.symbol || "OPN")}
            />
            <BalanceRow
              error={
                shouldReadUsdc
                  ? usdcBalance.error?.message
                  : "USDC address is a placeholder. Update NEXT_PUBLIC_OPN_USDC_ADDRESS."
              }
              isLoading={usdcBalance.isLoading}
              label="USDC"
              value={usdcFormatted}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}

function BalanceRow({
  error,
  isLoading,
  label,
  value
}: {
  error?: string;
  isLoading?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/70 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-muted-foreground">{label}</span>
        <strong className="text-lg">{isLoading ? "Loading..." : value}</strong>
      </div>
      {error ? (
        <div className="mt-2 flex items-start gap-2 text-xs text-amber-300">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-2">{error}</span>
        </div>
      ) : null}
    </div>
  );
}
