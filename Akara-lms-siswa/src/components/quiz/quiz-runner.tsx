"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { LessonPagination } from "@/components/lesson/lesson-pagination";
import { QuizDetail, QuizSubmitPayload, SidebarEntry } from "@/lib/types";

export function QuizRunner({
  quiz,
  onStart,
  onSubmit,
  isStarting,
  isSubmitting,
  previousItem,
  nextItem
}: {
  quiz: QuizDetail;
  onStart: () => Promise<unknown>;
  onSubmit: (payload: QuizSubmitPayload) => Promise<unknown>;
  isStarting: boolean;
  isSubmitting: boolean;
  previousItem?: SidebarEntry | null;
  nextItem?: SidebarEntry | null;
}) {
  const [phase, setPhase] = useState<"intro" | "running" | "submitted">("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [fullscreenViolation, setFullscreenViolation] = useState(false);
  const [result, setResult] = useState<{ score: number; isPassed: boolean } | null>(null);

  const orderedQuestions = useMemo(() => {
    const order = questionOrder.length > 0 ? questionOrder : quiz.questionOrder;

    if (order.length === 0) {
      return quiz.questions;
    }

    return order
      .map((id) => quiz.questions.find((question) => question.id === id))
      .filter((question): question is NonNullable<typeof question> => Boolean(question));
  }, [questionOrder, quiz.questionOrder, quiz.questions]);

  const unansweredCount = orderedQuestions.filter((question) => !answers[question.id]).length;

  const handleStart = async () => {
    try {
      const response = (await onStart()) as { questionOrder?: string[] } | undefined;
      setQuestionOrder(response?.questionOrder ?? quiz.questionOrder);
      setAnswers({});
      setFullscreenViolation(false);
      setPhase("running");
      toast.success("Quiz dimulai");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memulai quiz");
    }
  };

  const handleSubmit = async () => {
    if (orderedQuestions.length === 0) {
      toast.error("Belum ada pertanyaan dari backend");
      return;
    }

    if (unansweredCount > 0) {
      toast.error(`Masih ada ${unansweredCount} pertanyaan yang belum dijawab`);
      return;
    }

    try {
      const response = await onSubmit({
        answers,
        fullscreenViolation
      });
      const submission = response as { score: number; isPassed: boolean };
      setResult(submission);
      setPhase("submitted");
      toast.success("Quiz berhasil disubmit");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal submit quiz");
    }
  };

  const handleRetry = async () => {
    setResult(null);
    await handleStart();
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-6">
        <p className="eyebrow">Rules</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold">Ketentuan quiz</h2>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
          <li>Question order diambil dari backend saat start attempt.</li>
          <li>Jawaban dikirim sekaligus pada submit.</li>
          <li>Fullscreen violation dapat menurunkan skor sesuai aturan backend.</li>
        </ul>
      </section>
      <section className="surface-card p-8">
        {phase === "intro" ? (
          <>
            <p className="eyebrow">Quiz intro</p>
            <h1 className="mt-2 font-heading text-4xl font-semibold text-slate-950">{quiz.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{quiz.intro}</p>
            <div className="mt-8 grid gap-4 rounded-[28px] bg-slate-50 p-6 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Durasi</p>
                <p className="mt-2 font-heading text-2xl font-semibold">{quiz.durationMinutes} menit</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Passing grade</p>
                <p className="mt-2 font-heading text-2xl font-semibold">{quiz.passScore}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pertanyaan</p>
                <p className="mt-2 font-heading text-2xl font-semibold">{quiz.questions.length}</p>
              </div>
            </div>
            <button
              className="mt-8 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              disabled={isStarting || quiz.questions.length === 0}
              onClick={() => handleStart()}
              type="button"
            >
              {quiz.questions.length === 0 ? "Belum ada pertanyaan" : isStarting ? "Memulai..." : "Mulai quiz"}
            </button>
          </>
        ) : phase === "running" ? (
          <>
            <p className="eyebrow">Quiz attempt</p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-slate-950">{quiz.title}</h1>
            <div className="mt-6 space-y-6">
              {orderedQuestions.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Belum ada pertanyaan dari backend.
                </div>
              ) : (
                orderedQuestions.map((question, index) => (
                  <div key={question.id} className="rounded-[28px] border border-slate-200 p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Pertanyaan {index + 1}
                    </p>
                    <p className="mt-3 font-heading text-xl font-semibold text-slate-950">
                      {question.prompt}
                    </p>
                    <div className="mt-5 grid gap-3">
                      {question.options.map((option) => (
                        <label
                          key={option.key}
                          className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-slate-300"
                        >
                          <input
                            checked={answers[question.id] === option.key}
                            className="mt-1"
                            name={question.id}
                            onChange={() =>
                              setAnswers((current) => ({
                                ...current,
                                [question.id]: option.key
                              }))
                            }
                            type="radio"
                          />
                          <span className="text-sm leading-6 text-slate-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 rounded-[28px] bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <label className="flex items-start gap-3">
                <input
                  checked={fullscreenViolation}
                  onChange={(event) => setFullscreenViolation(event.target.checked)}
                  type="checkbox"
                />
                <span>{quiz.penaltyNote}</span>
              </label>
            </div>

            <button
              className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              disabled={isSubmitting || unansweredCount > 0 || orderedQuestions.length === 0}
              onClick={() => handleSubmit()}
              type="button"
            >
              {isSubmitting ? "Mengirim..." : unansweredCount > 0 ? "Lengkapi jawaban" : "Submit jawaban"}
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">Quiz result</p>
            <h1 className="mt-2 font-heading text-4xl font-semibold text-slate-950">Hasil quiz</h1>
            <div className="mt-8 rounded-[32px] bg-slate-950 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Score</p>
              <p className="mt-3 font-heading text-6xl font-semibold">{result?.score ?? quiz.lastScore ?? 0}</p>
              <p className="mt-4 text-sm text-slate-300">
                {result?.isPassed ? "Status lulus" : "Belum lulus"} dengan passing grade {quiz.passScore}.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {!result?.isPassed ? (
                <button
                  className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
                  disabled={isStarting}
                  onClick={() => void handleRetry()}
                  type="button"
                >
                  {isStarting ? "Memulai..." : "Ulangi kuis"}
                </button>
              ) : null}
            </div>
          </>
        )}
      </section>

      <LessonPagination nextItem={nextItem} previousItem={previousItem} />
    </div>
  );
}
