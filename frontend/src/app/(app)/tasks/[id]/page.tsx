"use client";

import { use } from "react";

import { TaskSubmissionForm } from "@/components/task/task-submission-form";
import { LoadingState } from "@/components/ui/loading-state";
import { useTaskDetailQuery, useTaskSubmitMutation } from "@/hooks/use-lms-data";

export default function TaskPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const taskQuery = useTaskDetailQuery(id);
  const submitMutation = useTaskSubmitMutation(id);

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

  return (
    <TaskSubmissionForm
      isSubmitting={submitMutation.isPending}
      onSubmit={(submissionLink) => submitMutation.mutateAsync({ submissionLink })}
      task={taskQuery.data}
    />
  );
}
