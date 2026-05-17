import {
  ContentType,
  CurrentSubmission,
  ProfileDetail,
  QuizQuestion,
  SidebarItemType
} from "@/lib/types";

export interface MockLessonSeed {
  contentType: ContentType;
  contentUrl: string;
  excerpt: string;
  content: string;
  durationTargetSeconds: number;
  tips: string[];
}

export interface MockQuizSeed {
  intro: string;
  passScore: number;
  durationMinutes: number;
  dueAt: string;
  penaltyNote: string;
  questions: QuizQuestion[];
}

export interface MockTaskSeed {
  description: string;
  dueAt: string;
  allowRevision: boolean;
  submitMethod?: "link" | "file" | "file_link";
  attachment?: {
    fileName: string;
    mimeType: string;
    url: string;
  };
  checklist: string[];
}

export interface MockModuleItemSeed {
  id: string;
  title: string;
  type: SidebarItemType;
  bab: string;
  lesson?: MockLessonSeed;
  quiz?: MockQuizSeed;
  task?: MockTaskSeed;
}

export interface MockModuleSectionSeed {
  id: string;
  title: string;
  description: string;
  items: MockModuleItemSeed[];
}

export interface MockModuleBlueprint {
  id: string;
  title: string;
  department: string;
  teacher: string;
  accent: string;
  description: string;
  sections: MockModuleSectionSeed[];
}

function buildQuestions(prefix: string, prompts: Array<{ prompt: string; options: string[]; correct: string }>) {
  return prompts.map((item, index) => ({
    id: `${prefix}-q${index + 1}`,
    prompt: item.prompt,
    options: item.options.map((label, optionIndex) => ({
      key: String.fromCharCode(97 + optionIndex),
      label
    })),
    correctOption: item.correct
  }));
}

function lesson(
  id: string,
  bab: string,
  title: string,
  seed: MockLessonSeed
): MockModuleItemSeed {
  return {
    id,
    bab,
    title,
    type: "lesson",
    lesson: seed
  };
}

function quiz(
  id: string,
  bab: string,
  title: string,
  seed: MockQuizSeed
): MockModuleItemSeed {
  return {
    id,
    bab,
    title,
    type: "quiz",
    quiz: seed
  };
}

function task(
  id: string,
  bab: string,
  title: string,
  seed: MockTaskSeed
): MockModuleItemSeed {
  return {
    id,
    bab,
    title,
    type: "task",
    task: seed
  };
}

export const mockProfile: ProfileDetail = {
  id: "u-01",
  fullName: "Muhammad Fadlil Habill",
  email: "student@akara.sch.id",
  className: "Kelas 12 - A",
  department: "Perhotelan",
  weeklyProgress: 72,
  phone: "0812-7788-9900",
  bio: "Siswa aktif yang fokus pada service excellence, hospitality workflow, dan presentasi tugas praktik.",
  nisn: "9988776655"
};

