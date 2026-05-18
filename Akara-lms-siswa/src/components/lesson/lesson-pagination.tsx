"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { SidebarEntry } from "@/lib/types";

export function LessonPagination({
  previousItem,
  nextItem
}: {
  previousItem?: SidebarEntry | null;
  nextItem?: SidebarEntry | null;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <PaginationButton direction="previous" item={previousItem} />
      <PaginationButton direction="next" item={nextItem} />
    </div>
  );
}

function PaginationButton({
  item,
  direction
}: {
  item?: SidebarEntry | null;
  direction: "previous" | "next";
}) {
  const isPrevious = direction === "previous";
  const label = isPrevious ? "Sebelumnya" : "Selanjutnya";
  const Icon = isPrevious ? ArrowLeft : ArrowRight;
  const disabled = !item || item.isLocked;
  const className = isPrevious
    ? "inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
    : "inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50";

  if (disabled) {
    return (
      <button className={className} disabled type="button">
        {isPrevious ? <Icon className="h-4 w-4" /> : null}
        {label}
        {isPrevious ? null : <Icon className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <Link className={className} href={item.href}>
      {isPrevious ? <Icon className="h-4 w-4" /> : null}
      {label}
      {isPrevious ? null : <Icon className="h-4 w-4" />}
    </Link>
  );
}
