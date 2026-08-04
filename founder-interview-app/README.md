# Founder Discovery Interview

A minimal Next.js app implementing the BOIP Founder Discovery Interview
workflow: landing page -> 10-question interview -> review -> submit ->
completion. Progress auto-saves and resumes across refreshes/return visits
(v0.2).

Scope is intentionally narrow: no AI, no auth, no scoring, no payments, no
analytics, no recommendations, no reports.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

By default this runs against an in-memory repository (data resets when the
dev server restarts), so it works out of the box with no setup. To persist
to Supabase instead, see below.

## Supabase setup (optional)

1. Create a free project at [supabase.com](https://supabase.com).
2. Run `supabase/migrations/0001_interview_persistence.sql` against it (SQL
   Editor, or the Supabase CLI).
3. Copy `.env.example` to `.env.local` and fill in `SUPABASE_URL` and
   `SUPABASE_SERVICE_ROLE_KEY` from Project Settings -> API.
4. Restart the dev server.

Both env vars are server-only - the app never talks to Supabase from the
browser, only through its own API routes - so if either is missing the app
falls back to the in-memory repository automatically.

## Structure

- `data/questions.ts` - the 10 interview questions (data, not UI)
- `types/interview.ts` - the `InterviewQuestion` shape
- `components/interview/` - Interview, QuestionCard, ProgressBar,
  NavigationButtons, ReviewAnswers, CompletionCard (presentational, no
  state, no persistence)
- `app/interview/context/InterviewContext.tsx` - the interview wizard's
  state, scoped to `app/interview/*` only, plus persistence (restore on
  mount, auto-save, submit)
- `app/api/interview/` - the service layer: `POST /api/interview` (create),
  `GET /api/interview/:id` (resume), `PATCH /api/interview/:id` (save an
  answer, or `{action: "submit"}`)
- `lib/interview-repository.ts` - the `InterviewRepository` interface, an
  in-memory implementation, and a factory that picks Supabase when
  configured
- `lib/supabase-interview-repository.ts` - the Supabase implementation
  (server-only)
- `lib/interview-client.ts` - the browser-side fetch wrapper the Context
  uses; never touches the repository or Supabase directly
- `supabase/migrations/` - schema SQL
