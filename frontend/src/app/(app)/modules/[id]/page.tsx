"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";

import { LoadingState } from "@/components/ui/loading-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useModuleDetailQuery } from "@/hooks/use-lms-data";

export default function ModuleDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, isError, error } = useModuleDetailQuery(id);

  if (isLoading) {
    return <LoadingState label="Memuat detail modul..." />;
  }

  if (isError || !data) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {error instanceof Error ? error.message : "Modul tidak ditemukan"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section
        className="overflow-hidden rounded-[36px] px-8 py-8 text-white shadow-soft"
        style={{
          background: `linear-gradient(135deg, ${data.accent} 0%, #081225 85%)`
        }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow text-white/70">{data.department}</p>
            <h1 className="mt-3 font-heading text-4xl font-semibold">{data.title}</h1>
            <p className="mt-4 text-sm leading-7 text-white/80">{data.description}</p>
          </div>
          <div className="grid gap-3 rounded-[28px] border border-white/10 bg-white/10 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/60">Progress</p>
              <p className="mt-2 font-heading text-3xl font-semibold">{data.completionPercent}%</p>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-brand-gold"
                style={{ width: `${data.completionPercent}%` }}
              />
            </div>
            <p className="text-sm text-white/70">Pengajar: {data.teacher}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {data.sections.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
              Belum ada section untuk modul ini.
            </div>
          ) : (
            data.sections.map((section) => (
            <div key={section.id} className="surface-card p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="rounded-2xl bg-slate-950 p-3 text-white">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-semibold">{section.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {section.items.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    Section ini belum memiliki item belajar.
                  </div>
                ) : (
                  section.items.map((item) => (
                    <Link
                      key={item.id}
                      aria-disabled={item.isLocked}
                      className="flex flex-col gap-4 rounded-3xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-60 md:flex-row md:items-center md:justify-between"
                      href={item.href}
                    >
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                          {item.type}
                        </p>
                        <p className="mt-1 font-heading text-lg font-semibold text-slate-950">
                          {item.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge
                          status={
                            item.isLocked ? "locked" : item.isCompleted ? "completed" : "active"
                          }
                        />
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
            ))
          )}
        </div>

        <aside className="surface-card p-6">
          <p className="eyebrow">Arah belajar</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold">Ringkasan modul</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <li>Jumlah item belajar: {data.totalItems}</li>
            <li>Item berikutnya: {data.nextItemTitle}</li>
            <li>Progress berjalan: {data.completionPercent}%</li>
            <li>Flow lesson, quiz, dan task sudah disiapkan pada route terpisah.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}
