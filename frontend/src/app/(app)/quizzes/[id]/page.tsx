"use client";

import { use } from "react";

import { QuizRunner } from "@/components/quiz/quiz-runner";
import { LoadingState } from "@/components/ui/loading-state";
import {
  useQuizDetailQuery,
  useQuizStartMutation,
  useQuizSubmitMutation
} from "@/hooks/use-lms-data";

export default function QuizPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const quizQuery = useQuizDetailQuery(id);
  const startMutation = useQuizStartMutation(id);
  const submitMutation = useQuizSubmitMutation(id);

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

  return (
    <QuizRunner
      isStarting={startMutation.isPending}
      isSubmitting={submitMutation.isPending}
      onStart={() => startMutation.mutateAsync()}
      onSubmit={(payload) => submitMutation.mutateAsync(payload)}
      quiz={quizQuery.data}
    />
  );
}
