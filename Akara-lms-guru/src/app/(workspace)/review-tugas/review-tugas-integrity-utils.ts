import {
  teacherApi,
  type TaskSubmissionDetail,
  type TaskSubmissionSummary,
} from "@/lib/api-client";

export type IntegrityTextSegment = {
  text: string;
  highlighted?: boolean;
};

export type IntegrityParagraph = IntegrityTextSegment[];

export type IntegrityComparisonItem = {
  submissionId: string;
  studentName: string;
  documentLabel: string;
  documentUrl: string | null;
  academicYearLabel: string;
  similarityScore: number;
  matchedWordCount: number;
  syntaxSimilarity: number;
  sourceParagraphs: IntegrityParagraph[];
  comparisonParagraphs: IntegrityParagraph[];
  comparisonTitle: string;
  comparisonMeta: string;
};

export type IntegrityCheckContext = {
  mode: "simulation";
  currentSubmission: {
    submissionId: string;
    studentName: string;
    documentLabel: string;
    documentUrl: string | null;
    submittedAt: string | null;
    wordCount: number;
    assignmentTitle: string;
    courseTitle: string;
  };
  comparisons: IntegrityComparisonItem[];
};

type IntegrityTemplate = {
  comparisonTitle: string;
    sourceParagraphs: (current: TaskSubmissionDetail, peer: TaskSubmissionDetail) => IntegrityParagraph[];
  comparisonParagraphs: (current: TaskSubmissionDetail, peer: TaskSubmissionDetail) => IntegrityParagraph[];
};

const SIMILARITY_SCORES = [42.1, 18.4, 12.2, 9.7, 7.1];

const INTEGRITY_TEMPLATES: IntegrityTemplate[] = [
  {
    comparisonTitle: "Pola argumen pembuka",
    sourceParagraphs: (current, peer) => [
      [
        {
          text: `Dokumen ${current.assignmentTitle} pada mata pelajaran ${current.courseTitle} menekankan bahwa, saat disejajarkan dengan naskah ${peer.studentName}, `,
        },
        {
          text: "pemanfaatan teknologi harus dibarengi argumentasi yang runtut, sumber yang jelas, dan istilah teknis yang konsisten",
          highlighted: true,
        },
        {
          text: " sejak paragraf pembuka hingga penegasan akhir.",
        },
      ],
      [
        {
          text: "Pada bagian analisis, penulis juga mengulang gagasan bahwa ",
        },
        {
          text: "struktur penjelasan yang sistematis memudahkan pembaca memahami hubungan antara teori, data, dan simpulan",
          highlighted: true,
        },
        {
          text: " di dalam tugas.",
        },
      ],
      [
        {
          text: `${current.studentName} menutup laporan dengan ajakan untuk menjaga kualitas penulisan akademik melalui sitasi yang disiplin dan kalimat yang tidak menyalin mentah dokumen lain.`,
        },
      ],
    ],
    comparisonParagraphs: (current, peer) => [
      [
        {
          text: `"Pada laporan ${peer.assignmentTitle}, penulis menyebut bahwa `,
        },
        {
          text: "pemanfaatan teknologi harus dibarengi argumentasi yang runtut, sumber yang jelas, dan istilah teknis yang konsisten",
          highlighted: true,
        },
        {
          text: ' saat membangun pembahasan utama."',
        },
      ],
      [
        {
          text: '"Dokumen pembanding juga memuat kalimat bahwa ',
        },
        {
          text: "struktur penjelasan yang sistematis memudahkan pembaca memahami hubungan antara teori, data, dan simpulan",
          highlighted: true,
        },
        {
          text: ' sehingga ritme penulisannya sangat dekat dengan dokumen sumber."',
        },
      ],
    ],
  },
  {
    comparisonTitle: "Kesamaan struktur penjelasan",
    sourceParagraphs: (current, peer) => [
      [
        {
          text: `${current.studentName} menyusun pembahasan ${current.courseTitle} dengan pola masalah, analisis, lalu rekomendasi. Saat dibandingkan dengan naskah ${peer.studentName}, pada bagian inti muncul frasa `,
        },
        {
          text: "alur berpikir digital yang efektif lahir dari observasi, pengolahan data, dan evaluasi mandiri yang dilakukan berulang",
          highlighted: true,
        },
        {
          text: ".",
        },
      ],
      [
        {
          text: "Paragraf selanjutnya memuat kalimat bahwa ",
        },
        {
          text: "ketelitian memilih istilah dan contoh praktis menjadi penanda utama kualitas laporan siswa",
          highlighted: true,
        },
        {
          text: " saat menjelaskan hasil pengamatan.",
        },
      ],
    ],
    comparisonParagraphs: (current, peer) => [
      [
        {
          text: `"Dokumen ${peer.studentName} memakai urutan yang hampir sama, termasuk kalimat `,
        },
        {
          text: "alur berpikir digital yang efektif lahir dari observasi, pengolahan data, dan evaluasi mandiri yang dilakukan berulang",
          highlighted: true,
        },
        {
          text: ' di bagian pengantar analisis."',
        },
      ],
      [
        {
          text: '"Kemiripan tambahan terlihat saat dokumen pembanding menyatakan bahwa ',
        },
        {
          text: "ketelitian memilih istilah dan contoh praktis menjadi penanda utama kualitas laporan siswa",
          highlighted: true,
        },
        {
          text: ' meskipun konteks contohnya sedikit berbeda."',
        },
      ],
    ],
  },
  {
    comparisonTitle: "Kemiripan simpulan",
    sourceParagraphs: (current, peer) => [
      [
        {
          text: `Pada simpulan tugas ${current.assignmentTitle}, ${current.studentName} menulis bahwa, bahkan bila disejajarkan dengan dokumen ${peer.studentName}, `,
        },
        {
          text: "integritas akademik tidak berhenti pada hasil akhir, tetapi juga terlihat dari cara siswa membangun proses berpikir dan menuliskan referensi",
          highlighted: true,
        },
        {
          text: ".",
        },
      ],
      [
        {
          text: "Ia kemudian menambahkan bahwa ",
        },
        {
          text: "setiap revisi harus memperjelas orisinalitas argumen, bukan hanya mengganti susunan kata di permukaan",
          highlighted: true,
        },
        {
          text: " untuk memenuhi standar pembelajaran.",
        },
      ],
    ],
    comparisonParagraphs: (current, peer) => [
      [
        {
          text: `"Naskah ${peer.studentName} memiliki penutup yang sangat dekat, khususnya kalimat `,
        },
        {
          text: "integritas akademik tidak berhenti pada hasil akhir, tetapi juga terlihat dari cara siswa membangun proses berpikir dan menuliskan referensi",
          highlighted: true,
        },
        {
          text: ' yang muncul hampir utuh."',
        },
      ],
      [
        {
          text: '"Kemiripan lanjut tampak ketika dokumen pembanding menegaskan bahwa ',
        },
        {
          text: "setiap revisi harus memperjelas orisinalitas argumen, bukan hanya mengganti susunan kata di permukaan",
          highlighted: true,
        },
        {
          text: ' pada bagian akhir laporan."',
        },
      ],
    ],
  },
];

