"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, CircleHelp, ClipboardCheck, FileText, GraduationCap } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type ModuleSummary } from "@/lib/api-client";

const moduleMetrics = [
  { label: "Bab", key: "chapters", icon: BookOpen },
  { label: "Materi", key: "lessons", icon: FileText },
  { label: "Kuis", key: "quizzes", icon: CircleHelp },
  { label: "Tugas", key: "tasks", icon: ClipboardCheck },
] as const;

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    teacherApi
      .getModules()
      .then(setModules)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 pb-6">
      <PageHeader
        title="Mata Kuliah"
        description="Kelola mata kuliah yang didaftarkan admin dan lengkapi konten pembelajarannya secara terstruktur."
      />

      <Surface
        title="Daftar Mata Kuliah"
        action={
          <span className="rounded-full border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted-ink)]">
            {modules.length} modul aktif
          </span>
        }
      >
        {loading ? (
          <LoadingState
            title="Memuat mata kuliah"
            description="Mengambil daftar modul yang ditugaskan untuk dosen pengampu."
          />
        ) : error ? (
          <ErrorState message={error} />
        ) : modules.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Belum ada mata kuliah"
            description="Mata Kuliah akan muncul setelah admin mendaftarkan modul untuk dosen ini."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <article
                key={module.id}
                className="flex h-full flex-col rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[rgba(79,70,199,0.22)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[rgba(79,70,199,0.12)] bg-[var(--accent-soft)] text-[var(--accent)]">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-semibold capitalize tracking-[-0.03em] text-[var(--page-ink)]">
                          {module.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--muted-ink)]">
                          {module.department} - Kelas {module.gradeLevel}
                        </p>
                      </div>
                      <StatusBadge status={module.status} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {moduleMetrics.map(({ label, key, icon: Icon }) => (
                    <div
                      key={label}
                      className="rounded-[14px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3"
                    >
                      <Icon className="h-4 w-4 text-[var(--accent)]" />
                      <p className="mt-2 text-base font-semibold leading-none text-[var(--page-ink)]">
                        {module[key]}
                      </p>
                      <p className="mt-1 text-[12px] text-[var(--muted-ink)]">{label}</p>
                    </div>
                  ))}
                </div>

                <Button asChild variant="secondary" className="mt-5 w-full">
                  <Link href={`/modules/${module.id}/builder`}>
                    Detail Mata Kuliah
                    <CheckCircle2 className="h-4 w-4" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}
