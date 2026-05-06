# API Contract (Canonical)

## Shared Contract Source
- `packages/shared/src`

## Request Payloads

### `POST /login`
- body:
  - `email: string`
  - `password: string`

### `PUT /api/profile`
- canonical body:
  - `fullName: string`
  - `email: string`
  - `phone?: string`
  - `bio?: string`
- backward compatibility:
  - accepts `name` and maps to `fullName`

### `POST /api/tasks/:id/submit`
- canonical body:
  - `submissionLink: string`
- backward compatibility:
  - accepts `submission_link` and maps to `submissionLink`

### `POST /api/quizzes/:id/submit`
- body:
  - `answers: Record<string, string>`
  - `fullscreenViolation: boolean`

### `POST /api/lessons/:id/duration`
- body:
  - `seconds: number`

## Response Shape Notes
- Student profile/dashboard user now canonicalized to `fullName`.
- DB legacy names stay mapped in backend:
  - `users.name -> fullName`
  - `task_submissions.submission_link -> submissionLink`
