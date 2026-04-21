"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { LineChart, StackedBarChart } from "@/components/TrendChart";
import {
  recommendationImplementation,
  seedAlerts,
  seedEntities,
  trendOfExceptions,
} from "@/lib/seed";
import { RiskPill } from "@/components/Pill";

export default function ExecutiveReportingPage() {
  const [cycle, setCycle] = useState<"Q1 26" | "Q4 25" | "Annual">("Q1 26");

  const highRisk = useMemo(
    () =>
      seedEntities
        .filter((e) => e.riskLevel === "High" || e.riskLevel === "Critical")
        .slice(0, 5),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Cross-layer · Parliament-ready"
        title="Executive Reporting"
        description="National scorecards, sector comparisons and traceable AI-assisted summaries suitable for parliamentary and oversight briefings."
        actions={
          <div className="inline-flex gap-1 rounded-full bg-white/5 p-1">
            {(["Q1 26", "Q4 25", "Annual"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={[
                  "rounded-full px-4 py-1 text-sm",
                  cycle === c
                    ? "bg-white text-slate-900"
                    : "text-white/80 hover:text-white",
                ].join(" ")}
              >
                {c}
              </button>
            ))}
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 lg:col-span-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Briefing headline
          </div>
          <h2 className="mt-3 text-2xl font-bold leading-snug">
            {cycle === "Q1 26"
              ? "Q1 26 oversight briefing: exceptions down 9%, reconciliation gaps up 22% in TZS value"
              : cycle === "Q4 25"
              ? "Q4 25 oversight briefing: procurement anomalies concentrated in Infrastructure; education sector stable"
              : "Annual oversight briefing: recommendation closure rate at 48%, up 6 points on prior year"}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                What moved
              </div>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>
                  · Critical alerts down in Finance, up in Energy &amp;
                  Infrastructure
                </li>
                <li>· 43 overdue recommendations escalated this cycle</li>
                <li>· 3 ministries moved to enhanced audit watch</li>
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Recommended action
              </div>
              <ul className="mt-2 space-y-1 text-slate-700">
                <li>· Schedule enhanced audit of MoWT by end-May</li>
                <li>· Engage TANESCO on Mwalimu Nyerere closure evidence</li>
                <li>· Publish citizen summary for Q1 26</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-full bg-gradient-to-r from-slate-900 to-blue-900 px-4 py-2 text-sm font-semibold text-white hover:from-blue-900 hover:to-blue-700">
              Download PDF briefing
            </button>
            <button className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
              Export to parliament pack
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Headline KPIs
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span>Overall risk index</span>
              <span className="font-semibold text-red-600">High</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span>Entities at high risk</span>
              <span className="font-semibold">128</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span>Recommendation closure</span>
              <span className="font-semibold">48%</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span>Gap under review</span>
              <span className="font-semibold">TZS 11.3B</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Citizen satisfaction</span>
              <span className="font-semibold text-emerald-600">+4 pts</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Exceptions trend
          </div>
          <div className="mt-3">
            <LineChart data={trendOfExceptions} />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Open vs closed recommendations
          </div>
          <div className="mt-3">
            <StackedBarChart
              data={recommendationImplementation.map((q) => ({
                label: q.quarter,
                open: q.open,
                closed: q.closed,
              }))}
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
          Entities highlighted in this briefing
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2 pr-4">Entity</th>
                <th className="py-2 pr-4">Sector</th>
                <th className="py-2 pr-4">Risk</th>
                <th className="py-2 pr-4">Open recs</th>
                <th className="py-2 pr-4">Gap</th>
              </tr>
            </thead>
            <tbody>
              {highRisk.map((e) => (
                <tr key={e.id} className="border-t border-slate-200">
                  <td className="py-3 pr-4 font-medium">{e.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{e.sector}</td>
                  <td className="py-3 pr-4">
                    <RiskPill level={e.riskLevel} />
                  </td>
                  <td className="py-3 pr-4 tabular-nums">
                    {e.openRecommendations}
                  </td>
                  <td className="py-3 pr-4 tabular-nums">
                    TZS {e.reconciliationGapsTzsB.toFixed(1)}B
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
          AI-assisted summary — fully traceable
        </div>
        <p className="mt-3 text-sm text-slate-700">
          Exceptions trended down 9% versus the prior quarter, driven largely
          by process improvements in the Finance sector. However, the TZS
          value of reconciliation gaps rose 22%, concentrated in two
          ministries. Closure rate climbed to 48% as escalations of overdue
          items forced management responses. Attention is recommended on
          Ministry of Works &amp; Transport and TANESCO.
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full bg-slate-200 px-2.5 py-1">
            Source: Reconciliation Hub
          </span>
          <span className="rounded-full bg-slate-200 px-2.5 py-1">
            Source: Recommendation Tracker
          </span>
          <span className="rounded-full bg-slate-200 px-2.5 py-1">
            Source: Risk &amp; Intelligence
          </span>
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
          Alerts referenced
        </div>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {seedAlerts.slice(0, 4).map((a) => (
            <li key={a.id} className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
              <span>
                <span className="font-semibold">{a.title}</span> — {a.description}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
