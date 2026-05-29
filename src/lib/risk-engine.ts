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
  "0x38ed1739": "swapExactTokensForTokens",
  "0x7ff36ab5": "swapExactETHForTokens",
  "0x18cbafe5": "swapExactTokensForETH"
};

function clampScore(score: number) {
  return Math.max(0, Math.min(100, score));
}

function getLevel(score: number): RiskLevel {
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
  let score = 10;

  if (!value) {
    return {
      actions: ["Paste calldata, a transaction hash, a token address, or wallet popup text."],
      findings: ["No input provided."],
      level: "Low",
      score: 0,
      summary: "Waiting for an item to inspect."
    };
  }

  if (/0x[a-fA-F0-9]{64}/.test(value)) {
    findings.push("Transaction hash or 32-byte value detected.");
    actions.push("Open it in the official OPN explorer before trusting the action.");
    score += 10;
  }

  if (/^0x[a-fA-F0-9]{40}$/.test(value)) {
    findings.push("EVM address detected.");
    actions.push("Verify if this address is a wallet, token, router, spender, or contract.");
    score += 15;
  }

  const selector = lower.slice(0, 10);
  if (selectors[selector]) {
    findings.push(`Known function selector detected: ${selectors[selector]}.`);
    score += ["0x095ea7b3", "0xa22cb465", "0xd505accf"].includes(selector) ? 45 : 25;
  }

  if (lower.includes("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")) {
    findings.push("Unlimited max uint approval pattern detected.");
    actions.push("Avoid unlimited approvals unless the spender is verified and trusted.");
    score += 35;
  }

  if (lower.includes("approve") || lower.includes("approval") || lower.includes("spender")) {
    findings.push("Approval wording detected.");
    actions.push("Check spender address and spending amount before signing.");
    score += 30;
  }

  if (lower.includes("permit")) {
    findings.push("Permit signature wording detected.");
    actions.push("Treat permit signatures like approvals; they can grant token spending rights.");
    score += 35;
  }

  if (lower.includes("setapprovalforall")) {
    findings.push("Operator approval wording detected.");
    actions.push("Do not approve all assets for unknown operators.");
    score += 40;
  }

  if (lower.includes("airdrop") || lower.includes("claim") || lower.includes("reward")) {
    findings.push("Claim or reward flow detected.");
    actions.push("Confirm the URL, contract address, and whether signing grants approval.");
    score += 25;
  }

  if (lower.includes("bridge")) {
    findings.push("Bridge flow detected.");
    actions.push("Verify source chain, destination chain, recipient, and official bridge URL.");
    score += 25;
  }

  if (lower.includes("seed phrase") || lower.includes("private key") || lower.includes("recovery phrase")) {
    findings.push("Secret phrase or private key wording detected.");
    actions.push("Never enter a seed phrase or private key into any dApp.");
    score += 85;
  }

  if (/\b([a-z]+ ){11,23}[a-z]+\b/i.test(value)) {
    findings.push("Possible recovery phrase pattern detected.");
    actions.push("Stop immediately and do not paste wallet secrets into websites.");
    score += 85;
  }

  if (lower.includes("tesla") || lower.includes("tsla") || lower.includes("stock") || lower.includes("rwa")) {
    findings.push("Stock or RWA topic detected.");
    actions.push("Keep stock/RWA features read-only until data licensing and verified token contracts are ready.");
    score += 20;
  }

  if (findings.length === 0) {
    findings.push("No known high-risk pattern detected.");
    actions.push("Still verify chain, contract address, token address, value, and signing text.");
  }

  actions.push("If the wallet popup is unclear, reject it and inspect the action first.");

  const finalScore = clampScore(score);
  const level = getLevel(finalScore);

  return {
    actions,
    findings,
    level,
    score: finalScore,
    summary:
      level === "Critical"
        ? "Critical risk. Reject this action until every detail is verified."
        : level === "High"
          ? "High risk. Requires manual verification before signing."
          : level === "Medium"
            ? "Medium risk. Review the details before continuing."
            : "Low visible risk. Continue only after normal wallet checks."
  };
}
