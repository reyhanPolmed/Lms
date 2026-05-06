"use client";

import Link from "next/link";
import { Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { type AuthoredQuizQuestion, deleteAuthoredQuiz, getAuthoredQuizzes, upsertAuthoredQuiz } from "@/lib/quiz-authoring";
import { defaultMonitoringQuizzes, mapAuthoredQuizToMonitoringRecord, type MonitoringQuizRecord } from "@/lib/quiz-monitoring-data";
import { quizMonitoring, modules } from "@/lib/teacher-mocks";

type MonitoringQuizRow = MonitoringQuizRecord & {
  source: "authored" | "seeded";
};

type EditDraft = {
  id: string;
  source: "authored" | "seeded";
  title: string;
  moduleName: string;
  passScore: string;
  durationMinutes: string;
  deadline: string;
  status: "draft" | "published";
  questions: AuthoredQuizQuestion[];
};

function buildQuestion(index: number): AuthoredQuizQuestion {
  return {
    id: `q-${Date.now()}-${index}`,
    prompt: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
  };
}

function formatDateTime(value?: string) {
  if (!value) return "-";
  return value.replace("T", " ");
}

export default function QuizMonitoringPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<MonitoringQuizRow[]>([]);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [previewDraft, setPreviewDraft] = useState<EditDraft | null>(null);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const authoredRows = getAuthoredQuizzes().map((item) => ({
      ...mapAuthoredQuizToMonitoringRecord(item),
      source: "authored" as const,
    }));
    const seededRows = defaultMonitoringQuizzes.map((item) => ({ ...item, source: "seeded" as const }));
    setRows([...authoredRows, ...seededRows].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }, []);

  const created = searchParams.get("created") === "1";

  const rowCount = rows.length;
  const publishedCount = useMemo(() => rows.filter((row) => row.status === "published").length, [rows]);

  const openEdit = (row: MonitoringQuizRow) => {
    setEditError("");
    
    let draftQuestions: AuthoredQuizQuestion[] = [];
    if (row.source === "authored") {
      const target = getAuthoredQuizzes().find((item) => item.id === row.id);
      if (target) {
        draftQuestions = target.questions;
      }
    }
    
    if (draftQuestions.length === 0) {
      draftQuestions = Array.from({ length: row.questionCount || 1 }).map((_, i) => ({
        id: `seed-q-${Date.now()}-${i}`,
        prompt: `Pertanyaan ke-${i + 1} (Mock)`,
        options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
        correctOptionIndex: 0,
      }));
    }

    setEditDraft({
      id: row.id,
      source: row.source,
      title: row.title,
      moduleName: row.moduleName,
      passScore: String(row.passScore),
      durationMinutes: String(row.durationMinutes),
      deadline: row.deadline ?? "",
      status: row.status,
      questions: draftQuestions,
    });
  };

  const openPreview = (row: MonitoringQuizRow) => {
    let draftQuestions: AuthoredQuizQuestion[] = [];
    if (row.source === "authored") {
      const target = getAuthoredQuizzes().find((item) => item.id === row.id);
      if (target) {
        draftQuestions = target.questions;
      }
    }
    
    if (draftQuestions.length === 0) {
      draftQuestions = Array.from({ length: row.questionCount || 1 }).map((_, i) => ({
        id: `seed-q-${Date.now()}-${i}`,
        prompt: `Pertanyaan ke-${i + 1} (Mock)`,
        options: ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
        correctOptionIndex: 0,
      }));
    }

    setPreviewDraft({
      id: row.id,
      source: row.source,
      title: row.title,
      moduleName: row.moduleName,
      passScore: String(row.passScore),
      durationMinutes: String(row.durationMinutes),
      deadline: row.deadline ?? "",
      status: row.status,
      questions: draftQuestions,
    });
  };

  const updateQuestionPrompt = (questionId: string, value: string) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) => (q.id === questionId ? { ...q, prompt: value } : q)),
      };
    });
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) => {
          if (q.id !== questionId) return q;
          const nextOptions = [...q.options];
          nextOptions[optionIndex] = value;
          return { ...q, options: nextOptions };
        }),
      };
    });
  };

  const updateCorrectOption = (questionId: string, correctOptionIndex: number) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) => (q.id === questionId ? { ...q, correctOptionIndex } : q)),
      };
    });
  };

  const addQuestion = () => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      return { ...prev, questions: [...prev.questions, buildQuestion(prev.questions.length + 1)] };
    });
  };

  const removeQuestion = (questionId: string) => {
    setEditDraft((prev) => {
      if (!prev) return prev;
      if (prev.questions.length <= 1) return prev;
      return { ...prev, questions: prev.questions.filter((q) => q.id !== questionId) };
    });
  };

  const removeRow = (row: MonitoringQuizRow) => {
    setRows((prev) => prev.filter((item) => item.id !== row.id));

    if (row.source === "authored") {
      deleteAuthoredQuiz(row.id);
    }

    if (editDraft?.id === row.id) {
      setEditDraft(null);
      setEditError("");
    }
    toast.delete("Kuis berhasil dihapus dari monitoring");
  };

  const saveEdit = () => {
    if (!editDraft) return;

    if (!editDraft.title.trim() || !editDraft.moduleName.trim()) {
      setEditError("Judul dan modul wajib diisi.");
      return;
    }

    const score = Number(editDraft.passScore);
    if (Number.isNaN(score) || score < 0 || score > 100) {
      setEditError("Pass score harus angka 0-100.");
      return;
    }

    const duration = Number(editDraft.durationMinutes);
    if (Number.isNaN(duration) || duration < 20 || duration > 90) {
      setEditError("Durasi kuis harus antara 20 sampai 90 menit.");
      return;
    }

    if (editDraft.questions.length === 0) {
      setEditError("Minimal harus ada 1 soal.");
      return;
    }

    for (let index = 0; index < editDraft.questions.length; index += 1) {
      const question = editDraft.questions[index];
      if (!question.prompt.trim()) {
        setEditError(`Soal ${index + 1} belum diisi.`);
        return;
      }
      if (question.options.some((option) => !option.trim())) {
        setEditError(`Semua opsi pada soal ${index + 1} harus diisi.`);
        return;
      }
    }

    const updatedAt = new Date().toISOString();

    setRows((prev) =>
      prev
        .map((row) =>
          row.id === editDraft.id
            ? {
                ...row,
                title: editDraft.title.trim(),
                moduleName: editDraft.moduleName.trim(),
                passScore: score,
                durationMinutes: duration,
                deadline: editDraft.deadline || undefined,
                status: editDraft.status,
                questionCount: editDraft.questions.length,
                updatedAt,
              }
            : row,
        )
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    );

    if (editDraft.source === "authored") {
      const authoredList = getAuthoredQuizzes();
      const target = authoredList.find((item) => item.id === editDraft.id);

      if (target) {
        upsertAuthoredQuiz({
          ...target,
          title: editDraft.title.trim(),
          moduleName: editDraft.moduleName.trim(),
          passScore: score,
          durationMinutes: duration,
          deadline: editDraft.deadline || undefined,
          status: editDraft.status,
          questions: editDraft.questions,
          updatedAt,
        });
      }
    }

    setEditError("");
    setEditDraft(null);
    toast.success("Perubahan kuis berhasil disimpan");
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
          <MiniSelect label="Mata Pelajaran" options={Array.from(new Set(modules.map(m => m.name)))} placeholder="Semua mapel" />
        </div>
      </Surface>

      <Surface title={`Daftar Kuis Monitoring (${rowCount} kuis, ${publishedCount} published)`}>
        <div className="space-y-2">
          {created ? (
            <p className="rounded-[10px] border border-[#cfe9d9] bg-[#eefaf3] px-3 py-2 text-[10px] text-[#2f8c57]">
              Kuis berhasil ditambahkan dan langsung tampil di daftar monitoring.
            </p>
          ) : null}

          {editDraft ? (
            <div className="rounded-[12px] border border-[rgba(113,94,215,0.16)] bg-[#fbfaff] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7e84a8]">Edit Kuis</p>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Judul Kuis</span>
                  <input
                    value={editDraft.title}
                    onChange={(event) => setEditDraft((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                    placeholder="Judul kuis"
                    className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Modul</span>
                  <input
                    value={editDraft.moduleName}
                    onChange={(event) => setEditDraft((prev) => (prev ? { ...prev, moduleName: event.target.value } : prev))}
                    placeholder="Modul"
                    className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Pass Score</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editDraft.passScore}
                    onChange={(event) => setEditDraft((prev) => (prev ? { ...prev, passScore: event.target.value } : prev))}
                    placeholder="Pass score"
                    className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Durasi (Menit)</span>
                  <input
                    type="number"
                    min={20}
                    max={90}
                    value={editDraft.durationMinutes}
                    onChange={(event) =>
                      setEditDraft((prev) => (prev ? { ...prev, durationMinutes: event.target.value } : prev))
                    }
                    placeholder="Durasi menit"
                    className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Status</span>
                  <select
                    value={editDraft.status}
                    onChange={(event) =>
                      setEditDraft((prev) =>
                        prev ? { ...prev, status: event.target.value as "draft" | "published" } : prev,
                      )
                    }
                    className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                </label>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Daftar Soal</p>
                {editDraft.questions.map((question, idx) => (
                  <article key={question.id} className="rounded-[11px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7e84a8]">Soal {idx + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeQuestion(question.id)}
                        disabled={editDraft.questions.length <= 1}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-[rgba(233,84,116,0.2)] bg-[#fff5f7] px-2 py-1 text-[9px] text-[#c54564] transition-colors hover:bg-[#ffeef1] disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" /> Hapus
                      </button>
                    </div>

                    <label className="mt-2 block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">Pertanyaan</span>
                      <textarea
                        value={question.prompt}
                        onChange={(event) => updateQuestionPrompt(question.id, event.target.value)}
                        className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none"
                      />
                    </label>

                    <div className="mt-2 grid gap-1">
                      {question.options.map((option, optionIndex) => (
                        <div key={`${question.id}-option-${optionIndex}`} className="grid grid-cols-[1fr_auto] gap-2">
                          <input
                            value={option}
                            onChange={(event) => updateQuestionOption(question.id, optionIndex, event.target.value)}
                            placeholder={`Opsi ${String.fromCharCode(65 + optionIndex)}`}
                            className="h-9 w-full rounded-[8px] border border-[rgba(113,94,215,0.12)] bg-[#faf8ff] px-3 text-[10px] text-[#616a92] outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => updateCorrectOption(question.id, optionIndex)}
                            className={`cursor-pointer rounded-[8px] px-2 text-[9px] font-semibold transition-colors ${
                              question.correctOptionIndex === optionIndex
                                ? "bg-[#eaf6ee] text-[#2f8c57]"
                                : "border border-[rgba(113,94,215,0.2)] bg-white text-[#5b6191] hover:bg-[#faf9ff]"
                            }`}
                          >
                            {question.correctOptionIndex === optionIndex ? "Jawaban Benar" : "Pilih Benar"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}

                <button
                  type="button"
                  onClick={addQuestion}
                  className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-dashed border-[#bcb5f4] bg-[#faf7ff] px-2 py-2 text-[10px] font-semibold text-[#6d5dfc] transition-colors hover:bg-[#f0eaff]"
                >
                  <Plus className="h-3.5 w-3.5" /> Tambah Soal
                </button>
              </div>

              {editError ? <p className="mt-4 rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-2 py-1.5 text-[9px] text-[#ba4b64]">{editError}</p> : null}

              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setEditDraft(null);
                    setEditError("");
                  }}
                  className="rounded-[9px] border border-[rgba(113,94,215,0.2)] bg-white px-2 py-2 text-[#5b6191]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          ) : null}

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
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2.5 font-semibold text-[#4e5378]">{row.title}</td>
                    <td className="px-2 py-2.5">{row.moduleName}</td>
                    <td className="px-2 py-2.5">{row.questionCount}</td>
                    <td className="px-2 py-2.5">{row.passScore}</td>
                    <td className="px-2 py-2.5">{row.durationMinutes} menit</td>
                    <td className="px-2 py-2.5">
                      <Badge status={row.status} />
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openPreview(row)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-[rgba(113,94,215,0.2)] bg-[#faf8ff] px-2 py-1 text-[9px] text-[#6d5dfc] transition-colors hover:bg-[#f0eaff]"
                        >
                          <Eye className="h-3 w-3" /> Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-[rgba(113,94,215,0.2)] bg-white px-2 py-1 text-[9px] text-[#5b6191] transition-colors hover:bg-[#faf9ff]"
                        >
                          <SquarePen className="h-3 w-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRow(row)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-[rgba(233,84,116,0.24)] bg-[#fff5f7] px-2 py-1 text-[9px] text-[#c54564] transition-colors hover:bg-[#ffeef1]"
                        >
                          <Trash2 className="h-3 w-3" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Surface>

      {previewDraft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-[18px] border border-[rgba(113,94,215,0.12)] bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-[rgba(113,94,215,0.1)] bg-[#faf8ff] px-5 py-4">
              <div>
                <h2 className="text-[14px] font-semibold text-[#2c315b]">{previewDraft.title}</h2>
                <p className="mt-0.5 text-[10px] text-[#6f759a]">Mata Pelajaran: {previewDraft.moduleName} • Durasi: {previewDraft.durationMinutes} menit</p>
              </div>
              <button
                onClick={() => setPreviewDraft(null)}
                className="cursor-pointer rounded-full p-1.5 text-[#5b6191] hover:bg-[#f0edff]"
              >
                Tutup
              </button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                {previewDraft.questions.map((q, idx) => (
                  <article key={q.id} className="rounded-[12px] border border-[rgba(113,94,215,0.1)] p-4">
                    <p className="text-[11px] font-semibold text-[#4e5378]">{idx + 1}. {q.prompt}</p>
                    <div className="mt-3 space-y-1.5">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`rounded-[8px] border p-2 text-[10px] ${oIdx === q.correctOptionIndex ? "border-[#c1e6d1] bg-[#f0fcf5] text-[#2f8c57] font-semibold" : "border-[rgba(113,94,215,0.1)] text-[#6f759a]"}`}
                        >
                          {String.fromCharCode(65 + oIdx)}. {opt}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
