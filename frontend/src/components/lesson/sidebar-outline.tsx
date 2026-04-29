import Link from "next/link";
import { Lock, NotebookPen } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { SidebarEntry } from "@/lib/types";

export function SidebarOutline({ items }: { items: SidebarEntry[] }) {
  return (
    <section className="surface-card p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-950 p-3 text-white">
          <NotebookPen className="h-5 w-5" />
        </div>
        <div>
          <p className="eyebrow">Sidebar server-side</p>
          <h2 className="mt-1 font-heading text-2xl font-semibold">Urutan lesson, quiz, task</h2>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
          Belum ada outline dari backend.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
          <Link
            key={item.id}
            aria-disabled={item.isLocked}
            className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-60"
            href={item.href}
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {item.section}
              </p>
              <p className="mt-1 font-heading text-lg font-semibold text-slate-950">{item.title}</p>
            </div>
            <div className="flex items-center gap-3">
              {item.isLocked && <Lock className="h-4 w-4 text-slate-400" />}
              <StatusBadge
                status={item.isLocked ? "locked" : item.isCompleted ? "completed" : "active"}
              />
            </div>
          </Link>
          ))}
        </div>
      )}
    </section>
  );
}
