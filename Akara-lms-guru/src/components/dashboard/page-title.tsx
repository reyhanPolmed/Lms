import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageTitleProps = {
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string[];
  aside?: ReactNode;
  className?: string;
};

export function PageTitle({
  eyebrow,
  title,
  description,
  meta = [],
  aside,
  className,
}: PageTitleProps) {
  return (
    <section
      className={cn(
        "rounded-[20px] border border-[var(--line)] bg-[rgba(255,255,255,0.96)] p-4 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-1.5 text-[24px] font-semibold leading-[1.12] tracking-[var(--tracking-tight)] text-[var(--page-ink)] sm:text-[28px]">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-[14px] leading-6 text-[var(--muted-ink)]">
            {description}
          </p>
          {meta.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px] text-[var(--muted-ink)]">
              {meta.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-3 py-1.5"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {aside ? <div className="min-w-0 lg:w-[300px] lg:max-w-[300px]">{aside}</div> : null}
      </div>
    </section>
  );
}
