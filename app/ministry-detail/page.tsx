"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { RiskPill, StatusPill } from "@/components/Pill";
import { BarChart, LineChart } from "@/components/TrendChart";
import {
  seedRecommendations,
  seedReconciliation,
  trendOfExceptions,
} from "@/lib/seed";
import type { Entity } from "@/lib/types";

export default function MinistryDetailPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    fetch("/api/entities", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const list: Entity[] = d.entities || [];
        setEntities(list);
        if (!selected && list.length > 0) setSelected(list[0].id);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const current = useMemo(
    () => entities.find((e) => e.id === selected) || entities[0],
    [entities, selected]
  );

  const recs = current
    ? seedRecommendations.filter((r) => r.entityId === current.id)
    : [];
  const recons = current
    ? seedReconciliation.filter((r) => r.entityId === current.id)
    : [];

  // Generate a simple deterministic trend from the entity's risk score
  const entityTrend = useMemo(() => {
    if (!current) return trendOfExceptions;
    const base = current.riskScore;
    return trendOfExceptions.map((t, i) => ({
      label: t.label,
      value: Math.max(
        5,
        Math.round(base + Math.sin(i + base / 17) * 14 + (i - 3) * 2)
      ),
    }));
  }, [current]);

  if (!current) {
    return (
      <div className="space-y-6">
        <PageHeader
          kicker="Ministry Detail"
          title="Ministry / Entity Detail"
          description="Drill into a specific entity to see all audit intelligence in one view."
        />
        <div className="rounded-2xl bg-white/5 p-8 text-center text-slate-400">
          Loading entity…
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Ministry Detail"
        title={current.name}
        description={`${current.type} · ${current.sector} · ${current.region} zone · Last audit ${current.lastAudit}`}
        actions={
          <select
            value={current.id}
            onChange={(e) => setSelected(e.target.value)}
            className="rounded-full bg-white/10 px-4 py-2 text-sm text-white focus:outline-none"
          >
            {entities.map((e) => (
              <option key={e.id} value={e.id} className="bg-slate-900">
                {e.name}
              </option>
            ))}
          </select>
        }
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Budget" value={`TZS ${current.budgetTzsB.toLocaleString()}B`} tone="text-blue-600" />
        <Stat label="Risk score" value={`${current.riskScore}`} tone="text-amber-600" />
        <Stat label="Open recs" value={`${current.openRecommendations}`} tone="text-violet-600" />
        <Stat
          label="Recon gaps"
          value={`TZS ${current.reconciliationGapsTzsB.toFixed(1)}B`}
          tone="text-red-600"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 lg:col-span-2">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Risk trend (projection)
          </div>
          <div className="mt-3">
            <LineChart data={entityTrend} />
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Snapshot
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <Row label="Entity type" value={current.type} />
            <Row label="Region" value={current.region} />
            <Row
              label="Risk level"
              value={<RiskPill level={current.riskLevel} />}
            />
            <Row label="Contact" value={current.contactName ?? "—"} />
            <Row label="Email" value={current.contactEmail ?? "—"} />
            <Row
              label="Connections"
              value={(current.dataConnections ?? []).join(", ") || "—"}
            />
            <Row
              label="Closed recs"
              value={current.closedRecommendations.toString()}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Recommendations for this entity
          </div>
          {recs.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No recommendations on file.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {recs.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill status={r.status} />
                    <span className="text-xs text-slate-500">
                      Due {r.dueDate}
                    </span>
                  </div>
                  <div className="mt-1 font-semibold">{r.title}</div>
                  <div className="text-sm text-slate-600">{r.owner}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
            Reconciliation items
          </div>
          {recons.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No reconciliation items on file.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {recons.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.category}</span>
                    <StatusPill status={r.status} />
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    Gap: TZS {r.gapTzsB.toFixed(2)}B · Detected{" "}
                    {r.detectedDate}
                  </div>
                  <div className="text-sm text-slate-700">{r.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
          Spend split (illustrative)
        </div>
        <div className="mt-3">
          <BarChart
            data={[
              { label: "Ops", value: Math.round(current.budgetTzsB * 0.35) },
              { label: "Payroll", value: Math.round(current.budgetTzsB * 0.28) },
              { label: "Capex", value: Math.round(current.budgetTzsB * 0.22) },
              { label: "Grants", value: Math.round(current.budgetTzsB * 0.1) },
              { label: "Other", value: Math.round(current.budgetTzsB * 0.05) },
            ]}
            color="#6366f1"
          />
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

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  );
}
