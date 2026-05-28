import type { Chain } from "viem";

function readChainId() {
  const value = Number(process.env.NEXT_PUBLIC_OPN_CHAIN_ID);
  return Number.isFinite(value) && value > 0 ? value : 984;
}

// Placeholder OPN Chain config. Replace RPC, explorer, and chain id with official data.
export const opnChain = {
  id: readChainId(),
  name: "OPN Chain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "OPN",
    symbol: "OPN"
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_OPN_RPC_URL || "https://rpc-testnet.opnchain.example"]
    },
    public: {
      http: [process.env.NEXT_PUBLIC_OPN_RPC_URL || "https://rpc-testnet.opnchain.example"]
    }
  },
  blockExplorers: {
    default: {
      name: "OPN Explorer",
      url: process.env.NEXT_PUBLIC_OPN_EXPLORER_URL || "https://explorer-testnet.opnchain.example"
    }
  },
  testnet: true
} as const satisfies Chain;
