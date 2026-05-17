"use client";

import { use, useEffect, useState } from "react";

import { PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { teacherApi, type QuizAttemptDetail } from "@/lib/api-client";
import { getQuestionAnswerTone } from "../../../../../../review-kuis-utils";

export default function QuizSubmissionDetailPage({
  params,
}: {
  params: Promise<{ kelasId: string; mapelId: string; submissionId: string }>;
}) {
  const { kelasId, mapelId, submissionId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeURIComponent(mapelId);
  const { toast } = useToast();

  const [detail, setDetail] = useState<QuizAttemptDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState("");
  const [savingAction, setSavingAction] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setLoadingDetail(true);
    setDetailError("");

    teacherApi
      .getQuizAttemptDetail(submissionId)
      .then((response) => {
        if (!cancelled) setDetail(response);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setDetail(null);
          setDetailError(error instanceof Error ? error.message : "Gagal memuat detail jawaban kuis.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDetail(false);
      });

    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const handleAction = async (action: "draft" | "retake" | "publish") => {
    setSavingAction(true);
    try {
      const updated = await teacherApi.gradeQuizAttempt(submissionId, action);
      setDetail(updated);

      if (action === "draft") toast.success("Draft review berhasil disimpan.");
      if (action === "retake") toast.success("Permintaan revisi dikirim ke siswa.");
      if (action === "publish") toast.success("Nilai kuis berhasil dipublish.");
    } catch (error: unknown) {
      toast.error?.(error instanceof Error ? error.message : "Gagal menyimpan aksi review.");
    } finally {
      setSavingAction(false);
    }
  };

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Detail Jawaban Kuis"
        description="Periksa jawaban siswa secara fokus lalu simpan draft, minta revisi, atau publish nilai."
        actionHref={`/review-kuis/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeURIComponent(subjectName)}`}
        actionLabel="Kembali ke pengumpulan"
      />

      <Surface title="Review Jawaban">
        {loadingDetail ? (
          <div className="flex h-full items-center justify-center rounded-[18px] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Memuat detail jawaban kuis...</p>
          </div>
        ) : detailError ? (
          <div className="flex h-full items-center justify-center rounded-[18px] border border-[#f4d1d8] bg-[#fff7f9] px-4 py-8 text-center">
            <p className="text-[13px] text-[#b25a70]">{detailError}</p>
          </div>
        ) : detail ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="rounded-[20px] border border-[rgba(113,94,215,0.10)] bg-[#fbfaff] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[17px] font-semibold text-[#262d50]">{detail.studentName}</p>
                  <p className="mt-1 text-[13px] text-[#61688d]">{detail.assignmentTitle}</p>
                  <p className="mt-1 text-[12px] text-[#6a7393]">
                    {detail.className} • {detail.courseTitle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8a92b6]">
                    Total Skor
                  </p>
                  <p className="mt-1 text-[24px] font-semibold leading-none text-[#715ed7]">
                    {detail.score ?? "—"}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
              {detail.questions.map((question, index) => (
                <article
                  key={question.id}
                  className="rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-white p-4 shadow-[0_10px_20px_rgba(28,24,62,0.03)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a92b6]">
                      Soal {index + 1}
                    </span>
                    <span className="text-[12px] font-semibold text-[#666e94]">
                      {question.points}/{question.maxPoints} poin
                    </span>
                  </div>

                  <p className="mt-3 text-[12px] font-semibold leading-6 text-[#2d345d]">
                    {question.question}
                  </p>

                  <div className={`mt-4 rounded-[16px] border p-3 ${getQuestionAnswerTone(question)}`}>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] opacity-70">
                      Jawaban siswa
                    </p>
                    <p className="mt-2 text-[13px] leading-5">
                      {question.studentAnswer ?? "Belum ada jawaban"}
                    </p>
                  </div>

                  <div className="mt-3 rounded-[16px] border border-[#d7eadc] bg-[#f5fbf6] p-3 text-[#345c43]">
                    <p className="text-[13px] font-semibold uppercase tracking-[0.14em] opacity-70">
                      Kunci jawaban
                    </p>
                    <p className="mt-2 text-[13px] leading-5">{question.correctAnswer}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-white p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction("draft")}
                  disabled={savingAction}
                  className="rounded-[12px] border border-[#d7d1ff] bg-white px-3 py-2 text-[12px] font-semibold text-[#625b9d] transition-colors hover:border-[#715ed7] hover:text-[#715ed7] disabled:opacity-50"
                >
                  Simpan Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("retake")}
                  disabled={savingAction}
                  className="rounded-[12px] border border-[#d7d1ff] bg-white px-3 py-2 text-[12px] font-semibold text-[#625b9d] transition-colors hover:border-[#715ed7] hover:text-[#715ed7] disabled:opacity-50"
                >
                  Minta Revisi
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleAction("publish")}
                disabled={savingAction}
                className="rounded-[12px] bg-[#715ed7] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_12px_24px_rgba(113,94,215,0.18)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                Publish Nilai
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-[18px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Detail pengumpulan tidak ditemukan.</p>
          </div>
        )}
      </Surface>
    </div>
  );
}
