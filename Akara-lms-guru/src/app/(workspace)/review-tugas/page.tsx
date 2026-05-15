"use client";

import { ArrowLeftRight, FileText, Download, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Badge, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { useState, useMemo, useEffect, useCallback } from "react";
import { teacherApi, type TaskSubmissionSummary, type TaskSubmissionDetail, type ModuleSummary } from "@/lib/api-client";

export default function TaskReviewsPage() {
  const { toast } = useToast();

  // State: module list for filter
  const [modules, setModules] = useState<ModuleSummary[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState("");

  // Submissions list
  const [submissions, setSubmissions] = useState<TaskSubmissionSummary[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  // Detail
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<TaskSubmissionDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Local grading state (independent from server state)
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  // Filters
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");

  useEffect(() => {
    teacherApi.getModules().then(setModules).catch(() => {});
  }, []);

  // When module changes, clear & reload submissions
  const loadSubmissions = useCallback((moduleId: string) => {
    if (!moduleId) return;
    // We need a task ID. Since we don't have direct "all task submissions for module",
    // We load via the module's tasks. For now use the module's first task.
    // In a real scenario we'd fetch the module detail to get task IDs.
    setLoadingList(true);
    setSubmissions([]);
    setSelectedId(null);
    setDetail(null);
  }, []);

  useEffect(() => {
    loadSubmissions(selectedModuleId);
  }, [selectedModuleId, loadSubmissions]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      if (classFilter && s.className !== classFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      return true;
    });
  }, [submissions, classFilter, statusFilter]);

  // When selected changes, load detail
  useEffect(() => {
    if (!selectedId) { setDetail(null); return; }
    setLoadingDetail(true);
    teacherApi
      .getTaskSubmissionDetail(selectedId)
      .then((d) => {
        setDetail(d);
        // Init rubric scores
        const init: Record<string, number> = {};
        d.rubrics.forEach((r) => { if (r.score !== null) init[r.id] = r.score; });
        setRubricScores(init);
        setFeedback(d.teacherFeedback ?? "");
      })
      .catch(() => {})
      .finally(() => setLoadingDetail(false));
  }, [selectedId]);

  // Auto-select first when list changes
  useEffect(() => {
    if (filteredSubmissions.length > 0 && !filteredSubmissions.find(s => s.id === selectedId)) {
      setSelectedId(filteredSubmissions[0]!.id);
    }
  }, [filteredSubmissions, selectedId]);

  const computedScore = useMemo(() => {
    if (!detail) return null;
    const totalGiven = Object.values(rubricScores).reduce((a, b) => a + (b || 0), 0);
    const totalMax = detail.rubrics.reduce((a, r) => a + r.maxScore, 0);
    return totalMax > 0 ? Math.round((totalGiven / totalMax) * 100) : null;
  }, [detail, rubricScores]);

  const handleAction = async (action: "draft" | "revision" | "publish") => {
    if (!selectedId || !detail) return;
    setSaving(true);
    try {
      const updated = await teacherApi.gradeTaskSubmission(selectedId, {
        rubricScores: detail.rubrics.map((r) => ({
          rubricId: r.id,
          score: rubricScores[r.id] ?? 0,
        })),
        teacherFeedback: feedback,
        action,
      });
      // Refresh detail
      setDetail(updated);
      // Update list
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === selectedId ? { ...s, status: updated.status, score: updated.score } : s
        )
      );
      if (action === "draft") toast.success("Draft penilaian disimpan");
      if (action === "revision") toast.success("Permintaan revisi dikirim ke siswa");
      if (action === "publish") toast.success("Nilai tugas di-publish ke siswa");
    } catch (e: unknown) {
      toast.error?.(e instanceof Error ? e.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const classes = useMemo(() => Array.from(new Set(submissions.map((s) => s.className))), [submissions]);
  const statuses = useMemo(() => Array.from(new Set(submissions.map((s) => s.status))), [submissions]);

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Review Tugas Siswa"
        description="Pilih mata pelajaran dan tugas untuk memeriksa file submission, memberi nilai berdasarkan rubrik, dan memberikan feedback."
      />

      <Surface title="Filter Konteks Tugas">
        <div className="grid gap-2 md:grid-cols-4">
          <div>
            <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#7e84a8]">
              Mata Pelajaran
            </span>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
            >
              <option value="">— Pilih Mata Pelajaran —</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>{m.title} ({m.gradeLevel})</option>
              ))}
            </select>
          </div>
          <MiniSelect
            label="Kelas"
            options={classes}
            placeholder="Pilih Kelas"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
          />
          <MiniSelect
            label="Status Review"
            options={statuses}
            placeholder="Semua Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </Surface>

      <section className="grid min-h-0 gap-2 xl:grid-cols-[0.8fr_1.2fr]">
        {/* Queue list */}
        <Surface title="Daftar Antrean Tugas">
          <div className="flex-1 min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            {!selectedModuleId ? (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <p className="text-[10px] text-[#7e84a8]">Pilih mata pelajaran untuk melihat submission.</p>
              </div>
            ) : loadingList ? (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-[10px] text-[#7e84a8]">Memuat submission...</p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="flex h-full items-center justify-center p-4 text-center">
                <p className="text-[10px] text-[#7e84a8]">Tidak ada tugas yang perlu direview.</p>
              </div>
            ) : (
              filteredSubmissions.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedId(row.id)}
                  className={`flex w-full cursor-pointer items-start justify-between border-b px-3 py-2.5 text-left transition-all active:scale-[0.99] last:border-b-0 ${
                    selectedId === row.id
                      ? "border-[rgba(113,94,215,0.4)] bg-[#f0edff]"
                      : "border-[rgba(113,94,215,0.1)] hover:bg-[#faf9ff]"
                  }`}
                >
                  <span>
                    <span className="block text-[11px] font-semibold text-[#4e5378]">{row.studentName}</span>
                    <span className="block text-[10px] text-[#6f759a]">Kelas {row.className}</span>
                    <span className="block text-[9px] text-[#7e84a8]">
                      {row.submittedAt ? new Date(row.submittedAt).toLocaleDateString("id-ID") : "—"}
                    </span>
                  </span>
                  <div className="flex flex-col items-end gap-1">
                    <Badge status={row.status} />
                    {row.score !== null && (
                      <span className="block text-[11px] font-bold text-[#4e5378]">Skor: {row.score}</span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </Surface>

        {/* Detail */}
        <Surface title="Detail Submission Tugas">
          {loadingDetail ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-[10px] text-[#7e84a8]">Memuat detail...</p>
            </div>
          ) : !detail ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FileText className="mx-auto h-8 w-8 text-[#d1d5db] mb-2" />
              <p className="text-[11px] text-[#6f759a]">Pilih submission tugas untuk melihat detail.</p>
            </div>
          ) : (
            <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
              {/* Header */}
              <div className="mb-2 shrink-0 rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-3 flex justify-between items-start">
                <div>
                  <p className="text-[12px] font-bold text-[#2b325b]">{detail.studentName}</p>
                  <p className="text-[10px] text-[#6f759a]">{detail.courseTitle} • Kelas {detail.className}</p>
                  {detail.teacherNote && (
                    <div className="mt-2 rounded-[8px] bg-[#f8f9fc] p-2 border border-[#e2e6f3]">
                      <span className="block text-[9px] font-semibold uppercase text-[#7e84a8] mb-0.5">Catatan Siswa:</span>
                      <p className="text-[10px] text-[#4e5378] italic">"{detail.teacherNote}"</p>
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-[10px] text-[#7e84a8] uppercase tracking-wider font-semibold mb-0.5">Total Skor</p>
                  <p className="text-[20px] font-black text-[#715ed7] leading-none">
                    {computedScore !== null ? computedScore : "—"}
                    <span className="text-[12px] text-[#a5aecf]">/100</span>
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-3">
                {/* Submission Link */}
                <div className="rounded-[10px] border border-[rgba(113,94,215,0.1)] bg-[#faf9ff] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b4aab] mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Link Submission
                  </p>
                  {detail.submissionLink ? (
                    <div className="flex items-center justify-between rounded-[8px] border border-[rgba(113,94,215,0.12)] bg-white p-2">
                      <p className="text-[10px] text-[#4e5378] truncate">{detail.submissionLink}</p>
                      <div className="flex gap-1">
                        <a
                          href={detail.submissionLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#6f759a] hover:bg-[#f0edff] hover:text-[#715ed7] transition-colors"
                          title="Buka Link"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#7e84a8] italic">Tidak ada link submission.</p>
                  )}
                </div>

                {/* Rubric Grading */}
                {detail.rubrics.length > 0 && (
                  <div className="rounded-[10px] border border-[rgba(113,94,215,0.1)] bg-[#faf9ff] p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b4aab] mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Penilaian Rubrik
                    </p>
                    <div className="space-y-2">
                      {detail.rubrics.map((rubric) => (
                        <div key={rubric.id} className="grid grid-cols-[1fr_auto] gap-3 items-center rounded-[8px] border border-[rgba(113,94,215,0.08)] bg-white p-2.5">
                          <p className="text-[11px] font-semibold text-[#4e5378]">{rubric.name}</p>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min={0}
                              max={rubric.maxScore}
                              value={rubricScores[rubric.id] ?? ""}
                              onChange={(e) =>
                                setRubricScores((prev) => ({
                                  ...prev,
                                  [rubric.id]: Math.min(rubric.maxScore, Math.max(0, Number(e.target.value))),
                                }))
                              }
                              className="w-14 rounded-[6px] border border-[rgba(113,94,215,0.15)] bg-[#faf9ff] px-2 py-1 text-[11px] text-center font-bold text-[#4e5378] outline-none focus:border-[#715ed7]"
                              placeholder="0"
                            />
                            <span className="text-[10px] text-[#a5aecf] font-semibold">/ {rubric.maxScore}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                <label className="block rounded-[10px] border border-[rgba(113,94,215,0.1)] bg-[#faf9ff] p-3">
                  <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5b4aab]">
                    <AlertCircle className="w-3.5 h-3.5" /> Feedback Guru
                  </span>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="h-20 w-full resize-none rounded-[8px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5 text-[11px] text-[#4f5678] outline-none focus:border-[#715ed7]"
                    placeholder="Berikan catatan, masukan, atau alasan mengapa siswa perlu melakukan revisi..."
                  />
                </label>
              </div>

              {/* Actions */}
              <div className="mt-3 shrink-0 rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAction("draft")}
                      disabled={saving}
                      className="cursor-pointer rounded-[8px] border border-[#bdb6f6] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#5b6191] transition-all hover:bg-[#f0edff] active:scale-95 disabled:opacity-50"
                    >
                      Simpan Draft
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction("revision")}
                      disabled={saving}
                      className="cursor-pointer rounded-[8px] border border-[#f0b16b] bg-[#fff8ef] px-3 py-1.5 text-[10px] font-semibold text-[#c1782c] transition-all hover:bg-[#fdf0e0] active:scale-95 disabled:opacity-50"
                    >
                      Minta Revisi
                    </button>
                    <button
                      onClick={() => handleAction("publish")}
                      disabled={saving}
                      className="cursor-pointer rounded-[8px] bg-gradient-to-r from-[#56bf7a] to-[#36a662] px-4 py-1.5 text-[10px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm disabled:opacity-50"
                    >
                      {saving ? "Menyimpan..." : "Publish Nilai"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Surface>
      </section>
    </div>
  );
}
