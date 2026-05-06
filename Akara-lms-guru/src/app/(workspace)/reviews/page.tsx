"use client";

import { ArrowLeftRight, ChevronLeft, ChevronRight } from "lucide-react";

import { Badge, MiniInput, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { useState } from "react";
import { reviews, modules } from "@/lib/teacher-mocks";

export default function ReviewsPage() {
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = useState(reviews[0]);
  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Review Submission Tugas"
        description="Split view queue review: daftar siswa di kiri, detail submission di kanan."
      />

      <Surface title="Filter Queue Review">
        <div className="grid gap-2 md:grid-cols-5">
          <MiniSelect label="Kelas" options={Array.from(new Set(reviews.map(r => r.className)))} placeholder="Semua kelas" />
          <MiniSelect label="Mata Pelajaran/Tugas" options={Array.from(new Set(modules.map(m => m.name)))} placeholder="Semua mapel" />
          <MiniSelect label="Status" options={["submitted", "returned", "graded", "late", "revision", "approved"]} placeholder="Semua status" />
          <MiniSelect label="Siswa" options={Array.from(new Set(reviews.map(r => r.student)))} placeholder="Semua siswa" />
          <MiniSelect label="Sort" options={["deadline", "submittedAt", "score"]} placeholder="Default" />
        </div>
      </Surface>

      <section className="grid min-h-0 gap-2 xl:grid-cols-[0.9fr_1.1fr]">
        <Surface title="Queue Submission">
          <div className="min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            {reviews.map((row) => (
              <button
                key={row.id}
                onClick={() => setSelectedReview(row)}
                className={`flex w-full cursor-pointer items-start justify-between border-b px-3 py-2.5 text-left transition-all active:scale-[0.99] last:border-b-0 ${
                  selectedReview.id === row.id
                    ? "border-[rgba(113,94,215,0.4)] bg-[#f0edff]"
                    : "border-[rgba(113,94,215,0.1)] hover:bg-[#faf9ff]"
                }`}
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
              <p className="text-[11px] font-semibold text-[#2b325b]">{selectedReview.student} - {selectedReview.task}</p>
              <p className="mt-1 text-[9.5px] text-[#6f759a]">Submitted at {selectedReview.submittedAt} - {selectedReview.className}</p>
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
              <button onClick={() => toast.success("Draft nilai berhasil disimpan")} className="cursor-pointer rounded-[9px] border border-[#bdb6f6] bg-white px-2 py-2 text-[#5b6191] transition-all hover:bg-[#f0edff] active:scale-95">Simpan Draft Nilai</button>
              <button onClick={() => toast.success("Permintaan revisi terkirim ke siswa")} className="cursor-pointer rounded-[9px] border border-[#f0b16b] bg-[#fff8ef] px-2 py-2 text-[#c1782c] transition-all hover:bg-[#fdf0e0] active:scale-95">Minta Revisi</button>
              <button onClick={() => toast.success("Nilai berhasil di-approve")} className="cursor-pointer rounded-[9px] bg-gradient-to-r from-[#56bf7a] to-[#36a662] px-2 py-2 text-white transition-all hover:opacity-90 active:scale-95">Approve</button>
            </div>
            <div className="flex items-center justify-between rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-2.5 py-2 text-[9.5px] text-[#62709a]">
              <button className="flex cursor-pointer items-center gap-1 transition-transform hover:scale-105 active:scale-95"><ChevronLeft className="h-3.5 w-3.5" /> Previous</button>
              <span className="flex items-center gap-1"><ArrowLeftRight className="h-3.5 w-3.5" /> Shortcut Next/Previous</span>
              <button className="flex cursor-pointer items-center gap-1 transition-transform hover:scale-105 active:scale-95">Next <ChevronRight className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </Surface>
      </section>
    </div>
  );
}
