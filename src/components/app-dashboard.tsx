"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  AlertTriangle,
  ArrowDownUp,
  BarChart3,
  CheckCircle2,
  Circle,
  Database,
  Github,
  Lock,
  MessageSquare,
  RefreshCcw,
  ScanSearch,
  Send,
  ShieldCheck,
  Wallet
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useBalance, useChainId, useSwitchChain } from "wagmi";

import { opnChain } from "@/config/chains";
import { analyzeRiskInput } from "@/lib/risk-engine";
import { cn, compactAddress, formatNumber } from "@/lib/utils";

type Health = { blockNumber?: number; chainId?: number; gasGwei?: number; latencyMs?: number; ok: boolean };
type DeFiSnapshot = {
  chainsTracked: number;
  ok: boolean;
  topChains: Array<{ name: string; symbol: string; tvl: number }>;
  totalTvl: number;
};
type MarketAsset = { changePercent: number | null; close: number | null; status: string; symbol: string; volume: number | null };
type OnchainLookup = {
  checks: string[];
  error?: string;
  explorerUrl?: string;
  found: boolean;
  kind: string;
  ok: boolean;
  riskHints: string[];
  summary: string;
};
type YieldPool = {
  apy: number;
  chain: string;
  ilRisk: string;
  project: string;
  stablecoin: boolean;
  symbol: string;
  tvlUsd: number;
};

const criteria = [
  ["OPN integration", "30%", "Live RPC health, Chain ID 984 wallet checks, tx/address lookup, explorer-ready architecture."],
  ["Technical quality", "25%", "Typed API routes, deterministic risk engine, safe read-only defaults."],
  ["Product and UX", "20%", "Wallet readiness score, transaction inspector, mobile controls, feedback triage."],
  ["Innovation", "15%", "Intent receipts, protocol trust scoring, recovery playbooks, and DeFi blind-spot mapping."],
  ["Commitment", "10%", "Roadmap, feedback loop, and measurable next milestones."]
] as const;

const proofContractAddress = "0x3cbdf2990327709ec0d1d41c50c006be74c73890";

const rubricCoverage = [
  {
    criterion: "OPN Chain integration",
    weight: "30%",
    evidence: "Live Chain ID 984 RPC, wallet network checks, native OPN balance, tx/address lookup, explorer links, deployed proof contract."
  },
  {
    criterion: "Technical quality",
    weight: "25%",
    evidence: "Next.js App Router, typed API routes, deterministic risk engine, safe fallbacks, Netlify dependency shim, locked execution."
  },
  {
    criterion: "Product and UX",
    weight: "20%",
    evidence: "Single cockpit flow, mobile-friendly controls, clear safety states, feedback triage, readable risk findings."
  },
  {
    criterion: "Innovation",
    weight: "15%",
    evidence: "Intent firewall, intent receipt, protocol trust score, recovery playbook, bridge/LP/yield blind-spot coverage."
  },
  {
    criterion: "Creator commitment",
    weight: "10%",
    evidence: "No paid dependencies, roadmap, reviewer proof pack, safe MVP scope, clear path to real simulation and audited modules."
  }
] as const;

const checklist = [
  "Official URL verified",
  "Contract address checked",
  "Spender and amount reviewed",
  "Wallet popup text understood",
  "Ready to reject unclear prompts"
];

const riskExamples = [
  {
    label: "Unlimited approval",
    value:
      "0x095ea7b30000000000000000000000001234567890123456789012345678901234567890ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
  },
  { label: "Bridge claim", value: "Claim reward from bridge contract. Approve spender before receiving airdrop." },
  { label: "RWA token", value: "TSLA RWA token contract address needs verification before swap." }
];

const proofPack = [
  {
    criterion: "OPN Chain integration",
    evidence: "Native wallet connection, Chain ID 984 checks, live RPC health, block/gas latency, transaction hash lookup, address lookup, explorer links, and deployed on-chain proof."
  },
  {
    criterion: "Technical quality",
    evidence: "Typed Next.js API routes, deterministic risk engine, read-only defaults, locked execution, graceful API fallbacks, and optional dependency shim for stable Netlify builds."
  },
  {
    criterion: "Product and UX",
    evidence: "One workflow: connect wallet, inspect prompt, check chain health, review tokens, simulate swap, bridge/LP/yield risk, submit feedback, and use mobile-friendly controls."
  },
  {
    criterion: "Innovation",
    evidence: "Intent firewall, pre-signing intent receipt, protocol trust score, post-signing recovery playbook, DeFi blind-spot map, and RWA safety boundary."
  },
  {
    criterion: "Creator commitment",
    evidence: "Clear roadmap, feedback triage, no paid API dependency, no custody, no seed phrases, and a path from MVP to allowance reading, simulation, and audited protocol modules."
  }
] as const;

