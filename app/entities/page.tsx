"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { RiskPill } from "@/components/Pill";
import EntityPortalDrawer from "@/components/EntityPortalDrawer";
import { IconPlus } from "@/components/Icons";
import type { Entity, EntityType } from "@/lib/types";

const TYPES: ("All" | EntityType)[] = [
  "All",
  "Ministry",
  "Department",
  "Agency",
  "Public Authority",
  "LGA",
];

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<(typeof TYPES)[number]>("All");
  const [query, setQuery] = useState("");
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalEntity, setPortalEntity] = useState<Entity | null>(null);

  useEffect(() => {
    fetch("/api/entities", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setEntities(d.entities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return entities.filter((e) => {
      const typeOk = type === "All" || e.type === type;
      const q = query.trim().toLowerCase();
      const qOk =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.sector.toLowerCase().includes(q);
      return typeOk && qOk;
    });
  }, [entities, type, query]);

  const onboardedNew = entities.filter((e) => e.onboardedViaPlatform);

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Tier 1 · Entity Portal"
        title="Entities & Portals"
        description="Ministries, agencies and LGAs each get their own operational accountability workspace. Onboard new entities to extend coverage."
        actions={
          <>
            <Link
              href="/entities/onboard"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-300 hover:to-blue-400"
            >
              <IconPlus width={16} height={16} />
              Onboard an entity
            </Link>
            <button
              onClick={() => {
                setPortalEntity(null);
                setPortalOpen(true);
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/5"
            >
              About the Entity Portal
            </button>
          </>
        }
      />

      {onboardedNew.length > 0 && (
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-cyan-100">
          <div className="text-sm font-semibold">
            {onboardedNew.length} entity
            {onboardedNew.length > 1 ? "ies" : ""} onboarded via the platform
          </div>
          <div className="mt-1 text-xs text-cyan-200/80">
            {onboardedNew
              .slice(-3)
              .map((e) => e.name)
              .join(" · ")}
          </div>
        </div>
      )}

      <section className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={[
                  "rounded-full px-3 py-1 text-xs font-medium",
                  type === t
                    ? "bg-slate-900 text-white"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search entities…"
            className="w-full max-w-xs rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm focus:border-blue-500 focus:outline-none sm:w-64"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading entities…
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Sector</th>
                  <th className="py-2 pr-4">Region</th>
                  <th className="py-2 pr-4">Budget (TZS B)</th>
                  <th className="py-2 pr-4">Risk</th>
                  <th className="py-2 pr-4">Open recs</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-t border-slate-200">
                    <td className="py-3 pr-4">
                      <div className="font-medium">{e.name}</div>
                      {e.onboardedViaPlatform && (
                        <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-600">
                          New · onboarded via platform
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-slate-600">{e.type}</td>
                    <td className="py-3 pr-4 text-slate-600">{e.sector}</td>
                    <td className="py-3 pr-4 text-slate-600">{e.region}</td>
                    <td className="py-3 pr-4 tabular-nums">
                      {e.budgetTzsB.toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <RiskPill level={e.riskLevel} />
                    </td>
                    <td className="py-3 pr-4 tabular-nums">
                      {e.openRecommendations}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => {
                          setPortalEntity(e);
                          setPortalOpen(true);
                        }}
                        className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500"
                      >
                        Open portal
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-8 text-center text-slate-500"
                    >
                      No entities match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <EntityPortalDrawer
        open={portalOpen}
        onClose={() => setPortalOpen(false)}
        title={portalEntity ? portalEntity.name : "Entity Portal module"}
        subtitle={
          portalEntity
            ? `${portalEntity.type} · ${portalEntity.sector} · ${portalEntity.region}`
            : "Purpose: give ministries, agencies and LGAs their own operational accountability workspace for readiness, submissions, exceptions and action plans."
        }
        fields={
          portalEntity
            ? [
                { label: "Budget", value: `TZS ${portalEntity.budgetTzsB.toLocaleString()}B` },
                { label: "Risk", value: `${portalEntity.riskLevel} (${portalEntity.riskScore})` },
                {
                  label: "Open recommendations",
                  value: String(portalEntity.openRecommendations),
                },
                {
                  label: "Gap under review",
                  value: `TZS ${portalEntity.reconciliationGapsTzsB.toFixed(1)}B`,
                },
                { label: "Last audit", value: portalEntity.lastAudit },
                {
                  label: "Contact",
                  value: portalEntity.contactName ?? "—",
                },
                {
                  label: "Data connections",
                  value: (portalEntity.dataConnections ?? []).join(", ") || "—",
                },
                {
                  label: "Closed recommendations",
                  value: String(portalEntity.closedRecommendations),
                },
              ]
            : [
                { label: "Readiness focus", value: "Pre-audit correction" },
                { label: "User groups", value: "Finance, audit, HR, procurement" },
                {
                  label: "Main value",
                  value: "Fewer surprises and repeat findings",
                },
                {
                  label: "Adoption driver",
                  value: "Useful to entities, not just oversight",
                },
              ]
        }
      />
    </div>
  );
}
