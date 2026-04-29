import {
  AgendaItem,
  DashboardData,
  LessonDetail,
  ModuleDetail,
  ModuleSummary,
  ProfileDetail,
  QuizDetail,
  SidebarEntry,
  TaskDetail
} from "@/lib/types";

const hospitalitySidebar: SidebarEntry[] = [
  {
    id: "301",
    title: "Pengantar Front Office",
    type: "lesson",
    href: "/lessons/301",
    isLocked: false,
    isCompleted: false,
    section: "Section 1"
  },
  {
    id: "401",
    title: "Quiz Layanan Tamu",
    type: "quiz",
    href: "/quizzes/401",
    isLocked: false,
    isCompleted: false,
    section: "Section 1"
  },
  {
    id: "501",
    title: "Tugas Simulasi Check-in",
    type: "task",
    href: "/tasks/501",
    isLocked: false,
    isCompleted: false,
    section: "Section 1"
  },
  {
    id: "302",
    title: "Standar Grooming",
    type: "lesson",
    href: "/lessons/302",
    isLocked: true,
    isCompleted: false,
    section: "Section 2"
  }
];

export const mockProfile: ProfileDetail = {
  id: "u-01",
  name: "Muhammad Fadlil Habill",
  email: "student@akara.sch.id",
  className: "Kelas 12 - A",
  department: "Perhotelan",
  weeklyProgress: 85,
  phone: "0812-7788-9900",
  bio: "Siswa aktif yang fokus pada service excellence, front office flow, dan hospitality communication.",
  nisn: "9988776655"
};

export const mockModules: ModuleSummary[] = [
  {
    id: "hospitality-12a",
    title: "Front Office Hospitality",
    department: "Perhotelan",
    teacher: "Bu Rani Oktavia",
    totalItems: 12,
    completionPercent: 68,
    nextItemTitle: "Pengantar Front Office",
    accent: "#0E5BFF",
    bannerLabel: "6 lesson • 3 quiz • 3 task"
  },
  {
    id: "culinary-lab",
    title: "Culinary Production Lab",
    department: "Kuliner",
    teacher: "Pak Arya Suranta",
    totalItems: 14,
    completionPercent: 41,
    nextItemTitle: "Food Costing Essentials",
    accent: "#F59E0B",
    bannerLabel: "8 lesson • 2 quiz • 4 task"
  },
  {
    id: "design-studio",
    title: "Design Communication Studio",
    department: "DKV",
    teacher: "Bu Ninda Prameswari",
    totalItems: 10,
    completionPercent: 92,
    nextItemTitle: "Portfolio Review Final",
    accent: "#0F766E",
    bannerLabel: "5 lesson • 2 quiz • 3 task"
  }
];

export const mockModuleDetails: ModuleDetail[] = [
  {
    ...mockModules[0],
    description:
      "Modul ini menyiapkan alur layanan tamu dari pre-arrival sampai check-out, termasuk komunikasi, grooming, dan complaint handling.",
    sections: [
      {
        id: "section-1",
        title: "Section 1 - Guest Arrival",
        description: "Dasar layanan tamu saat kedatangan dan komunikasi awal di area resepsionis.",
        items: hospitalitySidebar.slice(0, 3)
      },
      {
        id: "section-2",
        title: "Section 2 - Service Standards",
        description: "Materi lanjutan yang akan terbuka setelah section pertama selesai.",
        items: hospitalitySidebar.slice(3)
      }
    ]
  },
  {
    ...mockModules[1],
    description:
      "Pembelajaran kitchen workflow, mise en place, dan cost control untuk produksi kuliner skala sekolah dan industri.",
    sections: [
      {
        id: "section-1",
        title: "Section 1 - Kitchen Setup",
        description: "Persiapan area kerja, sanitasi, dan kontrol bahan dasar.",
        items: [
          {
            id: "611",
            title: "Kitchen Workflow",
            type: "lesson",
            href: "/modules/culinary-lab",
            isLocked: false,
            isCompleted: true,
            section: "Section 1"
          }
        ]
      }
    ]
  },
  {
    ...mockModules[2],
    description:
      "Rangkaian pembelajaran komunikasi visual, presentasi konsep, dan finalisasi portfolio siswa.",
    sections: [
      {
        id: "section-1",
        title: "Section 1 - Brand Visual",
        description: "Eksplorasi gaya visual dan struktur presentasi portfolio.",
        items: [
          {
            id: "711",
            title: "Visual Narrative",
            type: "lesson",
            href: "/modules/design-studio",
            isLocked: false,
            isCompleted: true,
            section: "Section 1"
          }
        ]
      }
    ]
  }
];

