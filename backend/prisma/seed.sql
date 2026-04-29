BEGIN;

-- Kredensial login Better Auth untuk data seed:
-- andi@akara.test / Password123!
-- budi@akara.test / Password123!
-- citra@akara.test / Password123!
-- rina@akara.test / Password123!
-- dodi@akara.test / Password123!

TRUNCATE TABLE
  failed_import_rows,
  exports,
  imports,
  quiz_user_answers,
  quiz_user,
  quiz_questions,
  quiz_attempts,
  quizzes,
  task_submissions,
  tasks,
  lesson_user_durations,
  lesson_user,
  lessons,
  sections,
  module_student_class_schedules,
  modules_tingkat,
  modules_teacher,
  modules_student,
  modules_student_class,
  students,
  student_classes,
  teachers,
  modules,
  departments,
  tingkat,
  haris,
  rentang_jams,
  auth_sessions,
  auth_accounts,
  auth_verifications,
  users
RESTART IDENTITY CASCADE;

INSERT INTO departments (id, nama_jurusan, kepala_jurusan_id, gambar, created_at, updated_at, deleted_at) VALUES
  (1, 'Rekayasa Perangkat Lunak', NULL, 'rpl.png', '2026-04-29 08:00:00', '2026-04-29 08:00:00', NULL),
  (2, 'Desain Komunikasi Visual', NULL, 'dkv.png', '2026-04-29 08:00:00', '2026-04-29 08:00:00', NULL);

