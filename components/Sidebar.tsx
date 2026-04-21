"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useEffect, useState } from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

function GridIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />
    </svg>
  );
}

function MatchIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 7h10" />
      <path d="M4 12h16" />
      <path d="M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  );
}

function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

function TrendIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 16l6-6 4 4 6-8" />
      <path d="M16 6h4v4" />
    </svg>
  );
}

function BuildingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M4 20V6l8-3 8 3v14" />
      <path d="M9 20v-4h6v4" />
      <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01" />
    </svg>
  );
}

function CompassIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.8 9.2l-2 5.6-5.6 2 2-5.6 5.6-2z" />
    </svg>
  );
}

function ReportIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7 3h7l5 5v13H7z" />
      <path d="M14 3v5h5" />
      <path d="M10 13h6M10 17h6M10 9h2" />
    </svg>
  );
}

type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: (props: IconProps) => JSX.Element;
};

const NAV: NavItem[] = [
  { href: "/", label: "Command Centre", shortLabel: "Home", icon: GridIcon },
  { href: "/risk-intelligence", label: "Risk & Intelligence", shortLabel: "Risk", icon: ShieldIcon },
  { href: "/reconciliation-hub", label: "Reconciliation Hub", shortLabel: "Recon", icon: MatchIcon },
  { href: "/recommendations", label: "Recommendations", shortLabel: "Actions", icon: CheckIcon },
  { href: "/value-realisation", label: "Value Realisation", shortLabel: "Value", icon: TrendIcon },
  { href: "/entities", label: "Entities & Portals", shortLabel: "Entities", icon: BuildingIcon },
  { href: "/ministry-detail", label: "Ministry Detail", shortLabel: "Ministry", icon: CompassIcon },
  { href: "/executive-reporting", label: "Executive Reporting", shortLabel: "Reports", icon: ReportIcon },
];

const MOBILE_NAV = NAV.slice(0, 5);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function DesktopSidebar({ pathname, extraEntities }: { pathname: string; extraEntities: number }) {
  const totalEntities = 12 + extraEntities;

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/5 bg-slate-950 lg:flex lg:flex-col">
      <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6 text-slate-200">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-bold text-slate-950">
            AG
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">
              Auditor General
              <br />
              Intelligence Platform
            </div>
            <div className="mt-0.5 text-[11px] text-slate-400">NAO Tanzania</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active
                    ? "bg-gradient-to-r from-cyan-400/90 to-blue-500/90 text-white shadow-lg shadow-cyan-500/10"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <Icon width={18} height={18} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <Link
          href="/entities/onboard"
          className="flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-blue-500/10 px-3 py-3 text-sm text-white transition hover:from-violet-500/25 hover:to-blue-500/20"
        >
          <div>
            <div className="font-semibold">Onboard an entity</div>
            <div className="text-[11px] text-slate-400">Chat-style intake</div>
          </div>
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs">+</span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Connected Entities</div>
          <div className="mt-2 text-4xl font-bold text-white">{totalEntities}</div>
          <div className="mt-4 text-sm text-slate-400">Includes ministries, departments, agencies, authorities and LGAs.</div>
        </div>

        <div className="mt-auto text-[11px] text-slate-500">© NAOT · Pilot release v0.3</div>
      </div>
    </aside>
  );
}

function MobileNav({ pathname }: { pathname: string }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-slate-950/95 px-2 pt-2 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-2xl grid-cols-5 gap-1 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        {MOBILE_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex min-w-0 flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-center transition",
                active ? "bg-cyan-400/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-2xl border transition",
                  active
                    ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                    : "border-transparent bg-white/5 text-slate-300",
                ].join(" ")}
              >
                <Icon width={18} height={18} />
              </span>
              <span className="text-[10px] font-medium leading-tight">{item.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [extraEntities, setExtraEntities] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/entities", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const apiTotal = Array.isArray(data.entities) ? data.entities.length : 0;
        setExtraEntities(Math.max(0, apiTotal - 12));
      } catch {
        setExtraEntities(0);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <>
      <DesktopSidebar pathname={pathname} extraEntities={extraEntities} />
      <MobileNav pathname={pathname} />
    </>
  );
}
