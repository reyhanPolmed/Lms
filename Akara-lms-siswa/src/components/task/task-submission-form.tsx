"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { LessonPagination } from "@/components/lesson/lesson-pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { SidebarEntry, TaskDetail, TaskSubmitPayload } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

function isPdfAttachment(mimeType: string, url: string) {
  return mimeType === "application/pdf" || url.toLowerCase().endsWith(".pdf");
}

function isImageAttachment(mimeType: string) {
  return mimeType.startsWith("image/");
}

function getSubmitMethodLabel(method?: TaskDetail["submitMethod"]) {
  switch (method) {
    case "file":
      return "File";
    case "file_link":
      return "File + Link";
    case "link":
    default:
      return "Link";
  }
}

function readFileAsBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("File tidak dapat dibaca"));
        return;
      }

      const [, base64Data = ""] = result.split(",", 2);
      resolve(base64Data);
    };
    reader.onerror = () => reject(new Error("File tidak dapat dibaca"));
    reader.readAsDataURL(file);
  });
}

export function TaskSubmissionForm({
  task,
  onSubmit,
  isSubmitting,
  previousItem,
  nextItem
}: {
  task: TaskDetail;
  onSubmit: (payload: TaskSubmitPayload) => Promise<unknown>;
  isSubmitting: boolean;
  previousItem?: SidebarEntry | null;
  nextItem?: SidebarEntry | null;
}) {
  const submitMethod = task.submitMethod ?? "link";
  const requiresLink = submitMethod === "link" || submitMethod === "file_link";
  const requiresFile = submitMethod === "file" || submitMethod === "file_link";
  const [submissionLink, setSubmissionLink] = useState(
    task.currentSubmission?.link ?? "",
  );
  const [submissionFile, setSubmissionFile] = useState<TaskSubmitPayload["submissionFile"]>(
    task.currentSubmission?.file
      ? {
          fileName: task.currentSubmission.file.fileName,
          mimeType: task.currentSubmission.file.mimeType,
          base64Data: "",
        }
      : undefined,
  );
  const hasSubmitted = Boolean(task.currentSubmission);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedLink = submissionLink.trim();

    if (requiresLink && !trimmedLink) {
      toast.error("Link submission wajib diisi");
      return;
    }
    if (requiresFile && !submissionFile) {
      toast.error("File submission wajib diunggah");
      return;
    }

    try {
      await onSubmit({
        submissionLink: trimmedLink || undefined,
        submissionFile,
      });
      toast.success("Submission berhasil dikirim");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengirim tugas",
      );
    }
  };

  return (
    <div className="space-y-6">
      <section className="surface-card p-6">
        <p className="eyebrow">Deadline</p>
        <h2 className="mt-2 font-heading text-2xl font-semibold">
          Info pengumpulan
        </h2>
        <div className="mt-5 space-y-4 text-sm text-slate-600">
          <p>Deadline: {formatDateTime(task.dueAt)}</p>
          <p>Revisi: {task.allowRevision ? "Diizinkan" : "Tidak diizinkan"}</p>
          <p>Metode submit: {getSubmitMethodLabel(submitMethod)}</p>
        </div>
      </section>
      <section className="surface-card p-8">
        <p className="eyebrow">Task detail</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold text-slate-950">
          {task.title}
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          {task.description}
        </p>

        {task.attachment ? (
          <div className="mt-8 space-y-4 rounded-[28px] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Lampiran soal
                </p>
                <p className="mt-2 font-medium text-slate-900">{task.attachment.fileName}</p>
              </div>
              <Link
                className="rounded-full border border-brand-ocean/15 bg-brand-ocean/5 px-4 py-2 text-sm font-semibold text-brand-ocean transition hover:bg-brand-ocean/10"
                href={task.attachment.url}
                rel="noreferrer"
                target="_blank"
              >
                Buka file
              </Link>
            </div>

            {isPdfAttachment(task.attachment.mimeType, task.attachment.url) ? (
              <iframe
                className="h-[720px] w-full rounded-2xl border border-slate-200 bg-white"
                src={task.attachment.url}
                title={task.attachment.fileName}
              />
            ) : isImageAttachment(task.attachment.mimeType) ? (
              <img
                alt={task.attachment.fileName}
                className="max-h-[720px] w-full rounded-2xl border border-slate-200 object-contain bg-slate-50"
                src={task.attachment.url}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                File soal tersedia untuk diunduh. Gunakan tombol <span className="font-semibold">Buka file</span> untuk melihat dokumen.
              </div>
            )}
          </div>
        ) : null}

        <div className="mt-8 rounded-[28px] bg-slate-50 p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Checklist submission
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {task.checklist.length === 0 ? (
              <li>Belum ada checklist dari backend untuk tugas ini.</li>
            ) : (
              task.checklist.map((item) => <li key={item}>{item}</li>)
            )}
          </ul>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {requiresLink ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Link submission
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-ocean focus:bg-white"
                disabled={hasSubmitted}
                onChange={(event) => setSubmissionLink(event.target.value)}
                placeholder="https://drive.google.com/..."
                required={requiresLink}
                type="url"
                value={submissionLink}
              />
            </label>
          ) : null}

          {requiresFile ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                File submission
              </span>
              <input
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-brand-ocean/8 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-ocean"
                disabled={hasSubmitted}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  try {
                    const base64Data = await readFileAsBase64(file);
                    setSubmissionFile({
                      fileName: file.name,
                      mimeType: file.type || "application/octet-stream",
                      base64Data,
                    });
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "File tidak dapat dibaca");
                  }
                }}
                required={requiresFile}
                type="file"
              />
              {submissionFile?.fileName ? (
                <p className="mt-2 text-sm text-slate-600">
                  File terpilih: {submissionFile.fileName}
                </p>
              ) : null}
            </label>
          ) : null}

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
              {hasSubmitted
                ? "Tugas sudah dikumpulkan"
                : isSubmitting
                  ? "Mengirim..."
                  : "Kirim tugas"}
            </button>
          </div>
        </form>
      </section>

      {task.currentSubmission && (
        <section className="surface-card p-6">
          <p className="eyebrow">Submission saat ini</p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="font-heading text-xl font-semibold text-slate-950">
              Status
            </p>
            <StatusBadge status={task.currentSubmission.status} />
          </div>
          {task.currentSubmission.link ? (
            <p className="mt-4 break-all text-sm text-slate-600">
              {task.currentSubmission.link}
            </p>
          ) : null}
          {task.currentSubmission.file ? (
            <div className="mt-4">
              <Link
                className="text-sm font-semibold text-brand-ocean hover:underline"
                href={task.currentSubmission.file.url}
                rel="noreferrer"
                target="_blank"
              >
                Buka file submission: {task.currentSubmission.file.fileName}
              </Link>
            </div>
          ) : null}
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

      <LessonPagination nextItem={nextItem} previousItem={previousItem} />
    </div>
  );
}
