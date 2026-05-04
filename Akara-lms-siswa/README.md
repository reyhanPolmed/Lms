# Akara LMS Frontend

Inisiasi frontend berdasarkan `prd.md` dengan stack:

- `Next.js` App Router
- `TypeScript`
- `Tailwind CSS`
- `TanStack Query`
- `Axios` dengan `withCredentials`

## Struktur utama

- `src/app/(auth)/login`: halaman login
- `src/app/(app)/dashboard`: dashboard siswa
- `src/app/(app)/modules`: daftar modul
- `src/app/(app)/modules/[id]`: detail modul
- `src/app/(app)/lessons/[id]`: lesson player
- `src/app/(app)/quizzes/[id]`: quiz flow
- `src/app/(app)/tasks/[id]`: task submission
- `src/app/(app)/profile`: profil dan ganti password
- `src/lib/api`: axios client + service layer
- `src/lib/mocks`: data dummy default selama tampilan frontend dikembangkan

## Menjalankan

```bash
npm install
npm run dev
```

Secara default proyek memakai data dummy dari `src/lib/mocks` dan tidak memanggil API backend. Salin `.env.example` menjadi `.env.local` bila ingin mengubah konfigurasi.

## Mode data

Mode dummy aktif selama `NEXT_PUBLIC_USE_MOCK_API` tidak bernilai `false`. Dengan konfigurasi default ini, login, dashboard, modul, lesson, quiz, tugas, profil, dan logout berjalan dari data lokal tanpa request ke backend.

Untuk mengaktifkan integrasi backend nanti, isi `.env.local`:

```bash
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_CSRF_ENDPOINT=/api/csrf-cookie
```

## Catatan integrasi backend

Frontend mengikuti kontrak backend Express/Better Auth yang tersedia di folder `backend`:

- seluruh request memakai `axios` dengan `withCredentials`
- request mutasi memanggil endpoint CSRF backend yang dikonfigurasi
- halaman aplikasi memeriksa sesi lewat `GET /api/user` dan mengarahkan pengguna tanpa sesi ke `/login`
