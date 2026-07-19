"use client";

import { ListChecks } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { TaskReviewSubmissionsTable } from "@/components/review-tugas/task-review-submissions-table";
import { PageHeader, Surface } from "@/components/workspace/ui";
import {
  decodeTaskReviewRouteSegment,
  encodeTaskReviewRouteSegment,
  loadTaskReviewRows,
  type ReviewTaskSubmissionRow,
} from "../../../../../../review-tugas-utils";

const PAGE_SIZE = 8;

export default function TaskReviewTaskSubmissionsPage({
  params,
}: {
  params: Promise<{ kelasId: string; mapelId: string; tugasId: string }>;
}) {
  const { kelasId, mapelId, tugasId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeTaskReviewRouteSegment(mapelId);
  const taskId = decodeURIComponent(tugasId);

  const [submissions, setSubmissions] = useState<ReviewTaskSubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const rows = await loadTaskReviewRows();
        if (cancelled) return;
        setSubmissions(
          rows
            .filter(
              (row) =>
                row.className === className &&
                row.moduleTitle === subjectName &&
                row.taskId === taskId
            )
            .sort((left, right) => {
              const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0;
              const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0;
              return rightTime - leftTime;
            })
        );
      } catch (loadError: unknown) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat pengumpulan tugas.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [className, subjectName, taskId]);

  const totalPages = Math.max(1, Math.ceil(submissions.length / PAGE_SIZE));
  const taskTitle = submissions[0]?.taskTitle ?? "Tugas";
  const activePage = Math.min(currentPage, totalPages);

  const paginatedSubmissions = useMemo(() => {
    const startIndex = (activePage - 1) * PAGE_SIZE;
    return submissions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [activePage, submissions]);

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Pengumpulan ${taskTitle}`}
        description="Pilih submission mahasiswa dari tugas yang sama agar proses review lebih fokus dan rapi."
        actionHref={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeTaskReviewRouteSegment(subjectName)}`}
        actionLabel="Kembali ke tugas"
      />

      <Surface title={`Daftar Pengumpulan - ${className}`}>
        {loading ? (
          <p className="py-8 text-center text-[13px] text-[#626b8b]">Memuat pengumpulan tugas...</p>
        ) : error ? (
          <p className="rounded-[12px] border border-[#f4d1d8] bg-[#fff7f9] px-3 py-2 text-[12px] text-[#b25a70]">
            {error}
          </p>
        ) : submissions.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Belum ada pengumpulan untuk tugas ini"
            description="Daftar submission akan muncul di sini setelah mahasiswa mengirimkan tugas yang dipilih."
          />
        ) : (
          <TaskReviewSubmissionsTable
            className={className}
            subjectName={subjectName}
            taskTitle={taskTitle}
            submissions={paginatedSubmissions}
            totalCount={submissions.length}
            currentPage={activePage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            buildDetailHref={(submissionId) =>
              `/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeTaskReviewRouteSegment(subjectName)}/tugas/${encodeURIComponent(taskId)}/pengumpulan/${submissionId}`
            }
            buildIntegrityHref={(submissionId) =>
              `/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeTaskReviewRouteSegment(subjectName)}/tugas/${encodeURIComponent(taskId)}/pengumpulan/${submissionId}/integrity-check`
            }
          />
        )}
      </Surface>
    </div>
  );
}
