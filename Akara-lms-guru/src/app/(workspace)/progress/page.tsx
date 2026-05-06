import Link from "next/link";

import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { progressRows, modules } from "@/lib/teacher-mocks";

export default function StudentProgressPage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Progres Siswa"
        description="Monitoring kemajuan per mata pelajaran untuk identifikasi siswa tertinggal."
      />

      <Surface title="Filter Progres">
        <div className="grid gap-2 md:grid-cols-3">
          <MiniSelect label="Kelas" options={Array.from(new Set(progressRows.map(r => r.className)))} placeholder="Semua kelas" />
          <MiniSelect label="Mata Pelajaran" options={Array.from(new Set(modules.map(m => m.name)))} placeholder="Semua mapel" />
          <MiniSelect label="Status Progres" options={["aktif", "tertinggal", "selesai"]} placeholder="Semua status" />
        </div>
      </Surface>

      <Surface title="Table Progres Siswa">
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
                <th className="px-2 py-2">Last Activity</th>
                <th className="px-2 py-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(113,94,215,0.1)]">
              {progressRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-3 py-2.5 font-semibold text-[#4e5378]">{row.student}</td>
                  <td className="px-2 py-2.5">{row.className}</td>
                  <td className="px-2 py-2.5">{row.module}</td>
                  <td className="px-2 py-2.5">{row.activeBab}</td>
                  <td className="px-2 py-2.5">{row.doneItems}</td>
                  <td className="px-2 py-2.5">{row.latestQuiz}</td>
                  <td className="px-2 py-2.5"><Badge status={row.taskStatus} /></td>
                  <td className="px-2 py-2.5">{row.lastActivity}</td>
                  <td className="px-2 py-2.5">
                    <Link
                      href={`/progress/matematika-8/${row.id}`}
                      className="rounded-[7px] border border-[#bdb6f6] px-2 py-1 text-[9px] text-[#5b6191]"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}
