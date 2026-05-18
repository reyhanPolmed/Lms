"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type ProgressIndicatorProps = {
  value: number;
  className?: string;
  showValue?: boolean;
};

function getBarTone(value: number) {
  if (value >= 75) return "bg-[linear-gradient(90deg,#4f46e5,#6366f1)]";
  if (value >= 45) return "bg-[linear-gradient(90deg,#2563eb,#60a5fa)]";
  if (value >= 25) return "bg-[linear-gradient(90deg,#d97706,#f59e0b)]";
  return "bg-[linear-gradient(90deg,#e11d48,#fb7185)]";
}

export function ProgressIndicator({
  value,
  className,
  showValue = true,
}: ProgressIndicatorProps) {
  const safeValue = Math.max(0, Math.min(value, 100));

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {showValue ? (
        <span className="w-11 text-sm font-semibold text-[var(--page-ink)]">{safeValue}%</span>
      ) : null}
      <div
        className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[rgba(226,232,240,0.9)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
        aria-label={`Progress ${safeValue}%`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeValue}%` }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className={cn("h-full rounded-full", getBarTone(safeValue))}
        />
      </div>
    </div>
  );
}
