"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import {
  IconBuilding,
  IconCheck,
  IconClose,
  IconCommand,
  IconCompass,
  IconMenu,
  IconReconcile,
  IconReport,
  IconRisk,
  IconTrend,
} from "./Icons";
import { baselineCounts } from "@/lib/seed";

type NavItem = {
  href: string;
  label: string;
  icon: (p: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

const NAV: NavItem[] = [
  { href: "/", label: "Command Centre", icon: IconCommand },
  { href: "/risk-intelligence", label: "Risk & Intelligence", icon: IconRisk },
  { href: "/reconciliation-hub", label: "Reconciliation Hub", icon: IconReconcile },
  { href: "/recommendations", label: "Recommendations", icon: IconCheck },
  { href: "/value-realisation", label: "Value Realisation", icon: IconTrend },
  { href: "/entities", label: "Entities & Portals", icon: IconBuilding },
  { href: "/ministry-detail", label: "Ministry Detail", icon: IconCompass },
  { href: "/executive-reporting", label: "Executive Reporting", icon: IconReport },
];

function SidebarContent({
  pathname,
  onNavigate,
  extraEntities,
}: {
  pathname: string;
  onNavigate?: () => void;
  extraEntities: number;
}) {
  const total =
    baselineCounts.ministries +
    baselineCounts.departments +
    baselineCounts.agencies +
    baselineCounts.publicAuthorities +
    baselineCounts.lgas +
    extraEntities;

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6 text-slate-200">
      <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-900 font-bold">
          AG
        </div>
        <div>
          <div className="text-sm font-semibold leading-tight">
            Auditor General
            <br />
            Intelligence Platform
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            National Audit Office of Tanzania
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={[
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                active
                  ? "bg-gradient-to-r from-cyan-400/90 to-blue-500/90 text-white shadow-lg shadow-cyan-500/10"
                  : "text-slate-300 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              <Icon width={18} height={18} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/entities/onboard"
        onClick={onNavigate}
        className="group flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-blue-500/10 px-3 py-3 text-sm text-white transition hover:from-violet-500/25 hover:to-blue-500/20"
      >
        <div>
          <div className="font-semibold">Onboard an entity</div>
          <div className="text-[11px] text-slate-400">
            Chat-style intake · takes ~3 min
          </div>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-1 text-xs">+</span>
      </Link>

      <div className="rounded-2xl bg-white/5 p-4">
        <div className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
          Connected Entities
        </div>
        <div className="mt-2 text-4xl font-bold text-white">{total}</div>
        <div className="mt-4 space-y-1.5 text-sm">
          {[
            ["Ministries", baselineCounts.ministries],
            ["Departments", baselineCounts.departments],
            ["Agencies", baselineCounts.agencies],
            ["Public Authorities", baselineCounts.publicAuthorities],
            ["LGAs", baselineCounts.lgas],
          ].map(([label, count]) => (
            <div
              key={label as string}
              className="flex items-center justify-between text-slate-300"
            >
              <span className="italic">{label as string}</span>
              <span className="tabular-nums">{count as number}</span>
            </div>
          ))}
          {extraEntities > 0 && (
            <div className="flex items-center justify-between text-cyan-300">
              <span className="italic">Newly onboarded</span>
              <span className="tabular-nums">+{extraEntities}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto text-[11px] text-slate-500">
        © NAOT · Pilot release v0.3
      </div>
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [extraEntities, setExtraEntities] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/entities", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const total =
          baselineCounts.ministries +
          baselineCounts.departments +
          baselineCounts.agencies +
          baselineCounts.publicAuthorities +
          baselineCounts.lgas;
        const apiTotal = Array.isArray(data.entities) ? data.entities.length : 0;
        setExtraEntities(Math.max(0, apiTotal - 12));
        // (12 = seedEntities length; anything beyond is user-onboarded)
      } catch {}
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-slate-950/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-900 font-bold">
            AG
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">
              Auditor General
            </div>
            <div className="text-[10px] text-slate-400">NAO Tanzania</div>
          </div>
        </div>
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-white hover:bg-white/10"
        >
          <IconMenu />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-72 shrink-0 border-r border-white/5 bg-slate-950 lg:block">
        <SidebarContent pathname={pathname} extraEntities={extraEntities} />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-slate-950 shadow-xl">
            <div className="flex items-center justify-end p-2">
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-white hover:bg-white/10"
              >
                <IconClose />
              </button>
            </div>
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setOpen(false)}
              extraEntities={extraEntities}
            />
          </div>
        </div>
      )}
    </>
  );
}
