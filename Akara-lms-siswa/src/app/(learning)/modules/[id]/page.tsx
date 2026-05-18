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
import { getModuleItemIdentity } from "@/lib/learning-routes";
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
  task: { icon: List, label: "Tugas", helper: "Submission" },
  assignment: { icon: List, label: "Tugas", helper: "Submission" },
  material: { icon: BookOpen, label: "Materi", helper: "Bahan Bacaan" }
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
        <Link className="transition hover:text-slate-900" href="/modules">
          Modul
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-950">{data.title}</span>
      </div>

      <section className="surface-card overflow-hidden p-0">
        <div
          className="h-2 w-full"
          style={{
            background: `linear-gradient(90deg, ${data.accent ?? "#155DFC"} 0%, rgba(15,23,42,0.94) 100%)`
          }}
        />
        <div className="flex flex-col gap-6 p-6 sm:p-7 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{data.department}</p>
            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-slate-950">
              {data.title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600">{data.description}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                {data.totalItems} item belajar
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                Pengajar: {data.teacherName}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                Berikutnya: {data.nextItemTitle}
              </span>
            </div>
          </div>

          <div className="dashboard-panel min-w-full p-5 sm:min-w-[290px] lg:max-w-[320px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Progress modul
            </p>
            <p className="mt-3 text-[36px] font-semibold leading-none tracking-[-0.05em] text-slate-950">
              {data.completionRate ?? 0}%
            </p>
            <div className="mt-4 h-2 rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900"
                style={{ width: `${data.completionRate ?? 0}%` }}
              />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Gunakan daftar item di bawah untuk membuka materi, kuis, dan tugas sesuai urutan.
            </p>
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
            <section key={section.id} className="surface-card block w-full p-5 sm:p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-slate-700">
                  <Layers3 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-slate-950">{section.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{section.description}</p>
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
                      key={getModuleItemIdentity(item)}
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
          <p className="eyebrow">Ringkasan modul</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">Arah belajar</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            <li>Jumlah item belajar: {data.totalItems}</li>
            <li>Item berikutnya: {data.nextItemTitle}</li>
            <li>Progress berjalan: {data.completionRate ?? 0}%</li>
            <li>Semua item dibuka lewat halaman detail terpisah agar fokus belajar lebih rapi.</li>
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
    "flex flex-col gap-4 rounded-[22px] border border-slate-200/80 p-4 transition md:flex-row md:items-center md:justify-between";

  if (item.isLocked) {
    return (
      <div
        aria-disabled="true"
        className={`${className} cursor-not-allowed bg-slate-50/70 opacity-70`}
      >
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
            <ItemIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-950">{item.title}</p>
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
      className={`${className} hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-[0_18px_40px_-36px_rgba(15,23,42,0.28)]`}
      href={item.href}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <ItemIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-slate-950">{item.title}</p>
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
