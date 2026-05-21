"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Binary,
  BookCopy,
  CalendarDays,
  FileStack,
  Search,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/workspace/ui";
import { cn } from "@/lib/utils";
import { formatTaskSubmittedAt } from "@/app/(workspace)/review-tugas/review-tugas-utils";
import {
  loadTaskIntegrityContext,
  type IntegrityCheckContext,
  type IntegrityParagraph,
} from "@/app/(workspace)/review-tugas/review-tugas-integrity-utils";

type TaskIntegrityCheckViewProps = {
  taskId: string;
  submissionId: string;
  backHref: string;
};

function renderParagraph(paragraph: IntegrityParagraph, key: string) {
  return (
    <p key={key} className="text-[14px] leading-8 text-[#344054]">
      {paragraph.map((segment, index) => (
        <span
          key={`${key}-${index}`}
          className={cn(
            segment.highlighted &&
              "rounded-[4px] bg-[#fff1bf] px-0.5 py-[1px] text-[#7a4d00] shadow-[inset_0_-1px_0_rgba(180,83,9,0.12)]"
          )}
        >
          {segment.text}
        </span>
      ))}
    </p>
  );
}

export function TaskIntegrityCheckView({
  taskId,
  submissionId,
  backHref,
}: TaskIntegrityCheckViewProps) {
  const [data, setData] = useState<IntegrityCheckContext | null>(null);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await loadTaskIntegrityContext(taskId, submissionId);
        if (cancelled) return;
        setData(response);
      } catch (loadError: unknown) {
        if (cancelled) return;
        setError(
          loadError instanceof Error ? loadError.message : "Gagal memuat data integrity check."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [submissionId, taskId]);

  const activeComparison = useMemo(() => {
    if (!data) return null;
    return (
      data.comparisons.find((item) => item.submissionId === selectedSubmissionId) ??
      data.comparisons[0] ??
      null
    );
  }, [data, selectedSubmissionId]);

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Integrity Check"
        description="Bandingkan submission siswa dengan dokumen lain pada tugas yang sama untuk memprioritaskan review integritas akademik."
        actionHref={backHref}
        actionLabel="Kembali ke pengumpulan"
      />

      {loading ? (
        <div className="panel-surface flex min-h-[720px] items-center justify-center px-6 py-12">
          <p className="text-[13px] text-[var(--muted-ink)]">Memuat integrity check...</p>
        </div>
      ) : error ? (
        <div className="panel-surface flex min-h-[720px] items-center justify-center px-6 py-12">
          <p className="rounded-[12px] border border-[#f4d1d8] bg-[#fff7f9] px-3 py-2 text-[12px] text-[#b25a70]">
            {error}
          </p>
        </div>
      ) : !data ? null : (
        <section className="panel-surface min-h-[720px] overflow-hidden">
          <div className="border-b border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,247,251,0.92))] p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(245,158,11,0.18)] bg-[var(--warning-soft)] px-3 py-1.5 text-[12px] font-semibold text-[var(--warning)]">
                    <ShieldAlert className="h-4 w-4" />
                    Mode simulasi
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--muted-ink)]">
                    <CalendarDays className="h-4 w-4" />
                    {formatTaskSubmittedAt(data.currentSubmission.submittedAt)}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--muted-ink)]">
                    <Binary className="h-4 w-4" />
                    {data.currentSubmission.wordCount} kata
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Dokumen Sumber
                  </p>
                  <h2 className="mt-1 text-[22px] font-semibold tracking-[var(--tracking-tight)] text-[var(--page-ink)]">
                    {data.currentSubmission.documentLabel}
                  </h2>
                  <p className="mt-1 text-[13px] text-[var(--muted-ink)]">
                    {data.currentSubmission.studentName} | {data.currentSubmission.assignmentTitle} |{" "}
                    {data.currentSubmission.courseTitle}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[18px] border border-[rgba(190,18,60,0.14)] bg-[var(--danger-soft)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--danger)]">
                    Tingkat kemiripan
                  </p>
                  <p className="mt-1 text-[28px] font-semibold leading-none text-[var(--danger)]">
                    {activeComparison ? `${activeComparison.similarityScore.toFixed(1)}%` : "-"}
                  </p>
                  <p className="mt-2 text-[12px] text-[#9f1239]">
                    {activeComparison?.comparisonMeta ?? "Belum ada dokumen pembanding"}
                  </p>
                </div>

                <div className="rounded-[18px] border border-[rgba(79,70,199,0.12)] bg-[var(--accent-soft)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                    Status engine
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-[var(--page-ink)]">
                    Preview similarity UI
                  </p>
                  <p className="mt-2 text-[12px] text-[var(--muted-ink)]">
                    Data dokumen pembanding memakai submission tugas yang sama.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {data.comparisons.length === 0 ? (
            <div className="px-5 py-8">
              <EmptyState
                icon={FileStack}
                title="Belum ada dokumen pembanding"
                description="Integrity check memerlukan minimal dua submission pada tugas yang sama agar tingkat kemiripan bisa ditinjau."
              />
            </div>
          ) : (
            <div className="grid min-h-[620px] lg:grid-cols-[320px_minmax(0,1fr)]">
              <aside className="border-b border-[var(--line)] bg-[var(--surface-subtle)] lg:border-b-0 lg:border-r">
                <div className="border-b border-[var(--line)] px-5 py-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-ink)]">
                    Dokumen Serupa
                  </p>
                </div>

                <div className="max-h-[620px] overflow-y-auto">
                  {data.comparisons.map((comparison) => {
                    const isActive = activeComparison?.submissionId === comparison.submissionId;

                    return (
                      <button
                        key={comparison.submissionId}
                        type="button"
                        onClick={() => setSelectedSubmissionId(comparison.submissionId)}
                        className={cn(
                          "w-full border-b border-[var(--line)] px-5 py-4 text-left transition-colors",
                          isActive
                            ? "border-l-4 border-l-[var(--accent)] bg-white"
                            : "hover:bg-white/70"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span
                            className={cn(
                              "text-[12px] font-semibold",
                              isActive ? "text-[var(--accent)]" : "text-[var(--muted-ink)]"
                            )}
                          >
                            {comparison.studentName}
                          </span>
                          <span className="shrink-0 text-[13px] font-semibold text-[var(--danger)]">
                            {comparison.similarityScore.toFixed(1)}%
                          </span>
                        </div>
                        <p className="mt-2 text-[13px] font-semibold leading-6 text-[var(--page-ink)]">
                          {comparison.documentLabel}
                        </p>
                        <p className="mt-1 text-[12px] text-[var(--muted-ink)]">
                          {comparison.academicYearLabel}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <div className="grid min-h-[620px] grid-rows-[auto_minmax(0,1fr)]">
                <div className="border-b border-[var(--line)] bg-white px-5 py-4">
                  <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted-ink)]">
                        <UserRound className="h-4 w-4" />
                        Siswa: {data.currentSubmission.studentName}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted-ink)]">
                        <BookCopy className="h-4 w-4" />
                        {activeComparison?.matchedWordCount ?? 0} urutan kata identik
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-1.5 text-[12px] font-semibold text-[var(--muted-ink)]">
                        <Search className="h-4 w-4" />
                        Sintaksis {activeComparison?.syntaxSimilarity ?? 0}%
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {data.currentSubmission.documentUrl ? (
                        <Button asChild variant="secondary" size="sm">
                          <Link href={data.currentSubmission.documentUrl} target="_blank">
                            Dokumen sumber
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : null}
                      {activeComparison?.documentUrl ? (
                        <Button asChild size="sm">
                          <Link href={activeComparison.documentUrl} target="_blank">
                            Dokumen pembanding
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid min-h-0 lg:grid-cols-2 lg:divide-x lg:divide-[var(--line)]">
                  <article className="min-h-0 bg-white">
                    <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-ink)]">
                          Dokumen Tugas Siswa 1
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-[var(--page-ink)]">
                          {data.currentSubmission.documentLabel}
                        </p>
                      </div>
                    </div>
                    <div className="no-scrollbar h-[520px] overflow-y-auto px-8 py-7 sm:px-10">
                      <div className="mx-auto max-w-[48ch] space-y-6">
                        {(activeComparison?.sourceParagraphs ?? []).map((paragraph, index) =>
                          renderParagraph(paragraph, `source-${index}`)
                        )}
                      </div>
                    </div>
                  </article>

                  <article className="min-h-0 bg-[#fbfcfe]">
                    <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
                      <div>
                        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                          Dokumen Tugas Siswa 2
                        </p>
                        <p className="mt-1 text-[13px] font-semibold text-[var(--page-ink)]">
                          {activeComparison?.documentLabel}
                        </p>
                      </div>
                    </div>
                    <div className="no-scrollbar h-[520px] overflow-y-auto px-8 py-7 sm:px-10">
                      <div className="mx-auto max-w-[48ch] space-y-6 rounded-[24px] border border-[rgba(79,70,199,0.10)] bg-white px-6 py-6 shadow-[0_18px_34px_rgba(15,23,42,0.04)]">
                        <div>
                          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                            {activeComparison?.comparisonTitle}
                          </p>
                          <p className="mt-1 text-[12px] text-[var(--muted-ink)]">
                            {activeComparison?.comparisonMeta}
                          </p>
                        </div>

                        {(activeComparison?.comparisonParagraphs ?? []).map((paragraph, index) =>
                          renderParagraph(paragraph, `comparison-${index}`)
                        )}

                        <div className="border-t border-[var(--line)] pt-5">
                          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
                            Detail Kecocokan
                          </p>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center gap-3 text-[13px] text-[var(--page-ink)]">
                              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                              Teridentifikasi {activeComparison?.matchedWordCount ?? 0} urutan kata identik
                            </div>
                            <div className="flex items-center gap-3 text-[13px] text-[var(--page-ink)]">
                              <span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
                              Struktur sintaksis cocok {activeComparison?.syntaxSimilarity ?? 0}%
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-[var(--line)] bg-[var(--surface-subtle)] px-5 py-3">
            <div className="flex items-start gap-2 rounded-[16px] border border-[rgba(245,158,11,0.18)] bg-[var(--warning-soft)] px-4 py-3 text-[12px] text-[var(--warning)]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Halaman ini memakai preview similarity berbasis data submission yang tersedia. Engine pembaca isi dokumen dan perhitungan kemiripan backend belum terhubung pada repo ini.
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
