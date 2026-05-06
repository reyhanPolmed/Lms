import { BookOpen, ClipboardCheck, FilePlus2, Plus, Users } from "lucide-react";
import Link from "next/link";

import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { dashboardKpi, modules, reviews, progressRows } from "@/lib/teacher-mocks";

export default function DashboardPage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Dashboard Guru"
        description="Ringkasan operasional hari ini: authoring, publish, review, dan monitoring siswa."
      />

      <Surface title="Filter Cepat">
        <div className="grid gap-2 md:grid-cols-4">
          <MiniSelect label="Mapel" options={Array.from(new Set(modules.map(m => m.subject)))} placeholder="Semua mapel" />
          <MiniSelect label="Kelas" options={Array.from(new Set([...reviews, ...progressRows].map(r => r.className)))} placeholder="Semua kelas" />
          <MiniSelect label="Rentang Waktu" options={["Hari ini", "Minggu ini", "Bulan ini"]} placeholder="Semua waktu" />
        </div>
      </Surface>

      <section className="grid grid-cols-5 gap-2">
        {dashboardKpi.map((item, idx) => (
          <article key={item.label} className="panel-surface rounded-[14px] bg-white px-3 py-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10px] font-medium text-[#555b7f]">{item.label}</p>
              <span
                className={[
                  "grid h-7 w-7 place-items-center rounded-[10px]",
                  idx === 0 ? "bg-[#efeaff] text-[#6d5dfc]" : "",
                  idx === 1 ? "bg-[#e8f4ff] text-[#58a4e7]" : "",
                  idx === 2 ? "bg-[#fff0d9] text-[#f59f34]" : "",
                  idx === 3 ? "bg-[#efeaff] text-[#6d5dfc]" : "",
                  idx === 4 ? "bg-[#ffe5ec] text-[#f57182]" : "",
                ].join(" ")}
              >
                {idx < 2 ? <Users className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              </span>
            </div>
            <p className="mt-1.5 text-[20px] font-semibold tracking-[-0.05em] text-[#1f2548]">
              {item.value}
            </p>
            <p className="text-[9.5px] text-[#7e84a8]">
              <span className={item.delta.startsWith("+") ? "text-emerald-500" : "text-rose-500"}>
                {item.delta}
              </span>{" "}
              weekly
            </p>
          </article>
        ))}
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
                  <th className="px-2 py-2">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(113,94,215,0.1)]">
                {modules.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2.5">
                      <p className="font-semibold text-[#4e5378]">{row.name}</p>
                      <p>{row.subject} - {row.grade}</p>
                    </td>
                    <td className="px-2 py-2.5">{row.chapters}</td>
                    <td className="px-2 py-2.5">
                      {row.lessons}/{row.quizzes}/{row.tasks}
                    </td>
                    <td className="px-2 py-2.5">{row.completionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>
      </section>
    </div>
  );
}
