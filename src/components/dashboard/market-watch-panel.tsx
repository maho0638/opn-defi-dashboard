"use client";

import { BarChart3, Lock, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

type Asset = {
  changePercent: number | null;
  close: number | null;
  status: string;
  symbol: string;
  volume: number | null;
};

export function MarketWatchPanel() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/market-watch", { cache: "no-store" });
      const payload = (await response.json()) as { assets: Asset[] };
      setAssets(payload.assets);
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
          <BarChart3 className="h-5 w-5 text-primary" />
          RWA and market watch
        </CardTitle>
        <CardDescription>Read-only Stooq public CSV watchlist for TSLA, NVDA, AAPL, COIN, MSTR, and GLD.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <div className="rounded-md border border-border bg-background/60 p-4" key={asset.symbol}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{asset.symbol}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {asset.close ? `$${formatNumber(asset.close, 2)}` : "No quote"}
                  </p>
                </div>
                <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs">
                  {asset.changePercent === null ? "-" : `${formatNumber(asset.changePercent, 2)}%`}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-primary" />
                  {asset.status}
                </span>
                <span>{asset.volume ? formatNumber(asset.volume, 0) : "Volume N/A"}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">
          This is not a trading venue and not investment advice. Any future tokenized stock/RWA support must use licensed
          data, verified contracts, and clear jurisdiction limits.
        </p>
        <Button disabled={loading} onClick={load} type="button" variant="secondary">
          <RefreshCcw className="mr-2 h-4 w-4" />
          {loading ? "Loading..." : "Refresh market data"}
        </Button>
      </CardContent>
    </Card>
  );
}
