# Akara LMS Backend

Backend Express + Prisma + PostgreSQL untuk LMS sesuai `prd.md`.

## Stack

- Express 5 + TypeScript
- PostgreSQL
- Prisma ORM
- Better Auth
- Zod validation

## Struktur

```text
backend/
  prisma/
    schema.prisma
  src/
    config/
    controllers/
    lib/
    middlewares/
    routes/
    services/
    utils/
    validators/
```

## Menjalankan

1. Salin `.env.example` menjadi `.env`.
2. Install dependency:
   `npm install`
3. Generate Prisma client:
   `npm run prisma:generate`
4. Jalankan migration awal:
   `npm run prisma:migrate -- --name init`
5. Start development server:
   `npm run dev`

## Endpoint utama

- `POST /login`
- `POST /logout`
- `GET /api/csrf-cookie`
- `GET /api/user`
- `GET /api/dashboard`
- `GET /api/modules`
- `GET /api/modules/:id`
- `GET /api/courses`
- `GET /api/lessons/:id`
- `POST /api/lessons/:id/duration`
- `POST /api/lessons/:id/complete`
- `GET /api/quizzes/:id`
- `POST /api/quizzes/:id/start`
- `POST /api/quizzes/:id/submit`
- `GET /api/quizzes/:id/result`
- `GET /api/tasks/:id`
- `POST /api/tasks/:id/submit`
- `PUT /api/profile`
- `POST /api/profile/change-password`

## Catatan

- Better Auth dipasang pada `/api/auth/*splat`, lalu `POST /login` dan `POST /logout` menjadi alias yang cocok dengan frontend saat ini.
- Endpoint CSRF tersedia di `/api/csrf-cookie`.
- Schema Prisma sudah disiapkan untuk domain inti LMS. Anda masih bisa memperluas tabel pivot atau audit log sesuai fase berikutnya.
