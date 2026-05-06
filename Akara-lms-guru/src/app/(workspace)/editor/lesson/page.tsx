"use client";

import { Eye, Save, Send } from "lucide-react";

import { MiniInput, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";

export default function LessonEditorPage() {
  const { toast } = useToast();
  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Editor Lesson"
        description="Form adaptif berdasarkan content type dengan preview live student-facing."
      />
      <section className="grid min-h-0 gap-2 xl:grid-cols-[1.3fr_0.9fr]">
        <Surface title="Form Materi">
          <div className="grid gap-2">
            <MiniInput label="Judul Materi" placeholder="Contoh: Persamaan Linear Dasar" />
            <div className="grid gap-2 md:grid-cols-2">
              <MiniInput label="Content Type" placeholder="text / video / pdf / link" />
              <MiniInput label="Estimasi Durasi" placeholder="12 menit" />
            </div>
            <MiniInput label="Excerpt" placeholder="Ringkasan singkat untuk siswa" />
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                Body Materi
              </span>
              <textarea className="h-42 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none" />
            </label>
            <div className="grid gap-2 md:grid-cols-2">
              <MiniInput label="URL Video / Link / PDF" placeholder="https://..." />
              <MiniInput label="Tips Belajar" placeholder="Cara efektif memahami materi ini" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold">
              <button type="button" onClick={() => toast.success("Draft materi berhasil disimpan")} className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-[#bdb6f6] bg-white px-2 py-2 text-[#5b6191] transition-all hover:bg-[#f0edff] active:scale-95"><Save className="h-3.5 w-3.5" /> Simpan Draft</button>
              <button type="button" className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-[#6d5dfc]/45 bg-[#f7f4ff] px-2 py-2 text-[#6d5dfc] transition-all hover:bg-[#f0edff] active:scale-95"><Eye className="h-3.5 w-3.5" /> Preview</button>
              <button type="button" onClick={() => toast.success("Materi berhasil dipublish")} className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white transition-all hover:opacity-90 active:scale-95"><Send className="h-3.5 w-3.5" /> Publish</button>
            </div>
          </div>
        </Surface>
        <Surface title="Preview Siswa">
          <article className="rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-3">
            <p className="text-[12px] font-semibold text-[#2b325b]">Persamaan Linear Dasar</p>
            <p className="mt-1 text-[10px] text-[#6f759a]">Tipe: Text - Durasi: 12 menit</p>
            <div className="mt-3 rounded-[10px] bg-[#faf8ff] p-2.5 text-[10px] leading-5 text-[#535b84]">
              Di materi ini siswa mempelajari bentuk umum persamaan linear satu variabel, langkah penyelesaian, dan latihan dasar.
            </div>
          </article>
        </Surface>
      </section>
    </div>
  );
}
