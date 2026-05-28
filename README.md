# CodeX-Builder: OPN Chain DeFi Dashboard

Frontend-first DeFi dashboard for OPN Chain builders and early users.

## What is included

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Wagmi v2
- Viem
- RainbowKit
- TanStack Query
- Zustand
- OPN Chain placeholder config
- Native OPN balance card
- Optional USDC ERC-20 balance read
- Mock swap interface
- Mock recent activity table

## Folder structure

```txt
src/app/                  App Router pages, layout, global CSS
src/components/dashboard/ Balance, swap, transaction widgets
src/components/site/      Header
src/components/ui/        shadcn-style UI primitives
src/config/               OPN chain, token, Wagmi config
src/providers/            Web3 provider composition
src/store/                Zustand swap state
src/lib/                  Shared utilities
```

## Setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

## OPN Chain placeholders

Update `.env.local` before production/demo submission:

```txt
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_OPN_CHAIN_ID=984
NEXT_PUBLIC_OPN_RPC_URL=https://rpc-testnet.opnchain.example
NEXT_PUBLIC_OPN_EXPLORER_URL=https://explorer-testnet.opnchain.example
NEXT_PUBLIC_OPN_USDC_ADDRESS=0x0000000000000000000000000000000000000000
```

## Builder Hub submit text

Project name:

```txt
CodeX-Builder
```

One-line slogan:

```txt
A lightweight DeFi dashboard for OPN Chain builders and early users.
```

Short description:

```txt
CodeX-Builder is a frontend-first DeFi dashboard for OPN Chain. The MVP connects wallets through RainbowKit, displays native OPN and optional USDC balances, provides a mock swap interface, and shows recent activity in a clean responsive dark UI. Smart contract execution is intentionally out of scope for this first submission and planned for the next milestone.
```

Contracts:

```txt
No deployed contracts yet. This MVP is frontend-first with mocked swap flow; contract integration is planned in the next milestone.
```

Roadmap:

```txt
1. Replace placeholder OPN Chain RPC, explorer, and token addresses with official values.
2. Add real swap routing and transaction simulation.
3. Add transaction history from an explorer/indexer API.
4. Add portfolio analytics and token allowlist management.
5. Add audited smart contracts or integrate trusted OPN Chain DeFi protocols.
```
