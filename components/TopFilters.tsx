"use client";

type FilterProps = {
  sector: string;
  setSector: (v: string) => void;
  auditType: string;
  setAuditType: (v: string) => void;
  sectorOptions?: string[];
  auditTypeOptions?: string[];
};

const DEFAULT_SECTORS = [
  "All sectors",
  "Health",
  "Infrastructure",
  "Education",
  "National",
  "Coast",
  "Lake",
  "Capital",
];

const DEFAULT_AUDIT_TYPES = [
  "All audit types",
  "Financial",
  "Performance",
  "Compliance",
];

export default function TopFilters({
  sector,
  setSector,
  auditType,
  setAuditType,
  sectorOptions = DEFAULT_SECTORS,
  auditTypeOptions = DEFAULT_AUDIT_TYPES,
}: FilterProps) {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-3">
      <div className="flex flex-wrap gap-2">
        {sectorOptions.map((s) => {
          const active = s === sector;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSector(s)}
              className={[
                "rounded-full px-4 py-1.5 text-sm transition",
                active
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/70",
              ].join(" ")}
            >
              {s}
            </button>
          );
        })}
        <span className="mx-2 hidden h-7 w-px self-center bg-white/10 sm:block" />
        {auditTypeOptions.map((s) => {
          const active = s === auditType;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setAuditType(s)}
              className={[
                "rounded-full px-4 py-1.5 text-sm transition",
                active
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                  : "bg-slate-800/70 text-slate-300 hover:bg-slate-700/70",
              ].join(" ")}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
