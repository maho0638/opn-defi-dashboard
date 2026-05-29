import { NextResponse } from "next/server";

import { opnChain } from "@/config/chains";

export const dynamic = "force-dynamic";

async function rpcCall(method: string) {
  const response = await fetch(opnChain.rpcUrls.default.http[0], {
    body: JSON.stringify({ id: 1, jsonrpc: "2.0", method, params: [] }),
    cache: "no-store",
    headers: { "content-type": "application/json" },
    method: "POST",
    signal: AbortSignal.timeout(8000)
  });

  if (!response.ok) throw new Error(`RPC ${method} failed`);
  const payload = (await response.json()) as { result?: string };
  return payload.result || "0x0";
}

export async function GET() {
  const startedAt = Date.now();

  try {
    const [chainIdHex, blockHex, gasHex] = await Promise.all([
      rpcCall("eth_chainId"),
      rpcCall("eth_blockNumber"),
      rpcCall("eth_gasPrice")
    ]);

    return NextResponse.json({
      blockNumber: Number.parseInt(blockHex, 16),
      chainId: Number.parseInt(chainIdHex, 16),
      gasGwei: Number.parseInt(gasHex, 16) / 1e9,
      latencyMs: Date.now() - startedAt,
      ok: true,
      rpcUrl: opnChain.rpcUrls.default.http[0]
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "OPN RPC check failed",
        ok: false,
        rpcUrl: opnChain.rpcUrls.default.http[0]
      },
      { status: 200 }
    );
  }
}
