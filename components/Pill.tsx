import React from "react";

type Tone =
  | "slate"
  | "cyan"
  | "blue"
  | "green"
  | "amber"
  | "red"
  | "violet"
  | "white";

const MAP: Record<Tone, string> = {
  slate: "bg-slate-200 text-slate-700",
  cyan: "bg-cyan-100 text-cyan-800",
  blue: "bg-blue-100 text-blue-800",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  violet: "bg-violet-100 text-violet-800",
  white: "bg-white/10 text-white",
};

export function Pill({
  children,
  tone = "blue",
  className = "",
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        MAP[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export function RiskPill({
  level,
}: {
  level: "Low" | "Moderate" | "High" | "Critical";
}) {
  const tone: Tone =
    level === "Critical"
      ? "red"
      : level === "High"
      ? "amber"
      : level === "Moderate"
      ? "blue"
      : "green";
  return <Pill tone={tone}>{level}</Pill>;
}

export function StatusPill({ status }: { status: string }) {
  const tone: Tone =
    status === "Overdue" || status === "Escalated"
      ? "red"
      : status === "In Progress" || status === "Under Review"
      ? "amber"
      : status === "Implemented" || status === "Cleared"
      ? "green"
      : status === "Flagged"
      ? "amber"
      : "blue";
  return <Pill tone={tone}>{status}</Pill>;
}
