import { AlertTriangle, CheckCircle2, Code2, Gauge, Lightbulb, Network, ShieldCheck } from "lucide-react";

import { DeFiPulsePanel } from "@/components/dashboard/defi-pulse-panel";
import { FeedbackPanel } from "@/components/dashboard/feedback-panel";
import { MarketWatchPanel } from "@/components/dashboard/market-watch-panel";
import { OpnHealthPanel } from "@/components/dashboard/opn-health-panel";
import { RoadmapPanel } from "@/components/dashboard/roadmap-panel";
import { SecurityModelPanel } from "@/components/dashboard/security-model-panel";
import { SwapSimulatorPanel } from "@/components/dashboard/swap-simulator-panel";
import { TokenAllowlistPanel } from "@/components/dashboard/token-allowlist-panel";
import { TransactionInspectorPanel } from "@/components/dashboard/transaction-inspector-panel";
import { WalletPanel } from "@/components/dashboard/wallet-panel";
import { Header } from "@/components/site/header";

const criteria = [
  {
    icon: Network,
    label: "OPN integration",
    points: "30%",
    text: "Live OPN RPC health, wallet network checks, on-chain proof, explorer links."
  },
  {
    icon: Code2,
    label: "Technical quality",
    points: "25%",
    text: "Typed modules, API isolation, deterministic risk engine, no custody, safe defaults."
  },
  {
    icon: Gauge,
    label: "Product and UX",
    points: "20%",
    text: "Clear signing readiness score, transaction inspector, safety checklist, feedback flow."
  },
  {
    icon: Lightbulb,
    label: "Innovation",
    points: "15%",
    text: "DeFi safety cockpit combining wallet checks, calldata review, RWA watchlists, and signals."
  },
  {
    icon: CheckCircle2,
    label: "Creator commitment",
    points: "10%",
    text: "Roadmap, contribution path, feedback loop, and measurable next milestones."
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(3,7,18,1)_52%,rgba(17,24,39,1))]">
      <Header />

      <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg border border-primary/20 bg-card/85 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <ShieldCheck className="h-4 w-4" />
              Submission-grade DeFi safety cockpit
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Prevent unsafe OPN Chain actions before users sign.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              CodeX-Builder turns a basic dashboard into a practical safety layer: wallet readiness, OPN RPC status,
              calldata inspection, approval risk detection, token allowlists, read-only market signals, and user feedback
              in one focused interface.
            </p>
          </div>
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
              <div>
                <h2 className="font-semibold">Safety promise</h2>
                <p className="mt-2 text-sm leading-6 text-amber-100">
                  The MVP is read-only by default. It never asks for seed phrases, never takes custody, never executes
                  swaps, and keeps risky actions blocked until verified data, simulation, and allowlists are ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 pb-6 sm:px-6 lg:grid-cols-5 lg:px-8">
        {criteria.map((item) => {
          const Icon = item.icon;
          return (
            <div className="rounded-lg border border-border bg-card/75 p-4" key={item.label}>
              <div className="flex items-center justify-between gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-sm font-bold text-primary">{item.points}</span>
              </div>
              <h3 className="mt-3 font-semibold">{item.label}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <div className="space-y-5">
          <WalletPanel />
          <OpnHealthPanel />
          <TokenAllowlistPanel />
          <DeFiPulsePanel />
        </div>
        <div className="space-y-5">
          <TransactionInspectorPanel />
          <SwapSimulatorPanel />
          <FeedbackPanel />
        </div>
        <div className="lg:col-span-2">
          <SecurityModelPanel />
        </div>
        <div className="lg:col-span-2">
          <MarketWatchPanel />
        </div>
        <div className="lg:col-span-2">
          <RoadmapPanel />
        </div>
      </section>
    </main>
  );
}
