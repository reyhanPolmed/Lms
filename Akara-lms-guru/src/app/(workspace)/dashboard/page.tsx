"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users } from "lucide-react";
import Link from "next/link";

import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type DashboardData } from "@/lib/api-client";

const KPI_ICONS = [
  { bg: "bg-[#efeaff]", color: "text-[#6d5dfc]" },
  { bg: "bg-[#e8f4ff]", color: "text-[#58a4e7]" },
  { bg: "bg-[#fff0d9]", color: "text-[#f59f34]" },
  { bg: "bg-[#efeaff]", color: "text-[#6d5dfc]" },
  { bg: "bg-[#ffe5ec]", color: "text-[#f57182]" },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    teacherApi
      .getDashboard()
      .then(setData)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  const kpiItems = data
    ? [
        { label: "Modul Aktif", value: String(data.kpi.activeModules), delta: null },
        { label: "Kelas Aktif", value: String(data.kpi.activeClasses), delta: null },
        { label: "Draft Item", value: String(data.kpi.draftItems), delta: null },
        { label: "Need Review", value: String(data.kpi.needReview), delta: null },
        { label: "Menunggu Revisi", value: String(data.kpi.pendingRevision), delta: null },
      ]
    : [];

  const departments = data
    ? Array.from(new Set(data.modules.map((m) => m.department).filter(Boolean)))
    : [];

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={data ? `Selamat datang, ${data.teacher.name}` : "Dashboard Guru"}
        description="Ringkasan operasional hari ini: authoring, publish, review, dan monitoring siswa."
      />

      <Surface title="Filter Cepat">
        <div className="grid gap-2 md:grid-cols-4">
          <MiniSelect label="Mapel" options={departments} placeholder="Semua mapel" />
          <MiniSelect label="Rentang Waktu" options={["Hari ini", "Minggu ini", "Bulan ini"]} placeholder="Semua waktu" />
        </div>
      </Surface>

      {loading ? (
        <div className="col-span-5 py-8 text-center text-[11px] text-[#7e84a8]">
          Memuat data dashboard...
        </div>
      ) : error ? (
        <div className="rounded-[10px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[10px] text-[#ba4b64]">
          {error}
        </div>
      ) : (
        <>
          <section className="grid grid-cols-5 gap-2">
            {kpiItems.map((item, idx) => {
              const { bg, color } = KPI_ICONS[idx] ?? KPI_ICONS[0]!;
              return (
                <article key={item.label} className="panel-surface rounded-[14px] bg-white px-3 py-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[10px] font-medium text-[#555b7f]">{item.label}</p>
                    <span className={`grid h-7 w-7 place-items-center rounded-[10px] ${bg} ${color}`}>
                      {idx < 2 ? <Users className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.05em] text-[#1f2548]">
                    {item.value}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="grid min-h-0 gap-2">
            <Surface
              title="Mata Pelajaran Aktif"
              action={
                <Link href="/modules" className="text-[10px] font-semibold text-[#8684c7]">
                  Buka daftar modul
                </Link>
              }
            >
              <div className="min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
                <table className="w-full text-left text-[10px] text-[#7e84a8]">
                  <thead className="bg-[#faf8ff] text-[8.5px] uppercase tracking-[0.16em] text-[#60658e]">
                    <tr>
                      <th className="px-3 py-2">Modul</th>
                      <th className="px-2 py-2">Bab</th>
                      <th className="px-2 py-2">L/Q/T</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(113,94,215,0.1)]">
                    {data?.modules.map((row) => (
                      <tr key={row.id}>
                        <td className="px-3 py-2.5">
                          <p className="font-semibold text-[#4e5378]">{row.title}</p>
                          <p>{row.department} — {row.gradeLevel}</p>
                        </td>
                        <td className="px-2 py-2.5">{row.chapters}</td>
                        <td className="px-2 py-2.5">
                          {row.lessons}/{row.quizzes}/{row.tasks}
                        </td>
                        <td className="px-2 py-2.5">
                          <Badge status={row.status} />
                        </td>
                        <td className="px-2 py-2.5">{row.completionRate}%</td>
                      </tr>
                    ))}
                    {data?.modules.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-[10px] text-[#7e84a8]">
                          Belum ada mata pelajaran yang di-assign.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Surface>

            {(data?.recentSubmissions.length ?? 0) > 0 && (
              <Surface
                title="Submission Terbaru"
                action={
                  <Link href="/review-tugas" className="text-[10px] font-semibold text-[#8684c7]">
                    Review semua
                  </Link>
                }
              >
                <div className="min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
                  <table className="w-full text-left text-[10px] text-[#7e84a8]">
                    <thead className="bg-[#faf8ff] text-[8.5px] uppercase tracking-[0.16em] text-[#60658e]">
                      <tr>
                        <th className="px-3 py-2">Siswa</th>
                        <th className="px-2 py-2">Mapel</th>
                        <th className="px-2 py-2">Tugas</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Skor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(113,94,215,0.1)]">
                      {data?.recentSubmissions.map((sub) => (
                        <tr key={sub.id}>
                          <td className="px-3 py-2.5">
                            <p className="font-semibold text-[#4e5378]">{sub.studentName}</p>
                            <p>{sub.className}</p>
                          </td>
                          <td className="px-2 py-2.5">{sub.courseTitle}</td>
                          <td className="px-2 py-2.5">{sub.assignmentTitle}</td>
                          <td className="px-2 py-2.5"><Badge status={sub.status} /></td>
                          <td className="px-2 py-2.5">{sub.score ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Surface>
            )}
          </section>
        </>
      )}
    </div>
  );
}
