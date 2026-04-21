"use client";

import { useState } from "react";
import { IconSend, IconSparkle } from "./Icons";

const SUGGESTIONS = [
  "Summarize current national risk view",
  "Compare this cycle with prior year",
  "Find recurring issues across entities",
  "Draft executive audit briefing",
];

const CANNED: Record<string, string> = {
  "Summarize current national risk view":
    "Across 873 connected entities, overall risk is HIGH. Top drivers: procurement irregularities (14 entities), reconciliation gaps > TZS 1.7B (7 entities), and payroll anomalies concentrated in the Lake zone. 128 entities sit in the high-risk bucket — concentrated in Infrastructure (34%), Energy (18%) and Health (15%).",
  "Compare this cycle with prior year":
    "Exceptions ↓ 9% vs last April, but TZS value of reconciliation gaps ↑ 22%. Recommendation closure rate climbed to 48% (from 42%). Critical alerts dropped in Finance, rose in Energy and Infrastructure.",
  "Find recurring issues across entities":
    "Repeat patterns: (1) invoice duplication in 12 ministries with shared suppliers, (2) procurement split-order at Mwanza CC and Arusha DC (18 cases), (3) payroll ghost accounts across 3 TANROADS regional offices. All three have been flagged in prior cycles.",
  "Draft executive audit briefing":
    "Draft ready. Highlights: 3 ministries moved to enhanced audit watch, TZS 11.3B in reconciliation gaps under active review, 43 overdue recommendations escalated. Click 'Open briefing' to open in Executive Reporting.",
};

type Message = { role: "user" | "copilot"; content: string };

export default function AIAuditCopilot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    const response =
      CANNED[text] ??
      "Based on current data, I can help with risk summaries, recurring issue detection, entity comparisons and executive briefings. Try one of the suggestions above, or ask a specific question.";
    setMessages((m) => [
      ...m,
      { role: "user", content: text },
      { role: "copilot", content: response },
    ]);
    setInput("");
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-white shadow-xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-2xl font-bold">AI Audit Copilot</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-violet-600/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
            <IconSparkle width={12} height={12} />
            Beta
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          A governed internal assistant for summarisation, recurring issue
          detection, entity comparisons and executive briefings.
        </p>

        <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
          {messages.length === 0 && (
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white transition hover:border-cyan-400/40 hover:bg-white/10"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={[
                "rounded-xl px-4 py-2.5 text-sm",
                m.role === "user"
                  ? "ml-auto max-w-[85%] bg-blue-600/80 text-white"
                  : "mr-auto max-w-[92%] bg-white/5 text-slate-100",
              ].join(" ")}
            >
              {m.content}
            </div>
          ))}
        </div>

        <form
          className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Copilot…"
            className="flex-1 bg-transparent px-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-300 hover:to-blue-400"
            aria-label="Send message"
          >
            <IconSend width={16} height={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
