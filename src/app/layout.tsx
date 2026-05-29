import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

import type { Metadata, Viewport } from "next";

import { Web3Provider } from "@/components/web3-provider";

export const metadata: Metadata = {
  applicationName: "CodeX-Builder",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CodeX-Builder"
  },
  title: "CodeX-Builder | OPN DeFi Safety Dashboard",
  description: "OPN Chain safety dashboard for wallet checks, transaction inspection, DeFi signals, and feedback.",
  formatDetection: {
    telephone: false
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  colorScheme: "dark",
  initialScale: 1,
  themeColor: "#020617",
  width: "device-width"
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
