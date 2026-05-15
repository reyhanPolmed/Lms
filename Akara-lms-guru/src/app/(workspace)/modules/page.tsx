"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type ModuleSummary } from "@/lib/api-client";

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");

  useEffect(() => {
    teacherApi
      .getModules()
      .then(setModules)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => Array.from(new Set(modules.map((m) => m.department).filter(Boolean))),
    [modules]
  );
  const grades = useMemo(
    () => Array.from(new Set(modules.map((m) => m.gradeLevel).filter(Boolean))),
    [modules]
  );

  const filtered = useMemo(
    () =>
      modules.filter((m) => {
        if (departmentFilter && m.department !== departmentFilter) return false;
        if (gradeFilter && m.gradeLevel !== gradeFilter) return false;
        return true;
      }),
    [modules, departmentFilter, gradeFilter]
  );

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Mata Pelajaran"
        description="Kelola semua mata pelajaran yang Anda ampu. Klik detail untuk membuka builder konten."
      />

      <Surface title="Filter">
        <div className="grid gap-2 md:grid-cols-3">
          <MiniSelect
            label="Mata Pelajaran"
            options={departments}
            placeholder="Semua mapel"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          />
          <MiniSelect
            label="Kelas"
            options={grades}
            placeholder="Semua kelas"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          />
        </div>
      </Surface>

      <Surface title={`Daftar Mata Pelajaran (${filtered.length})`}>
        {loading ? (
          <p className="py-6 text-center text-[11px] text-[#7e84a8]">Memuat data...</p>
        ) : error ? (
          <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[10px] text-[#ba4b64]">
            {error}
          </p>
        ) : filtered.length === 0 ? (
          <p className="py-6 text-center text-[11px] text-[#7e84a8]">
            Belum ada mata pelajaran yang cocok dengan filter.
          </p>
        ) : (
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((m) => (
              <article
                key={m.id}
                className="flex flex-col rounded-[14px] border border-[rgba(113,94,215,0.12)] bg-white p-3.5"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-bold text-[#2b325b]">{m.title}</p>
                    <p className="text-[10px] text-[#7e84a8]">
                      {m.department} — {m.gradeLevel}
                    </p>
                  </div>
                  <span
                    className={`rounded-[6px] px-2 py-0.5 text-[9px] font-semibold ${
                      m.status === "published"
                        ? "bg-[#eaf6ee] text-[#2f8c57]"
                        : "bg-[#fff0d9] text-[#c17614]"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-1 rounded-[10px] bg-[#faf8ff] px-2 py-1.5">
                  {[
                    { label: "Bab", val: m.chapters },
                    { label: "Materi", val: m.lessons },
                    { label: "Kuis", val: m.quizzes },
                    { label: "Tugas", val: m.tasks },
                  ].map(({ label, val }) => (
                    <div key={label} className="text-center">
                      <p className="text-[11px] font-bold text-[#4e5378]">{val}</p>
                      <p className="text-[8.5px] text-[#7e84a8]">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-2">
                  <div className="mb-1 flex justify-between text-[9px] text-[#7e84a8]">
                    <span>Completion Rate</span>
                    <span className="font-semibold text-[#4e5378]">{m.completionRate}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-[#ede9f9]">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-[#765df5] to-[#5b50dc]"
                      style={{ width: `${m.completionRate}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/modules/${m.id}/builder`}
                  className="mt-3 block rounded-[9px] border border-[#bdb6f6] px-3 py-1.5 text-center text-[10px] font-semibold text-[#5b6191] transition-all hover:bg-[#f0edff]"
                >
                  Detail Mata Pelajaran →
                </Link>
              </article>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}
