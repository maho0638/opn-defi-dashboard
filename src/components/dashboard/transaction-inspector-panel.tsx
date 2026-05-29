"use client";

import { AlertTriangle, ClipboardCheck, Eraser, ScanSearch, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeRiskInput } from "@/lib/risk-engine";
import { cn } from "@/lib/utils";

const examples = [
  {
    label: "Unlimited approval",
    value:
      "0x095ea7b30000000000000000000000001234567890123456789012345678901234567890ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  },
  {
    label: "Bridge claim",
    value: "Claim reward from bridge contract. Approve spender before receiving airdrop."
  },
  {
    label: "RWA token",
    value: "TSLA RWA token contract address needs verification before swap."
  }
];

const levelColor = {
  Critical: "border-red-400/30 bg-red-400/10 text-red-100",
  High: "border-orange-300/30 bg-orange-300/10 text-orange-100",
  Medium: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  Low: "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
};

export function TransactionInspectorPanel() {
  const [input, setInput] = useState("");
  const result = useMemo(() => analyzeRiskInput(input), [input]);

  return (
    <Card className="border-primary/20 bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ScanSearch className="h-5 w-5 text-primary" />
          Transaction inspector
        </CardTitle>
        <CardDescription>Paste calldata, approval text, token address, or wallet popup text before signing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <textarea
          className="min-h-32 w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste suspicious wallet text, calldata, transaction hash, or token address..."
          value={input}
        />

        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <Button key={example.label} onClick={() => setInput(example.value)} size="sm" type="button" variant="outline">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              {example.label}
            </Button>
          ))}
          <Button onClick={() => setInput("")} size="sm" type="button" variant="secondary">
            <Eraser className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>

        <div className={cn("rounded-md border p-4", levelColor[result.level])}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Risk score</p>
              <p className="mt-1 text-2xl font-bold">{result.score}/100</p>
            </div>
            <div className="rounded-full border border-current/20 px-3 py-1 text-sm font-semibold">{result.level}</div>
          </div>
          <p className="mt-3 text-sm">{result.summary}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-border bg-background/60 p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Findings
            </p>
            <div className="space-y-2">
              {result.findings.map((finding) => (
                <p className="text-sm text-muted-foreground" key={finding}>
                  {finding}
                </p>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-border bg-background/60 p-4">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Required checks
            </p>
            <div className="space-y-2">
              {result.actions.map((action) => (
                <p className="text-sm text-muted-foreground" key={action}>
                  {action}
                </p>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
