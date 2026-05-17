"use client";

import { ExternalLink } from "lucide-react";

import { LessonPagination } from "@/components/lesson/lesson-pagination";
import { LessonDetail, SidebarEntry } from "@/lib/types";

const contentTypeLabel: Record<LessonDetail["contentType"], string> = {
  video: "Video",
  pdf: "PDF",
  text: "Text",
  link: "Link"
};

function normalizeYouTubeUrl(rawUrl?: string | null) {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") ?? "";
      } else {
        const segments = url.pathname.split("/").filter(Boolean);
        const marker = segments[0];

        if (marker === "embed" || marker === "shorts" || marker === "live") {
          videoId = segments[1] ?? "";
        }
      }
    }

    if (!videoId) return null;

    const startParam = url.searchParams.get("start") ?? url.searchParams.get("t") ?? "";
    const startSeconds = parseYouTubeTimeToSeconds(startParam);
    const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);

    embedUrl.searchParams.set("rel", "0");
    if (startSeconds > 0) {
      embedUrl.searchParams.set("start", String(startSeconds));
    }

    return embedUrl.toString();
  } catch {
    return null;
  }
}

function parseYouTubeTimeToSeconds(value: string) {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);

  const parts = value.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
  if (!parts) return 0;

  const hours = Number(parts[1] ?? 0);
  const minutes = Number(parts[2] ?? 0);
  const seconds = Number(parts[3] ?? 0);

  return hours * 3600 + minutes * 60 + seconds;
}

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
  const youtubeEmbedUrl = normalizeYouTubeUrl(lesson.contentUrl);

  return (
    <section className="space-y-4">
      <div className="surface-card group overflow-hidden p-5 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
          {lesson.contentType === "video" ? (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
              src={youtubeEmbedUrl ?? lesson.contentUrl ?? undefined}
              title={lesson.title}
            />
          ) : lesson.contentType === "pdf" ? (
            <iframe className="h-[720px] w-full bg-white" src={lesson.contentUrl || undefined} title={lesson.title} />
          ) : lesson.contentType === "link" && youtubeEmbedUrl ? (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
              src={youtubeEmbedUrl}
              title={lesson.title}
            />
          ) : lesson.contentType === "link" ? (
            <div className="flex aspect-video items-end bg-[linear-gradient(145deg,#dce7ff_0%,#eef4fd_44%,#ffffff_100%)] p-6">
              <div className="max-w-2xl rounded-[24px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_50px_-36px_rgba(15,23,42,0.35)] backdrop-blur">
                <p className="eyebrow text-brand-ocean">{contentTypeLabel[lesson.contentType]}</p>
                <p className="mt-3 font-heading text-3xl font-semibold text-slate-950">{lesson.title}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{lesson.content || lesson.excerpt}</p>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video items-end bg-[linear-gradient(145deg,#081225_0%,#17315f_48%,#496ae8_100%)] p-6">
              <div className="max-w-2xl rounded-[24px] border border-white/10 bg-white/10 p-6 text-white shadow-[0_18px_50px_-36px_rgba(15,23,42,0.5)] backdrop-blur">
                <p className="eyebrow text-white/60">{contentTypeLabel[lesson.contentType]}</p>
                <p className="mt-3 font-heading text-3xl font-semibold">{lesson.title}</p>
                <p className="mt-4 text-sm leading-7 text-white/80">{lesson.content || lesson.excerpt}</p>
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
              href={lesson.contentUrl || undefined}
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
            <p>{lesson.content}</p>
          </div>
        </div>
      </div>

      <LessonPagination nextItem={nextItem} previousItem={previousItem} />
    </section>
  );
}