export const mockLesson: LessonDetail = {
  id: "301",
  moduleId: "hospitality-12a",
  title: "Pengantar Front Office",
  contentType: "video",
  contentUrl: "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
  excerpt:
    "Lesson ini membahas peran front office dalam first impression tamu, standar komunikasi, dan urutan check-in dasar.",
  body:
    "Fokus utama lesson adalah memahami titik kontak pertama dengan tamu, memastikan komunikasi profesional, serta menjaga ritme layanan tetap konsisten. Pada implementasi backend nanti, content dapat diambil dari tipe text, pdf, video, atau link sesuai field content_type.",
  durationTargetSeconds: 900,
  trackedSeconds: 540,
  isCompleted: false,
  sidebar: hospitalitySidebar,
  tips: [
    "Kirim durasi secara berkala ke endpoint /api/lessons/{id}/duration.",
    "Aktifkan tombol complete hanya setelah durasi minimum terpenuhi.",
    "Status locked dan completed diambil dari sidebar hasil olahan backend."
  ]
};

export const mockQuiz: QuizDetail = {
  id: "401",
  moduleId: "hospitality-12a",
  title: "Quiz Layanan Tamu",
  intro:
    "Quiz ini menguji pemahaman alur check-in, etika komunikasi, dan penanganan basic guest request.",
  passScore: 75,
  durationMinutes: 20,
  questionOrder: ["q3", "q1", "q2"],
  questions: [
    {
      id: "q1",
      prompt: "Apa tujuan utama greeting di front office?",
      options: [
        { key: "a", label: "Memberikan first impression yang profesional" },
        { key: "b", label: "Mempercepat semua proses tanpa verifikasi" },
        { key: "c", label: "Menghindari interaksi personal" },
        { key: "d", label: "Menawarkan semua upgrade secara langsung" }
      ],
      correctOption: "a"
    },
    {
      id: "q2",
      prompt: "Dokumen apa yang perlu diverifikasi saat check-in?",
      options: [
        { key: "a", label: "Daftar menu restoran" },
        { key: "b", label: "Identitas dan data reservasi tamu" },
        { key: "c", label: "Laporan housekeeping harian" },
        { key: "d", label: "Surat penawaran vendor" }
      ],
      correctOption: "b"
    },
    {
      id: "q3",
      prompt: "Jika tamu menyampaikan komplain ringan, langkah pertama yang tepat adalah?",
      options: [
        { key: "a", label: "Menjelaskan aturan hotel tanpa mendengar masalah" },
        { key: "b", label: "Meminta tamu menunggu tanpa kepastian" },
        { key: "c", label: "Mendengarkan aktif dan mengklarifikasi kebutuhan tamu" },
        { key: "d", label: "Langsung mengalihkan ke departemen lain" }
      ],
      correctOption: "c"
    }
  ],
  penaltyNote:
    "Centang simulasi fullscreen violation untuk menguji alur penalti pada submit endpoint.",
  sidebar: hospitalitySidebar
};

export const mockTask: TaskDetail = {
  id: "501",
  moduleId: "hospitality-12a",
  title: "Tugas Simulasi Check-in",
  description:
    "Buat video simulasi check-in tamu dan unggah link drive yang dapat diakses guru. Tugas mendukung revisi bila catatan guru belum terpenuhi.",
  deadline: "2026-05-05T10:00:00+07:00",
  allowRevision: true,
  currentSubmission: {
    link: "https://drive.google.com/file/d/demo-checkin",
    status: "revision",
    submittedAt: "2026-04-27T15:00:00+07:00",
    teacherNote: "Perjelas script greeting awal dan tambahkan konfirmasi data reservasi."
  },
  sidebar: hospitalitySidebar,
  checklist: [
    "Pastikan link dapat diakses tanpa request manual.",
    "Cantumkan nama siswa dan kelas pada judul file.",
    "Ikuti skenario tamu datang, verifikasi, dan penutupan interaksi."
  ]
};

export function buildDashboardData(): DashboardData {
  const upcomingQuizzes: AgendaItem[] = [
    {
      id: "401",
      title: "Quiz Layanan Tamu",
      type: "quiz",
      dueAt: "2026-05-01T08:30:00+07:00",
      moduleTitle: "Front Office Hospitality",
      status: "scheduled",
      href: "/quizzes/401"
    }
  ];

  const upcomingTasks: AgendaItem[] = [
    {
      id: "501",
      title: "Tugas Simulasi Check-in",
      type: "task",
      dueAt: mockTask.deadline,
      moduleTitle: "Front Office Hospitality",
      status: mockTask.currentSubmission?.status === "revision" ? "revision" : "due-soon",
      href: "/tasks/501"
    }
  ];

  return {
    user: mockProfile,
    metrics: [
      {
        label: "Modul aktif",
        value: mockModules.length,
        helper: "Gabungan modul lintas jurusan yang sedang Anda ikuti.",
        tone: "gold"
      },
      {
        label: "Progress mingguan",
        value: mockProfile.weeklyProgress,
        helper: "Target belajar mingguan yang berhasil dicapai.",
        tone: "sky"
      },
      {
        label: "Perlu revisi",
        value: mockTask.currentSubmission?.status === "revision" ? 1 : 0,
        helper: "Task yang masih menunggu perbaikan submission.",
        tone: "mint"
      }
    ],
    modules: mockModules,
    upcomingQuizzes,
    upcomingTasks
  };
}
