"use client";

import { use } from "react";

import { decodeTaskReviewRouteSegment, encodeTaskReviewRouteSegment } from "@/app/(workspace)/review-tugas/review-tugas-utils";
import { TaskReviewSubmissionDetail } from "@/components/review-tugas/task-review-submission-detail";

export default function TaskSubmissionDetailByTaskPage({
  params,
}: {
  params: Promise<{ kelasId: string; mapelId: string; tugasId: string; submissionId: string }>;
}) {
  const { kelasId, mapelId, tugasId, submissionId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeTaskReviewRouteSegment(mapelId);
  const taskId = decodeURIComponent(tugasId);

  return (
    <TaskReviewSubmissionDetail
      submissionId={submissionId}
      backHref={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeTaskReviewRouteSegment(subjectName)}/tugas/${encodeURIComponent(taskId)}`}
      integrityHref={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeTaskReviewRouteSegment(subjectName)}/tugas/${encodeURIComponent(taskId)}/pengumpulan/${submissionId}/integrity-check`}
    />
  );
}
