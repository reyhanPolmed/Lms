"use client";

import { use } from "react";

import { TaskIntegrityCheckView } from "@/components/review-tugas/task-integrity-check-view";

export default function TaskSubmissionIntegrityCheckPage({
  params,
}: {
  params: Promise<{
    kelasId: string;
    mapelId: string;
    tugasId: string;
    submissionId: string;
  }>;
}) {
  const { kelasId, mapelId, tugasId, submissionId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeURIComponent(mapelId);
  const taskId = decodeURIComponent(tugasId);

  return (
    <TaskIntegrityCheckView
      taskId={taskId}
      submissionId={submissionId}
      backHref={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeURIComponent(subjectName)}/tugas/${encodeURIComponent(taskId)}`}
    />
  );
}
