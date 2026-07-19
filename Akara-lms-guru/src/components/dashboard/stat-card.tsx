"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { IconBadge } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

const statToneVariants = cva("text-[var(--accent)]", {
  variants: {
    tone: {
      indigo: "text-[var(--accent)]",
      blue: "text-[#2563eb]",
      amber: "text-[#b45309]",
      rose: "text-[#be123c]",
      emerald: "text-[#15803d]",
    },
  },
  defaultVariants: {
    tone: "indigo",
  },
});

type StatCardProps = VariantProps<typeof statToneVariants> & {
  label: string;
  value: number | string;
  icon: LucideIcon;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: StatCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-ink)]">
            {label}
          </p>
          <p className="mt-2 text-[24px] font-semibold leading-none tracking-[-0.04em] text-[var(--page-ink)]">
            {value}
          </p>
        </div>
        <IconBadge
          icon={Icon}
          size="md"
          tone="subtle"
          className="h-9.5 w-9.5"
          iconClassName={cn("text-[var(--accent)]", statToneVariants({ tone }))}
        />
      </div>
    </motion.article>
  );
}
