"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";

import { PageHeader, Surface } from "@/components/workspace/ui";
import { buildTaskSubjectCards, loadTaskReviewRows, type ReviewTaskSubmissionRow } from "../../review-tugas-utils";

export default function TaskReviewClassSubjectsPage({
  params,
}: {
  params: Promise<{ kelasId: string }>;
}) {
  const { kelasId } = use(params);
  const className = decodeURIComponent(kelasId);

  const [submissions, setSubmissions] = useState<ReviewTaskSubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(() => {
    setLoading(true);
    setError("");

    loadTaskReviewRows()
      .then((rows) => setSubmissions(rows.filter((row) => row.className === className)))
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat mata pelajaran kelas.");
      })
      .finally(() => setLoading(false));
  }, [className]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const subjectCards = useMemo(() => buildTaskSubjectCards(submissions), [submissions]);

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Mata Pelajaran ${className}`}
        description="Pilih mata pelajaran terlebih dahulu, lalu buka pengumpulan tugas siswa pada mapel tersebut."
        actionHref="/review-tugas"
        actionLabel="Kembali ke kelas"
      />

      <Surface title={`Pilih Mata Pelajaran - ${className}`}>
        {loading ? (
          <p className="py-8 text-center text-[13px] text-[#626b8b]">Memuat mata pelajaran...</p>
        ) : error ? (
          <p className="rounded-[12px] border border-[#f4d1d8] bg-[#fff7f9] px-3 py-2 text-[12px] text-[#b25a70]">
            {error}
          </p>
        ) : subjectCards.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Belum ada mata pelajaran dengan pengumpulan tugas di kelas ini.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {subjectCards.map((item) => (
              <article
                key={item.subjectName}
                className="rounded-[22px] border border-[rgba(113,94,215,0.12)] bg-white p-4 shadow-[0_10px_24px_rgba(28,24,62,0.04)]"
              >
                <div>
                  <p className="text-[18px] font-semibold text-[#252b4d]">{item.subjectName}</p>
                  <p className="mt-3 text-[13px] text-[#697198]">
                    {item.taskCount} tugas | {item.submissionCount} pengumpulan | {item.pendingCount} perlu ditinjau
                  </p>
                </div>

                <div className="mt-4 rounded-[16px] border border-[rgba(113,94,215,0.08)] bg-[#faf8ff] px-3 py-2.5">
                  <p className="text-[13px] uppercase tracking-[0.14em] text-[#8a92b6]">
                    Rata-rata nilai
                  </p>
                  <p className="mt-1 text-[18px] font-semibold text-[#2f365f]">
                    {item.averageScore !== null ? item.averageScore : "—"}
                  </p>
                </div>

                <Link
                  href={`/review-tugas/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeURIComponent(item.subjectName)}`}
                  className="mt-4 flex w-full items-center justify-center rounded-[14px] bg-[#715ed7] px-3 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(113,94,215,0.20)] transition-opacity hover:opacity-90"
                >
                  Lihat Pengumpulan
                </Link>
              </article>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}
