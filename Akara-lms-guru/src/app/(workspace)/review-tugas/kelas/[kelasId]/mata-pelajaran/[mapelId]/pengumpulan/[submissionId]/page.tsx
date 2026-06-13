"use client";

import { use } from "react";

import { decodeTaskReviewRouteSegment, encodeTaskReviewRouteSegment } from "@/app/(workspace)/review-tugas/review-tugas-utils";
import { TaskReviewSubmissionDetail } from "@/components/review-tugas/task-review-submission-detail";

export default function TaskSubmissionDetailPage({
  params,
}: {
  params: Promise<{ kelasId: string; mapelId: string; submissionId: string }>;
}) {
  const { kelasId, mapelId, submissionId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeTaskReviewRouteSegment(mapelId);

  return (
    <TaskReviewSubmissionDetail
      submissionId={submissionId}
      backHref={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeTaskReviewRouteSegment(subjectName)}`}
    />
  );
}
