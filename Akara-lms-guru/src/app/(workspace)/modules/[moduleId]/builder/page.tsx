"use client";

import { BookOpen, ClipboardList, GripVertical, HelpCircle, Plus } from "lucide-react";
import { use, useEffect, useMemo, useState, useCallback } from "react";
import { PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { teacherApi } from "@/lib/api-client";

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
  questionFile?: string;
  questionFileUrl?: string;
  questionFileMimeType?: string;
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

type DraftChapterForm = {
  mode: DraftMode;
  chapterId: string;
  title: string;
  summary: string;
};

type DraftItemForm = {
  mode: DraftMode;
  chapterId: string;
  itemId?: string;
  kind: ChapterItemKind;
  title: string;
  description: string;
  contentType: string;
  contentUrl: string;
  contentFileData?: string;
  contentFileMimeType?: string;
  selectedQuizId: string;
  quizStartAt: string;
  quizDeadline: string;
  taskStartAt: string;
  taskDeadline: string;
  submitMethod: string;
  questionFile: string;
  questionFileData?: string;
  questionFileMimeType?: string;
};

type MonitoringQuizRecord = {
  id: string;
  title: string;
  moduleName: string;
  questionCount: number;
  passScore: number;
  durationMinutes: number;
  updatedAt: string;
};

function getItemRank(value: number | null | undefined, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return value;
}

const CONTENT_TYPE_OPTIONS = ["Link", "PDF"];
const SUBMIT_METHOD_OPTIONS = ["File + Link", "File", "Link"];
const SUBMIT_METHOD_LABEL_TO_VALUE = {
  "File + Link": "file_link",
  File: "file",
  Link: "link",
} as const;
const SUBMIT_METHOD_VALUE_TO_LABEL = {
  file_link: "File + Link",
  file: "File",
  link: "Link",
} as const;

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

function getChapterItemKey(item: ChapterItem) {
  return `${item.kind}:${item.id}`;
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
    contentFileData: undefined,
    contentFileMimeType: undefined,
    selectedQuizId: "",
    quizStartAt: "",
    quizDeadline: "",
    taskStartAt: "",
    taskDeadline: "",
    submitMethod: SUBMIT_METHOD_OPTIONS[0],
    questionFile: "",
    questionFileData: undefined,
    questionFileMimeType: undefined,
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

function getSubmitMethodValue(label: string) {
  return SUBMIT_METHOD_LABEL_TO_VALUE[label as keyof typeof SUBMIT_METHOD_LABEL_TO_VALUE] ?? "link";
}

function getSubmitMethodLabel(value?: string | null) {
  if (!value) return SUBMIT_METHOD_OPTIONS[0];
  return SUBMIT_METHOD_VALUE_TO_LABEL[value as keyof typeof SUBMIT_METHOD_VALUE_TO_LABEL] ?? SUBMIT_METHOD_OPTIONS[0];
}

function getMaterialContentTypeLabel(value?: string | null) {
  if (!value) return CONTENT_TYPE_OPTIONS[0];
  const normalized = value.toLowerCase();
  if (normalized === "pdf") return "PDF";
  if (normalized === "link") return "Link";
  return CONTENT_TYPE_OPTIONS[0];
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
    if (draft.mode === "create" && !draft.selectedQuizId.trim()) {
      missing.push("Pilih Kuis");
    } else if (
      draft.mode === "create" &&
      draft.selectedQuizId.trim() &&
      !getQuizById(quizOptions, draft.selectedQuizId)
    ) {
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
      questionFile: draft.questionFile,
    },
  };
}

export default function ModuleBuilderPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = use(params);
  const { toast } = useToast();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [activeDraft, setActiveDraft] = useState<DraftItemForm | null>(null);
  const [activeChapterDraft, setActiveChapterDraft] = useState<DraftChapterForm | null>(null);
  const [draftError, setDraftError] = useState<string>("");
  const [quizOptions, setQuizOptions] = useState<MonitoringQuizRecord[]>([]);
  const [saving, setSaving] = useState(false);

  const loadModuleData = useCallback(async () => {
    setLoading(true);
    try {
      const moduleDetail = await teacherApi.getModuleDetail(moduleId);
      const quizzes = await teacherApi.getQuizBanks(moduleDetail.moduleId ?? moduleDetail.id);

      // Map sections to chapters
      const mappedChapters: Chapter[] = moduleDetail.sections.map((s) => {
        const chapterItems = [
          ...moduleDetail.lessons
            .filter((l) => l.sectionId === s.id)
            .map((l, index) => ({
              rank: getItemRank(l.position, index),
              item: {
                id: l.id,
                kind: "Materi" as const,
                title: l.title,
                description: l.body,
                details: { contentType: getMaterialContentTypeLabel(l.contentType), contentUrl: l.contentUrl },
              },
            })),
          ...moduleDetail.quizzes
            .filter((q) => q.sectionId === s.id)
            .map((q, index) => ({
              rank: getItemRank(q.position, 100000 + index),
              item: {
                id: q.id,
                kind: "Kuis" as const,
                title: q.title,
                description: "",
                details: {
                  sourceQuizId: q.id,
                  passScore: q.passScore,
                  quizDurationMinutes: q.durationMinutes ?? 0,
                  quizStartAt: q.availableAt ?? "",
                  quizDeadline: q.deadline ?? "",
                },
              },
            })),
          ...moduleDetail.tasks
            .filter((t) => t.sectionId === s.id)
            .map((t, index) => ({
              rank: getItemRank(t.position, 200000 + index),
              item: {
                id: t.id,
                kind: "Tugas" as const,
                title: t.title,
                description: t.description,
                details: {
                  taskStartAt: t.availableAt ?? "",
                  taskDeadline: t.deadline,
                  submitMethod: getSubmitMethodLabel(t.submitMethod),
                  questionFile: t.attachment?.fileName ?? "",
                  questionFileUrl: t.attachment?.url ?? "",
                  questionFileMimeType: t.attachment?.mimeType ?? "",
                },
              },
            })),
        ]
          .sort((left, right) => left.rank - right.rank)
          .map((entry) => entry.item);

        return {
          id: s.id,
          title: s.title,
          summary: "", // summary not in schema, using empty
          items: chapterItems,
        };
      });

      setChapters(mappedChapters);
      setQuizOptions(
        quizzes.map((q) => ({
          id: q.id,
          title: q.title,
          moduleName: q.moduleName ?? "",
          questionCount: q.questionCount,
          passScore: q.passScore,
          durationMinutes: q.durationMinutes ?? 0,
          updatedAt: new Date().toISOString(),
        }))
      );
    } catch (e: any) {
      setError(e.message || "Gagal memuat data modul");
    } finally {
      setLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    loadModuleData();
  }, [loadModuleData]);

  const nextBabNumber = useMemo(() => chapters.length + 1, [chapters.length]);

  const handleAddChapter = () => {
    setDraftError("");
    setActiveDraft(null);
    setActiveChapterDraft({
      mode: "create",
      chapterId: "", // will be assigned by server
      title: `Bab ${nextBabNumber} - `,
      summary: "",
    });
  };

  const handleEditChapter = (chapter: Chapter) => {
    setDraftError("");
    setActiveDraft(null);
    setActiveChapterDraft({
      mode: "edit",
      chapterId: chapter.id,
      title: chapter.title,
      summary: chapter.summary,
    });
  };

  const handleSaveChapter = async () => {
    if (!activeChapterDraft) return;
    if (!activeChapterDraft.title.trim()) {
      setDraftError("Judul bab wajib diisi");
      return;
    }

    setSaving(true);
    try {
      if (activeChapterDraft.mode === "create") {
        await teacherApi.createSection({
          offeringId: moduleId,
          judul: activeChapterDraft.title.trim(),
        });
        toast.success("Bab baru berhasil ditambahkan");
      } else {
        await teacherApi.updateSection(activeChapterDraft.chapterId, {
          judul: activeChapterDraft.title.trim(),
        });
        toast.success("Bab berhasil diupdate");
      }
      setActiveChapterDraft(null);
      loadModuleData();
    } catch (e: any) {
      setDraftError(e.message || "Gagal menyimpan bab");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Hapus bab ini beserta seluruh isinya?")) return;
    setSaving(true);
    try {
      await teacherApi.deleteSection(chapterId);
      toast.delete("Bab berhasil dihapus");
      loadModuleData();
    } catch (e: any) {
      toast.error?.(e.message || "Gagal menghapus bab");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreate = (chapterId: string, kind: ChapterItemKind) => {
    setDraftError("");
    setActiveChapterDraft(null);
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
    setActiveChapterDraft(null);
    setActiveDraft({
      mode: "edit",
      chapterId,
      itemId: item.id,
      kind: item.kind,
      title: item.title,
      description: item.description,
      contentType: item.details.contentType ?? CONTENT_TYPE_OPTIONS[0],
      contentUrl: item.details.contentUrl ?? "",
      contentFileData: undefined,
      contentFileMimeType: undefined,
      selectedQuizId: item.details.sourceQuizId ?? "",
      quizStartAt: item.details.quizStartAt ?? "",
      quizDeadline: item.details.quizDeadline ?? "",
      taskStartAt: item.details.taskStartAt ?? "",
      taskDeadline: item.details.taskDeadline ?? "",
      submitMethod: item.details.submitMethod ?? SUBMIT_METHOD_OPTIONS[0],
      questionFile: item.details.questionFile ?? "",
      questionFileMimeType: item.details.questionFileMimeType ?? "",
    });
  };

  const handleDeleteItem = async (chapterId: string, itemId: string, kind: ChapterItemKind) => {
    if (!confirm(`Hapus ${kind} ini?`)) return;
    setSaving(true);
    try {
      if (kind === "Materi") await teacherApi.deleteLesson(itemId);
      else if (kind === "Kuis") {
        await teacherApi.deleteQuiz(itemId);
      }
      else if (kind === "Tugas") await teacherApi.deleteTask(itemId);
      
      toast.delete("Item berhasil dihapus");
      loadModuleData();
    } catch (e: any) {
      toast.error?.(e.message || "Gagal menghapus item");
    } finally {
      setSaving(false);
    }
  };

  const handleDraftChange = (field: keyof DraftItemForm, value: string) => {
    setActiveDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveItem = async () => {
    if (!activeDraft) return;

    const validation = validateDraft(activeDraft, quizOptions);
    if (!validation.isValid) {
      setDraftError(validation.message);
      return;
    }

    setSaving(true);
    try {
      if (activeDraft.kind === "Materi") {
        if (activeDraft.mode === "create") {
          await teacherApi.createLesson({
            moduleStudentClassId: moduleId,
            sectionId: activeDraft.chapterId,
            judul: activeDraft.title.trim(),
            tipeKonten: activeDraft.contentType.toLowerCase(),
            konten: activeDraft.description.trim(),
            urlKonten: activeDraft.contentUrl,
            ...(activeDraft.contentType !== "Link" &&
            activeDraft.contentFileData &&
            activeDraft.contentFileMimeType
              ? {
                  contentFile: {
                    fileName: activeDraft.contentUrl,
                    mimeType: activeDraft.contentFileMimeType,
                    base64Data: activeDraft.contentFileData,
                  },
                }
              : {}),
            status: "published",
          });
        } else {
          await teacherApi.updateLesson(activeDraft.itemId!, {
            title: activeDraft.title.trim(),
            contentType: activeDraft.contentType.toLowerCase(),
            body: activeDraft.description.trim(),
            contentUrl: activeDraft.contentUrl,
            ...(activeDraft.contentType !== "Link" &&
            activeDraft.contentFileData &&
            activeDraft.contentFileMimeType
              ? {
                  contentFile: {
                    fileName: activeDraft.contentUrl,
                    mimeType: activeDraft.contentFileMimeType,
                    base64Data: activeDraft.contentFileData,
                  },
                }
              : {}),
            sectionId: activeDraft.chapterId,
          });
        }
      } else if (activeDraft.kind === "Kuis") {
        if (activeDraft.mode === "create") {
          await teacherApi.instantiateQuizFromBank({
            sourceQuizId: activeDraft.selectedQuizId,
            moduleStudentClassId: moduleId,
            sectionId: activeDraft.chapterId,
            availableAt: activeDraft.quizStartAt,
            deadline: activeDraft.quizDeadline,
            isAktif: true,
          });
        } else {
          await teacherApi.updateQuiz(activeDraft.itemId!, {
            sectionId: activeDraft.chapterId,
            availableAt: activeDraft.quizStartAt,
            deadline: activeDraft.quizDeadline,
            isAktif: true,
          });
        }
      } else if (activeDraft.kind === "Tugas") {
        if (activeDraft.mode === "create") {
          await teacherApi.createTask({
            moduleStudentClassId: moduleId,
            sectionId: activeDraft.chapterId,
            judul: activeDraft.title.trim(),
            deskripsi: activeDraft.description.trim(),
            availableAt: activeDraft.taskStartAt,
            deadline: activeDraft.taskDeadline,
            status: "published",
            isAktif: true,
            submitMethod: getSubmitMethodValue(activeDraft.submitMethod),
            ...(activeDraft.questionFileData && activeDraft.questionFileMimeType
              ? {
                  attachment: {
                    fileName: activeDraft.questionFile,
                    mimeType: activeDraft.questionFileMimeType,
                    base64Data: activeDraft.questionFileData,
                  },
                }
              : {}),
          });
        } else {
          await teacherApi.updateTask(activeDraft.itemId!, {
            judul: activeDraft.title.trim(),
            deskripsi: activeDraft.description.trim(),
            availableAt: activeDraft.taskStartAt,
            deadline: activeDraft.taskDeadline,
            sectionId: activeDraft.chapterId,
            submitMethod: getSubmitMethodValue(activeDraft.submitMethod),
            ...(activeDraft.questionFileData && activeDraft.questionFileMimeType
              ? {
                  attachment: {
                    fileName: activeDraft.questionFile,
                    mimeType: activeDraft.questionFileMimeType,
                    base64Data: activeDraft.questionFileData,
                  },
                }
              : {}),
          });
        }
      }

      toast.success(`Item ${activeDraft.kind} berhasil disimpan`);
      setActiveDraft(null);
      loadModuleData();
    } catch (e: any) {
      setDraftError(e.message || "Gagal menyimpan item");
    } finally {
      setSaving(false);
    }
  };

  const selectedQuiz = activeDraft?.kind === "Kuis" ? getQuizById(quizOptions, activeDraft.selectedQuizId) : undefined;

  return (
    <div className="grid min-h-full grid-rows-[auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title={`Detail Mata Pelajaran: ${moduleId}`}
        description="Mata pelajaran berasal dari admin. Guru dapat menambah Bab, materi, tugas, kuis, lalu mengelola tiap item."
      />

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <p className="text-[12px] text-[#626b8b]">Memuat data modul...</p>
        </div>
      ) : error ? (
        <div className="rounded-[10px] border border-[#f5c4cd] bg-[#fff2f5] px-4 py-3 text-[13px] text-[#ba4b64]">
          {error}
        </div>
      ) : (
        <section className="grid min-h-0 gap-2 xl:grid-cols-[1.4fr_1fr]">
        <Surface
          title="Outline Bab & Item"
          action={
            <button
              type="button"
              onClick={handleAddChapter}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[10px] border border-dashed border-[#bcb5f4] bg-[#faf7ff] px-2.5 py-1.5 text-[12px] font-semibold text-[#6d5dfc] transition-all hover:bg-[#f0eaff] active:scale-95"
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
                    <p className="text-[13px] font-semibold text-[#2b325b]">{chapter.title}</p>
                    <p className="text-[9.5px] text-[#565f7d]">{chapter.summary}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleEditChapter(chapter)}
                      className="cursor-pointer text-[9.5px] font-semibold text-[#6d5dfc] hover:underline"
                    >
                      Edit Bab
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="cursor-pointer text-[9.5px] font-semibold text-[#c54564] hover:underline"
                    >
                      Hapus
                    </button>
                    <GripVertical className="h-4 w-4 text-[#8a92ba]" />
                  </div>
                </div>

                <div className="mt-2 space-y-1.5">
                  {chapter.items.length > 0 ? (
                    chapter.items.map((item) => (
                      <article
                        key={getChapterItemKey(item)}
                        className="rounded-[9px] border border-[rgba(113,94,215,0.1)] bg-[#fbfaff] px-2 py-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[9.5px] font-semibold text-[#515987]">
                              {item.kind}: {item.title}
                            </p>
                            <p className="mt-0.5 text-[13px] text-[#565f7d]">{item.description}</p>
                            <p className="mt-1 text-[12px] text-[#7880a7]">{getItemMeta(item).join(" | ")}</p>
                          </div>
                          <div className="flex shrink-0 gap-1 text-[12px] font-semibold">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(chapter.id, item)}
                              className="cursor-pointer rounded-[6px] border border-[rgba(113,94,215,0.2)] bg-white px-1.5 py-0.5 text-[#5c6392] transition-all hover:bg-[#faf9ff] active:scale-95"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(chapter.id, item.id, item.kind)}
                              className="cursor-pointer rounded-[6px] border border-[rgba(233,84,116,0.24)] bg-[#fff5f7] px-1.5 py-0.5 text-[#c54564] transition-all hover:bg-[#ffeef1] active:scale-95"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-[9px] border border-dashed border-[rgba(113,94,215,0.16)] bg-[#fcfbff] px-2 py-1.5 text-[13px] text-[#7b82aa]">
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
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Pilih Kuis dari Monitoring Kuis
                      </span>
                      <select
                        value={activeDraft.selectedQuizId}
                        onChange={(event) => handleDraftChange("selectedQuizId", event.target.value)}
                        disabled={activeDraft.mode === "edit"}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                      >
                        <option value="">{activeDraft.mode === "edit" ? "Quiz instance terpasang" : "Pilih kuis"}</option>
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
                    ) : activeDraft.mode === "edit" ? (
                      <p className="text-[13px] text-[#626b8b]">Kuis sudah terpasang pada kelas ini. Anda dapat mengubah jadwal atau memindahkannya ke bab lain.</p>
                    ) : (
                      <p className="text-[13px] text-[#626b8b]">Belum ada kuis yang dipilih.</p>
                    )}

                    {selectedQuiz ? (
                      <div className="mt-2 grid gap-2 md:grid-cols-2">
                        <label className="block">
                          <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                            Waktu Mulai
                          </span>
                          <input
                            type="datetime-local"
                            value={activeDraft.quizStartAt}
                            onChange={(event) => handleDraftChange("quizStartAt", event.target.value)}
                            className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                            Waktu Selesai (Deadline)
                          </span>
                          <input
                            type="datetime-local"
                            value={activeDraft.quizDeadline}
                            onChange={(event) => handleDraftChange("quizDeadline", event.target.value)}
                            className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                          />
                        </label>
                      </div>
                    ) : null}
                  </>
                ) : null}

                {activeDraft.kind === "Materi" ? (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Judul
                      </span>
                      <input
                        value={activeDraft.title}
                        onChange={(event) => handleDraftChange("title", event.target.value)}
                        placeholder="Contoh judul materi"
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Deskripsi
                      </span>
                      <textarea
                        value={activeDraft.description}
                        onChange={(event) => handleDraftChange("description", event.target.value)}
                        placeholder="Ringkasan singkat untuk guru dan siswa"
                        className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[13px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Content Type
                      </span>
                      <select
                        value={activeDraft.contentType}
                        onChange={(event) => handleDraftChange("contentType", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
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
                        <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                          URL Tautan
                        </span>
                        <input
                          type="url"
                          value={activeDraft.contentUrl}
                          onChange={(event) => handleDraftChange("contentUrl", event.target.value)}
                          placeholder="https://contoh.com/materi"
                          className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                        />
                      </label>
                    ) : (
                      <label className="block">
                        <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                          Unggah File PDF
                        </span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={async (event) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                try {
                                  const base64Data = await readFileAsBase64(file);
                                  setActiveDraft((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          contentUrl: file.name,
                                          contentFileData: base64Data,
                                          contentFileMimeType: file.type || "application/pdf",
                                        }
                                      : prev
                                  );
                                  setDraftError("");
                                } catch (error) {
                                  setDraftError(
                                    error instanceof Error ? error.message : "File materi tidak dapat dibaca"
                                  );
                                }
                              }
                            }}
                            className="w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 py-1.5 text-[13px] text-[#4f5678] outline-none file:mr-2 file:cursor-pointer file:rounded-[6px] file:border-0 file:bg-[#faf7ff] file:px-2 file:py-1 file:text-[12px] file:font-semibold file:text-[#6d5dfc] transition-colors hover:file:bg-[#f0eaff]"
                          />
                        {activeDraft.contentUrl && activeDraft.contentUrl.endsWith('.pdf') ? (
                          <p className="mt-1 text-[13px] text-[#2f8c57]">File terpilih: {activeDraft.contentUrl}</p>
                        ) : null}
                      </label>
                    )}
                  </>
                ) : null}

                {activeDraft.kind === "Tugas" ? (
                  <>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Judul
                      </span>
                      <input
                        value={activeDraft.title}
                        onChange={(event) => handleDraftChange("title", event.target.value)}
                        placeholder="Contoh judul tugas"
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Deskripsi
                      </span>
                      <textarea
                        value={activeDraft.description}
                        onChange={(event) => handleDraftChange("description", event.target.value)}
                        placeholder="Ringkasan singkat untuk guru dan siswa"
                        className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[13px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Unggah File Soal (Opsional)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.png"
                        onChange={async (event) => {
                          const file = event.target.files?.[0];
                          if (file) {
                            try {
                              const base64Data = await readFileAsBase64(file);
                              setActiveDraft((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      questionFile: file.name,
                                      questionFileData: base64Data,
                                      questionFileMimeType: file.type || "application/octet-stream",
                                    }
                                  : prev
                              );
                              setDraftError("");
                            } catch (error) {
                              setDraftError(
                                error instanceof Error ? error.message : "File soal tidak dapat dibaca"
                              );
                            }
                          }
                        }}
                        className="w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 py-1.5 text-[13px] text-[#4f5678] outline-none file:mr-2 file:cursor-pointer file:rounded-[6px] file:border-0 file:bg-[#faf7ff] file:px-2 file:py-1 file:text-[12px] file:font-semibold file:text-[#6d5dfc] transition-colors hover:file:bg-[#f0eaff]"
                      />
                      {activeDraft.questionFile ? (
                        <p className="mt-1 text-[13px] text-[#2f8c57]">File terpilih: {activeDraft.questionFile}</p>
                      ) : null}
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Start Tugas
                      </span>
                      <input
                        type="datetime-local"
                        value={activeDraft.taskStartAt}
                        onChange={(event) => handleDraftChange("taskStartAt", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Deadline Tugas
                      </span>
                      <input
                        type="datetime-local"
                        value={activeDraft.taskDeadline}
                        onChange={(event) => handleDraftChange("taskDeadline", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                        Metode Submit
                      </span>
                      <select
                        value={activeDraft.submitMethod}
                        onChange={(event) => handleDraftChange("submitMethod", event.target.value)}
                        className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
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
                  <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-2 py-1.5 text-[13px] text-[#ba4b64]">
                    {draftError}
                  </p>
                ) : (
                  <p className="text-[13px] text-[#626b8b]">
                    Isi detail item, lalu simpan ke bab.
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-[12px] font-semibold">
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
                    disabled={saving}
                    className="cursor-pointer rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  >
                    {saving ? "Menyimpan..." : activeDraft.mode === "edit" ? "Simpan Perubahan" : "Simpan ke Bab"}
                  </button>
                </div>
              </div>
            </Surface>
          ) : activeChapterDraft ? (
            <Surface title={`${activeChapterDraft.mode === "edit" ? "Edit" : "Input Detail"} Bab`}>
              <div className="grid gap-2">
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                    Judul Bab
                  </span>
                  <input
                    value={activeChapterDraft.title}
                    onChange={(event) => setActiveChapterDraft(prev => prev ? { ...prev, title: event.target.value } : prev)}
                    placeholder="Contoh: Bab 3 - Lanjutan Konsep"
                    className="h-9 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white px-3 text-[13px] text-[#4f5678] outline-none"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[12px] font-semibold uppercase tracking-[0.16em] text-[#626b8b]">
                    Deskripsi Bab
                  </span>
                  <textarea
                    value={activeChapterDraft.summary}
                    onChange={(event) => setActiveChapterDraft(prev => prev ? { ...prev, summary: event.target.value } : prev)}
                    placeholder="Ringkasan singkat pembelajaran untuk bab ini"
                    className="h-20 w-full rounded-[10px] border border-[rgba(113,94,215,0.12)] bg-white p-3 text-[13px] text-[#4f5678] outline-none"
                  />
                </label>

                {draftError && (
                  <p className="rounded-[9px] border border-[#f5c4cd] bg-[#fff2f5] px-2 py-1.5 text-[13px] text-[#ba4b64]">
                    {draftError}
                  </p>
                )}

                 <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setDraftError("");
                      setActiveChapterDraft(null);
                    }}
                    className="cursor-pointer rounded-[9px] border border-[rgba(113,94,215,0.2)] bg-white px-2 py-2 text-[#5b6191] transition-all hover:bg-[#faf9ff] active:scale-95"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChapter}
                    disabled={saving}
                    className="cursor-pointer rounded-[9px] bg-gradient-to-r from-[#765df5] to-[#5b50dc] px-2 py-2 text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                  >
                    {saving ? "Menyimpan..." : activeChapterDraft.mode === "edit" ? "Simpan Perubahan" : "Simpan Bab"}
                  </button>
                </div>
              </div>
            </Surface>
          ) : (
            <Surface title="Panduan Singkat">
              <div className="rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5 text-[9.5px] text-[#565f7d]">
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
      )}
    </div>
  );
}
