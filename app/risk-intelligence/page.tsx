"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import TopFilters from "@/components/TopFilters";
import { BarChart } from "@/components/TrendChart";
import { Pill, RiskPill } from "@/components/Pill";
import { seedAlerts, seedEntities, sectorIntensity } from "@/lib/seed";

export default function RiskIntelligencePage() {
  const [sector, setSector] = useState("All sectors");
  const [auditType, setAuditType] = useState("All audit types");
  const [alertLevel, setAlertLevel] = useState<string>("All");

  const filteredAlerts = useMemo(() => {
    if (alertLevel === "All") return seedAlerts;
    return seedAlerts.filter((a) => a.level === alertLevel);
  }, [alertLevel]);

  const highestRiskEntities = useMemo(
    () => [...seedEntities].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6),
    []
  );

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Tier 2 · AI-enabled"
        title="Risk & Intelligence"
        description="Cross-entity anomaly detection, audit planning prioritisation and early warning signals for leakage and weak controls."
      />

      <TopFilters
        sector={sector}
        setSector={setSector}
        auditType={auditType}
        setAuditType={setAuditType}
      />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Live alerts", value: seedAlerts.length.toString(), tone: "text-red-600" },
          { label: "High-risk entities", value: "128", tone: "text-amber-600" },
          { label: "Anomaly patterns", value: "17", tone: "text-violet-600" },
          { label: "Prioritised audits", value: "9", tone: "text-blue-600" },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              {c.label}
            </div>
            <div className={`mt-2 text-3xl font-bold ${c.tone}`}>{c.value}</div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
              Live Alerts
            </div>
            <div className="flex gap-1">
              {["All", "Critical", "High", "Moderate"].map((l) => (
                <button
                  key={l}
                  onClick={() => setAlertLevel(l)}
                  className={[
                    "rounded-full px-3 py-1 text-xs font-medium",
                    alertLevel === l
                      ? "bg-slate-900 text-white"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300",
                  ].join(" ")}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 divide-y divide-slate-200">
            {filteredAlerts.map((a) => (
              <div
                key={a.id}
                className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{a.title}</span>
                    <RiskPill level={a.level} />
                    <Pill tone="slate">{a.type}</Pill>
                  </div>
                  <div className="text-sm text-slate-600">{a.description}</div>
                </div>
                <div className="text-xs text-slate-500 sm:text-right">
                  {a.entitiesAffected} entities · {new Date(a.detectedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Sector Intensity
          </div>
          <div className="mt-3">
            <BarChart
              data={sectorIntensity.map((s) => ({
                label: s.sector.slice(0, 4),
                value: s.intensity,
              }))}
            />
          </div>
          <div className="mt-3 text-xs text-slate-500">
            Scores derived from weighted alert severity × coverage.
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
          Priority entities for enhanced audit
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2 pr-4">Entity</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Sector</th>
                <th className="py-2 pr-4">Risk score</th>
                <th className="py-2 pr-4">Risk level</th>
                <th className="py-2 pr-4">Open recs</th>
              </tr>
            </thead>
            <tbody>
              {highestRiskEntities.map((e) => (
                <tr key={e.id} className="border-t border-slate-200">
                  <td className="py-3 pr-4 font-medium">{e.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{e.type}</td>
                  <td className="py-3 pr-4 text-slate-600">{e.sector}</td>
                  <td className="py-3 pr-4 tabular-nums">{e.riskScore}</td>
                  <td className="py-3 pr-4">
                    <RiskPill level={e.riskLevel} />
                  </td>
                  <td className="py-3 pr-4 tabular-nums">
                    {e.openRecommendations}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
