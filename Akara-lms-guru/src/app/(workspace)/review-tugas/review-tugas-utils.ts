import {
  teacherApi,
  type TaskSubmissionDetail,
  type TaskSubmissionSummary,
} from "@/lib/api-client";

export type ReviewTaskSubmissionRow = TaskSubmissionSummary & {
  taskId: string;
  taskTitle: string;
  moduleId: string;
  moduleTitle: string;
};

export type ReviewTaskClassCard = {
  className: string;
  homeroomName: string;
  studentCount: number;
  subjectCount: number;
  pendingCount: number;
  averageScore: number | null;
};

export type ReviewTaskSubjectCard = {
  subjectName: string;
  submissionCount: number;
  taskCount: number;
  pendingCount: number;
  averageScore: number | null;
};

export type ReviewTaskCard = {
  taskId: string;
  taskTitle: string;
  submissionCount: number;
  studentCount: number;
  pendingCount: number;
  averageScore: number | null;
  latestSubmittedAt: string | null;
};

export function encodeTaskReviewRouteSegment(value: string) {
  return encodeURIComponent(encodeURIComponent(value));
}

export function decodeTaskReviewRouteSegment(value: string) {
  let decoded = value;

  for (let index = 0; index < 2; index += 1) {
    try {
      const nextValue = decodeURIComponent(decoded);
      if (nextValue === decoded) break;
      decoded = nextValue;
    } catch {
      break;
    }
  }

  return decoded;
}

export function formatTaskSubmittedAt(value: string | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function getTaskReviewLabel(submission: ReviewTaskSubmissionRow | TaskSubmissionSummary) {
  if (submission.status === "revised") return "Perlu revisi";
  if (submission.status === "graded" && submission.score !== null) return "Sudah dinilai";
  return "Belum direview";
}

export function getTaskReviewToneClass(submission: ReviewTaskSubmissionRow | TaskSubmissionSummary) {
  if (submission.status === "revised") {
    return "bg-[#fff4e8] text-[#bf7a27] border-[#f2d3a4]";
  }

  if (submission.status === "graded" && submission.score !== null) {
    return "bg-[#edf8f1] text-[#2f8c57] border-[#cde8d6]";
  }

  return "bg-[#f4f2ff] text-[#6b60c8] border-[#d8d2ff]";
}

export function buildTaskClassCards(submissions: ReviewTaskSubmissionRow[]) {
  const grouped = new Map<string, ReviewTaskSubmissionRow[]>();

  submissions.forEach((submission) => {
    const classRows = grouped.get(submission.className) ?? [];
    classRows.push(submission);
    grouped.set(submission.className, classRows);
  });

  return Array.from(grouped.entries())
    .map<ReviewTaskClassCard>(([className, classRows]) => {
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
        subjectCount: new Set(classRows.map((row) => row.moduleTitle)).size,
        pendingCount: classRows.filter((row) => getTaskReviewLabel(row) !== "Sudah dinilai").length,
        averageScore,
      };
    })
    .sort((left, right) => left.className.localeCompare(right.className, "id"));
}

export function buildTaskSubjectCards(submissions: ReviewTaskSubmissionRow[]) {
  const grouped = new Map<string, ReviewTaskSubmissionRow[]>();

  submissions.forEach((submission) => {
    const subjectRows = grouped.get(submission.moduleTitle) ?? [];
    subjectRows.push(submission);
    grouped.set(submission.moduleTitle, subjectRows);
  });

  return Array.from(grouped.entries())
    .map<ReviewTaskSubjectCard>(([subjectName, subjectRows]) => {
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
        taskCount: new Set(subjectRows.map((row) => row.taskTitle)).size,
        pendingCount: subjectRows.filter((row) => getTaskReviewLabel(row) !== "Sudah dinilai").length,
        averageScore,
      };
    })
    .sort((left, right) => left.subjectName.localeCompare(right.subjectName, "id"));
}

export function buildTaskCards(submissions: ReviewTaskSubmissionRow[]) {
  const grouped = new Map<string, ReviewTaskSubmissionRow[]>();

  submissions.forEach((submission) => {
    const taskRows = grouped.get(submission.taskId) ?? [];
    taskRows.push(submission);
    grouped.set(submission.taskId, taskRows);
  });

  return Array.from(grouped.entries())
    .map<ReviewTaskCard>(([taskId, taskRows]) => {
      const scoredRows = taskRows.filter((row) => row.score !== null);
      const averageScore =
        scoredRows.length > 0
          ? Math.round(
              scoredRows.reduce((total, row) => total + (row.score ?? 0), 0) / scoredRows.length
            )
          : null;

      const sortedRows = [...taskRows].sort((left, right) => {
        const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0;
        const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0;
        return rightTime - leftTime;
      });

      return {
        taskId,
        taskTitle: taskRows[0]?.taskTitle ?? "Tugas",
        submissionCount: taskRows.length,
        studentCount: new Set(taskRows.map((row) => row.studentName)).size,
        pendingCount: taskRows.filter((row) => getTaskReviewLabel(row) !== "Sudah dinilai").length,
        averageScore,
        latestSubmittedAt: sortedRows[0]?.submittedAt ?? null,
      };
    })
    .sort((left, right) => left.taskTitle.localeCompare(right.taskTitle, "id"));
}

export async function loadTaskReviewRows() {
  const modules = await teacherApi.getModules();
  if (modules.length === 0) return [];

  const moduleDetails = await Promise.all(modules.map((module) => teacherApi.getModuleDetail(module.id)));

  const submissionGroups = await Promise.all(
    moduleDetails.map(async (moduleDetail) => {
      return Promise.all(
        moduleDetail.tasks.map(async (task) => {
          const rows = await teacherApi.getTaskSubmissions(task.id);
          return rows.map<ReviewTaskSubmissionRow>((row) => ({
            ...row,
            taskId: task.id,
            taskTitle: task.title,
            moduleId: moduleDetail.id,
            moduleTitle: moduleDetail.title,
          }));
        })
      );
    })
  );

  return submissionGroups
    .flat(2)
    .sort((left, right) => {
      const leftTime = left.submittedAt ? new Date(left.submittedAt).getTime() : 0;
      const rightTime = right.submittedAt ? new Date(right.submittedAt).getTime() : 0;
      return rightTime - leftTime;
    });
}

export function computeTaskSubmissionScore(
  detail: TaskSubmissionDetail | null,
  rubricScores: Record<string, number>
) {
  if (!detail) return null;

  const totalGiven = Object.values(rubricScores).reduce((sum, value) => sum + (value || 0), 0);
  const totalMax = detail.rubrics.reduce((sum, rubric) => sum + rubric.maxScore, 0);

  return totalMax > 0 ? Math.round((totalGiven / totalMax) * 100) : null;
}
