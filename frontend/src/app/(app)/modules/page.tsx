"use client";

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
    <div className="space-y-8">
      <section className="surface-card p-8">
        <p className="eyebrow">Courses</p>
        <h1 className="section-title mt-2">Semua modul yang sedang diikuti</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          Halaman ini menampung daftar modul siswa, progres tiap modul, dan akses ke lesson, quiz, atau task terkait.
        </p>
      </section>

      {data.length === 0 ? (
        <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
          Belum ada modul yang tersedia dari backend.
        </section>
      ) : (
        <section className="grid gap-6 xl:grid-cols-3">
          {data.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </section>
      )}
    </div>
  );
}
