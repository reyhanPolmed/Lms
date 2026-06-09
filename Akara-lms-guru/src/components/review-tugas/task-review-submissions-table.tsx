"use client";

import Link from "next/link";

import {
  formatTaskSubmittedAt,
  getTaskReviewLabel,
  getTaskReviewToneClass,
  type ReviewTaskSubmissionRow,
} from "@/app/(workspace)/review-tugas/review-tugas-utils";
import { cn } from "@/lib/utils";

type TaskReviewSubmissionsTableProps = {
  className: string;
  subjectName: string;
  taskTitle: string;
  submissions: ReviewTaskSubmissionRow[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  buildDetailHref: (submissionId: string) => string;
  buildIntegrityHref?: (submissionId: string) => string;
};

function getOriginalityLabel(status: string) {
  switch (status) {
    case "queued":
      return "Antrean";
    case "processing":
      return "Diproses";
    case "completed":
      return "Selesai";
    case "failed":
      return "Gagal";
    default:
      return "Belum dicek";
  }
}

function getOriginalityTone(status: string) {
  switch (status) {
    case "completed":
      return "border-[#cde8d6] bg-[#edf8f1] text-[#2f8c57]";
    case "failed":
      return "border-[#f4d1d8] bg-[#fff7f9] text-[#b25a70]";
    case "queued":
    case "processing":
      return "border-[#d6e4ff] bg-[#f4f8ff] text-[#4169b2]";
    default:
      return "border-[var(--line)] bg-[var(--surface-subtle)] text-[var(--muted-ink)]";
  }
}

function formatSimilarityPercentage(value: number) {
  const normalizedValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  return `${Math.round(normalizedValue)}%`;
}

export function TaskReviewSubmissionsTable({
  className,
  subjectName,
  taskTitle,
  submissions,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  buildDetailHref,
  buildIntegrityHref,
}: TaskReviewSubmissionsTableProps) {
  const paginationItems = Array.from({ length: totalPages }, (_, index) => index + 1);
  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * 8 + 1;
  const rangeEnd = Math.min(currentPage * 8, totalCount);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-3 rounded-[18px] border border-[rgba(216,224,236,0.86)] bg-[var(--surface-subtle)] p-4">
        <p className="text-[17px] font-semibold text-[var(--page-ink)]">{taskTitle}</p>
        <p className="mt-1 text-[13px] text-[var(--muted-ink)]">
          Kelas {className} • {subjectName} • {totalCount} pengumpulan
        </p>
      </div>

      <div className="overflow-hidden rounded-[18px] border border-[rgba(216,224,236,0.86)] bg-[var(--surface)]">
        <div className="grid grid-cols-[0.88fr_0.84fr_0.5fr_0.84fr_0.76fr_1.18fr] gap-2.5 border-b border-[rgba(216,224,236,0.86)] bg-[var(--surface-subtle)] px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
          <span className="whitespace-nowrap">Siswa</span>
          <span className="whitespace-nowrap">Dikumpulkan</span>
          <span className="whitespace-nowrap">Skor</span>
          <span className="whitespace-nowrap">Status Review</span>
          <span className="whitespace-nowrap pr-3 text-center">Indeks kemiripan</span>
          <span className="whitespace-nowrap pl-3">Aksi</span>
        </div>

        <div className="divide-y divide-[rgba(216,224,236,0.86)]">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="grid grid-cols-[0.88fr_0.84fr_0.5fr_0.84fr_0.76fr_1.18fr] items-center gap-2.5 px-4 py-3 text-left"
            >
              <span className="truncate whitespace-nowrap text-[13px] font-semibold text-[var(--page-ink)]">
                {submission.studentName}
              </span>
              <span className="truncate whitespace-nowrap text-[12px] text-[var(--muted-ink)]">
                {formatTaskSubmittedAt(submission.submittedAt)}
              </span>
              <span className="whitespace-nowrap text-[12px] font-semibold text-[var(--page-ink)]">
                {submission.score !== null ? `${submission.score}/100` : "-"}
              </span>
              <span
                className={cn(
                  "inline-flex w-fit whitespace-nowrap rounded-full border px-2 py-1 text-[13px] font-semibold",
                  getTaskReviewToneClass(submission)
                )}
              >
                {getTaskReviewLabel(submission)}
              </span>
              <div className="flex justify-center">
                <span
                  className={cn(
                    "inline-flex h-fit w-fit whitespace-nowrap rounded-full border px-2 py-1 text-[12px] font-semibold",
                    getOriginalityTone(submission.originalityCheck.status)
                  )}
                >
                  {submission.originalityCheck.status === "completed"
                    ? formatSimilarityPercentage(submission.originalityCheck.maxSimilarity)
                    : getOriginalityLabel(submission.originalityCheck.status)}
                </span>
              </div>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Link
                  href={buildDetailHref(submission.id)}
                  className="inline-flex shrink-0 items-center justify-center rounded-[10px] border border-[rgba(79,70,199,0.18)] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
                >
                  Review
                </Link>
                {buildIntegrityHref && submission.originalityCheck.status === "completed" ? (
                  <Link
                    href={buildIntegrityHref(submission.id)}
                    className="inline-flex shrink-0 items-center justify-center rounded-[10px] border border-[rgba(180,83,9,0.18)] bg-[var(--warning-soft)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--warning)] hover:border-[var(--warning)]"
                  >
                    Integrity Check
                  </Link>
                ) : buildIntegrityHref ? (
                  <span className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] border border-[var(--line)] bg-[var(--surface-subtle)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--muted-ink)]">
                    {getOriginalityLabel(submission.originalityCheck.status)}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-[var(--muted-ink)]">
          {rangeStart}-{rangeEnd} dari {totalCount} pengumpulan
        </p>
        <div className="flex flex-wrap gap-1.5">
          {paginationItems.map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={cn(
                "min-w-8 rounded-[10px] px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                currentPage === page
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[rgba(216,224,236,0.86)] bg-white text-[var(--muted-ink)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              )}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
