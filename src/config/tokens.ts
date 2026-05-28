import type { Address } from "viem";

import { opnChain } from "@/config/chains";

export type DashboardToken = {
  address?: Address;
  chainId: number;
  decimals: number;
  isNative?: boolean;
  name: string;
  symbol: string;
};

export const OPN_TOKEN: DashboardToken = {
  chainId: opnChain.id,
  decimals: 18,
  isNative: true,
  name: "OPN",
  symbol: "OPN"
};

export const USDC_TOKEN: DashboardToken = {
  address: (process.env.NEXT_PUBLIC_OPN_USDC_ADDRESS ||
    "0x0000000000000000000000000000000000000000") as Address,
  chainId: opnChain.id,
  decimals: 6,
  name: "USD Coin",
  symbol: "USDC"
};
