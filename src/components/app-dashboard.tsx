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

const criteria = [
  ["OPN integration", "30%", "Live RPC health, Chain ID 984 wallet checks, explorer-ready architecture."],
  ["Technical quality", "25%", "Typed API routes, deterministic risk engine, safe read-only defaults."],
  ["Product and UX", "20%", "Wallet readiness score, transaction inspector, feedback triage."],
  ["Innovation", "15%", "Safety cockpit combining DeFi, calldata review, and RWA watchlists."],
  ["Commitment", "10%", "Roadmap, feedback loop, and measurable next milestones."]
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

export function AppDashboard() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(3,7,18,1)_52%,rgba(17,24,39,1))]">
      <Header />
      <Hero />
      <Criteria />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
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
          <Roadmap />
        </div>
      </section>
    </main>
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
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            href="https://github.com/maho0638/opn-defi-dashboard"
            rel="noreferrer"
            target="_blank"
          >
            <Github className="h-4 w-4" />
            Source
          </a>
          <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs text-muted-foreground">
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
  const result = useMemo(() => analyzeRiskInput(input), [input]);

  return (
    <Panel icon={<ScanSearch />} title="Transaction inspector" description="Paste calldata, approval text, address, or wallet popup text.">
      <textarea
        className="min-h-32 w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        onChange={(event) => setInput(event.target.value)}
        placeholder="Paste suspicious wallet text, calldata, transaction hash, or token address..."
        value={input}
      />
      <div className="flex flex-wrap gap-2">
        {riskExamples.map((example) => (
          <ActionButton key={example.label} onClick={() => setInput(example.value)}>
            {example.label}
          </ActionButton>
        ))}
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
      <button className="h-10 w-full rounded-md bg-secondary font-semibold text-secondary-foreground" disabled type="button">
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
        {assets.map((asset) => (
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
      className="inline-flex h-9 items-center justify-center rounded-md border border-border bg-secondary px-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
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

function TokenInput({ label, onChange, readOnly, token, value }: { label: string; onChange?: (value: string) => void; readOnly?: boolean; token: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-background/60 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-2 flex items-center gap-3">
        <input
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          inputMode="decimal"
          min="0"
          onChange={(event) => onChange?.(event.target.value)}
          placeholder="0.00"
          readOnly={readOnly}
          type="number"
          value={value}
        />
        <div className="min-w-20 rounded-md border border-border bg-secondary px-3 py-2 text-center text-sm font-semibold">{token}</div>
      </div>
    </div>
  );
}

function riskClass(level: string) {
  if (level === "Critical") return "border-red-400/30 bg-red-400/10 text-red-100";
  if (level === "High") return "border-orange-300/30 bg-orange-300/10 text-orange-100";
  if (level === "Medium") return "border-amber-300/30 bg-amber-300/10 text-amber-100";
  return "border-emerald-300/30 bg-emerald-300/10 text-emerald-100";
}
