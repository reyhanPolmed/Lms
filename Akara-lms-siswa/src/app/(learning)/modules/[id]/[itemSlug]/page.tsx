"use client";

import Link from "next/link";
import { use } from "react";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { toast } from "sonner";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { SidebarOutline } from "@/components/lesson/sidebar-outline";
import { QuizRunner } from "@/components/quiz/quiz-runner";
import { TaskSubmissionForm } from "@/components/task/task-submission-form";
import { LoadingState } from "@/components/ui/loading-state";
import { useModuleDetailQuery } from "@/hooks/use-lms-data";
import {
  useLessonCompleteMutation,
  useLessonDetailQuery,
  useQuizDetailQuery,
  useQuizStartMutation,
  useQuizSubmitMutation,
  useTaskDetailQuery,
  useTaskSubmitMutation
} from "@/hooks/use-lms-data";
import { resolveModuleItemRoute } from "@/lib/learning-routes";

export default function ModuleItemDetailPage({
  params
}: {
  params: Promise<{ id: string; itemSlug: string }>;
}) {
  const { id, itemSlug } = use(params);
  const moduleQuery = useModuleDetailQuery(id);
  const routeEntry =
    moduleQuery.data ? resolveModuleItemRoute(moduleQuery.data, itemSlug) : null;

  const lessonQuery = useLessonDetailQuery(
    routeEntry?.type === "lesson" ? routeEntry.id : "",
    routeEntry?.type === "lesson"
  );
  const completeMutation = useLessonCompleteMutation(routeEntry?.type === "lesson" ? routeEntry.id : "");

  const quizQuery = useQuizDetailQuery(
    routeEntry?.type === "quiz" ? routeEntry.id : "",
    routeEntry?.type === "quiz"
  );
  const startMutation = useQuizStartMutation(routeEntry?.type === "quiz" ? routeEntry.id : "");
  const submitQuizMutation = useQuizSubmitMutation(
    routeEntry?.type === "quiz" ? routeEntry.id : ""
  );

  const taskQuery = useTaskDetailQuery(
    routeEntry?.type === "task" ? routeEntry.id : "",
    routeEntry?.type === "task"
  );
  const submitTaskMutation = useTaskSubmitMutation(
    routeEntry?.type === "task" ? routeEntry.id : ""
  );

  if (moduleQuery.isLoading) {
    return <LoadingState label="Memuat modul..." />;
  }

  if (moduleQuery.isError || !moduleQuery.data) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {moduleQuery.error instanceof Error ? moduleQuery.error.message : "Modul tidak ditemukan"}
      </div>
    );
  }

  if (!routeEntry) {
    return <div className="surface-card p-6 text-sm text-rose-600">Item modul tidak ditemukan.</div>;
  }

  if (routeEntry.type === "lesson") {
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
    const activeIndex = lesson.sidebar.findIndex((item) => item.id === lesson.id);
    const previousItem = activeIndex > 0 ? lesson.sidebar[activeIndex - 1] : null;
    const nextItem =
      activeIndex >= 0 && activeIndex < lesson.sidebar.length - 1 ? lesson.sidebar[activeIndex + 1] : null;
    const activeEntry = lesson.sidebar.find((item) => item.id === lesson.id) ?? null;

    return (
      <div className="space-y-6">
        <Breadcrumbs itemTitle={lesson.title} moduleId={id} moduleTitle={moduleQuery.data.title} />

        <BackToModuleLink moduleId={id} />

        <DetailPageLayout
          sidebar={<SidebarOutline activeItemId={lesson.id} items={lesson.sidebar} />}
        >
          <LessonPlayer
            babLabel={activeEntry?.chapter}
            isCompleting={completeMutation.isPending}
            lesson={lesson}
            nextItem={nextItem}
            onComplete={async () => {
              try {
                await completeMutation.mutateAsync();
                toast.success("Lesson ditandai selesai");
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Gagal menandai selesai");
              }
            }}
            previousItem={previousItem}
          />
        </DetailPageLayout>
      </div>
    );
  }

  if (routeEntry.type === "quiz") {
    if (quizQuery.isLoading) {
      return <LoadingState label="Memuat quiz..." />;
    }

    if (quizQuery.isError || !quizQuery.data) {
      return (
        <div className="surface-card p-6 text-sm text-rose-600">
          {quizQuery.error instanceof Error ? quizQuery.error.message : "Quiz tidak ditemukan"}
        </div>
      );
    }

    const quiz = quizQuery.data;
    const activeIndex = quiz.sidebar.findIndex((item) => item.id === quiz.id);
    const previousItem = activeIndex > 0 ? quiz.sidebar[activeIndex - 1] : null;
    const nextItem =
      activeIndex >= 0 && activeIndex < quiz.sidebar.length - 1 ? quiz.sidebar[activeIndex + 1] : null;

    return (
      <div className="space-y-6">
        <Breadcrumbs itemTitle={quiz.title} moduleId={id} moduleTitle={moduleQuery.data.title} />

        <BackToModuleLink moduleId={id} />

        <DetailPageLayout
          sidebar={<SidebarOutline activeItemId={quiz.id} items={quiz.sidebar} />}
        >
          <QuizRunner
            isStarting={startMutation.isPending}
            isSubmitting={submitQuizMutation.isPending}
            nextItem={nextItem}
            onStart={() => startMutation.mutateAsync()}
            onSubmit={(payload) => submitQuizMutation.mutateAsync(payload)}
            previousItem={previousItem}
            quiz={quiz}
          />
        </DetailPageLayout>
      </div>
    );
  }

  if (taskQuery.isLoading) {
    return <LoadingState label="Memuat tugas..." />;
  }

  if (taskQuery.isError || !taskQuery.data) {
    return (
      <div className="surface-card p-6 text-sm text-rose-600">
        {taskQuery.error instanceof Error ? taskQuery.error.message : "Tugas tidak ditemukan"}
      </div>
    );
  }

  const task = taskQuery.data;
  const activeIndex = task.sidebar.findIndex((item) => item.id === task.id);
  const previousItem = activeIndex > 0 ? task.sidebar[activeIndex - 1] : null;
  const nextItem =
    activeIndex >= 0 && activeIndex < task.sidebar.length - 1 ? task.sidebar[activeIndex + 1] : null;

  return (
    <div className="space-y-6">
      <Breadcrumbs itemTitle={task.title} moduleId={id} moduleTitle={moduleQuery.data.title} />

      <BackToModuleLink moduleId={id} />

      <DetailPageLayout
        sidebar={<SidebarOutline activeItemId={task.id} items={task.sidebar} />}
      >
        <TaskSubmissionForm
          isSubmitting={submitTaskMutation.isPending}
          nextItem={nextItem}
          onSubmit={(submissionLink) => submitTaskMutation.mutateAsync({ submissionLink })}
          previousItem={previousItem}
          task={task}
        />
      </DetailPageLayout>
    </div>
  );
}

function DetailPageLayout({
  children,
  sidebar
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-4 xl:items-start">
      <div className="xl:col-span-3">{children}</div>
      <aside className="xl:col-span-1 xl:sticky xl:top-24">{sidebar}</aside>
    </div>
  );
}

function Breadcrumbs({
  moduleId,
  moduleTitle,
  itemTitle
}: {
  moduleId: string;
  moduleTitle: string;
  itemTitle: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
      <Home className="h-4 w-4" />
      <ChevronRight className="h-4 w-4" />
      <Link className="transition hover:text-brand-ocean" href="/modules">
        Materi
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link className="transition hover:text-brand-ocean" href={`/modules/${moduleId}`}>
        {moduleTitle}
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-slate-950">{itemTitle}</span>
    </div>
  );
}

function BackToModuleLink({ moduleId }: { moduleId: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Link
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-brand-ocean"
        href={`/modules/${moduleId}`}
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke modul
      </Link>
    </div>
  );
}
