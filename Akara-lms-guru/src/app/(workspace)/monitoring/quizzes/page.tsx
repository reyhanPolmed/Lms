"use client";

import Link from "next/link";
import { Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";

import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { teacherApi, type QuizItem } from "@/lib/api-client";

type EditDraft = {
  id: string;
  title: string;
  moduleName: string;
  passScore: string;
  durationMinutes: string;
  isAktif: boolean;
  questions: {
    id: string;
    pertanyaan: string;
    opsiA: string;
    opsiB: string;
    opsiC: string;
    opsiD: string;
    opsiBenar: "A" | "B" | "C" | "D";
  }[];
};

export default function QuizMonitoringPage() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [previewDraft, setPreviewDraft] = useState<QuizItem | null>(null);
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("");

  const loadQuizzes = useCallback(() => {
    setLoading(true);
    teacherApi
      .getQuizzes()
      .then(setQuizzes)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const subjects = useMemo(
    () => Array.from(new Set(quizzes.map((q) => q.moduleName ?? "").filter(Boolean))),
    [quizzes]
  );

  const filtered = useMemo(
    () => (subjectFilter ? quizzes.filter((q) => q.moduleName === subjectFilter) : quizzes),
    [quizzes, subjectFilter]
  );

  const publishedCount = useMemo(() => filtered.filter((q) => q.isActive).length, [filtered]);

  const openEdit = (quiz: QuizItem) => {
    setEditError("");
    setEditDraft({
      id: quiz.id,
      title: quiz.title,
      moduleName: quiz.moduleName ?? "",
      passScore: String(quiz.passScore),
      durationMinutes: String(quiz.durationMinutes ?? ""),
      isAktif: quiz.isActive,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        pertanyaan: q.pertanyaan,
        opsiA: q.opsiA,
        opsiB: q.opsiB,
        opsiC: q.opsiC,
        opsiD: q.opsiD,
        opsiBenar: q.opsiBenar as "A" | "B" | "C" | "D",
      })),
    });
  };

  const removeQuiz = async (quiz: QuizItem) => {
    try {
      await teacherApi.deleteQuiz(quiz.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      if (editDraft?.id === quiz.id) setEditDraft(null);
      toast.delete("Kuis berhasil dihapus");
    } catch (e: unknown) {
      toast.error?.(e instanceof Error ? e.message : "Gagal menghapus kuis");
    }
  };

  const saveEdit = async () => {
    if (!editDraft) return;
    const score = Number(editDraft.passScore);
    const duration = Number(editDraft.durationMinutes);
    if (!editDraft.title.trim()) return setEditError("Judul wajib diisi.");
    if (Number.isNaN(score) || score < 0 || score > 100) return setEditError("Pass score harus 0-100.");
    if (editDraft.durationMinutes && (Number.isNaN(duration) || duration < 1))
      return setEditError("Durasi tidak valid.");

    setSaving(true);
    try {
      const updated = await teacherApi.updateQuiz(editDraft.id, {
        judul: editDraft.title.trim(),
        skorLulus: score,
        durasiMenit: editDraft.durationMinutes ? duration : undefined,
        isAktif: editDraft.isAktif,
        questions: editDraft.questions.map((q) => ({
          pertanyaan: q.pertanyaan,
          opsiA: q.opsiA,
          opsiB: q.opsiB,
          opsiC: q.opsiC,
          opsiD: q.opsiD,
          opsiBenar: q.opsiBenar,
        })),
      });
      setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? { ...updated, moduleName: q.moduleName } : q)));
      setEditDraft(null);
      setEditError("");
      toast.success("Perubahan kuis disimpan");
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (quiz: QuizItem) => {
    try {
      const updated = await teacherApi.updateQuizStatus(quiz.id, !quiz.isActive);
      setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? { ...updated, moduleName: q.moduleName } : q)));
      toast.success(`Kuis ${updated.isActive ? "dipublish" : "dijadikan draft"}`);
    } catch (e: unknown) {
      toast.error?.(e instanceof Error ? e.message : "Gagal mengubah status");
    }
  };

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Monitoring Kuis"
        description="Kelola kuis aktif, pantau status publish, dan lihat hasil authoring terbaru."
      />

      <Surface
        title="Filter Monitoring"
        action={
          <Link
            href="/editor/quiz"
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-3 py-1.5 text-[10px] font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Kuis
          </Link>
        }
      >
        <div className="grid gap-2 md:grid-cols-4">
          <MiniSelect
            label="Mata Pelajaran"
            options={subjects}
            placeholder="Semua mapel"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
          />
        </div>
      </Surface>

      <Surface title={`Daftar Kuis (${filtered.length} kuis, ${publishedCount} published)`}>
        {loading ? (
          <p className="py-6 text-center text-[11px] text-[#7e84a8]">Memuat kuis...</p>
        ) : error ? (
          <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[10px] text-[#ba4b64]">
            {error}
          </p>
        ) : (
          <div className="min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            <table className="w-full text-left text-[10px] text-[#7e84a8]">
              <thead className="bg-[#faf8ff] text-[8.5px] uppercase tracking-[0.16em] text-[#60658e]">
                <tr>
                  <th className="px-3 py-2">Kuis</th>
                  <th className="px-2 py-2">Mata Pelajaran</th>
                  <th className="px-2 py-2">Soal</th>
                  <th className="px-2 py-2">Pass</th>
                  <th className="px-2 py-2">Durasi</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(113,94,215,0.1)]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-[10px] text-[#7e84a8]">
                      Belum ada kuis. Tambah kuis baru dengan tombol di atas.
                    </td>
                  </tr>
                ) : (
                  filtered.map((quiz) => (
                    <tr key={quiz.id}>
                      <td className="px-3 py-2.5 font-semibold text-[#4e5378]">{quiz.title}</td>
                      <td className="px-2 py-2.5">{quiz.moduleName ?? "—"}</td>
                      <td className="px-2 py-2.5">{quiz.questionCount}</td>
                      <td className="px-2 py-2.5">{quiz.passScore}</td>
                      <td className="px-2 py-2.5">{quiz.durationMinutes ? `${quiz.durationMinutes} mnt` : "—"}</td>
                      <td className="px-2 py-2.5">
                        <Badge status={quiz.isActive ? "published" : "draft"} />
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => setPreviewDraft(quiz)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-[rgba(113,94,215,0.2)] bg-[#faf8ff] px-2 py-1 text-[9px] text-[#6d5dfc] transition-colors hover:bg-[#f0eaff]"
                          >
                            <Eye className="h-3 w-3" /> Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(quiz)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-[rgba(113,94,215,0.2)] bg-white px-2 py-1 text-[9px] text-[#5b6191] transition-colors hover:bg-[#faf9ff]"
                          >
                            <SquarePen className="h-3 w-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleStatus(quiz)}
                            className={`inline-flex cursor-pointer items-center gap-1 rounded-[7px] px-2 py-1 text-[9px] transition-colors ${
                              quiz.isActive
                                ? "border border-[rgba(113,94,215,0.2)] bg-white text-[#5b6191] hover:bg-[#faf9ff]"
                                : "border border-[rgba(47,140,87,0.3)] bg-[#eaf6ee] text-[#2f8c57] hover:bg-[#d5f0e0]"
                            }`}
                          >
                            {quiz.isActive ? "Draft" : "Publish"}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeQuiz(quiz)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-[rgba(233,84,116,0.24)] bg-[#fff5f7] px-2 py-1 text-[9px] text-[#c54564] transition-colors hover:bg-[#ffeef1]"
                          >
                            <Trash2 className="h-3 w-3" /> Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Surface>

      {/* Preview Modal */}
      {previewDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-[rgba(113,94,215,0.12)] bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-[rgba(113,94,215,0.1)] bg-[#faf8ff] px-5 py-4">
              <div>
                <h2 className="text-[14px] font-semibold text-[#2c315b]">{previewDraft.title}</h2>
                <p className="mt-0.5 text-[10px] text-[#6f759a]">
                  {previewDraft.moduleName} • {previewDraft.durationMinutes ?? "—"} menit
                </p>
              </div>
              <button onClick={() => setPreviewDraft(null)} className="cursor-pointer rounded-full p-1.5 text-[#5b6191] hover:bg-[#f0edff]">
                Tutup
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                {previewDraft.questions.map((q, idx) => (
                  <article key={q.id} className="rounded-[12px] border border-[rgba(113,94,215,0.1)] p-4">
                    <p className="text-[11px] font-semibold text-[#4e5378]">{idx + 1}. {q.pertanyaan}</p>
                    <div className="mt-3 space-y-1.5">
                      {(["A", "B", "C", "D"] as const).map((opt) => (
                        <div
                          key={opt}
                          className={`rounded-[8px] border p-2 text-[10px] ${
                            opt === q.opsiBenar
                              ? "border-[#c1e6d1] bg-[#f0fcf5] font-semibold text-[#2f8c57]"
                              : "border-[rgba(113,94,215,0.1)] text-[#6f759a]"
                          }`}
                        >
                          {opt}. {q[`opsi${opt}` as keyof typeof q]}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-[rgba(113,94,215,0.12)] bg-[#fbfaff] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[rgba(113,94,215,0.1)] bg-white px-5 py-4">
              <div>
                <h2 className="text-[14px] font-semibold text-[#2c315b]">Edit Kuis</h2>
                <p className="mt-0.5 text-[10px] text-[#6f759a]">Ubah detail dan daftar soal kuis</p>
              </div>
              <button onClick={() => { setEditDraft(null); setEditError(""); }} className="cursor-pointer rounded-full p-1.5 text-[#5b6191] hover:bg-[#f0edff]">
                Tutup
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Judul Kuis", key: "title", type: "text" },
                  { label: "Pass Score", key: "passScore", type: "number" },
                  { label: "Durasi (Menit)", key: "durationMinutes", type: "number" },
                ].map(({ label, key, type }) => (
                  <label key={key} className="block">
                    <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">{label}</span>
                    <input
                      type={type}
                      value={editDraft[key as keyof EditDraft] as string}
                      onChange={(e) => setEditDraft((prev) => prev ? { ...prev, [key]: e.target.value } : prev)}
                      className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Status</span>
                  <select
                    value={editDraft.isAktif ? "published" : "draft"}
                    onChange={(e) => setEditDraft((prev) => prev ? { ...prev, isAktif: e.target.value === "published" } : prev)}
                    className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <p className="border-b border-[rgba(113,94,215,0.1)] pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7e84a8]">Daftar Soal</p>
                {editDraft.questions.map((q, idx) => (
                  <article key={q.id} className="rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-4">
                    <p className="mb-2 text-[10px] font-bold text-[#5b4aab]">Soal {idx + 1}</p>
                    <textarea
                      value={q.pertanyaan}
                      onChange={(e) => setEditDraft((prev) => {
                        if (!prev) return prev;
                        return { ...prev, questions: prev.questions.map((x) => x.id === q.id ? { ...x, pertanyaan: e.target.value } : x) };
                      })}
                      className="h-16 w-full rounded-[8px] border border-[rgba(113,94,215,0.12)] bg-[#faf9ff] p-2 text-[11px] text-[#4f5678] outline-none"
                    />
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(["A", "B", "C", "D"] as const).map((opt) => (
                        <div key={opt} className="flex items-center gap-2">
                          <input
                            value={q[`opsi${opt}` as keyof typeof q] as string}
                            onChange={(e) => setEditDraft((prev) => {
                              if (!prev) return prev;
                              return { ...prev, questions: prev.questions.map((x) => x.id === q.id ? { ...x, [`opsi${opt}`]: e.target.value } : x) };
                            })}
                            placeholder={`Opsi ${opt}`}
                            className="h-8 flex-1 rounded-[7px] border border-[rgba(113,94,215,0.12)] bg-[#faf8ff] px-2 text-[10px] text-[#616a92] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setEditDraft((prev) => prev ? { ...prev, questions: prev.questions.map((x) => x.id === q.id ? { ...x, opsiBenar: opt } : x) } : prev)}
                            className={`rounded-[6px] px-2 py-1 text-[9px] font-semibold ${q.opsiBenar === opt ? "bg-[#eaf6ee] text-[#2f8c57]" : "border border-[rgba(113,94,215,0.2)] bg-white text-[#5b6191]"}`}
                          >
                            {q.opsiBenar === opt ? "✓" : opt}
                          </button>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {editError && (
                <p className="rounded-[10px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[10px] text-[#ba4b64]">
                  {editError}
                </p>
              )}
            </div>

            <footer className="border-t border-[rgba(113,94,215,0.1)] bg-white px-5 py-4">
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setEditDraft(null); setEditError(""); }}
                  className="cursor-pointer rounded-[10px] border border-[rgba(113,94,215,0.2)] bg-white px-5 py-2.5 text-[11px] font-bold text-[#5b6191] hover:bg-[#faf9ff]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  disabled={saving}
                  className="cursor-pointer rounded-[10px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-5 py-2.5 text-[11px] font-bold text-white hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
