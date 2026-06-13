"use client";

import { use } from "react";

import { decodeTaskReviewRouteSegment, encodeTaskReviewRouteSegment } from "@/app/(workspace)/review-tugas/review-tugas-utils";
import { TaskIntegrityCheckView } from "@/components/review-tugas/task-integrity-check-view";

export default function TaskSubmissionIntegrityCheckBySubjectPage({
  params,
}: {
  params: Promise<{
    kelasId: string;
    mapelId: string;
    submissionId: string;
  }>;
}) {
  const { kelasId, mapelId, submissionId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeTaskReviewRouteSegment(mapelId);

  return (
    <TaskIntegrityCheckView
      taskId="tugas"
      submissionId={submissionId}
      backHref={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeTaskReviewRouteSegment(subjectName)}`}
    />
  );
}
