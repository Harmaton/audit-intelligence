"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { StatusPill } from "@/components/Pill";
import { seedEntities, seedReconciliation } from "@/lib/seed";

const CATEGORIES = [
  "All",
  "Budget vs Expenditure",
  "Payroll",
  "Procurement",
  "Revenue",
  "Treasury",
] as const;

export default function ReconciliationHubPage() {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [status, setStatus] = useState<string>("All");

  const filtered = useMemo(() => {
    return seedReconciliation.filter(
      (r) =>
        (cat === "All" || r.category === cat) &&
        (status === "All" || r.status === status)
    );
  }, [cat, status]);

  const totalGap = filtered.reduce((s, r) => s + r.gapTzsB, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Tier 1 · Immediate value"
        title="Reconciliation Hub"
        description="Budget vs expenditure, payroll vs headcount, 3-way procurement and treasury consistency — all tracked in one place."
      />

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Open items" value={`${filtered.length}`} />
        <Stat label="Total gap" value={`TZS ${totalGap.toFixed(1)}B`} tone="text-red-600" />
        <Stat label="Under review" value={`${filtered.filter((r) => r.status === "Under Review").length}`} />
        <Stat label="Cleared this month" value="24" tone="text-emerald-600" />
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
              Reconciliation Queue
            </div>
            <div className="text-sm text-slate-500">
              Auto-flagged by the engine, routed to the owning entity.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              label="Category"
              value={cat}
              onChange={(v) => setCat(v as (typeof CATEGORIES)[number])}
              options={[...CATEGORIES]}
            />
            <Select
              label="Status"
              value={status}
              onChange={setStatus}
              options={["All", "Flagged", "Under Review", "Cleared", "Escalated"]}
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-2 pr-4">Entity</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Gap (TZS B)</th>
                <th className="py-2 pr-4">Detected</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const ent = seedEntities.find((e) => e.id === r.entityId);
                return (
                  <tr key={r.id} className="border-t border-slate-200 align-top">
                    <td className="py-3 pr-4 font-medium">{ent?.name ?? r.entityId}</td>
                    <td className="py-3 pr-4 text-slate-600">{r.category}</td>
                    <td className="py-3 pr-4 tabular-nums">{r.gapTzsB.toFixed(2)}</td>
                    <td className="py-3 pr-4 text-slate-600">{r.detectedDate}</td>
                    <td className="py-3 pr-4">
                      <StatusPill status={r.status} />
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{r.description}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    No items match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700">
      <span className="text-slate-500">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
