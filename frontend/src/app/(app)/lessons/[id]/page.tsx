"use client";

import { use } from "react";
import { toast } from "sonner";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { SidebarOutline } from "@/components/lesson/sidebar-outline";
import { LoadingState } from "@/components/ui/loading-state";
import {
  useLessonCompleteMutation,
  useLessonDetailQuery,
  useLessonDurationMutation
} from "@/hooks/use-lms-data";

export default function LessonDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const lessonQuery = useLessonDetailQuery(id);
  const durationMutation = useLessonDurationMutation(id);
  const completeMutation = useLessonCompleteMutation(id);

  if (lessonQuery.isLoading) {
    return <LoadingState label="Memuat lesson..." />;
  }

  if (lessonQuery.isError || !lessonQuery.data) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {lessonQuery.error instanceof Error ? lessonQuery.error.message : "Lesson tidak ditemukan"}
      </div>
    );
  }

  const lesson = lessonQuery.data;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
      <div className="space-y-6">
        <section className="surface-card p-8">
          <p className="eyebrow">{lesson.contentType}</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold text-slate-950">{lesson.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{lesson.excerpt}</p>
        </section>

        <LessonPlayer
          isCompleting={completeMutation.isPending}
          isTracking={durationMutation.isPending}
          lesson={lesson}
          onComplete={async () => {
            try {
              await completeMutation.mutateAsync();
              toast.success("Lesson ditandai selesai");
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Gagal menandai selesai");
            }
          }}
          onTrackDuration={async (seconds) => {
            try {
              await durationMutation.mutateAsync({ seconds });
              toast.success(`Durasi bertambah ${seconds} detik`);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Gagal mengirim durasi");
            }
          }}
        />
      </div>

      <div className="space-y-6">
        <SidebarOutline items={lesson.sidebar} />

        <section className="surface-card p-6">
          <p className="eyebrow">Learning notes</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold">Checklist lesson</h2>
          <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
            {lesson.tips.length === 0 ? (
              <li>Belum ada checklist dari backend untuk lesson ini.</li>
            ) : (
              lesson.tips.map((tip) => <li key={tip}>{tip}</li>)
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