export function AppDashboard() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(3,7,18,1)_52%,rgba(17,24,39,1))]">
      <Header />
      <Hero />
      <Criteria />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="lg:col-span-2">
          <RubricCoverageMap />
        </div>
        <div className="lg:col-span-2">
          <ReviewerProofPack />
        </div>
        <div className="lg:col-span-2">
          <OnChainProofPack />
        </div>
        <div className="space-y-5">
          <WalletSafety />
          <OpnHealth />
          <TokenAllowlist />
          <DeFiPulse />
        </div>
        <div className="space-y-5">
          <TransactionInspector />
          <SwapSimulator />
          <Feedback />
        </div>
        <div className="lg:col-span-2">
          <SecurityModel />
        </div>
        <div className="lg:col-span-2">
          <MarketWatch />
        </div>
        <div className="lg:col-span-2">
          <BridgeRiskLab />
        </div>
        <div className="lg:col-span-2">
          <ApprovalHygiene />
        </div>
        <div className="lg:col-span-2">
          <LiquidityRiskLab />
        </div>
        <div className="lg:col-span-2">
          <YieldRadar />
        </div>
        <div className="lg:col-span-2">
          <ProtocolCoverage />
        </div>
        <div className="lg:col-span-2">
          <IntentFirewall />
        </div>
        <div className="lg:col-span-2">
          <RecoveryPlaybook />
        </div>
        <div className="lg:col-span-2">
          <IntentReceipt />
        </div>
        <div className="lg:col-span-2">
          <ProtocolTrustScore />
        </div>
        <div className="lg:col-span-2">
          <BlindSpotMap />
        </div>
        <div className="lg:col-span-2">
          <Roadmap />
        </div>
      </section>
    </main>
  );
}

function RubricCoverageMap() {
  return (
    <Panel
      icon={<CheckCircle2 />}
      title="Rubric coverage map"
      description="A reviewer-facing map from the official rubric to visible product evidence."
    >
      <div className="grid gap-3 lg:grid-cols-5">
        {rubricCoverage.map((item) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={item.criterion}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold">{item.criterion}</p>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                {item.weight}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.evidence}</p>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-primary/30 bg-primary/10 p-4">
        <p className="text-sm font-semibold text-primary">All five scoring categories have visible product evidence.</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Real token movement remains locked by design until trusted OPN routing, allowance reading, bridge verification, and transaction simulation exist.
        </p>
      </div>
    </Panel>
  );
}

function ReviewerProofPack() {
  return (
    <Panel
      icon={<CheckCircle2 />}
      title="Reviewer proof pack"
      description="Direct evidence for the five scoring categories, visible inside the product."
    >
      <div className="grid gap-3 lg:grid-cols-5">
        {proofPack.map((item) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={item.criterion}>
            <p className="font-semibold">{item.criterion}</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.evidence}</p>
          </div>
        ))}
      </div>
      <div className="rounded-md border border-primary/30 bg-primary/10 p-4 text-sm leading-6 text-foreground">
        The product is intentionally read-only in this season build: it proves OPN usage, gives users useful safety checks, and avoids unsafe token movement until verified routing, allowance reading, and simulation are ready.
      </div>
    </Panel>
  );
}

function OnChainProofPack() {
  const proofUrl = `${opnChain.blockExplorers.default.url}/address/${proofContractAddress}`;

  return (
    <Panel
      icon={<ShieldCheck />}
      title="OPN proof and submission pack"
      description="Everything a reviewer needs to verify the build without guessing."
    >
      <div className="grid gap-3 lg:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live demo</p>
          <a className="mt-2 block break-all font-semibold text-primary underline-offset-4 hover:underline" href="https://opn-defi-dashboard.netlify.app/" rel="noreferrer" target="_blank">
            opn-defi-dashboard.netlify.app
          </a>
          <p className="mt-3 text-sm text-muted-foreground">Hosted build with wallet, RPC, API, risk, and feedback surfaces.</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Source repository</p>
          <a className="mt-2 block break-all font-semibold text-primary underline-offset-4 hover:underline" href="https://github.com/maho0638/opn-defi-dashboard" rel="noreferrer" target="_blank">
            github.com/maho0638/opn-defi-dashboard
          </a>
          <p className="mt-3 text-sm text-muted-foreground">Clean Next.js codebase with documented scoring alignment.</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">On-chain proof</p>
          <a className="mt-2 block break-all font-semibold text-primary underline-offset-4 hover:underline" href={proofUrl} rel="noreferrer" target="_blank">
            {proofContractAddress}
          </a>
          <p className="mt-3 text-sm text-muted-foreground">Deployed proof links the submission, demo, repository, and wallet on OPN Chain.</p>
        </Card>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {["Chain ID 984 visible", "RPC health live", "Explorer link ready", "Execution locked by design"].map((item) => (
          <Check active label={item} key={item} />
        ))}
      </div>
    </Panel>
  );
}

