import { NextResponse } from "next/server";

import { opnChain } from "@/config/chains";

export const dynamic = "force-dynamic";

type RpcResponse<T> = {
  error?: { message?: string };
  result?: T;
};

type RpcTransaction = {
  blockNumber: string | null;
  from: string;
  gas: string;
  hash: string;
  input: string;
  nonce: string;
  to: string | null;
  value: string;
};

type RpcReceipt = {
  blockNumber: string;
  contractAddress: string | null;
  gasUsed: string;
  logs: unknown[];
  status: string;
  transactionHash: string;
};

async function rpcCall<T>(method: string, params: unknown[]) {
  const response = await fetch(opnChain.rpcUrls.default.http[0], {
    body: JSON.stringify({ id: 1, jsonrpc: "2.0", method, params }),
    cache: "no-store",
    headers: { "content-type": "application/json" },
    method: "POST"
  });
  if (!response.ok) throw new Error(`RPC ${method} failed`);
  const payload = (await response.json()) as RpcResponse<T>;
  if (payload.error) throw new Error(payload.error.message || `RPC ${method} returned an error`);
  return payload.result;
}

function hexToNumber(value?: string | null) {
  if (!value) return 0;
  return Number.parseInt(value, 16);
}

function hexWeiToOpn(value?: string | null) {
  if (!value) return "0";
  const wei = BigInt(value);
  const weiPerOpn = BigInt("1000000000000000000");
  const whole = wei / weiPerOpn;
  const fraction = (wei % weiPerOpn).toString().padStart(18, "0").slice(0, 5);
  return `${whole}.${fraction}`.replace(/\.?0+$/, "");
}

function explorerUrl(path: "address" | "tx", value: string) {
  return `${opnChain.blockExplorers.default.url}/${path}/${value}`;
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() || "";

  try {
    if (/^0x[a-fA-F0-9]{64}$/.test(query)) {
      const [transaction, receipt] = await Promise.all([
        rpcCall<RpcTransaction | null>("eth_getTransactionByHash", [query]),
        rpcCall<RpcReceipt | null>("eth_getTransactionReceipt", [query])
      ]);

      if (!transaction) {
        return NextResponse.json({
          checks: ["Transaction is not available on the OPN RPC yet."],
          found: false,
          kind: "transaction",
          ok: true,
          riskHints: ["Confirm the hash and wait for indexing before trusting any claim."],
          summary: "Transaction not found."
        });
      }

      const selector = transaction.input && transaction.input !== "0x" ? transaction.input.slice(0, 10) : "native transfer";
      const status =
        receipt?.status === "0x1" ? "success" : receipt?.status === "0x0" ? "failed" : receipt ? "unknown" : "pending";

      return NextResponse.json({
        checks: [
          `From: ${transaction.from}`,
          `To: ${transaction.to || receipt?.contractAddress || "contract creation"}`,
          `Value: ${hexWeiToOpn(transaction.value)} OPN`,
          `Method selector: ${selector}`,
          `Block: ${hexToNumber(transaction.blockNumber || receipt?.blockNumber || "0x0")}`,
          `Status: ${status}`,
          `Logs: ${receipt?.logs?.length || 0}`
        ],
        explorerUrl: explorerUrl("tx", query),
        found: true,
        kind: "transaction",
        ok: true,
        riskHints: [
          selector === "0x095ea7b3" ? "Approval selector detected. Verify spender and amount." : "Review method selector before trusting the action.",
          transaction.to ? "Check whether the destination is a verified contract." : "Contract creation detected. Review source and constructor purpose.",
          receipt?.status === "0x0" ? "Transaction failed. Do not repeat blindly." : "Keep the hash for monitoring and recovery."
        ],
        summary: "Live OPN transaction data loaded."
      });
    }

    if (/^0x[a-fA-F0-9]{40}$/.test(query)) {
      const [balanceHex, code, nonceHex] = await Promise.all([
        rpcCall<string>("eth_getBalance", [query, "latest"]),
        rpcCall<string>("eth_getCode", [query, "latest"]),
        rpcCall<string>("eth_getTransactionCount", [query, "latest"])
      ]);
      const isContract = Boolean(code && code !== "0x");

      return NextResponse.json({
        checks: [
          `Type: ${isContract ? "contract" : "wallet / EOA"}`,
          `Balance: ${hexWeiToOpn(balanceHex)} OPN`,
          `Nonce: ${hexToNumber(nonceHex)}`,
          `Code size: ${isContract ? `${Math.max(0, (code.length - 2) / 2)} bytes` : "0 bytes"}`
        ],
        explorerUrl: explorerUrl("address", query),
        found: true,
        kind: "address",
        ok: true,
        riskHints: [
          isContract ? "Contract address detected. Verify source, owner/admin, and upgradeability before interaction." : "Wallet address detected. Confirm recipient ownership before sending.",
          "Never trust an address from a message without checking the official source.",
          "If this is a spender, compare it against the protocol documentation."
        ],
        summary: "Live OPN address data loaded."
      });
    }

    return NextResponse.json({
      checks: ["Enter a 0x transaction hash or a 0x EVM address."],
      found: false,
      kind: "unknown",
      ok: false,
      riskHints: ["Text-only inspection is still available, but on-chain lookup requires a hash or address."],
      summary: "Unsupported lookup input."
    });
  } catch (error) {
    return NextResponse.json({
      checks: [],
      error: error instanceof Error ? error.message : "OPN lookup failed",
      found: false,
      kind: "unknown",
      ok: false,
      riskHints: ["RPC lookup failed. Keep execution locked and try again later."],
      summary: "On-chain lookup failed."
    });
  }
}
