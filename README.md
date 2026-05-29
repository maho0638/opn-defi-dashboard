# CodeX-Builder: OPN DeFi Safety Dashboard

CodeX-Builder is a DeFi safety cockpit for OPN Chain builders and early users. It helps users inspect wallet readiness, OPN RPC health, risky approvals, calldata, bridge routes, liquidity pool risk, token allowlists, yield context, DeFi market context, RWA watchlists, protocol trust, personal intent, and feedback before they sign anything.

## Scoring Alignment

- OPN Chain integration: live OPN RPC health, Chain ID 984 checks, native OPN balance, OPN explorer-ready architecture.
- Technical quality: typed Next.js App Router, server API routes, deterministic risk engine, safe read-only defaults.
- Product and UX: transaction inspector, readiness score, pre-signing checklist, swap simulator, bridge risk lab, LP risk lab, feedback triage, and recovery playbooks.
- Innovation: intent firewall, pre-signing intent receipts, protocol trust scoring, DeFi blind-spot mapping, and one cockpit combining wallet safety, calldata review, bridge safety, approvals, LP risk, yield radar, DeFi signals, and read-only RWA context.
- Creator commitment: roadmap, feedback loop, and clearly scoped next milestones.

## Differentiator

Most DeFi interfaces optimize for execution: swap, route, bridge, deposit, or yield. CodeX-Builder focuses on the missing layer around execution:

- Intent firewall: users define personal risk limits before a wallet popup appears.
- Pre-signing intent receipt: users compare the final wallet popup against their own intended action.
- Protocol trust score: protocols must pass source, audit, timelock, admin-key, bug-bounty, and oracle checks before deeper integration.
- Post-signing recovery playbook: users get revoke, monitor, and escalation steps after approval, bridge, swap, or LP actions.
- DeFi blind-spot map: bridge recipients, unlimited approvals, proxy/admin risk, LP exit risk, RWA legality, and plain-language signing are treated as product surfaces.

## Free APIs

- OPN RPC: `https://testnet-rpc.iopn.tech`
- DeFiLlama public API: `https://api.llama.fi/v2/chains`
- DeFiLlama Yields API: `https://yields.llama.fi/pools`
- Stooq public CSV: TSLA, NVDA, AAPL, COIN, MSTR, GLD watchlist

No paid API key, no card, no custody, and no seed phrase flow.

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
CodeX-Builder is a DeFi safety dashboard for OPN Chain. It helps users inspect wallet readiness, OPN RPC status, token allowlists, risky approvals, calldata, claim flows, bridge warnings, LP risk, yield context, market context, protocol trust, personal intent, and feedback before signing. The MVP is read-only by default and keeps swap, bridge, approval, LP, and yield execution locked until verified routing, simulation, allowance reading, and safety checks are ready.
```

Roadmap:

```txt
May-June 2026: harden OPN RPC checks, improve the transaction inspector, add intent receipts, expand protocol trust scoring, collect reviewer feedback, and add more risk rules.
July-September 2026: add trusted OPN quote previews, transaction simulation, allowance reading, explorer-backed wallet activity, bridge recipient verification, and backend feedback triage.
October-December 2026: integrate audited OPN DeFi protocols, policy-based signing blocks, bridge verification, licensed RWA/market data if validated, and contribution docs for other builders.
```
