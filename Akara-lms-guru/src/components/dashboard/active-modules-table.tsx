"use client";

import { BookOpen, MoreHorizontal, PenSquare } from "lucide-react";
import Link from "next/link";

import { DataTable } from "@/components/dashboard/data-table";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ProgressIndicator } from "@/components/dashboard/progress-indicator";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ModuleSummary } from "@/lib/api-client";

type ActiveModulesTableProps = {
  modules: ModuleSummary[];
};

export function ActiveModulesTable({ modules }: ActiveModulesTableProps) {
  return (
    <DataTable
      title="Mata pelajaran aktif"
      description="Daftar modul yang sedang Anda ampu beserta status konten dan progres penyelesaian siswa."
      action={
        <Button asChild variant="secondary" size="sm">
          <Link href="/modules">Buka semua modul</Link>
        </Button>
      }
    >
      {modules.length === 0 ? (
        <div className="px-6 py-6">
          <EmptyState
            icon={BookOpen}
            title="Belum ada mata pelajaran aktif"
            description="Saat admin menugaskan modul baru, daftar aktif akan muncul di sini lengkap dengan progresnya."
          />
        </div>
      ) : (
        <>
          <div className="hidden lg:block">
            <Table className="min-w-[920px]">
              <TableHeader>
                <TableRow className="bg-[rgba(248,250,252,0.92)] hover:bg-[rgba(248,250,252,0.92)]">
                  <TableHead className="pl-6">Mata Pelajaran</TableHead>
                  <TableHead>Cakupan Konten</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress Siswa</TableHead>
                  <TableHead className="w-[72px] pr-6 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="pl-6">
                      <div>
                        <p className="max-w-[240px] text-[15px] font-semibold text-[var(--page-ink)]">
                          {row.title}
                        </p>
                        <p className="mt-1 text-sm text-[var(--muted-ink)]">
                          {row.department} · {row.gradeLevel}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-[var(--muted-ink)]">
                        <p>{row.chapters} bab</p>
                        <p>{row.lessons} materi · {row.quizzes} kuis · {row.tasks} tugas</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[220px]">
                        <ProgressIndicator value={row.completionRate} />
                      </div>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Buka aksi untuk ${row.title}`}
                          >
                            <AppIcon icon={MoreHorizontal} size="sm" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/modules/${row.id}/builder`}>
                              <AppIcon icon={PenSquare} size="sm" />
                              Buka builder
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-4 p-6 lg:hidden">
            {modules.map((row) => (
              <article
                key={row.id}
                className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold text-[var(--page-ink)]">{row.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted-ink)]">
                      {row.department} · {row.gradeLevel}
                    </p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[var(--muted-ink)]">
                  <div className="rounded-2xl bg-[var(--surface-subtle)] px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Bab</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--page-ink)]">{row.chapters}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--surface-subtle)] px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Konten</p>
                    <p className="mt-2 text-lg font-semibold text-[var(--page-ink)]">
                      {row.lessons + row.quizzes + row.tasks}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <ProgressIndicator value={row.completionRate} />
                </div>
                <Button asChild variant="secondary" className="mt-4 w-full">
                  <Link href={`/modules/${row.id}/builder`}>Buka builder</Link>
                </Button>
              </article>
            ))}
          </div>
        </>
      )}
    </DataTable>
  );
}
