"use client";

import { ChevronRight, Files } from "lucide-react";

import type { IntegrityPreviewDocument } from "@/components/review-tugas/integrity-check-mock";
import { cn } from "@/lib/utils";

type IntegrityComparisonListProps = {
  items: IntegrityPreviewDocument[];
  activeDocumentId: string;
  onSelect: (documentId: string) => void;
};

function formatPercent(value: number | null) {
  if (value === null) return "-";
  return `${Math.round(value)}%`;
}

export function IntegrityComparisonList({
  items,
  activeDocumentId,
  onSelect,
}: IntegrityComparisonListProps) {
  return (
    <aside className="flex min-h-0 flex-col rounded-[22px] border border-[rgba(216,224,236,0.88)] bg-white">
      <div className="border-b border-[var(--line)] px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--surface-subtle)] text-[var(--accent)]">
            <Files className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
              Dokumen pembanding
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {items.map((item) => {
            const isActive = item.id === activeDocumentId;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition-colors",
                  isActive
                    ? "border-[rgba(79,70,199,0.28)] bg-[rgba(79,70,199,0.08)]"
                    : "border-transparent bg-[var(--surface-subtle)] hover:border-[rgba(79,70,199,0.18)] hover:bg-white"
                )}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[var(--page-ink)]">
                    {item.studentName}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--muted-ink)]">
                      Tingkat kemiripan
                    </span>
                    <span className="whitespace-nowrap text-[15px] font-semibold text-[#b45309]">
                      {formatPercent(item.similarityScore)}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 text-[var(--muted-ink)] transition-transform",
                    isActive && "translate-x-0.5 text-[var(--accent)]"
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