export const mockModuleBlueprints: MockModuleBlueprint[] = [
  {
    id: "hospitality-12a",
    title: "Front Office Hospitality",
    department: "Perhotelan",
    teacher: "Bu Rani Oktavia",
    accent: "#0E5BFF",
    description:
      "Pembelajaran operasional front office mulai dari first impression, reservation handling, sampai service recovery di akhir layanan tamu.",
    sections: [
      {
        id: "fo-bab-1",
        title: "Bab 1 - Guest Arrival",
        description: "Dasar komunikasi awal, etika menyambut tamu, dan struktur check-in.",
        items: [
          lesson("fo-l1", "Bab 1", "Pengantar Front Office", {
            contentType: "video",
            contentUrl: "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE",
            excerpt:
              "Materi pembuka tentang peran front office dalam membangun first impression dan ritme pelayanan tamu.",
            content:
              "Bab ini membahas titik kontak pertama dengan tamu, standar komunikasi, bahasa tubuh profesional, dan urutan check-in dasar agar pelayanan terasa konsisten.",
            durationTargetSeconds: 900,
            tips: [
              "Pastikan greeting dibuka dengan kontak mata dan salam yang konsisten.",
              "Catat poin verifikasi reservasi sebelum masuk ke penjelasan fasilitas.",
              "Tandai lesson selesai setelah durasi minimum terpenuhi."
            ]
          }),
          quiz("fo-q1", "Bab 1", "Quiz Layanan Tamu Awal", {
            intro:
              "Quiz ini menguji pemahaman greeting, verifikasi reservasi, dan respon awal ketika tamu menyampaikan kebutuhan.",
            passScore: 75,
            durationMinutes: 20,
            dueAt: "2026-05-03T09:00:00+07:00",
            penaltyNote:
              "Centang simulasi fullscreen violation untuk menguji pengurangan skor pada mock backend.",
            questions: buildQuestions("fo-q1", [
              {
                prompt: "Apa tujuan utama greeting di front office?",
                options: [
                  "Membangun first impression yang profesional",
                  "Mempercepat proses tanpa verifikasi",
                  "Menghindari interaksi terlalu lama",
                  "Menawarkan semua layanan premium di awal"
                ],
                correct: "a"
              },
              {
                prompt: "Data apa yang wajib dipastikan saat check-in?",
                options: [
                  "Daftar menu restoran",
                  "Identitas dan data reservasi tamu",
                  "Laporan housekeeping mingguan",
                  "Riwayat keluhan tamu lain"
                ],
                correct: "b"
              },
              {
                prompt: "Respon awal terbaik saat tamu bertanya tentang fasilitas hotel adalah?",
                options: [
                  "Mengarahkan tanpa penjelasan",
                  "Memberi jawaban singkat lalu pergi",
                  "Menjelaskan singkat dan memastikan kebutuhan tamu",
                  "Menyuruh tamu bertanya ke bagian lain"
                ],
                correct: "c"
              }
            ])
          }),
          task("fo-t1", "Bab 1", "Tugas Simulasi Greeting", {
            description:
              "Rekam simulasi greeting dan check-in awal selama 2-3 menit. Unggah video ke drive dan pastikan link dapat diakses guru.",
            dueAt: "2026-05-04T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Sebutkan salam pembuka dan nama petugas.",
              "Lakukan verifikasi nama tamu dan reservasi.",
              "Tutup interaksi dengan konfirmasi kebutuhan lanjutan."
            ]
          })
        ]
      },
      {
        id: "fo-bab-2",
        title: "Bab 2 - Reservation Handling",
        description: "Pencatatan kebutuhan tamu, upselling wajar, dan akurasi data reservasi.",
        items: [
          lesson("fo-l2", "Bab 2", "Manajemen Reservasi Dasar", {
            contentType: "pdf",
            contentUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
            excerpt:
              "Materi ini menekankan pentingnya akurasi input data reservasi, kebutuhan khusus tamu, dan validasi sebelum check-in.",
            content:
              "Siswa belajar membaca reservation note, memeriksa permintaan khusus, menyelaraskan tipe kamar, serta menghindari mismatch data yang memicu komplain.",
            durationTargetSeconds: 780,
            tips: [
              "Pastikan jenis kamar sesuai dengan reservasi.",
              "Catat kebutuhan khusus tamu secara ringkas dan jelas.",
              "Jangan lanjutkan transaksi jika data belum valid."
            ]
          }),
          quiz("fo-q2", "Bab 2", "Quiz Validasi Reservasi", {
            intro:
              "Quiz untuk memastikan siswa memahami validasi data reservasi, special request, dan etika upselling.",
            passScore: 80,
            durationMinutes: 15,
            dueAt: "2026-05-06T09:00:00+07:00",
            penaltyNote:
              "Gunakan simulasi fullscreen violation bila ingin menguji kondisi penalti saat submit.",
            questions: buildQuestions("fo-q2", [
              {
                prompt: "Apa yang harus diperiksa sebelum menawarkan upgrade kamar?",
                options: [
                  "Mood petugas",
                  "Kesesuaian reservasi dan kebutuhan tamu",
                  "Promo restoran harian",
                  "Komentar tamu sebelumnya"
                ],
                correct: "b"
              },
              {
                prompt: "Jika data reservasi tidak sinkron, langkah pertama adalah?",
                options: [
                  "Meminta tamu mencari sendiri bukti reservasi",
                  "Melanjutkan check-in agar cepat selesai",
                  "Verifikasi ulang data dan konfirmasi ke sistem",
                  "Mengganti tipe kamar tanpa persetujuan"
                ],
                correct: "c"
              },
              {
                prompt: "Special request tamu paling tepat dicatat di mana?",
                options: [
                  "Di catatan pribadi petugas",
                  "Di reservation note/sistem operasional",
                  "Di grup chat siswa",
                  "Di menu promosi"
                ],
                correct: "b"
              }
            ])
          }),
          task("fo-t2", "Bab 2", "Tugas Form Reservasi", {
            description:
              "Buat template pengecekan reservasi berisi nama tamu, tipe kamar, special request, dan status pembayaran.",
            dueAt: "2026-05-07T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Gunakan format tabel yang mudah dibaca.",
              "Cantumkan kolom validasi payment dan special request.",
              "Sertakan contoh data minimal tiga tamu."
            ]
          })
        ]
      },
      {
        id: "fo-bab-3",
        title: "Bab 3 - Complaint and Recovery",
        description: "Menangani komplain ringan, menawarkan solusi, dan menutup layanan dengan baik.",
        items: [
          lesson("fo-l3", "Bab 3", "Service Recovery Dasar", {
            contentType: "text",
            contentUrl: "",
            excerpt:
              "Fokus pada langkah mendengarkan komplain, mengklarifikasi akar masalah, dan menawarkan solusi yang realistis.",
            content: "Service recovery menuntut empati, kecepatan respon, dan dokumentasi insiden. Dalam praktiknya, siswa perlu tahu kapan memberi solusi langsung dan kapan melakukan eskalasi.",
            durationTargetSeconds: 840,
            tips: [
              "Dengarkan penuh sebelum merespon.",
              "Ulangi inti masalah agar tamu merasa dipahami.",
              "Tutup dengan langkah tindak lanjut yang jelas."
            ]
          }),
          quiz("fo-q3", "Bab 3", "Quiz Service Recovery", {
            intro:
              "Quiz evaluasi penanganan komplain, eskalasi, dan penutupan interaksi dengan tamu.",
            passScore: 80,
            durationMinutes: 15,
            dueAt: "2026-05-09T09:00:00+07:00",
            penaltyNote: "Simulasi fullscreen violation akan mengurangi skor akhir pada mode mock.",
            questions: buildQuestions("fo-q3", [
              {
                prompt: "Langkah pertama saat menerima komplain ringan adalah?",
                options: [
                  "Menyanggah keluhan tamu",
                  "Mendengarkan aktif dan mengklarifikasi masalah",
                  "Langsung memberi voucher",
                  "Menyuruh tamu bicara ke manajer"
                ],
                correct: "b"
              },
              {
                prompt: "Kapan eskalasi ke supervisor perlu dilakukan?",
                options: [
                  "Saat masalah di luar otoritas petugas",
                  "Setiap tamu mulai bicara",
                  "Hanya jika tamu meminta diskon",
                  "Setelah tamu pergi"
                ],
                correct: "a"
              },
              {
                prompt: "Penutupan interaksi terbaik setelah solusi diberikan adalah?",
                options: [
                  "Diam dan kembali bekerja",
                  "Menyalahkan departemen lain",
                  "Memastikan tamu memahami tindak lanjut",
                  "Mencatat keluhan tanpa konfirmasi"
                ],
                correct: "c"
              }
            ])
          }),
          task("fo-t3", "Bab 3", "Tugas Script Recovery", {
            description:
              "Tulis script service recovery untuk tiga skenario: kamar belum siap, AC bermasalah, dan tamu meminta kompensasi ringan.",
            dueAt: "2026-05-10T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Setiap skenario punya pembuka, klarifikasi, dan solusi.",
              "Gunakan bahasa profesional dan empatik.",
              "Cantumkan kapan kasus perlu dieskalasi."
            ]
          })
        ]
      }
    ]
  },
  {
    id: "culinary-lab",
    title: "Culinary Production Lab",
    department: "Kuliner",
    teacher: "Pak Arya Suranta",
    accent: "#F59E0B",
    description:
      "Modul praktik kitchen workflow, teknik memasak dasar, food costing, dan plating untuk layanan industri.",
    sections: [
      {
        id: "cl-bab-1",
        title: "Bab 1 - Kitchen Setup",
        description: "Sanitasi area kerja, alur kerja dapur, dan persiapan bahan.",
        items: [
          lesson("cl-l1", "Bab 1", "Kitchen Workflow", {
            contentType: "video",
            contentUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
            excerpt:
              "Memahami alur kerja station kitchen, sanitasi alat, dan pemetaan tugas saat service dimulai.",
            content:
              "Siswa mempelajari pembagian station, urutan mise en place, prosedur sanitasi dasar, dan koordinasi antar anggota tim di dapur produksi.",
            durationTargetSeconds: 720,
            tips: [
              "Pisahkan area prep dan plating.",
              "Gunakan checklist kebersihan sebelum service.",
              "Jaga alur bahan masuk dan keluar tetap rapi."
            ]
          }),
          quiz("cl-q1", "Bab 1", "Quiz Sanitasi Dapur", {
            intro:
              "Quiz ini menilai pemahaman sanitasi, mise en place, dan pembagian station kitchen.",
            passScore: 75,
            durationMinutes: 15,
            dueAt: "2026-05-02T13:00:00+07:00",
            penaltyNote: "Simulasi fullscreen violation meniru penalti saat siswa keluar dari mode fokus.",
            questions: buildQuestions("cl-q1", [
              {
                prompt: "Tujuan mise en place adalah?",
                options: [
                  "Menghias meja tamu",
                  "Menyiapkan bahan dan alat sebelum produksi",
                  "Mengurangi stok bahan",
                  "Mencatat penjualan akhir hari"
                ],
                correct: "b"
              },
              {
                prompt: "Langkah sanitasi paling awal sebelum produksi adalah?",
                options: [
                  "Memanaskan oven",
                  "Membersihkan area kerja dan alat",
                  "Membuat garnish",
                  "Menimbang hasil masak"
                ],
                correct: "b"
              },
              {
                prompt: "Pembagian station dibutuhkan agar?",
                options: [
                  "Tim bingung tugasnya",
                  "Alur produksi lebih terkontrol",
                  "Semua bahan dipakai bersamaan",
                  "Pekerjaan hanya fokus pada plating"
                ],
                correct: "b"
              }
            ])
          }),
          task("cl-t1", "Bab 1", "Checklist Mise en Place", {
            description:
              "Susun checklist mise en place untuk practical cooking session lengkap dengan alat, bahan, dan sanitation check.",
            dueAt: "2026-05-03T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Pisahkan bahan, alat, dan sanitation check.",
              "Gunakan format yang bisa dipakai ulang.",
              "Tambahkan kolom verifikasi akhir."
            ]
          })
        ]
      },
      {
        id: "cl-bab-2",
        title: "Bab 2 - Basic Cooking",
        description: "Teknik panas, kontrol kematangan, dan penilaian rasa dasar.",
        items: [
          lesson("cl-l2", "Bab 2", "Teknik Panas Dasar", {
            contentType: "text",
            contentUrl: "",
            excerpt:
              "Mengenal saute, boil, steam, dan cara memilih teknik panas sesuai karakter bahan.",
            content:
              "Teknik panas menentukan tekstur, rasa, dan konsistensi hasil akhir. Siswa perlu mengenali kapan memakai dry heat, moist heat, atau kombinasi keduanya.",
            durationTargetSeconds: 840,
            tips: [
              "Sesuaikan panas dengan jenis protein atau sayur.",
              "Catat perubahan tekstur saat latihan.",
              "Gunakan timer untuk menjaga konsistensi."
            ]
          }),
          quiz("cl-q2", "Bab 2", "Quiz Teknik Memasak", {
            intro:
              "Evaluasi pemahaman teknik panas, indikator kematangan, dan kesalahan umum saat memasak.",
            passScore: 80,
            durationMinutes: 20,
            dueAt: "2026-05-05T13:00:00+07:00",
            penaltyNote: "Aktifkan simulasi pelanggaran fullscreen untuk menguji penalti skor.",
            questions: buildQuestions("cl-q2", [
              {
                prompt: "Teknik steam cocok digunakan untuk?",
                options: [
                  "Menambah aroma bakar",
                  "Menjaga kelembapan bahan",
                  "Membuat permukaan renyah",
                  "Mengurangi warna bahan"
                ],
                correct: "b"
              },
              {
                prompt: "Indikator sederhana ayam matang adalah?",
                options: [
                  "Bagian dalam masih merah muda",
                  "Cairan keluar bening dan suhu cukup",
                  "Permukaan saja yang cokelat",
                  "Dimasak sangat cepat"
                ],
                correct: "b"
              },
              {
                prompt: "Kesalahan umum saute adalah?",
                options: [
                  "Wajan terlalu penuh",
                  "Bahan dipotong rapi",
                  "Api cukup stabil",
                  "Minyak dipanaskan dulu"
                ],
                correct: "a"
              }
            ])
          }),
          task("cl-t2", "Bab 2", "Laporan Praktik Memasak", {
            description:
              "Buat laporan singkat hasil praktik satu menu yang memuat teknik panas, durasi, dan evaluasi hasil rasa.",
            dueAt: "2026-05-06T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Cantumkan nama menu dan teknik utama.",
              "Tuliskan durasi memasak tiap tahap.",
              "Berikan evaluasi rasa, tekstur, dan plating."
            ]
          })
        ]
      },
      {
        id: "cl-bab-3",
        title: "Bab 3 - Costing and Plating",
        description: "Penghitungan biaya porsi, margin dasar, dan plating praktikal.",
        items: [
          lesson("cl-l3", "Bab 3", "Food Costing Essentials", {
            contentType: "link",
            contentUrl: "https://www.fao.org",
            excerpt:
              "Belajar menghitung biaya bahan per porsi, waste sederhana, dan margin dasar sebelum menentukan harga jual.",
            content:
              "Food costing membantu siswa memahami hubungan antara bahan baku, porsi, waste, dan target harga jual agar menu tetap efisien namun layak dijual.",
            durationTargetSeconds: 900,
            tips: [
              "Pisahkan bahan utama dan garnish.",
              "Hitung waste untuk bahan yang mengalami trimming.",
              "Bandingkan harga bahan per supplier."
            ]
          }),
          quiz("cl-q3", "Bab 3", "Quiz Food Costing", {
            intro:
              "Quiz ini menguji perhitungan biaya dasar, waste, dan keputusan harga jual sederhana.",
            passScore: 80,
            durationMinutes: 20,
            dueAt: "2026-05-08T13:00:00+07:00",
            penaltyNote: "Simulasi fullscreen violation tetap mengurangi skor pada mode mock.",
            questions: buildQuestions("cl-q3", [
              {
                prompt: "Food cost per porsi dipengaruhi oleh?",
                options: [
                  "Biaya bahan dan hasil porsi bersih",
                  "Jumlah pengikut media sosial",
                  "Warna seragam kitchen",
                  "Ukuran dapur"
                ],
                correct: "a"
              },
              {
                prompt: "Waste trimming perlu dihitung karena?",
                options: [
                  "Agar harga jual bisa lebih akurat",
                  "Agar garnish lebih banyak",
                  "Agar menu lebih cepat jadi",
                  "Agar station terlihat penuh"
                ],
                correct: "a"
              },
              {
                prompt: "Plating yang baik harus?",
                options: [
                  "Selalu sangat ramai",
                  "Mendukung porsi dan presentasi menu",
                  "Menutupi bahan utama",
                  "Mengabaikan warna"
                ],
                correct: "b"
              }
            ])
          }),
          task("cl-t3", "Bab 3", "Spreadsheet Costing Menu", {
            description:
              "Buat spreadsheet costing satu menu lengkap dengan bahan, harga satuan, waste, biaya per porsi, dan estimasi harga jual.",
            dueAt: "2026-05-09T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Minimal satu menu utama.",
              "Masukkan harga bahan dan waste.",
              "Sertakan perhitungan harga jual yang logis."
            ]
          })
        ]
      }
    ]
  },
  {
    id: "design-studio",
    title: "Design Communication Studio",
    department: "DKV",
    teacher: "Bu Ninda Prameswari",
    accent: "#0F766E",
    description:
      "Rangkaian belajar riset brand, visual identity, hingga portfolio presentation untuk siswa DKV.",
    sections: [
      {
        id: "ds-bab-1",
        title: "Bab 1 - Brand Research",
        description: "Menentukan target audiens, kata kunci visual, dan moodboard awal.",
        items: [
          lesson("ds-l1", "Bab 1", "Brand Research Dasar", {
            contentType: "video",
            contentUrl: "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U",
            excerpt:
              "Materi pengantar tentang riset audiens, benchmark visual, dan penyusunan moodboard proyek desain.",
            content:
              "Siswa diminta memahami siapa target audiensnya, gaya visual referensi, serta bagaimana menyaring insight riset menjadi arah konsep desain.",
            durationTargetSeconds: 780,
            tips: [
              "Mulai dari problem statement.",
              "Kumpulkan referensi visual dari brand sejenis.",
              "Pisahkan insight audiens dan preferensi pribadi."
            ]
          }),
          quiz("ds-q1", "Bab 1", "Quiz Riset Brand", {
            intro:
              "Quiz ini menilai pemahaman riset target audiens, benchmark kompetitor, dan moodboard.",
            passScore: 75,
            durationMinutes: 15,
            dueAt: "2026-05-02T10:00:00+07:00",
            penaltyNote: "Pelanggaran fullscreen dapat menurunkan skor pada mode mock.",
            questions: buildQuestions("ds-q1", [
              {
                prompt: "Tujuan utama brand research adalah?",
                options: [
                  "Membuat warna favorit desainer",
                  "Mengumpulkan insight sebelum merancang",
                  "Mempercepat render artwork",
                  "Menghapus tahap ideasi"
                ],
                correct: "b"
              },
              {
                prompt: "Moodboard membantu desainer untuk?",
                options: [
                  "Mengatur absensi kelas",
                  "Menyatukan arah visual",
                  "Menghitung biaya cetak",
                  "Mengganti identitas brand lain"
                ],
                correct: "b"
              },
              {
                prompt: "Benchmark kompetitor dilakukan agar?",
                options: [
                  "Meniru seluruh karya",
                  "Memahami pola visual pasar",
                  "Menghindari diskusi tim",
                  "Mengurangi eksplorasi"
                ],
                correct: "b"
              }
            ])
          }),
          task("ds-t1", "Bab 1", "Moodboard Identitas Brand", {
            description:
              "Susun moodboard digital berisi warna, tipografi, reference image, dan kata kunci brand.",
            dueAt: "2026-05-03T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Minimal 8 referensi visual.",
              "Cantumkan 3 kata kunci brand.",
              "Gunakan layout presentasi yang rapi."
            ]
          })
        ]
      },
      {
        id: "ds-bab-2",
        title: "Bab 2 - Visual Identity",
        description: "Eksplorasi logo, warna, dan sistem grafis untuk brand yang konsisten.",
        items: [
          lesson("ds-l2", "Bab 2", "Logo and Visual System", {
            contentType: "pdf",
            contentUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
            excerpt:
              "Mempelajari penyusunan logo, sistem warna, grid, dan elemen visual pendukung agar identitas brand konsisten.",
            content:
              "Bab ini mendorong siswa menyusun pilihan visual yang bisa dipertanggungjawabkan, bukan sekadar menarik secara estetika namun lemah secara konsep.",
            durationTargetSeconds: 840,
            tips: [
              "Uji logo pada ukuran kecil dan besar.",
              "Pastikan warna punya kontras yang jelas.",
              "Gunakan grid agar komposisi konsisten."
            ]
          }),
          quiz("ds-q2", "Bab 2", "Quiz Sistem Visual", {
            intro:
              "Quiz untuk menilai pemahaman sistem visual, konsistensi warna, dan fungsi grid.",
            passScore: 80,
            durationMinutes: 15,
            dueAt: "2026-05-05T10:00:00+07:00",
            penaltyNote: "Aktifkan simulasi pelanggaran fullscreen untuk uji penalti skor.",
            questions: buildQuestions("ds-q2", [
              {
                prompt: "Grid membantu proses desain karena?",
                options: [
                  "Membatasi kreativitas total",
                  "Menjaga konsistensi tata letak",
                  "Menghapus kebutuhan tipografi",
                  "Mengganti role art direction"
                ],
                correct: "b"
              },
              {
                prompt: "Sistem warna brand dibutuhkan agar?",
                options: [
                  "Setiap materi punya warna acak",
                  "Identitas visual lebih konsisten",
                  "Layout selalu penuh warna",
                  "Logo lebih rumit"
                ],
                correct: "b"
              },
              {
                prompt: "Logo yang baik harus?",
                options: [
                  "Sulit dibaca agar unik",
                  "Mudah dikenali dan sesuai konsep",
                  "Memakai semua warna sekaligus",
                  "Selalu berbentuk rumit"
                ],
                correct: "b"
              }
            ])
          }),
          task("ds-t2", "Bab 2", "Style Guide Ringkas", {
            description:
              "Buat style guide singkat berisi logo utama, warna, tipografi, dan contoh aplikasi identitas.",
            dueAt: "2026-05-06T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Masukkan logo, warna, dan tipografi.",
              "Tambahkan satu contoh aplikasi media sosial atau poster.",
              "Pastikan layout presentasi mudah dibaca."
            ]
          })
        ]
      },
      {
        id: "ds-bab-3",
        title: "Bab 3 - Portfolio Presentation",
        description: "Menyusun cerita proyek dan presentasi portfolio yang rapi untuk review.",
        items: [
          lesson("ds-l3", "Bab 3", "Portfolio Storytelling", {
            contentType: "link",
            contentUrl: "https://www.behance.net",
            excerpt:
              "Belajar menyusun urutan presentasi, menjelaskan proses, dan menutup portfolio dengan hasil yang kuat.",
            content:
              "Portfolio yang baik tidak hanya menampilkan hasil akhir, tetapi juga menjelaskan konteks, problem, proses eksplorasi, dan alasan desain final dipilih.",
            durationTargetSeconds: 900,
            tips: [
              "Mulai dari problem dan target audiens.",
              "Tampilkan proses sebelum hasil akhir.",
              "Tutup dengan insight atau evaluasi proyek."
            ]
          }),
          quiz("ds-q3", "Bab 3", "Quiz Presentasi Portfolio", {
            intro:
              "Quiz penutup untuk menguji struktur presentasi, storytelling desain, dan evaluasi karya.",
            passScore: 80,
            durationMinutes: 20,
            dueAt: "2026-05-08T10:00:00+07:00",
            penaltyNote: "Pelanggaran fullscreen pada mode mock akan menurunkan skor akhir.",
            questions: buildQuestions("ds-q3", [
              {
                prompt: "Presentasi portfolio ideal dimulai dari?",
                options: [
                  "Daftar software yang dipakai",
                  "Konteks masalah dan tujuan proyek",
                  "Hasil akhir tanpa penjelasan",
                  "Harga jasa desain"
                ],
                correct: "b"
              },
              {
                prompt: "Manfaat menampilkan proses eksplorasi adalah?",
                options: [
                  "Membuat slide lebih panjang saja",
                  "Menunjukkan alasan di balik keputusan visual",
                  "Mengganti hasil akhir",
                  "Menghindari pertanyaan reviewer"
                ],
                correct: "b"
              },
              {
                prompt: "Penutupan presentasi yang baik adalah?",
                options: [
                  "Langsung menutup file",
                  "Menegaskan hasil dan pembelajaran utama",
                  "Melewati sesi tanya jawab",
                  "Menghapus slide proses"
                ],
                correct: "b"
              }
            ])
          }),
          task("ds-t3", "Bab 3", "Deck Portfolio Final", {
            description:
              "Susun deck presentasi portfolio final 8-10 slide yang berisi konteks, proses, visual final, dan evaluasi proyek.",
            dueAt: "2026-05-09T17:00:00+07:00",
            allowRevision: false,
            checklist: [
              "Minimal 8 slide.",
              "Ada alur problem, proses, dan hasil akhir.",
              "Cantumkan satu slide evaluasi atau pembelajaran."
            ]
          })
        ]
      }
    ]
  }
];

