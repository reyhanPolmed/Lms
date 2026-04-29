Project Requirement Document (PRD) — LMS Sekolah
=============================================

Versi: 1.0
Tanggal: 2026-04-28
Penulis: otomatis (dari analisis file dokumentasi proyek)

Overview
--------
Proyek ini adalah Learning Management System (LMS) berbasis next.js untuk frontend dan postgres sebagai database. Dokumen ini merangkum requirement fungsional dan non-fungsional, alur pengguna, arsitektur, desain UI/UX, batasan teknis, ERD ringkas, dan fase pengembangan yang disarankan.

Goals (Tujuan).
- Menyediakan pengalaman pembelajaran yang dapat diandalkan: lesson player (video/pdf/text), tracking durasi, kuis acak, dan pengumpulan tugas.

Requirements
------------
Functional Requirements
- Autentikasi pengguna (login/logout) menggunakan better auth.
- Dashboard siswa: ringkasan modul, quiz/tugas mendatang, status progress.
- Modul / Course listing dan detail.
- Lesson detail: content (text/pdf/video/link), sidebar terurut (lesson/quiz/task), status locked/completed.
- Lesson player: anti-skip (video), pelacakan durasi via endpoint /api/lessons/{id}/duration, tombol "tandai selesai" setelah durasi terpenuhi.
- Quiz flow: intro, start (acak question_order), submit, result; penalti fullscreen_violation.
- Task flow: lihat tugas, submit link, revisi tergantung allow_revision.
- Profile management: lihat & update profil, ganti password.

Non-functional Requirements
- Responsif: UI berjalan baik di desktop.
- Keamanan: proteksi CSRF, validasi server-side, pemeriksaan akses (403/401), sanitasi input.
- Ketersediaan: API harus dapat melayani permintaan penting (dashboard, lesson, submit) dengan latensi rendah.
- Maintainability: TypeScript di front-end, coding standard di backend, dokumentasi API (OpenAPI bila mungkin).
- Observability: logging, error handling, metrik dasar.

Technical Requirements
- Backend: express.js.
- Frontend (direkomendasikan): Next.js + TypeScript, Tailwind CSS, React Query (TanStack), Axios (withCredentials).
- Database: PostgreSQL (target migrasi).
- Storage: local untuk media.

Core Features
-------------
1. Authentication
   - Login/Logout
2. Dashboard
   - Aggregasi data (user, student profile, myModules, upcomingQuizzes, upcomingTasks).
3. Modules / Courses
   - GET /api/modules, GET /api/modules/{id}, GET /api/courses (siswa specific).
4. Lesson Experience
   - Detail lesson (content_type, content_url), lesson sidebar (items terurut dengan is_locked/is_completed), duration tracking, mark complete endpoint.
5. Quiz System
   - Start attempt (acak soal), submit answers, scoring, attempt history.
6. Tasks / Submissions
   - Submission link, allow_revision logic, teacher feedback.
7. Profile & Account
   - View/update profile, change password.

User Flow (Ringkas)
-------------------
1) Login
- User membuka frontend -> POST /login (credentials) -> GET /api/user untuk ambil profil.

2) Dashboard
- Setelah login, frontend memanggil GET /api/dashboard -> tampilkan ringkasan, daftar kursus.

3) Buka Lesson
- User memilih modul/lesson -> GET /api/lessons/{id} -> server mengembalikan lesson + sidebar terproses (items with is_locked/is_completed) -> jika content_type video pakai YouTube IFrame + anti-skip.
- Klien berkala POST /api/lessons/{id}/duration { seconds } untuk mencatat durasi.
- Ketika durasi terpenuhi: tampilkan tombol Complete -> POST /api/lessons/{id}/complete.

4) Quiz
- GET /api/quizzes/{id} (intro) -> POST /api/quizzes/{id}/start (buat attempt) -> tampilkan pertanyaan (acak) -> POST /api/quizzes/{id}/submit (answers + optional fullscreen_violation) -> lihat result.

