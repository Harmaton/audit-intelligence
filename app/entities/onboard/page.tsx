"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { IconSend, IconSparkle } from "@/components/Icons";
import type {
  Entity,
  EntityType,
  Region,
  RiskLevel,
  Sector,
} from "@/lib/types";

type ChatMessage = {
  role: "bot" | "user" | "system";
  content: string;
};

type StepInput =
  | { kind: "text"; placeholder: string }
  | { kind: "choice"; options: string[] }
  | { kind: "multi"; options: string[] }
  | { kind: "number"; placeholder: string };

type Step = {
  id: string;
  question: string;
  hint?: string;
  input: StepInput;
  validate?: (v: string) => string | null;
  transform?: (v: string) => unknown;
};

const TYPE_OPTIONS: EntityType[] = [
  "Ministry",
  "Department",
  "Agency",
  "Public Authority",
  "LGA",
];

const SECTOR_OPTIONS: Sector[] = [
  "Health",
  "Infrastructure",
  "Education",
  "Agriculture",
  "Finance",
  "Energy",
  "Water",
  "Transport",
  "Public Administration",
];

const REGION_OPTIONS: Region[] = [
  "National",
  "Coast",
  "Lake",
  "Capital",
  "North",
  "South",
  "West",
  "SW",
  "Central",
];

const CONNECTION_OPTIONS = [
  "IFMIS",
  "HRIS",
  "Payroll",
  "Procurement",
  "LGRCIS",
  "Project MIS",
  "eFiling",
  "ERP",
  "Billing",
];

const RISK_OPTIONS: RiskLevel[] = ["Low", "Moderate", "High", "Critical"];

const STEPS: Step[] = [
  {
    id: "name",
    question:
      "Let's onboard a new entity. What is the full legal name of the entity you're registering?",
    hint: "E.g. 'Ministry of Lands, Housing and Human Settlements Development'",
    input: { kind: "text", placeholder: "Entity full name…" },
    validate: (v) =>
      v.trim().length < 3 ? "Please provide at least 3 characters." : null,
  },
  {
    id: "type",
    question: "What type of entity is this?",
    input: { kind: "choice", options: TYPE_OPTIONS as unknown as string[] },
  },
  {
    id: "sector",
    question: "Which sector does it primarily operate in?",
    input: { kind: "choice", options: SECTOR_OPTIONS as unknown as string[] },
  },
  {
    id: "region",
    question: "Which audit region does it fall under?",
    input: { kind: "choice", options: REGION_OPTIONS as unknown as string[] },
  },
  {
    id: "budgetTzsB",
    question: "Approximate annual budget, in TZS billions?",
    hint: "Numbers only — e.g. 120 for TZS 120 billion.",
    input: { kind: "number", placeholder: "e.g. 120" },
    transform: (v) => Number(v) || 0,
  },
  {
    id: "riskLevel",
    question: "Initial risk assessment — what's the opening risk level?",
    hint: "Can be revised later by the audit team.",
    input: { kind: "choice", options: RISK_OPTIONS as unknown as string[] },
  },
  {
    id: "contactName",
    question: "Who is the primary contact person for the entity?",
    input: { kind: "text", placeholder: "Full name" },
  },
  {
    id: "contactEmail",
    question: "What email should audit correspondence go to?",
    input: { kind: "text", placeholder: "name@entity.go.tz" },
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? null
        : "That doesn't look like a valid email.",
  },
  {
    id: "dataConnections",
    question: "Which data systems should we connect to first?",
    hint: "Pick any that apply.",
    input: { kind: "multi", options: CONNECTION_OPTIONS },
    transform: (v) => v.split(",").map((s) => s.trim()).filter(Boolean),
  },
];

