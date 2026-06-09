"use client";

import { Layers3, ScanSearch, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { formatTaskSubmittedAt } from "@/app/(workspace)/review-tugas/review-tugas-utils";
import {
  createIntegrityCheckMockScenario,
  type IntegrityPreviewDocument,
} from "@/components/review-tugas/integrity-check-mock";
import { IntegrityComparisonList } from "@/components/review-tugas/integrity-comparison-list";
import { IntegrityDocumentPreview } from "@/components/review-tugas/integrity-document-preview";
import { PageHeader } from "@/components/workspace/ui";
import { teacherApi, type TaskSubmissionDetail } from "@/lib/api-client";

type TaskIntegrityCheckViewProps = {
  taskId: string;
  submissionId: string;
  backHref: string;
};

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function mergeSourceDocument(
  sourceDocument: IntegrityPreviewDocument,
  submissionDetail: TaskSubmissionDetail
) {
  return {
    ...sourceDocument,
    studentName: submissionDetail.studentName,
    fileName: submissionDetail.submissionFile?.fileName ?? sourceDocument.fileName,
    submittedAtLabel: formatTaskSubmittedAt(submissionDetail.submittedAt),
    pageLabel: submissionDetail.submissionFile?.mimeType?.includes("pdf")
      ? sourceDocument.pageLabel
      : sourceDocument.pageLabel,
    summary: `Dokumen sumber dari ${submissionDetail.className} - ${submissionDetail.courseTitle}.`,
  } satisfies IntegrityPreviewDocument;
}

export function TaskIntegrityCheckView({
  taskId,
  submissionId,
  backHref,
}: TaskIntegrityCheckViewProps) {
  const mockScenario = useMemo(
    () => createIntegrityCheckMockScenario(taskId, submissionId),
    [submissionId, taskId]
  );
  const [sourceDocument, setSourceDocument] = useState<IntegrityPreviewDocument>(
    mockScenario.sourceDocument
  );
  const [sourceMeta, setSourceMeta] = useState({
    assignmentTitle: mockScenario.assignmentTitle,
    className: mockScenario.className,
    courseTitle: mockScenario.courseTitle,
  });
  const [activeComparisonId, setActiveComparisonId] = useState(
    mockScenario.comparisonDocuments[0]?.id ?? ""
  );

  useEffect(() => {
    setSourceDocument(mockScenario.sourceDocument);
    setSourceMeta({
      assignmentTitle: mockScenario.assignmentTitle,
      className: mockScenario.className,
      courseTitle: mockScenario.courseTitle,
    });
    setActiveComparisonId(mockScenario.comparisonDocuments[0]?.id ?? "");
  }, [mockScenario]);

  useEffect(() => {
    let cancelled = false;

    void teacherApi
      .getTaskSubmissionDetail(submissionId)
      .then((submissionDetail) => {
        if (cancelled) return;

        setSourceDocument((current) => mergeSourceDocument(current, submissionDetail));
        setSourceMeta({
          assignmentTitle: submissionDetail.assignmentTitle,
          className: submissionDetail.className,
          courseTitle: submissionDetail.courseTitle,
        });
      })
      .catch(() => {
        // Keep dummy data for design exploration when backend data is unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  const activeComparison =
    mockScenario.comparisonDocuments.find((document) => document.id === activeComparisonId) ??
    mockScenario.comparisonDocuments[0];

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-3">
      <PageHeader
        title="Integrity Check"
        description="Mode desain dengan dummy preview dua dokumen agar alur review kemiripan dapat dieksplorasi lebih cepat."
        actionHref={backHref}
        actionLabel="Kembali ke pengumpulan"
      />

      <section className="flex min-h-[calc(100dvh-10rem)] flex-col overflow-hidden rounded-[28px] border border-[rgba(216,224,236,0.9)] bg-white">
        <div className="border-b border-[var(--line)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(79,70,199,0.14)] bg-[rgba(79,70,199,0.08)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                <Sparkles className="h-3.5 w-3.5" />
                Dummy preview integrity
              </div>
              <h1 className="mt-3 text-[24px] font-semibold leading-tight text-[var(--page-ink)]">
                {sourceMeta.assignmentTitle}
              </h1>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                  <Layers3 className="h-4 w-4" />
                  Sumber
                </div>
                <p className="mt-2 text-[14px] font-semibold text-[var(--page-ink)]">
                  {sourceDocument.studentName}
                </p>
              </div>
              <div className="rounded-[18px] border border-[rgba(180,83,9,0.18)] bg-[#fff7ed] px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b45309]">
                  <ScanSearch className="h-4 w-4" />
                  Tertinggi
                </div>
                <p className="mt-2 text-[18px] font-semibold text-[#b45309]">
                  {formatPercent(mockScenario.highestSimilarity)}
                </p>
              </div>
              <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                  Pembanding
                </p>
                <p className="mt-2 text-[18px] font-semibold text-[var(--page-ink)]">
                  {mockScenario.comparisonDocuments.length} dokumen
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-3 bg-[var(--surface-subtle)] p-3 xl:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
          <IntegrityComparisonList
            items={mockScenario.comparisonDocuments}
            activeDocumentId={activeComparisonId}
            onSelect={setActiveComparisonId}
          />
          <IntegrityDocumentPreview label="Dokumen sumber" document={sourceDocument} />
          {activeComparison ? (
            <IntegrityDocumentPreview
              label="Dokumen pembanding"
              document={activeComparison}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}
