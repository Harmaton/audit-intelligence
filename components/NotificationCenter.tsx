"use client";

import Link from "next/link";
import { useState } from "react";
import type { Notification } from "@/lib/types";

interface NotificationCenterProps {
  notifications: Notification[];
  onDismiss?: (id: string) => void;
}

export default function NotificationCenter({
  notifications,
  onDismiss,
}: NotificationCenterProps) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    onDismiss?.(id);
  };

  const active = notifications.filter((n) => !dismissed.has(n.id));

  if (active.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 space-y-2 max-w-sm sm:bottom-24 md:bottom-8">
      {active.map((notification) => (
        <div
          key={notification.id}
          className="rounded-lg border border-white/20 bg-slate-900/95 backdrop-blur-md Shadow-lg p-4 text-sm text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="font-semibold">
                {notification.type === "audit-finding" && "New audit finding"}
                {notification.type === "reconciliation-alert" &&
                  "Reconciliation alert"}
                {notification.type === "recommendation-resolved" &&
                  "Recommendation resolved"}
                {notification.type === "entity-risk" && "Entity risk update"}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {notification.type === "audit-finding" &&
                  `${notification.count} new findings`}
                {notification.type === "reconciliation-alert" &&
                  `${notification.count} unresolved alerts`}
                {notification.type === "recommendation-resolved" &&
                  `${notification.count} recommendations implemented`}
                {notification.type === "entity-risk" &&
                  `${notification.count} entities at high risk`}
              </div>
            </div>
            <button
              onClick={() => handleDismiss(notification.id)}
              className="text-slate-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
          {notification.action && (
            <Link
              href={notification.action.href}
              className="mt-3 inline-flex text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition"
            >
              {notification.action.label} →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
