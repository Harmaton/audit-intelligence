"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Pill, StatusPill } from "@/components/Pill";
import { seedEntities, seedRecommendations } from "@/lib/seed";

const STATUSES = [
  "All",
  "Open",
  "In Progress",
  "Implemented",
  "Overdue",
] as const;

export default function RecommendationsPage() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return seedRecommendations.filter((r) => {
      const statusOk = status === "All" || r.status === status;
      const q = query.toLowerCase();
      const qOk =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q);
      return statusOk && qOk;
    });
  }, [status, query]);

  const counts = {
    open: seedRecommendations.filter((r) => r.status === "Open").length,
    inProgress: seedRecommendations.filter((r) => r.status === "In Progress")
      .length,
    implemented: seedRecommendations.filter((r) => r.status === "Implemented")
      .length,
    overdue: seedRecommendations.filter((r) => r.status === "Overdue").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Tier 1 · Accountability"
        title="Recommendation Tracker"
        description="Every recommendation owned, dated, tracked. Evidence library and escalation built in."
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Open" value={counts.open} tone="text-blue-600" />
        <Stat label="In progress" value={counts.inProgress} tone="text-amber-600" />
        <Stat label="Implemented" value={counts.implemented} tone="text-emerald-600" />
        <Stat label="Overdue" value={counts.overdue} tone="text-red-600" />
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium",
                  status === s
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300",
                ].join(" ")}
              >
                {s}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or owner…"
            className="w-full max-w-xs rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm focus:border-blue-500 focus:outline-none sm:w-64"
          />
        </div>

        <div className="mt-4 space-y-2">
          {filtered.map((r) => {
            const ent = seedEntities.find((e) => e.id === r.entityId);
            const isOpen = expanded === r.id;
            return (
              <div
                key={r.id}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  className="flex w-full flex-wrap items-start justify-between gap-3 text-left"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={r.status} />
                      <Pill
                        tone={
                          r.severity === "Critical"
                            ? "red"
                            : r.severity === "High"
                            ? "amber"
                            : r.severity === "Medium"
                            ? "blue"
                            : "slate"
                        }
                      >
                        {r.severity}
                      </Pill>
                      <span className="text-xs text-slate-500">
                        Due {r.dueDate}
                      </span>
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {r.title}
                    </div>
                    <div className="text-sm text-slate-600">
                      {ent?.name} · {r.owner}
                    </div>
                  </div>
                  <span className="text-sm text-slate-400">
                    {isOpen ? "Hide" : "Details"}
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 grid grid-cols-1 gap-3 border-t border-slate-200 pt-3 text-sm sm:grid-cols-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500">
                        Description
                      </div>
                      <div>{r.description}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500">
                        Created
                      </div>
                      <div>{r.createdDate}</div>
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500">
                        Actions
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500">
                          Escalate
                        </button>
                        <button className="rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100">
                          Add evidence
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              No recommendations match your filters.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "text-slate-900",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-4 text-slate-900">
      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
        {label}
      </div>
      <div className={`mt-1 text-3xl font-bold tabular-nums ${tone}`}>
        {value}
      </div>
    </div>
  );
}
