"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";

import { opnChain } from "@/config/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "CodeX-Builder",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "OPN_DEV_PROJECT_ID",
  chains: [opnChain] as const,
  ssr: true,
  transports: { [opnChain.id]: http(opnChain.rpcUrls.default.http[0]) }
});
