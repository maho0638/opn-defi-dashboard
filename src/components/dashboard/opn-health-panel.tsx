"use client";

import { Activity, AlertTriangle, CheckCircle2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { opnChain } from "@/config/chains";
import { formatNumber } from "@/lib/utils";

type Health = {
  blockNumber?: number;
  chainId?: number;
  error?: string;
  gasGwei?: number;
  latencyMs?: number;
  ok: boolean;
  rpcUrl?: string;
};

export function OpnHealthPanel() {
  const [data, setData] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadHealth() {
    setLoading(true);
    try {
      const response = await fetch("/api/opn-health", { cache: "no-store" });
      setData((await response.json()) as Health);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadHealth();
  }, []);

  const chainOk = data?.chainId === opnChain.id;

  return (
    <Card className="border-primary/20 bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          OPN live health
        </CardTitle>
        <CardDescription>Direct RPC check for chain ID, block height, gas, and latency.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Metric label="Chain ID" value={data?.chainId ? String(data.chainId) : "-"} ok={chainOk} />
          <Metric label="Latest block" value={data?.blockNumber ? formatNumber(data.blockNumber, 0) : "-"} ok={data?.ok} />
          <Metric label="Gas" value={data?.gasGwei ? `${formatNumber(data.gasGwei, 4)} gwei` : "-"} ok={data?.ok} />
          <Metric label="Latency" value={data?.latencyMs ? `${data.latencyMs} ms` : "-"} ok={data?.ok} />
        </div>
        {data?.error ? (
          <p className="flex items-start gap-2 rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {data.error}
          </p>
        ) : null}
        <Button disabled={loading} onClick={loadHealth} type="button" variant="secondary">
          <RefreshCcw className="mr-2 h-4 w-4" />
          {loading ? "Checking..." : "Refresh RPC"}
        </Button>
      </CardContent>
    </Card>
  );
}

function Metric({ label, ok, value }: { label: string; ok?: boolean; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        {ok ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <AlertTriangle className="h-4 w-4 text-warning" />}
      </div>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
