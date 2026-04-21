import React from "react";

export function StatCard({
  label,
  value,
  sub,
  accent = "blue",
  footer,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: "blue" | "red" | "amber" | "green" | "violet";
  footer?: React.ReactNode;
}) {
  const accentMap = {
    blue: "text-blue-600",
    red: "text-red-600",
    amber: "text-amber-600",
    green: "text-emerald-600",
    violet: "text-violet-600",
  } as const;

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
        {label}
      </div>
      <div className={`text-4xl font-bold tabular-nums ${accentMap[accent]}`}>
        {value}
      </div>
      {sub && <div className="text-sm text-slate-600">{sub}</div>}
      {footer && <div className="mt-auto text-xs text-slate-500">{footer}</div>}
    </div>
  );
}

export function GlowCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-2xl border border-white/5 bg-slate-900/50 p-5 text-white shadow-xl",
        className,
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  );
}
