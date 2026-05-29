import { CalendarClock, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const milestones = [
  {
    date: "May-June 2026",
    items: [
      "Harden OPN RPC checks and explorer links.",
      "Improve transaction inspector coverage for approval and permit flows.",
      "Collect reviewer and early user feedback through the feedback triage panel."
    ]
  },
  {
    date: "July-September 2026",
    items: [
      "Replace simulated swap quotes with trusted OPN liquidity source previews.",
      "Add transaction simulation before any future signing action.",
      "Move feedback from local storage to a real issue triage backend."
    ]
  },
  {
    date: "October-December 2026",
    items: [
      "Add verified protocol modules only for audited or trusted OPN DeFi contracts.",
      "Add licensed market data for stock/RWA watchlists if the product direction is validated.",
      "Publish contribution docs and risk rule tests for other OPN builders."
    ]
  }
];

export function RoadmapPanel() {
  return (
    <Card className="bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-primary" />
          Commitment roadmap
        </CardTitle>
        <CardDescription>Clear next steps for turning the MVP into a durable OPN safety product.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        {milestones.map((milestone) => (
          <div className="rounded-md border border-border bg-background/60 p-4" key={milestone.date}>
            <p className="font-semibold">{milestone.date}</p>
            <div className="mt-4 space-y-3">
              {milestone.items.map((item) => (
                <div className="flex items-start gap-2 text-sm text-muted-foreground" key={item}>
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
