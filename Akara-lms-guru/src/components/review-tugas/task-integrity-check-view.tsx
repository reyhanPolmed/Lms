"use client";

import { FileSearch, Layers3, RefreshCw, ScanSearch } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  loadTaskIntegrityContext,
  loadTaskIntegrityPairDetail,
  loadTaskIntegrityPairVisual,
  type IntegrityCheckContext,
  type IntegrityPairDetail,
  type IntegrityPairVisual,
} from "@/app/(workspace)/review-tugas/review-tugas-integrity-utils";
import { EmptyState } from "@/components/dashboard/empty-state";
import { IntegrityComparisonList } from "@/components/review-tugas/integrity-comparison-list";
import { IntegrityDocumentPreview } from "@/components/review-tugas/integrity-document-preview";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/workspace/ui";
import { teacherApi } from "@/lib/api-client";
import { cn } from "@/lib/utils";

type TaskIntegrityCheckViewProps = {
  taskId: string;
  submissionId: string;
  backHref: string;
};

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

function getStatusLabel(status: IntegrityCheckContext["originalityCheck"]["status"]) {
  switch (status) {
    case "queued":
      return "Masuk antrean";
    case "processing":
      return "Sedang diproses";
    case "completed":
      return "Pemeriksaan selesai";
    case "failed":
      return "Pemeriksaan gagal";
    default:
      return "Belum dijalankan";
  }
}

