import { Badge, PageHeader, Surface } from "@/components/workspace/ui";

const timeline = [
  { item: "Lesson - Pengantar Konsep", status: "graded", note: "Selesai tepat waktu" },
  { item: "Quiz - Persamaan Dasar", status: "returned", note: "Perlu review ulang soal 4 dan 7" },
  { item: "Task - Ringkasan Bab 1", status: "submitted", note: "Menunggu penilaian" },
];

export default function StudentModuleDetailPage({
  params,
}: {
  params: { moduleId: string; studentId: string };
}) {
  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Detail Siswa: ${params.studentId}`}
        description={`Journey siswa pada modul ${params.moduleId}: timeline item, status, nilai, feedback.`}
      />
      <section className="grid min-h-0 gap-2 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface title="Timeline Item Belajar">
          <div className="space-y-2">
            {timeline.map((row) => (
              <article key={row.item} className="rounded-[11px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-[#2b325b]">{row.item}</p>
                  <Badge status={row.status} />
                </div>
                <p className="mt-1 text-[9.5px] text-[#6f759a]">{row.note}</p>
              </article>
            ))}
          </div>
        </Surface>
        <Surface title="Catatan Guru Internal">
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
              Catatan
            </span>
            <textarea className="h-40 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none" />
          </label>
          <button className="mt-2 w-full cursor-pointer rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-[10px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]">
            Kirim Pesan
          </button>
        </Surface>
      </section>
    </div>
  );
}
