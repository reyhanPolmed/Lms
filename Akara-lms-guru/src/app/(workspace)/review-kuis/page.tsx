"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, ClipboardList, School, Users } from "lucide-react";

import { ClassSummaryCard } from "@/components/dashboard/class-summary-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type QuizItem, type QuizSubmissionSummary } from "@/lib/api-client";
import { buildClassCards } from "./review-kuis-utils";

export default function QuizReviewClassesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmissionSummary[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [error, setError] = useState("");

  const loadQuizzes = useCallback(() => {
    teacherApi
      .getQuizzes()
      .then(setQuizzes)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Gagal memuat daftar kuis.");
      })
      .finally(() => setLoadingQuizzes(false));
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  useEffect(() => {
    let cancelled = false;

    if (quizzes.length === 0) {
      return undefined;
    }

    Promise.resolve()
      .then(() => {
        if (!cancelled) {
          setLoadingSubmissions(true);
          setError("");
        }

        return Promise.all(quizzes.map((quiz) => teacherApi.getQuizSubmissions(quiz.id)));
      })
      .then((rows) => {
        if (!cancelled) {
          setSubmissions(rows.flat());
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setSubmissions([]);
          setError(
            loadError instanceof Error ? loadError.message : "Gagal memuat ringkasan review kuis."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSubmissions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [quizzes]);

  const classCards = useMemo(() => buildClassCards(submissions), [submissions]);

  return (
    <div className="space-y-5 pb-6">
      <PageHeader
        title="Review Kuis Mahasiswa"
        description="Pilih kelas sebagai pintu masuk awal untuk meninjau hasil kuis dan menentukan tindak lanjut."
      />

      <Surface title="Pilih Kelas" description="Ringkasan kelas disusun dari pengumpulan kuis yang sudah masuk.">
        {loadingQuizzes || loadingSubmissions ? (
          <LoadingState
            title="Memuat ringkasan kelas"
            description="Menggabungkan daftar kuis dan pengumpulan mahasiswa untuk halaman review."
          />
        ) : error ? (
          <ErrorState message={error} />
        ) : classCards.length === 0 ? (
          <EmptyState
            icon={School}
            title="Belum ada pengumpulan kuis"
            description="Kelas akan muncul setelah mahasiswa mulai mengerjakan kuis yang sudah dipublikasikan."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {classCards.map((item) => (
              <ClassSummaryCard
                key={item.className}
                title={item.className}
                homeroomName={item.homeroomName}
                href={`/review-kuis/kelas/${encodeURIComponent(item.className)}`}
                ctaLabel="Tinjau Kelas"
                metrics={[
                  { label: "Mahasiswa", value: item.studentCount, icon: Users },
                  { label: "Kuis", value: item.quizCount, icon: ClipboardList },
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
