"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type ProgressRow } from "@/lib/api-client";

export default function StudentProgressPage() {
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [riskFilter, setRiskFilter] = useState("");

  useEffect(() => {
    teacherApi
      .getStudentProgress({ riskLevel: riskFilter || undefined })
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, [riskFilter]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      if (classFilter && r.className !== classFilter) return false;
      if (subjectFilter && r.courseTitle !== subjectFilter) return false;
      return true;
    });
  }, [rows, classFilter, subjectFilter]);

  const classes = useMemo(() => Array.from(new Set(rows.map((r) => r.className))), [rows]);
  const subjects = useMemo(() => Array.from(new Set(rows.map((r) => r.courseTitle))), [rows]);

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Progres Siswa"
        description="Monitoring kemajuan per mata pelajaran untuk identifikasi siswa tertinggal."
      />

      <Surface title="Filter Progres">
        <div className="grid gap-2 md:grid-cols-3">
          <MiniSelect
            label="Kelas"
            options={classes}
            placeholder="Semua kelas"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          />
          <MiniSelect
            label="Mata Pelajaran"
            options={subjects}
            placeholder="Semua mapel"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          />
          <MiniSelect
            label="Tingkat Risiko"
            options={["rendah", "sedang", "tinggi"]}
            placeholder="Semua tingkat"
            value={riskFilter}
            onChange={(e) => {
              setRiskFilter(e.target.value);
              setLoading(true);
            }}
          />
        </div>
      </Surface>

      <Surface title="Table Progres Siswa">
        {loading ? (
          <p className="py-6 text-center text-[11px] text-[#7e84a8]">Memuat data...</p>
        ) : error ? (
          <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[10px] text-[#ba4b64]">
            {error}
          </p>
        ) : (
          <div className="min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            <table className="w-full text-left text-[10px] text-[#7e84a8]">
              <thead className="bg-[#faf8ff] text-[8.5px] uppercase tracking-[0.16em] text-[#60658e]">
                <tr>
                  <th className="px-3 py-2">Nama Siswa</th>
                  <th className="px-2 py-2">Kelas</th>
                  <th className="px-2 py-2">Mata Pelajaran</th>
                  <th className="px-2 py-2">Bab Aktif</th>
                  <th className="px-2 py-2">Item Selesai</th>
                  <th className="px-2 py-2">Nilai Kuis</th>
                  <th className="px-2 py-2">Status Tugas</th>
                  <th className="px-2 py-2">Risk</th>
                  <th className="px-2 py-2">Last Activity</th>
                  <th className="px-2 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(113,94,215,0.1)]">
                {filteredRows.length > 0 ? (
                  filteredRows.map((row) => {
                    const [offeringId, studentId] = row.id.split("-");
                    return (
                      <tr key={row.id}>
                        <td className="px-3 py-2.5 font-semibold text-[#4e5378]">{row.studentName}</td>
                        <td className="px-2 py-2.5">{row.className}</td>
                        <td className="px-2 py-2.5">{row.courseTitle}</td>
                        <td className="px-2 py-2.5">{row.activeChapter}</td>
                        <td className="px-2 py-2.5">{row.completedItemsCount}</td>
                        <td className="px-2 py-2.5">
                          {row.latestQuizScore !== null ? row.latestQuizScore : "—"}
                        </td>
                        <td className="px-2 py-2.5">
                          <Badge status={row.taskStatus} />
                        </td>
                        <td className="px-2 py-2.5">
                          <span
                            className={`rounded-[5px] px-1.5 py-0.5 text-[8.5px] font-semibold ${
                              row.riskLevel === "rendah"
                                ? "bg-[#eaf6ee] text-[#2f8c57]"
                                : row.riskLevel === "sedang"
                                  ? "bg-[#fff0d9] text-[#c17614]"
                                  : "bg-[#ffe5ec] text-[#c54564]"
                            }`}
                          >
                            {row.riskLevel}
                          </span>
                        </td>
                        <td className="px-2 py-2.5">
                          {row.lastActivityAt
                            ? new Date(row.lastActivityAt).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                              })
                            : "—"}
                        </td>
                        <td className="px-2 py-2.5">
                          <Link
                            href={`/progress/${offeringId}/${studentId}`}
                            className="rounded-[7px] border border-[#bdb6f6] px-2 py-1 text-[9px] text-[#5b6191]"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="px-3 py-6 text-center text-[10px] text-[#7e84a8]">
                      Tidak ada data progres yang cocok dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Surface>
    </div>
  );
}
