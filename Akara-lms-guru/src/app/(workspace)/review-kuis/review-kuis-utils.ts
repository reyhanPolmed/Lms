import type { QuizAttemptDetail, QuizSubmissionSummary } from "@/lib/api-client";

export type ReviewClassCard = {
  className: string;
  homeroomName: string;
  studentCount: number;
  quizCount: number;
  pendingCount: number;
  averageScore: number | null;
};

export type ReviewSubjectCard = {
  subjectName: string;
  submissionCount: number;
  quizCount: number;
  pendingCount: number;
  averageScore: number | null;
};

export function formatSubmittedAt(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getReviewLabel(submission: QuizSubmissionSummary) {
  if (submission.status === "retake") return "Perlu revisi";
  if (submission.status === "graded" && submission.score !== null) return "Sudah dinilai";
  return "Belum direview";
}

export function getReviewToneClass(submission: QuizSubmissionSummary) {
  if (submission.status === "retake") {
    return "bg-[#fff4e8] text-[#bf7a27] border-[#f2d3a4]";
  }

  if (submission.status === "graded" && submission.score !== null) {
    return "bg-[#edf8f1] text-[#2f8c57] border-[#cde8d6]";
  }

  return "bg-[#f4f2ff] text-[#6b60c8] border-[#d8d2ff]";
}

export function buildClassCards(submissions: QuizSubmissionSummary[]) {
  const grouped = new Map<string, QuizSubmissionSummary[]>();

  submissions.forEach((submission) => {
    const classRows = grouped.get(submission.className) ?? [];
    classRows.push(submission);
    grouped.set(submission.className, classRows);
  });

  return Array.from(grouped.entries())
    .map<ReviewClassCard>(([className, classRows]) => {
      const scoredRows = classRows.filter((row) => row.score !== null);
      const averageScore =
        scoredRows.length > 0
          ? Math.round(
              scoredRows.reduce((total, row) => total + (row.score ?? 0), 0) / scoredRows.length
            )
          : null;

      return {
        className,
        homeroomName: "Data wali kelas belum sinkron",
        studentCount: new Set(classRows.map((row) => row.studentName)).size,
        quizCount: new Set(classRows.map((row) => row.assignmentTitle)).size,
        pendingCount: classRows.filter((row) => getReviewLabel(row) !== "Sudah dinilai").length,
        averageScore,
      };
    })
    .sort((left, right) => left.className.localeCompare(right.className, "id"));
}

export function buildSubjectCards(submissions: QuizSubmissionSummary[]) {
  const grouped = new Map<string, QuizSubmissionSummary[]>();

  submissions.forEach((submission) => {
    const subjectRows = grouped.get(submission.courseTitle) ?? [];
    subjectRows.push(submission);
    grouped.set(submission.courseTitle, subjectRows);
  });

  return Array.from(grouped.entries())
    .map<ReviewSubjectCard>(([subjectName, subjectRows]) => {
      const scoredRows = subjectRows.filter((row) => row.score !== null);
      const averageScore =
        scoredRows.length > 0
          ? Math.round(
              scoredRows.reduce((total, row) => total + (row.score ?? 0), 0) / scoredRows.length
            )
          : null;

      return {
        subjectName,
        submissionCount: subjectRows.length,
        quizCount: new Set(subjectRows.map((row) => row.assignmentTitle)).size,
        pendingCount: subjectRows.filter((row) => getReviewLabel(row) !== "Sudah dinilai").length,
        averageScore,
      };
    })
    .sort((left, right) => left.subjectName.localeCompare(right.subjectName, "id"));
}

export function getQuestionAnswerTone(question: QuizAttemptDetail["questions"][number]) {
  if (question.isCorrect) {
    return "border-[#cfe9d8] bg-[#f1faf4] text-[#2f6b45]";
  }

  if (question.studentAnswer) {
    return "border-[#f1d4dc] bg-[#fff6f8] text-[#a24a61]";
  }

  return "border-[rgba(113,94,215,0.1)] bg-white text-[#5f668d]";
}
