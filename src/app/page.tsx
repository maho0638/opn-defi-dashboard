import { BalanceCard } from "@/components/dashboard/balance-card";
import { SwapInterface } from "@/components/dashboard/swap-interface";
import { TransactionHistory } from "@/components/dashboard/transaction-history";
import { Header } from "@/components/site/header";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_34rem),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_30rem)]">
      <Header />
      <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="space-y-5">
          <BalanceCard />
          <TransactionHistory />
        </div>
        <SwapInterface />
      </section>
    </main>
  );
}
