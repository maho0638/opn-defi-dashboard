import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ChainRow = {
  chainId?: number;
  gecko_id?: string | null;
  name: string;
  tokenSymbol?: string;
  tvl: number;
};

export async function GET() {
  try {
    const response = await fetch("https://api.llama.fi/v2/chains", {
      cache: "no-store",
      signal: AbortSignal.timeout(8000)
    });

    if (!response.ok) throw new Error("DeFiLlama request failed");

    const rows = ((await response.json()) as ChainRow[])
      .filter((row) => Number.isFinite(row.tvl))
      .sort((a, b) => b.tvl - a.tvl);

    const totalTvl = rows.reduce((sum, row) => sum + row.tvl, 0);
    const topChains = rows.slice(0, 5).map((row) => ({
      name: row.name,
      symbol: row.tokenSymbol || row.gecko_id || "N/A",
      tvl: row.tvl
    }));

    return NextResponse.json({
      chainsTracked: rows.length,
      ok: true,
      source: "DeFiLlama public API",
      topChains,
      totalTvl
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
