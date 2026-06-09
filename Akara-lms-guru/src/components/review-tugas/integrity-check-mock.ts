import { formatTaskSubmittedAt } from "@/app/(workspace)/review-tugas/review-tugas-utils";

export type IntegrityPreviewBlock = {
  id: string;
  kind: "heading" | "paragraph" | "highlight" | "caption" | "figure";
  text: string;
  note?: string;
};

export type IntegrityPreviewDocument = {
  id: string;
  role: "source" | "comparison";
  studentName: string;
  fileName: string;
  submittedAtLabel: string;
  pageLabel: string;
  summary: string;
  similarityScore: number | null;
  blocks: IntegrityPreviewBlock[];
};

export type IntegrityCheckMockScenario = {
  assignmentTitle: string;
  className: string;
  courseTitle: string;
  sourceDocument: IntegrityPreviewDocument;
  comparisonDocuments: IntegrityPreviewDocument[];
  highestSimilarity: number;
};

function humanizeTaskId(taskId: string) {
  const normalized = decodeURIComponent(taskId)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) {
    return "Analisis Literatur Pendidikan";
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function buildSubmittedAtLabel(dayOffset: number, hour: number, minute: number) {
  const date = new Date();
  date.setDate(date.getDate() - dayOffset);
  date.setHours(hour, minute, 0, 0);
  return formatTaskSubmittedAt(date.toISOString());
}

function createSharedBlocks(topic: string, comparisonNote: string) {
  return [
    {
      id: `${topic}-heading`,
      kind: "heading",
      text: topic,
    },
    {
      id: `${topic}-lead`,
      kind: "paragraph",
      text: "Kajian ini membahas hubungan antara strategi belajar mandiri, lingkungan belajar, dan kualitas refleksi akademik siswa pada pembelajaran berbasis proyek.",
    },
    {
      id: `${topic}-highlight-1`,
      kind: "highlight",
      text: "Model pembelajaran yang memberi ruang refleksi terstruktur cenderung meningkatkan kualitas argumentasi dan konsistensi siswa saat menyusun laporan tugas.",
    },
    {
      id: `${topic}-figure`,
      kind: "figure",
      text: "Bagan alur penyusunan laporan dan penilaian.",
      note: comparisonNote,
    },
    {
      id: `${topic}-paragraph-2`,
      kind: "paragraph",
      text: "Data observasi menunjukkan bahwa siswa yang menyiapkan kerangka penulisan sejak awal memiliki tingkat revisi lebih sedikit dan alur narasi yang lebih stabil.",
    },
    {
      id: `${topic}-highlight-2`,
      kind: "highlight",
      text: "Kesamaan susunan argumen, urutan contoh, dan kalimat penutup perlu ditinjau manual karena dapat mengindikasikan peminjaman struktur tulisan antar dokumen.",
    },
    {
      id: `${topic}-caption`,
      kind: "caption",
      text: "Dummy preview untuk eksplorasi desain integrity check.",
    },
  ] satisfies IntegrityPreviewBlock[];
}

export function createIntegrityCheckMockScenario(
  taskId: string,
  submissionId: string
): IntegrityCheckMockScenario {
  const assignmentTitle = humanizeTaskId(taskId);
  const sourceFileName = `submission-${submissionId.slice(0, 8) || "sumber"}.pdf`;

  const sourceDocument: IntegrityPreviewDocument = {
    id: "source-document",
    role: "source",
    studentName: "Dokumen sumber terpilih",
    fileName: sourceFileName,
    submittedAtLabel: buildSubmittedAtLabel(1, 9, 15),
    pageLabel: "5 halaman PDF",
    summary: "Ringkasan tugas utama yang dikirim siswa dan dijadikan acuan pembandingan.",
    similarityScore: null,
    blocks: createSharedBlocks(
      `Laporan Tugas: ${assignmentTitle}`,
      "Elemen visual ini hanya placeholder untuk mewakili gambar, tabel, atau diagram pada dokumen tugas."
    ),
  };

  const comparisonDocuments: IntegrityPreviewDocument[] = [
    {
      id: "comparison-rafi",
      role: "comparison",
      studentName: "Rafi Mahendra",
      fileName: "laporan-rafi-mahendra.pdf",
      submittedAtLabel: buildSubmittedAtLabel(1, 9, 42),
      pageLabel: "5 halaman PDF",
      summary: "Kemiripan tinggi pada struktur argumen, contoh kasus, dan paragraf penutup.",
      similarityScore: 82,
      blocks: createSharedBlocks(
        "Analisis Strategi Belajar Mandiri Pada Siswa",
        "Susunan blok visual dan dua paragraf berwarna menandai area yang paling perlu ditinjau guru."
      ),
    },
    {
      id: "comparison-alya",
      role: "comparison",
      studentName: "Alya Nurfadilah",
      fileName: "essay-alya-nurfadilah.docx",
      submittedAtLabel: buildSubmittedAtLabel(1, 10, 8),
      pageLabel: "4 halaman DOCX",
      summary: "Kemiripan sedang pada definisi awal dan alur penjelasan metode.",
      similarityScore: 57,
      blocks: createSharedBlocks(
        "Tinjauan Pembelajaran Berbasis Refleksi Akademik",
        "Preview dokumen kanan akan berubah mengikuti item yang dipilih pada daftar pembanding."
      ),
    },
    {
      id: "comparison-bagas",
      role: "comparison",
      studentName: "Bagas Ramadhan",
      fileName: "bagas-portfolio-tugas.pdf",
      submittedAtLabel: buildSubmittedAtLabel(1, 10, 26),
      pageLabel: "6 halaman PDF",
      summary: "Kemiripan rendah, dominan hanya pada istilah umum dan satu contoh ilustratif.",
      similarityScore: 31,
      blocks: createSharedBlocks(
        "Portofolio Ringkas Proyek Literasi Digital",
        "Gunakan layout ini untuk membandingkan dokumen sumber di kiri dan pembanding aktif di kanan."
      ),
    },
  ];

  return {
    assignmentTitle,
    className: "XI IPA 2",
    courseTitle: "Bahasa Indonesia",
    sourceDocument,
    comparisonDocuments,
    highestSimilarity: comparisonDocuments[0]?.similarityScore ?? 0,
  };
}