export function TaskIntegrityCheckView({
  taskId,
  submissionId,
  backHref,
}: TaskIntegrityCheckViewProps) {
  const [data, setData] = useState<IntegrityCheckContext | null>(null);
  const [activeComparisonId, setActiveComparisonId] = useState<string>("");
  const [activeVisual, setActiveVisual] = useState<IntegrityPairVisual | null>(null);
  const [activeDetail, setActiveDetail] = useState<IntegrityPairDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingVisual, setLoadingVisual] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [error, setError] = useState("");

  const activeComparison = useMemo(
    () => data?.comparisons.find((comparison) => comparison.comparisonId === activeComparisonId) ?? null,
    [activeComparisonId, data?.comparisons]
  );

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await loadTaskIntegrityContext(submissionId);
      setData(response);
      setActiveComparisonId(
        (currentComparisonId) => currentComparisonId || response.comparisons[0]?.comparisonId || ""
      );
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Gagal memuat integrity check.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [submissionId]);

  useEffect(() => {
    if (!activeComparisonId || !data || data.originalityCheck.status !== "completed") {
      setActiveVisual(null);
      setActiveDetail(null);
      return;
    }

    let cancelled = false;
    setError("");
    setActiveVisual(null);
    setActiveDetail(null);
    setLoadingVisual(true);
    setLoadingDetail(false);

    void (async () => {
      let visualFailed = false;

      try {
        const visual = await loadTaskIntegrityPairVisual(submissionId, activeComparisonId);
        if (cancelled) return;
        setActiveVisual(visual);
      } catch (visualError) {
        if (cancelled) return;
        visualFailed = true;
        setActiveVisual(null);
        setError(
          visualError instanceof Error
            ? visualError.message
            : "Gagal memuat preview dokumen pembanding."
        );
      } finally {
        if (!cancelled) {
          setLoadingVisual(false);
        }
      }

      if (cancelled) return;

      setLoadingDetail(true);
      try {
        const detail = await loadTaskIntegrityPairDetail(submissionId, activeComparisonId);
        if (cancelled) return;
        setActiveDetail(detail);
      } catch (detailError) {
        if (cancelled) return;
        setActiveDetail(null);
        if (visualFailed) return;
        setError(
          detailError instanceof Error
            ? detailError.message
            : "Gagal memuat detail segmen pembanding."
        );
      } finally {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeComparisonId, data, submissionId]);

  const handleRetry = async () => {
    setRetrying(true);
    setError("");

    try {
      await teacherApi.retryTaskSubmissionIntegrity(submissionId);
      await loadData();
    } catch (retryError) {
      setError(retryError instanceof Error ? retryError.message : "Gagal menjalankan retry.");
    } finally {
      setRetrying(false);
    }
  };

  const title = data?.currentSubmission.assignmentTitle || decodeURIComponent(taskId);

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-3">
      <PageHeader
        title="Integrity Check"
        description="Bandingkan dokumen sumber dengan submission pembanding berdasarkan hasil engine originalitas."
        actionHref={backHref}
        actionLabel="Kembali ke pengumpulan"
      />

      {loading ? (
        <div className="flex min-h-[620px] items-center justify-center rounded-[28px] border border-[rgba(216,224,236,0.9)] bg-white">
          <p className="text-[13px] text-[var(--muted-ink)]">Memuat hasil pemeriksaan...</p>
        </div>
      ) : error && !data ? (
        <div className="flex min-h-[620px] items-center justify-center rounded-[28px] border border-[rgba(216,224,236,0.9)] bg-white px-6">
          <p className="rounded-[12px] border border-[#f4d1d8] bg-[#fff7f9] px-3 py-2 text-[12px] text-[#b25a70]">
            {error}
          </p>
        </div>
      ) : data ? (
        <section className="flex min-h-[calc(100dvh-10rem)] flex-col overflow-hidden rounded-[28px] border border-[rgba(216,224,236,0.9)] bg-white">
          <div className="border-b border-[var(--line)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-5 py-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h1 className="text-[24px] font-semibold leading-tight text-[var(--page-ink)]">
                  {title}
                </h1>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                    <Layers3 className="h-4 w-4" />
                    Sumber
                  </div>
                  <p className="mt-2 text-[14px] font-semibold text-[var(--page-ink)]">
                    {data.currentSubmission.studentName}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[rgba(180,83,9,0.18)] bg-[#fff7ed] px-4 py-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b45309]">
                    <ScanSearch className="h-4 w-4" />
                    Tertinggi
                  </div>
                  <p className="mt-2 text-[18px] font-semibold text-[#b45309]">
                    {formatPercent(data.originalityCheck.maxSimilarity)}
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                    Pembanding
                  </p>
                  <p className="mt-2 text-[18px] font-semibold text-[var(--page-ink)]">
                    {data.comparisons.length} dokumen
                  </p>
                </div>
                <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                    Status
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-[var(--page-ink)]">
                    {getStatusLabel(data.originalityCheck.status)}
                  </p>
                </div>
              </div>
            </div>

            {data.originalityCheck.status === "failed" ? (
              <div className="mt-4">
                <Button size="sm" onClick={handleRetry} disabled={retrying}>
                  <RefreshCw className={cn("h-4 w-4", retrying && "animate-spin")} />
                  {retrying ? "Menjalankan ulang..." : "Coba lagi"}
                </Button>
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="border-b border-[#f4d1d8] bg-[#fff7f9] px-5 py-3 text-[12px] text-[#b25a70]">
              {error}
            </div>
          ) : null}

          {data.originalityCheck.status !== "completed" ? (
            <div className="flex min-h-[470px] items-center justify-center px-6 py-12">
              <EmptyState
                icon={FileSearch}
                title={getStatusLabel(data.originalityCheck.status)}
                description="Preview dokumen akan tersedia setelah engine menyelesaikan ekstraksi dan perbandingan."
              />
            </div>
          ) : data.comparisons.length === 0 ? (
            <div className="flex min-h-[470px] items-center justify-center px-6 py-12">
              <EmptyState
                icon={FileSearch}
                title="Belum ada dokumen pembanding"
                description="Engine selesai memproses submission ini tetapi belum menemukan pasangan dokumen untuk ditinjau."
              />
            </div>
          ) : (
            <>
              <div className="grid min-h-0 flex-1 gap-3 bg-[var(--surface-subtle)] p-3 xl:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]">
                <IntegrityComparisonList
                  items={data.comparisons}
                  activeDocumentId={activeComparisonId}
                  onSelect={setActiveComparisonId}
                />
                <IntegrityDocumentPreview
                  label="Dokumen sumber"
                  studentName={data.currentSubmission.studentName}
                  fileName={data.currentSubmission.submissionFile?.fileName ?? data.currentSubmission.assignmentTitle}
                  similarityScore={null}
                  document={
                    activeVisual?.sourceDocument ?? {
                      id: null,
                      side: "A",
                      fileName: null,
                      annotatedPdfUrl: null,
                      layoutMap: null,
                      highlights: [],
                    }
                  }
                />
                {activeComparison ? (
                  <IntegrityDocumentPreview
                    label={loadingVisual ? "Memuat dokumen pembanding..." : "Dokumen pembanding"}
                    studentName={activeComparison.studentName}
                    fileName={activeComparison.documentLabel}
                    similarityScore={activeComparison.similarityScore}
                    document={
                      activeVisual?.comparisonDocument ?? {
                        id: null,
                        side: "B",
                        fileName: null,
                        annotatedPdfUrl: null,
                        layoutMap: null,
                        highlights: [],
                      }
                    }
                  />
                ) : null}
              </div>
              {loadingDetail ? (
                <div className="border-t border-[var(--line)] bg-white px-5 py-4 text-[12px] text-[var(--muted-ink)]">
                  Memuat detail segmen pembanding...
                </div>
              ) : activeDetail?.highlights.length ? (
                <div className="border-t border-[var(--line)] bg-white px-5 py-4">
                  <div className="mb-3">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                      Segmen mirip
                    </p>
                    <h2 className="mt-1 text-[16px] font-semibold text-[var(--page-ink)]">
                      Cuplikan teks pembanding
                    </h2>
                  </div>
                  <div className="grid gap-3 xl:grid-cols-2">
                    {activeDetail.highlights.slice(0, 8).map((highlight, index) => (
                      <article
                        key={`${activeDetail.comparisonId}-${index}`}
                        className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-subtle)] p-4"
                      >
                        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                          Dokumen sumber
                        </p>
                        <p className="mt-2 text-[13px] leading-6 text-[var(--page-ink)]">
                          {highlight.sourceText}
                        </p>
                        <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                          Dokumen pembanding
                        </p>
                        <p className="mt-2 text-[13px] leading-6 text-[var(--page-ink)]">
                          {highlight.comparisonText}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>
      ) : null}
    </div>
  );
}