5) Task Submission
- GET /api/tasks/{id} -> tampilkan detail dan submission saat ini -> POST /api/tasks/{id}/submit { submission_link }.

Architecture
------------
High-level components
- Backend: express.js.
- Frontend: Next.js (recommended) providing pages: /login, /dashboard, /lessons/[id], /quizzes/[id], /tasks/[id].
- Database: relational DB ( PostgreSQL ).
- Storage: local disk for uploads.


Data / Request Flow
- Client (Next.js) <-> Backend (express.js) <-> Database


Design
------
UI/UX Principles
- Clear affordances for locked vs unlocked lessons, progress indicators, and toast notifications for actions (submit, save, errors).
- Sidebar precomputed server-side to reduce client logic and network calls.

Key Components
- Layout + Header
- Sidebar (lessons / quizzes / tasks) — array terurut, is_locked, is_completed
- LessonPlayer (support: text/pdf/embed video/iframe) — anti-skip orchestration
- Quiz components (Question, Answers, Timer)
- Task submission form (link input, validation)

Accessibility & Localization
- Keyboard navigable, semantic HTML.
- Default language: Bahasa Indonesia.


ERD (Ringkasan Entitas & Relasi)
--------------------------------
Entitas utama :
- users: id PK, identifier, name, email, password, photo, timestamps
- students: id PK, user_id FK -> users.id, nama, nisn, kelas_id FK -> student_classes.id, jurusan_id FK -> departments.id, tingkat_id FK -> tingkat.id, jenis_kelamin (enum), email, dll.
- teachers: id PK, user_id FK -> users.id, nama, nip, jurusan_id FK -> departments.id, email, dll.
- departments: id PK, nama_jurusan, kepala_jurusan_id FK -> teachers.id
- tingkat: id PK, name (tingkatan/kls X, XI, XII)
- student_classes: id PK, jurusan_id FK -> departments.id, tingkat_id FK -> tingkat.id, nama_kelas, homeroom_teacher_id FK -> teachers.id
- modules: id PK, judul, jurusan_id FK -> departments.id, tingkat_id FK -> tingkat.id, is_aktif, deskripsi
- modules_student_class: id PK, module_id FK -> modules.id, teacher_id FK -> teachers.id, student_class_id FK -> student_classes.id (penjadwalan/penawaran modul untuk kelas)
- modules_student / modules_teacher / modules_tingkat: pivot tables untuk relasi many-to-many (student/module, teacher/module, module/tingkat)
- sections: id PK, module_student_class_id FK -> modules_student_class.id, judul, urutan
- lessons: id PK, module_student_class_id FK -> modules_student_class.id, section_id FK -> sections.id, posisi, judul, konten, tipe_konten, url_konten, durasi, tersedia_pada
- lesson_user: id PK, user_id FK -> users.id, lesson_id FK -> lessons.id, is_completed (pivot untuk progress)
- lesson_user_durations: id PK, user_id FK -> users.id, lesson_id FK -> lessons.id, seconds (unique per user+lesson)
- quizzes: id PK, modules_student_class_id FK -> modules_student_class.id, section_id FK -> sections.id (nullable), lesson_id FK -> lessons.id, judul, skor_lulus, durasi_menit, is_aktif, available_at, deadline
- quiz_questions: id PK, quiz_id FK -> quizzes.id, pertanyaan, opsi_a..d, opsi_benar
- quiz_attempts: id PK, quiz_id FK -> quizzes.id, user_id FK -> users.id, score, is_passed, started_at, submitted_at, duration_seconds, status (enum)
- quiz_user: id PK, user_id FK -> users.id, quiz_id FK -> quizzes.id (aggregate/pivot)
- quiz_user_answers: id PK, quiz_attempt_id FK -> quiz_attempts.id, quiz_question_id FK -> quiz_questions.id, user_id FK -> users.id, selected_option, is_correct
- tasks: id PK, modules_student_class_id FK -> modules_student_class.id, lesson_id FK -> lessons.id, judul, deskripsi, attachment_type/path, deadline, allow_revision, is_aktif
- task_submissions: id PK, task_id FK -> tasks.id, user_id FK -> users.id, submission_link, submitted_at, status (enum), teacher_note
- module_student_class_schedules: id PK, module_student_class_id FK -> modules_student_class.id, hari_id FK -> haris.id, rentang_jam_id FK -> rentang_jams.id
- haris: id PK, nama_hari
- rentang_jams: id PK, jam_mulai, jam_selesai
- Infrastruktur & utilitas: sessions, personal_access_tokens, password_reset_tokens, migrations, jobs/failed_jobs, exports/imports, cache/cache_locks, serta Document/SimilarityResult (fitur tambahan)

