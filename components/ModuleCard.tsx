import Link from "next/link";

export default function ModuleCard({
  tier,
  title,
  bullets,
  href,
  cta = "Open module",
}: {
  tier: string;
  title: string;
  bullets: string[];
  href: string;
  cta?: string;
}) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl bg-gradient-to-br from-white to-slate-100 p-5 text-slate-900 shadow-sm">
      <span className="inline-flex w-fit items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
        {tier}
      </span>
      <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
      <ul className="flex-1 space-y-1.5 text-sm text-slate-600">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className="block rounded-xl bg-gradient-to-r from-slate-900 to-blue-900 py-3 text-center text-sm font-semibold text-white hover:from-blue-900 hover:to-blue-700"
      >
        {cta}
      </Link>
    </div>
  );
}
