"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

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
    setLoadingQuizzes(true);
    setError("");

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
      setSubmissions([]);
      return undefined;
    }

    setLoadingSubmissions(true);
    setError("");

    Promise.all(quizzes.map((quiz) => teacherApi.getQuizSubmissions(quiz.id)))
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
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Review Kuis Siswa"
        description="Pilih kelas sebagai pintu masuk awal untuk meninjau hasil kuis siswa."
      />

      <Surface title="Pilih Kelas">
        {loadingQuizzes || loadingSubmissions ? (
          <p className="py-8 text-center text-[13px] text-[#626b8b]">Memuat ringkasan kelas...</p>
        ) : error ? (
          <p className="rounded-[12px] border border-[#f4d1d8] bg-[#fff7f9] px-3 py-2 text-[12px] text-[#b25a70]">
            {error}
          </p>
        ) : classCards.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Belum ada kelas dengan pengumpulan kuis.</p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {classCards.map((item) => (
              <article
                key={item.className}
                className="rounded-[22px] border border-[rgba(113,94,215,0.12)] bg-white p-4 shadow-[0_10px_24px_rgba(28,24,62,0.04)]"
              >
                <div>
                  <p className="text-[18px] font-semibold text-[#252b4d]">{item.className}</p>
                  <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#727b9b]">
                    Wali Kelas
                  </p>
                  <p className="mt-1 text-[13px] text-[#596183]">{item.homeroomName}</p>
                </div>

                <p className="mt-4 text-[13px] text-[#697198]">
                  {item.studentCount} siswa | {item.quizCount} kuis | {item.pendingCount} perlu ditinjau
                </p>

                <Link
                  href={`/review-kuis/kelas/${encodeURIComponent(item.className)}`}
                  className="mt-4 flex w-full items-center justify-center rounded-[14px] bg-[#715ed7] px-3 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(113,94,215,0.20)] transition-opacity hover:opacity-90"
                >
                  Tinjau Kelas
                </Link>
              </article>
            ))}
          </div>
        )}
      </Surface>
    </div>
  );
}
