"use client";

import {
  AlertCircle,
  CheckCircle2,
  FileQuestion,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import {
  teacherApi,
  type QuizAttemptDetail,
  type QuizItem,
  type QuizSubmissionSummary,
} from "@/lib/api-client";

function formatSubmittedAt(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function QuizReviewsPage() {
  const { toast } = useToast();

  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmissionSummary[]>([]);
  const [detail, setDetail] = useState<QuizAttemptDetail | null>(null);

  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingAction, setSavingAction] = useState(false);

  const [listError, setListError] = useState("");
  const [detailError, setDetailError] = useState("");

  const [subjectFilter, setSubjectFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [quizFilter, setQuizFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const loadQuizzes = useCallback(() => {
    setLoadingQuizzes(true);
    setListError("");

    teacherApi
      .getQuizzes()
      .then(setQuizzes)
      .catch((error: unknown) => {
        setListError(error instanceof Error ? error.message : "Gagal memuat daftar kuis.");
      })
      .finally(() => setLoadingQuizzes(false));
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const subjectOptions = useMemo(
    () => Array.from(new Set(quizzes.map((quiz) => quiz.moduleName ?? "").filter(Boolean))),
    [quizzes]
  );

  const availableQuizzes = useMemo(() => {
    return quizzes.filter((quiz) => {
      if (subjectFilter && quiz.moduleName !== subjectFilter) return false;
      return true;
    });
  }, [quizzes, subjectFilter]);

  const quizOptions = useMemo(
    () => Array.from(new Set(availableQuizzes.map((quiz) => quiz.title))),
    [availableQuizzes]
  );

  useEffect(() => {
    if (quizFilter && !quizOptions.includes(quizFilter)) {
      setQuizFilter("");
    }
  }, [quizFilter, quizOptions]);

  const activeQuizzes = useMemo(() => {
    return availableQuizzes.filter((quiz) => {
      if (quizFilter && quiz.title !== quizFilter) return false;
      return true;
    });
  }, [availableQuizzes, quizFilter]);

  useEffect(() => {
    let cancelled = false;

    if (activeQuizzes.length === 0) {
      setSubmissions([]);
      setSelectedSubmissionId(null);
      setDetail(null);
      setListError("");
      return undefined;
    }

    setLoadingSubmissions(true);
    setListError("");

    Promise.all(activeQuizzes.map((quiz) => teacherApi.getQuizSubmissions(quiz.id)))
      .then((rows) => {
        if (cancelled) return;

        const merged = rows
          .flat()
          .sort((left, right) => {
            const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0;
            const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0;
            return rightTime - leftTime;
          });

        setSubmissions(merged);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setSubmissions([]);
        setSelectedSubmissionId(null);
        setDetail(null);
        setListError(error instanceof Error ? error.message : "Gagal memuat antrean review kuis.");
      })
      .finally(() => {
        if (!cancelled) setLoadingSubmissions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeQuizzes]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((submission) => {
      if (classFilter && submission.className !== classFilter) return false;
      if (statusFilter && submission.status !== statusFilter) return false;
      return true;
    });
  }, [classFilter, statusFilter, submissions]);

  const selectedSubmission = useMemo(() => {
    return filteredSubmissions.find((submission) => submission.id === selectedSubmissionId) ?? null;
  }, [filteredSubmissions, selectedSubmissionId]);

  useEffect(() => {
    if (filteredSubmissions.length === 0) {
      setSelectedSubmissionId(null);
      setDetail(null);
      return;
    }

    if (!filteredSubmissions.some((submission) => submission.id === selectedSubmissionId)) {
      setSelectedSubmissionId(filteredSubmissions[0]!.id);
    }
  }, [filteredSubmissions, selectedSubmissionId]);

  useEffect(() => {
    let cancelled = false;

    if (!selectedSubmissionId) {
      setDetail(null);
      setDetailError("");
      return undefined;
    }

    setLoadingDetail(true);
    setDetailError("");

    teacherApi
      .getQuizAttemptDetail(selectedSubmissionId)
      .then((response) => {
        if (!cancelled) setDetail(response);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setDetail(null);
        setDetailError(error instanceof Error ? error.message : "Gagal memuat detail review kuis.");
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSubmissionId]);

  const classes = useMemo(
    () => Array.from(new Set(submissions.map((submission) => submission.className))),
    [submissions]
  );

  const statuses = useMemo(
    () => Array.from(new Set(submissions.map((submission) => submission.status))),
    [submissions]
  );

  const handleAction = async (action: "draft" | "retake" | "publish") => {
    if (!selectedSubmissionId) return;

    setSavingAction(true);
    try {
      const updated = await teacherApi.gradeQuizAttempt(selectedSubmissionId, action);
      setDetail(updated);
      setSubmissions((previous) =>
        previous.map((submission) =>
          submission.id === selectedSubmissionId
            ? {
                ...submission,
                status: updated.status,
                score: updated.score,
              }
            : submission
        )
      );

      if (action === "draft") toast.success("Status review disinkronkan.");
      if (action === "retake") toast.success("Permintaan re-take dikirim.");
      if (action === "publish") toast.success("Hasil kuis dipublish ke siswa.");
    } catch (error: unknown) {
      toast.error?.(error instanceof Error ? error.message : "Gagal menyimpan aksi review.");
    } finally {
      setSavingAction(false);
    }
  };

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Review Kuis Siswa"
        description="Filter berdasarkan mata pelajaran, kuis, dan kelas untuk memeriksa hasil kuis siswa dari backend."
      />

      <Surface title="Filter Konteks Kuis">
        <div className="grid gap-2 md:grid-cols-4">
          <MiniSelect
            label="Mata Pelajaran"
            options={subjectOptions}
            placeholder="Semua mapel"
            value={subjectFilter}
            onChange={(event) => setSubjectFilter(event.target.value)}
          />
          <MiniSelect
            label="Kelas"
            options={classes}
            placeholder="Semua kelas"
            value={classFilter}
            onChange={(event) => setClassFilter(event.target.value)}
          />
          <MiniSelect
            label="Kuis"
            options={quizOptions}
            placeholder="Semua kuis"
            value={quizFilter}
            onChange={(event) => setQuizFilter(event.target.value)}
          />
          <MiniSelect
            label="Status Review"
            options={statuses}
            placeholder="Semua status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          />
        </div>
        {listError ? (
          <p className="mt-3 rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[10px] text-[#ba4b64]">
            {listError}
          </p>
        ) : null}
      </Surface>

      <section className="grid min-h-0 gap-2 xl:grid-cols-[0.8fr_1.2fr]">
        <Surface title={`Daftar Siswa (${filteredSubmissions.length})`}>
          <div className="flex-1 min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            {loadingQuizzes || loadingSubmissions ? (
              <div className="flex h-full items-center justify-center p-4 text-center">
                <p className="text-[10px] text-[#7e84a8]">Memuat antrean review kuis...</p>
              </div>
            ) : filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedSubmissionId(row.id)}
                  className={`flex w-full cursor-pointer items-start justify-between border-b px-3 py-2.5 text-left transition-all active:scale-[0.99] last:border-b-0 ${
                    selectedSubmission?.id === row.id
                      ? "border-[rgba(113,94,215,0.4)] bg-[#f0edff]"
                      : "border-[rgba(113,94,215,0.1)] hover:bg-[#faf9ff]"
                  }`}
                >
                  <span>
                    <span className="block text-[11px] font-semibold text-[#4e5378]">
                      {row.studentName}
                    </span>
                    <span className="block text-[10px] text-[#6f759a]">
                      {row.assignmentTitle}
                    </span>
                    <span className="block text-[9px] text-[#7e84a8]">
                      {row.courseTitle} • Kelas {row.className}
                    </span>
                    <span className="block text-[9px] text-[#7e84a8]">
                      Submit: {formatSubmittedAt(row.submittedAt)}
                    </span>
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <Badge status={row.status} />
                    <span className="block text-[11px] font-bold text-[#4e5378]">
                      Skor: {row.score ?? "-"}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center">
                <p className="text-[10px] text-[#7e84a8]">
                  Tidak ada submission kuis yang cocok dengan filter saat ini.
                </p>
              </div>
            )}
          </div>
        </Surface>

        <Surface title="Detail Jawaban Kuis">
          {loadingDetail ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-[10px] text-[#7e84a8]">Memuat detail kuis...</p>
            </div>
          ) : detailError ? (
            <div className="flex h-full items-center justify-center p-4 text-center">
              <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-3 py-2 text-[10px] text-[#ba4b64]">
                {detailError}
              </p>
            </div>
          ) : detail ? (
            <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
              <div className="mb-2 shrink-0 rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-bold text-[#2b325b]">{detail.studentName}</p>
                    <p className="text-[10px] text-[#6f759a]">
                      {detail.courseTitle} • {detail.assignmentTitle}
                    </p>
                    <p className="text-[9px] text-[#7e84a8]">
                      Kelas {detail.className} • Submit: {formatSubmittedAt(detail.submittedAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7e84a8]">
                      Total Skor
                    </p>
                    <p className="text-[20px] font-black leading-none text-[#715ed7]">
                      {detail.score ?? "-"}
                      <span className="text-[12px] text-[#a5aecf]">/100</span>
                    </p>
                    <div className="mt-1 flex justify-end">
                      <Badge status={detail.status} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 rounded-[10px] border border-[rgba(113,94,215,0.08)] bg-[#faf9ff] px-3 py-2 text-[9.5px] text-[#6f759a]">
                  Skor per soal dihitung otomatis dari backend berdasarkan jawaban benar dan bobot seimbang per soal.
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {detail.questions.length > 0 ? (
                  detail.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="rounded-[10px] border border-[rgba(113,94,215,0.1)] bg-[#faf9ff] p-3"
                    >
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3e0fc] px-2 py-0.5 text-[9px] font-bold text-[#5b4aab]">
                          <FileQuestion className="h-3 w-3" /> Soal {index + 1}
                        </span>
                        <span className="text-[10px] font-semibold text-[#6f759a]">
                          Poin:{" "}
                          <span className="font-bold text-[#2b325b]">
                            {question.points}
                          </span>
                          /{question.maxPoints}
                        </span>
                      </div>

                      <p className="mb-2 text-[11px] font-semibold leading-relaxed text-[#2b325b]">
                        {question.question}
                      </p>

                      <div className="space-y-2">
                        <div className="rounded-[8px] border border-[rgba(113,94,215,0.08)] bg-white p-2">
                          <p className="mb-1 text-[9px] font-semibold uppercase text-[#a5aecf]">
                            Jawaban Siswa
                          </p>
                          <div className="flex items-start gap-2">
                            {question.isCorrect ? (
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                            ) : (
                              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                            )}
                            <p
                              className={`text-[11px] ${
                                question.isCorrect ? "text-green-700" : "text-red-600"
                              }`}
                            >
                              {question.studentAnswer ?? "Belum ada jawaban"}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-[8px] border border-[#d3f4dd] bg-[#f2fcf5] p-2">
                          <p className="mb-1 text-[9px] font-semibold uppercase text-[#56bf7a]">
                            Kunci Jawaban
                          </p>
                          <p className="text-[10px] text-[#2e6b42]">{question.correctAnswer}</p>
                        </div>

                        {question.teacherNote ? (
                          <div className="rounded-[8px] border border-[rgba(113,94,215,0.08)] bg-white p-2">
                            <p className="mb-1 text-[9px] font-semibold uppercase text-[#a5aecf]">
                              Catatan Guru
                            </p>
                            <p className="text-[10px] text-[#4e5378]">{question.teacherNote}</p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <AlertCircle className="mb-2 h-8 w-8 text-[#d1d5db]" />
                    <p className="text-[11px] text-[#6f759a]">Detail jawaban tidak tersedia.</p>
                  </div>
                )}
              </div>

              <div className="mt-3 shrink-0 rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleAction("draft")}
                    disabled={savingAction}
                    className="cursor-pointer rounded-[8px] border border-[#bdb6f6] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#5b6191] transition-all hover:bg-[#f0edff] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Simpan Draft
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction("retake")}
                      disabled={savingAction}
                      className="cursor-pointer rounded-[8px] border border-[#f0b16b] bg-[#fff8ef] px-3 py-1.5 text-[10px] font-semibold text-[#c1782c] transition-all hover:bg-[#fdf0e0] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Minta Re-take
                    </button>
                    <button
                      onClick={() => handleAction("publish")}
                      disabled={savingAction}
                      className="cursor-pointer rounded-[8px] bg-gradient-to-r from-[#56bf7a] to-[#36a662] px-4 py-1.5 text-[10px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Publish Nilai
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              {listError ? (
                <RefreshCcw className="mb-2 h-8 w-8 text-[#d1d5db]" />
              ) : (
                <FileQuestion className="mb-2 h-8 w-8 text-[#d1d5db]" />
              )}
              <p className="text-[11px] text-[#6f759a]">
                Pilih submission kuis untuk melihat detail.
              </p>
            </div>
          )}
        </Surface>
      </section>
    </div>
  );
}
