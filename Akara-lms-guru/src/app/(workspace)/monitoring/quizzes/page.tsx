"use client";

import Link from "next/link";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Badge, MiniInput, PageHeader, Surface } from "@/components/workspace/ui";
import { deleteAuthoredQuiz, getAuthoredQuizzes, upsertAuthoredQuiz } from "@/lib/quiz-authoring";
import { defaultMonitoringQuizzes, mapAuthoredQuizToMonitoringRecord, type MonitoringQuizRecord } from "@/lib/quiz-monitoring-data";
import { quizMonitoring } from "@/lib/teacher-mocks";

type MonitoringQuizRow = MonitoringQuizRecord & {
  source: "authored" | "seeded";
};

type EditDraft = {
  id: string;
  source: "authored" | "seeded";
  title: string;
  moduleName: string;
  className: string;
  passScore: string;
  durationMinutes: string;
  deadline: string;
  status: "draft" | "published";
};

function formatDateTime(value?: string) {
  if (!value) return "-";
  return value.replace("T", " ");
}

export default function QuizMonitoringPage() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<MonitoringQuizRow[]>([]);
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const authoredRows = getAuthoredQuizzes().map((item) => ({
      ...mapAuthoredQuizToMonitoringRecord(item),
      source: "authored" as const,
    }));
    const seededRows = defaultMonitoringQuizzes.map((item) => ({ ...item, source: "seeded" as const }));
    setRows([...authoredRows, ...seededRows].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
  }, []);

  const created = searchParams.get("created") === "1";

  const rowCount = rows.length;
  const publishedCount = useMemo(() => rows.filter((row) => row.status === "published").length, [rows]);

  const openEdit = (row: MonitoringQuizRow) => {
    setEditError("");
    setEditDraft({
      id: row.id,
      source: row.source,
      title: row.title,
      moduleName: row.moduleName,
      className: row.className,
      passScore: String(row.passScore),
      durationMinutes: String(row.durationMinutes),
      deadline: row.deadline ?? "",
      status: row.status,
    });
  };

  const removeRow = (row: MonitoringQuizRow) => {
    setRows((prev) => prev.filter((item) => item.id !== row.id));

    if (row.source === "authored") {
      deleteAuthoredQuiz(row.id);
    }

    if (editDraft?.id === row.id) {
      setEditDraft(null);
      setEditError("");
    }
  };

  const saveEdit = () => {
    if (!editDraft) return;

    if (!editDraft.title.trim() || !editDraft.moduleName.trim() || !editDraft.className.trim()) {
      setEditError("Judul, modul, dan kelas wajib diisi.");
      return;
    }

    const score = Number(editDraft.passScore);
    if (Number.isNaN(score) || score < 0 || score > 100) {
      setEditError("Pass score harus angka 0-100.");
      return;
    }

    const duration = Number(editDraft.durationMinutes);
    if (Number.isNaN(duration) || duration < 20 || duration > 90) {
      setEditError("Durasi kuis harus antara 20 sampai 90 menit.");
      return;
    }

    const updatedAt = new Date().toISOString();

    setRows((prev) =>
      prev
        .map((row) =>
          row.id === editDraft.id
            ? {
                ...row,
                title: editDraft.title.trim(),
                moduleName: editDraft.moduleName.trim(),
                className: editDraft.className.trim(),
                passScore: score,
                durationMinutes: duration,
                deadline: editDraft.deadline || undefined,
                status: editDraft.status,
                updatedAt,
              }
            : row,
        )
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    );

    if (editDraft.source === "authored") {
      const authoredList = getAuthoredQuizzes();
      const target = authoredList.find((item) => item.id === editDraft.id);

      if (target) {
        upsertAuthoredQuiz({
          ...target,
          title: editDraft.title.trim(),
          moduleName: editDraft.moduleName.trim(),
          className: editDraft.className.trim(),
          passScore: score,
          durationMinutes: duration,
          deadline: editDraft.deadline || undefined,
          status: editDraft.status,
          updatedAt,
        });
      }
    }

    setEditError("");
    setEditDraft(null);
  };

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Monitoring Kuis"
        description="Kelola kuis aktif, pantau status publish, dan lihat hasil authoring terbaru."
      />

      <Surface
        title="Filter Monitoring"
        action={
          <Link
            href="/editor/quiz"
            className="inline-flex items-center gap-1.5 rounded-[10px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-3 py-1.5 text-[10px] font-semibold text-white"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Kuis
          </Link>
        }
      >
        <div className="grid gap-2 md:grid-cols-4">
          <MiniInput label="Kelas" placeholder="Pilih kelas" />
          <MiniInput label="Modul" placeholder="Pilih modul" />
          <MiniInput label="Kuis" placeholder="Pilih kuis" />
          <MiniInput label="Status Attempt" placeholder="belum mulai / submit / lulus / tidak lulus" />
        </div>
      </Surface>

      <section className="grid grid-cols-5 gap-2">
        {quizMonitoring.map((item) => (
          <article key={item.label} className="panel-surface rounded-[14px] bg-white px-3 py-2.5">
            <p className="text-[10px] text-[#6f759a]">{item.label}</p>
            <p className="mt-1 text-[20px] font-semibold text-[#2c315b]">{item.value}</p>
          </article>
        ))}
      </section>

      <Surface title={`Daftar Kuis Monitoring (${rowCount} kuis, ${publishedCount} published)`}>
        <div className="space-y-2">
          {created ? (
            <p className="rounded-[10px] border border-[#cfe9d9] bg-[#eefaf3] px-3 py-2 text-[10px] text-[#2f8c57]">
              Kuis berhasil ditambahkan dan langsung tampil di daftar monitoring.
            </p>
          ) : null}

          {editDraft ? (
            <div className="rounded-[12px] border border-[rgba(113,94,215,0.16)] bg-[#fbfaff] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7e84a8]">Edit Kuis</p>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                <input
                  value={editDraft.title}
                  onChange={(event) => setEditDraft((prev) => (prev ? { ...prev, title: event.target.value } : prev))}
                  placeholder="Judul kuis"
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
                <input
                  value={editDraft.moduleName}
                  onChange={(event) => setEditDraft((prev) => (prev ? { ...prev, moduleName: event.target.value } : prev))}
                  placeholder="Modul"
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
                <input
                  value={editDraft.className}
                  onChange={(event) => setEditDraft((prev) => (prev ? { ...prev, className: event.target.value } : prev))}
                  placeholder="Kelas"
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editDraft.passScore}
                  onChange={(event) => setEditDraft((prev) => (prev ? { ...prev, passScore: event.target.value } : prev))}
                  placeholder="Pass score"
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
                <input
                  type="number"
                  min={20}
                  max={90}
                  value={editDraft.durationMinutes}
                  onChange={(event) =>
                    setEditDraft((prev) => (prev ? { ...prev, durationMinutes: event.target.value } : prev))
                  }
                  placeholder="Durasi menit"
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
                <input
                  type="datetime-local"
                  value={editDraft.deadline}
                  onChange={(event) => setEditDraft((prev) => (prev ? { ...prev, deadline: event.target.value } : prev))}
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                />
                <select
                  value={editDraft.status}
                  onChange={(event) =>
                    setEditDraft((prev) =>
                      prev ? { ...prev, status: event.target.value as "draft" | "published" } : prev,
                    )
                  }
                  className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </div>

              {editError ? <p className="mt-2 text-[9px] text-[#c54564]">{editError}</p> : null}

              <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setEditDraft(null);
                    setEditError("");
                  }}
                  className="rounded-[9px] border border-[rgba(113,94,215,0.2)] bg-white px-2 py-2 text-[#5b6191]"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={saveEdit}
                  className="rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          ) : null}

          <div className="min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            <table className="w-full text-left text-[10px] text-[#7e84a8]">
              <thead className="bg-[#faf8ff] text-[8.5px] uppercase tracking-[0.16em] text-[#60658e]">
                <tr>
                  <th className="px-3 py-2">Kuis</th>
                  <th className="px-2 py-2">Modul</th>
                  <th className="px-2 py-2">Kelas</th>
                  <th className="px-2 py-2">Soal</th>
                  <th className="px-2 py-2">Pass</th>
                  <th className="px-2 py-2">Durasi</th>
                  <th className="px-2 py-2">Deadline</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(113,94,215,0.1)]">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-3 py-2.5 font-semibold text-[#4e5378]">{row.title}</td>
                    <td className="px-2 py-2.5">{row.moduleName}</td>
                    <td className="px-2 py-2.5">{row.className}</td>
                    <td className="px-2 py-2.5">{row.questionCount}</td>
                    <td className="px-2 py-2.5">{row.passScore}</td>
                    <td className="px-2 py-2.5">{row.durationMinutes} menit</td>
                    <td className="px-2 py-2.5">{formatDateTime(row.deadline)}</td>
                    <td className="px-2 py-2.5">
                      <Badge status={row.status} />
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="inline-flex items-center gap-1 rounded-[7px] border border-[rgba(113,94,215,0.2)] bg-white px-2 py-1 text-[9px] text-[#5b6191]"
                        >
                          <SquarePen className="h-3 w-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRow(row)}
                          className="inline-flex items-center gap-1 rounded-[7px] border border-[rgba(233,84,116,0.24)] bg-[#fff5f7] px-2 py-1 text-[9px] text-[#c54564]"
                        >
                          <Trash2 className="h-3 w-3" /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Surface>
    </div>
  );
}