Relasi kunci :
- users.id <- students.user_id (FK: students_user_id_foreign)  ON DELETE CASCADE
- users.id <- teachers.user_id (FK: teachers_user_id_foreign)  ON DELETE CASCADE
- departments.id <- modules.jurusan_id (FK: modules_jurusan_id_foreign)  ON UPDATE CASCADE
- departments.id <- students.jurusan_id (FK: students_jurusan_id_foreign)  ON UPDATE CASCADE ON DELETE SET NULL
- departments.id <- teachers.jurusan_id (FK: teachers_jurusan_id_foreign)  ON UPDATE CASCADE ON DELETE SET NULL
- student_classes.id <- students.kelas_id (FK: students_kelas_id_foreign)  ON UPDATE CASCADE ON DELETE SET NULL
- student_classes.tingkat_id -> tingkat.id (FK: fk_student_classes_tingkat_id_foreign)  ON UPDATE CASCADE ON DELETE CASCADE
- student_classes.homeroom_teacher_id -> teachers.id (FK: student_classes_homeroom_teacher_id_foreign)  ON DELETE SET NULL
- modules_student_class.module_id -> modules.id (FK: modules_student_class_module_id_foreign)  ON DELETE CASCADE
- modules_student_class.student_class_id -> student_classes.id (FK: modules_student_class_student_class_id_foreign)  ON DELETE CASCADE
- modules_student_class.teacher_id -> teachers.id (FK: fk_msc_teacher)  ON UPDATE SET NULL ON DELETE SET NULL
- sections.module_student_class_id -> modules_student_class.id (FK: sections_module_student_class_id_foreign)  ON DELETE CASCADE
- lessons.module_student_class_id -> modules_student_class.id (FK: lessons_module_student_class_id_foreign)  ON DELETE CASCADE
- lessons.section_id -> sections.id (FK: lessons_section_id_foreign)  ON DELETE CASCADE
- quizzes.modules_student_class_id -> modules_student_class.id (FK: quizzes_module_student_class_foreign)  ON DELETE CASCADE
- quizzes.lesson_id -> lessons.id (FK: quizzes_lesson_id_foreign)  ON DELETE CASCADE
- quiz_attempts.quiz_id -> quizzes.id (FK: quiz_attempts_quiz_id_foreign)  ON DELETE CASCADE
- quiz_attempts.user_id -> users.id (FK: quiz_attempts_user_id_foreign)  ON DELETE CASCADE
- quiz_user_answers.quiz_attempt_id -> quiz_attempts.id (FK: quiz_user_answers_quiz_attempt_id_foreign)  ON DELETE CASCADE
- quiz_user_answers.quiz_question_id -> quiz_questions.id (FK: quiz_user_answers_quiz_question_id_foreign)  ON DELETE CASCADE
- tasks.modules_student_class_id -> modules_student_class.id (FK: task_module_student_class_id_foreign)  ON DELETE CASCADE
- tasks.lesson_id -> lessons.id (FK: tasks_lesson_id_foreign)  ON DELETE CASCADE
- task_submissions.task_id -> tasks.id (FK: task_submissions_task_id_foreign)  ON DELETE CASCADE
- task_submissions.user_id -> users.id (FK: task_submissions_user_id_foreign)  ON DELETE CASCADE
- lesson_user.user_id -> users.id & lesson_user.lesson_id -> lessons.id (unique index on user_id+lesson_id enforced)
- lesson_user_durations.user_id -> users.id & lesson_user_durations.lesson_id -> lessons.id (unique index on user_id+lesson_id enforced)

