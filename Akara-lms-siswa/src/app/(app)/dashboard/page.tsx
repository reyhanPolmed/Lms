"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ClipboardList,
  SquarePen
} from "lucide-react";

import { ModuleCard } from "@/components/dashboard/module-card";
import { LoadingState } from "@/components/ui/loading-state";
import { useDashboardQuery } from "@/hooks/use-lms-data";
import { formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const { data, isLoading, isError, error } = useDashboardQuery();

  if (isLoading) {
    return <LoadingState label="Memuat dashboard siswa..." />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-rose-200 bg-white p-6 text-sm text-rose-600">
        {error instanceof Error ? error.message : "Gagal memuat dashboard"}
      </div>
    );
  }

  const firstName = data.user.fullName.split(" ").filter(Boolean)[0] ?? "Siswa";
  const agendaItems = [...data.upcomingQuizzes, ...data.upcomingTasks]
    .sort((left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime())
    .slice(0, 5);
  const stats = [
    {
      label: "Modul aktif",
      value: data.modules.length,
      helper: "Sedang berjalan",
      icon: BookOpen
    },
    {
      label: "Kuis aktif",
      value: data.upcomingQuizzes.length,
      helper: "Perlu dikerjakan",
      icon: SquarePen
    },
    {
      label: "Tugas pending",
      value: data.upcomingTasks.length,
      helper: "Menunggu submit",
      icon: ClipboardList,
    }
  ];

  return (
    <div className="space-y-6">
      <section className="surface-card overflow-hidden p-6 sm:p-7">
        <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Dashboard siswa</p>
            <h1 className="section-title mt-2">Selamat datang kembali, {firstName}.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Pantau progres belajar, modul aktif, dan agenda yang paling dekat dari satu halaman
              yang lebih rapi dan mudah dibaca.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-600">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                {data.user.className}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                {data.user.department}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                Progress mingguan {data.user.weeklyProgress}%
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[560px] xl:flex-1">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-6 2xl:grid-cols-[minmax(0,1.45fr)_360px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Modul aktif</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                Lanjutkan kelas yang sedang berjalan
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              href="/modules"
            >
              Lihat semua
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {data.modules.length === 0 ? (
            <div className="surface-card p-6 text-sm text-slate-500">
              Belum ada modul aktif yang ditampilkan.
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {data.modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          )}
        </div>

        <aside className="surface-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <p className="eyebrow">Agenda</p>
              <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                Deadline terdekat
              </h2>
            </div>
          </div>

          {agendaItems.length === 0 ? (
            <div className="mt-6 rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 p-5 text-sm text-slate-500">
              Belum ada agenda kuis atau tugas yang mendekati deadline.
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {agendaItems.map((item) => (
                <Link
                  key={`${item.type}:${item.id}`}
                  className="block rounded-[22px] border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-slate-300 hover:bg-white"
                  href={item.href}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.courseTitle}</p>
                    </div>
                    <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      {item.type === "quiz" ? "Kuis" : "Tugas"}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    Deadline {formatDateTime(item.dueAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
