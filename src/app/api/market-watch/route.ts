import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const symbols = ["tsla.us", "nvda.us", "aapl.us", "coin.us", "mstr.us", "gld.us"];
const fallbackAssets = [
  { changePercent: null, close: null, status: "Watch only", symbol: "TSLA", volume: null },
  { changePercent: null, close: null, status: "Watch only", symbol: "NVDA", volume: null },
  { changePercent: null, close: null, status: "Watch only", symbol: "AAPL", volume: null },
  { changePercent: null, close: null, status: "Watch only", symbol: "COIN", volume: null },
  { changePercent: null, close: null, status: "Watch only", symbol: "MSTR", volume: null },
  { changePercent: null, close: null, status: "Watch only", symbol: "GLD", volume: null }
];

function parseCsv(csv: string) {
  const [headerLine, ...lines] = csv.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    const values = line.split(",");
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    const close = Number(row.Close);
    const open = Number(row.Open);
    return {
      changePercent: Number.isFinite(close) && Number.isFinite(open) && open > 0 ? ((close - open) / open) * 100 : null,
      close: Number.isFinite(close) ? close : null,
      status: row.Close === "N/D" ? "Unavailable" : "Watch only",
      symbol: String(row.Symbol || "N/A").replace(".US", ""),
      volume: Number(row.Volume) || null
    };
  });
}

export async function GET() {
  try {
    const responses = await Promise.all(
      symbols.map(async (symbol) => {
        const url = `https://stooq.com/q/l/?s=${symbol}&f=sd2t2ohlcv&h&e=csv`;
        const response = await fetch(url, { cache: "no-store" });
        if (!response.ok) return [];
        return parseCsv(await response.text());
      })
    );
    const assets = responses.flat();
    return NextResponse.json({
      assets: assets.length > 0 ? assets : fallbackAssets,
      ok: true,
      source: "Stooq public CSV"
    });
  } catch (error) {
    return NextResponse.json({
      assets: fallbackAssets,
      error: error instanceof Error ? error.message : "Market data unavailable",
      ok: false,
      source: "Stooq public CSV"
    });
  }
}
