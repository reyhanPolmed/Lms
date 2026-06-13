"use client";

import { ListChecks } from "lucide-react";
import { use, useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { TaskReviewTaskCard } from "@/components/review-tugas/task-review-task-card";
import { PageHeader, Surface } from "@/components/workspace/ui";
import {
  buildTaskCards,
  decodeTaskReviewRouteSegment,
  encodeTaskReviewRouteSegment,
  loadTaskReviewRows,
  type ReviewTaskSubmissionRow,
} from "../../../../review-tugas-utils";

export default function TaskReviewSubjectTasksPage({
  params,
}: {
  params: Promise<{ kelasId: string; mapelId: string }>;
}) {
  const { kelasId, mapelId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeTaskReviewRouteSegment(mapelId);

  const [submissions, setSubmissions] = useState<ReviewTaskSubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const rows = await loadTaskReviewRows();
        if (cancelled) return;
        setSubmissions(rows.filter((row) => row.className === className && row.moduleTitle === subjectName));
      } catch (loadError: unknown) {
        if (cancelled) return;
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat daftar tugas mapel.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadData();

    return () => {
      cancelled = true;
    };
  }, [className, subjectName]);

  const taskCards = useMemo(() => buildTaskCards(submissions), [submissions]);

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Tugas ${subjectName}`}
        description="Pilih tugas terlebih dahulu agar guru bisa masuk ke daftar pengumpulan yang lebih fokus."
        actionHref={`/review-tugas/kelas/${encodeURIComponent(className)}`}
        actionLabel="Kembali ke mapel"
      />

      <Surface
        title={`Pilih Tugas - ${className}`}
        description="Setiap card merangkum satu tugas beserta volume pengumpulan, rata-rata nilai, dan antrean review."
      >
        {loading ? (
          <p className="py-8 text-center text-[13px] text-[#626b8b]">Memuat daftar tugas...</p>
        ) : error ? (
          <p className="rounded-[12px] border border-[#f4d1d8] bg-[#fff7f9] px-3 py-2 text-[12px] text-[#b25a70]">
            {error}
          </p>
        ) : taskCards.length === 0 ? (
          <EmptyState
            icon={ListChecks}
            title="Belum ada tugas dengan pengumpulan"
            description="Tugas akan muncul di halaman ini setelah siswa mengirimkan submission pada mata pelajaran yang dipilih."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {taskCards.map((item) => (
              <TaskReviewTaskCard
                key={item.taskId}
                card={item}
                href={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeTaskReviewRouteSegment(subjectName)}/tugas/${encodeURIComponent(item.taskId)}`}
              />
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}