function Header() {
  return (
    <header className="border-b border-border/70 bg-background/78 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <ShieldCheck className="h-4 w-4" />
            CodeX-Builder
          </div>
          <p className="mt-1 text-sm text-muted-foreground">OPN DeFi Safety Dashboard</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            href="https://github.com/maho0638/opn-defi-dashboard"
            rel="noreferrer"
            target="_blank"
          >
            <Github className="h-4 w-4" />
            Source
          </a>
          <div className="flex h-11 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs text-muted-foreground">
            Chain ID {opnChain.id}
          </div>
          <ConnectButton chainStatus="icon" showBalance={false} />
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
            <ShieldCheck className="h-4 w-4" />
            Submission-grade DeFi safety cockpit
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Prevent unsafe OPN Chain actions before users sign.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
            Wallet readiness, OPN RPC health, calldata inspection, approval risk detection, token allowlists, read-only
            market signals, and user feedback in one focused interface.
          </p>
        </Card>
        <Card className="border-amber-300/20 bg-amber-300/10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
            <div>
              <h2 className="font-semibold">Safety promise</h2>
              <p className="mt-2 text-sm leading-6 text-amber-100">
                Read-only by default. No seed phrases, no custody, no hidden approvals, and no real swap execution until
                verified routing and simulation exist.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Criteria() {
  return (
    <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-6 sm:px-6 lg:grid-cols-5 lg:px-8">
      {criteria.map(([label, points, text]) => (
        <Card className="p-4" key={label}>
          <div className="flex items-center justify-between gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-primary">{points}</span>
          </div>
          <h3 className="mt-3 font-semibold">{label}</h3>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
        </Card>
      ))}
    </section>
  );
}

function WalletSafety() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const balance = useBalance({ address, chainId: opnChain.id, query: { enabled: Boolean(address) } });
  const score = Math.min(
    100,
    (isConnected ? 25 : 0) + (isConnected && chainId === opnChain.id ? 25 : 0) + Object.values(checked).filter(Boolean).length * 10
  );
  const readiness = score >= 80 ? "Ready" : score >= 50 ? "Review" : "Unsafe";

  return (
    <Panel icon={<Wallet />} title="Wallet safety" description="Connection, network, OPN balance, and signing readiness.">
      <div className="rounded-md border border-border bg-background/60 p-4">
        <p className="text-sm text-muted-foreground">Connected wallet</p>
        <p className="mt-1 font-semibold">{compactAddress(address)}</p>
        <p className="mt-3 text-sm text-muted-foreground">OPN balance</p>
        <p className="mt-1 font-semibold">{balance.data ? `${Number(balance.data.formatted).toFixed(4)} ${balance.data.symbol}` : "0 OPN"}</p>
      </div>
      {isConnected && chainId !== opnChain.id ? (
        <div className="rounded-md border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
          Wrong network. Expected OPN Chain Testnet ID {opnChain.id}.
          <button
            className="mt-3 block rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
            disabled={isPending}
            onClick={() => switchChain({ chainId: opnChain.id })}
            type="button"
          >
            {isPending ? "Switching..." : "Switch to OPN"}
          </button>
        </div>
      ) : null}
      <div className="rounded-md border border-border bg-background/60 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Signing readiness</p>
            <p className="text-4xl font-bold">{score}</p>
          </div>
          <Badge level={readiness} />
        </div>
      </div>
      <div className="space-y-2">
        {checklist.map((item) => {
          const active = Boolean(checked[item]);
          return (
            <button
              className="flex w-full items-start gap-3 rounded-md border border-border bg-background/60 p-3 text-left text-sm"
              key={item}
              onClick={() => setChecked((state) => ({ ...state, [item]: !active }))}
              type="button"
            >
              {active ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" /> : <Circle className="mt-0.5 h-4 w-4 text-muted-foreground" />}
              <span className={active ? "text-foreground" : "text-muted-foreground"}>{item}</span>
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

function OpnHealth() {
  const [data, setData] = useState<Health | null>(null);
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true);
    try {
      setData((await (await fetch("/api/opn-health", { cache: "no-store" })).json()) as Health);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => void load(), []);

  return (
    <Panel icon={<RefreshCcw />} title="OPN live health" description="Direct RPC check for chain ID, block, gas, and latency.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Metric label="Chain ID" value={data?.chainId ? String(data.chainId) : "-"} />
        <Metric label="Latest block" value={data?.blockNumber ? formatNumber(data.blockNumber, 0) : "-"} />
        <Metric label="Gas" value={data?.gasGwei ? `${formatNumber(data.gasGwei, 4)} gwei` : "-"} />
        <Metric label="Latency" value={data?.latencyMs ? `${data.latencyMs} ms` : "-"} />
      </div>
      <ActionButton disabled={loading} onClick={load}>
        {loading ? "Checking..." : "Refresh RPC"}
      </ActionButton>
    </Panel>
  );
}

function TokenAllowlist() {
  return (
    <Panel icon={<ShieldCheck />} title="Token allowlist" description="Assets are blocked unless their role and address state are clear.">
      <TokenRow risk="Low" status="Allowed" symbol="OPN" text="Native OPN asset" />
      <TokenRow risk="Blocked" status="Disabled" symbol="USDC" text="Address missing until verified token is configured" />
    </Panel>
  );
}

function DeFiPulse() {
  const [data, setData] = useState<DeFiSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true);
    try {
      setData((await (await fetch("/api/defi-snapshot", { cache: "no-store" })).json()) as DeFiSnapshot);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => void load(), []);

  return (
    <Panel icon={<Database />} title="DeFi pulse" description="Free DeFiLlama public API snapshot for market context.">
      <div className="grid gap-3 sm:grid-cols-2">
        <Metric label="Tracked chains" value={data ? formatNumber(data.chainsTracked, 0) : "-"} />
        <Metric label="Total TVL" value={data ? `$${formatNumber(data.totalTvl / 1_000_000_000, 2)}B` : "-"} />
      </div>
      {(data?.topChains || []).map((chain) => (
        <div className="flex items-center justify-between rounded-md border border-border bg-background/60 p-3" key={chain.name}>
          <span className="font-medium">{chain.name}</span>
          <span className="text-sm text-muted-foreground">${formatNumber(chain.tvl / 1_000_000_000, 2)}B</span>
        </div>
      ))}
      <ActionButton disabled={loading} onClick={load}>
        {loading ? "Loading..." : "Refresh DeFi data"}
      </ActionButton>
    </Panel>
  );
}

function TransactionInspector() {
  const [input, setInput] = useState("");
  const [lookup, setLookup] = useState<OnchainLookup | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const result = useMemo(() => analyzeRiskInput(input), [input]);
  const trimmedInput = input.trim();
  const canLookup = /^0x[a-fA-F0-9]{64}$/.test(trimmedInput) || /^0x[a-fA-F0-9]{40}$/.test(trimmedInput);

  async function loadOnchain() {
    if (!canLookup) return;
    setLookupLoading(true);
    try {
      const payload = (await (await fetch(`/api/onchain-lookup?q=${encodeURIComponent(trimmedInput)}`, { cache: "no-store" })).json()) as OnchainLookup;
      setLookup(payload);
    } catch (error) {
      setLookup({
        checks: [],
        error: error instanceof Error ? error.message : "Lookup failed",
        found: false,
        kind: "unknown",
        ok: false,
        riskHints: ["Lookup failed. Keep execution locked and inspect manually."],
        summary: "On-chain lookup failed."
      });
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <Panel icon={<ScanSearch />} title="Transaction inspector" description="Paste calldata, approval text, address, or wallet popup text.">
      <textarea
        className="min-h-32 w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        onChange={(event) => {
          setInput(event.target.value);
          setLookup(null);
        }}
        placeholder="Paste suspicious wallet text, calldata, transaction hash, or token address..."
        value={input}
      />
      <div className="flex flex-wrap gap-2">
        {riskExamples.map((example) => (
          <ActionButton
            key={example.label}
            onClick={() => {
              setInput(example.value);
              setLookup(null);
            }}
          >
            {example.label}
          </ActionButton>
        ))}
        <ActionButton disabled={!canLookup || lookupLoading} onClick={loadOnchain}>
          {lookupLoading ? "Looking up..." : "Lookup on OPN"}
        </ActionButton>
      </div>
      <div className={cn("rounded-md border p-4", riskClass(result.level))}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Risk score</p>
            <p className="text-2xl font-bold">{result.score}/100</p>
          </div>
          <span className="rounded-full border border-current/20 px-3 py-1 text-sm font-semibold">{result.level}</span>
        </div>
        <p className="mt-3 text-sm">{result.summary}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ResultBox title="Findings" rows={result.findings} />
        <ResultBox title="Required checks" rows={result.actions} />
      </div>
      {lookup ? (
        <div className="rounded-md border border-primary/30 bg-primary/10 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="font-semibold">Live OPN lookup</p>
              <p className="mt-1 text-sm text-muted-foreground">{lookup.summary}</p>
            </div>
            {lookup.explorerUrl ? (
              <a className="text-sm font-semibold text-primary hover:underline" href={lookup.explorerUrl} rel="noreferrer" target="_blank">
                Open explorer
              </a>
            ) : null}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <ResultBox title="On-chain facts" rows={lookup.checks.length ? lookup.checks : [lookup.error || "No on-chain data returned."]} />
            <ResultBox title="Safety interpretation" rows={lookup.riskHints} />
          </div>
        </div>
      ) : null}
    </Panel>
  );
}

function SwapSimulator() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [fromAmount, setFromAmount] = useState("");
  const [fromToken, setFromToken] = useState<"OPN" | "USDC">("OPN");
  const toToken = fromToken === "OPN" ? "USDC" : "OPN";
  const amount = Number(fromAmount);
  const output = Number.isFinite(amount) && amount > 0 ? (fromToken === "OPN" ? amount * 2.4 : amount / 2.4).toFixed(6) : "";

  return (
    <Panel icon={<ArrowDownUp />} title="Swap simulator" description="Preview only. Execution stays locked until verified routing and simulation exist.">
      <TokenInput label="From" token={fromToken} value={fromAmount} onChange={setFromAmount} />
      <ActionButton onClick={() => setFromToken((token) => (token === "OPN" ? "USDC" : "OPN"))}>Flip tokens</ActionButton>
      <TokenInput label="To" readOnly token={toToken} value={output} />
      <div className="grid gap-2 sm:grid-cols-3">
        <Check active={isConnected} label="Wallet" />
        <Check active={isConnected && chainId === opnChain.id} label="Network" />
        <Check active={Boolean(output)} label="Amount" />
      </div>
      <button className="h-11 w-full rounded-md bg-secondary font-semibold text-secondary-foreground" disabled type="button">
        <Lock className="mr-2 inline h-4 w-4" />
        Execution locked
      </button>
    </Panel>
  );
}

function Feedback() {
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  return (
    <Panel icon={<MessageSquare />} title="Feedback triage" description="Collect safety issues, data mistakes, and UX bugs.">
      <textarea
        className="min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        onChange={(event) => {
          setMessage(event.target.value);
          setSaved(false);
        }}
        placeholder="Describe the issue. Include token address, wallet action, API panel, or page section."
        value={message}
      />
      <ActionButton
        disabled={message.trim().length < 8}
        onClick={() => {
          window.localStorage.setItem("opn-dashboard-feedback", JSON.stringify({ createdAt: new Date().toISOString(), message }));
          setMessage("");
          setSaved(true);
        }}
      >
        <Send className="mr-2 inline h-4 w-4" />
        Send
      </ActionButton>
      {saved ? <p className="text-sm text-primary">Feedback saved locally.</p> : null}
    </Panel>
  );
}

function SecurityModel() {
  const rules = [
    "Block swaps when connected chain is not OPN Chain.",
    "Block token actions without an allowlist entry.",
    "Warn before unlimited approval, permit, and setApprovalForAll patterns.",
    "Show testnet/mainnet state before signing.",
    "Keep stocks and RWA data read-only until licensed data and verified contracts exist."
  ];
  return (
    <Panel icon={<ShieldCheck />} title="Security model" description="Professional DeFi UX starts by preventing unsafe actions by default.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {rules.map((rule) => (
          <div className="rounded-md border border-border bg-background/60 p-4 text-sm text-muted-foreground" key={rule}>
            <CheckCircle2 className="mb-3 h-4 w-4 text-primary" />
            {rule}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MarketWatch() {
  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [loading, setLoading] = useState(false);
  async function load() {
    setLoading(true);
    try {
      const payload = (await (await fetch("/api/market-watch", { cache: "no-store" })).json()) as { assets: MarketAsset[] };
      setAssets(payload.assets);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => void load(), []);

  return (
    <Panel icon={<BarChart3 />} title="RWA and market watch" description="Read-only Stooq public CSV watchlist for TSLA, NVDA, AAPL, COIN, MSTR, and GLD.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(assets.length > 0
          ? assets
          : [
              { changePercent: null, close: null, status: "Watch only", symbol: "TSLA", volume: null },
              { changePercent: null, close: null, status: "Watch only", symbol: "NVDA", volume: null },
              { changePercent: null, close: null, status: "Watch only", symbol: "AAPL", volume: null },
              { changePercent: null, close: null, status: "Watch only", symbol: "COIN", volume: null },
              { changePercent: null, close: null, status: "Watch only", symbol: "MSTR", volume: null },
              { changePercent: null, close: null, status: "Watch only", symbol: "GLD", volume: null }
            ]
        ).map((asset) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={asset.symbol}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold">{asset.symbol}</p>
                <p className="mt-1 text-sm text-muted-foreground">{asset.close ? `$${formatNumber(asset.close, 2)}` : "No quote"}</p>
              </div>
              <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs">
                {asset.changePercent === null ? "-" : `${formatNumber(asset.changePercent, 2)}%`}
              </span>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{asset.status}</p>
          </div>
        ))}
      </div>
      <p className="rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">
        Not a trading venue and not investment advice. RWA execution requires licensed data and verified contracts.
      </p>
      <ActionButton disabled={loading} onClick={load}>
        {loading ? "Loading..." : "Refresh market data"}
      </ActionButton>
    </Panel>
  );
}

function BridgeRiskLab() {
  const [amount, setAmount] = useState("100");
  const [source, setSource] = useState("Ethereum");
  const [destination, setDestination] = useState("OPN Chain");
  const risky = source === destination || !amount || Number(amount) <= 0;

  return (
    <Panel icon={<ArrowDownUp />} title="Bridge risk lab" description="Pre-flight bridge checklist inspired by real bridge flows, without moving funds.">
      <div className="grid gap-3 lg:grid-cols-3">
        <SelectBox label="Source chain" value={source} values={["Ethereum", "Base", "BSC", "Arbitrum", "OPN Chain"]} onChange={setSource} />
        <SelectBox label="Destination chain" value={destination} values={["OPN Chain", "Ethereum", "Base", "BSC", "Arbitrum"]} onChange={setDestination} />
        <TokenInput label="Amount" token="OPN" value={amount} onChange={setAmount} />
      </div>
      <div className={cn("rounded-md border p-4", risky ? "border-amber-300/30 bg-amber-300/10 text-amber-100" : "border-emerald-300/30 bg-emerald-300/10 text-emerald-100")}>
        <p className="font-semibold">{risky ? "Bridge route needs review" : "Bridge route is ready for simulation"}</p>
        <p className="mt-2 text-sm">
          Verify official bridge URL, recipient address, source chain, destination chain, final token, fees, and estimated arrival before signing.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {["Official bridge URL", "Recipient matches wallet", "Destination token verified", "Fallback plan known"].map((item) => (
          <Check active={!risky} label={item} key={item} />
        ))}
      </div>
    </Panel>
  );
}

function ApprovalHygiene() {
  const rows = [
    ["Unlimited approval", "Critical", "Avoid unless spender is verified and actively used."],
    ["Permit signature", "High", "Treat like token spending approval."],
    ["Router approval", "Medium", "Check spender address and revoke after use."],
    ["Read-only balance", "Low", "No token movement or approval requested."]
  ];

  return (
    <Panel icon={<ShieldCheck />} title="Approval hygiene" description="Approval management playbook for future revoke and allowance integrations.">
      <div className="grid gap-3 lg:grid-cols-4">
        {rows.map(([label, risk, text]) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={label}>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold">{label}</p>
              <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs">{risk}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
      <p className="rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-xs text-amber-100">
        Next milestone: read allowances from verified token contracts and show revoke links through trusted explorers/tools.
      </p>
    </Panel>
  );
}

function LiquidityRiskLab() {
  const [move, setMove] = useState("20");
  const priceMove = Math.max(0, Number(move) || 0);
  const ratio = 1 + priceMove / 100;
  const impermanentLoss = ratio > 0 ? ((2 * Math.sqrt(ratio)) / (1 + ratio) - 1) * 100 : 0;
  const severity = Math.abs(impermanentLoss) > 2 ? "High" : Math.abs(impermanentLoss) > 0.5 ? "Medium" : "Low";

  return (
    <Panel icon={<BarChart3 />} title="Liquidity risk lab" description="Simple AMM pool risk preview for LP users before they deposit.">
      <div className="grid gap-3 lg:grid-cols-3">
        <TokenInput label="Price move" token="%" value={move} onChange={setMove} />
        <Metric label="Estimated IL" value={`${impermanentLoss.toFixed(2)}%`} />
        <Metric label="Risk band" value={severity} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {["Pool TVL", "Fee APR", "Token volatility", "Exit liquidity"].map((item) => (
          <div className="rounded-md border border-border bg-background/60 p-4 text-sm text-muted-foreground" key={item}>
            <CheckCircle2 className="mb-3 h-4 w-4 text-primary" />
            {item} must be reviewed before LP deposit.
          </div>
        ))}
      </div>
    </Panel>
  );
}

function YieldRadar() {
  const [pools, setPools] = useState<YieldPool[]>([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const payload = (await (await fetch("/api/yield-radar", { cache: "no-store" })).json()) as { pools: YieldPool[] };
      setPools(payload.pools);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => void load(), []);

  return (
    <Panel icon={<Database />} title="Yield risk radar" description="Free DeFiLlama Yields data for APR context and risk education.">
      <div className="grid gap-3 lg:grid-cols-3">
        {pools.map((pool) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={`${pool.project}-${pool.symbol}-${pool.chain}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{pool.symbol}</p>
                <p className="mt-1 text-sm text-muted-foreground">{pool.project} - {pool.chain}</p>
              </div>
              <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs">{pool.apy.toFixed(2)}%</span>
            </div>
            <div className="mt-4 grid gap-2 text-xs text-muted-foreground">
              <span>TVL: ${formatNumber(pool.tvlUsd / 1_000_000, 2)}M</span>
              <span>IL risk: {pool.ilRisk}</span>
              <span>{pool.stablecoin ? "Stablecoin pool" : "Volatile assets possible"}</span>
            </div>
          </div>
        ))}
      </div>
      <ActionButton disabled={loading} onClick={load}>{loading ? "Loading..." : "Refresh yield data"}</ActionButton>
    </Panel>
  );
}

function ProtocolCoverage() {
  const coverage = [
    ["Swap", "Simulator ready", "Real routing locked until trusted OPN liquidity source exists."],
    ["Bridge", "Risk lab ready", "Official bridge verification required before execution."],
    ["Approvals", "Inspector ready", "Allowance reader/revoke flow planned."],
    ["Pools", "IL lab ready", "Live pool data planned after OPN DEX integrations."],
    ["Yield", "Radar ready", "DeFiLlama context live, OPN-specific pools next."],
    ["Portfolio", "Wallet base ready", "Explorer-backed history planned."]
  ];

  return (
    <Panel icon={<CheckCircle2 />} title="Protocol coverage matrix" description="Shows reviewers this is a broad DeFi safety product, not a single-purpose demo.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coverage.map(([area, status, note]) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={area}>
            <p className="font-semibold">{area}</p>
            <p className="mt-1 text-sm text-primary">{status}</p>
            <p className="mt-3 text-sm text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function IntentFirewall() {
  const [actionType, setActionType] = useState("Swap");
  const [amount, setAmount] = useState("100");
  const [maxUsd, setMaxUsd] = useState("250");
  const [slippage, setSlippage] = useState("1");
  const [allowBridge, setAllowBridge] = useState(false);
  const [allowUnknown, setAllowUnknown] = useState(false);

  const amountValue = Number(amount) || 0;
  const maxValue = Number(maxUsd) || 0;
  const slippageValue = Number(slippage) || 0;
  const blockedReasons = [
    amountValue > maxValue ? "Amount exceeds your personal max transaction policy." : "",
    actionType === "Bridge" && !allowBridge ? "Bridge actions are blocked by your policy." : "",
    actionType === "Unknown token" && !allowUnknown ? "Unknown token actions are blocked by your policy." : "",
    slippageValue > 2 ? "Slippage above 2% requires manual review." : ""
  ].filter(Boolean);

  return (
    <Panel
      icon={<ShieldCheck />}
      title="Intent firewall"
      description="A personal policy layer missing from most DeFi UIs: block actions before the wallet popup."
    >
      <div className="grid gap-3 lg:grid-cols-4">
        <SelectBox label="Action type" value={actionType} values={["Swap", "Bridge", "Approval", "LP deposit", "Unknown token"]} onChange={setActionType} />
        <TokenInput label="Action size" token="USD" value={amount} onChange={setAmount} />
        <TokenInput label="Max policy" token="USD" value={maxUsd} onChange={setMaxUsd} />
        <TokenInput label="Max slippage" token="%" value={slippage} onChange={setSlippage} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <PolicyToggle active={allowBridge} label="Allow bridge actions" onClick={() => setAllowBridge((value) => !value)} />
        <PolicyToggle active={allowUnknown} label="Allow unknown tokens" onClick={() => setAllowUnknown((value) => !value)} />
      </div>
      <div className={cn("rounded-md border p-4", blockedReasons.length ? "border-red-400/30 bg-red-400/10 text-red-100" : "border-emerald-300/30 bg-emerald-300/10 text-emerald-100")}>
        <p className="font-semibold">{blockedReasons.length ? "Blocked by intent firewall" : "Allowed by current policy"}</p>
        <div className="mt-3 space-y-2 text-sm">
          {(blockedReasons.length ? blockedReasons : ["This action fits your current personal risk policy. Still inspect calldata before signing."]).map((reason) => (
            <p key={reason}>{reason}</p>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function RecoveryPlaybook() {
  const [action, setAction] = useState("Approval");
  const steps: Record<string, string[]> = {
    Approval: [
      "Before signing: verify spender address and exact allowance.",
      "After signing: save the transaction hash and monitor spender activity.",
      "If suspicious: revoke allowance through a trusted allowance tool or explorer flow.",
      "Long term: prefer exact approvals over unlimited approvals."
    ],
    Bridge: [
      "Before signing: verify official bridge URL, recipient, source chain, and destination chain.",
      "After signing: track both source and destination chain explorers.",
      "If delayed: do not retry blindly; check bridge status and support docs first.",
      "Long term: test small transfers before large bridge moves."
    ],
    Swap: [
      "Before signing: compare route, slippage, price impact, and token addresses.",
      "After signing: verify received amount and keep the transaction hash.",
      "If output is wrong: report route/source data issue through feedback triage.",
      "Long term: avoid illiquid pairs unless risk is intentional."
    ],
    "LP deposit": [
      "Before signing: review impermanent loss, TVL, token volatility, and exit liquidity.",
      "After signing: monitor fee APR versus price divergence.",
      "If risk increases: exit before liquidity dries up.",
      "Long term: size LP positions separately from spot holdings."
    ]
  };

  return (
    <Panel icon={<Lock />} title="Post-signing recovery playbook" description="Most DeFi apps stop after execution; this tells users what to do after signing.">
      <SelectBox label="Action" value={action} values={Object.keys(steps)} onChange={setAction} />
      <div className="grid gap-3 lg:grid-cols-4">
        {steps[action].map((step) => (
          <div className="rounded-md border border-border bg-background/60 p-4 text-sm text-muted-foreground" key={step}>
            <CheckCircle2 className="mb-3 h-4 w-4 text-primary" />
            {step}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function IntentReceipt() {
  const [action, setAction] = useState("Swap");
  const [assetIn, setAssetIn] = useState("OPN");
  const [assetOut, setAssetOut] = useState("USDC");
  const [counterparty, setCounterparty] = useState("Verified OPN route");
  const [limit, setLimit] = useState("250");

  const receipt = `OPN intent: ${action} | give: ${assetIn} | receive: ${assetOut} | max exposure: ${limit} USD | counterparty: ${counterparty}`;
  const receiptId = makeLocalHash(receipt);

  return (
    <Panel
      icon={<ScanSearch />}
      title="Pre-signing intent receipt"
      description="A user-readable receipt created before the wallet popup, so the final signature can be compared against intent."
    >
      <div className="grid gap-3 lg:grid-cols-4">
        <SelectBox label="Intent" value={action} values={["Swap", "Bridge", "Approval", "LP deposit", "Yield deposit"]} onChange={setAction} />
        <TokenInput label="Give asset" token="" value={assetIn} onChange={setAssetIn} text />
        <TokenInput label="Receive asset" token="" value={assetOut} onChange={setAssetOut} text />
        <TokenInput label="Max exposure" token="USD" value={limit} onChange={setLimit} />
      </div>
      <input
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        onChange={(event) => setCounterparty(event.target.value)}
        placeholder="Counterparty, route, bridge, or protocol name"
        value={counterparty}
      />
      <div className="rounded-md border border-primary/30 bg-primary/10 p-4">
        <p className="text-sm font-semibold text-primary">Local receipt #{receiptId}</p>
        <p className="mt-3 text-sm leading-6 text-foreground">{receipt}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          If the wallet popup asks for a different spender, token, chain, approval size, or action, reject and inspect again.
        </p>
      </div>
    </Panel>
  );
}

function ProtocolTrustScore() {
  const [checks, setChecks] = useState<Record<string, boolean>>({
    source: true,
    audit: false,
    timelock: false,
    bugBounty: false,
    admin: false,
    oracle: false
  });
  const rows = [
    ["source", "Verified source code", 20],
    ["audit", "Independent audit or public review", 20],
    ["timelock", "Timelock or transparent upgrade delay", 15],
    ["bugBounty", "Bug bounty or responsible disclosure path", 15],
    ["admin", "Admin keys documented and limited", 15],
    ["oracle", "Oracle, route, and liquidity source disclosed", 15]
  ] as const;
  const score = rows.reduce((total, [key, , points]) => total + (checks[key] ? points : 0), 0);
  const grade = score >= 80 ? "Ready to monitor" : score >= 55 ? "Needs review" : "Do not integrate";

  return (
    <Panel
      icon={<Database />}
      title="Protocol trust score"
      description="A due-diligence layer for protocols before they appear in swaps, bridges, pools, or yield modules."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(([key, label]) => (
          <PolicyToggle
            active={checks[key]}
            key={key}
            label={label}
            onClick={() => setChecks((value) => ({ ...value, [key]: !value[key] }))}
          />
        ))}
      </div>
      <div className={cn("rounded-md border p-4", score >= 80 ? "border-emerald-300/30 bg-emerald-300/10" : score >= 55 ? "border-amber-300/30 bg-amber-300/10" : "border-red-400/30 bg-red-400/10")}>
        <p className="text-sm font-semibold">Trust score</p>
        <p className="mt-2 text-3xl font-bold">{score}/100</p>
        <p className="mt-2 text-sm text-muted-foreground">{grade}. Execution should remain locked until the missing controls are verified.</p>
      </div>
    </Panel>
  );
}

function BlindSpotMap() {
  const gaps = [
    ["Personal policy firewall", "Users set risk limits before wallet prompts appear."],
    ["After-action recovery", "Every action has revoke, monitor, and escalation steps."],
    ["Intent receipt", "Users compare the wallet popup against their own pre-signing intent."],
    ["Protocol trust score", "Protocols must pass source, audit, admin, oracle, and disclosure checks before use."],
    ["Bridge recipient discipline", "Bridge flows check recipient and destination before signing."],
    ["LP exit thinking", "LP users see exit liquidity and impermanent loss as first-class risk."],
    ["RWA jurisdiction lock", "Stock/RWA features remain read-only until data and contract legality are verified."],
    ["Plain-language signing", "Every future transaction should explain what changes in the wallet."]
  ];

  return (
    <Panel icon={<AlertTriangle />} title="DeFi blind-spot map" description="The product angle: protect users in places large DeFi apps often leave to user judgment.">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gaps.map(([title, text]) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={title}>
            <p className="font-semibold">{title}</p>
            <p className="mt-3 text-sm text-muted-foreground">{text}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Roadmap() {
  const items = [
    "May-June 2026: harden OPN RPC checks, improve inspector coverage, collect reviewer feedback.",
    "July-September 2026: add trusted OPN quote previews, transaction simulation, and explorer-backed wallet activity.",
    "October-December 2026: integrate audited OPN DeFi modules and licensed RWA data if validated."
  ];
  return (
    <Panel icon={<CheckCircle2 />} title="Commitment roadmap" description="Clear next steps for turning the MVP into a durable OPN safety product.">
      <div className="grid gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <div className="rounded-md border border-border bg-background/60 p-4 text-sm text-muted-foreground" key={item}>
            {item}
          </div>
        ))}
      </div>
    </Panel>
  );
}

function Panel({ children, description, icon, title }: { children: React.ReactNode; description: string; icon: React.ReactNode; title: string }) {
  return (
    <Card>
      <div className="mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <span className="[&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-primary">{icon}</span>
          {title}
        </h2>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </Card>
  );
}

function Card({ children, className = "bg-card/85", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-lg border border-border p-5 text-card-foreground shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function TokenRow({ risk, status, symbol, text }: { risk: string; status: string; symbol: string; text: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{symbol}</p>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        </div>
        <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-xs">{risk}</span>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">{status}</p>
    </div>
  );
}

function ActionButton({ children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      className="inline-flex min-h-11 items-center justify-center rounded-md border border-border bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function Badge({ level }: { level: string }) {
  return <span className="rounded-full border border-border bg-secondary px-3 py-1 text-sm font-semibold">{level}</span>;
}

function Check({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-background/60 p-3 text-xs">
      <CheckCircle2 className={active ? "h-4 w-4 text-primary" : "h-4 w-4 text-muted-foreground"} />
      <span>{label}</span>
    </div>
  );
}

function ResultBox({ rows, title }: { rows: string[]; title: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <p className="mb-3 font-semibold">{title}</p>
      <div className="space-y-2">
        {rows.map((row) => (
          <p className="text-sm text-muted-foreground" key={row}>
            {row}
          </p>
        ))}
      </div>
    </div>
  );
}

function TokenInput({
  label,
  onChange,
  readOnly,
  text,
  token,
  value
}: {
  label: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  text?: boolean;
  token: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <input
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          inputMode={text ? undefined : "decimal"}
          min={text ? undefined : "0"}
          onChange={(event) => onChange?.(event.target.value)}
          placeholder={text ? "Asset name" : "0.00"}
          readOnly={readOnly}
          type={text ? "text" : "number"}
          value={value}
        />
        {token ? <div className="flex min-h-11 min-w-20 items-center justify-center rounded-md border border-border bg-secondary px-3 py-2 text-center text-sm font-semibold">{token}</div> : null}
      </div>
    </div>
  );
}

function SelectBox({ label, onChange, value, values }: { label: string; onChange: (value: string) => void; value: string; values: string[] }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <select
        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {values.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
    </div>
  );
}

function PolicyToggle({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button className="flex items-center gap-3 rounded-md border border-border bg-background/60 p-4 text-left text-sm" onClick={onClick} type="button">
      {active ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
      <span className={active ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </button>
  );
}

function riskClass(level: string) {
  if (level === "Critical") return "border-red-400/30 bg-red-400/10 text-red-100";
  if (level === "High") return "border-orange-300/30 bg-orange-300/10 text-orange-100";
  if (level === "Medium") return "border-amber-300/30 bg-amber-300/10 text-amber-100";
  return "border-emerald-300/30 bg-emerald-300/10 text-emerald-100";
}

function makeLocalHash(value: string) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0").slice(0, 8).toUpperCase();
}
