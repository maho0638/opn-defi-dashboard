# CodeX-Builder: OPN DeFi Safety Dashboard

CodeX-Builder is a submission-grade DeFi safety dashboard for OPN Chain builders and early users. It helps users inspect wallet state, OPN network health, risky approvals, calldata, token allowlists, market context, and product feedback before they sign anything.

## Why it matters

Most DeFi losses start before the transaction is mined: unclear wallet prompts, unlimited approvals, fake claim flows, unknown spenders, wrong chain, or users not understanding what they are about to sign. This dashboard focuses on prevention first.

## Scoring alignment

- OPN Chain integration: live OPN RPC health check, Chain ID 984 wallet checks, OPN explorer links, OPN testnet proof contract.
- Technical quality: typed Next.js App Router code, server-side API routes, deterministic risk engine, modular components, safe read-only defaults.
- Product and UX: wallet readiness score, pre-signing checklist, transaction inspector, token allowlist, feedback triage.
- Innovation: one cockpit for OPN safety, DeFi signals, RWA watchlists, and calldata/approval analysis.
- Creator commitment: roadmap, feedback loop, reusable risk rules, and clear next milestones.

## Free public APIs used

- OPN RPC: `https://testnet-rpc.iopn.tech`
- DeFiLlama public API: DeFi TVL snapshot and chain context.
- Stooq public CSV: read-only stock/ETF watchlist for TSLA, NVDA, AAPL, COIN, MSTR, GLD.

No paid API key, no card, and no custody flow is required.

## Core safety features

- Wallet connection through RainbowKit and Wagmi.
- OPN Chain ID check and wrong-network warning.
- Native OPN balance read.
- Optional USDC ERC-20 balance read when a verified address is configured.
- OPN RPC health check for block, gas, latency, and chain ID.
- Transaction inspector for calldata, transaction hashes, EVM addresses, approvals, permits, bridges, claim flows, and possible seed phrase/private key leaks.
- Wallet readiness score and pre-signing checklist.
- Token allowlist with blocked placeholder assets.
- Swap simulator with execution locked until real routing, token validation, and transaction simulation exist.
- Feedback triage stored locally for MVP review.
- Read-only market/RWA watchlist.

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

## Environment

```txt
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_OPN_CHAIN_ID=984
NEXT_PUBLIC_OPN_RPC_URL=https://testnet-rpc.iopn.tech
NEXT_PUBLIC_OPN_EXPLORER_URL=https://testnet.iopn.tech
NEXT_PUBLIC_OPN_USDC_ADDRESS=0x0000000000000000000000000000000000000000
```

## Security posture

This MVP is intentionally read-only by default. It does not execute real swaps, does not request token approvals, does not take custody, and never asks for seed phrases or private keys. Future transaction execution should only be enabled after verified routing, simulation, allowlists, and clear signing summaries are implemented.

## Builder Hub submission

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
