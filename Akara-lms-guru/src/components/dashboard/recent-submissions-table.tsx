import { ClipboardList } from "lucide-react";

import { DataTable } from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RecentSubmission } from "@/lib/api-client";

type RecentSubmissionsTableProps = {
  submissions: RecentSubmission[];
};

export function RecentSubmissionsTable({
  submissions,
}: RecentSubmissionsTableProps) {
  return (
    <DataTable
      title="Submission terbaru"
      description="Antrean penilaian terakhir dari berbagai kelas dan mata kuliah."
    >
      {submissions.length === 0 ? (
        <div className="px-6 py-6">
          <EmptyState
            icon={ClipboardList}
            title="Belum ada submission baru"
            description="Saat mahasiswa mengirim tugas baru, antrean penilaian terbaru akan tampil di sini."
          />
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <Table className="min-w-[880px]">
              <TableHeader>
                <TableRow className="bg-[rgba(248,250,252,0.92)] hover:bg-[rgba(248,250,252,0.92)]">
                  <TableHead className="pl-6">Mahasiswa</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Tugas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="pr-6 text-right">Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="pl-6">
                      <p className="text-[15px] font-semibold text-[var(--page-ink)]">
                        {sub.studentName}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted-ink)]">{sub.className}</p>
                    </TableCell>
                    <TableCell className="max-w-[220px] text-sm text-[var(--page-ink)]">
                      {sub.courseTitle}
                    </TableCell>
                    <TableCell className="max-w-[260px] text-sm text-[var(--page-ink)]">
                      {sub.assignmentTitle}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={sub.status} />
                    </TableCell>
                    <TableCell className="pr-6 text-right text-[15px] font-semibold text-[var(--page-ink)]">
                      {sub.score ?? "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 p-6 lg:hidden">
            {submissions.map((sub) => (
              <article
                key={sub.id}
                className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold text-[var(--page-ink)]">
                      {sub.studentName}
                    </p>
                    <p className="mt-1 text-sm text-[var(--muted-ink)]">{sub.className}</p>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
                      Mata Kuliah
                    </p>
                    <p className="mt-1 text-[var(--page-ink)]">{sub.courseTitle}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
                      Tugas
                    </p>
                    <p className="mt-1 text-[var(--page-ink)]">{sub.assignmentTitle}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-subtle)] px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">
                      Skor
                    </p>
                    <p className="mt-2 text-lg font-semibold text-[var(--page-ink)]">
                      {sub.score ?? "-"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </DataTable>
  );
}
