"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles } from "lucide-react";

import type { IntegrityPreviewAsset } from "@/app/(workspace)/review-tugas/review-tugas-integrity-utils";

type IntegrityDocumentPreviewProps = {
  label: string;
  studentName: string;
  fileName: string;
  similarityScore: number | null;
  document: IntegrityPreviewAsset;
};

function formatPercent(value: number | null) {
  if (value === null) return null;
  return `${Math.round(value)}%`;
}

function bboxToStyle(box: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  const left = Math.max(0, Math.min(100, box.x1 * 100));
  const top = Math.max(0, Math.min(100, box.y1 * 100));
  const width = Math.max(0.4, (box.x2 - box.x1) * 100);
  const height = Math.max(0.4, (box.y2 - box.y1) * 100);

  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  };
}

async function requestPdfBlobUrl(url: string) {
  const response = await fetch(url, {
    credentials: "include",
  });
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(text || `HTTP ${response.status}`);
  }

  if (!contentType.includes("application/pdf")) {
    throw new Error(`Response bukan PDF (${contentType || "unknown content-type"}).`);
  }

  return URL.createObjectURL(await response.blob());
}

export function IntegrityDocumentPreview({
  label,
  studentName,
  fileName,
  similarityScore,
  document,
}: IntegrityDocumentPreviewProps) {
  const similarityLabel = formatPercent(similarityScore);
  const visualPages = document.layoutMap?.pages.filter((page) => page.imageUrl) ?? [];
  const documentHighlights = Array.isArray(document.highlights) ? document.highlights : [];
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [pdfError, setPdfError] = useState("");
  const resolvedFileName = document.fileName ?? fileName;
  const showPdfPreview = Boolean(
    document.annotatedPdfUrl && resolvedFileName.toLowerCase().endsWith(".pdf")
  );

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    if (!showPdfPreview || !document.annotatedPdfUrl) {
      setPdfBlobUrl(null);
      setPdfState("idle");
      setPdfError("");
      return undefined;
    }

    setPdfState("loading");
    setPdfError("");
    setPdfBlobUrl(null);

    void requestPdfBlobUrl(document.annotatedPdfUrl)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        objectUrl = url;
        setPdfBlobUrl(url);
        setPdfState("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setPdfBlobUrl(null);
        setPdfState("failed");
        setPdfError(error instanceof Error ? error.message : "Gagal memuat PDF hasil highlight.");
      });

    return () => {
      cancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [document.annotatedPdfUrl, showPdfPreview]);

  return (
    <section className="flex min-h-0 flex-col rounded-[22px] border border-[rgba(216,224,236,0.88)] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-4">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
            {label}
          </p>
          <h2 className="mt-1 truncate text-[18px] font-semibold text-[var(--page-ink)]">
            {fileName}
          </h2>
          <p className="mt-1 text-[13px] text-[var(--muted-ink)]">{studentName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-1 text-[12px] font-medium text-[var(--muted-ink)]">
            <FileText className="h-3.5 w-3.5" />
            Preview highlight
          </span>
          {similarityLabel ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(180,83,9,0.2)] bg-[#fff7ed] px-3 py-1 text-[12px] font-semibold text-[#b45309]">
              <Sparkles className="h-3.5 w-3.5" />
              {similarityLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#f5f7fb_100%)] p-4">
        <div className="mx-auto h-full min-h-full max-w-[720px] overflow-hidden rounded-[28px] border border-[#d7deea] bg-white shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
          {showPdfPreview || visualPages.length > 0 ? (
            <div
              className={
                showPdfPreview
                  ? "flex h-full min-h-[720px] flex-col bg-[#f8fbff] p-4"
                  : "h-full min-h-[720px] overflow-auto bg-[#f8fbff] p-4"
              }
            >
              <div className={showPdfPreview ? "flex min-h-0 flex-1 flex-col" : "space-y-4"}>
                {showPdfPreview ? (
                  <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] border border-[#d7deea] bg-white">
                    <div className="flex items-center justify-between gap-3 border-b border-[#e2e8f0] px-4 py-3">
                      <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                        PDF Highlight
                      </span>
                      <span className="truncate text-[12px] text-[var(--muted-ink)]">
                        {resolvedFileName}
                      </span>
                    </div>
                    <div
                      className={
                        pdfState === "failed"
                          ? "flex min-h-0 flex-1 items-center justify-center bg-[#fff7f9] px-6 text-center"
                          : pdfState === "loading"
                            ? "flex min-h-0 flex-1 items-center justify-center bg-[#f8fbff] px-6 text-center text-[13px] text-[var(--muted-ink)]"
                            : "min-h-0 flex-1 bg-white"
                      }
                    >
                      {pdfState === "ready" && pdfBlobUrl ? (
                        <iframe
                          src={pdfBlobUrl}
                          title="PDF hasil highlight"
                          loading="lazy"
                          className="h-full min-h-[720px] w-full border-0"
                        />
                      ) : pdfState === "failed" ? (
                        <p className="text-[13px] text-[#b25a70]">
                          {pdfError || "Gagal memuat PDF hasil highlight."}
                        </p>
                      ) : (
                        <p>Memuat PDF hasil highlight...</p>
                      )}
                    </div>
                  </section>
                ) : null}
                {!showPdfPreview
                  ? visualPages.map((page) => {
                  const pageHighlights = documentHighlights.filter(
                    (highlight) =>
                      highlight.bboxNormalized !== null &&
                      highlight.pageIndex === page.pageIndex
                  );

                  return (
                    <section
                      key={`${document.side}-${page.pageIndex}`}
                      className="rounded-[22px] border border-[#d7deea] bg-white p-3"
                    >
                      <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                        Halaman {page.pageIndex + 1}
                      </p>
                      <div className="overflow-hidden rounded-[18px] border border-[#e2e8f0] bg-white">
                        <div className="relative">
                          <img
                            src={page.imageUrl!}
                            alt={`${label} highlight preview halaman ${page.pageIndex + 1}`}
                            className="block h-auto w-full"
                          />
                          {pageHighlights.map((highlight, index) => (
                            <span
                              key={`${document.side}-${page.pageIndex}-${index}`}
                              className="pointer-events-none absolute border border-transparent bg-[rgba(239,68,68,0.28)]"
                              style={bboxToStyle(highlight.bboxNormalized!)}
                              title={highlight.text ?? "Segmen mirip"}
                            />
                          ))}
                        </div>
                      </div>
                    </section>
                  );
                    })
                  : null}
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[720px] items-center justify-center px-6 text-center">
              <div>
                <p className="text-[14px] font-semibold text-[var(--page-ink)]">
                  Preview belum tersedia
                </p>
                <p className="mt-2 text-[13px] text-[var(--muted-ink)]">
                  Provider belum mengirim gambar highlight untuk dokumen ini.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
