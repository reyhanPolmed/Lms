import { BookOpen, ClipboardCheck, FilePlus2, Plus, Users } from "lucide-react";
import Link from "next/link";

import { Badge, MiniInput, PageHeader, Surface } from "@/components/workspace/ui";
import { dashboardKpi, modules, reviews } from "@/lib/teacher-mocks";

export default function DashboardPage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Dashboard Guru"
        description="Ringkasan operasional hari ini: authoring, publish, review, dan monitoring siswa."
      />

      <Surface title="Filter Cepat">
        <div className="grid gap-2 md:grid-cols-4">
          <MiniInput label="Mapel" placeholder="Semua mapel" />
          <MiniInput label="Kelas" placeholder="Semua kelas" />
          <MiniInput label="Rentang Waktu" placeholder="Minggu ini" />
          <MiniInput label="Status Kerja" placeholder="draft, scheduled, review" />
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

      <section className="grid min-h-0 gap-2 xl:grid-cols-[1.35fr_1fr]">
        <Surface
          title="Modul Aktif"
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
                  <th className="px-2 py-2">Status</th>
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
                    <td className="px-2 py-2.5"><Badge status={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Surface>

        <div className="grid min-h-0 gap-2 xl:grid-rows-[1fr_auto]">
          <Surface title="Submission Perlu Review">
            <div className="space-y-2">
              {reviews.slice(0, 4).map((row) => (
                <div
                  key={row.id}
                  className="rounded-[12px] border border-[rgba(113,94,215,0.1)] bg-white px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-semibold text-[#4e5378]">{row.student}</p>
                    <Badge status={row.status} />
                  </div>
                  <p className="mt-0.5 text-[10px] text-[#6f759a]">{row.task}</p>
                  <p className="text-[9px] text-[#7e84a8]">{row.className} - {row.submittedAt}</p>
                </div>
              ))}
            </div>
          </Surface>

          <Surface title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              <QuickAction href="/modules" label="Lihat Modul" icon={<Plus className="h-4 w-4" />} />
              <QuickAction href="/editor/quiz" label="Tambah Kuis" icon={<ClipboardCheck className="h-4 w-4" />} />
              <QuickAction href="/editor/task" label="Tambah Tugas" icon={<FilePlus2 className="h-4 w-4" />} />
              <QuickAction href="/reviews" label="Review Queue" icon={<BookOpen className="h-4 w-4" />} />
            </div>
          </Surface>
        </div>
      </section>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-[12px] border border-[rgba(113,94,215,0.14)] bg-white px-3 py-2 text-[10px] font-semibold text-[#4f5678] transition hover:bg-[#f8f4ff]"
    >
      <span className="flex items-center gap-2 text-[#6d5dfc]">{icon}{label}</span>
    </Link>
  );
}
