"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowRight, School, UserRound } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SummaryMetric = {
  label: string;
  value: number | string;
  icon: LucideIcon;
  tone?: "default" | "warning" | "danger" | "success";
};

type ClassSummaryCardProps = {
  title: string;
  homeroomName?: string;
  href: string;
  ctaLabel: string;
  metrics: SummaryMetric[];
  icon?: LucideIcon;
};

const metricToneClass: Record<NonNullable<SummaryMetric["tone"]>, string> = {
  default: "text-[var(--accent)]",
  warning: "text-[var(--warning)]",
  danger: "text-[var(--danger)]",
  success: "text-[var(--success)]",
};

export function ClassSummaryCard({
  title,
  homeroomName,
  href,
  ctaLabel,
  metrics,
  icon: Icon = School,
}: ClassSummaryCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex h-full flex-col rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-[rgba(79,70,199,0.12)] bg-[var(--accent-soft)] text-[var(--accent)]">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold tracking-[-0.03em] text-[var(--page-ink)]">
            {title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-[var(--muted-ink)]">
            <UserRound className="h-4 w-4 text-[var(--accent)]" />
            <span className="truncate">{homeroomName || "Data wali kelas belum sinkron"}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        {metrics.map((metric) => {
          const MetricIcon = metric.icon;
          const tone = metric.tone ?? "default";

          return (
            <div
              key={metric.label}
              className="rounded-[14px] border border-[var(--line)] bg-[var(--surface-subtle)] px-3 py-3"
            >
              <MetricIcon className={cn("h-4 w-4", metricToneClass[tone])} />
              <p className="mt-2 text-base font-semibold leading-none text-[var(--page-ink)]">
                {metric.value}
              </p>
              <p className="mt-1 text-[12px] leading-4 text-[var(--muted-ink)]">{metric.label}</p>
            </div>
          );
        })}
      </div>

      <Button asChild className="mt-5 w-full" variant="secondary">
        <Link href={href}>
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </motion.article>
  );
}
