import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

import type { Metadata } from "next";

import { Web3Provider } from "@/components/web3-provider";

export const metadata: Metadata = {
  title: "CodeX-Builder | OPN DeFi Safety Dashboard",
  description: "OPN Chain safety dashboard for wallet checks, transaction inspection, DeFi signals, and feedback."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
