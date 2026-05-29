import type { Chain } from "viem";

const chainId = Number(process.env.NEXT_PUBLIC_OPN_CHAIN_ID || 984);
const rpcUrl = process.env.NEXT_PUBLIC_OPN_RPC_URL || "https://testnet-rpc.iopn.tech";
const explorerUrl = process.env.NEXT_PUBLIC_OPN_EXPLORER_URL || "https://testnet.iopn.tech";

export const opnChain = {
  id: Number.isFinite(chainId) ? chainId : 984,
  name: "OPN Chain Testnet",
  nativeCurrency: { decimals: 18, name: "OPN", symbol: "OPN" },
  rpcUrls: {
    default: { http: [rpcUrl] },
    public: { http: [rpcUrl] }
  },
  blockExplorers: {
    default: { name: "OPN Explorer", url: explorerUrl }
  },
  testnet: true
} as const satisfies Chain;
