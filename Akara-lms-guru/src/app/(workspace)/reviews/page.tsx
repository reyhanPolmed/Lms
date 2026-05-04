import { ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Badge, MiniInput, PageHeader, Surface } from "@/components/workspace/ui";
import { reviews } from "@/lib/teacher-mocks";

export default function ReviewsPage() {
  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Review Submission Tugas"
        description="Split view queue review: daftar siswa di kiri, detail submission di kanan."
      />

      <Surface title="Filter Queue Review">
        <div className="grid gap-2 md:grid-cols-5">
          <MiniInput label="Kelas" placeholder="Semua kelas" />
          <MiniInput label="Modul/Tugas" placeholder="Cari modul atau tugas" />
          <MiniInput label="Status" placeholder="submitted, revision, approved, late" />
          <MiniInput label="Search Siswa" placeholder="Nama siswa" />
          <MiniInput label="Sort" placeholder="deadline / submittedAt" />
        </div>
      </Surface>

      <section className="grid min-h-0 gap-2 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface title="Queue Submission">
          <div className="min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            {reviews.map((row) => (
              <button
                key={row.id}
                className="flex w-full items-start justify-between border-b border-[rgba(113,94,215,0.1)] px-3 py-2.5 text-left last:border-b-0 hover:bg-[#faf8ff]"
              >
                <span>
                  <span className="block text-[11px] font-semibold text-[#4e5378]">{row.student}</span>
                  <span className="block text-[10px] text-[#6f759a]">{row.task}</span>
                  <span className="block text-[9px] text-[#7e84a8]">{row.className} - {row.submittedAt}</span>
                </span>
                <Badge status={row.status} />
              </button>
            ))}
          </div>
        </Surface>

        <Surface title="Detail Penilaian Submission">
          <div className="grid gap-2">
            <div className="rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
              <p className="text-[11px] font-semibold text-[#2b325b]">Liam Johnson - Newton&apos;s Laws Assignment</p>
              <p className="mt-1 text-[9.5px] text-[#6f759a]">Submitted 20m ago - Kelas 9A</p>
              <p className="mt-2 text-[10px] text-[#4e5378]">
                Submission viewer placeholder: link/file dapat ditampilkan di panel ini.
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <MiniInput label="Skor Kriteria 1" placeholder="0-100" />
              <MiniInput label="Skor Kriteria 2" placeholder="0-100" />
              <MiniInput label="Skor Kriteria 3" placeholder="0-100" />
              <MiniInput label="Total Score" placeholder="82" />
            </div>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Teacher Note</span>
              <textarea className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none" />
            </label>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold">
              <button className="rounded-[9px] border border-[#bdb6f6] bg-white px-2 py-2 text-[#5b6191]">Simpan Draft Nilai</button>
              <button className="rounded-[9px] border border-[#f0b16b] bg-[#fff8ef] px-2 py-2 text-[#c1782c]">Minta Revisi</button>
              <button className="rounded-[9px] bg-gradient-to-r from-[#56bf7a] to-[#36a662] px-2 py-2 text-white">Approve</button>
            </div>
            <div className="flex items-center justify-between rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-2.5 py-2 text-[9.5px] text-[#62709a]">
              <button className="flex items-center gap-1"><ChevronLeft className="h-3.5 w-3.5" /> Previous</button>
              <span className="flex items-center gap-1"><ArrowLeftRight className="h-3.5 w-3.5" /> Shortcut Next/Previous</span>
              <button className="flex items-center gap-1">Next <ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </Surface>
      </section>
    </div>
  );
}
