"use client";

import { FileText, ImageIcon, Sparkles } from "lucide-react";

import type {
  IntegrityPreviewBlock,
  IntegrityPreviewDocument,
} from "@/components/review-tugas/integrity-check-mock";
import { cn } from "@/lib/utils";

type IntegrityDocumentPreviewProps = {
  label: string;
  document: IntegrityPreviewDocument;
};

function formatPercent(value: number | null) {
  if (value === null) return null;
  return `${Math.round(value)}%`;
}

function renderBlock(block: IntegrityPreviewBlock) {
  if (block.kind === "heading") {
    return (
      <div key={block.id}>
        <h3 className="text-[20px] font-semibold leading-tight text-slate-900">{block.text}</h3>
      </div>
    );
  }

  if (block.kind === "highlight") {
    return (
      <div
        key={block.id}
        className="rounded-[18px] border border-[#f5d88c] bg-[#fff4cc] px-4 py-3 text-[13px] leading-6 text-[#7c5608]"
      >
        {block.text}
      </div>
    );
  }

  if (block.kind === "figure") {
    return (
      <div key={block.id} className="space-y-3">
        <div className="rounded-[20px] border border-dashed border-[#d4dded] bg-[#f8faff] p-4">
          <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            <ImageIcon className="h-4 w-4" />
            Visual Placeholder
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="h-20 rounded-[14px] bg-[linear-gradient(135deg,#dbeafe,#eef2ff)]" />
            <div className="h-20 rounded-[14px] bg-[linear-gradient(135deg,#e0f2fe,#f8fafc)]" />
            <div className="h-20 rounded-[14px] bg-[linear-gradient(135deg,#ede9fe,#eff6ff)]" />
          </div>
        </div>
        {block.note ? <p className="text-[12px] leading-5 text-slate-500">{block.note}</p> : null}
      </div>
    );
  }

  if (block.kind === "caption") {
    return (
      <p
        key={block.id}
        className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400"
      >
        {block.text}
      </p>
    );
  }

  return (
    <p key={block.id} className="text-[13px] leading-6 text-slate-600">
      {block.text}
    </p>
  );
}

export function IntegrityDocumentPreview({
  label,
  document,
}: IntegrityDocumentPreviewProps) {
  const similarityLabel = formatPercent(document.similarityScore);

  return (
    <section className="flex min-h-0 flex-col rounded-[22px] border border-[rgba(216,224,236,0.88)] bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-4">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
            {label}
          </p>
          <h2 className="mt-1 truncate text-[18px] font-semibold text-[var(--page-ink)]">
            {document.fileName}
          </h2>
          <p className="mt-1 text-[13px] text-[var(--muted-ink)]">{document.studentName}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-1 text-[12px] font-medium text-[var(--muted-ink)]">
            <FileText className="h-3.5 w-3.5" />
            {document.pageLabel}
          </span>
          {similarityLabel ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(180,83,9,0.2)] bg-[#fff7ed] px-3 py-1 text-[12px] font-semibold text-[#b45309]">
              <Sparkles className="h-3.5 w-3.5" />
              {similarityLabel}
            </span>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-[linear-gradient(180deg,#f8fbff_0%,#f5f7fb_100%)] p-4">
        <div className="mx-auto min-h-full max-w-[720px] rounded-[28px] border border-[#d7deea] bg-white px-6 py-7 shadow-[0_16px_48px_rgba(15,23,42,0.08)]">
          <div className="space-y-5">{document.blocks.map((block) => renderBlock(block))}</div>
        </div>
      </div>
    </section>
  );
}
