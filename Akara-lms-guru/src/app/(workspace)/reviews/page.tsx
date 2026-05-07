"use client";

import { ArrowLeftRight, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle, FileQuestion, Check, X } from "lucide-react";
import { Badge, MiniInput, MiniSelect, PageHeader, Surface } from "@/components/workspace/ui";
import { useToast } from "@/components/workspace/toast";
import { useState, useMemo, useEffect } from "react";
import { modules } from "@/lib/teacher-mocks";

// Mock data specific for Quiz Review
const quizSubmissions = [
  {
    id: "qs-1",
    student: "Liam Johnson",
    className: "9A",
    subject: "Sains Terapan",
    quizName: "Kuis Bab 3 - Gaya dan Gerak",
    submittedAt: "10:30 AM",
    status: "submitted",
    score: 85,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Berapa percepatan gravitasi bumi secara umum?",
        studentAnswer: "9.8 m/s²",
        correctAnswer: "9.8 m/s²",
        isCorrect: true,
        points: 10,
        maxPoints: 10,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Hukum gerak Newton yang pertama disebut juga sebagai?",
        studentAnswer: "Hukum Aksi-Reaksi",
        correctAnswer: "Hukum Kelembaman (Inersia)",
        isCorrect: false,
        points: 0,
        maxPoints: 10,
      },
      {
        id: "q3",
        type: "essay",
        question: "Jelaskan dengan singkat apa yang dimaksud dengan gaya gesek statis!",
        studentAnswer: "Gaya gesek statis adalah gaya gesek yang terjadi ketika benda diam dan belum bergerak. Menahan benda agar tidak bergeser.",
        correctAnswer: "Panduan Jawaban: Menyebutkan bahwa gaya gesek statis bekerja pada benda yang diam hingga tepat akan bergerak.",
        isCorrect: null, // needs manual review
        points: 15,
        maxPoints: 20,
      }
    ]
  },
  {
    id: "qs-2",
    student: "Noah Williams",
    className: "9A",
    subject: "Sains Terapan",
    quizName: "Kuis Bab 3 - Gaya dan Gerak",
    submittedAt: "10:45 AM",
    status: "graded",
    score: 95,
    questions: [
      {
        id: "q1",
        type: "multiple-choice",
        question: "Berapa percepatan gravitasi bumi secara umum?",
        studentAnswer: "9.8 m/s²",
        correctAnswer: "9.8 m/s²",
        isCorrect: true,
        points: 10,
        maxPoints: 10,
      },
      {
        id: "q3",
        type: "essay",
        question: "Jelaskan dengan singkat apa yang dimaksud dengan gaya gesek statis!",
        studentAnswer: "Gaya yang bekerja pada benda yang diam hingga tepat akan bergerak.",
        correctAnswer: "Panduan Jawaban: Menyebutkan bahwa gaya gesek statis bekerja pada benda yang diam hingga tepat akan bergerak.",
        isCorrect: null,
        points: 20,
        maxPoints: 20,
      }
    ]
  },
  {
    id: "qs-3",
    student: "Emma Brown",
    className: "9B",
    subject: "Sains Terapan",
    quizName: "Kuis Bab 3 - Gaya dan Gerak",
    submittedAt: "11:00 AM",
    status: "late",
    score: 70,
    questions: []
  }
];

