"use client";

import { Database, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

type Snapshot = {
  chainsTracked: number;
  ok: boolean;
  source: string;
  topChains: Array<{ name: string; symbol: string; tvl: number }>;
  totalTvl: number;
};

export function DeFiPulsePanel() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/defi-snapshot", { cache: "no-store" });
      setData((await response.json()) as Snapshot);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <Card className="bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          DeFi pulse
        </CardTitle>
        <CardDescription>Free DeFiLlama public API snapshot for market context.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">Tracked chains</p>
            <p className="mt-2 text-2xl font-semibold">{data ? formatNumber(data.chainsTracked, 0) : "-"}</p>
          </div>
          <div className="rounded-md border border-border bg-background/60 p-4">
            <p className="text-sm text-muted-foreground">Total TVL</p>
            <p className="mt-2 text-2xl font-semibold">
              {data ? `$${formatNumber(data.totalTvl / 1_000_000_000, 2)}B` : "-"}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {(data?.topChains || []).map((chain) => (
            <div className="flex items-center justify-between rounded-md border border-border bg-background/60 p-3" key={chain.name}>
              <span className="font-medium">{chain.name}</span>
              <span className="text-sm text-muted-foreground">${formatNumber(chain.tvl / 1_000_000_000, 2)}B</span>
            </div>
          ))}
        </div>
        <Button disabled={loading} onClick={load} type="button" variant="secondary">
          <RefreshCcw className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Refresh DeFi data"}
        </Button>
      </CardContent>
    </Card>
  );
}
