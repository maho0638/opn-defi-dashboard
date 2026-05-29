export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type RiskResult = {
  actions: string[];
  findings: string[];
  level: RiskLevel;
  score: number;
  summary: string;
};

const selectors: Record<string, string> = {
  "0x095ea7b3": "ERC-20 approve",
  "0xa22cb465": "setApprovalForAll",
  "0xd505accf": "ERC-20 permit",
  "0x23b872dd": "transferFrom",
  "0xa9059cbb": "ERC-20 transfer",
  "0x38ed1739": "swapExactTokensForTokens"
};

function level(score: number): RiskLevel {
  if (score >= 85) return "Critical";
  if (score >= 65) return "High";
  if (score >= 35) return "Medium";
  return "Low";
}

export function analyzeRiskInput(input: string): RiskResult {
  const value = input.trim();
  const lower = value.toLowerCase();
  const findings: string[] = [];
  const actions: string[] = [];
  let score = value ? 10 : 0;

  if (!value) {
    return {
      actions: ["Paste calldata, a transaction hash, token address, or wallet popup text."],
      findings: ["No input provided."],
      level: "Low",
      score: 0,
      summary: "Waiting for an item to inspect."
    };
  }

  if (/0x[a-fA-F0-9]{64}/.test(value)) {
    findings.push("Transaction hash or 32-byte value detected.");
    actions.push("Open it in the official OPN explorer before trusting it.");
    score += 10;
  }

  if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
    findings.push("EVM address detected.");
    actions.push("Verify whether it is a wallet, token, router, spender, or contract.");
    score += 15;
  }

  const selector = lower.slice(0, 10);
  if (selectors[selector]) {
    findings.push(`Known function selector detected: ${selectors[selector]}.`);
    score += ["0x095ea7b3", "0xa22cb465", "0xd505accf"].includes(selector) ? 45 : 25;
  }

  if (lower.includes("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")) {
    findings.push("Unlimited approval pattern detected.");
    actions.push("Reject unlimited approvals unless the spender is verified and trusted.");
    score += 35;
  }

  if (lower.includes("approve") || lower.includes("approval") || lower.includes("spender")) {
    findings.push("Approval wording detected.");
    actions.push("Check spender address and amount before signing.");
    score += 30;
  }

  if (lower.includes("permit")) {
    findings.push("Permit signature wording detected.");
    actions.push("Treat permit signatures like approvals.");
    score += 35;
  }

  if (lower.includes("bridge")) {
    findings.push("Bridge flow detected.");
    actions.push("Verify source chain, destination chain, recipient, and official URL.");
    score += 25;
  }

  if (lower.includes("airdrop") || lower.includes("claim") || lower.includes("reward")) {
    findings.push("Claim or reward flow detected.");
    actions.push("Confirm the URL and contract before signing.");
    score += 25;
  }

  if (lower.includes("seed phrase") || lower.includes("private key") || lower.includes("recovery phrase")) {
    findings.push("Secret phrase or private key wording detected.");
    actions.push("Never enter a seed phrase or private key into any dApp.");
    score += 85;
  }

  if (lower.includes("tesla") || lower.includes("tsla") || lower.includes("stock") || lower.includes("rwa")) {
    findings.push("Stock or RWA topic detected.");
    actions.push("Keep RWA features read-only until licensed data and verified contracts exist.");
    score += 20;
  }

  if (findings.length === 0) {
    findings.push("No known high-risk pattern detected.");
    actions.push("Still verify chain, contract address, token address, value, and signing text.");
  }

  actions.push("Reject the wallet popup if it is unclear.");

  const finalScore = Math.min(100, Math.max(0, score));
  const finalLevel = level(finalScore);

  return {
    actions,
    findings,
    level: finalLevel,
    score: finalScore,
    summary:
      finalLevel === "Critical"
        ? "Critical risk. Reject this action until every detail is verified."
        : finalLevel === "High"
          ? "High risk. Manual verification is required before signing."
          : finalLevel === "Medium"
            ? "Medium risk. Review the details before continuing."
            : "Low visible risk. Continue only after normal wallet checks."
  };
}
