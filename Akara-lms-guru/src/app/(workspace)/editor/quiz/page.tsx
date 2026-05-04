"use client";

import { Eye, Plus, Save, Send, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader, Surface } from "@/components/workspace/ui";
import { type AuthoredQuiz, type AuthoredQuizQuestion, upsertAuthoredQuiz } from "@/lib/quiz-authoring";

const QUIZ_DURATION_OPTIONS = [
  { value: "20", label: "20 menit" },
  { value: "30", label: "30 menit" },
  { value: "45", label: "45 menit" },
  { value: "60", label: "60 menit (1 jam)" },
  { value: "75", label: "75 menit (1 jam 15 menit)" },
  { value: "90", label: "90 menit (1 jam 30 menit)" },
];

function buildQuestion(index: number): AuthoredQuizQuestion {
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

export default function QuizEditorPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [moduleName, setModuleName] = useState("");
  const [className, setClassName] = useState("");
  const [passScore, setPassScore] = useState("75");
  const [durationMinutes, setDurationMinutes] = useState(QUIZ_DURATION_OPTIONS[0].value);
  const [deadline, setDeadline] = useState("");
  const [penaltyNote, setPenaltyNote] = useState("");
  const [questions, setQuestions] = useState<AuthoredQuizQuestion[]>([buildQuestion(1)]);
  const [errorMessage, setErrorMessage] = useState("");

  const questionCount = questions.length;

  const canPreview = useMemo(
    () => title.trim().length > 0 || questions.some((question) => question.prompt.trim().length > 0),
    [questions, title],
  );

  const updateQuestionPrompt = (questionId: string, value: string) => {
    setQuestions((prev) => prev.map((question) => (question.id === questionId ? { ...question, prompt: value } : question)));
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions((prev) =>
      prev.map((question) => {
        if (question.id !== questionId) return question;

        const nextOptions = [...question.options];
        nextOptions[optionIndex] = value;

        return { ...question, options: nextOptions };
      }),
    );
  };

  const updateCorrectOption = (questionId: string, correctOptionIndex: number) => {
    setQuestions((prev) => prev.map((question) => (question.id === questionId ? { ...question, correctOptionIndex } : question)));
  };

  const addQuestion = () => {
    setQuestions((prev) => [...prev, buildQuestion(prev.length + 1)]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((question) => question.id !== questionId);
    });
  };

  const validatePayload = () => {
    if (!title.trim()) return "Judul kuis wajib diisi.";
    if (!moduleName.trim()) return "Nama modul wajib diisi.";
    if (!className.trim()) return "Kelas target wajib diisi.";

    const score = Number(passScore);
    if (Number.isNaN(score) || score < 0 || score > 100) return "Pass score harus angka 0 sampai 100.";

    if (questions.length === 0) return "Minimal harus ada 1 soal.";

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index];
      if (!question.prompt.trim()) return `Soal ${index + 1} belum diisi.`;
      if (question.options.some((option) => !option.trim())) return `Semua opsi pada soal ${index + 1} harus diisi.`;
    }

    return "";
  };

  const saveQuiz = (status: AuthoredQuiz["status"]) => {
    const validationError = validatePayload();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const now = new Date().toISOString();

    const payload: AuthoredQuiz = {
      id: `quiz-${Date.now()}`,
      title: title.trim(),
      moduleName: moduleName.trim(),
      className: className.trim(),
      passScore: Number(passScore),
      durationMinutes: Number(durationMinutes),
      deadline: deadline || undefined,
      penaltyNote: penaltyNote.trim() || undefined,
      status,
      createdAt: now,
      updatedAt: now,
      questions,
    };

    upsertAuthoredQuiz(payload);
    router.push("/monitoring/quizzes?created=1");
  };

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Editor Kuis"
        description="Composer soal pilihan ganda dengan validasi kelengkapan sebelum disimpan ke Monitoring Kuis."
      />
      <section className="grid min-h-0 gap-2 xl:grid-cols-[1.35fr_0.85fr]">
        <Surface title="Form & Composer Soal">
          <div className="grid gap-2">
            <div className="grid gap-2 md:grid-cols-2">
              <label className="block">
                <FieldLabel>Judul Kuis</FieldLabel>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
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
                  onChange={(event) => setPassScore(event.target.value)}
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
              </label>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <label className="block">
                <FieldLabel>Modul</FieldLabel>
                <input
                  value={moduleName}
                  onChange={(event) => setModuleName(event.target.value)}
                  placeholder="Contoh: Matematika Inti"
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
              </label>
              <label className="block">
                <FieldLabel>Kelas Target</FieldLabel>
                <input
                  value={className}
                  onChange={(event) => setClassName(event.target.value)}
                  placeholder="Contoh: 8A, 8B"
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
              </label>
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <label className="block">
                <FieldLabel>Durasi Kuis</FieldLabel>
                <select
                  value={durationMinutes}
                  onChange={(event) => setDurationMinutes(event.target.value)}
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                >
                  {QUIZ_DURATION_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <FieldLabel>Deadline (Opsional)</FieldLabel>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(event) => setDeadline(event.target.value)}
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
              </label>
            </div>

            <label className="block">
              <FieldLabel>Catatan Penalti (Opsional)</FieldLabel>
              <input
                value={penaltyNote}
                onChange={(event) => setPenaltyNote(event.target.value)}
                placeholder="Contoh: Telat submit: -10 poin"
                className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
              />
            </label>

            <div className="space-y-2">
              {questions.map((question, idx) => (
                <article key={question.id} className="rounded-[11px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7e84a8]">Soal {idx + 1}</p>
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      disabled={questions.length <= 1}
                      className="inline-flex items-center gap-1 rounded-[7px] border border-[rgba(233,84,116,0.2)] bg-[#fff5f7] px-2 py-1 text-[9px] text-[#c54564] disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" /> Hapus Soal
                    </button>
                  </div>

                  <label className="mt-2 block">
                    <FieldLabel>Pertanyaan</FieldLabel>
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
                          className={`rounded-[8px] px-2 text-[9px] font-semibold ${
                            question.correctOptionIndex === optionIndex
                              ? "bg-[#eaf6ee] text-[#2f8c57]"
                              : "border border-[rgba(113,94,215,0.2)] bg-white text-[#5b6191]"
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
                className="flex w-full items-center justify-center gap-1 rounded-[9px] border border-dashed border-[#bcb5f4] bg-[#faf7ff] px-2 py-2 text-[10px] font-semibold text-[#6d5dfc]"
              >
                <Plus className="h-3.5 w-3.5" /> Tambah Soal
              </button>
            </div>

            {errorMessage ? (
              <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-2 py-1.5 text-[9px] text-[#ba4b64]">{errorMessage}</p>
            ) : null}

            <div className="grid grid-cols-3 gap-2 text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => saveQuiz("draft")}
                className="flex items-center justify-center gap-1 rounded-[9px] border border-[#bdb6f6] bg-white px-2 py-2 text-[#5b6191]"
              >
                <Save className="h-3.5 w-3.5" /> Simpan Draft
              </button>
              <button
                type="button"
                disabled={!canPreview}
                className="flex items-center justify-center gap-1 rounded-[9px] border border-[#6d5dfc]/45 bg-[#f7f4ff] px-2 py-2 text-[#6d5dfc] disabled:opacity-50"
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </button>
              <button
                type="button"
                onClick={() => saveQuiz("published")}
                className="flex items-center justify-center gap-1 rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white"
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
              Pass score: <b className="text-[#2f355f]">{passScore || "-"}</b>
            </li>
            <li className="rounded-[10px] bg-[#faf8ff] px-2.5 py-2">
              Kelas target: <b className="text-[#2f355f]">{className || "-"}</b>
            </li>
            <li className="rounded-[10px] bg-[#fff1d8] px-2.5 py-2 text-[#a16514]">
              Validasi: semua soal wajib terisi dan memiliki jawaban benar.
            </li>
          </ul>
        </Surface>
      </section>
    </div>
  );
}
