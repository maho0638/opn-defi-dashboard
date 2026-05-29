import type { Chain } from "viem";

function readChainId() {
  const value = Number(process.env.NEXT_PUBLIC_OPN_CHAIN_ID);
  return Number.isFinite(value) && value > 0 ? value : 984;
}

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
      http: [process.env.NEXT_PUBLIC_OPN_RPC_URL || "https://testnet-rpc.iopn.tech"]
    },
    public: {
      http: [process.env.NEXT_PUBLIC_OPN_RPC_URL || "https://testnet-rpc.iopn.tech"]
    }
  },
  blockExplorers: {
    default: {
      name: "OPN Explorer",
      url: process.env.NEXT_PUBLIC_OPN_EXPLORER_URL || "https://testnet.iopn.tech"
    }
  },
  testnet: true
} as const satisfies Chain;