Acceptance Criteria (contoh)
- Login/logout berhasil dan sesi terjaga di SSR dan CSR.
- Student dapat membuka lesson, menonton/menyelesaikan video, durasi tercatat, dan lesson dapat ditandai selesai.
- Quiz dapat dimulai, answers disubmit, scoring sesuai expected, fullscreen violation diberlakukan.
- Task submission menerima link dan menolak revisi jika allow_revision=false.

Appendix A — API Endpoint Ringkas
- GET /sanctum/csrf-cookie
- POST /login
- POST /logout
- GET /api/user
- GET /api/dashboard
- GET /api/modules
- GET /api/modules/{id}
- GET /api/courses
- GET /api/lessons/{id}
- POST /api/lessons/{id}/duration
- POST /api/lessons/{id}/complete
- GET /api/quizzes/{id}
- POST /api/quizzes/{id}/start
- POST /api/quizzes/{id}/submit
- GET /api/quizzes/{id}/result
- GET /api/tasks/{id}
- POST /api/tasks/{id}/submit

Source code tampilan Dashboard mentah yang belum disesuaikan dengan techstack next.js, tailwindcss
<!DOCTYPE html>

<html lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700;800;900&amp;family=Inter:wght@300;400;500;600;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "on-tertiary-fixed": "#001a41",
                      "primary": "#040c1c",
                      "on-tertiary-container": "#4486f6",
                      "primary-fixed-dim": "#bec6dd",
                      "on-secondary": "#ffffff",
                      "tertiary": "#000b22",
                      "inverse-on-surface": "#eff1f3",
                      "on-error": "#ffffff",
                      "on-tertiary-fixed-variant": "#004494",
                      "surface-container": "#eceef0",
                      "surface-bright": "#f7f9fb",
                      "background": "#f7f9fb",
                      "tertiary-container": "#00204d",
                      "secondary-fixed": "#ffdea3",
                      "error-container": "#ffdad6",
                      "on-secondary-container": "#6b4d00",
                      "inverse-primary": "#bec6dd",
                      "outline": "#76777d",
                      "surface-container-highest": "#e0e3e5",
                      "secondary-fixed-dim": "#fdbc13",
                      "tertiary-fixed": "#d8e2ff",
                      "surface-container-high": "#e6e8ea",
                      "secondary": "#7a5900",
                      "error": "#ba1a1a",
                      "surface-dim": "#d8dadc",
                      "primary-fixed": "#dae2fa",
                      "on-surface-variant": "#45474c",
                      "on-primary-container": "#81899e",
                      "surface-container-lowest": "#ffffff",
                      "on-tertiary": "#ffffff",
                      "outline-variant": "#c6c6cd",
                      "on-primary-fixed-variant": "#3f4759",
                      "surface-tint": "#565e72",
                      "on-primary": "#ffffff",
                      "on-surface": "#191c1e",
                      "on-error-container": "#93000a",
                      "on-background": "#191c1e",
                      "surface-container-low": "#f2f4f6",
                      "primary-container": "#1a2233",
                      "inverse-surface": "#2d3133",
                      "secondary-container": "#fdbc13",
                      "tertiary-fixed-dim": "#adc6ff",
                      "surface": "#f7f9fb",
                      "on-secondary-fixed-variant": "#5d4200",
                      "surface-variant": "#e0e3e5",
                      "on-primary-fixed": "#131b2c",
                      "on-secondary-fixed": "#261900"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "stack-md": "1rem",
                      "stack-sm": "0.5rem",
                      "stack-lg": "2rem",
                      "gutter": "1.5rem",
                      "margin-page": "2rem",
                      "container-max": "1280px"
              },
              "fontFamily": {
                      "headline-md": ["Lexend"],
                      "label-md": ["Inter"],
                      "headline-lg": ["Lexend"],
                      "body-lg": ["Inter"],
                      "body-md": ["Inter"],
                      "headline-xl": ["Lexend"],
                      "stat-number": ["Lexend"]
              },
              "fontSize": {
                      "headline-md": ["18px", {"lineHeight": "1.4", "fontWeight": "600"}],
                      "label-md": ["12px", {"lineHeight": "1", "letterSpacing": "0.02em", "fontWeight": "500"}],
                      "headline-lg": ["24px", {"lineHeight": "1.3", "fontWeight": "600"}],
                      "body-lg": ["16px", {"lineHeight": "1.6", "fontWeight": "400"}],
                      "body-md": ["14px", {"lineHeight": "1.5", "fontWeight": "400"}],
                      "headline-xl": ["32px", {"lineHeight": "1.2", "fontWeight": "600"}],
                      "stat-number": ["20px", {"lineHeight": "1", "fontWeight": "700"}]
              }
            },
          },
        }
      </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            display: inline-block;
            vertical-align: middle;
        }
        .nav-active { border-bottom-width: 2px; }
      </style>
