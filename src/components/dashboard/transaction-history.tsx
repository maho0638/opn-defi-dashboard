import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { opnChain } from "@/config/chains";

const mockTransactions = [
  { hash: "0x8f149a02", type: "Swap", amount: "120 OPN", status: "Confirmed" },
  { hash: "0x31ad44b1", type: "Receive", amount: "48 USDC", status: "Confirmed" },
  { hash: "0xa771e8c4", type: "Approve", amount: "USDC", status: "Confirmed" },
  { hash: "0x7dd02fc9", type: "Send", amount: "25 OPN", status: "Pending" },
  { hash: "0x62acbe31", type: "Swap", amount: "10 USDC", status: "Confirmed" }
];

export function TransactionHistory() {
  return (
    <Card className="bg-card/80">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Last 5 mock transactions. Explorer links use the configured OPN explorer.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-muted-foreground">
              <tr>
                <th className="px-3 py-3 text-left font-medium">Type</th>
                <th className="px-3 py-3 text-left font-medium">Amount</th>
                <th className="px-3 py-3 text-left font-medium">Status</th>
                <th className="px-3 py-3 text-right font-medium">Hash</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx) => (
                <tr className="border-t border-border" key={tx.hash}>
                  <td className="px-3 py-3 font-medium">{tx.type}</td>
                  <td className="px-3 py-3">{tx.amount}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{tx.status}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <a
                      className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                      href={`${opnChain.blockExplorers.default.url}/tx/${tx.hash}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {tx.hash}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
