# CodeX-Builder: OPN DeFi Safety Dashboard

CodeX-Builder is a DeFi safety cockpit for OPN Chain builders and early users. It helps users inspect wallet readiness, OPN RPC health, risky approvals, calldata, token allowlists, DeFi market context, RWA watchlists, and feedback before they sign anything.

## Scoring Alignment

- OPN Chain integration: live OPN RPC health, Chain ID 984 checks, native OPN balance, OPN explorer-ready architecture.
- Technical quality: typed Next.js App Router, server API routes, deterministic risk engine, safe read-only defaults.
- Product and UX: transaction inspector, readiness score, pre-signing checklist, swap simulator, feedback triage.
- Innovation: one cockpit combining wallet safety, calldata review, DeFi signals, and read-only RWA context.
- Creator commitment: roadmap, feedback loop, and clearly scoped next milestones.

## Free APIs

- OPN RPC: `https://testnet-rpc.iopn.tech`
- DeFiLlama public API: `https://api.llama.fi/v2/chains`
- Stooq public CSV: TSLA, NVDA, AAPL, COIN, MSTR, GLD watchlist

No paid API key, no card, no custody, and no seed phrase flow.

## Security Posture

This MVP is read-only by default. It does not execute swaps, does not request approvals, does not custody funds, and never asks for seed phrases or private keys. Real execution should only be enabled after verified routing, transaction simulation, token allowlists, and clear signing summaries.

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
CodeX-Builder is a DeFi safety dashboard for OPN Chain. It helps users inspect wallet readiness, OPN RPC status, token allowlists, risky approvals, calldata, claim flows, bridge warnings, market context, and feedback before signing. The MVP is read-only by default and keeps swap execution locked until verified routing, simulation, and safety checks are ready.
```

Roadmap:

```txt
May-June 2026: harden OPN RPC checks, improve the transaction inspector, collect reviewer feedback, and add more risk rules.
July-September 2026: add trusted OPN quote previews, transaction simulation, explorer-backed wallet activity, and backend feedback triage.
October-December 2026: integrate audited OPN DeFi protocols, licensed RWA/market data if validated, and contribution docs for other builders.
```
