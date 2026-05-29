# Updated Submission Text

## Project name

CodeX-Builder

## One-line slogan

A DeFi safety cockpit for OPN Chain builders and early users.

## Description

CodeX-Builder is a DeFi safety dashboard for OPN Chain. It helps users inspect wallet readiness, OPN RPC status, transaction hashes, addresses, token allowlists, risky approvals, calldata, claim flows, bridge warnings, LP risk, yield context, market context, protocol trust, personal intent, and feedback before signing. The MVP is read-only by default and keeps swap, bridge, approval, LP, and yield execution locked until verified routing, simulation, allowance reading, and safety checks are ready. It includes a reviewer proof pack that maps the app directly to the five scoring criteria and uses mobile-friendly controls for Android/iOS browsers.

The differentiator is the missing layer around execution: live OPN transaction/address lookup, an intent firewall, a pre-signing intent receipt, protocol trust scoring, a post-signing recovery playbook, a reviewer proof pack, a rubric coverage map, and a DeFi blind-spot map for risks that normal swap and bridge apps often leave to the user.

## Contracts

CodeXBuilderProof was deployed on OPN Chain Testnet as lightweight proof linking the Builder Hub submission to the live demo and GitHub repository.

Proof contract: 0x3cbdf2990327709ec0d1d41c50c006be74c73890

## Rubric coverage

30% OPN Chain integration: live Chain ID 984 RPC, wallet network checks, native OPN balance, tx/address lookup, explorer links, and deployed proof contract.
25% Technical quality: Next.js App Router, typed API routes, deterministic risk engine, safe fallbacks, Netlify dependency shim, and locked execution.
20% Product and UX: single cockpit flow, mobile-friendly controls, clear safety states, feedback triage, and readable risk findings.
15% Innovation: intent firewall, intent receipt, protocol trust score, recovery playbook, and bridge/LP/yield blind-spot coverage.
10% Creator commitment: no paid dependencies, roadmap, reviewer proof pack, safe MVP scope, and clear path to real simulation and audited modules.

## Roadmap

May-June 2026: harden OPN RPC checks, improve live transaction/address lookup, add intent receipts, expand protocol trust scoring, collect reviewer feedback, and add more risk rules.

July-September 2026: add trusted OPN quote previews, transaction simulation, allowance reading, explorer-backed wallet activity, bridge recipient verification, and backend feedback triage.

October-December 2026: integrate audited OPN DeFi protocols, policy-based signing blocks, bridge verification, licensed RWA/market data if validated, and contribution docs for other builders.
