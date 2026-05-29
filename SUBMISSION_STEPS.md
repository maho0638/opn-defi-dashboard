# Updated Submission Text

## Project name

CodeX-Builder

## One-line slogan

A DeFi safety cockpit for OPN Chain builders and early users.

## Description

CodeX-Builder is a DeFi safety dashboard for OPN Chain. It helps users inspect wallet readiness, OPN RPC status, token allowlists, risky approvals, calldata, claim flows, bridge warnings, LP risk, yield context, market context, protocol trust, personal intent, and feedback before signing. The MVP is read-only by default and keeps swap, bridge, approval, LP, and yield execution locked until verified routing, simulation, allowance reading, and safety checks are ready.

The differentiator is the missing layer around execution: an intent firewall, a pre-signing intent receipt, protocol trust scoring, a post-signing recovery playbook, and a DeFi blind-spot map for risks that normal swap and bridge apps often leave to the user.

## Contracts

CodeXBuilderProof was deployed on OPN Chain Testnet as lightweight proof linking the Builder Hub submission to the live demo and GitHub repository.

## Roadmap

May-June 2026: harden OPN RPC checks, improve the transaction inspector, add intent receipts, expand protocol trust scoring, collect reviewer feedback, and add more risk rules.

July-September 2026: add trusted OPN quote previews, transaction simulation, allowance reading, explorer-backed wallet activity, bridge recipient verification, and backend feedback triage.

October-December 2026: integrate audited OPN DeFi protocols, policy-based signing blocks, bridge verification, licensed RWA/market data if validated, and contribution docs for other builders.
