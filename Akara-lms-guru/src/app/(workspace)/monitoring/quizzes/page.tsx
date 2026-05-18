"use client";

import Link from "next/link";
import { Eye, Plus, SquarePen, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ErrorState } from "@/components/dashboard/error-state";
import { LoadingState } from "@/components/dashboard/loading-state";
import { ActionMenu } from "@/components/shared/action-menu";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { teacherApi, type QuizItem } from "@/lib/api-client";

type EditDraft = {
  id: string;
  title: string;
  moduleName: string;
  passScore: string;
  durationMinutes: string;
  isAktif: boolean;
  questions: {
    id: string;
    pertanyaan: string;
    opsiA: string;
    opsiB: string;
    opsiC: string;
    opsiD: string;
    opsiBenar: "A" | "B" | "C" | "D";
  }[];
};

type OptionKey = "opsiA" | "opsiB" | "opsiC" | "opsiD";
const optionValues = ["A", "B", "C", "D"] as const;

function getOptionKey(option: (typeof optionValues)[number]): OptionKey {
  return `opsi${option}` as OptionKey;
}

export default function QuizMonitoringPage() {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [previewDraft, setPreviewDraft] = useState<QuizItem | null>(null);
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("");

  const loadQuizzes = useCallback(() => {
    teacherApi
      .getQuizBanks()
      .then(setQuizzes)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Gagal memuat data"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  const subjects = useMemo(
    () => Array.from(new Set(quizzes.map((q) => q.moduleName ?? "").filter(Boolean))),
    [quizzes]
  );

  const filtered = useMemo(
    () => (subjectFilter ? quizzes.filter((q) => q.moduleName === subjectFilter) : quizzes),
    [quizzes, subjectFilter]
  );

  const publishedCount = useMemo(() => filtered.filter((q) => q.isActive).length, [filtered]);

  const openEdit = (quiz: QuizItem) => {
    setEditError("");
    setEditDraft({
      id: quiz.id,
      title: quiz.title,
      moduleName: quiz.moduleName ?? "",
      passScore: String(quiz.passScore),
      durationMinutes: String(quiz.durationMinutes ?? ""),
      isAktif: quiz.isActive,
      questions: quiz.questions.map((q) => ({
        id: q.id,
        pertanyaan: q.pertanyaan,
        opsiA: q.opsiA,
        opsiB: q.opsiB,
        opsiC: q.opsiC,
        opsiD: q.opsiD,
        opsiBenar: q.opsiBenar as "A" | "B" | "C" | "D",
      })),
    });
  };

  const removeQuiz = async (quiz: QuizItem) => {
    try {
      await teacherApi.deleteQuiz(quiz.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      if (editDraft?.id === quiz.id) setEditDraft(null);
      toast.delete("Kuis berhasil dihapus");
    } catch (e: unknown) {
      toast.error?.(e instanceof Error ? e.message : "Gagal menghapus kuis");
    }
  };

  const saveEdit = async () => {
    if (!editDraft) return;
    const score = Number(editDraft.passScore);
    const duration = Number(editDraft.durationMinutes);
    if (!editDraft.title.trim()) return setEditError("Judul wajib diisi.");
    if (Number.isNaN(score) || score < 0 || score > 100) return setEditError("Pass score harus 0-100.");
    if (editDraft.durationMinutes && (Number.isNaN(duration) || duration < 1))
      return setEditError("Durasi tidak valid.");

    setSaving(true);
    try {
      const updated = await teacherApi.updateQuiz(editDraft.id, {
        judul: editDraft.title.trim(),
        skorLulus: score,
        durasiMenit: editDraft.durationMinutes ? duration : undefined,
        isAktif: editDraft.isAktif,
        questions: editDraft.questions.map((q) => ({
          pertanyaan: q.pertanyaan,
          opsiA: q.opsiA,
          opsiB: q.opsiB,
          opsiC: q.opsiC,
          opsiD: q.opsiD,
          opsiBenar: q.opsiBenar,
        })),
      });
      setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? { ...updated, moduleName: q.moduleName } : q)));
      setEditDraft(null);
      setEditError("");
      toast.success("Perubahan kuis disimpan");
    } catch (e: unknown) {
      setEditError(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (quiz: QuizItem) => {
    try {
      const updated = await teacherApi.updateQuizStatus(quiz.id, !quiz.isActive);
      setQuizzes((prev) => prev.map((q) => (q.id === updated.id ? { ...updated, moduleName: q.moduleName } : q)));
      toast.success(`Kuis ${updated.isActive ? "dipublish" : "dijadikan draft"}`);
    } catch (e: unknown) {
      toast.error?.(e instanceof Error ? e.message : "Gagal mengubah status");
    }
  };

  return (
    <div className="space-y-5 pb-4">
      <PageHeader
        title="Monitoring Kuis"
        description="Kelola bank kuis per mata pelajaran, pantau status publish, dan siapkan kuis untuk dipakai lintas kelas."
      />

      <Surface
        title="Filter Monitoring"
        action={
          <Button asChild size="sm">
            <Link href="/editor/quiz">
              <AppIcon icon={Plus} size="xs" /> Tambah Kuis
            </Link>
          </Button>
        }
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full max-w-[280px]">
            <MiniSelect
              label="Mata Pelajaran"
              options={subjects}
              placeholder="Semua mapel"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            />
          </div>
          <p className="text-[13px] text-[var(--muted-ink)]">
            Fokuskan daftar ke mapel tertentu agar review lebih cepat.
          </p>
        </div>
      </Surface>

      <Surface
        title="Daftar Kuis"
        description={`${filtered.length} kuis ditampilkan, ${publishedCount} dalam status publikasi.`}
      >
        {loading ? (
          <LoadingState title="Memuat kuis" description="Mengambil bank kuis dan status publikasinya." />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Plus}
            title="Belum ada bank kuis"
            description="Tambah kuis baru agar assessment bisa dipublikasikan ke kelas."
          />
        ) : (
          <div className="table-shell min-h-0 overflow-auto">
            <Table className="min-w-[860px] text-[13px] text-[var(--muted-ink)]">
              <TableHeader className="bg-[var(--surface-subtle)]">
                <TableRow>
                  <TableHead className="w-[28%]">Kuis</TableHead>
                  <TableHead className="w-[22%]">Mata Pelajaran</TableHead>
                  <TableHead className="w-[10%]">Soal</TableHead>
                  <TableHead className="w-[10%]">Pass</TableHead>
                  <TableHead className="w-[12%]">Durasi</TableHead>
                  <TableHead className="w-[10%]">Status</TableHead>
                  <TableHead className="w-[8%] pr-4 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-semibold text-[var(--page-ink)]">
                      <div className="max-w-[260px] text-sm leading-5">{quiz.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[220px] text-sm leading-5">{quiz.moduleName ?? "-"}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{quiz.questionCount}</TableCell>
                    <TableCell className="whitespace-nowrap">{quiz.passScore}</TableCell>
                    <TableCell className="whitespace-nowrap">{quiz.durationMinutes ? `${quiz.durationMinutes} mnt` : "-"}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge status={quiz.isActive ? "published" : "draft"} />
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setPreviewDraft(quiz)}
                          aria-label={`Preview ${quiz.title}`}
                          className="shrink-0"
                        >
                          <AppIcon icon={Eye} size="xs" /> Preview
                        </Button>
                        <ActionMenu
                          ariaLabel={`Buka aksi untuk ${quiz.title}`}
                          items={[
                            {
                              label: "Edit",
                              icon: SquarePen,
                              onSelect: () => openEdit(quiz),
                            },
                            {
                              label: quiz.isActive ? "Jadikan Draft" : "Publish",
                              onSelect: () => {
                                void toggleStatus(quiz);
                              },
                            },
                            {
                              label: "Hapus",
                              icon: Trash2,
                              destructive: true,
                              onSelect: () => {
                                void removeQuiz(quiz);
                              },
                            },
                          ]}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Surface>

      {previewDraft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.42)] p-4 backdrop-blur-sm">
          <div className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_28px_70px_rgba(15,23,42,0.22)]">
            <header className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-subtle)] px-5 py-4">
              <div>
                <h2 className="text-base font-semibold tracking-[-0.03em] text-[var(--page-ink)]">{previewDraft.title}</h2>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">
                  {previewDraft.moduleName} - {previewDraft.durationMinutes ?? "-"} menit
                </p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setPreviewDraft(null)}>
                Tutup
              </Button>
            </header>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                {previewDraft.questions.map((question, index) => (
                  <article key={question.id} className="rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4">
                    <p className="text-sm font-semibold text-[var(--page-ink)]">{index + 1}. {question.pertanyaan}</p>
                    <div className="mt-3 space-y-2">
                      {optionValues.map((option) => (
                        <div
                          key={option}
                          className={
                            option === question.opsiBenar
                              ? "rounded-[12px] border border-[rgba(34,197,94,0.18)] bg-[var(--success-soft)] p-2.5 text-sm font-semibold text-[var(--success)]"
                              : "rounded-[12px] border border-[var(--line)] bg-[var(--surface-subtle)] p-2.5 text-sm text-[var(--muted-ink)]"
                          }
                        >
                          {option}. {question[getOptionKey(option)]}
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {editDraft ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.42)] p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--surface)] shadow-[0_28px_70px_rgba(15,23,42,0.22)]">
            <header className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <div>
                <h2 className="text-base font-semibold tracking-[-0.03em] text-[var(--page-ink)]">Edit Kuis</h2>
                <p className="mt-1 text-sm text-[var(--muted-ink)]">Ubah detail dan daftar soal kuis.</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => { setEditDraft(null); setEditError(""); }}>
                Tutup
              </Button>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: "Judul Kuis", key: "title", type: "text" },
                  { label: "Pass Score", key: "passScore", type: "number" },
                  { label: "Durasi (Menit)", key: "durationMinutes", type: "number" },
                ].map(({ label, key, type }) => (
                  <label key={key} className="block">
                    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">{label}</span>
                    <input
                      type={type}
                      value={editDraft[key as keyof EditDraft] as string}
                      onChange={(e) => setEditDraft((prev) => prev ? { ...prev, [key]: e.target.value } : prev)}
                      className="control-surface h-10 w-full px-3 text-sm"
                    />
                  </label>
                ))}
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">Status</span>
                  <select
                    value={editDraft.isAktif ? "published" : "draft"}
                    onChange={(e) => setEditDraft((prev) => prev ? { ...prev, isAktif: e.target.value === "published" } : prev)}
                    className="control-surface h-10 w-full px-3 text-sm"
                  >
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                  </select>
                </label>
              </div>

              <div className="space-y-3">
                <p className="border-b border-[var(--line)] pb-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-ink)]">Daftar Soal</p>
                {editDraft.questions.map((question, index) => (
                  <article key={question.id} className="rounded-[16px] border border-[var(--line)] bg-[var(--surface-subtle)] p-4">
                    <p className="mb-2 text-sm font-semibold text-[var(--page-ink)]">Soal {index + 1}</p>
                    <textarea
                      value={question.pertanyaan}
                      onChange={(e) => setEditDraft((prev) => {
                        if (!prev) return prev;
                        return { ...prev, questions: prev.questions.map((item) => item.id === question.id ? { ...item, pertanyaan: e.target.value } : item) };
                      })}
                      className="control-surface h-20 w-full p-3 text-sm"
                    />
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {optionValues.map((option) => (
                        <div key={option} className="flex items-center gap-2">
                          <input
                            value={question[getOptionKey(option)]}
                            onChange={(e) => setEditDraft((prev) => {
                              if (!prev) return prev;
                              return {
                                ...prev,
                                questions: prev.questions.map((item) =>
                                  item.id === question.id ? { ...item, [getOptionKey(option)]: e.target.value } : item
                                ),
                              };
                            })}
                            placeholder={`Opsi ${option}`}
                            className="control-surface h-9 min-w-0 flex-1 px-3 text-sm"
                          />
                          <Button
                            type="button"
                            variant={question.opsiBenar === option ? "outline" : "secondary"}
                            size="sm"
                            onClick={() => setEditDraft((prev) => prev ? { ...prev, questions: prev.questions.map((item) => item.id === question.id ? { ...item, opsiBenar: option } : item) } : prev)}
                          >
                            {option}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              {editError ? <ErrorState message={editError} /> : null}
            </div>

            <footer className="border-t border-[var(--line)] bg-[var(--surface-subtle)] px-5 py-4">
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => { setEditDraft(null); setEditError(""); }}>
                  Batal
                </Button>
                <Button type="button" onClick={saveEdit} disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </div>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
