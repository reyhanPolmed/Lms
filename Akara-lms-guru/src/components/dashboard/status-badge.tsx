import { cva } from "class-variance-authority";

import { statusLabels } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-semibold tracking-[0.01em]",
  {
    variants: {
      tone: {
        neutral: "border-[rgba(148,163,184,0.24)] bg-[rgba(248,250,252,0.92)] text-[var(--muted-ink)]",
        success: "border-[rgba(34,197,94,0.14)] bg-[var(--success-soft)] text-[var(--success)]",
        warning: "border-[rgba(245,158,11,0.16)] bg-[var(--warning-soft)] text-[var(--warning)]",
        info: "border-[rgba(37,99,235,0.14)] bg-[rgba(239,246,255,0.96)] text-[#1d4ed8]",
        danger: "border-[rgba(244,63,94,0.16)] bg-[var(--danger-soft)] text-[var(--danger)]",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

function getTone(status: string) {
  switch (status) {
    case "approved":
    case "graded":
    case "published":
    case "rendah":
      return "success";
    case "draft":
    case "returned":
    case "retake":
    case "revision":
    case "scheduled":
    case "sedang":
      return "warning";
    case "submitted":
      return "info";
    case "late":
    case "tinggi":
      return "danger";
    default:
      return "neutral";
  }
}

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  return (
    <span className={cn(badgeVariants({ tone: getTone(normalized) }), className)}>
      {statusLabels[normalized] ?? status}
    </span>
  );
}
