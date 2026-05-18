"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { LessonPagination } from "@/components/lesson/lesson-pagination";
import {
  QuizAttempt,
  QuizAttemptSavePayload,
  QuizDetail,
  QuizSubmitPayload,
  SidebarEntry
} from "@/lib/types";
import { cn } from "@/lib/utils";

const ATTEMPT_SNAPSHOT_PREFIX = "akara_quiz_attempt_snapshot";
const ATTEMPT_LOCK_PREFIX = "akara_quiz_attempt_lock";
const ATTEMPT_LOCK_TTL_MS = 12000;
const ATTEMPT_LOCK_HEARTBEAT_MS = 4000;

type AttemptSnapshot = {
  attemptId: string;
  answers: Record<string, string>;
  fullscreenViolation: boolean;
  pendingSync: boolean;
  updatedAt: string;
};

type AttemptLock = {
  tabId: string;
  updatedAt: number;
};

function getAttemptSnapshotKey(quizId: string) {
  return `${ATTEMPT_SNAPSHOT_PREFIX}:${quizId}`;
}

function getAttemptLockKey(attemptId: string) {
  return `${ATTEMPT_LOCK_PREFIX}:${attemptId}`;
}

function serializeAnswers(answers: Record<string, string>) {
  return JSON.stringify(
    Object.entries(answers).sort(([left], [right]) => left.localeCompare(right, "en"))
  );
}

function readAttemptSnapshot(quizId: string): AttemptSnapshot | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getAttemptSnapshotKey(quizId));
    if (!raw) return null;
    return JSON.parse(raw) as AttemptSnapshot;
  } catch {
    return null;
  }
}

function writeAttemptSnapshot(quizId: string, snapshot: AttemptSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getAttemptSnapshotKey(quizId), JSON.stringify(snapshot));
}

function clearAttemptSnapshot(quizId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getAttemptSnapshotKey(quizId));
}

function readAttemptLock(attemptId: string): AttemptLock | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getAttemptLockKey(attemptId));
    if (!raw) return null;
    return JSON.parse(raw) as AttemptLock;
  } catch {
    return null;
  }
}

function writeAttemptLock(attemptId: string, lock: AttemptLock) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getAttemptLockKey(attemptId), JSON.stringify(lock));
}

function clearAttemptLock(attemptId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getAttemptLockKey(attemptId));
}

function isAttemptLockStale(lock: AttemptLock | null) {
  if (!lock) {
    return true;
  }

  return Date.now() - lock.updatedAt > ATTEMPT_LOCK_TTL_MS;
}

function formatRemainingTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function isLikelyOffline(error: unknown) {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return true;
  }

  return (
    error instanceof Error &&
    /(network|connect|timeout|server|offline|fetch)/i.test(error.message)
  );
}

function getInitialPhase(quiz: QuizDetail) {
  if (quiz.activeAttempt) {
    return "running" as const;
  }

  if (quiz.latestSubmittedAttempt) {
    return "submitted" as const;
  }

  return "intro" as const;
}

