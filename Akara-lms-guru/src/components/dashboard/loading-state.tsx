import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = "Memuat data",
  description = "Sedang mengambil data terbaru dari workspace guru.",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[180px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[var(--line)] bg-[var(--surface-subtle)] px-6 py-10 text-center",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--accent)] shadow-[var(--shadow-soft)]">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-semibold text-[var(--page-ink)]">{title}</p>
      <p className="mt-1 max-w-md text-sm leading-6 text-[var(--muted-ink)]">{description}</p>
    </div>
  );
}
