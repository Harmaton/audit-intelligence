"use client";

import Link from "next/link";
import { useState } from "react";

interface ImmediateValueMetric {
  label: string;
  value: string | number;
  trend?: string;
  status?: "live" | "alert" | "info";
  action?: {
    label: string;
    href: string;
  };
}

interface ImmediateValueCardProps {
  metrics: ImmediateValueMetric[];
}

export default function ImmediateValueCard({ metrics }: ImmediateValueCardProps) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-600">
        Immediate Value Dashboard
      </div>
      
      <div className="mt-5 space-y-3">
        {metrics.map((metric, idx) => (
          <div key={idx} className="group">
            <button
              onClick={() =>
                setExpandedMetric(
                  expandedMetric === metric.label ? null : metric.label
                )
              }
              className="w-full"
            >
              <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 transition hover:bg-slate-50 hover:border-blue-300">
                <div className="flex flex-1 items-center justify-between gap-4">
                  <span className="text-sm font-medium text-slate-700">
                    {metric.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-900">
                      {metric.value}
                    </span>
                    {metric.status && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold ${
                          metric.status === "live"
                            ? "bg-green-100 text-green-700"
                            : metric.status === "alert"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <span className="inline-block w-2 h-2 rounded-full bg-current" />
                        {metric.status === "live" && "Live"}
                        {metric.status === "alert" && "Alert"}
                        {metric.status === "info" && "Updated"}
                      </span>
                    )}
                    {metric.trend && (
                      <span className="text-xs text-slate-500">
                        {metric.trend}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-slate-400 transition group-hover:text-slate-600">
                  {expandedMetric === metric.label ? "−" : "+"}
                </span>
              </div>
            </button>

            {expandedMetric === metric.label && metric.action && (
              <div className="mt-2 pl-4 border-l-2 border-blue-300 py-2">
                <Link
                  href={metric.action.href}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  {metric.action.label}
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-1">
        <Link
          href="/risk-intelligence"
          className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:from-cyan-400 hover:to-blue-500 text-center"
        >
          View Findings
        </Link>
        <Link
          href="/reconciliation-hub"
          className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 text-center"
        >
          Reconciliation Hub
        </Link>
      </div>
    </div>
  );
}