</head>
<body class="bg-background font-body-md text-on-background min-h-screen">
<!-- Sidebar Navigation -->
<aside class="hidden md:flex flex-col h-full p-4 space-y-2 bg-slate-900 h-screen w-64 fixed left-0 top-0 border-r border-slate-800 shadow-xl z-[60]">
<div class="flex items-center space-x-3 px-2 py-4 mb-6">
<div class="w-10 h-10 bg-secondary-container rounded-lg flex items-center justify-center">
<span class="material-symbols-outlined text-on-secondary-fixed" data-icon="school">school</span>
</div>
<div>
<h1 class="text-lg font-black text-white tracking-tight font-headline-md">EduCore</h1>
<p class="text-xs text-slate-400 font-label-md">Student Portal</p>
</div>
</div>
<nav class="flex-1 space-y-1">
<a class="flex items-center space-x-3 px-4 py-3 bg-white/10 text-white rounded-lg font-semibold transition-all" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="font-lexend text-sm">Dashboard</span>
</a>
<a class="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" href="#">
<span class="material-symbols-outlined" data-icon="menu_book">menu_book</span>
<span class="font-lexend text-sm">My Courses</span>
</a>
<a class="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" href="#">
<span class="material-symbols-outlined" data-icon="assignment">assignment</span>
<span class="font-lexend text-sm">Assignments</span>
</a>
<a class="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" href="#">
<span class="material-symbols-outlined" data-icon="grade">grade</span>
<span class="font-lexend text-sm">Grades</span>
</a>
<a class="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" href="#">
<span class="material-symbols-outlined" data-icon="library_books">library_books</span>
<span class="font-lexend text-sm">Library</span>
</a>
</nav>
<div class="mt-auto p-4 bg-white/5 rounded-xl border border-white/10">
<p class="text-xs text-slate-400 mb-3">Need help with your studies?</p>
<button class="w-full py-2 bg-secondary-container text-on-secondary-fixed text-sm font-bold rounded-lg hover:opacity-90 transition-all">
                Get Support
            </button>