INSERT INTO tingkat (id, name, created_at, updated_at) VALUES
  (1, 'X', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 'XI', '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO users (id, identifier, name, nisn, jurusan, photo, email, email_verified, password, created_at, updated_at) VALUES
  (1, 'student-andi', 'Andi Pratama', '100001', 'Rekayasa Perangkat Lunak', 'andi.jpg', 'andi@akara.test', TRUE, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 'student-budi', 'Budi Santoso', '100002', 'Rekayasa Perangkat Lunak', 'budi.jpg', 'budi@akara.test', TRUE, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (3, 'student-citra', 'Citra Lestari', '100003', 'Desain Komunikasi Visual', 'citra.jpg', 'citra@akara.test', TRUE, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (4, 'teacher-rina', 'Rina Mahardika', NULL, 'Rekayasa Perangkat Lunak', 'rina.jpg', 'rina@akara.test', TRUE, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (5, 'teacher-dodi', 'Dodi Saputra', NULL, 'Desain Komunikasi Visual', 'dodi.jpg', 'dodi@akara.test', TRUE, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO teachers (id, user_id, nama, nip, status, jenis, foto, jurusan_id, created_at, updated_at, email, otp_code, otp_kedaluwarsa, email_terverifikasi_pada) VALUES
  (1, 4, 'Rina Mahardika', '19870001', 'aktif', 'guru mapel', 'rina-guru.jpg', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 'rina.guru@akara.test', NULL, NULL, '2026-04-29 08:00:00'),
  (2, 5, 'Dodi Saputra', '19870002', 'aktif', 'guru mapel', 'dodi-guru.jpg', 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 'dodi.guru@akara.test', NULL, NULL, '2026-04-29 08:00:00');

INSERT INTO student_classes (id, jurusan_id, tingkat_id, nama_kelas, level, homeroom_teacher_id, created_at, updated_at) VALUES
  (1, 1, 1, 'X RPL 1', 'dasar', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 2, 2, 'XI DKV 1', 'lanjutan', 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO students (
  id, user_id, nama, nisn, kelas_id, jurusan_id, foto, created_at, updated_at, tingkat_id, email,
  kode_otp, otp_kedaluwarsa, email_terverifikasi_pada, nis, jenis_kelamin, tempat_lahir, tanggal_lahir,
  nama_orang_tua, agama, hp_orang_tua
) VALUES
  (1, 1, 'Andi Pratama', '100001', 1, 1, 'andi-siswa.jpg', '2026-04-29 08:00:00', '2026-04-29 08:00:00', 1, 'andi.siswa@akara.test', NULL, NULL, '2026-04-29 08:00:00', '220001', 'L', 'Bandung', '2009-01-10', 'Sutrisno', 'Islam', '081200000001'),
  (2, 2, 'Budi Santoso', '100002', 1, 1, 'budi-siswa.jpg', '2026-04-29 08:00:00', '2026-04-29 08:00:00', 1, 'budi.siswa@akara.test', NULL, NULL, '2026-04-29 08:00:00', '220002', 'L', 'Bandung', '2009-03-12', 'Rahmat', 'Islam', '081200000002'),
  (3, 3, 'Citra Lestari', '100003', 2, 2, 'citra-siswa.jpg', '2026-04-29 08:00:00', '2026-04-29 08:00:00', 2, 'citra.siswa@akara.test', NULL, NULL, '2026-04-29 08:00:00', '220003', 'P', 'Garut', '2008-07-04', 'Wati', 'Islam', '081200000003');

INSERT INTO modules (id, judul, jurusan, deskripsi, thumbnail, jurusan_id, is_aktif, created_at, updated_at, tingkat_id) VALUES
  (1, 'Dasar Pemrograman', 'Rekayasa Perangkat Lunak', 'Pengenalan logika, algoritma, dan flowchart.', 'pemrograman.png', 1, TRUE, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 1),
  (2, 'Desain UI Dasar', 'Desain Komunikasi Visual', 'Pengenalan prinsip visual, warna, dan layout.', 'desain-ui.png', 2, TRUE, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 2);

INSERT INTO modules_tingkat (id, module_id, tingkat_id, created_at, updated_at) VALUES
  (1, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 2, 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO modules_teacher (id, module_id, teacher_id, created_at, updated_at) VALUES
  (1, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 2, 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO modules_student_class (id, module_id, teacher_id, student_class_id, created_at, updated_at) VALUES
  (1, 1, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 2, 2, 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO modules_student (id, student_id, module_id, created_at, updated_at) VALUES
  (1, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 2, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (3, 3, 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO haris (id, nama_hari, urutan, created_at, updated_at) VALUES
  (1, 'Senin', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 'Selasa', 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (3, 'Rabu', 3, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (4, 'Kamis', 4, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (5, 'Jumat', 5, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO rentang_jams (id, jam_mulai, jam_selesai, created_at, updated_at) VALUES
  (1, TIME '08:00:00', TIME '10:00:00', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, TIME '10:15:00', TIME '12:15:00', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (3, TIME '13:00:00', TIME '15:00:00', '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO module_student_class_schedules (id, module_student_class_id, hari_id, rentang_jam_id, created_at, updated_at) VALUES
  (1, 1, 1, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 1, 3, 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (3, 2, 2, 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (4, 2, 4, 3, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO sections (id, module_student_class_id, judul, urutan, created_at, updated_at) VALUES
  (1, 1, 'Pengantar Algoritma', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 1, 'Praktik Flowchart', 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (3, 2, 'Fundamental UI', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO lessons (
  id, module_student_class_id, section_id, posisi, judul, konten, urutan, created_at, updated_at,
  tipe_konten, url_konten, durasi, tersedia_pada
) VALUES
  (1, 1, 1, 1, 'Apa Itu Algoritma', 'Materi pengantar algoritma dan pola berpikir sistematis.', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 'text', NULL, 600, '2026-05-01'),
  (2, 1, 2, 2, 'Flowchart Dasar', 'Langkah membuat flowchart untuk kasus sederhana.', 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 'video', 'https://example.com/flowchart-dasar', 900, '2026-05-02'),
  (3, 2, 3, 1, 'Prinsip Hierarki Visual', 'Pengenalan hirarki visual untuk desain antarmuka.', 1, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 'text', NULL, 700, '2026-05-01'),
  (4, 2, 3, 2, 'Warna dan Kontras', 'Materi video tentang pemilihan warna dan kontras.', 2, '2026-04-29 08:00:00', '2026-04-29 08:00:00', 'video', 'https://example.com/warna-kontras', 1200, '2026-05-03');

INSERT INTO lesson_user (id, user_id, lesson_id, is_completed, created_at, updated_at) VALUES
  (1, 1, 1, TRUE, '2026-05-01 09:00:00', '2026-05-01 09:30:00'),
  (2, 2, 1, FALSE, '2026-05-01 09:05:00', '2026-05-01 09:10:00'),
  (3, 3, 3, TRUE, '2026-05-02 10:00:00', '2026-05-02 10:30:00');

INSERT INTO lesson_user_durations (id, user_id, lesson_id, seconds, created_at, updated_at) VALUES
  (1, 1, 1, 600, '2026-05-01 09:00:00', '2026-05-01 09:30:00'),
  (2, 2, 1, 300, '2026-05-01 09:05:00', '2026-05-01 09:10:00'),
  (3, 3, 3, 700, '2026-05-02 10:00:00', '2026-05-02 10:30:00');

INSERT INTO quizzes (
  id, modules_student_class_id, section_id, lesson_id, judul, posisi, skor_lulus, durasi_menit,
  is_aktif, created_at, updated_at, available_at, deadline
) VALUES
  (1, 1, 2, 2, 'Quiz Flowchart', 3, 75, 20, TRUE, '2026-04-29 08:00:00', '2026-04-29 08:00:00', '2026-05-03 08:00:00', '2026-05-10 23:59:00'),
  (2, 2, 3, 4, 'Quiz Prinsip UI', 3, 80, 25, TRUE, '2026-04-29 08:00:00', '2026-04-29 08:00:00', '2026-05-04 08:00:00', '2026-05-11 23:59:00');

INSERT INTO quiz_questions (
  id, quiz_id, pertanyaan, question_image, opsi_a, opsi_b, opsi_c, opsi_d, opsi_benar, jawaban_benar, created_at, updated_at
) VALUES
  (1, 1, 'Simbol untuk mulai/selesai pada flowchart adalah?', NULL, 'Oval', 'Persegi', 'Belah ketupat', 'Panah', 'A', 'Oval', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 1, 'Decision pada flowchart biasanya berbentuk?', NULL, 'Lingkaran', 'Belah ketupat', 'Segitiga', 'Persegi panjang', 'B', 'Belah ketupat', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (3, 2, 'Kontras warna dipakai untuk?', NULL, 'Menyamakan semua elemen', 'Mengurangi fokus', 'Menonjolkan elemen penting', 'Menghapus hierarki', 'C', 'Menonjolkan elemen penting', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (4, 2, 'Hierarki visual membantu pengguna untuk?', NULL, 'Bingung memilih fokus', 'Memahami urutan informasi', 'Melihat warna acak', 'Menghindari layout', 'B', 'Memahami urutan informasi', '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO quiz_attempts (
  id, quiz_id, question_order, user_id, score, is_passed, started_at, submitted_at, duration_seconds, status, created_at, updated_at
) VALUES
  (1, 1, '[1,2]', 1, 100, TRUE, '2026-05-03 09:00:00', '2026-05-03 09:10:00', 600, 'on_time', '2026-05-03 09:00:00', '2026-05-03 09:10:00'),
  (2, 2, '[3,4]', 3, 50, FALSE, '2026-05-04 10:00:00', '2026-05-04 10:20:00', 1200, 'late', '2026-05-04 10:00:00', '2026-05-04 10:20:00');

INSERT INTO quiz_user (id, user_id, quiz_id, score, is_passed, created_at, updated_at) VALUES
  (1, 1, 1, 100, TRUE, '2026-05-03 09:10:00', '2026-05-03 09:10:00'),
  (2, 3, 2, 50, FALSE, '2026-05-04 10:20:00', '2026-05-04 10:20:00');

INSERT INTO quiz_user_answers (
  id, quiz_attempt_id, quiz_question_id, user_id, selected_option, is_correct, created_at, updated_at
) VALUES
  (1, 1, 1, 1, 'A', TRUE, '2026-05-03 09:05:00', '2026-05-03 09:05:00'),
  (2, 1, 2, 1, 'B', TRUE, '2026-05-03 09:06:00', '2026-05-03 09:06:00'),
  (3, 2, 3, 3, 'A', FALSE, '2026-05-04 10:10:00', '2026-05-04 10:10:00'),
  (4, 2, 4, 3, 'B', TRUE, '2026-05-04 10:11:00', '2026-05-04 10:11:00');

INSERT INTO tasks (
  id, modules_student_class_id, lesson_id, judul, deskripsi, attachment_type, attachment_path,
  deadline, available_at, allow_revision, is_aktif, created_at, updated_at
) VALUES
  (1, 1, 2, 'Tugas Flowchart', 'Buat flowchart untuk proses login pengguna.', 'pdf', 'tasks/flowchart.pdf', '2026-05-12 23:59:00', '2026-05-05', TRUE, TRUE, '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  (2, 2, 4, 'Tugas Palet Warna', 'Susun palet warna untuk landing page pendidikan.', 'zip', 'tasks/palet-warna.zip', '2026-05-13 23:59:00', '2026-05-06', TRUE, TRUE, '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO task_submissions (
  id, task_id, user_id, submission_link, submitted_at, status, teacher_note, created_at, updated_at
) VALUES
  (1, 1, 1, 'https://drive.example.com/andi-flowchart', '2026-05-10 19:00:00', 'submitted', 'Struktur sudah rapi.', '2026-05-10 19:00:00', '2026-05-10 19:00:00'),
  (2, 2, 3, 'https://drive.example.com/citra-palet', '2026-05-11 20:00:00', 'submitted', 'Perkuat kontras warna utama.', '2026-05-11 20:00:00', '2026-05-11 20:00:00');

INSERT INTO imports (
  id, completed_at, file_name, file_path, importer, processed_rows, total_rows, successful_rows, user_id, created_at, updated_at
) VALUES
  (1, '2026-04-29 11:00:00', 'students-batch-1.xlsx', '/imports/students-batch-1.xlsx', 'student-importer', 3, 4, 3, 4, '2026-04-29 10:00:00', '2026-04-29 11:00:00');

INSERT INTO failed_import_rows (id, data, import_id, validation_error, created_at, updated_at) VALUES
  (1, '{"row":4,"email":"duplicate@akara.test","reason":"duplicate email"}'::jsonb, 1, 'Email sudah terdaftar.', '2026-04-29 10:30:00', '2026-04-29 10:30:00');

INSERT INTO exports (
  id, completed_at, file_disk, file_name, exporter, processed_rows, total_rows, successful_rows, user_id, created_at, updated_at
) VALUES
  (1, '2026-04-29 12:00:00', 'local', 'nilai-quiz-mei.csv', 'quiz-exporter', 2, 2, 2, 4, '2026-04-29 11:30:00', '2026-04-29 12:00:00');

INSERT INTO auth_accounts (
  id, user_id, account_id, provider_id, access_token, refresh_token, access_token_expires_at,
  refresh_token_expires_at, scope, id_token, password, created_at, updated_at
) VALUES
  ('acc-andi', 1, '1', 'credential', NULL, NULL, NULL, NULL, NULL, NULL, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  ('acc-budi', 2, '2', 'credential', NULL, NULL, NULL, NULL, NULL, NULL, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  ('acc-citra', 3, '3', 'credential', NULL, NULL, NULL, NULL, NULL, NULL, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  ('acc-rina', 4, '4', 'credential', NULL, NULL, NULL, NULL, NULL, NULL, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00'),
  ('acc-dodi', 5, '5', 'credential', NULL, NULL, NULL, NULL, NULL, NULL, '96f0e08e1cd0235a7bc21d3585d1af6e:f5e32d4b8089ecb4863fbffb763feac6902a7f6d061bb35b89e1f9b4af8ddc5762bd57a2dacd58a7f171e85c1cba6c56ae7542c22dd7952500ae24a157a5cbf7', '2026-04-29 08:00:00', '2026-04-29 08:00:00');

INSERT INTO auth_sessions (id, user_id, token, expires_at, ip_address, user_agent, created_at, updated_at) VALUES
  ('sess-andi', 1, 'token-andi-active', '2026-06-01 08:00:00', '127.0.0.1', 'seed-script', '2026-05-01 08:00:00', '2026-05-01 08:00:00'),
  ('sess-rina', 4, 'token-rina-active', '2026-06-01 08:00:00', '127.0.0.1', 'seed-script', '2026-05-01 08:00:00', '2026-05-01 08:00:00');

INSERT INTO auth_verifications (id, identifier, value, expires_at, created_at, updated_at) VALUES
  ('verif-reset-andi', 'reset-password:seed-andi', '1', '2026-06-01 08:00:00', '2026-05-01 08:00:00', '2026-05-01 08:00:00'),
  ('verif-email-citra', 'email-verification:citra@akara.test', 'citra@akara.test', '2026-06-01 08:00:00', '2026-05-01 08:00:00', '2026-05-01 08:00:00');

SELECT setval(pg_get_serial_sequence('departments', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('exports', 'id'), 1, true);
SELECT setval(pg_get_serial_sequence('failed_import_rows', 'id'), 1, true);
SELECT setval(pg_get_serial_sequence('haris', 'id'), 5, true);
SELECT setval(pg_get_serial_sequence('imports', 'id'), 1, true);
SELECT setval(pg_get_serial_sequence('modules', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('modules_student', 'id'), 3, true);
SELECT setval(pg_get_serial_sequence('modules_student_class', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('modules_teacher', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('modules_tingkat', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('module_student_class_schedules', 'id'), 4, true);
SELECT setval(pg_get_serial_sequence('quizzes', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('quiz_attempts', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('quiz_questions', 'id'), 4, true);
SELECT setval(pg_get_serial_sequence('quiz_user', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('quiz_user_answers', 'id'), 4, true);
SELECT setval(pg_get_serial_sequence('rentang_jams', 'id'), 3, true);
SELECT setval(pg_get_serial_sequence('sections', 'id'), 3, true);
SELECT setval(pg_get_serial_sequence('students', 'id'), 3, true);
SELECT setval(pg_get_serial_sequence('student_classes', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('lessons', 'id'), 4, true);
SELECT setval(pg_get_serial_sequence('lesson_user', 'id'), 3, true);
SELECT setval(pg_get_serial_sequence('lesson_user_durations', 'id'), 3, true);
SELECT setval(pg_get_serial_sequence('tasks', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('task_submissions', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('teachers', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('tingkat', 'id'), 2, true);
SELECT setval(pg_get_serial_sequence('users', 'id'), 5, true);

COMMIT;
