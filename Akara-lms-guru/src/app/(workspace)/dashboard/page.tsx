"use client";

import { useEffect, useState } from "react";
import { BookOpen, Users } from "lucide-react";
import Link from "next/link";

import { teacherApi, type DashboardData } from "@/lib/api-client";

const KPI_ICONS = [
  { bg: "bg-[#efeaff]", color: "text-[#6d5dfc]" },
  { bg: "bg-[#e8f4ff]", color: "text-[#58a4e7]" },
  { bg: "bg-[#fff0d9]", color: "text-[#f59f34]" },
  { bg: "bg-[#efeaff]", color: "text-[#6d5dfc]" },
  { bg: "bg-[#ffe5ec]", color: "text-[#f57182]" },
];

function getStatusBadgeClass(status: string) {
  const toneMap: Record<string, string> = {
    draft: "bg-[#fff1d8] text-[#a86409]",
    published: "bg-[#e7f7ee] text-[#1f7a47]",
    scheduled: "bg-[#e9f3ff] text-[#2f72ba]",
    archived: "bg-[#eef0f5] text-[#58617d]",
    submitted: "bg-[#e9f3ff] text-[#2f72ba]",
    returned: "bg-[#fff1d8] text-[#a86409]",
    graded: "bg-[#e7f7ee] text-[#1f7a47]",
    retake: "bg-[#fff1d8] text-[#a86409]",
    revision: "bg-[#fff1d8] text-[#a86409]",
    approved: "bg-[#e7f7ee] text-[#1f7a47]",
    late: "bg-[#ffe9ef] text-[#b73a58]",
  };

  return toneMap[status] ?? "bg-[#eef0f5] text-[#58617d]";
}

function DashboardSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="panel-surface flex min-h-0 flex-col overflow-hidden rounded-[20px] bg-white px-4 py-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[19px] font-semibold tracking-[-0.02em] text-[#1f2747]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

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
        { label: "Modul Aktif", value: String(data.kpi.activeModules) },
        { label: "Kelas Aktif", value: String(data.kpi.activeClasses) },
        { label: "Draft Item", value: String(data.kpi.draftItems) },
        { label: "Need Review", value: String(data.kpi.needReview) },
        { label: "Menunggu Revisi", value: String(data.kpi.pendingRevision) },
      ]
    : [];

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-3">
      <header className="panel-surface rounded-[20px] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-[34px] font-bold leading-[1.02] tracking-[-0.04em] text-[#18203f]">
              {data ? `Selamat datang, ${data.teacher.name}` : "Dashboard Guru"}
            </h1>
            <p className="mt-2 text-[14px] leading-6 text-[#4f5878]">
              Ringkasan operasional hari ini: authoring, publish, review, dan monitoring siswa.
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="col-span-5 rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-white px-4 py-10 text-center text-[14px] font-medium text-[#5c6485]">
          Memuat data dashboard...
        </div>
      ) : error ? (
        <div className="rounded-[16px] border border-[#f1c2cd] bg-[#fff4f7] px-4 py-3 text-[13px] font-medium text-[#b24762]">
          {error}
        </div>
      ) : (
        <>
          <section className="grid grid-cols-5 gap-3">
            {kpiItems.map((item, idx) => {
              const { bg, color } = KPI_ICONS[idx] ?? KPI_ICONS[0]!;
              return (
                <article
                  key={item.label}
                  className="panel-surface rounded-[18px] bg-white px-4 py-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#56607f]">
                      {item.label}
                    </p>
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-[14px] ${bg} ${color}`}
                    >
                      {idx < 2 ? <Users className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
                    </span>
                  </div>
                  <p className="mt-3 text-[28px] font-bold tracking-[-0.06em] text-[#161d38]">
                    {item.value}
                  </p>
                </article>
              );
            })}
          </section>

          <section className="grid min-h-0 gap-3">
            <DashboardSection
              title="Mata Pelajaran Aktif"
              action={
                <Link
                  href="/modules"
                  className="text-[12px] font-semibold text-[#6758d6] transition-colors hover:text-[#5646cc]"
                >
                  Buka daftar modul
                </Link>
              }
            >
              <div className="min-h-0 overflow-auto rounded-[14px] border border-[rgba(113,94,215,0.10)]">
                <table className="w-full text-left text-[13px] text-[#4d5677]">
                  <thead className="bg-[#faf8ff] text-[12px] uppercase tracking-[0.14em] text-[#596182]">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Modul</th>
                      <th className="px-3 py-3 font-semibold">Bab</th>
                      <th className="px-3 py-3 font-semibold">L/Q/T</th>
                      <th className="px-3 py-3 font-semibold">Status</th>
                      <th className="px-3 py-3 font-semibold">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(113,94,215,0.10)]">
                    {data?.modules.map((row) => (
                      <tr key={row.id} className="align-top">
                        <td className="px-4 py-3.5">
                          <p className="text-[14px] font-semibold text-[#202844]">{row.title}</p>
                          <p className="mt-1 text-[12px] text-[#58617f]">
                            {row.department} • {row.gradeLevel}
                          </p>
                        </td>
                        <td className="px-3 py-3.5 text-[14px] font-semibold text-[#28304d]">
                          {row.chapters}
                        </td>
                        <td className="px-3 py-3.5 text-[14px] font-semibold text-[#28304d]">
                          {row.lessons}/{row.quizzes}/{row.tasks}
                        </td>
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-semibold ${getStatusBadgeClass(
                              row.status
                            )}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-3 py-3.5 text-[14px] font-semibold text-[#28304d]">
                          {row.completionRate}%
                        </td>
                      </tr>
                    ))}
                    {data?.modules.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-8 text-center text-[13px] font-medium text-[#66708f]"
                        >
                          Belum ada mata pelajaran yang di-assign.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </DashboardSection>

            {(data?.recentSubmissions.length ?? 0) > 0 && (
              <DashboardSection
                title="Submission Terbaru"
                action={
                  <Link
                    href="/review-tugas"
                    className="text-[12px] font-semibold text-[#6758d6] transition-colors hover:text-[#5646cc]"
                  >
                    Review semua
                  </Link>
                }
              >
                <div className="min-h-0 overflow-auto rounded-[14px] border border-[rgba(113,94,215,0.10)]">
                  <table className="w-full text-left text-[13px] text-[#4d5677]">
                    <thead className="bg-[#faf8ff] text-[12px] uppercase tracking-[0.14em] text-[#596182]">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Siswa</th>
                        <th className="px-3 py-3 font-semibold">Mapel</th>
                        <th className="px-3 py-3 font-semibold">Tugas</th>
                        <th className="px-3 py-3 font-semibold">Status</th>
                        <th className="px-3 py-3 font-semibold">Skor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(113,94,215,0.10)]">
                      {data?.recentSubmissions.map((sub) => (
                        <tr key={sub.id} className="align-top">
                          <td className="px-4 py-3.5">
                            <p className="text-[14px] font-semibold text-[#202844]">{sub.studentName}</p>
                            <p className="mt-1 text-[12px] font-medium text-[#58617f]">{sub.className}</p>
                          </td>
                          <td className="px-3 py-3.5 text-[13px] font-medium text-[#2f3755]">
                            {sub.courseTitle}
                          </td>
                          <td className="px-3 py-3.5 text-[13px] font-medium text-[#2f3755]">
                            {sub.assignmentTitle}
                          </td>
                          <td className="px-3 py-3.5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-semibold ${getStatusBadgeClass(
                                sub.status
                              )}`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-[15px] font-bold text-[#1f2747]">
                            {sub.score ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DashboardSection>
            )}
          </section>
        </>
      )}
    </div>
  );
}
