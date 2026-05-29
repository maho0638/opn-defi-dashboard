# CodeX-Builder: OPN DeFi Safety Dashboard

CodeX-Builder is a DeFi safety cockpit for OPN Chain builders and early users. It helps users inspect wallet readiness, OPN RPC health, transaction hashes, addresses, risky approvals, calldata, bridge routes, liquidity pool risk, token allowlists, yield context, DeFi market context, RWA watchlists, protocol trust, personal intent, and feedback before they sign anything.

## Scoring Alignment

- OPN Chain integration: live OPN RPC health, Chain ID 984 checks, native OPN balance, transaction/address lookup through OPN RPC, and OPN explorer-ready architecture.
- Technical quality: typed Next.js App Router, server API routes, deterministic risk engine, safe read-only defaults.
- Product and UX: transaction inspector, readiness score, pre-signing checklist, swap simulator, bridge risk lab, LP risk lab, feedback triage, recovery playbooks, and mobile-friendly controls.
- Innovation: intent firewall, pre-signing intent receipts, protocol trust scoring, DeFi blind-spot mapping, and one cockpit combining wallet safety, calldata review, bridge safety, approvals, LP risk, yield radar, DeFi signals, and read-only RWA context.
- Creator commitment: reviewer proof pack, roadmap, feedback loop, and clearly scoped next milestones.

## Rubric Coverage

- 30% OPN Chain integration: live Chain ID 984 RPC, wallet network checks, native OPN balance, tx/address lookup, explorer links, and deployed proof contract.
- 25% Technical quality: Next.js App Router, typed API routes, deterministic risk engine, safe fallbacks, Netlify dependency shim, and locked execution.
- 20% Product and UX: single cockpit flow, mobile-friendly controls, clear safety states, feedback triage, and readable risk findings.
- 15% Innovation: intent firewall, intent receipt, protocol trust score, recovery playbook, and bridge/LP/yield blind-spot coverage.
- 10% Creator commitment: no paid dependencies, roadmap, reviewer proof pack, safe MVP scope, and clear path to real simulation and audited modules.

## Differentiator

Most DeFi interfaces optimize for execution: swap, route, bridge, deposit, or yield. CodeX-Builder focuses on the missing layer around execution:

- Intent firewall: users define personal risk limits before a wallet popup appears.
- Pre-signing intent receipt: users compare the final wallet popup against their own intended action.
- Live on-chain lookup: transaction hashes and addresses are checked directly through OPN RPC before a user trusts a prompt.
- Protocol trust score: protocols must pass source, audit, timelock, admin-key, bug-bounty, and oracle checks before deeper integration.
- Post-signing recovery playbook: users get revoke, monitor, and escalation steps after approval, bridge, swap, or LP actions.
- DeFi blind-spot map: bridge recipients, unlimited approvals, proxy/admin risk, LP exit risk, RWA legality, and plain-language signing are treated as product surfaces.
- Reviewer proof pack: the dashboard maps each scoring category to visible product evidence.
- Mobile readiness: responsive single-column layout, touch-friendly controls, safe-area handling, dark theme metadata, and installable web-app manifest for Android/iOS browsers.

## Free APIs

- OPN RPC: `https://testnet-rpc.iopn.tech`
- DeFiLlama public API: `https://api.llama.fi/v2/chains`
- DeFiLlama Yields API: `https://yields.llama.fi/pools`
- Stooq public CSV: TSLA, NVDA, AAPL, COIN, MSTR, GLD watchlist

No paid API key, no card, no custody, and no seed phrase flow.

## OPN Proof

- Live demo: `https://opn-defi-dashboard.netlify.app/`
- Repository: `https://github.com/maho0638/opn-defi-dashboard`
- Proof contract: `0x3cbdf2990327709ec0d1d41c50c006be74c73890`

## Reviewer Verification Path

1. Open the live demo and confirm the OPN health panel shows Chain ID `984`, latest block, gas, and latency.
2. Open the reviewer evidence snapshot and verify the live RPC endpoint, source repository, and proof contract links.
3. Use the transaction inspector examples: unlimited approval, bridge claim, and RWA token.
4. Confirm execution is intentionally locked in the swap simulator, bridge lab, LP lab, approval hygiene, and yield sections.
5. Review the rubric coverage map and proof pack to match visible product evidence to the five scoring categories.

## Risk Engine Evidence

The risk engine is deterministic and local. It does not depend on paid APIs or private user data.

- Unlimited approval calldata should produce a high or critical approval warning.
- Bridge claim text should trigger bridge, claim, and approval checks.
- RWA/stock token text should remain read-only and warn about verified contracts and licensed data.
- Empty input returns a safe waiting state instead of failing.
- Unknown text still asks the user to verify chain, contract, token, value, and wallet prompt details.

## Known Limitations

- Real swaps, bridges, approvals, LP deposits, and yield deposits are locked by design.
- The app does not custody assets, request seed phrases, or ask users to sign transactions.
- OPN-specific routing and liquidity integrations are planned after trusted protocols and quote sources are available.
- Allowance reading, revoke flows, and transaction simulation are roadmap items, not hidden production features.
- Market and yield panels use public read-only APIs for context, not trading execution.

## Security Posture

This MVP is read-only by default. It does not execute swaps, does not bridge funds, does not request approvals, does not custody funds, and never asks for seed phrases or private keys. Real execution should only be enabled after verified routing, bridge verification, transaction simulation, token allowlists, and clear signing summaries.

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

## Builder Hub Text

Project name:

```txt
CodeX-Builder
```

One-line slogan:

```txt
A DeFi safety cockpit for OPN Chain builders and early users.
```

Description:

```txt
CodeX-Builder is a read-only DeFi safety dashboard for OPN Chain builders and early users. It helps users inspect wallet readiness, OPN RPC health, Chain ID 984 status, transaction hashes, addresses, risky approvals, calldata, claim flows, bridge warnings, LP risk, yield context, market context, protocol trust, personal intent, and feedback before signing.

The project integrates OPN Chain through live RPC checks, native OPN balance reading, wallet network validation, transaction/address lookup, explorer links, and an on-chain proof contract. It is designed as a safety layer before execution: swaps, bridges, approvals, LP deposits, and yield actions stay locked until verified routing, simulation, allowance reading, and audited protocol integrations are ready.

The product includes an intent firewall, pre-signing intent receipt, transaction inspector, approval hygiene, bridge risk lab, liquidity risk lab, protocol trust score, recovery playbook, reviewer proof pack, and rubric coverage mapped to the judging criteria.
```

Roadmap:

```txt
May-June 2026: harden OPN RPC checks, improve live transaction/address lookup, expand calldata and approval risk detection, refine the wallet readiness score, collect reviewer feedback, and improve mobile UX.
July-September 2026: add trusted OPN quote previews, transaction simulation, allowance reading, revoke guidance, explorer-backed wallet activity, bridge recipient verification, and backend feedback triage.
October-December 2026: integrate audited OPN DeFi protocols, policy-based signing blocks, verified bridge modules, protocol-specific safety rules, licensed RWA/market data if validated, and contribution docs for other builders.
```
