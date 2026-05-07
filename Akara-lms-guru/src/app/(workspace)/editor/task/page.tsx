"use client";

import { Eye, Save, Send } from "lucide-react";

import { MiniInput, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";

export default function TaskEditorPage() {
  const { toast } = useToast();
  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Editor Tugas"
        description="Checklist, rubrik ringkas, deadline, dan opsi revisi dalam satu panel."
      />
      <section className="grid min-h-0 gap-2 xl:grid-cols-[1.35fr_0.85fr]">
        <Surface title="Form Tugas">
          <div className="grid gap-2">
            <div className="grid gap-2 md:grid-cols-2">
              <MiniInput label="Judul Tugas" placeholder="Analisis Gerak Newton" />
              <MiniInput label="Deadline" placeholder="2026-05-15 23:59" />
            </div>
            <MiniInput label="Metode Submit" placeholder="file + link / file / link" />
            <MiniInput label="Allow Revision" placeholder="ya / tidak" />
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                Deskripsi / Instruksi
              </span>
              <textarea className="h-28 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none" />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                Checklist Submission
              </span>
              <textarea className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none" placeholder="- Lampiran PDF&#10;- Link referensi&#10;- Ringkasan 200 kata" />
            </label>
            <label className="block">
              <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                Rubrik Ringkas (3-6 kriteria)
              </span>
              <textarea className="h-24 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none" placeholder="- Akurasi konsep (30)&#10;- Analisis (40)&#10;- Struktur jawaban (30)" />
            </label>
            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold">
              <button type="button" onClick={() => toast.success("Draft tugas berhasil disimpan")} className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-[#bdb6f6] bg-white px-2 py-2 text-[#5b6191] transition-all hover:bg-[#f0edff] active:scale-95"><Save className="h-3.5 w-3.5" /> Simpan Draft</button>
              <button type="button" className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-[#6d5dfc]/45 bg-[#f7f4ff] px-2 py-2 text-[#6d5dfc] transition-all hover:bg-[#f0edff] active:scale-95"><Eye className="h-3.5 w-3.5" /> Preview</button>
              <button type="button" onClick={() => toast.success("Tugas berhasil dipublish")} className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white transition-all hover:opacity-90 active:scale-95"><Send className="h-3.5 w-3.5" /> Publish</button>
            </div>
          </div>
        </Surface>
        <Surface title="Panel Penilaian Cepat">
          <div className="space-y-2 text-[10px] text-[#6f759a]">
            <div className="rounded-[10px] bg-[#faf8ff] px-2.5 py-2">Maks nilai: <b className="text-[#2f355f]">100</b></div>
            <div className="rounded-[10px] bg-[#faf8ff] px-2.5 py-2">Revisi: <b className="text-[#2f355f]">Diizinkan</b></div>
            <div className="rounded-[10px] bg-[#faf8ff] px-2.5 py-2">Checklist item: <b className="text-[#2f355f]">3</b></div>
            <div className="rounded-[10px] bg-[#fff1d8] px-2.5 py-2 text-[#a16514]">Pastikan deadline dan rubrik jelas sebelum publish.</div>
          </div>
        </Surface>
      </section>
    </div>
  );
}