export default function OnboardEntityPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      content:
        "Hi — I'm the NAOT onboarding assistant. I'll ask a few questions to register a new entity into the Auditor General Intelligence Platform. You can always leave and come back later.",
    },
    { role: "bot", content: STEPS[0].question + (STEPS[0].hint ? ` (${STEPS[0].hint})` : "") },
  ]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [pendingText, setPendingText] = useState("");
  const [pendingMulti, setPendingMulti] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [finished, setFinished] = useState<Entity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const currentStep = STEPS[stepIndex];
  const isDone = stepIndex >= STEPS.length;

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function pushBot(content: string) {
    setMessages((m) => [...m, { role: "bot", content }]);
  }

  function pushUser(content: string) {
    setMessages((m) => [...m, { role: "user", content }]);
  }

  function advance(rawValue: string, displayValue: string) {
    setError(null);
    const step = STEPS[stepIndex];
    if (step.validate) {
      const err = step.validate(rawValue);
      if (err) {
        setError(err);
        return;
      }
    }
    pushUser(displayValue);
    const value = step.transform ? step.transform(rawValue) : rawValue;
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);
    setPendingText("");
    setPendingMulti([]);

    const next = stepIndex + 1;
    setStepIndex(next);
    if (next < STEPS.length) {
      const q = STEPS[next];
      setTimeout(() => {
        pushBot(q.question + (q.hint ? ` (${q.hint})` : ""));
      }, 300);
    } else {
      setTimeout(() => {
        pushBot("Great — I have everything I need. Let me review your submission…");
        submit(newAnswers);
      }, 400);
    }
  }

  async function submit(finalAnswers: Record<string, unknown>) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/entities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalAnswers),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setFinished(data.entity);
      pushBot(
        `Registered ✓ ${data.entity.name} has been added with ID ${data.entity.id}. It's now visible in the Entities & Portals list and the Command Centre counts.`
      );
    } catch (e) {
      pushBot(
        "Something went wrong saving the entity. Please try again, or contact an administrator."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function restart() {
    setMessages([
      {
        role: "bot",
        content:
          "Starting a new onboarding. What's the full legal name of the next entity?",
      },
    ]);
    setStepIndex(0);
    setAnswers({});
    setPendingText("");
    setPendingMulti([]);
    setFinished(null);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Entity onboarding · Chat intake"
        title="Onboard an entity"
        description="A short conversational intake to register a new ministry, agency, department, public authority or LGA into the platform."
        actions={
          <Link
            href="/entities"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/5"
          >
            ← Back to entity list
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Chat column */}
        <div className="relative flex h-[640px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-white/10 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
              <IconSparkle width={18} height={18} />
            </div>
            <div>
              <div className="font-semibold">Onboarding assistant</div>
              <div className="text-xs text-slate-400">
                Step {Math.min(stepIndex + 1, STEPS.length)} of {STEPS.length}
                {isDone && " · review"}
              </div>
            </div>
          </div>

          <div
            ref={feedRef}
            className="flex-1 overflow-y-auto px-4 py-5 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={[
                  "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                  m.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-white/5 text-slate-100",
                ].join(" ")}
              >
                {m.content}
              </div>
            ))}
            {submitting && (
              <div className="mr-auto max-w-[85%] rounded-2xl bg-white/5 px-4 py-2.5 text-sm text-slate-300">
                Saving to registry…
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="border-t border-white/10 p-4">
            {finished ? (
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/entities"
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  View in entity list
                </Link>
                <button
                  onClick={restart}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white hover:bg-white/5"
                >
                  Onboard another
                </button>
              </div>
            ) : isDone ? (
              <div className="text-sm text-slate-400">Submitting…</div>
            ) : currentStep.input.kind === "text" ||
              currentStep.input.kind === "number" ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!pendingText.trim()) return;
                  advance(pendingText, pendingText);
                }}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2"
              >
                <input
                  type={currentStep.input.kind === "number" ? "number" : "text"}
                  value={pendingText}
                  onChange={(e) => setPendingText(e.target.value)}
                  placeholder={currentStep.input.placeholder}
                  className="flex-1 bg-transparent px-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                  aria-label="Send"
                >
                  <IconSend width={16} height={16} />
                </button>
              </form>
            ) : currentStep.input.kind === "choice" ? (
              <div className="flex flex-wrap gap-2">
                {currentStep.input.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => advance(opt, opt)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:border-cyan-400/40 hover:bg-white/10"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap gap-2">
                  {currentStep.input.options.map((opt) => {
                    const active = pendingMulti.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() =>
                          setPendingMulti((p) =>
                            p.includes(opt) ? p.filter((x) => x !== opt) : [...p, opt]
                          )
                        }
                        className={[
                          "rounded-full px-3 py-1.5 text-sm transition",
                          active
                            ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                            : "border border-white/10 bg-white/5 text-white hover:bg-white/10",
                        ].join(" ")}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() =>
                      advance(
                        pendingMulti.join(", "),
                        pendingMulti.length > 0 ? pendingMulti.join(", ") : "None yet"
                      )
                    }
                    className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-1.5 text-sm font-semibold text-white"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => advance("", "None yet")}
                    className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-white hover:bg-white/5"
                  >
                    Skip
                  </button>
                </div>
              </div>
            )}
            {error && (
              <div className="mt-2 text-xs text-red-400">{error}</div>
            )}
          </div>
        </div>

        {/* Summary column */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Entity draft
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <Summary label="Name" value={answers.name as string} />
            <Summary label="Type" value={answers.type as string} />
            <Summary label="Sector" value={answers.sector as string} />
            <Summary label="Region" value={answers.region as string} />
            <Summary
              label="Budget"
              value={
                typeof answers.budgetTzsB === "number"
                  ? `TZS ${(answers.budgetTzsB as number).toLocaleString()}B`
                  : undefined
              }
            />
            <Summary label="Risk level" value={answers.riskLevel as string} />
            <Summary label="Contact" value={answers.contactName as string} />
            <Summary label="Email" value={answers.contactEmail as string} />
            <Summary
              label="Connections"
              value={
                Array.isArray(answers.dataConnections)
                  ? (answers.dataConnections as string[]).join(", ") || "—"
                  : undefined
              }
            />
          </div>

          {finished && (
            <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-200">
              <div className="font-semibold">Registered</div>
              <div className="text-xs text-emerald-300/80">ID: {finished.id}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-white/5 pb-2 last:border-b-0">
      <span className="text-slate-400">{label}</span>
      <span className="max-w-[60%] break-words text-right font-medium text-white">
        {value || <span className="text-slate-500">—</span>}
      </span>
    </div>
  );
}
