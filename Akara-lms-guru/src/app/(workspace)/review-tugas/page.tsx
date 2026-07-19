"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ClipboardList, School, Users } from "lucide-react";

import { ClassSummaryCard } from "@/components/dashboard/class-summary-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { PageHeader, Surface } from "@/components/workspace/ui";
import { buildTaskClassCards, loadTaskReviewRows, type ReviewTaskSubmissionRow } from "./review-tugas-utils";

export default function TaskReviewClassesPage() {
  const [submissions, setSubmissions] = useState<ReviewTaskSubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(() => {
    loadTaskReviewRows()
      .then(setSubmissions)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat ringkasan review tugas.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const classCards = useMemo(() => buildTaskClassCards(submissions), [submissions]);

  return (
    <div className="space-y-5 pb-6">
      <PageHeader
        title="Review Tugas Mahasiswa"
        description="Pilih kelas untuk meninjau pengumpulan tugas, feedback revisi, dan status penilaian."
      />

      <Surface title="Pilih Kelas" description="Daftar ini membantu dosen masuk ke antrean tugas berdasarkan kelas.">
        {loading ? (
          <LoadingState
            title="Memuat ringkasan kelas"
            description="Mengambil daftar pengumpulan tugas dan mengelompokkannya per kelas."
          />
        ) : error ? (
          <ErrorState message={error} />
        ) : classCards.length === 0 ? (
          <EmptyState
            icon={School}
            title="Belum ada pengumpulan tugas"
            description="Kelas akan muncul setelah mahasiswa mengirimkan tugas untuk mata kuliah aktif."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {classCards.map((item) => (
              <ClassSummaryCard
                key={item.className}
                title={item.className}
                homeroomName={item.homeroomName}
                href={`/review-tugas/kelas/${encodeURIComponent(item.className)}`}
                ctaLabel="Tinjau Kelas"
                metrics={[
                  { label: "Mahasiswa", value: item.studentCount, icon: Users },
                  { label: "Mapel", value: item.subjectCount, icon: ClipboardList },
                  {
                    label: "Perlu review",
                    value: item.pendingCount,
                    icon: AlertTriangle,
                    tone: item.pendingCount > 0 ? "warning" : "success",
                  },
                ]}
              />
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}
