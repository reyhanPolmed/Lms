"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { Badge, PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type ProgressRow } from "@/lib/api-client";
import {
  buildStudentGroups,
  getRiskPillClass,
  normalizeProgressRows,
} from "../../progress-view-models";

export default function ClassStudentsPage({
  params,
}: {
  params: Promise<{ className: string }>;
}) {
  const { className: rawClassName } = use(params);
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
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data siswa"))
      .finally(() => setLoading(false));
  }, []);

  const students = useMemo(
    () => buildStudentGroups(normalizeProgressRows(rows), className),
    [rows, className]
  );

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Siswa Kelas ${className}`}
        description="Pilih siswa yang ingin ditinjau, lalu buka detail progress untuk melihat perkembangan belajarnya."
      />

      <Surface title="Daftar Siswa">
        {loading ? (
          <p className="py-8 text-center text-[13px] text-[#626b8b]">Memuat daftar siswa...</p>
        ) : error ? (
          <p className="rounded-[10px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[12px] text-[#ba4b64]">
            {error}
          </p>
        ) : students.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-[14px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Belum ada data siswa untuk kelas ini.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {students.map((student) => (
              <article
                key={student.studentId}
                className="rounded-[18px] border border-[rgba(113,94,215,0.12)] bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold text-[#23284a]">{student.studentName}</p>
                    <p className="mt-1 text-[13px] text-[#72799f]">
                      {student.rows.length} mapel dipantau
                      {student.latestActivityAt
                        ? ` • aktivitas terakhir ${new Date(student.latestActivityAt).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}`
                        : ""}
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
                  <div className="rounded-[12px] bg-[#f8f9fc] px-3 py-2">
                    <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Rata progres</p>
                    <p className="mt-1 text-[16px] font-semibold text-[#2f365e]">
                      {student.averageCompletion}%
                    </p>
                  </div>
                  <div className="rounded-[12px] bg-[#f8f9fc] px-3 py-2">
                    <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Mapel aktif</p>
                    <p className="mt-1 text-[16px] font-semibold text-[#2f365e]">{student.rows.length}</p>
                  </div>
                  <div className="rounded-[12px] bg-[#f8f9fc] px-3 py-2">
                    <p className="text-[13px] uppercase tracking-[0.14em] text-[#7b84a6]">Status tugas</p>
                    <div className="mt-1">
                      <Badge status={student.rows[0]?.taskStatus ?? "draft"} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {student.rows.map((row) => (
                    <span
                      key={row.id}
                      className="rounded-full border border-[rgba(113,94,215,0.12)] bg-[#faf8ff] px-2.5 py-1 text-[13px] font-medium text-[#656c93]"
                    >
                      {row.courseTitle}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/progress/class/${encodeURIComponent(className)}/${student.studentId}`}
                  className="mt-4 flex w-full items-center justify-center rounded-[12px] bg-[#715ed7] px-3 py-2 text-[13px] font-semibold text-white shadow-[0_10px_20px_rgba(113,94,215,0.22)] transition-all hover:opacity-92"
                >
                  Detail Progress
                </Link>
              </article>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}
