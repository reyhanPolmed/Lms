"use client";

import { use, useEffect, useState, useCallback } from "react";
import { Badge, PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, StudentProgressDetail } from "@/lib/api-client";
import { useToast } from "@/components/workspace/toast";

export default function StudentModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleId: string; studentId: string }>;
}) {
  const { moduleId, studentId } = use(params);
  const { toast } = useToast();
  const [data, setData] = useState<StudentProgressDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await teacherApi.getStudentProgressDetail(moduleId, studentId);
      setData(res);
      setNote(res.internalNote || "");
    } catch (e: any) {
      setError(e.message || "Gagal memuat detail progress");
    } finally {
      setLoading(false);
    }
  }, [moduleId, studentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveNote = async () => {
    setSaving(true);
    try {
      // Assuming there's an endpoint or it's part of another one
      // For now, let's just toast
      toast.success("Catatan internal disimpan (Mock)");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[12px] text-[#626b8b]">Memuat detail siswa...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 text-[13px] text-[#ba4b64]">
        {error || "Data tidak ditemukan"}
      </div>
    );
  }

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Detail Siswa: ${data.student.name}`}
        description={`Journey siswa pada modul ${data.module.title}: timeline item, status, nilai, feedback.`}
      />
      <section className="grid min-h-0 gap-2 xl:grid-cols-[1.2fr_0.8fr]">
        <Surface title="Timeline Item Belajar">
          <div className="space-y-2">
            {data.timeline.length > 0 ? (
              data.timeline.map((row) => (
                <article key={row.id} className="rounded-[11px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-[#2b325b]">{row.item}</p>
                    <Badge status={row.status as any} />
                  </div>
                  <p className="mt-1 text-[9.5px] text-[#565f7d]">{row.note}</p>
                  {row.timestamp && (
                    <p className="mt-0.5 text-[12px] text-[#a1a7c7]">
                      {new Date(row.timestamp).toLocaleString()}
                    </p>
                  )}
                </article>
              ))
            ) : (
              <p className="text-center text-[12px] text-[#626b8b] py-8">Belum ada aktivitas belajar.</p>
            )}
          </div>
        </Surface>
        <Surface title="Catatan Guru Internal">
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
              Catatan
            </span>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-40 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[13px] text-[#4f5678] outline-none" 
            />
          </label>
          <button 
            onClick={handleSaveNote}
            disabled={saving}
            className="mt-2 w-full cursor-pointer rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-[12px] font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Catatan"}
          </button>
        </Surface>
      </section>
    </div>
  );
}
