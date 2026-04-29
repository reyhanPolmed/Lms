"use client";

import { Clock3, ShieldCheck } from "lucide-react";

import { LessonDetail } from "@/lib/types";

export function LessonPlayer({
  lesson,
  onTrackDuration,
  onComplete,
  isTracking,
  isCompleting
}: {
  lesson: LessonDetail;
  onTrackDuration: (seconds: number) => Promise<void>;
  onComplete: () => Promise<void>;
  isTracking: boolean;
  isCompleting: boolean;
}) {
  const durationTargetSeconds = Math.max(lesson.durationTargetSeconds, 0);
  const progress = Math.min(
    100,
    durationTargetSeconds === 0 ? 100 : Math.round((lesson.trackedSeconds / durationTargetSeconds) * 100)
  );
  const canComplete = durationTargetSeconds === 0 || lesson.trackedSeconds >= durationTargetSeconds;

  return (
    <section className="surface-card overflow-hidden">
      <div className="border-b border-slate-200 px-8 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="eyebrow">Lesson player</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold">Konten dan pelacakan durasi</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
            <ShieldCheck className="h-4 w-4 text-brand-ocean" />
            Anti-skip mengikuti durasi backend
          </div>
        </div>
      </div>

      <div className="space-y-6 p-8">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-950">
          {lesson.contentType === "video" ? (
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
              src={lesson.contentUrl}
              title={lesson.title}
            />
          ) : lesson.contentType === "pdf" ? (
            <iframe className="h-[640px] w-full" src={lesson.contentUrl} title={lesson.title} />
          ) : lesson.contentType === "link" ? (
            <div className="p-8 text-slate-200">
              <p className="font-heading text-2xl font-semibold text-white">{lesson.title}</p>
              <p className="mt-4 leading-7 text-slate-300">{lesson.body || lesson.excerpt}</p>
              <a
                className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                href={lesson.contentUrl}
                rel="noreferrer"
                target="_blank"
              >
                Buka materi
              </a>
            </div>
          ) : (
            <div className="p-8 text-slate-200">
              <p className="font-heading text-2xl font-semibold text-white">{lesson.title}</p>
              <p className="mt-4 leading-7 text-slate-300">{lesson.body}</p>
            </div>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {lesson.trackedSeconds}s / {durationTargetSeconds}s
              </span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-brand-ocean" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 disabled:opacity-60"
              disabled={isTracking || lesson.isCompleted}
              onClick={() => onTrackDuration(30)}
              type="button"
            >
              {isTracking ? "Mengirim..." : "Tambah 30 detik"}
            </button>
            <button
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              disabled={!canComplete || isCompleting || lesson.isCompleted}
              onClick={() => onComplete()}
              type="button"
            >
              {lesson.isCompleted ? "Sudah selesai" : isCompleting ? "Memproses..." : "Tandai selesai"}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] bg-slate-50 p-6 text-sm leading-7 text-slate-600">
          <p>{lesson.body}</p>
        </div>
      </div>
    </section>
  );
}