export function QuizRunner({
  quiz,
  onStart,
  onAutosave,
  onSubmit,
  isAutosaving,
  isStarting,
  isSubmitting,
  previousItem,
  nextItem
}: {
  quiz: QuizDetail;
  onStart: () => Promise<QuizAttempt>;
  onAutosave: (payload: QuizAttemptSavePayload) => Promise<QuizAttempt>;
  onSubmit: (payload: QuizSubmitPayload) => Promise<QuizAttempt>;
  isAutosaving: boolean;
  isStarting: boolean;
  isSubmitting: boolean;
  previousItem?: SidebarEntry | null;
  nextItem?: SidebarEntry | null;
}) {
  const [phase, setPhase] = useState<"intro" | "running" | "submitted">(getInitialPhase(quiz));
  const [attempt, setAttempt] = useState<QuizAttempt | null>(quiz.activeAttempt ?? null);
  const [answers, setAnswers] = useState<Record<string, string>>(quiz.activeAttempt?.answers ?? {});
  const [questionOrder, setQuestionOrder] = useState<string[]>(
    quiz.activeAttempt?.questionOrder ?? quiz.questionOrder
  );
  const [fullscreenViolation, setFullscreenViolation] = useState(false);
  const [result, setResult] = useState<QuizAttempt | null>(quiz.latestSubmittedAttempt ?? null);
  const [remainingSeconds, setRemainingSeconds] = useState(quiz.activeAttempt?.remainingSeconds ?? 0);
  const [syncState, setSyncState] = useState<"idle" | "saving" | "saved" | "offline" | "error">(
    quiz.activeAttempt ? "saved" : "idle"
  );
  const [isPrimaryTab, setIsPrimaryTab] = useState(true);

  const tabIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );
  const claimLockRef = useRef<(() => void) | null>(null);
  const isPrimaryTabRef = useRef(true);
  const submitInFlightRef = useRef(false);
  const lastSavedSignatureRef = useRef(serializeAnswers(quiz.activeAttempt?.answers ?? {}));

  const orderedQuestions = useMemo(() => {
    const order = questionOrder.length > 0 ? questionOrder : quiz.questionOrder;

    if (order.length === 0) {
      return quiz.questions;
    }

    return order
      .map((id) => quiz.questions.find((question) => question.id === id))
      .filter((question): question is NonNullable<typeof question> => Boolean(question));
  }, [questionOrder, quiz.questionOrder, quiz.questions]);

  const answerSignature = useMemo(() => serializeAnswers(answers), [answers]);
  const unansweredCount = orderedQuestions.filter((question) => !answers[question.id]).length;
  const submissionResult = result ?? quiz.latestSubmittedAttempt ?? null;
  const canRetry = Boolean(submissionResult && quiz.attemptsRemaining > 0);
  const isTimeUp = Boolean(attempt && attempt.durationSeconds > 0 && remainingSeconds <= 0);

  const syncAttemptFromServer = (nextAttempt: QuizAttempt) => {
    const snapshot = readAttemptSnapshot(quiz.id);
    const hasSnapshot = snapshot?.attemptId === nextAttempt.id;
    const mergedAnswers = hasSnapshot
      ? {
          ...nextAttempt.answers,
          ...snapshot.answers
        }
      : nextAttempt.answers;

    lastSavedSignatureRef.current = serializeAnswers(nextAttempt.answers);
    setAttempt(nextAttempt);
    setQuestionOrder(nextAttempt.questionOrder);
    setAnswers(mergedAnswers);
    setRemainingSeconds(nextAttempt.remainingSeconds);
    setFullscreenViolation(hasSnapshot ? snapshot.fullscreenViolation : false);
    setResult(null);
    setPhase("running");
    setSyncState(hasSnapshot && snapshot.pendingSync ? "offline" : "saved");

    writeAttemptSnapshot(quiz.id, {
      attemptId: nextAttempt.id,
      answers: mergedAnswers,
      fullscreenViolation: hasSnapshot ? snapshot.fullscreenViolation : false,
      pendingSync: Boolean(hasSnapshot && snapshot.pendingSync),
      updatedAt: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (quiz.activeAttempt) {
      syncAttemptFromServer(quiz.activeAttempt);
      return;
    }

    if (quiz.latestSubmittedAttempt) {
      setAttempt(null);
      setAnswers(quiz.latestSubmittedAttempt.answers);
      setQuestionOrder(quiz.latestSubmittedAttempt.questionOrder);
      setResult(quiz.latestSubmittedAttempt);
      setRemainingSeconds(0);
      setFullscreenViolation(false);
      setPhase("submitted");
      setSyncState("idle");
      clearAttemptSnapshot(quiz.id);
      return;
    }

    setAttempt(null);
    setAnswers({});
    setQuestionOrder(quiz.questionOrder);
    setResult(null);
    setRemainingSeconds(0);
    setFullscreenViolation(false);
    setPhase("intro");
    setSyncState("idle");
    clearAttemptSnapshot(quiz.id);
  }, [quiz.activeAttempt, quiz.id, quiz.latestSubmittedAttempt, quiz.questionOrder]);

  useEffect(() => {
    if (!attempt || phase !== "running") {
      setIsPrimaryTab(true);
      isPrimaryTabRef.current = true;
      return;
    }

    const attemptId = attempt.id;
    const claimLock = () => {
      writeAttemptLock(attemptId, {
        tabId: tabIdRef.current,
        updatedAt: Date.now()
      });
      isPrimaryTabRef.current = true;
      setIsPrimaryTab(true);
    };

    claimLockRef.current = claimLock;

    const evaluateLock = () => {
      const currentLock = readAttemptLock(attemptId);

      if (!currentLock || currentLock.tabId === tabIdRef.current || isAttemptLockStale(currentLock)) {
        claimLock();
        return;
      }

      isPrimaryTabRef.current = false;
      setIsPrimaryTab(false);
    };

    evaluateLock();

    const heartbeat = window.setInterval(() => {
      const currentLock = readAttemptLock(attemptId);

      if (isPrimaryTabRef.current) {
        writeAttemptLock(attemptId, {
          tabId: tabIdRef.current,
          updatedAt: Date.now()
        });
        return;
      }

      if (!currentLock || isAttemptLockStale(currentLock)) {
        claimLock();
      }
    }, ATTEMPT_LOCK_HEARTBEAT_MS);

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== getAttemptLockKey(attemptId)) {
        return;
      }

      const currentLock = readAttemptLock(attemptId);
      if (!currentLock || currentLock.tabId === tabIdRef.current || isAttemptLockStale(currentLock)) {
        return;
      }

      isPrimaryTabRef.current = false;
      setIsPrimaryTab(false);
    };

    const handleBeforeUnload = () => {
      const currentLock = readAttemptLock(attemptId);
      if (currentLock?.tabId === tabIdRef.current) {
        clearAttemptLock(attemptId);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.clearInterval(heartbeat);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("beforeunload", handleBeforeUnload);

      const currentLock = readAttemptLock(attemptId);
      if (currentLock?.tabId === tabIdRef.current) {
        clearAttemptLock(attemptId);
      }
    };
  }, [attempt, phase]);

  useEffect(() => {
    if (!attempt || phase !== "running") {
      return;
    }

    setRemainingSeconds(attempt.remainingSeconds);

    if (attempt.remainingSeconds <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setRemainingSeconds((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [attempt, phase]);

  useEffect(() => {
    if (!attempt) {
      return;
    }

    writeAttemptSnapshot(quiz.id, {
      attemptId: attempt.id,
      answers,
      fullscreenViolation,
      pendingSync: syncState === "offline" || syncState === "error",
      updatedAt: new Date().toISOString()
    });
  }, [answers, attempt, fullscreenViolation, quiz.id, syncState]);

  useEffect(() => {
    if (!attempt || phase !== "running" || !isPrimaryTab || submitInFlightRef.current) {
      return;
    }

    if (answerSignature === lastSavedSignatureRef.current) {
      return;
    }

    const timeout = window.setTimeout(async () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        setSyncState("offline");
        return;
      }

      setSyncState("saving");

      try {
        const updatedAttempt = await onAutosave({
          attemptId: attempt.id,
          answers
        });
        lastSavedSignatureRef.current = serializeAnswers(updatedAttempt.answers);
        setAttempt(updatedAttempt);
        setQuestionOrder(updatedAttempt.questionOrder);
        setRemainingSeconds(updatedAttempt.remainingSeconds);
        setSyncState("saved");
      } catch (error) {
        setSyncState(isLikelyOffline(error) ? "offline" : "error");
      }
    }, 800);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [answerSignature, answers, attempt, isPrimaryTab, onAutosave, phase]);

  useEffect(() => {
    const handleOnline = () => {
      if (!attempt || phase !== "running" || !isPrimaryTabRef.current) {
        return;
      }

      if (answerSignature === lastSavedSignatureRef.current) {
        setSyncState("saved");
        return;
      }

      setSyncState("saving");
      void onAutosave({
        attemptId: attempt.id,
        answers
      })
        .then((updatedAttempt) => {
          lastSavedSignatureRef.current = serializeAnswers(updatedAttempt.answers);
          setAttempt(updatedAttempt);
          setQuestionOrder(updatedAttempt.questionOrder);
          setRemainingSeconds(updatedAttempt.remainingSeconds);
          setSyncState("saved");
        })
        .catch((error) => {
          setSyncState(isLikelyOffline(error) ? "offline" : "error");
        });
    };

    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [answerSignature, answers, attempt, onAutosave, phase]);

  const handleStart = async () => {
    try {
      const response = await onStart();
      const isResume = response.status === "in_progress" && response.answers
        ? Object.keys(response.answers).length > 0 || response.id === quiz.activeAttempt?.id
        : false;
      syncAttemptFromServer(response);
      toast.success(isResume ? "Attempt aktif dilanjutkan" : "Quiz dimulai");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal memulai quiz");
    }
  };

  const handleSubmit = async () => {
    if (!attempt) {
      toast.error("Attempt quiz belum tersedia");
      return;
    }

    if (!isPrimaryTab) {
      toast.error("Tab ini hanya mode baca. Ambil alih sesi untuk submit.");
      return;
    }

    if (submitInFlightRef.current) {
      return;
    }

    if (orderedQuestions.length === 0) {
      toast.error("Belum ada pertanyaan dari backend");
      return;
    }

    if (unansweredCount > 0) {
      toast.error(`Masih ada ${unansweredCount} pertanyaan yang belum dijawab`);
      return;
    }

    submitInFlightRef.current = true;

    try {
      const submission = await onSubmit({
        attemptId: attempt.id,
        answers,
        fullscreenViolation
      });
      setResult(submission);
      setAttempt(null);
      setPhase("submitted");
      setSyncState("idle");
      clearAttemptSnapshot(quiz.id);
      clearAttemptLock(submission.id);
      toast.success(
        submission.submissionTiming === "late"
          ? "Quiz disubmit. Status terlambat divalidasi backend."
          : "Quiz berhasil disubmit"
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal submit quiz");
    } finally {
      submitInFlightRef.current = false;
    }
  };

  const handleRetry = async () => {
    setResult(null);
    await handleStart();
  };

  const handleTakeOver = () => {
    claimLockRef.current?.();
    toast.success("Sesi attempt dipindahkan ke tab ini");
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-6">
        <p className="eyebrow">Rules</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold">Ketentuan quiz</h2>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
          <li>Attempt aktif selalu dilanjutkan dari backend, bukan dibuat ulang saat refresh.</li>
          <li>Jawaban diautosave ke backend dan akan disimpan lokal saat koneksi terputus.</li>
          <li>Timer, batas 2 attempt, skor akhir, dan status submit divalidasi penuh di backend.</li>
        </ul>
      </section>

      <section className="surface-card p-8">
        {phase === "intro" ? (
          <>
            <p className="eyebrow">Quiz intro</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">{quiz.title}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{quiz.intro}</p>
            <div className="mt-8 grid gap-4 rounded-[24px] border border-slate-200/80 bg-slate-50 p-6 md:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Durasi</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{quiz.durationMinutes} menit</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Passing grade</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{quiz.passScore}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Pertanyaan</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">{quiz.questions.length}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Attempt tersisa</p>
                <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
                  {quiz.attemptsRemaining}/{quiz.maxAttempts}
                </p>
              </div>
            </div>
            <button
              className="mt-8 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              disabled={isStarting || quiz.questions.length === 0 || quiz.attemptsRemaining <= 0}
              onClick={() => void handleStart()}
              type="button"
            >
              {quiz.questions.length === 0
                ? "Belum ada pertanyaan"
                : quiz.attemptsRemaining <= 0
                  ? "Batas attempt tercapai"
                  : isStarting
                    ? "Memulai..."
                    : "Mulai quiz"}
            </button>
          </>
        ) : phase === "running" && attempt ? (
          <>
            <p className="eyebrow">Quiz attempt</p>
            <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950">{quiz.title}</h1>
                <p className="mt-2 text-sm text-slate-600">
                  Attempt {attempt.attemptNumber} dari {quiz.maxAttempts}
                </p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 text-right">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Timer</p>
                <p className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">
                  {attempt.durationSeconds > 0 ? formatRemainingTime(remainingSeconds) : "Tanpa batas"}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {isTimeUp ? "Waktu lokal habis. Backend akan memvalidasi saat submit." : "Timer sinkron ke backend"}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
                {isAutosaving || syncState === "saving"
                  ? "Autosave menyimpan..."
                  : syncState === "offline"
                    ? "Offline: jawaban disimpan lokal"
                    : syncState === "error"
                      ? "Autosave gagal, akan dicoba lagi"
                      : "Jawaban tersimpan"}
              </span>
              {!isPrimaryTab ? (
                <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-amber-800">
                  Tab ini mode baca karena sesi aktif dibuka di tab lain
                </span>
              ) : null}
            </div>

            {!isPrimaryTab ? (
              <div className="mt-5 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <p>Input dan submit dikunci di tab ini untuk mencegah submit ganda.</p>
                <button
                  className="mt-3 rounded-2xl border border-amber-300 bg-white px-4 py-2 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
                  onClick={handleTakeOver}
                  type="button"
                >
                  Ambil alih sesi ini
                </button>
              </div>
            ) : null}

            <div className="mt-6 space-y-6">
              {orderedQuestions.length === 0 ? (
                <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Belum ada pertanyaan dari backend.
                </div>
              ) : (
                orderedQuestions.map((question, index) => (
                  <div key={question.id} className="rounded-[24px] border border-slate-200 bg-white p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Pertanyaan {index + 1}
                    </p>
                    <p className="mt-3 text-xl font-semibold tracking-[-0.03em] text-slate-950">
                      {question.prompt}
                    </p>
                    <div className="mt-5 grid gap-3">
                      {question.options.map((option) => {
                        const selectedOption = answers[question.id] === option.key;

                        return (
                          <label
                            key={option.key}
                            className={cn(
                              "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition",
                              selectedOption
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            )}
                          >
                            <input
                              checked={selectedOption}
                              className="mt-1 accent-slate-900"
                              disabled={!isPrimaryTab || isSubmitting}
                              name={question.id}
                              onChange={() =>
                                setAnswers((current) => ({
                                  ...current,
                                  [question.id]: option.key
                                }))
                              }
                              type="radio"
                            />
                            <span
                              className={cn(
                                "text-sm leading-6",
                                selectedOption ? "text-white" : "text-slate-700"
                              )}
                            >
                              {option.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 rounded-[28px] bg-amber-50 p-5 text-sm leading-6 text-amber-900">
              <label className="flex items-start gap-3">
                <input
                  className="mt-1 accent-amber-700"
                  checked={fullscreenViolation}
                  disabled={!isPrimaryTab || isSubmitting}
                  onChange={(event) => setFullscreenViolation(event.target.checked)}
                  type="checkbox"
                />
                <span>{quiz.penaltyNote}</span>
              </label>
            </div>

            <button
              className="mt-6 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              disabled={!isPrimaryTab || isSubmitting || unansweredCount > 0 || orderedQuestions.length === 0}
              onClick={() => void handleSubmit()}
              type="button"
            >
              {isSubmitting
                ? "Mengirim..."
                : unansweredCount > 0
                  ? "Lengkapi jawaban"
                  : "Submit jawaban"}
            </button>
          </>
        ) : (
          <>
            <p className="eyebrow">Quiz result</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] text-slate-950">Hasil quiz</h1>
            <div className="mt-8 rounded-[28px] bg-slate-950 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Score</p>
              <p className="mt-3 text-6xl font-semibold tracking-[-0.05em]">{submissionResult?.score ?? 0}</p>
              <p className="mt-4 text-sm text-slate-300">
                {submissionResult?.isPassed ? "Status lulus" : "Belum lulus"} dengan passing grade{" "}
                {quiz.passScore}.
              </p>
              <p className="mt-3 text-xs text-slate-400">
                Attempt terakhir: {submissionResult?.attemptNumber ?? quiz.attemptsUsed} dari {quiz.maxAttempts}
                {submissionResult?.submissionTiming === "late" ? " • tervalidasi terlambat oleh backend" : ""}
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {canRetry && !submissionResult?.isPassed ? (
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