export const initialItemCompletionState: Record<string, boolean> = {
  "fo-l1": false,
  "fo-q1": false,
  "fo-t1": false,
  "fo-l2": false,
  "fo-q2": false,
  "fo-t2": false,
  "fo-l3": false,
  "fo-q3": false,
  "fo-t3": false,
  "cl-l1": true,
  "cl-q1": true,
  "cl-t1": true,
  "cl-l2": false,
  "cl-q2": false,
  "cl-t2": false,
  "cl-l3": false,
  "cl-q3": false,
  "cl-t3": false,
  "ds-l1": true,
  "ds-q1": true,
  "ds-t1": true,
  "ds-l2": true,
  "ds-q2": true,
  "ds-t2": true,
  "ds-l3": false,
  "ds-q3": false,
  "ds-t3": false
};

export const initialLessonProgressState: Record<string, number> = {
  "fo-l1": 480,
  "fo-l2": 0,
  "fo-l3": 0,
  "cl-l1": 720,
  "cl-l2": 240,
  "cl-l3": 0,
  "ds-l1": 780,
  "ds-l2": 840,
  "ds-l3": 360
};

export const initialQuizScoreState: Record<string, number | undefined> = {
  "fo-q1": undefined,
  "fo-q2": undefined,
  "fo-q3": undefined,
  "cl-q1": 90,
  "cl-q2": undefined,
  "cl-q3": undefined,
  "ds-q1": 88,
  "ds-q2": 92,
  "ds-q3": undefined
};

export const initialTaskSubmissionState: Record<string, CurrentSubmission | undefined> = {
  "fo-t1": undefined,
  "fo-t2": undefined,
  "fo-t3": undefined,
  "cl-t1": {
    link: "https://drive.google.com/file/d/cl-t1-demo",
    status: "approved",
    submittedAt: "2026-04-28T09:30:00+07:00"
  },
  "cl-t2": undefined,
  "cl-t3": undefined,
  "ds-t1": {
    link: "https://drive.google.com/file/d/ds-t1-demo",
    status: "approved",
    submittedAt: "2026-04-27T14:00:00+07:00"
  },
  "ds-t2": {
    link: "https://drive.google.com/file/d/ds-t2-demo",
    status: "approved",
    submittedAt: "2026-04-29T16:15:00+07:00"
  },
  "ds-t3": undefined
};
