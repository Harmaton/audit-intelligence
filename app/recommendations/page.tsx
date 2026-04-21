"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Pill, StatusPill } from "@/components/Pill";
import { seedEntities, seedRecommendations } from "@/lib/seed";
import EvidenceUploadModal from "@/components/EvidenceUploadModal";
import type { Evidence, Recommendation } from "@/lib/types";

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
  const [evidenceModal, setEvidenceModal] = useState<{
    open: boolean;
    recId: string | null;
  }>({ open: false, recId: null });
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    seedRecommendations as Recommendation[]
  );
  const [managementResponse, setManagementResponse] = useState<
    Record<string, string>
  >({});

  const filtered = useMemo(() => {
    return recommendations.filter((r) => {
      const statusOk = status === "All" || r.status === status;
      const q = query.toLowerCase();
      const qOk =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q);
      return statusOk && qOk;
    });
  }, [status, query, recommendations]);

  const counts = {
    open: recommendations.filter((r) => r.status === "Open").length,
    inProgress: recommendations.filter((r) => r.status === "In Progress")
      .length,
    implemented: recommendations.filter((r) => r.status === "Implemented")
      .length,
    overdue: recommendations.filter((r) => r.status === "Overdue").length,
  };

  const handleAddEvidence = (evidence: Omit<Evidence, "id">) => {
    if (!evidenceModal.recId) return;

    const id = `ev-${Date.now()}`;
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === evidenceModal.recId
          ? {
              ...r,
              evidence: [...(r.evidence || []), { ...evidence, id }],
              lastUpdated: new Date().toISOString(),
            }
          : r
      )
    );

    setEvidenceModal({ open: false, recId: null });
  };

  const handleStatusChange = (recId: string, newStatus: Recommendation["status"]) => {
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? { ...r, status: newStatus, lastUpdated: new Date().toISOString() }
          : r
      )
    );
  };

  const handleResponseChange = (recId: string, response: string) => {
    setManagementResponse((prev) => ({ ...prev, [recId]: response }));
    setRecommendations((prev) =>
      prev.map((r) =>
        r.id === recId
          ? { ...r, managementResponse: response, lastUpdated: new Date().toISOString() }
          : r
      )
    );
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

        <div className="mt-4 space-y-3">
          {filtered.map((r) => {
            const ent = seedEntities.find((e) => e.id === r.entityId);
            const isOpen = expanded === r.id;
            return (
              <div
                key={r.id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-300 hover:shadow-md"
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
                      {r.evidence && r.evidence.length > 0 && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          📎 {r.evidence.length}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {r.title}
                    </div>
                    <div className="text-sm text-slate-600">
                      {ent?.name} · {r.owner}
                    </div>
                    {r.lastUpdated && (
                      <div className="mt-1 text-xs text-slate-500">
                        Last updated: {new Date(r.lastUpdated).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-slate-400">
                    {isOpen ? "Hide" : "Details"}
                  </span>
                </button>
                {isOpen && (
                  <div className="mt-3 space-y-3 border-t border-slate-200 pt-3">
                    {/* Description */}
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                        Description
                      </div>
                      <div className="text-sm">{r.description}</div>
                    </div>

                    {/* Management Response */}
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1">
                        Management Response
                      </div>
                      <textarea
                        value={managementResponse[r.id] || r.managementResponse || ""}
                        onChange={(e) =>
                          handleResponseChange(r.id, e.target.value)
                        }
                        placeholder="Enter management's response to this recommendation..."
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
                        rows={2}
                      />
                    </div>

                    {/* Evidence Library */}
                    {r.evidence && r.evidence.length > 0 && (
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                          Evidence ({r.evidence.length})
                        </div>
                        <div className="space-y-2">
                          {r.evidence.map((e) => (
                            <a
                              key={e.id}
                              href={e.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:bg-slate-100"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-lg shrink-0">
                                  {e.fileType === "application/pdf"
                                    ? "📄"
                                    : "🖼️"}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-slate-900 truncate">
                                    {e.fileName}
                                  </div>
                                  {e.description && (
                                    <div className="text-xs text-slate-600 truncate">
                                      {e.description}
                                    </div>
                                  )}
                                  <div className="text-xs text-slate-500">
                                    Uploaded {new Date(e.uploadedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <span className="text-slate-400 ml-2">→</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status and Actions */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2 border-t border-slate-200">
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                          Update Status
                        </div>
                        <select
                          value={r.status}
                          onChange={(e) =>
                            handleStatusChange(
                              r.id,
                              e.target.value as Recommendation["status"]
                            )
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                          <option>Open</option>
                          <option>In Progress</option>
                          <option>Implemented</option>
                          <option>Overdue</option>
                        </select>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                          Actions
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setEvidenceModal({ open: true, recId: r.id });
                            }}
                            className="rounded-lg border border-blue-600 px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
                          >
                            + Add Evidence
                          </button>
                          <button className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-medium text-white hover:bg-amber-500 transition">
                            Escalate
                          </button>
                        </div>
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

      <EvidenceUploadModal
        isOpen={evidenceModal.open}
        onClose={() => setEvidenceModal({ open: false, recId: null })}
        onSubmit={handleAddEvidence}
        existingEvidence={
          recommendations.find((r) => r.id === evidenceModal.recId)?.evidence
        }
      />
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
