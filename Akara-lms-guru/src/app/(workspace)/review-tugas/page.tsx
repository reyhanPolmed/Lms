"use client";

import { ArrowLeftRight, ChevronLeft, ChevronRight, FileText, Download, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";
import { Badge, MiniInput, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { useState, useMemo, useEffect } from "react";
import { modules } from "@/lib/teacher-mocks";

// Mock data specific for Task/Assignment Review
export type MockSubmission = {
  id: string;
  studentName: string;
  className: string;
  courseTitle: string;
  assignmentTitle: string;
  submittedAt: string;
  status: string;
  score: number | null;
  teacherFeedback: string;
  files: { name: string; size: string; type: string }[];
  studentNote: string;
  rubrics: { id: string; name: string; maxScore: number; score: number | null }[];
};

const initialTaskSubmissions: MockSubmission[] = [
  {
    id: "ts-1",
    studentName: "Liam Johnson",
    className: "9A",
    courseTitle: "Sains Terapan",
    assignmentTitle: "Laporan Eksperimen Hukum Newton",
    submittedAt: "Kemarin, 14:30",
    status: "submitted",
    score: null,
    teacherFeedback: "",
    files: [
      { name: "Laporan_Newton_Liam.pdf", size: "2.4 MB", type: "pdf" },
      { name: "Dokumentasi_Praktikum.jpg", size: "1.1 MB", type: "image" }
    ],
    studentNote: "Pak, ini laporan praktikum saya. Mohon maaf fotonya agak buram karena pencahayaan kurang.",
    rubrics: [
      { id: "r1", name: "Kelengkapan Format Laporan", maxScore: 20, score: null },
      { id: "r2", name: "Pemahaman Konsep & Analisis", maxScore: 50, score: null },
      { id: "r3", name: "Kerapihan & Kesimpulan", maxScore: 30, score: null },
    ]
  },
  {
    id: "ts-2",
    studentName: "Ava Davis",
    className: "10B",
    courseTitle: "English Literature",
    assignmentTitle: "Shakespeare Character Analysis Essay",
    submittedAt: "Hari ini, 09:15",
    status: "revision",
    score: 65,
    teacherFeedback: "",
    files: [
      { name: "Essay_Hamlet_Ava.docx", size: "1.2 MB", type: "doc" }
    ],
    studentNote: "Saya sudah merevisi bagian argumen utama sesuai catatan Bapak di review sebelumnya.",
    rubrics: [
      { id: "r1", name: "Struktur & Grammar", maxScore: 30, score: 20 },
      { id: "r2", name: "Ketajaman Analisis", maxScore: 40, score: 25 },
      { id: "r3", name: "Referensi & Kutipan", maxScore: 30, score: 20 },
    ]
  },
  {
    id: "ts-3",
    studentName: "Noah Williams",
    className: "9A",
    courseTitle: "Sains Terapan",
    assignmentTitle: "Laporan Eksperimen Hukum Newton",
    submittedAt: "2 Jam yang lalu",
    status: "graded",
    score: 92,
    teacherFeedback: "",
    files: [
      { name: "Laporan_Hukum_Newton_Noah.pdf", size: "3.1 MB", type: "pdf" }
    ],
    studentNote: "",
    rubrics: [
      { id: "r1", name: "Kelengkapan Format Laporan", maxScore: 20, score: 20 },
      { id: "r2", name: "Pemahaman Konsep & Analisis", maxScore: 50, score: 45 },
      { id: "r3", name: "Kerapihan & Kesimpulan", maxScore: 30, score: 27 },
    ]
  }
];

export default function TaskReviewsPage() {
  const { toast } = useToast();

  const [submissions, setSubmissions] = useState(initialTaskSubmissions);

  const [subjectFilter, setSubjectFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [taskFilter, setTaskFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      if (subjectFilter && s.courseTitle !== subjectFilter) return false;
      if (classFilter && s.className !== classFilter) return false;
      if (taskFilter && s.assignmentTitle !== taskFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      return true;
    });
  }, [submissions, subjectFilter, classFilter, taskFilter, statusFilter]);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);

  const selectedSubmission = useMemo(() => {
    return submissions.find((s) => s.id === selectedSubmissionId) || null;
  }, [submissions, selectedSubmissionId]);

  useEffect(() => {
    if (filteredSubmissions.length > 0 && !filteredSubmissions.find(s => s.id === selectedSubmissionId)) {
      setSelectedSubmissionId(filteredSubmissions[0].id);
    } else if (filteredSubmissions.length === 0) {
      setSelectedSubmissionId(null);
    }
  }, [filteredSubmissions, selectedSubmissionId]);

  const handleUpdateRubric = (submissionId: string, rubricId: string, score: number) => {
    setSubmissions((prev) => prev.map((sub) => {
      if (sub.id !== submissionId) return sub;
      const updatedRubrics = sub.rubrics.map((r) => {
        if (r.id !== rubricId) return r;
        return { ...r, score };
      });
      const totalScore = updatedRubrics.reduce((acc, r) => acc + (Number(r.score) || 0), 0);
      const maxScore = updatedRubrics.reduce((acc, r) => acc + (r.maxScore || 0), 0);
      const finalScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : sub.score;
      return { ...sub, rubrics: updatedRubrics, score: finalScore };
    }));
  };

  const handleUpdateFeedback = (submissionId: string, feedback: string) => {
    setSubmissions((prev) => prev.map((sub) => {
      if (sub.id !== submissionId) return sub;
      return { ...sub, teacherFeedback: feedback };
    }));
  };

  const handleAction = (submissionId: string, actionType: 'draft' | 'revision' | 'publish') => {
    setSubmissions((prev) => prev.map((sub) => {
      if (sub.id !== submissionId) return sub;
      let newStatus = sub.status;
      if (actionType === 'publish') newStatus = 'graded';
      if (actionType === 'revision') newStatus = 'revision';
      return { ...sub, status: newStatus };
    }));
    
    if (actionType === 'draft') toast.success("Draft penilaian disimpan");
    if (actionType === 'revision') toast.success("Permintaan revisi dikirim ke siswa");
    if (actionType === 'publish') toast.success("Nilai tugas di-publish ke siswa");
  };

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Review Tugas Siswa"
        description="Pilih mata pelajaran dan tugas untuk memeriksa file submission, memberi nilai berdasarkan rubrik, dan memberikan feedback."
      />

      <Surface title="Filter Konteks Tugas">
        <div className="grid gap-2 md:grid-cols-4">
          <MiniSelect 
            label="Mata Pelajaran" 
            options={Array.from(new Set(initialTaskSubmissions.map(m => m.courseTitle)))} 
            placeholder="Pilih Mata Pelajaran" 
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
          />
          <MiniSelect 
            label="Kelas" 
            options={Array.from(new Set(initialTaskSubmissions.map(m => m.className)))} 
            placeholder="Pilih Kelas" 
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
          />
          <MiniSelect 
            label="Tugas" 
            options={Array.from(new Set(initialTaskSubmissions.map(m => m.assignmentTitle)))} 
            placeholder="Pilih Tugas" 
            value={taskFilter}
            onChange={e => setTaskFilter(e.target.value)}
          />
          <MiniSelect 
            label="Status Review" 
            options={Array.from(new Set(initialTaskSubmissions.map(m => m.status)))} 
            placeholder="Semua Status" 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          />
        </div>
      </Surface>

      <section className="grid min-h-0 gap-2 xl:grid-cols-[0.8fr_1.2fr]">
        <Surface title="Daftar Antrean Tugas">
          <div className="flex-1 min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedSubmissionId(row.id)}
                  className={`flex w-full cursor-pointer items-start justify-between border-b px-3 py-2.5 text-left transition-all active:scale-[0.99] last:border-b-0 ${
                    selectedSubmission?.id === row.id
                      ? "border-[rgba(113,94,215,0.4)] bg-[#f0edff]"
                      : "border-[rgba(113,94,215,0.1)] hover:bg-[#faf9ff]"
                  }`}
                >
                  <span>
                    <span className="block text-[11px] font-semibold text-[#4e5378]">{row.studentName}</span>
                    <span className="block text-[10px] text-[#6f759a]">{row.assignmentTitle}</span>
                    <span className="block text-[9px] text-[#7e84a8]">Kelas {row.className} • {row.submittedAt}</span>
                  </span>
                  <div className="text-right flex flex-col items-end gap-1">
                    <Badge status={row.status} />
                    {row.score !== null && (
                      <span className="block text-[11px] font-bold text-[#4e5378]">Skor: {row.score}</span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center">
                <p className="text-[10px] text-[#7e84a8]">Tidak ada tugas yang cocok dengan filter.</p>
              </div>
            )}
          </div>
        </Surface>

        <Surface title="Detail Submission Tugas">
          {selectedSubmission ? (
            <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
              {/* Header info Tugas */}
            <div className="mb-2 shrink-0 rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-3 flex justify-between items-start">
              <div>
                <p className="text-[12px] font-bold text-[#2b325b]">{selectedSubmission.studentName}</p>
                <p className="text-[10px] text-[#6f759a]">{selectedSubmission.courseTitle} • Kelas {selectedSubmission.className}</p>
                
                {selectedSubmission.studentNote && (
                  <div className="mt-2 rounded-[8px] bg-[#f8f9fc] p-2 border border-[#e2e6f3]">
                    <span className="block text-[9px] font-semibold uppercase text-[#7e84a8] mb-0.5">Catatan Siswa:</span>
                    <p className="text-[10px] text-[#4e5378] italic">"{selectedSubmission.studentNote}"</p>
                  </div>
                )}
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-[10px] text-[#7e84a8] uppercase tracking-wider font-semibold mb-0.5">Total Skor</p>
                <p className="text-[20px] font-black text-[#715ed7] leading-none">
                  {selectedSubmission.score !== null ? selectedSubmission.score : "-"}
                  <span className="text-[12px] text-[#a5aecf]">/100</span>
                </p>
              </div>
            </div>

            {/* Content Area: Files & Rubrics */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              
              {/* File Viewer Placeholder */}
              <div className="rounded-[10px] border border-[rgba(113,94,215,0.1)] bg-[#faf9ff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b4aab] mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> File Lampiran Tugas
                </p>
                
                {selectedSubmission.files && selectedSubmission.files.length > 0 ? (
                  <div className="space-y-2">
                    {selectedSubmission.files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-[8px] border border-[rgba(113,94,215,0.12)] bg-white p-2 transition-all hover:border-[rgba(113,94,215,0.3)]">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-[#f0edff] text-[#715ed7]">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold text-[#2b325b]">{file.name}</p>
                            <p className="text-[9px] text-[#7e84a8]">{file.size}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#6f759a] hover:bg-[#f0edff] hover:text-[#715ed7] transition-colors" title="Lihat Dokumen">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#6f759a] hover:bg-[#f0edff] hover:text-[#715ed7] transition-colors" title="Download">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-[#7e84a8] italic">Tidak ada file yang dilampirkan.</p>
                )}
              </div>

              {/* Rubric Grading Section */}
              <div className="rounded-[10px] border border-[rgba(113,94,215,0.1)] bg-[#faf9ff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5b4aab] mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Penilaian Rubrik
                </p>
                
                <div className="space-y-2">
                  {selectedSubmission.rubrics.map((rubric) => (
                    <div key={rubric.id} className="grid grid-cols-[1fr_auto] gap-3 items-center rounded-[8px] border border-[rgba(113,94,215,0.08)] bg-white p-2.5">
                      <p className="text-[11px] font-semibold text-[#4e5378]">{rubric.name}</p>
                      <div className="flex items-center gap-1.5">
                        <input 
                          type="number" 
                          value={rubric.score ?? ''} 
                          onChange={(e) => handleUpdateRubric(selectedSubmission.id, rubric.id, Number(e.target.value))}
                          className="w-14 rounded-[6px] border border-[rgba(113,94,215,0.15)] bg-[#faf9ff] px-2 py-1 text-[11px] text-center font-bold text-[#4e5378] outline-none focus:border-[#715ed7]" 
                          placeholder="0"
                        />
                        <span className="text-[10px] text-[#a5aecf] font-semibold">/ {rubric.maxScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Section */}
              <label className="block rounded-[10px] border border-[rgba(113,94,215,0.1)] bg-[#faf9ff] p-3">
                <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5b4aab]">
                  <AlertCircle className="w-3.5 h-3.5" /> Feedback Guru
                </span>
                <textarea 
                  value={selectedSubmission.teacherFeedback || ''}
                  onChange={(e) => handleUpdateFeedback(selectedSubmission.id, e.target.value)}
                  className="h-20 w-full resize-none rounded-[8px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5 text-[11px] text-[#4f5678] outline-none focus:border-[#715ed7]" 
                  placeholder="Berikan catatan, masukan, atau alasan mengapa siswa perlu melakukan revisi..."
                />
              </label>

            </div>

            {/* Bottom Actions */}
            <div className="mt-3 shrink-0 rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleAction(selectedSubmission.id, 'draft')} className="cursor-pointer rounded-[8px] border border-[#bdb6f6] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#5b6191] transition-all hover:bg-[#f0edff] active:scale-95">
                    Simpan Draft
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleAction(selectedSubmission.id, 'revision')} className="cursor-pointer rounded-[8px] border border-[#f0b16b] bg-[#fff8ef] px-3 py-1.5 text-[10px] font-semibold text-[#c1782c] transition-all hover:bg-[#fdf0e0] active:scale-95">
                    Minta Revisi
                  </button>
                  <button onClick={() => handleAction(selectedSubmission.id, 'publish')} className="cursor-pointer rounded-[8px] bg-gradient-to-r from-[#56bf7a] to-[#36a662] px-4 py-1.5 text-[10px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm">
                    Publish Nilai
                  </button>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FileText className="mx-auto h-8 w-8 text-[#d1d5db] mb-2" />
              <p className="text-[11px] text-[#6f759a]">Pilih submission tugas untuk melihat detail.</p>
            </div>
          )}
        </Surface>
      </section>
    </div>
  );
}
