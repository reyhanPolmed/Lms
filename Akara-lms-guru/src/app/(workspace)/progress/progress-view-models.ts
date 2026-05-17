import type { ProgressRow } from "@/lib/api-client";

export type ProgressRowWithIds = ProgressRow & {
  offeringId: string;
  studentId: string;
};

export type ClassCard = {
  className: string;
  studentCount: number;
  subjectCount: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
};

export type StudentProgressGroup = {
  studentId: string;
  studentName: string;
  className: string;
  rows: ProgressRowWithIds[];
  highestRisk: "rendah" | "sedang" | "tinggi";
  latestActivityAt: string | null;
  averageCompletion: number;
};

const riskPriority: Record<ProgressRow["riskLevel"], number> = {
  rendah: 1,
  sedang: 2,
  tinggi: 3,
};

export function parseProgressPercentage(value: string) {
  const [done, total] = value.split("/").map(Number);
  if (!Number.isFinite(done) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.round((done / total) * 100);
}

export function getRiskPillClass(riskLevel: ProgressRow["riskLevel"]) {
  if (riskLevel === "rendah") return "bg-[#eaf6ee] text-[#2f8c57]";
  if (riskLevel === "sedang") return "bg-[#fff0d9] text-[#c17614]";
  return "bg-[#ffe5ec] text-[#c54564]";
}

export function normalizeProgressRows(rows: ProgressRow[]): ProgressRowWithIds[] {
  return rows.map((row) => {
    const [offeringId = "", studentId = ""] = row.id.split("-");

    return {
      ...row,
      offeringId,
      studentId,
    };
  });
}

export function buildClassCards(rows: ProgressRowWithIds[]): ClassCard[] {
  const grouped = new Map<string, ProgressRowWithIds[]>();

  rows.forEach((row) => {
    const classRows = grouped.get(row.className) ?? [];
    classRows.push(row);
    grouped.set(row.className, classRows);
  });

  return Array.from(grouped.entries())
    .map(([className, classRows]) => ({
      className,
      studentCount: new Set(classRows.map((row) => row.studentId)).size,
      subjectCount: new Set(classRows.map((row) => row.courseTitle)).size,
      lowRiskCount: classRows.filter((row) => row.riskLevel === "rendah").length,
      mediumRiskCount: classRows.filter((row) => row.riskLevel === "sedang").length,
      highRiskCount: classRows.filter((row) => row.riskLevel === "tinggi").length,
    }))
    .sort((left, right) => left.className.localeCompare(right.className, "id"));
}

export function buildStudentGroups(
  rows: ProgressRowWithIds[],
  className: string
): StudentProgressGroup[] {
  const grouped = new Map<string, ProgressRowWithIds[]>();

  rows
    .filter((row) => row.className === className)
    .forEach((row) => {
      const studentRows = grouped.get(row.studentId) ?? [];
      studentRows.push(row);
      grouped.set(row.studentId, studentRows);
    });

  return Array.from(grouped.entries())
    .map(([studentId, studentRows]) => {
      const sortedRows = [...studentRows].sort((left, right) =>
        left.courseTitle.localeCompare(right.courseTitle, "id")
      );

      const highestRisk = sortedRows.reduce<ProgressRow["riskLevel"]>((highest, row) => {
        return riskPriority[row.riskLevel] > riskPriority[highest] ? row.riskLevel : highest;
      }, "rendah");

      const latestActivityAt =
        sortedRows
          .map((row) => row.lastActivityAt)
          .filter((value): value is string => Boolean(value))
          .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0] ?? null;

      const averageCompletion =
        sortedRows.reduce((total, row) => total + parseProgressPercentage(row.completedItemsCount), 0) /
        sortedRows.length;

      return {
        studentId,
        studentName: sortedRows[0]!.studentName,
        className: sortedRows[0]!.className,
        rows: sortedRows,
        highestRisk,
        latestActivityAt,
        averageCompletion: Math.round(averageCompletion),
      };
    })
    .sort((left, right) => left.studentName.localeCompare(right.studentName, "id"));
}