function extractDocumentLabel(detail: TaskSubmissionDetail, fallbackLabel: string) {
  if (detail.submissionFile?.fileName) return detail.submissionFile.fileName;
  if (detail.submissionLink) {
    const parts = detail.submissionLink.split("/").filter(Boolean);
    const candidate = parts.at(-1);
    if (candidate) return decodeURIComponent(candidate);
  }

  return fallbackLabel;
}

function extractDocumentUrl(detail: TaskSubmissionDetail) {
  return detail.submissionFile?.url ?? detail.submissionLink ?? null;
}

function buildAcademicYearLabel(value: string | null) {
  const baseDate = value ? new Date(value) : new Date();
  const year = baseDate.getUTCMonth() >= 6 ? baseDate.getUTCFullYear() : baseDate.getUTCFullYear() - 1;
  return `Tahun Akademik ${year}-${year + 1}`;
}

function countWords(paragraphs: IntegrityParagraph[]) {
  return paragraphs
    .flatMap((paragraph) => paragraph.map((segment) => segment.text))
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function buildSimilarityScore(index: number) {
  if (index < SIMILARITY_SCORES.length) return SIMILARITY_SCORES[index];
  return Math.max(5.3, Number((SIMILARITY_SCORES.at(-1)! - (index - SIMILARITY_SCORES.length + 1) * 1.4).toFixed(1)));
}

function buildComparisonMeta(score: number) {
  if (score >= 30) return "Perlu review manual prioritas tinggi";
  if (score >= 15) return "Perlu review manual";
  return "Cek cepat disarankan";
}

async function loadPeerDetails(
  rows: TaskSubmissionSummary[],
  activeSubmissionId: string
) {
  const peerRows = rows.filter((row) => row.id !== activeSubmissionId);

  const details = await Promise.all(
    peerRows.map(async (row) => {
      const detail = await teacherApi.getTaskSubmissionDetail(row.id);
      return {
        summary: row,
        detail,
      };
    })
  );

  return details;
}

export async function loadTaskIntegrityContext(taskId: string, submissionId: string) {
  const [currentDetail, taskSubmissions] = await Promise.all([
    teacherApi.getTaskSubmissionDetail(submissionId),
    teacherApi.getTaskSubmissions(taskId),
  ]);

  const peerDetails = await loadPeerDetails(taskSubmissions, submissionId);

  const comparisons = peerDetails.map<IntegrityComparisonItem>(({ summary, detail }, index) => {
    const template = INTEGRITY_TEMPLATES[index % INTEGRITY_TEMPLATES.length];
    const similarityScore = buildSimilarityScore(index);
    const matchedWordCount = Math.max(14, Math.round(similarityScore * 1.02));
    const syntaxSimilarity = Math.min(92, Math.max(58, Math.round(similarityScore + 46)));

    return {
      submissionId: summary.id,
      studentName: summary.studentName,
      documentLabel: extractDocumentLabel(
        detail,
        `${summary.studentName.replace(/\s+/g, "_").toLowerCase()}_submission.pdf`
      ),
      documentUrl: extractDocumentUrl(detail),
      academicYearLabel: buildAcademicYearLabel(summary.submittedAt),
      similarityScore,
      matchedWordCount,
      syntaxSimilarity,
      sourceParagraphs: template.sourceParagraphs(currentDetail, detail),
      comparisonParagraphs: template.comparisonParagraphs(currentDetail, detail),
      comparisonTitle: template.comparisonTitle,
      comparisonMeta: buildComparisonMeta(similarityScore),
    };
  });

  const sourceParagraphs =
    comparisons[0]?.sourceParagraphs ??
    INTEGRITY_TEMPLATES[0].sourceParagraphs(currentDetail, currentDetail);

  return {
    mode: "simulation" as const,
    currentSubmission: {
      submissionId,
      studentName: currentDetail.studentName,
      documentLabel: extractDocumentLabel(
        currentDetail,
        `${currentDetail.studentName.replace(/\s+/g, "_").toLowerCase()}_submission.pdf`
      ),
      documentUrl: extractDocumentUrl(currentDetail),
      submittedAt: currentDetail.submittedAt,
      wordCount: countWords(sourceParagraphs),
      assignmentTitle: currentDetail.assignmentTitle,
      courseTitle: currentDetail.courseTitle,
    },
    comparisons,
  };
}
