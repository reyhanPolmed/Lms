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
- `src/lib/mocks`: fallback data opsional bila `NEXT_PUBLIC_USE_MOCK_API=true`

## Menjalankan

```bash
npm install
npm run dev
```

Salin `.env.example` menjadi `.env.local` bila perlu. Secara default proyek memakai API backend pada `http://localhost:3001`.

## Catatan integrasi backend

Frontend mengikuti kontrak backend Express/Better Auth yang tersedia di folder `backend`:

- seluruh request memakai `axios` dengan `withCredentials`
- request mutasi memanggil endpoint CSRF backend yang dikonfigurasi
- halaman aplikasi memeriksa sesi lewat `GET /api/user` dan mengarahkan pengguna tanpa sesi ke `/login`
