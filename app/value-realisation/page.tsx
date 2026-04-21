"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { BarChart } from "@/components/TrendChart";
import { seedEntities } from "@/lib/seed";

type Project = {
  id: string;
  name: string;
  entity: string;
  budgetTzsB: number;
  spentTzsB: number;
  completionPct: number;
  delayDays: number;
  outputScore: number;
};

const PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Dar–Chalinze expressway Phase 2",
    entity: "Ministry of Works & Transport",
    budgetTzsB: 2100,
    spentTzsB: 1720,
    completionPct: 72,
    delayDays: 118,
    outputScore: 61,
  },
  {
    id: "p2",
    name: "Mwalimu Nyerere Dam final commissioning",
    entity: "TANESCO",
    budgetTzsB: 6400,
    spentTzsB: 6220,
    completionPct: 94,
    delayDays: 45,
    outputScore: 82,
  },
  {
    id: "p3",
    name: "Secondary school construction programme",
    entity: "Ministry of Education",
    budgetTzsB: 380,
    spentTzsB: 265,
    completionPct: 68,
    delayDays: 22,
    outputScore: 74,
  },
  {
    id: "p4",
    name: "Rural water supply expansion",
    entity: "DAWASA",
    budgetTzsB: 140,
    spentTzsB: 89,
    completionPct: 55,
    delayDays: 68,
    outputScore: 58,
  },
  {
    id: "p5",
    name: "Regional hospital refurbishment",
    entity: "Ministry of Health",
    budgetTzsB: 220,
    spentTzsB: 198,
    completionPct: 88,
    delayDays: 10,
    outputScore: 79,
  },
];

export default function ValueRealisationPage() {
  const [view, setView] = useState<"overview" | "projects">("overview");
  const topEntities = useMemo(
    () =>
      [...seedEntities]
        .sort((a, b) => b.budgetTzsB - a.budgetTzsB)
        .slice(0, 7)
        .map((e) => ({ label: e.name.split(" ").slice(0, 2).join(" "), value: e.budgetTzsB })),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Tier 3 · Value for money"
        title="Value Realisation"
        description="Budget vs output benchmarking, delivery delay analysis and efficiency scorecards across major public investment."
      />

      <div className="inline-flex gap-1 rounded-full bg-slate-900/40 p-1">
        {(["overview", "projects"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={[
              "rounded-full px-4 py-1.5 text-sm font-medium capitalize",
              view === v
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                : "text-slate-300 hover:text-white",
            ].join(" ")}
          >
            {v}
          </button>
        ))}
      </div>

      {view === "overview" ? (
        <>
          <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat label="Tracked budget" value="TZS 14,400 B" tone="text-blue-600" />
            <Stat label="Spent to date" value="TZS 9,120 B" tone="text-violet-600" />
            <Stat label="Avg completion" value="73%" tone="text-emerald-600" />
            <Stat label="Delayed projects" value="12" tone="text-red-600" />
          </section>

          <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
              Budget concentration by entity (TZS B)
            </div>
            <div className="mt-3">
              <BarChart data={topEntities} color="#3b82f6" />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Scorecard
              title="Delivery score"
              value="B+"
              description="Average across infrastructure portfolio"
              color="from-blue-500 to-cyan-400"
            />
            <Scorecard
              title="Unit cost index"
              value="1.12"
              description="vs regional peer benchmark (1.00)"
              color="from-amber-500 to-orange-500"
            />
            <Scorecard
              title="Outcome uplift"
              value="+6.4%"
              description="Service access gain from tracked spend"
              color="from-emerald-500 to-green-400"
            />
          </section>
        </>
      ) : (
        <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Major project portfolio
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Project</th>
                  <th className="py-2 pr-4">Entity</th>
                  <th className="py-2 pr-4">Budget</th>
                  <th className="py-2 pr-4">Spent</th>
                  <th className="py-2 pr-4">% complete</th>
                  <th className="py-2 pr-4">Delay</th>
                  <th className="py-2 pr-4">Output</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200">
                    <td className="py-3 pr-4 font-medium">{p.name}</td>
                    <td className="py-3 pr-4 text-slate-600">{p.entity}</td>
                    <td className="py-3 pr-4 tabular-nums">
                      TZS {p.budgetTzsB}B
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      TZS {p.spentTzsB}B
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums">{p.completionPct}%</span>
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${p.completionPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={[
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          p.delayDays > 90
                            ? "bg-red-100 text-red-700"
                            : p.delayDays > 30
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700",
                        ].join(" ")}
                      >
                        {p.delayDays}d
                      </span>
                    </td>
                    <td className="py-3 pr-4 tabular-nums">{p.outputScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "text-slate-900",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-4 text-slate-900">
      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-bold ${tone}`}>{value}</div>
    </div>
  );
}

function Scorecard({
  title,
  value,
  description,
  color,
}: {
  title: string;
  value: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${color} p-5 text-white shadow-lg`}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
        {title}
      </div>
      <div className="mt-2 text-4xl font-bold">{value}</div>
      <div className="mt-2 text-sm text-white/90">{description}</div>
    </div>
  );
}
