# Builder Hub Upgrade Notes

## What changed

The project was rebuilt from a simple DeFi dashboard into an OPN DeFi Safety Dashboard.

## New value

- Live OPN RPC health checks.
- Wallet readiness and pre-signing checklist.
- Transaction inspector with deterministic risk scoring.
- Approval, permit, bridge, claim, RWA, and seed/private key warning rules.
- Token allowlist and blocked placeholder assets.
- Read-only DeFiLlama and Stooq public API integrations.
- Feedback triage flow for user-reported security/data/product issues.

## Why this should score better

- OPN integration is visible and functional through RPC, Chain ID, explorer, and wallet state.
- Technical quality is stronger because risk rules are isolated in `src/lib/risk-engine.ts`.
- UX is safer because risky actions are inspected before any signing.
- Innovation is clearer because the product is a safety cockpit rather than a generic dashboard.
- Commitment is documented through roadmap, feedback loop, and next implementation milestones.
