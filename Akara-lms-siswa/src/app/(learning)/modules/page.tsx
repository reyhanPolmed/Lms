"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import { ModuleCard } from "@/components/dashboard/module-card";
import { LoadingState } from "@/components/ui/loading-state";
import { useModulesQuery } from "@/hooks/use-lms-data";

export default function ModulesPage() {
  const { data, isLoading, isError, error } = useModulesQuery();

  if (isLoading) {
    return <LoadingState label="Memuat daftar modul..." />;
  }

  if (isError || !data) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {error instanceof Error ? error.message : "Gagal memuat modul"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
        <Home className="h-4 w-4" />
        <ChevronRight className="h-4 w-4" />
        <Link className="transition hover:text-slate-900" href="/dashboard">
          Dashboard
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-950">Mata Kuliah</span>
      </div>

      <section className="surface-card p-6 sm:p-7">
        <p className="eyebrow">Mata Kuliah mahasiswa</p>
        <h1 className="section-title mt-2">Semua mata kuliah yang sedang diikuti</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          Akses seluruh mata kuliah yang aktif, cek progres per mata pelajaran, lalu masuk ke materi,
          kuis, atau tugas dari satu daftar yang konsisten.
        </p>
      </section>

      {data.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Belum ada mata kuliah yang tersedia dari backend.
        </section>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
          {data.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </section>
      )}
    </div>
  );
}
