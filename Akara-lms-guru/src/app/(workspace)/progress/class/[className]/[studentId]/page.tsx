"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Badge, PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type ProgressRow } from "@/lib/api-client";
import {
  buildStudentGroups,
  getRiskPillClass,
  normalizeProgressRows,
} from "../../../progress-view-models";

export default function StudentProgressOverviewPage({
  params,
}: {
  params: Promise<{ className: string; studentId: string }>;
}) {
  const { className: rawClassName, studentId } = use(params);
  const className = decodeURIComponent(rawClassName);

  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    teacherApi
      .getStudentProgress()
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat progress siswa"))
      .finally(() => setLoading(false));
  }, []);

  const student = useMemo(() => {
    const groups = buildStudentGroups(normalizeProgressRows(rows), className);
    return groups.find((item) => item.studentId === studentId) ?? null;
  }, [rows, className, studentId]);

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={student ? `Detail Progress ${student.studentName}` : "Detail Progress Siswa"}
        description="Halaman ini merangkum progres siswa per mata pelajaran. Buka timeline mapel untuk melihat detail aktivitas yang lebih spesifik."
      />

      <Surface title="Ringkasan Progress Siswa">
        {loading ? (
          <p className="py-8 text-center text-[13px] text-[#626b8b]">Memuat detail progress siswa...</p>
        ) : error ? (
          <p className="rounded-[10px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[12px] text-[#ba4b64]">
            {error}
          </p>
        ) : !student ? (
          <div className="flex flex-1 items-center justify-center rounded-[14px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Data siswa untuk kelas ini tidak ditemukan.</p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="rounded-[18px] border border-[rgba(113,94,215,0.12)] bg-[#faf8ff] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[17px] font-semibold text-[#23284a]">{student.studentName}</p>
                  <p className="mt-1 text-[13px] text-[#6d7499]">
                    Kelas {student.className} • {student.rows.length} mapel dipantau
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[13px] font-semibold uppercase tracking-[0.14em] ${getRiskPillClass(
                    student.highestRisk
                  )}`}
                >
                  risiko {student.highestRisk}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-[12px] bg-white px-3 py-2">
                  <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Rata progres</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#2f365e]">
                    {student.averageCompletion}%
                  </p>
                </div>
                <div className="rounded-[12px] bg-white px-3 py-2">
                  <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Aktivitas terakhir</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#2f365e]">
                    {student.latestActivityAt
                      ? new Date(student.latestActivityAt).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
                <div className="rounded-[12px] bg-white px-3 py-2">
                  <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Mapel aktif</p>
                  <p className="mt-1 text-[16px] font-semibold text-[#2f365e]">{student.rows.length}</p>
                </div>
              </div>
            </div>

            <div className="mt-3 grid min-h-0 gap-3 overflow-y-auto pr-1">
              {student.rows.map((row) => (
                <article
                  key={row.id}
                  className="rounded-[18px] border border-[rgba(113,94,215,0.12)] bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[14px] font-semibold text-[#2a3158]">{row.courseTitle}</p>
                      <p className="mt-1 text-[12px] text-[#72799f]">{row.activeChapter}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[13px] font-semibold uppercase tracking-[0.14em] ${getRiskPillClass(
                        row.riskLevel
                      )}`}
                    >
                      {row.riskLevel}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 sm:grid-cols-4">
                    <div className="rounded-[12px] bg-[#f8f9fc] px-3 py-2">
                      <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Progress item</p>
                      <p className="mt-1 text-[12px] font-semibold text-[#30365f]">{row.completedItemsCount}</p>
                    </div>
                    <div className="rounded-[12px] bg-[#f8f9fc] px-3 py-2">
                      <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Nilai kuis</p>
                      <p className="mt-1 text-[12px] font-semibold text-[#30365f]">
                        {row.latestQuizScore !== null ? row.latestQuizScore : "—"}
                      </p>
                    </div>
                    <div className="rounded-[12px] bg-[#f8f9fc] px-3 py-2">
                      <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Status tugas</p>
                      <div className="mt-1">
                        <Badge status={row.taskStatus} />
                      </div>
                    </div>
                    <div className="rounded-[12px] bg-[#f8f9fc] px-3 py-2">
                      <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Last activity</p>
                      <p className="mt-1 text-[12px] font-semibold text-[#30365f]">
                        {row.lastActivityAt
                          ? new Date(row.lastActivityAt).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                            })
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href={`/progress/${row.offeringId}/${row.studentId}`}
                      className="rounded-[10px] border border-[#cfc8fb] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#6b63a4] transition-colors hover:border-[#715ed7] hover:text-[#715ed7]"
                    >
                      Buka timeline mapel
                    </Link>
                    <Link
                      href={`/progress/class/${encodeURIComponent(className)}`}
                      className="rounded-[10px] border border-[rgba(113,94,215,0.14)] bg-[#faf8ff] px-2.5 py-1.5 text-[12px] font-semibold text-[#6b63a4] transition-colors hover:border-[#715ed7] hover:text-[#715ed7]"
                    >
                      Kembali ke daftar siswa
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </Surface>
    </div>
  );
}
