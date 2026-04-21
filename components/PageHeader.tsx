import React from "react";

export default function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-gradient-to-br from-blue-600/30 to-cyan-400/10 blur-3xl" />
      <div className="relative">
        {kicker && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {kicker}
          </div>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
            {description}
          </p>
        )}
        {actions && <div className="mt-5 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}
