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
        <div className="grid grid-cols-[1.15fr_1.1fr_0.95fr_0.7fr_0.9fr_1.2fr] gap-3 border-b border-[rgba(216,224,236,0.86)] bg-[var(--surface-subtle)] px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
          <span>Siswa</span>
          <span>Tugas</span>
          <span>Dikumpulkan</span>
          <span>Skor</span>
          <span>Status Review</span>
          <span>Aksi</span>
        </div>

        <div className="divide-y divide-[rgba(216,224,236,0.86)]">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="grid grid-cols-[1.15fr_1.1fr_0.95fr_0.7fr_0.9fr_1.2fr] gap-3 px-4 py-3 text-left"
            >
              <span className="text-[13px] font-semibold text-[var(--page-ink)]">
                {submission.studentName}
              </span>
              <span className="text-[12px] text-[var(--muted-ink)]">{submission.taskTitle}</span>
              <span className="text-[12px] text-[var(--muted-ink)]">
                {formatTaskSubmittedAt(submission.submittedAt)}
              </span>
              <span className="text-[12px] font-semibold text-[var(--page-ink)]">
                {submission.score !== null ? `${submission.score}/100` : "-"}
              </span>
              <span
                className={cn(
                  "inline-flex w-fit rounded-full border px-2 py-1 text-[13px] font-semibold",
                  getTaskReviewToneClass(submission)
                )}
              >
                {getTaskReviewLabel(submission)}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={buildDetailHref(submission.id)}
                  className="inline-flex w-fit items-center justify-center rounded-[10px] border border-[rgba(79,70,199,0.18)] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[var(--accent)] hover:border-[var(--accent)]"
                >
                  Review
                </Link>
                {buildIntegrityHref ? (
                  <Link
                    href={buildIntegrityHref(submission.id)}
                    className="inline-flex w-fit items-center justify-center rounded-[10px] border border-[rgba(180,83,9,0.18)] bg-[var(--warning-soft)] px-2.5 py-1.5 text-[12px] font-semibold text-[var(--warning)] hover:border-[var(--warning)]"
                  >
                    Integrity Check
                  </Link>
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
