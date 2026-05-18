"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ClipboardList, School, Users } from "lucide-react";

import { ClassSummaryCard } from "@/components/dashboard/class-summary-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type ProgressRow } from "@/lib/api-client";
import { buildClassCards, normalizeProgressRows } from "./progress-view-models";

export default function StudentProgressPage() {
  const [rows, setRows] = useState<ProgressRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    teacherApi
      .getStudentProgress()
      .then(setRows)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  const classCards = useMemo(() => buildClassCards(normalizeProgressRows(rows)), [rows]);

  return (
    <div className="space-y-5 pb-6">
      <PageHeader
        title="Progres Siswa"
        description="Mulai dari kelas untuk menemukan siswa berisiko, progres tertahan, dan mata pelajaran yang perlu intervensi."
      />

      <Surface title="Daftar Kelas" description="Ringkasan progres per kelas untuk memprioritaskan pemantauan.">
        {loading ? (
          <LoadingState
            title="Memuat data kelas"
            description="Mengambil progres siswa dan menyusun ringkasan berdasarkan kelas."
          />
        ) : error ? (
          <ErrorState message={error} />
        ) : classCards.length === 0 ? (
          <EmptyState
            icon={School}
            title="Belum ada data kelas"
            description="Data progres akan tampil setelah siswa mulai mengakses modul pembelajaran."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {classCards.map((item) => (
              <ClassSummaryCard
                key={item.className}
                title={item.className}
                href={`/progress/class/${encodeURIComponent(item.className)}`}
                ctaLabel="Lihat Siswa"
                metrics={[
                  { label: "Siswa", value: item.studentCount, icon: Users },
                  { label: "Mapel", value: item.subjectCount, icon: ClipboardList },
                  {
                    label: "Berisiko",
                    value: item.highRiskCount,
                    icon: AlertTriangle,
                    tone: item.highRiskCount > 0 ? "danger" : "success",
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
