import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface-subtle)] px-6 py-12 text-center",
        className
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--accent)] shadow-[0_16px_28px_rgba(15,23,42,0.06)]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-[-0.03em] text-[var(--page-ink)]">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted-ink)]">{description}</p>
    </div>
  );
}
