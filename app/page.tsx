"use client";

import { useState } from "react";

import { StatCard, GlowCard } from "@/components/StatCard";
import ModuleCard from "@/components/ModuleCard";
import RiskHeatmap from "@/components/RiskHeatmap";
import AIAuditCopilot from "@/components/AIAuditCopilot";
import { BarChart, LineChart, StackedBarChart } from "@/components/TrendChart";
import {
  seedAlerts,
  seedActions,
  trendOfExceptions,
  recommendationImplementation,
  sectorIntensity,
} from "@/lib/seed";
import Link from "next/link";
import { IconArrowRight, IconPlus } from "@/components/Icons";
import TopFilters from "@/components/TopFilters";

const MODULES = [
  {
    tier: "Tier 1",
    title: "Reconciliation Hub",
    bullets: [
      "Budget vs expenditure reconciliation",
      "Payroll and headcount matching",
      "Procurement 3-way match",
      "Revenue and treasury consistency checks",
    ],
    href: "/reconciliation-hub",
  },
  {
    tier: "Tier 1",
    title: "Recommendation Tracker",
    bullets: [
      "Action assignment and deadlines",
      "Management response workflow",
      "Escalation of long-outstanding items",
      "Implementation evidence library",
    ],
    href: "/recommendations",
  },
  {
    tier: "Tier 2",
    title: "Risk & Intelligence",
    bullets: [
      "AI anomaly detection",
      "Cross-entity pattern analysis",
      "Audit planning prioritisation",
      "Early leakage and control warning signals",
    ],
    href: "/risk-intelligence",
  },
  {
    tier: "Tier 3",
    title: "Value Realisation",
    bullets: [
      "Budget vs output benchmarking",
      "Delivery delay analysis",
      "Project milestone intelligence",
      "Efficiency and impact scorecards",
    ],
    href: "/value-realisation",
  },
  {
    tier: "Tier 1",
    title: "Entity Portal",
    bullets: [
      "Audit readiness dashboard",
      "Submission quality control",
      "Exception resolution workflows",
      "Agency-level control health",
    ],
    href: "/entities",
  },
  {
    tier: "Cross-layer",
    title: "Executive Reporting",
    bullets: [
      "National scorecards",
      "Sector comparison dashboards",
      "Parliament and oversight briefings",
      "Traceable AI-assisted summaries",
    ],
    href: "/executive-reporting",
    cta: "Open briefing",
  },
];

