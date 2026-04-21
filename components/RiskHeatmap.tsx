"use client";

import { useMemo, useState } from "react";

type Zone = {
  id: string;
  label: string;
  risk: "Low" | "Moderate" | "High" | "Critical";
  score: number;
  entities: number;
  path: string; // SVG polygon points
  cx: number;
  cy: number;
};

const COLOR: Record<Zone["risk"], string> = {
  Low: "#22c55e",
  Moderate: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
};

// Rough hex tiling across Tanzania-ish regions — schematic, for dashboard vibe.
const ZONES: Zone[] = [
  {
    id: "lake",
    label: "Lake",
    risk: "High",
    score: 71,
    entities: 58,
    path: "80,40 130,20 180,40 180,90 130,110 80,90",
    cx: 130,
    cy: 65,
  },
  {
    id: "north",
    label: "North",
    risk: "Moderate",
    score: 58,
    entities: 71,
    path: "180,40 230,20 280,40 280,90 230,110 180,90",
    cx: 230,
    cy: 65,
  },
  {
    id: "west",
    label: "West",
    risk: "Moderate",
    score: 52,
    entities: 44,
    path: "30,120 80,100 130,120 130,170 80,190 30,170",
    cx: 80,
    cy: 145,
  },
  {
    id: "central",
    label: "Central",
    risk: "Critical",
    score: 89,
    entities: 93,
    path: "130,120 180,100 230,120 230,170 180,190 130,170",
    cx: 180,
    cy: 145,
  },
  {
    id: "capital",
    label: "Capital",
    risk: "Low",
    score: 31,
    entities: 22,
    path: "230,120 280,100 330,120 330,170 280,190 230,170",
    cx: 280,
    cy: 145,
  },
  {
    id: "coast",
    label: "Coast",
    risk: "High",
    score: 74,
    entities: 65,
    path: "280,180 330,160 380,180 380,230 330,250 280,230",
    cx: 330,
    cy: 205,
  },
  {
    id: "sw",
    label: "SW",
    risk: "Low",
    score: 38,
    entities: 37,
    path: "80,200 130,180 180,200 180,250 130,270 80,250",
    cx: 130,
    cy: 225,
  },
  {
    id: "south",
    label: "South",
    risk: "Moderate",
    score: 55,
    entities: 41,
    path: "180,200 230,180 280,200 280,250 230,270 180,250",
    cx: 230,
    cy: 225,
  },
];

export default function RiskHeatmap() {
  const [focus, setFocus] = useState<Zone | null>(null);
  const selected = useMemo(() => focus ?? ZONES[3], [focus]);

  return (
    <div className="flex h-full flex-col">
      <svg
        viewBox="0 0 410 290"
        className="mx-auto w-full max-w-sm"
        role="img"
        aria-label="National risk heatmap by zone"
      >
        {ZONES.map((z) => {
          const active = selected.id === z.id;
          return (
            <g key={z.id}>
              <polygon
                points={z.path}
                fill={COLOR[z.risk]}
                fillOpacity={active ? 0.95 : 0.75}
                stroke="#0f172a"
                strokeWidth={active ? 2 : 1}
                className="cursor-pointer transition"
                onMouseEnter={() => setFocus(z)}
                onClick={() => setFocus(z)}
              />
              <text
                x={z.cx}
                y={z.cy + 4}
                textAnchor="middle"
                className="pointer-events-none fill-slate-900"
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                {z.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-3 rounded-xl bg-slate-900/5 p-3">
        <div className="flex items-center justify-between text-sm">
          <div className="font-semibold text-slate-900">{selected.label} zone</div>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white"
            style={{ backgroundColor: COLOR[selected.risk] }}
          >
            {selected.risk}
          </span>
        </div>
        <div className="mt-1 flex items-center gap-4 text-xs text-slate-600">
          <span>
            Risk score:{" "}
            <span className="font-semibold text-slate-900">
              {selected.score}
            </span>
          </span>
          <span>
            Entities:{" "}
            <span className="font-semibold text-slate-900">
              {selected.entities}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-600">
        {(Object.keys(COLOR) as Zone["risk"][]).map((k) => (
          <span key={k} className="inline-flex items-center gap-1">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: COLOR[k] }}
            />
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}
