"use client";

import { use } from "react";

import { TaskReviewSubmissionDetail } from "@/components/review-tugas/task-review-submission-detail";

export default function TaskSubmissionDetailByTaskPage({
  params,
}: {
  params: Promise<{ kelasId: string; mapelId: string; tugasId: string; submissionId: string }>;
}) {
  const { kelasId, mapelId, tugasId, submissionId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeURIComponent(mapelId);
  const taskId = decodeURIComponent(tugasId);

  return (
    <TaskReviewSubmissionDetail
      submissionId={submissionId}
      backHref={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeURIComponent(subjectName)}/tugas/${encodeURIComponent(taskId)}`}
    />
  );
}
