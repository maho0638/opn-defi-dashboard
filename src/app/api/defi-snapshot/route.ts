import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ChainRow = { name: string; tokenSymbol?: string; tvl: number };

export async function GET() {
  try {
    const response = await fetch("https://api.llama.fi/v2/chains", { cache: "no-store" });
    if (!response.ok) throw new Error("DeFiLlama request failed");
    const rows = ((await response.json()) as ChainRow[])
      .filter((row) => Number.isFinite(row.tvl))
      .sort((a, b) => b.tvl - a.tvl);
    return NextResponse.json({
      chainsTracked: rows.length,
      ok: true,
      source: "DeFiLlama public API",
      topChains: rows.slice(0, 5).map((row) => ({ name: row.name, symbol: row.tokenSymbol || "N/A", tvl: row.tvl })),
      totalTvl: rows.reduce((sum, row) => sum + row.tvl, 0)
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "DeFi data unavailable",
      ok: false,
      source: "DeFiLlama public API",
      topChains: [],
      totalTvl: 0
    });
  }
}
