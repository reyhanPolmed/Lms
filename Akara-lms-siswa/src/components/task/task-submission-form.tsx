"use client";

import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { LessonPagination } from "@/components/lesson/lesson-pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { SidebarEntry, TaskDetail, TaskSubmitPayload } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

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

function getOriginalityStatusLabel(status?: string) {
  switch (status) {
    case "queued":
      return "Pemeriksaan orisinalitas masuk antrean.";
    case "processing":
      return "Sedang memeriksa orisinalitas dokumen.";
    case "completed":
      return "Pemeriksaan orisinalitas selesai.";
    case "failed":
      return "Pemeriksaan orisinalitas gagal diproses. Guru dapat menjalankan pemeriksaan ulang.";
    default:
      return "Pemeriksaan orisinalitas belum dijalankan untuk submission ini.";
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

function formatFileSize(size?: number | null) {
  if (!size || size <= 0) return null;
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function getFileKindLabel(fileName: string, mimeType: string) {
  const extension = fileName.split(".").pop()?.toUpperCase();
  if (extension) return extension;
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.includes("word")) return "DOCX";
  if (mimeType.startsWith("image/")) return "GAMBAR";
  return "FILE";
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
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [selectedFileSize, setSelectedFileSize] = useState<number | null>(null);
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedFileLabel = submissionFile?.fileName ?? task.currentSubmission?.file?.fileName ?? null;
  const selectedFileMimeType =
    submissionFile?.mimeType ?? task.currentSubmission?.file?.mimeType ?? "application/octet-stream";
  const selectedFileSizeLabel = formatFileSize(selectedFileSize);

  const handleFileSelection = async (file?: File | null) => {
    if (!file) return;

    try {
      const base64Data = await readFileAsBase64(file);
      setSubmissionFile({
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        base64Data,
      });
      setSelectedFileSize(file.size);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "File tidak dapat dibaca");
    }
  };

  const handleFileInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    await handleFileSelection(file);
  };

  const handleFileDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingFile(false);
    if (hasSubmitted) return;
    await handleFileSelection(event.dataTransfer.files?.[0]);
  };

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
          <div className="mt-8 space-y-4 rounded-[24px] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Lampiran soal
                </p>
                <p className="mt-2 font-medium text-slate-900">{task.attachment.fileName}</p>
              </div>
              <Link
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
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

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {requiresLink ? (
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Link submission
              </span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
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
            <div className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                File submission
              </span>
              <div
                className={cn(
                  "mt-3 block overflow-hidden rounded-[28px] border border-slate-200 bg-white",
                  hasSubmitted ? "opacity-80" : "shadow-[0_18px_45px_-42px_rgba(15,23,42,0.28)]"
                )}
                onDragEnter={(event) => {
                  event.preventDefault();
                  if (!hasSubmitted) setIsDraggingFile(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(false);
                }}
                onDrop={handleFileDrop}
              >
                <input
                  ref={fileInputRef}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                  className="sr-only"
                  disabled={hasSubmitted}
                  onChange={handleFileInputChange}
                  required={requiresFile}
                  type="file"
                />
                <div
                  className={cn(
                    "m-5 rounded-[24px] border border-dashed px-6 py-10 text-center transition",
                    isDraggingFile
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-400/70 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.03),transparent_58%)]"
                  )}
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]">
                    <FileText className="h-8 w-8 text-slate-950" strokeWidth={1.8} />
                  </div>
                  <p className="mt-6 text-[28px] font-semibold tracking-[-0.03em] text-slate-950">
                    Tarik dan lepaskan file di sini
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Format yang didukung: PDF, DOC, DOCX, PPT, PPTX, JPG, PNG
                  </p>
                  <button
                    className="mt-6 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={hasSubmitted}
                    onClick={(event) => {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }}
                    type="button"
                  >
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Pilih file
                  </button>
                </div>

                {selectedFileLabel ? (
                  <div className="border-t border-slate-200 px-5 py-4">
                    <p className="text-sm font-medium text-slate-600">File terpilih</p>
                    <div className="mt-4 flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                        <FileText className="h-6 w-6 text-slate-700" strokeWidth={1.8} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-medium text-slate-950">
                          {selectedFileLabel}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <span>{getFileKindLabel(selectedFileLabel, selectedFileMimeType)}</span>
                          {selectedFileSizeLabel ? <span>&bull; {selectedFileSizeLabel}</span> : null}
                          {hasSubmitted ? <span>&bull; tersimpan</span> : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {hasSubmitted && (
            <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Tugas sudah dikumpulkan. Status modul sekarang complete.</span>
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
                className="text-sm font-semibold text-slate-900 hover:underline"
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
          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            <p className="font-semibold text-slate-900">Status pemeriksaan orisinalitas</p>
            <p className="mt-1">
              {getOriginalityStatusLabel(task.currentSubmission.originalityCheck?.status)}
            </p>
          </div>
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
