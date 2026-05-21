"use client";

import Link from "next/link";
import { use, useCallback, useEffect, useMemo, useState } from "react";

import { PageHeader, Surface } from "@/components/workspace/ui";
import { teacherApi, type QuizItem, type QuizSubmissionSummary } from "@/lib/api-client";
import {
  decodeReviewRouteSegment,
  encodeReviewRouteSegment,
  formatSubmittedAt,
  getReviewLabel,
  getReviewToneClass,
} from "../../../../review-kuis-utils";

const PAGE_SIZE = 8;

export default function QuizReviewSubjectSubmissionsPage({
  params,
}: {
  params: Promise<{ kelasId: string; mapelId: string }>;
}) {
  const { kelasId, mapelId } = use(params);
  const className = decodeURIComponent(kelasId);
  const subjectName = decodeReviewRouteSegment(mapelId);

  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmissionSummary[]>([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
          setSubmissions(
            rows
              .flat()
              .filter(
                (submission) =>
                  submission.className === className && submission.courseTitle === subjectName
              )
              .sort((left, right) => {
                const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0;
                const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0;
                return rightTime - leftTime;
              })
          );
        }
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setSubmissions([]);
          setError(
            loadError instanceof Error ? loadError.message : "Gagal memuat pengumpulan kuis mapel."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSubmissions(false);
      });

    return () => {
      cancelled = true;
    };
  }, [className, quizzes, subjectName]);

  const totalPages = Math.max(1, Math.ceil(submissions.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [className, subjectName, submissions.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedSubmissions = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return submissions.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, submissions]);

  const paginationItems = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages]
  );

  const rangeStart = submissions.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, submissions.length);

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Pengumpulan ${subjectName}`}
        description="Pilih salah satu pengumpulan kuis untuk membuka detail jawaban siswa."
        actionHref={`/review-kuis/kelas/${encodeURIComponent(className)}`}
        actionLabel="Kembali ke mapel"
      />

      <Surface title={`Daftar Pengumpulan - ${className}`}>
        {loadingQuizzes || loadingSubmissions ? (
          <p className="py-8 text-center text-[13px] text-[#626b8b]">Memuat pengumpulan kuis...</p>
        ) : error ? (
          <p className="rounded-[12px] border border-[#f4d1d8] bg-[#fff7f9] px-3 py-2 text-[12px] text-[#b25a70]">
            {error}
          </p>
        ) : submissions.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-4 py-8 text-center">
            <p className="text-[13px] text-[#626b8b]">Belum ada pengumpulan kuis untuk mata pelajaran ini.</p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="mb-3 rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-[#fbfaff] p-4">
              <p className="text-[17px] font-semibold text-[#252b4d]">{subjectName}</p>
              <p className="mt-1 text-[13px] text-[#667094]">
                Kelas {className} • {submissions.length} pengumpulan kuis
              </p>
            </div>

            <div className="overflow-hidden rounded-[18px] border border-[rgba(113,94,215,0.10)] bg-white">
              <div className="grid grid-cols-[1.15fr_1.1fr_0.95fr_0.7fr_0.9fr_0.78fr] gap-3 border-b border-[rgba(113,94,215,0.08)] bg-[#fbfaff] px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#8a92b6]">
                <span>Siswa</span>
                <span>Kuis</span>
                <span>Dikumpulkan</span>
                <span>Skor</span>
                <span>Status Review</span>
                <span>Aksi</span>
              </div>

              <div className="divide-y divide-[rgba(113,94,215,0.08)]">
                {paginatedSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="grid grid-cols-[1.15fr_1.1fr_0.95fr_0.7fr_0.9fr_0.78fr] gap-3 px-4 py-3 text-left"
                  >
                    <span className="text-[13px] font-semibold text-[#333a63]">{submission.studentName}</span>
                    <span className="text-[12px] text-[#62698f]">{submission.assignmentTitle}</span>
                    <span className="text-[12px] text-[#7b83a8]">{formatSubmittedAt(submission.submittedAt)}</span>
                    <span className="text-[12px] font-semibold text-[#333a63]">
                      {submission.score !== null ? `${submission.score}/100` : "—"}
                    </span>
                    <span
                      className={`inline-flex w-fit rounded-full border px-2 py-1 text-[13px] font-semibold ${getReviewToneClass(
                        submission
                      )}`}
                    >
                      {getReviewLabel(submission)}
                    </span>
                    <Link
                      href={`/review-kuis/kelas/${encodeURIComponent(className)}/mata-pelajaran/${encodeReviewRouteSegment(subjectName)}/pengumpulan/${submission.id}`}
                      className="inline-flex w-fit items-center justify-center rounded-[10px] border border-[#d8d2ff] bg-white px-2.5 py-1.5 text-[12px] font-semibold text-[#6c63ad] hover:border-[#715ed7] hover:text-[#715ed7]"
                    >
                      Review
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[12px] text-[#7b83a8]">
                {rangeStart}-{rangeEnd} dari {submissions.length} pengumpulan
              </p>
              <div className="flex flex-wrap gap-1.5">
                {paginationItems.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-8 rounded-[10px] px-2.5 py-1.5 text-[12px] font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-[#715ed7] text-white"
                        : "border border-[rgba(113,94,215,0.12)] bg-white text-[#6b7297] hover:border-[#715ed7] hover:text-[#715ed7]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Surface>
    </div>
  );
}
