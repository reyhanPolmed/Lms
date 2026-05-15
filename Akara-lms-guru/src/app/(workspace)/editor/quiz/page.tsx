"use client";

import { Eye, Plus, Save, Send, Trash2 } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { teacherApi, type ModuleSummary } from "@/lib/api-client";

const QUIZ_DURATION_OPTIONS = [
  { value: "20", label: "20 menit" },
  { value: "30", label: "30 menit" },
  { value: "45", label: "45 menit" },
  { value: "60", label: "60 menit (1 jam)" },
  { value: "75", label: "75 menit (1 jam 15 menit)" },
  { value: "90", label: "90 menit (1 jam 30 menit)" },
];

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
};

function buildQuestion(index: number): QuizQuestion {
  return {
    id: `q-${Date.now()}-${index}`,
    prompt: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
  };
}

function FieldLabel({ children }: { children: string }) {
  return <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">{children}</span>;
}

const OPSI: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

export default function QuizEditorPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");
  const [title, setTitle] = useState("");
  const [passScore, setPassScore] = useState("75");
  const [durationMinutes, setDurationMinutes] = useState(QUIZ_DURATION_OPTIONS[0]!.value);
  const [questions, setQuestions] = useState<QuizQuestion[]>([buildQuestion(1)]);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    teacherApi.getModules().then(setModules).catch(() => {});
  }, []);

  const questionCount = questions.length;

  const canPreview = useMemo(
    () => title.trim().length > 0 || questions.some((q) => q.prompt.trim().length > 0),
    [questions, title]
  );

  const updateQuestionPrompt = (id: string, value: string) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, prompt: value } : q)));

  const updateQuestionOption = (id: string, optIdx: number, value: string) =>
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const opts = [...q.options];
        opts[optIdx] = value;
        return { ...q, options: opts };
      })
    );

  const updateCorrectOption = (id: string, idx: number) =>
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, correctOptionIndex: idx } : q)));

  const addQuestion = () =>
    setQuestions((prev) => [...prev, buildQuestion(prev.length + 1)]);

  const removeQuestion = (id: string) =>
    setQuestions((prev) => (prev.length <= 1 ? prev : prev.filter((q) => q.id !== id)));

  const validatePayload = () => {
    if (!title.trim()) return "Judul kuis wajib diisi.";
    if (!selectedModuleId) return "Pilih mata pelajaran terlebih dahulu.";
    const score = Number(passScore);
    if (Number.isNaN(score) || score < 0 || score > 100) return "Pass score harus angka 0 sampai 100.";
    if (questions.length === 0) return "Minimal harus ada 1 soal.";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]!;
      if (!q.prompt.trim()) return `Soal ${i + 1} belum diisi.`;
      if (q.options.some((o) => !o.trim())) return `Semua opsi pada soal ${i + 1} harus diisi.`;
    }
    return "";
  };

  const saveQuiz = async (isAktif: boolean) => {
    const validationError = validatePayload();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage("");
    setSaving(true);

    try {
      await teacherApi.createQuiz({
        moduleStudentClassId: selectedModuleId,
        judul: title.trim(),
        skorLulus: Number(passScore),
        durasiMenit: Number(durationMinutes),
        isAktif,
        questions: questions.map((q) => ({
          pertanyaan: q.prompt,
          opsiA: q.options[0] ?? "",
          opsiB: q.options[1] ?? "",
          opsiC: q.options[2] ?? "",
          opsiD: q.options[3] ?? "",
          opsiBenar: OPSI[q.correctOptionIndex] ?? "A",
        })),
      });

      toast.success(isAktif ? "Kuis berhasil dipublish!" : "Draft kuis berhasil disimpan!");
      router.push("/monitoring/quizzes");
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : "Gagal menyimpan kuis.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Editor Kuis"
        description="Composer soal pilihan ganda. Pilih mata pelajaran, isi judul dan soal, lalu publish."
      />
      <section className="grid min-h-0 gap-2 xl:grid-cols-[1.35fr_0.85fr]">
        <Surface title="Form & Composer Soal">
          <div className="grid gap-2">
            {/* Metadata */}
            <div className="grid gap-2 md:grid-cols-2">
              <label className="block">
                <FieldLabel>Judul Kuis</FieldLabel>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Kuis Bab 2: Persamaan Linear"
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
              </label>
              <label className="block">
                <FieldLabel>Pass Score</FieldLabel>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={passScore}
                  onChange={(e) => setPassScore(e.target.value)}
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
              </label>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <label className="block">
                <FieldLabel>Mata Pelajaran</FieldLabel>
                <select
                  value={selectedModuleId}
                  onChange={(e) => setSelectedModuleId(e.target.value)}
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                >
                  <option value="">— Pilih Mata Pelajaran —</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.gradeLevel})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <FieldLabel>Durasi Kuis</FieldLabel>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                >
                  {QUIZ_DURATION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Questions */}
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <article key={q.id} className="rounded-[11px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7e84a8]">Soal {idx + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      disabled={questions.length <= 1}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-[7px] border border-[rgba(233,84,116,0.2)] bg-[#fff5f7] px-2 py-1 text-[9px] text-[#c54564] transition-all hover:bg-[#ffeef1] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" /> Hapus Soal
                    </button>
                  </div>

                  <label className="mt-2 block">
                    <FieldLabel>Pertanyaan</FieldLabel>
                    <textarea
                      value={q.prompt}
                      onChange={(e) => updateQuestionPrompt(q.id, e.target.value)}
                      className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none"
                    />
                  </label>

                  <div className="mt-2 grid gap-1">
                    {q.options.map((opt, oIdx) => (
                      <div key={`${q.id}-${oIdx}`} className="grid grid-cols-[1fr_auto] gap-2">
                        <input
                          value={opt}
                          onChange={(e) => updateQuestionOption(q.id, oIdx, e.target.value)}
                          placeholder={`Opsi ${String.fromCharCode(65 + oIdx)}`}
                          className="h-9 w-full rounded-[8px] border border-[rgba(113,94,215,0.12)] bg-[#faf8ff] px-3 text-[10px] text-[#616a92] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => updateCorrectOption(q.id, oIdx)}
                          className={`cursor-pointer rounded-[8px] px-2 text-[9px] font-semibold transition-all active:scale-95 ${
                            q.correctOptionIndex === oIdx
                              ? "bg-[#eaf6ee] text-[#2f8c57]"
                              : "border border-[rgba(113,94,215,0.2)] bg-white text-[#5b6191] hover:bg-[#faf9ff]"
                          }`}
                        >
                          {q.correctOptionIndex === oIdx ? "Jawaban Benar" : "Pilih Benar"}
                        </button>
                      </div>
                    ))}
                  </div>
                </article>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="flex w-full cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-dashed border-[#bcb5f4] bg-[#faf7ff] px-2 py-2 text-[10px] font-semibold text-[#6d5dfc] transition-all hover:bg-[#f0eaff] active:scale-[0.99]"
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Soal
              </button>
            </div>

            {errorMessage && (
              <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-2 py-1.5 text-[9px] text-[#ba4b64]">
                {errorMessage}
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => saveQuiz(false)}
                disabled={saving}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-[#bdb6f6] bg-white px-2 py-2 text-[#5b6191] transition-all hover:bg-[#f0edff] active:scale-95 disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" /> Simpan Draft
              </button>
              <button
                type="button"
                disabled={!canPreview}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] border border-[#6d5dfc]/45 bg-[#f7f4ff] px-2 py-2 text-[#6d5dfc] transition-all hover:bg-[#f0edff] disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button
                type="button"
                onClick={() => saveQuiz(true)}
                disabled={saving}
                className="flex cursor-pointer items-center justify-center gap-1 rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Publish
              </button>
            </div>
          </div>
        </Surface>

        <Surface title="Panel Ringkas Kuis">
          <ul className="space-y-2 text-[10px] text-[#6f759a]">
            <li className="rounded-[10px] bg-[#faf8ff] px-2.5 py-2">
              Jumlah soal: <b className="text-[#2f355f]">{questionCount}</b>
            </li>
            <li className="rounded-[10px] bg-[#faf8ff] px-2.5 py-2">
              Durasi: <b className="text-[#2f355f]">{durationMinutes} menit</b>
            </li>
            <li className="rounded-[10px] bg-[#faf8ff] px-2.5 py-2">
              Pass score: <b className="text-[#2f355f]">{passScore || "—"}</b>
            </li>
            <li className="rounded-[10px] bg-[#faf8ff] px-2.5 py-2">
              Mata Pelajaran:{" "}
              <b className="text-[#2f355f]">
                {modules.find((m) => m.id === selectedModuleId)?.title ?? "—"}
              </b>
            </li>
            <li className="rounded-[10px] bg-[#fff1d8] px-2.5 py-2 text-[#a16514]">
              Validasi: semua soal wajib terisi dan memiliki jawaban benar.
            </li>
            {saving && (
              <li className="rounded-[10px] bg-[#eaf6ee] px-2.5 py-2 text-[#2f8c57]">
                Menyimpan ke database...
              </li>
            )}
          </ul>
        </Surface>
      </section>
    </div>
  );
}
