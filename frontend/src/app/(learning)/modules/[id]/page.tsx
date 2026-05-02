"use client";

import { use } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Home,
  Layers3,
  List,
  Lock,
  SquarePen
} from "lucide-react";

import { LoadingState } from "@/components/ui/loading-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useModuleDetailQuery } from "@/hooks/use-lms-data";
import { SidebarEntry } from "@/lib/types";

const typeMeta: Record<
  SidebarEntry["type"],
  {
    icon: typeof BookOpen;
    label: string;
    helper: string;
  }
> = {
  lesson: { icon: BookOpen, label: "Text", helper: "Materi" },
  quiz: { icon: SquarePen, label: "Kuis", helper: "Latihan" },
  task: { icon: List, label: "Tugas", helper: "Submission" }
};

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
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-4 w-4" />
        <Link className="transition hover:text-brand-ocean" href="/dashboard">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link className="transition hover:text-brand-ocean" href="/modules">
          Materi
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-950">{data.title}</span>
      </div>

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
            <section
              key={section.id}
              className="surface-card block w-full p-6"
            >
              <div className="mb-5 flex items-start gap-4">
                <div className="rounded-2xl bg-slate-950 p-3 text-white">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-xl font-semibold">{section.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{section.description}</p>
                </div>
                <div className="ml-auto rounded-full bg-brand-ocean/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-ocean">
                  Route baru
                </div>
              </div>

              <div className="space-y-3">
                {section.items.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-500">
                    Bab ini belum memiliki item belajar.
                  </div>
                ) : (
                  section.items.map((item) => (
                    <LessonRouteCard
                      key={item.id}
                      item={item}
                    />
                  ))
                )}
              </div>
            </section>
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
            <li>Lesson sekarang dibuka lewat halaman terpisah, bukan viewer di URL modul.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}

function LessonRouteCard({ item }: { item: SidebarEntry }) {
  const meta = typeMeta[item.type];
  const ItemIcon = meta.icon;
  const status = item.isLocked ? "locked" : item.isCompleted ? "complete" : "active";
  const className =
    "flex flex-col gap-4 rounded-3xl border border-slate-200 p-4 transition md:flex-row md:items-center md:justify-between";

  if (item.isLocked) {
    return (
      <div
        aria-disabled="true"
        className={`${className} cursor-not-allowed opacity-60`}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
            <ItemIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {item.bab}
            </p>
            <p className="mt-1 font-heading text-lg font-semibold text-slate-950">{item.title}</p>
            <p className="mt-1 text-sm text-slate-500">{meta.helper}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Lock className="h-4 w-4 text-slate-400" />
          <StatusBadge status={status} />
        </div>
      </div>
    );
  }

  return (
    <Link
      className={`${className} hover:-translate-y-0.5 hover:border-brand-ocean/40 hover:bg-slate-50 hover:shadow-soft`}
      href={item.href}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-brand-ocean/5 p-3 text-brand-ocean">
          <ItemIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            {item.bab}
          </p>
          <p className="mt-1 font-heading text-lg font-semibold text-slate-950">{item.title}</p>
          <p className="mt-1 text-sm text-slate-500">{meta.helper}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={status} />
        <ArrowRight className="h-4 w-4 text-slate-400" />
      </div>
    </Link>
  );
}
