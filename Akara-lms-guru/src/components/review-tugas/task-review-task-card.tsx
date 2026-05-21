import Link from "next/link";
import { ClipboardCheck, Clock3, UsersRound } from "lucide-react";

import {
  formatTaskSubmittedAt,
  type ReviewTaskCard,
} from "@/app/(workspace)/review-tugas/review-tugas-utils";
import { cn } from "@/lib/utils";

type TaskReviewTaskCardProps = {
  card: ReviewTaskCard;
  href: string;
  className?: string;
};

export function TaskReviewTaskCard({ card, href, className }: TaskReviewTaskCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Tugas
          </p>
          <h3 className="mt-2 line-clamp-2 text-[18px] font-semibold tracking-[var(--tracking-tight)] text-[var(--page-ink)]">
            {card.taskTitle}
          </h3>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] border border-[rgba(79,70,199,0.14)] bg-[rgba(238,242,255,0.72)] text-[var(--accent)]">
          <ClipboardCheck className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded-[16px] border border-[rgba(216,224,236,0.86)] bg-[var(--surface-subtle)] px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
            Pengumpulan
          </p>
          <p className="mt-1 text-[20px] font-semibold text-[var(--page-ink)]">
            {card.submissionCount}
          </p>
        </div>
        <div className="rounded-[16px] border border-[rgba(216,224,236,0.86)] bg-[var(--surface-subtle)] px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
            Rata-rata nilai
          </p>
          <p className="mt-1 text-[20px] font-semibold text-[var(--page-ink)]">
            {card.averageScore !== null ? card.averageScore : "-"}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-[13px] text-[var(--muted-ink)]">
        <div className="flex items-center gap-2">
          <UsersRound className="h-4 w-4 text-[var(--accent)]" />
          <span>{card.studentCount} siswa mengumpulkan</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-[var(--accent)]" />
          <span>
            {card.latestSubmittedAt
              ? `Terakhir masuk ${formatTaskSubmittedAt(card.latestSubmittedAt)}`
              : "Belum ada waktu pengumpulan"}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-[16px] border border-[rgba(216,224,236,0.86)] bg-[rgba(248,250,252,0.88)] px-3 py-2.5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
            Perlu ditinjau
          </p>
          <p className="mt-1 text-[16px] font-semibold text-[var(--page-ink)]">{card.pendingCount}</p>
        </div>
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-[12px] bg-[var(--accent)] px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Lihat Pengumpulan
        </Link>
      </div>
    </article>
  );
}
