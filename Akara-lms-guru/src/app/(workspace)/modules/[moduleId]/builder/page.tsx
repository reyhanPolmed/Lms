"use client";

import { BookOpen, ClipboardList, GripVertical, HelpCircle, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { getAuthoredQuizzes } from "@/lib/quiz-authoring";
import { defaultMonitoringQuizzes, mapAuthoredQuizToMonitoringRecord, type MonitoringQuizRecord } from "@/lib/quiz-monitoring-data";

type ChapterItemKind = "Materi" | "Kuis" | "Tugas";

type ChapterItemDetails = {
  contentType?: string;
  contentUrl?: string;
  sourceQuizId?: string;
  sourceQuizTitle?: string;
  sourceQuizModule?: string;
  passScore?: number;
  quizDurationMinutes?: number;
  quizStartAt?: string;
  quizDeadline?: string;
  taskStartAt?: string;
  taskDeadline?: string;
  submitMethod?: string;
};

type ChapterItem = {
  id: string;
  kind: ChapterItemKind;
  title: string;
  description: string;
  details: ChapterItemDetails;
};

type Chapter = {
  id: string;
  title: string;
  summary: string;
  items: ChapterItem[];
};

type DraftMode = "create" | "edit";

type DraftItemForm = {
  mode: DraftMode;
  chapterId: string;
  itemId?: string;
  kind: ChapterItemKind;
  title: string;
  description: string;
  contentType: string;
  contentUrl: string;
  selectedQuizId: string;
  quizStartAt: string;
  quizDeadline: string;
  taskStartAt: string;
  taskDeadline: string;
  submitMethod: string;
};

const CONTENT_TYPE_OPTIONS = ["Link", "PDF"];
const SUBMIT_METHOD_OPTIONS = ["File", "Link", "File + Link", "File + Catatan", "Link + Catatan"];

const initialChapters: Chapter[] = [
  {
    id: "bab-1",
    title: "Bab 1 - Dasar Konsep",
    summary: "Fondasi awal dan orientasi kompetensi.",
    items: [
      {
        id: "item-1",
        kind: "Materi",
        title: "Pengantar Konsep",
        description: "Fondasi istilah utama dan konteks pembelajaran bab.",
        details: {
          contentType: "Text",
        },
      },
      {
        id: "item-2",
        kind: "Kuis",
        title: "Kuis Bab 1: Dasar Konsep",
        description: "Kuis dipilih dari Monitoring Kuis.",
        details: {
          sourceQuizId: "seed-1",
          sourceQuizTitle: "Kuis Bab 1: Dasar Konsep",
          sourceQuizModule: "Matematika Inti",
          passScore: 70,
          quizDurationMinutes: 30,
          quizStartAt: "2026-05-10T08:00",
          quizDeadline: "2026-05-10T20:00",
        },
      },
      {
        id: "item-3",
        kind: "Tugas",
        title: "Ringkasan Bab 1",
        description: "Siswa menulis ringkasan konsep inti dalam 250 kata.",
        details: {
          taskStartAt: "2026-05-10T08:00",
          taskDeadline: "2026-05-15T23:59",
          submitMethod: "File + Catatan",
        },
      },
    ],
  },
  {
    id: "bab-2",
    title: "Bab 2 - Pendalaman",
    summary: "Aplikasi konsep dengan studi kasus.",
    items: [
      {
        id: "item-4",
        kind: "Materi",
        title: "Studi Kasus",
        description: "Membedah kasus nyata untuk latihan analisis konsep.",
        details: {
          contentType: "Video",
        },
      },
      {
        id: "item-5",
        kind: "Tugas",
        title: "Analisis Kasus",
        description: "Unggah analisis kasus dengan rubrik argumentasi.",
        details: {
          taskStartAt: "2026-05-16T07:30",
          taskDeadline: "2026-05-20T21:00",
          submitMethod: "Link + Catatan",
        },
      },
      {
        id: "item-6",
        kind: "Kuis",
        title: "Kuis Bab 2: Studi Kasus",
        description: "Kuis dipilih dari Monitoring Kuis.",
        details: {
          sourceQuizId: "seed-2",
          sourceQuizTitle: "Kuis Bab 2: Studi Kasus",
          sourceQuizModule: "Sains Terapan",
          passScore: 75,
          quizDurationMinutes: 45,
        },
      },
    ],
  },
];

function buildItemId() {
  return `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDateTimeValue(value?: string) {
  if (!value) return "-";
  return value.replace("T", " ");
}

function getItemMeta(item: ChapterItem) {
  if (item.kind === "Materi") {
    return [`Tipe: ${item.details.contentType ?? "-"}`];
  }

  if (item.kind === "Kuis") {
    const meta = [
      `Sumber: ${item.details.sourceQuizModule ?? "-"}`,
      `Pass score: ${item.details.passScore ?? "-"}`,
      `Durasi: ${item.details.quizDurationMinutes ?? "-"} menit`,
    ];

    if (item.details.quizStartAt) {
      meta.push(`Mulai: ${formatDateTimeValue(item.details.quizStartAt)}`);
    }
    if (item.details.quizDeadline) {
      meta.push(`Selesai: ${formatDateTimeValue(item.details.quizDeadline)}`);
    }

    return meta;
  }

  return [
    `Mulai: ${formatDateTimeValue(item.details.taskStartAt)}`,
    `Deadline: ${formatDateTimeValue(item.details.taskDeadline)}`,
    `Metode: ${item.details.submitMethod ?? "-"}`,
  ];
}

function createDraftBase(chapterId: string, kind: ChapterItemKind): DraftItemForm {
  return {
    mode: "create",
    chapterId,
    kind,
    title: "",
    description: "",
    contentType: CONTENT_TYPE_OPTIONS[0],
    contentUrl: "",
    selectedQuizId: "",
    quizStartAt: "",
    quizDeadline: "",
    taskStartAt: "",
    taskDeadline: "",
    submitMethod: SUBMIT_METHOD_OPTIONS[0],
  };
}

function dedupeQuizOptions(rows: MonitoringQuizRecord[]) {
  const map = new Map<string, MonitoringQuizRecord>();
  rows.forEach((row) => map.set(row.id, row));
  return [...map.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function getQuizById(options: MonitoringQuizRecord[], quizId: string) {
  return options.find((item) => item.id === quizId);
}

function validateDraft(draft: DraftItemForm, quizOptions: MonitoringQuizRecord[]) {
  const missing: string[] = [];

  if (draft.kind === "Materi" || draft.kind === "Tugas") {
    if (!draft.title.trim()) missing.push("Judul");
    if (!draft.description.trim()) missing.push("Deskripsi");
  }

  if (draft.kind === "Materi") {
    if (!draft.contentType.trim()) {
      missing.push("Content Type");
    }
    if (!draft.contentUrl.trim()) {
      missing.push(draft.contentType === "Link" ? "URL Tautan" : "File PDF");
    }
  }

  if (draft.kind === "Kuis") {
    if (!draft.selectedQuizId.trim()) {
      missing.push("Pilih Kuis");
    } else if (!getQuizById(quizOptions, draft.selectedQuizId)) {
      return { isValid: false, message: "Kuis yang dipilih tidak ditemukan pada Monitoring Kuis." };
    }
    if (!draft.quizStartAt.trim()) missing.push("Waktu Mulai");
    if (!draft.quizDeadline.trim()) missing.push("Waktu Selesai");

    if (draft.quizStartAt && draft.quizDeadline && draft.quizStartAt >= draft.quizDeadline) {
      return { isValid: false, message: "Waktu selesai kuis harus setelah waktu mulai." };
    }
  }

  if (draft.kind === "Tugas") {
    if (!draft.taskStartAt.trim()) missing.push("Start Tugas");
    if (!draft.taskDeadline.trim()) missing.push("Deadline Tugas");
    if (!draft.submitMethod.trim()) missing.push("Metode Submit");

    if (draft.taskStartAt && draft.taskDeadline && draft.taskStartAt >= draft.taskDeadline) {
      return { isValid: false, message: "Deadline tugas harus setelah waktu mulai tugas." };
    }
  }

  if (missing.length > 0) {
    return { isValid: false, message: `Lengkapi field wajib: ${missing.join(", ")}` };
  }

  return { isValid: true, message: "" };
}

function buildItemFromDraft(draft: DraftItemForm, quizOptions: MonitoringQuizRecord[]): ChapterItem {
  if (draft.kind === "Materi") {
    return {
      id: draft.itemId ?? buildItemId(),
      kind: draft.kind,
      title: draft.title.trim(),
      description: draft.description.trim(),
      details: {
        contentType: draft.contentType,
        contentUrl: draft.contentUrl,
      },
    };
  }

  if (draft.kind === "Kuis") {
    const selectedQuiz = getQuizById(quizOptions, draft.selectedQuizId);

    if (!selectedQuiz) {
      throw new Error("Quiz option not found");
    }

    return {
      id: draft.itemId ?? buildItemId(),
      kind: draft.kind,
      title: selectedQuiz.title,
      description: `Kuis dari Monitoring Kuis: ${selectedQuiz.moduleName}.`,
      details: {
        sourceQuizId: selectedQuiz.id,
        sourceQuizTitle: selectedQuiz.title,
        sourceQuizModule: selectedQuiz.moduleName,
        passScore: selectedQuiz.passScore,
        quizDurationMinutes: selectedQuiz.durationMinutes,
        quizStartAt: draft.quizStartAt,
        quizDeadline: draft.quizDeadline,
      },
    };
  }

  return {
    id: draft.itemId ?? buildItemId(),
    kind: draft.kind,
    title: draft.title.trim(),
    description: draft.description.trim(),
    details: {
      taskStartAt: draft.taskStartAt,
      taskDeadline: draft.taskDeadline,
      submitMethod: draft.submitMethod,
    },
  };
}

export default function ModuleBuilderPage({ params }: { params: { moduleId: string } }) {
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [activeDraft, setActiveDraft] = useState<DraftItemForm | null>(null);
  const [draftError, setDraftError] = useState<string>("");
  const [quizOptions, setQuizOptions] = useState<MonitoringQuizRecord[]>(defaultMonitoringQuizzes);

  useEffect(() => {
    const authored = getAuthoredQuizzes().map(mapAuthoredQuizToMonitoringRecord);
    setQuizOptions(dedupeQuizOptions([...authored, ...defaultMonitoringQuizzes]));
  }, []);

  const nextBabNumber = useMemo(() => chapters.length + 1, [chapters.length]);

  const handleAddChapter = () => {
    setChapters((prev) => [
      ...prev,
      {
        id: `bab-${Date.now()}`,
        title: `Bab ${prev.length + 1} - Bab Baru`,
        summary: "Lengkapi ringkasan pembelajaran untuk bab ini.",
        items: [],
      },
    ]);
  };

  const handleOpenCreate = (chapterId: string, kind: ChapterItemKind) => {
    setDraftError("");
    const base = createDraftBase(chapterId, kind);

    if (kind === "Kuis") {
      setActiveDraft({
        ...base,
        selectedQuizId: quizOptions[0]?.id ?? "",
      });
      return;
    }

    setActiveDraft(base);
  };

  const handleOpenEdit = (chapterId: string, item: ChapterItem) => {
    setDraftError("");
    setActiveDraft({
      mode: "edit",
      chapterId,
      itemId: item.id,
      kind: item.kind,
      title: item.title,
      description: item.description,
      contentType: item.details.contentType ?? CONTENT_TYPE_OPTIONS[0],
      contentUrl: item.details.contentUrl ?? "",
      selectedQuizId: item.details.sourceQuizId ?? "",
      quizStartAt: item.details.quizStartAt ?? "",
      quizDeadline: item.details.quizDeadline ?? "",
      taskStartAt: item.details.taskStartAt ?? "",
      taskDeadline: item.details.taskDeadline ?? "",
      submitMethod: item.details.submitMethod ?? SUBMIT_METHOD_OPTIONS[0],
    });
  };

  const handleDeleteItem = (chapterId: string, itemId: string) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, items: chapter.items.filter((item) => item.id !== itemId) }
          : chapter,
      ),
    );

    if (activeDraft?.itemId === itemId) {
      setActiveDraft(null);
      setDraftError("");
    }
    
    toast.delete("Item berhasil dihapus dari bab");
  };

  const handleDraftChange = (field: keyof DraftItemForm, value: string) => {
    setActiveDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveItem = () => {
    if (!activeDraft) return;

    const validation = validateDraft(activeDraft, quizOptions);
    if (!validation.isValid) {
      setDraftError(validation.message);
      return;
    }

    const nextItem = buildItemFromDraft(activeDraft, quizOptions);

    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.id !== activeDraft.chapterId) return chapter;

        if (activeDraft.mode === "edit" && activeDraft.itemId) {
          return {
            ...chapter,
            items: chapter.items.map((item) => (item.id === activeDraft.itemId ? nextItem : item)),
          };
        }

        return {
          ...chapter,
          items: [...chapter.items, nextItem],
        };
      }),
    );

    setDraftError("");
    setActiveDraft(null);
    toast.success(`Item ${activeDraft.kind} berhasil disimpan`);
  };

  const selectedQuiz = activeDraft?.kind === "Kuis" ? getQuizById(quizOptions, activeDraft.selectedQuizId) : undefined;

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Detail Mata Pelajaran: ${params.moduleId}`}
        description="Mata pelajaran berasal dari admin. Guru dapat menambah Bab, materi, tugas, kuis, lalu mengelola tiap item."
      />

      <section className="grid min-h-0 gap-2 xl:grid-cols-[1.4fr_1fr]">
        <Surface
          title="Outline Bab & Item"
          action={
            <button
              type="button"
              onClick={handleAddChapter}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-dashed border-[#bcb5f4] bg-[#faf7ff] px-2.5 py-1.5 text-[10px] font-semibold text-[#6d5dfc] transition-all hover:bg-[#f0eaff] active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Bab {nextBabNumber}
            </button>
          }
        >
          <div className="space-y-2">
            {chapters.map((chapter) => (
              <article key={chapter.id} className="rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold text-[#2b325b]">{chapter.title}</p>
                    <p className="text-[9.5px] text-[#6f759a]">{chapter.summary}</p>
                  </div>
                  <GripVertical className="h-4 w-4 text-[#8a92ba]" />
                </div>

                <div className="mt-2 space-y-1.5">
                  {chapter.items.length > 0 ? (
                    chapter.items.map((item) => (
                      <article key={item.id} className="rounded-[9px] border border-[rgba(113,94,215,0.1)] bg-[#fbfaff] px-2 py-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[9.5px] font-semibold text-[#515987]">
                              {item.kind}: {item.title}
                            </p>
                            <p className="mt-0.5 text-[9px] text-[#6f759a]">{item.description}</p>
                            <p className="mt-1 text-[8.5px] text-[#7880a7]">{getItemMeta(item).join(" | ")}</p>
                          </div>
                          <div className="flex shrink-0 gap-1 text-[8.5px] font-semibold">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(chapter.id, item)}
                              className="cursor-pointer rounded-[6px] border border-[rgba(113,94,215,0.2)] bg-white px-1.5 py-0.5 text-[#5c6392] transition-all hover:bg-[#faf9ff] active:scale-95"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(chapter.id, item.id)}
                              className="cursor-pointer rounded-[6px] border border-[rgba(233,84,116,0.24)] bg-[#fff5f7] px-1.5 py-0.5 text-[#c54564] transition-all hover:bg-[#ffeef1] active:scale-95"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-[9px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-2 py-1.5 text-[9px] text-[#7b82aa]">
                      Belum ada item. Tambahkan materi, kuis, atau tugas.
                    </p>
                  )}
                </div>

                <div className="mt-2 grid grid-cols-3 gap-1.5 text-[9.5px] font-semibold text-[#6d5dfc]">
                  <button
                    type="button"
                    onClick={() => handleOpenCreate(chapter.id, "Materi")}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-[8px] border border-[rgba(113,94,215,0.18)] bg-white px-2 py-1.5 transition-all hover:bg-[#faf9ff] active:scale-95"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> + Materi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenCreate(chapter.id, "Kuis")}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-[8px] border border-[rgba(113,94,215,0.18)] bg-white px-2 py-1.5 transition-all hover:bg-[#faf9ff] active:scale-95"
                  >
                    <HelpCircle className="h-3.5 w-3.5" /> + Kuis
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenCreate(chapter.id, "Tugas")}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-[8px] border border-[rgba(113,94,215,0.18)] bg-white px-2 py-1.5 transition-all hover:bg-[#faf9ff] active:scale-95"
                  >
                    <ClipboardList className="h-3.5 w-3.5" /> + Tugas
                  </button>
                </div>
              </article>
            ))}
          </div>
        </Surface>

        <div className="grid min-h-0 gap-2">
          {activeDraft ? (
            <Surface title={`${activeDraft.mode === "edit" ? "Edit" : "Input Detail"} ${activeDraft.kind}`}>
              <div className="grid gap-2">
                {activeDraft.kind === "Kuis" ? (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Pilih Kuis dari Monitoring Kuis
                      </span>
                      <select
                        value={activeDraft.selectedQuizId}
                        onChange={(event) => handleDraftChange("selectedQuizId", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                      >
                        <option value="">Pilih kuis</option>
                        {quizOptions.map((quiz) => (
                          <option key={quiz.id} value={quiz.id}>
                            {quiz.title} - {quiz.moduleName}
                          </option>
                        ))}
                      </select>
                    </label>

                    {selectedQuiz ? (
                      <div className="rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-[#faf8ff] p-2.5 text-[9.5px] text-[#5c6392]">
                        <p className="font-semibold text-[#2f355f]">{selectedQuiz.title}</p>
                        <p className="mt-1">Modul: {selectedQuiz.moduleName}</p>
                        <p>Jumlah Soal: {selectedQuiz.questionCount}</p>
                        <p>Pass Score: {selectedQuiz.passScore}</p>
                        <p>Durasi: {selectedQuiz.durationMinutes} menit</p>
                      </div>
                    ) : (
                      <p className="text-[9px] text-[#7e84a8]">Belum ada kuis yang dipilih.</p>
                    )}

                    {selectedQuiz ? (
                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                            Waktu Mulai
                          </span>
                          <input
                            type="datetime-local"
                            value={activeDraft.quizStartAt}
                            onChange={(event) => handleDraftChange("quizStartAt", event.target.value)}
                            className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                            Waktu Selesai (Deadline)
                          </span>
                          <input
                            type="datetime-local"
                            value={activeDraft.quizDeadline}
                            onChange={(event) => handleDraftChange("quizDeadline", event.target.value)}
                            className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                          />
                        </label>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {activeDraft.kind === "Materi" ? (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Judul
                      </span>
                      <input
                        value={activeDraft.title}
                        onChange={(event) => handleDraftChange("title", event.target.value)}
                        placeholder="Contoh judul materi"
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Deskripsi
                      </span>
                      <textarea
                        value={activeDraft.description}
                        onChange={(event) => handleDraftChange("description", event.target.value)}
                        placeholder="Ringkasan singkat untuk guru dan siswa"
                        className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Content Type
                      </span>
                      <select
                        value={activeDraft.contentType}
                        onChange={(event) => handleDraftChange("contentType", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                      >
                        {CONTENT_TYPE_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    {activeDraft.contentType === "Link" ? (
                      <label className="block">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                          URL Tautan
                        </span>
                        <input
                          type="url"
                          value={activeDraft.contentUrl}
                          onChange={(event) => handleDraftChange("contentUrl", event.target.value)}
                          placeholder="https://contoh.com/materi"
                          className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                        />
                      </label>
                    ) : (
                      <label className="block">
                        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                          Unggah File PDF
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) {
                              handleDraftChange("contentUrl", file.name);
                            }
                          }}
                          className="w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 py-1.5 text-[11px] text-[#4f5678] outline-none file:mr-2 file:cursor-pointer file:rounded-[6px] file:border-0 file:bg-[#faf7ff] file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-[#6d5dfc] transition-colors hover:file:bg-[#f0eaff]"
                        />
                        {activeDraft.contentUrl && activeDraft.contentUrl.endsWith('.pdf') ? (
                          <p className="mt-1 text-[9px] text-[#2f8c57]">File terpilih: {activeDraft.contentUrl}</p>
                        ) : null}
                      </label>
                    )}
                  </>
                ) : null}

                {activeDraft.kind === "Tugas" ? (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Judul
                      </span>
                      <input
                        value={activeDraft.title}
                        onChange={(event) => handleDraftChange("title", event.target.value)}
                        placeholder="Contoh judul tugas"
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Deskripsi
                      </span>
                      <textarea
                        value={activeDraft.description}
                        onChange={(event) => handleDraftChange("description", event.target.value)}
                        placeholder="Ringkasan singkat untuk guru dan siswa"
                        className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[11px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Start Tugas
                      </span>
                      <input
                        type="datetime-local"
                        value={activeDraft.taskStartAt}
                        onChange={(event) => handleDraftChange("taskStartAt", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Deadline Tugas
                      </span>
                      <input
                        type="datetime-local"
                        value={activeDraft.taskDeadline}
                        onChange={(event) => handleDraftChange("taskDeadline", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7e84a8]">
                        Metode Submit
                      </span>
                      <select
                        value={activeDraft.submitMethod}
                        onChange={(event) => handleDraftChange("submitMethod", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[11px] text-[#4f5678] outline-none"
                      >
                        {SUBMIT_METHOD_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                ) : null}

                {draftError ? (
                  <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-2 py-1.5 text-[9px] text-[#ba4b64]">
                    {draftError}
                  </p>
                ) : (
                  <p className="text-[9px] text-[#7e84a8]">
                    Isi detail item, lalu simpan ke bab.
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-[10px] font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftError("");
                      setActiveDraft(null);
                    }}
                    className="cursor-pointer rounded-[9px] border border-[rgba(113,94,215,0.2)] bg-white px-2 py-2 text-[#5b6191] transition-all hover:bg-[#faf9ff] active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveItem}
                    className="cursor-pointer rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                    {activeDraft.mode === "edit" ? "Simpan Perubahan" : "Simpan ke Bab"}
                  </button>
                </div>
              </div>
            </Surface>
          ) : (
            <Surface title="Panduan Singkat">
              <div className="rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5 text-[9.5px] text-[#6f759a]">
                <ol className="list-decimal space-y-1 pl-4">
                  <li>Pilih atau tambah Bab terlebih dahulu.</li>
                  <li>Klik + Materi, +Kuis, atau +Tugas pada bab tujuan.</li>
                  <li>Untuk kuis, pilih dari data Monitoring Kuis via dropdown.</li>
                  <li>Item bisa diedit atau dihapus langsung dari outline.</li>
                </ol>
              </div>
            </Surface>
          )}
        </div>
      </section>
    </div>
  );
}
