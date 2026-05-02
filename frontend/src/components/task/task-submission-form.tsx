"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { StatusBadge } from "@/components/ui/status-badge";
import { SidebarEntry, TaskDetail } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function TaskSubmissionForm({
  task,
  onSubmit,
  isSubmitting,
  nextItem
}: {
  task: TaskDetail;
  onSubmit: (submissionLink: string) => Promise<unknown>;
  isSubmitting: boolean;
  nextItem?: SidebarEntry | null;
}) {
  const [submissionLink, setSubmissionLink] = useState(task.currentSubmission?.link ?? "");
  const hasSubmitted = Boolean(task.currentSubmission);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedLink = submissionLink.trim();

    if (!trimmedLink) {
      toast.error("Link submission wajib diisi");
      return;
    }

    try {
      await onSubmit(trimmedLink);
      toast.success("Submission berhasil dikirim");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengirim tugas");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="surface-card p-8">
        <p className="eyebrow">Task detail</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-slate-950">{task.title}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">{task.description}</p>

        <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Checklist submission</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {task.checklist.length === 0 ? (
              <li>Belum ada checklist dari backend untuk tugas ini.</li>
            ) : (
              task.checklist.map((item) => <li key={item}>{item}</li>)
            )}
          </ul>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Link submission</span>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-ocean focus:bg-white"
              disabled={hasSubmitted}
              onChange={(event) => setSubmissionLink(event.target.value)}
              placeholder="https://drive.google.com/..."
              required
              type="url"
              value={submissionLink}
            />
          </label>

          {hasSubmitted && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Tugas sudah dikumpulkan. Status modul sekarang complete.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
              disabled={isSubmitting || hasSubmitted}
              type="submit"
            >
              {hasSubmitted ? "Tugas sudah dikumpulkan" : isSubmitting ? "Mengirim..." : "Kirim tugas"}
            </button>

            {hasSubmitted ? (
              nextItem && !nextItem.isLocked ? (
                <Link
                  className="rounded-2xl bg-brand-ocean px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#496ae8]"
                  href={nextItem.href}
                >
                  Lanjut
                </Link>
              ) : (
                <button
                  className="rounded-2xl bg-brand-ocean px-5 py-3 text-sm font-semibold text-white opacity-60"
                  disabled
                  type="button"
                >
                  Lanjut
                </button>
              )
            ) : null}
          </div>
        </form>
      </section>

      <aside className="space-y-6">
        <section className="surface-card p-6">
          <p className="eyebrow">Deadline</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold">Info pengumpulan</h2>
          <div className="mt-5 space-y-4 text-sm text-slate-600">
            <p>Deadline: {formatDateTime(task.deadline)}</p>
            <p>Revisi: {task.allowRevision ? "Diizinkan" : "Tidak diizinkan"}</p>
          </div>
        </section>

        {task.currentSubmission && (
          <section className="surface-card p-6">
            <p className="eyebrow">Submission saat ini</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="font-heading text-xl font-semibold text-slate-950">Status</p>
              <StatusBadge status={task.currentSubmission.status} />
            </div>
            <p className="mt-4 break-all text-sm text-slate-600">{task.currentSubmission.link}</p>
            <p className="mt-4 text-sm text-slate-500">
              Dikirim pada {formatDateTime(task.currentSubmission.submittedAt)}
            </p>
            {task.currentSubmission.teacherNote && (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                Catatan guru: {task.currentSubmission.teacherNote}
              </div>
            )}
          </section>
        )}
      </aside>
    </div>
  );
}