export default function CommandCentrePage() {
  const [sector, setSector] = useState("All sectors");
  const [auditType, setAuditType] = useState("All audit types");

  return (
    <div className="space-y-6">
      <TopFilters
        sector={sector}
        setSector={setSector}
        auditType={auditType}
        setAuditType={setAuditType}
      />

      {/* Hero */}
      <GlowCard>
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Auditor General Intelligence Platform
            </h1>
            <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
              World-class AI-enabled oversight for efficiency, transparency,
              reconciliation and value realisation across Tanzania.
              {sector !== "All sectors" && (
                <>
                  {" "}
                  <span className="text-cyan-300">Filter: {sector}</span>
                </>
              )}
              {auditType !== "All audit types" && (
                <>
                  {" "}
                  <span className="text-cyan-300"> · {auditType}</span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-white/5 px-4 py-2 text-sm">
              23 April 2026
            </span>
            <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
              Pilot view
            </span>
            <Link
              href="/executive-reporting"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-300 hover:to-blue-400"
            >
              Open executive overview
              <IconArrowRight width={16} height={16} />
            </Link>
            <Link
              href="/entities/onboard"
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
            >
              <IconPlus width={16} height={16} />
              Onboard entity
            </Link>
          </div>
        </div>
      </GlowCard>

      {/* Tier 1 Live Value */}
      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 sm:p-7">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
          Tier 1 Live Value
        </div>
        <h2 className="mt-2 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Leadership visibility, reconciliation and action tracking from day
          one.
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          This prototype shows the immediate-value layer first, then expands
          into intelligence, value-for-money analytics and entity-wide
          accountability tools.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Overall risk index"
            value={<span>High</span>}
            sub="Live intelligence"
            accent="red"
            footer="14.6% of all entities at high / critical"
          />
          <StatCard
            label="Entities at high risk"
            value="128"
            sub="+11 vs last month"
            accent="amber"
          />
          <StatCard
            label="Unresolved recommendations"
            value="2,456"
            sub="43 overdue past threshold"
            accent="blue"
          />
          <StatCard
            label="Reconciliation gaps"
            value="TZS 11.3B"
            sub="Across 7 ministries"
            accent="violet"
          />
        </div>
      </section>

      {/* Heatmap + Drivers + Actions */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            National Risk Heatmap
          </div>
          <div className="mt-3">
            <RiskHeatmap />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Top Risk Drivers
          </div>
          <div className="mt-4 space-y-4">
            {[
              { label: "Poor reconciliation", value: 82, color: "#f97316" },
              { label: "Procurement irregularities", value: 74, color: "#f97316" },
              { label: "Payroll anomalies", value: 61, color: "#8b5cf6" },
              { label: "Weak internal controls", value: 58, color: "#22c55e" },
              { label: "Delayed reporting", value: 44, color: "#06b6d4" },
            ].map((d) => (
              <div key={d.label}>
                <div className="mb-1 text-sm font-medium text-slate-800">
                  {d.label}
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${d.value}%`, backgroundColor: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Recent Action Flow
          </div>
          <div className="mt-4 space-y-3">
            {seedActions.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm"
              >
                <span className="text-slate-700">{a.title}</span>
                <span className="shrink-0 text-xs text-slate-500">
                  {a.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trend charts */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Trend of Exceptions
          </div>
          <div className="mt-3 text-sm text-slate-500">Last 6 months</div>
          <div className="mt-2">
            <LineChart data={trendOfExceptions} />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Recommendation Implementation
          </div>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-orange-500" />
              Open
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-sm bg-green-500" />
              Closed
            </span>
          </div>
          <div className="mt-2">
            <StackedBarChart
              data={recommendationImplementation.map((q) => ({
                label: q.quarter,
                open: q.open,
                closed: q.closed,
              }))}
            />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Sector Intensity
          </div>
          <div className="mt-3 text-sm text-slate-500">
            Risk pressure per sector
          </div>
          <div className="mt-2">
            <BarChart
              data={sectorIntensity.map((s) => ({
                label: s.sector.slice(0, 5),
                value: s.intensity,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 sm:p-7">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
          Core Platform Capabilities
        </div>
        <h2 className="mt-2 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          Click into the modules that drive immediate and medium-term value.
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <ModuleCard
              key={m.title}
              tier={m.tier}
              title={m.title}
              bullets={m.bullets}
              href={m.href}
              cta={m.cta}
            />
          ))}
        </div>
      </section>

      {/* AI Audit Copilot */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <AIAuditCopilot />
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 lg:col-span-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Immediate Value
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="italic text-slate-600">Audit findings</span>
              <span className="font-semibold">Live</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="italic text-slate-600">Reconciliation alerts</span>
              <span className="font-semibold">3,782</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <span className="italic text-slate-600">Tracked recommendations</span>
              <span className="font-semibold">8,932</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="italic text-slate-600">High-risk entities</span>
              <span className="font-semibold">128</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Alerts + Platform Benefits */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Recent Alerts
          </div>
          <div className="mt-4 space-y-4">
            {seedAlerts.slice(0, 3).map((a) => (
              <div key={a.id}>
                <div className="font-semibold">{a.title}</div>
                <div className="text-sm text-slate-600">{a.description}</div>
              </div>
            ))}
            <Link
              href="/risk-intelligence"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
            >
              See all alerts
              <IconArrowRight width={14} height={14} />
            </Link>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Platform Benefits
          </div>
          <ul className="mt-4 space-y-3 text-sm">
            <li>Faster audits and less manual evidence chasing.</li>
            <li>Stronger controls through earlier reconciliation.</li>
            <li>Better use of AI for prioritisation, not blind automation.</li>
            <li>Clearer value realisation across public expenditure.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
