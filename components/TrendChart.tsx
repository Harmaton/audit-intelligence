"use client";

type Point = { label: string; value: number };

export function BarChart({
  data,
  color = "#3b82f6",
  height = 120,
}: {
  data: Point[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const w = 320;
  const barW = w / data.length - 8;
  return (
    <svg
      viewBox={`0 0 ${w} ${height + 30}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      {data.map((d, i) => {
        const h = (d.value / max) * height;
        const x = i * (barW + 8) + 4;
        const y = height - h + 5;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx={4}
              fill={color}
              opacity={0.85}
            />
            <text
              x={x + barW / 2}
              y={height + 20}
              textAnchor="middle"
              className="fill-slate-500"
              style={{ fontSize: 10 }}
            >
              {d.label}
            </text>
            <text
              x={x + barW / 2}
              y={y - 3}
              textAnchor="middle"
              className="fill-slate-700"
              style={{ fontSize: 9, fontWeight: 600 }}
            >
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineChart({
  data,
  color = "#06b6d4",
  height = 120,
}: {
  data: Point[];
  color?: string;
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const w = 320;
  const step = w / (data.length - 1 || 1);

  const points = data
    .map((d, i) => {
      const x = i * step;
      const y = height - ((d.value - min) / (max - min || 1)) * (height - 10) - 5;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${height + 30}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      {data.map((d, i) => {
        const x = i * step;
        const y =
          height - ((d.value - min) / (max - min || 1)) * (height - 10) - 5;
        return (
          <g key={d.label}>
            <circle cx={x} cy={y} r={3.5} fill={color} />
            <text
              x={x}
              y={height + 20}
              textAnchor="middle"
              className="fill-slate-500"
              style={{ fontSize: 10 }}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function StackedBarChart({
  data,
  height = 140,
}: {
  data: { label: string; open: number; closed: number }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.open + d.closed), 1);
  const w = 320;
  const barW = w / data.length - 12;
  return (
    <svg
      viewBox={`0 0 ${w} ${height + 30}`}
      className="w-full"
      preserveAspectRatio="none"
    >
      {data.map((d, i) => {
        const totalH = ((d.open + d.closed) / max) * height;
        const closedH = (d.closed / max) * height;
        const openH = (d.open / max) * height;
        const x = i * (barW + 12) + 6;
        const y0 = height - totalH + 5;
        return (
          <g key={d.label}>
            <rect
              x={x}
              y={y0}
              width={barW}
              height={openH}
              rx={3}
              fill="#f97316"
              opacity={0.85}
            />
            <rect
              x={x}
              y={y0 + openH}
              width={barW}
              height={closedH}
              rx={3}
              fill="#22c55e"
              opacity={0.85}
            />
            <text
              x={x + barW / 2}
              y={height + 20}
              textAnchor="middle"
              className="fill-slate-500"
              style={{ fontSize: 10 }}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