</div>
</aside>
<!-- Main Content Area -->
<div class="md:ml-64 flex-1 flex flex-col min-h-screen">
<!-- Top Navigation Bar -->
<header class="sticky top-0 z-50 flex justify-between items-center px-6 py-3 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
<div class="flex items-center flex-1 max-w-xl">
<div class="relative w-full">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" data-icon="search">search</span>
<input class="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20" placeholder="Search courses, tasks, or materials..." type="text"/>
</div>
</div>
<div class="flex items-center space-x-4">
<button class="p-2 text-slate-500 hover:text-primary transition-colors relative">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
<span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
</button>
<button class="p-2 text-slate-500 hover:text-primary transition-colors">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
</button>
<div class="h-8 w-[1px] bg-slate-200 mx-2"></div>
<div class="flex items-center space-x-3 cursor-pointer group">
<div class="text-right hidden sm:block">
<p class="text-xs font-bold text-primary">M. Fadlil Habill</p>
<p class="text-[10px] text-slate-500">Class 12 - A</p>
</div>
<div class="w-10 h-10 rounded-full border-2 border-primary/10 overflow-hidden group-hover:border-primary/30 transition-all">
<img alt="Student Profile Picture" class="w-full h-full object-cover" data-alt="close-up portrait of a young male student with a friendly expression and short dark hair in a bright studio" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAlPYHxuiGSDZOpuriySHCmdLiiMeQMhIqfW4I0Kz4r_DyzoN4JJLnsFhvIZzyIJ2sRJmc2f1CJqqQjjgUr2UTVferd5o38vEpqt0uFjk17V3iALcFdkfJv98oOHPtifcuWoCaBcfDsq97Lorzpgx29ME0iDpo146MzYmyxrHvihDa804uytBrXjUgOTXsxSI0yfLOTSUdN6svqOod9DeuPIOQZ_UDf-ocwf6eERQ06TIzFltZGPDeGjpl9chD2BFTjfCSFgATjg9r"/>
</div>
</div>
</div>
</header>
<!-- Main Dashboard Canvas -->
<main class="flex-1 p-6 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full">
<!-- Hero Greeting Section -->
<section class="bg-primary-container rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
<div class="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
<svg class="h-full w-full fill-white" viewbox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.7,-31.3,87.1,-15.7,85.5,-0.9C83.9,13.8,77.4,27.7,68.8,39.9C60.2,52,49.5,62.4,36.7,70.5C23.9,78.6,8.9,84.4,-5.4,84.4C-19.8,84.4,-34.5,78.6,-47.3,70.5C-60.1,62.4,-70.9,52,-78.2,39.9C-85.5,27.7,-89.2,13.8,-88.4,-0.4C-87.6,-14.7,-82.2,-29.4,-73.4,-41.8C-64.6,-54.2,-52.3,-64.3,-38.9,-71.5C-25.5,-78.7,-11.1,-83,2.4,-82.6C15.9,-82.2,31.3,-83.6,44.7,-76.4Z" transform="translate(100 100)"></path>
</svg>
</div>
<div class="relative z-10 grid md:grid-cols-2 gap-8 items-center">
<div>
<h2 class="font-headline-xl text-headline-xl mb-2">Selamat datang,</h2>
<p class="font-headline-xl text-headline-xl font-bold mb-4">Muhammad Fadlil Habill</p>
<p class="text-blue-200/80 font-body-md max-w-sm">Keep up the great work! You've completed 85% of your weekly targets. Check your agenda below.</p>
</div>
<div class="flex flex-wrap gap-4 justify-start md:justify-end">
<div class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 min-w-[140px]">
<p class="text-Academic Gold font-stat-number text-stat-number text-secondary-fixed-dim">5</p>
<p class="text-xs font-label-md uppercase tracking-wider text-white/60 mt-1">Courses</p>
</div>
<div class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 min-w-[140px]">
<p class="text-Academic Gold font-stat-number text-stat-number text-secondary-fixed-dim">0</p>
<p class="text-xs font-label-md uppercase tracking-wider text-white/60 mt-1">Active Quizzes</p>
</div>
<div class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 min-w-[140px]">
<p class="text-Academic Gold font-stat-number text-stat-number text-secondary-fixed-dim">0</p>
<p class="text-xs font-label-md uppercase tracking-wider text-white/60 mt-1">Tasks</p>
</div>
</div>
</div>
</section>
<!-- Upcoming Agenda Section -->
<section>
<div class="flex items-center justify-between mb-6">
<h3 class="font-headline-lg text-headline-lg text-primary">Agenda Mendatang</h3>
<a class="text-sm font-semibold text-secondary hover:underline" href="#">View Calendar</a>
</div>
<div class="grid md:grid-cols-2 gap-6">
<!-- Upcoming Quizzes Card -->
<div class="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-slate-100">
<div class="flex items-center space-x-3 mb-6">
<div class="p-2 bg-secondary-fixed/20 rounded-lg">
<span class="material-symbols-outlined text-secondary" data-icon="quiz">quiz</span>
</div>
<h4 class="font-headline-md text-headline-md">Upcoming Quizzes</h4>
</div>
<div class="py-8 flex flex-col items-center justify-center text-center opacity-60">
<div class="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-slate-400 text-3xl" data-icon="event_busy">event_busy</span>
</div>
<p class="text-slate-500 font-body-md">Tidak ada kuis yang dijadwalkan untuk saat ini.</p>
</div>
</div>
<!-- Upcoming Tasks Card -->
<div class="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-slate-100">
<div class="flex items-center space-x-3 mb-6">
<div class="p-2 bg-on-tertiary-container/10 rounded-lg">
<span class="material-symbols-outlined text-on-tertiary-container" data-icon="task_alt">task_alt</span>
</div>
<h4 class="font-headline-md text-headline-md">Upcoming Tasks</h4>
</div>
<div class="py-8 flex flex-col items-center justify-center text-center opacity-60">
<div class="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
<span class="material-symbols-outlined text-slate-400 text-3xl" data-icon="assignment_turned_in">assignment_turned_in</span>
</div>
<p class="text-slate-500 font-body-md">Semua tugas sudah selesai. Bagus!</p>
</div>
</div>
</div>
</section>
<!-- Course Modules Bento Grid -->
<section>
<div class="flex items-center justify-between mb-6">
<h3 class="font-headline-lg text-headline-lg text-primary">Daftar Jurusan</h3>
<div class="flex space-x-2">
<button class="p-2 bg-surface-container hover:bg-surface-container-high rounded-full transition-all">
<span class="material-symbols-outlined text-sm" data-icon="grid_view">grid_view</span>
</button>
<button class="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition-all">
<span class="material-symbols-outlined text-sm" data-icon="list">list</span>
</button>
</div>
</div>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
<!-- Course Card 1 -->
<div class="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all border border-slate-100">
<div class="h-40 relative">
<img alt="Perhotelan Course" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="interior of a luxury hotel lobby with modern furniture and warm ambient lighting professional hospitality setting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiRAY9DsuuwYEtrA4_AAijz3nrIb954SNyQaZnx3YHefz0coJ92BodbsVobQ2XWiM7MU4sGlUqDouKM206DiZYX6wGRjC0OQduVA7CCB0clTQ5iKeYTZs9DYxP_11Sv_A0pcvDRtAhrxPqydRdfAhx0t7YIVwfSe4oGM3wNn_PGjxkOYQJCeB65K3M1XwvFUuqw6HgE_yo9ANuT4EWPHYHGtnEd6OdOpDjMM7YP4seoXO_sevl31jiEbvSu_WhCh9ooWnGegyhIgYw"/>
<div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
<div class="absolute bottom-4 left-4">
<span class="bg-secondary-container text-on-secondary-fixed text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">6 Modules</span>
</div>
</div>
<div class="p-5">
<h5 class="font-headline-md text-headline-md mb-3 text-primary">Perhotelan</h5>
<div class="w-full bg-slate-100 h-1.5 rounded-full mb-2">
<div class="bg-secondary-fixed-dim h-full w-[65%] rounded-full"></div>
</div>
<div class="flex justify-between items-center text-xs font-medium text-slate-500">
<span>Progress</span>
<span>65%</span>
</div>
</div>
</div>
<!-- Course Card 2 -->
<div class="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all border border-slate-100">
<div class="h-40 relative">
<img alt="Kuliner Course" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="professional chef preparing a gourmet dish in a high-end commercial kitchen with stainless steel surfaces" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuCctzhJfQ1YaTskQ3GCUlVQLXSD_0CnrkJ470JvcSRFoGNUz0fyVLpOjFsf3WGHaJLYF_UEvmUQ1eI9FojU7yPeBzsGm39eduME6lTBRPxlDYBgnSh1gG6ZJQEMUuneayTZ0a3QpMfZh7L3Ci4ZrB4yPUvhtkhUlwlWXtY8OCpoD4Xt114bmpPWVfou7O6cIuXRccvcFfzXp7fjIx85QvfRymyVvQq9Pfh9tzvl0RmJexGc6HaBvD244uCKC5WNZRCU58eqRbMwz8"/>
<div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
<div class="absolute bottom-4 left-4">
<span class="bg-secondary-container text-on-secondary-fixed text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">8 Modules</span>
</div>
</div>
<div class="p-5">
<h5 class="font-headline-md text-headline-md mb-3 text-primary">Kuliner</h5>
<div class="w-full bg-slate-100 h-1.5 rounded-full mb-2">
<div class="bg-secondary-fixed-dim h-full w-[40%] rounded-full"></div>
</div>
<div class="flex justify-between items-center text-xs font-medium text-slate-500">
<span>Progress</span>
<span>40%</span>
</div>
</div>
</div>
<!-- Course Card 3 -->
<div class="group bg-surface-container-lowest rounded-2xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all border border-slate-100">
<div class="h-40 relative">
<img alt="Desain Course" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="modern minimalist graphic design studio with iMac and digital drawing tablet on a clean white desk" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCv25_zdNmW1Rtz-_hmgNQDmLhzNS6volNH14_VJTvncbjgULb_WPKN-c26OHpxuib-lq1DspiIfEB-_MAh4bNm66LBn8H_JLdzjA13nY9NNqvxWXO4zgTl6osLY4lxLLtXIhyXKT0SDmvwanDRyfgd43UQkX6KHTsMtS3wWTCihNtof0OPX7V-YfCdLyd0eQSQAmroYqYSPjY5p2i9OzOS2cmJI8LbIApZhar_AH66ulJw76p_pZvBSgAfOQ2LixxRsMXTchYXy9Yc"/>
<div class="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
<div class="absolute bottom-4 left-4">
<span class="bg-secondary-container text-on-secondary-fixed text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">5 Modules</span>
</div>
</div>
<div class="p-5">
<h5 class="font-headline-md text-headline-md mb-3 text-primary">Desain Komunikasi Visual</h5>
<div class="w-full bg-slate-100 h-1.5 rounded-full mb-2">
<div class="bg-secondary-fixed-dim h-full w-[92%] rounded-full"></div>
</div>
<div class="flex justify-between items-center text-xs font-medium text-slate-500">
<span>Progress</span>
<span>92%</span>
</div>
</div>
</div>
</div>
</section>
</main>
</div>
<!-- Mobile Navigation Bar -->
<nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
<a class="flex flex-col items-center text-primary" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="text-[10px] font-bold mt-1">Home</span>
</a>
<a class="flex flex-col items-center text-slate-400" href="#">
<span class="material-symbols-outlined" data-icon="menu_book">menu_book</span>
<span class="text-[10px] font-medium mt-1">Courses</span>
</a>
<div class="-mt-8">
<button class="bg-primary text-white p-3 rounded-full shadow-lg border-4 border-white">
<span class="material-symbols-outlined" data-icon="add">add</span>
</button>
</div>
<a class="flex flex-col items-center text-slate-400" href="#">
<span class="material-symbols-outlined" data-icon="assignment">assignment</span>
<span class="text-[10px] font-medium mt-1">Tasks</span>
</a>
<a class="flex flex-col items-center text-slate-400" href="#">
<span class="material-symbols-outlined" data-icon="person">person</span>
<span class="text-[10px] font-medium mt-1">Profile</span>
</a>
</nav>
</body></html>