"use client";

import { AlertCircle, ExternalLink, FileText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { teacherApi, type TaskSubmissionDetail } from "@/lib/api-client";

type TaskReviewSubmissionDetailProps = {
  submissionId: string;
  backHref: string;
};

export function TaskReviewSubmissionDetail({
  submissionId,
  backHref,
}: TaskReviewSubmissionDetailProps) {
  const { toast } = useToast();
  const [detail, setDetail] = useState<TaskSubmissionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [detailError, setDetailError] = useState("");
  const [scoreInput, setScoreInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadDetail = async () => {
      setLoadingDetail(true);
      setDetailError("");

      try {
        const response = await teacherApi.getTaskSubmissionDetail(submissionId);
        if (cancelled) return;

        setDetail(response);
        setScoreInput(response.score !== null ? String(response.score) : "");
        setFeedback(response.teacherFeedback ?? "");
      } catch (error: unknown) {
        if (cancelled) return;
        setDetail(null);
        setDetailError(error instanceof Error ? error.message : "Gagal memuat detail review tugas.");
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    };

    void loadDetail();

    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const previewScore = useMemo(() => {
    if (scoreInput.trim() === "") return null;

    const numericValue = Number(scoreInput);
    if (!Number.isFinite(numericValue)) return null;

    return Math.max(0, Math.min(100, Math.round(numericValue)));
  }, [scoreInput]);

  const handleScoreChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly === "") {
      setScoreInput("");
      return;
    }

    const normalized = digitsOnly.slice(0, 3);
    const nextValue = Number(normalized);
    setScoreInput(String(Math.min(100, nextValue)));
  };

  const handleAction = async (action: "draft" | "revision" | "publish") => {
    if (!detail) return;
    if (previewScore === null) {
      toast.error?.("Nilai wajib diisi terlebih dahulu.");
      return;
    }

    setSaving(true);
    try {
      const updated = await teacherApi.gradeTaskSubmission(submissionId, {
        score: previewScore,
        teacherFeedback: feedback,
        action,
      });

      setDetail(updated);
      setScoreInput(updated.score !== null ? String(updated.score) : "");
      setFeedback(updated.teacherFeedback ?? "");

      if (action === "draft") toast.success("Draft penilaian disimpan.");
      if (action === "revision") toast.success("Permintaan revisi dikirim ke siswa.");
      if (action === "publish") toast.success("Nilai tugas berhasil dipublish.");
    } catch (error: unknown) {
      toast.error?.(error instanceof Error ? error.message : "Gagal menyimpan aksi review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Detail Submission Tugas"
        description="Periksa submission siswa secara fokus lalu beri nilai akhir secara langsung dari 0 sampai 100."
        actionHref={backHref}
        actionLabel="Kembali ke pengumpulan"
      />

      <Surface title="Review Submission">
        {loadingDetail ? (
          <div className="flex h-full items-center justify-center rounded-[18px] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Memuat detail submission tugas...</p>
          </div>
        ) : detailError ? (
          <div className="flex h-full items-center justify-center rounded-[18px] border border-[#f4d1d8] bg-[#fff7f9] px-4 py-8 text-center">
            <p className="text-[13px] text-[#b25a70]">{detailError}</p>
          </div>
        ) : detail ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
                    {previewScore ?? detail.score ?? "-"}/100
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
              <div className="rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-white p-4 shadow-[0_10px_20px_rgba(28,24,62,0.03)]">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a92b6]">
                  Submission Siswa
                </p>
                <div className="mt-3 space-y-2">
                  {detail.submissionLink ? (
                    <div className="flex items-center justify-between rounded-[14px] border border-[rgba(113,94,215,0.10)] bg-[#fbfaff] px-3 py-2.5">
                      <p className="truncate pr-3 text-[13px] text-[#4e5378]">{detail.submissionLink}</p>
                      <a
                        href={detail.submissionLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#d8d2ff] bg-white text-[#6c63ad] hover:border-[#715ed7] hover:text-[#715ed7]"
                        aria-label="Buka submission link"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  ) : null}

                  {detail.submissionFile ? (
                    <div className="flex items-center justify-between rounded-[14px] border border-[rgba(113,94,215,0.10)] bg-[#fbfaff] px-3 py-2.5">
                      <p className="truncate pr-3 text-[13px] text-[#4e5378]">{detail.submissionFile.fileName}</p>
                      <a
                        href={detail.submissionFile.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#d8d2ff] bg-white text-[#6c63ad] hover:border-[#715ed7] hover:text-[#715ed7]"
                        aria-label="Buka file submission"
                      >
                        <FileText className="h-4 w-4" />
                      </a>
                    </div>
                  ) : null}

                  {!detail.submissionLink && !detail.submissionFile ? (
                    <p className="text-[13px] text-[#626b8b]">Tidak ada submission dari siswa.</p>
                  ) : null}
                </div>
              </div>

              <label className="block rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-white p-4 shadow-[0_10px_20px_rgba(28,24,62,0.03)]">
                <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a92b6]">
                  Nilai Akhir
                </span>
                <div className="mt-3 flex items-center gap-3 rounded-[14px] border border-[rgba(113,94,215,0.10)] bg-[#fbfaff] px-3 py-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={scoreInput}
                    onChange={(event) => handleScoreChange(event.target.value)}
                    className="w-24 rounded-[10px] border border-[rgba(113,94,215,0.14)] bg-white px-3 py-2 text-center text-[16px] font-semibold text-[#3e4670] outline-none focus:border-[#715ed7]"
                    placeholder="Nilai"
                    aria-label="Nilai akhir tugas"
                  />
                  <p className="text-[13px] text-[#626b8b]">Masukkan nilai langsung dari 0 sampai 100.</p>
                </div>
              </label>

              <label className="block rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-white p-4 shadow-[0_10px_20px_rgba(28,24,62,0.03)]">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#8a92b6]">
                  <AlertCircle className="h-4 w-4" /> Feedback Guru
                </span>
                <textarea
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  className="mt-3 h-24 w-full resize-none rounded-[14px] border border-[rgba(113,94,215,0.12)] bg-[#fbfaff] p-3 text-[13px] text-[#4f5678] outline-none focus:border-[#715ed7]"
                  placeholder="Berikan catatan, masukan, atau alasan mengapa siswa perlu melakukan revisi..."
                />
              </label>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2 rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-white p-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAction("draft")}
                  disabled={saving}
                  className="rounded-[12px] border border-[#d7d1ff] bg-white px-3 py-2 text-[12px] font-semibold text-[#625b9d] transition-colors hover:border-[#715ed7] hover:text-[#715ed7] disabled:opacity-50"
                >
                  Simpan Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleAction("revision")}
                  disabled={saving}
                  className="rounded-[12px] border border-[#d7d1ff] bg-white px-3 py-2 text-[12px] font-semibold text-[#625b9d] transition-colors hover:border-[#715ed7] hover:text-[#715ed7] disabled:opacity-50"
                >
                  Minta Revisi
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleAction("publish")}
                disabled={saving}
                className="rounded-[12px] bg-[#715ed7] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_12px_24px_rgba(113,94,215,0.18)] transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Publish Nilai"}
              </button>
            </div>
          </div>
        ) : null}
      </Surface>
    </div>
  );
}