export default function QuizReviewsPage() {
  const { toast } = useToast();

  const [subjectFilter, setSubjectFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [quizFilter, setQuizFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredSubmissions = useMemo(() => {
    return quizSubmissions.filter((s) => {
      if (subjectFilter && s.subject !== subjectFilter) return false;
      if (classFilter && s.className !== classFilter) return false;
      if (quizFilter && s.quizName !== quizFilter) return false;
      if (statusFilter && s.status !== statusFilter) return false;
      return true;
    });
  }, [subjectFilter, classFilter, quizFilter, statusFilter]);

  const [selectedSubmission, setSelectedSubmission] = useState(filteredSubmissions[0] || null);

  useEffect(() => {
    if (filteredSubmissions.length > 0 && !filteredSubmissions.find(s => s.id === selectedSubmission?.id)) {
      setSelectedSubmission(filteredSubmissions[0]);
    } else if (filteredSubmissions.length === 0) {
      setSelectedSubmission(null);
    }
  }, [filteredSubmissions, selectedSubmission]);

  return (
    <div className="grid min-h-full grid-rows-[auto_auto_minmax(0,1fr)] gap-2">
      <PageHeader
        title="Review Kuis Siswa"
        description="Filter berdasarkan mata pelajaran dan kelas untuk mereview hasil kuis siswa secara detail."
      />

      <Surface title="Filter Konteks Kuis">
        <div className="grid gap-2 md:grid-cols-4">
          <MiniSelect 
            label="Mata Pelajaran" 
            options={Array.from(new Set(quizSubmissions.map(s => s.subject)))} 
            placeholder="Pilih Mata Pelajaran" 
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
          />
          <MiniSelect 
            label="Kelas" 
            options={Array.from(new Set(quizSubmissions.map(s => s.className)))} 
            placeholder="Pilih Kelas" 
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
          />
          <MiniSelect 
            label="Kuis" 
            options={Array.from(new Set(quizSubmissions.map(s => s.quizName)))} 
            placeholder="Pilih Kuis" 
            value={quizFilter}
            onChange={e => setQuizFilter(e.target.value)}
          />
          <MiniSelect 
            label="Status Review" 
            options={Array.from(new Set(quizSubmissions.map(s => s.status)))} 
            placeholder="Semua Status" 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          />
        </div>
      </Surface>

      <section className="grid min-h-0 gap-2 xl:grid-cols-[0.8fr_1.2fr]">
        <Surface title="Daftar Siswa (Queue)">
          <div className="flex-1 min-h-0 overflow-auto rounded-[12px] border border-[rgba(113,94,215,0.1)]">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((row) => (
                <button
                  key={row.id}
                  onClick={() => setSelectedSubmission(row)}
                  className={`flex w-full cursor-pointer items-start justify-between border-b px-3 py-2.5 text-left transition-all active:scale-[0.99] last:border-b-0 ${selectedSubmission?.id === row.id
                      ? "border-[rgba(113,94,215,0.4)] bg-[#f0edff]"
                      : "border-[rgba(113,94,215,0.1)] hover:bg-[#faf9ff]"
                    }`}
                >
                  <span>
                    <span className="block text-[11px] font-semibold text-[#4e5378]">{row.student}</span>
                    <span className="block text-[10px] text-[#6f759a]">{row.quizName}</span>
                    <span className="block text-[9px] text-[#7e84a8]">Kelas {row.className} • Submit: {row.submittedAt}</span>
                  </span>
                  <div className="text-right flex flex-col items-end gap-1">
                    <Badge status={row.status} />
                    <span className="block text-[11px] font-bold text-[#4e5378]">Skor: {row.score}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center">
                <p className="text-[10px] text-[#7e84a8]">Tidak ada kuis yang cocok dengan filter.</p>
              </div>
            )}
          </div>
        </Surface>

        <Surface title="Detail Jawaban Kuis">
          {selectedSubmission ? (
            <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
              {/* Header info kuis */}
            <div className="mb-2 shrink-0 rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-3 flex justify-between items-center">
              <div>
                <p className="text-[12px] font-bold text-[#2b325b]">{selectedSubmission.student}</p>
                <p className="text-[10px] text-[#6f759a]">{selectedSubmission.subject} • Kelas {selectedSubmission.className}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#7e84a8] uppercase tracking-wider font-semibold mb-0.5">Total Skor</p>
                <p className="text-[20px] font-black text-[#715ed7] leading-none">{selectedSubmission.score}<span className="text-[12px] text-[#a5aecf]">/100</span></p>
              </div>
            </div>

            {/* List of Questions / Review Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-3">
              {selectedSubmission.questions && selectedSubmission.questions.length > 0 ? (
                selectedSubmission.questions.map((q, idx) => (
                  <div key={q.id} className="rounded-[10px] border border-[rgba(113,94,215,0.1)] bg-[#faf9ff] p-3">
                    <div className="flex justify-between items-start mb-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3e0fc] px-2 py-0.5 text-[9px] font-bold text-[#5b4aab]">
                        <FileQuestion className="w-3 h-3" /> Soal {idx + 1}
                      </span>
                      <span className="text-[10px] font-semibold text-[#6f759a]">
                        Poin: <span className="text-[#2b325b] font-bold">{q.points}</span>/{q.maxPoints}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-[#2b325b] mb-2 leading-relaxed">{q.question}</p>

                    <div className="space-y-2">
                      <div className="rounded-[8px] bg-white p-2 border border-[rgba(113,94,215,0.08)]">
                        <p className="text-[9px] font-semibold uppercase text-[#a5aecf] mb-1">Jawaban Siswa</p>
                        <div className="flex items-start gap-2">
                          {q.type !== 'essay' && (
                            q.isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          )}
                          <p className={`text-[11px] ${q.type !== 'essay' ? (q.isCorrect ? 'text-green-700' : 'text-red-600') : 'text-[#4e5378]'}`}>
                            {q.studentAnswer}
                          </p>
                        </div>
                      </div>

                      {(!q.isCorrect || q.type === 'essay') && (
                        <div className="rounded-[8px] bg-[#f2fcf5] p-2 border border-[#d3f4dd]">
                          <p className="text-[9px] font-semibold uppercase text-[#56bf7a] mb-1">Kunci Jawaban / Panduan</p>
                          <p className="text-[10px] text-[#2e6b42]">{q.correctAnswer}</p>
                        </div>
                      )}

                      {q.type === 'essay' && (
                        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2 items-end pt-2 border-t border-[rgba(113,94,215,0.08)]">
                          <label className="block">
                            <span className="mb-1 block text-[9.5px] font-semibold text-[#7e84a8]">Catatan Guru (Opsional)</span>
                            <input type="text" className="w-full rounded-[6px] border border-[rgba(113,94,215,0.15)] bg-white px-2 py-1.5 text-[10px] outline-none focus:border-[#715ed7]" placeholder="Tambahkan komentar..." />
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9.5px] font-semibold text-[#7e84a8]">Beri Poin:</span>
                            <input type="number" defaultValue={q.points} className="w-14 rounded-[6px] border border-[rgba(113,94,215,0.15)] bg-white px-2 py-1.5 text-[10px] text-center font-bold text-[#4e5378] outline-none focus:border-[#715ed7]" />
                            <span className="text-[9.5px] text-[#a5aecf]">/{q.maxPoints}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <AlertCircle className="mx-auto h-8 w-8 text-[#d1d5db] mb-2" />
                  <p className="text-[11px] text-[#6f759a]">Detail jawaban tidak tersedia.</p>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-3 shrink-0 rounded-[12px] border border-[rgba(113,94,215,0.12)] bg-white p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => toast.success("Draft nilai disimpan")} className="cursor-pointer rounded-[8px] border border-[#bdb6f6] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#5b6191] transition-all hover:bg-[#f0edff] active:scale-95">
                    Simpan Draft
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toast.success("Permintaan re-take dikirim")} className="cursor-pointer rounded-[8px] border border-[#f0b16b] bg-[#fff8ef] px-3 py-1.5 text-[10px] font-semibold text-[#c1782c] transition-all hover:bg-[#fdf0e0] active:scale-95">
                    Minta Re-take
                  </button>
                  <button onClick={() => toast.success("Nilai kuis di-publish ke siswa")} className="cursor-pointer rounded-[8px] bg-gradient-to-r from-[#56bf7a] to-[#36a662] px-4 py-1.5 text-[10px] font-semibold text-white transition-all hover:opacity-90 active:scale-95 shadow-sm">
                    Publish Nilai
                  </button>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FileQuestion className="mx-auto h-8 w-8 text-[#d1d5db] mb-2" />
              <p className="text-[11px] text-[#6f759a]">Pilih submission kuis untuk melihat detail.</p>
            </div>
          )}
        </Surface>
      </section>
    </div>
  );
}
