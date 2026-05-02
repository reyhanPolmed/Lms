"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

import { LessonDetail, SidebarEntry } from "@/lib/types";

const contentTypeLabel: Record<LessonDetail["contentType"], string> = {
  video: "Video",
  pdf: "PDF",
  text: "Text",
  link: "Link"
};

export function LessonPlayer({
  lesson,
  onComplete,
  isCompleting,
  babLabel,
  previousItem,
  nextItem
}: {
  lesson: LessonDetail;
  onComplete: () => Promise<void>;
  isCompleting: boolean;
  babLabel?: string;
  previousItem?: SidebarEntry | null;
  nextItem?: SidebarEntry | null;
}) {
  const subtitle = babLabel ? `${babLabel} - Materi LMS` : "Materi LMS";
  const showExternalAction = lesson.contentType !== "text" && Boolean(lesson.contentUrl);

  return (
    <section className="space-y-4">
      <div className="surface-card group overflow-hidden p-5 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {lesson.contentType === "video" ? (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
              src={lesson.contentUrl}
              title={lesson.title}
            />
          ) : lesson.contentType === "pdf" ? (
            <iframe className="h-[720px] w-full bg-white" src={lesson.contentUrl} title={lesson.title} />
          ) : lesson.contentType === "link" ? (
            <div className="flex aspect-video items-end bg-[linear-gradient(145deg,#dce7ff_0%,#eef4fd_44%,#ffffff_100%)] p-6">
              <div className="max-w-2xl rounded-[24px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.35)] backdrop-blur">
                <p className="eyebrow text-brand-ocean">{contentTypeLabel[lesson.contentType]}</p>
                <p className="mt-3 font-heading text-3xl font-semibold text-slate-950">{lesson.title}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{lesson.body || lesson.excerpt}</p>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video items-end bg-[linear-gradient(145deg,#081225_0%,#17315f_48%,#496ae8_100%)] p-6">
              <div className="max-w-2xl rounded-[24px] border border-white/10 bg-white/10 p-6 text-white shadow-[0_18px_50px_-36px_rgba(15,23,42,0.5)] backdrop-blur">
                <p className="eyebrow text-white/60">{contentTypeLabel[lesson.contentType]}</p>
                <p className="mt-3 font-heading text-3xl font-semibold">{lesson.title}</p>
                <p className="mt-4 text-sm leading-7 text-white/80">{lesson.body || lesson.excerpt}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-semibold text-slate-950 sm:text-[2rem]">
              {lesson.title}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          </div>

          {showExternalAction ? (
            <a
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand-ocean/10 bg-brand-ocean/5 text-brand-ocean transition hover:bg-brand-ocean/10"
              href={lesson.contentUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          ) : null}
        </div>

        <div className="mt-5 space-y-5">
          <p className="text-sm leading-7 text-slate-600">{lesson.excerpt}</p>

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-lg bg-brand-ocean px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#496ae8] disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={isCompleting || lesson.isCompleted}
              onClick={() => onComplete()}
              type="button"
            >
              {lesson.isCompleted
                ? "Sudah selesai"
                : isCompleting
                  ? "Memproses..."
                  : "Tandai selesai"}
            </button>
            {lesson.isCompleted ? (
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-900">
                Complete
              </span>
            ) : null}
          </div>

          <div className="rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">
            <p>{lesson.body}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <LessonNavItem direction="previous" item={previousItem} />
        <LessonNavItem direction="next" item={nextItem} />
      </div>
    </section>
  );
}

function LessonNavItem({
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
    ? "inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
    : "inline-flex items-center gap-2 rounded-lg bg-brand-ocean px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#496ae8] disabled:opacity-50";

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
