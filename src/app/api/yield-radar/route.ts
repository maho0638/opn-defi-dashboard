import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type YieldPool = {
  apy?: number;
  apyBase?: number;
  chain?: string;
  ilRisk?: string;
  project?: string;
  stablecoin?: boolean;
  symbol?: string;
  tvlUsd?: number;
};

const fallbackPools = [
  { apy: 0, chain: "OPN planned", ilRisk: "unknown", project: "Verified OPN protocols", stablecoin: false, symbol: "Awaiting live pools", tvlUsd: 0 },
  { apy: 0, chain: "OPN planned", ilRisk: "low", project: "Stablecoin lending", stablecoin: true, symbol: "USDC / USDT", tvlUsd: 0 },
  { apy: 0, chain: "OPN planned", ilRisk: "medium", project: "DEX LP", stablecoin: false, symbol: "OPN / USDC", tvlUsd: 0 }
];

export async function GET() {
  try {
    const response = await fetch("https://yields.llama.fi/pools", { cache: "no-store" });
    if (!response.ok) throw new Error("DeFiLlama yields request failed");
    const payload = (await response.json()) as { data?: YieldPool[] };
    const pools = (payload.data || [])
      .filter((pool) => Number.isFinite(pool.tvlUsd) && Number(pool.tvlUsd) > 5_000_000)
      .sort((a, b) => Number(b.tvlUsd || 0) - Number(a.tvlUsd || 0))
      .slice(0, 6)
      .map((pool) => ({
        apy: Number(pool.apy || 0),
        chain: pool.chain || "Unknown",
        ilRisk: pool.ilRisk || "unknown",
        project: pool.project || "Unknown",
        stablecoin: Boolean(pool.stablecoin),
        symbol: pool.symbol || "Pool",
        tvlUsd: Number(pool.tvlUsd || 0)
      }));

    return NextResponse.json({
      ok: true,
      pools: pools.length ? pools : fallbackPools,
      source: "DeFiLlama Yields public API"
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Yield data unavailable",
      ok: false,
      pools: fallbackPools,
      source: "DeFiLlama Yields public API"
    });
  }
}
