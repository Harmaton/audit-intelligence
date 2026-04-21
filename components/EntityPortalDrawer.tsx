"use client";

import { IconClose } from "./Icons";

type Field = { label: string; value: string };

export default function EntityPortalDrawer({
  open,
  onClose,
  title,
  subtitle,
  fields,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  fields: Field[];
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto bg-white text-slate-900 shadow-2xl sm:right-6 sm:top-6 sm:h-auto sm:max-h-[90vh] sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <IconClose />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
          {fields.map((f) => (
            <div
              key={f.label}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="text-[11px] uppercase tracking-wider text-slate-500">
                {f.label}
              </div>
              <div className="mt-2 text-lg font-semibold leading-snug">
                {f.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
