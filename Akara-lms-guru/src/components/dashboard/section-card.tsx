"use client";

import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const sectionCardVariants = cva(
  "overflow-hidden rounded-[20px] border shadow-[var(--shadow-card)]",
  {
    variants: {
      variant: {
        default: "border-[var(--line)] bg-[var(--surface)]",
        muted: "border-[rgba(219,227,239,0.8)] bg-[var(--surface-subtle)]",
        accent:
          "border-[rgba(79,70,199,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(238,242,255,0.62))]",
      },
      padding: {
        default: "",
        compact: "",
        none: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

type SectionCardProps = Omit<HTMLMotionProps<"section">, "title"> &
  VariantProps<typeof sectionCardVariants> & {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    children?: ReactNode;
    hoverable?: boolean;
  };

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  variant,
  padding,
  hoverable = false,
  ...props
}: SectionCardProps) {
  const bodyPaddingClass =
    padding === "none" ? "" : padding === "compact" ? "px-4 py-3.5" : "px-4 py-4";

  return (
    <motion.section
      whileHover={hoverable ? { y: -2 } : undefined}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(sectionCardVariants({ variant, padding }), className)}
      {...props}
    >
      {(title || description || action) && (
        <div className="flex flex-col gap-3 border-b border-[rgba(216,224,236,0.86)] px-4 py-3.5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h3 className="text-[17px] font-semibold tracking-[var(--tracking-tight)] text-[var(--page-ink)]">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="mt-1 text-[14px] leading-6 text-[var(--muted-ink)]">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      <div className={bodyPaddingClass}>{children}</div>
    </motion.section>
  );
}
