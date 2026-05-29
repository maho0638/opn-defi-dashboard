"use client";

import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const feedbackTypes = ["Security issue", "Wrong balance", "Bad token label", "API data issue", "UI bug", "Feature request"];

export function FeedbackPanel() {
  const [type, setType] = useState(feedbackTypes[0]);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  function submitFeedback() {
    const item = {
      createdAt: new Date().toISOString(),
      message,
      type
    };
    const existing = JSON.parse(window.localStorage.getItem("opn-dashboard-feedback") || "[]") as unknown[];
    window.localStorage.setItem("opn-dashboard-feedback", JSON.stringify([item, ...existing].slice(0, 25)));
    setMessage("");
    setSaved(true);
  }

  return (
    <Card className="bg-card/85">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Feedback triage
        </CardTitle>
        <CardDescription>Collect safety issues, data mistakes, and UX bugs directly inside the product.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <select
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          onChange={(event) => {
            setType(event.target.value);
            setSaved(false);
          }}
          value={type}
        >
          {feedbackTypes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <textarea
          className="min-h-28 w-full resize-none rounded-md border border-input bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          onChange={(event) => {
            setMessage(event.target.value);
            setSaved(false);
          }}
          placeholder="Describe the issue. Include token address, wallet action, API panel, or page section if relevant."
          value={message}
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">Stored locally for MVP review; backend triage is planned next.</p>
          <Button disabled={message.trim().length < 8} onClick={submitFeedback} type="button">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
        </div>
        {saved ? <p className="text-sm text-primary">Feedback saved locally.</p> : null}
      </CardContent>
    </Card>
  );
}
