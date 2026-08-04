# Founder Discovery Interview

A minimal Next.js app implementing the BOIP Founder Discovery Interview
workflow: landing page -> 14-question interview -> review -> submit ->
Opportunity Snapshot. Progress auto-saves and resumes across refreshes/return
visits (v0.2). After submitting, the founder gets a structured, rule-based
read on their idea - no AI, no "Thank you" page (v0.3).

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

- `data/questions.ts` - the 14 interview questions (data, not UI). Four
  (industry, business-stage, revenue-model, market-type) are structured
  select fields added in v0.3 specifically so the Opportunity Snapshot has
  real categorical data to key rules off, rather than guessing from prose.
- `types/interview.ts` - the `InterviewQuestion` shape
- `components/interview/` - Interview, QuestionCard, ProgressBar,
  NavigationButtons, ReviewAnswers (presentational, no state, no
  persistence), plus the Opportunity Snapshot's FounderSummary,
  OpportunityOverview, StrengthsList, WatchList, NextSteps, and the
  OpportunitySnapshot component that composes them
- `app/interview/context/InterviewContext.tsx` - the interview wizard's
  state, scoped to `app/interview/*` only, plus persistence (restore on
  mount, auto-save, submit)
- `app/api/interview/` - the service layer: `POST /api/interview` (create),
  `GET /api/interview/:id` (resume), `PATCH /api/interview/:id` (save an
  answer and/or the current question pointer, or `{action: "submit"}`)
- `lib/interview-repository.ts` - the `InterviewRepository` interface, an
  in-memory implementation, and a factory that picks Supabase when
  configured
- `lib/supabase-interview-repository.ts` - the Supabase implementation
  (server-only)
- `lib/interview-client.ts` - the browser-side fetch wrapper the Context
  uses; never touches the repository or Supabase directly
- `src/domain/opportunity/` - the Opportunity Snapshot's domain layer,
  separate from the interview feature and the UI:
  - `rule-engine.ts` - generic `Rule<Context, Result>` + `evaluateRules()`,
    knows nothing about interviews or opportunities specifically
  - `context.ts` - `OpportunityContext`, the shape every rule evaluates
    against
  - `knowledge/business-stage.ts`, `knowledge/revenue-model.ts`,
    `knowledge/customer-validation.ts`, `knowledge/pricing.ts` - the actual
    deterministic mappings, as data. Named `knowledge/` rather than
    `rules/` since not everything BOIP evaluates will be a simple
    condition -> outcome rule forever; the directory should be able to
    grow to hold heuristics, thresholds, and mappings without a rename.
    Add a row to change behavior; the mapper and rule engine never need
    to change.
  - `snapshot-model.ts` - the `OpportunitySnapshot` / `OpportunityOverview`
    shapes
  - `opportunity-mapper.ts` - `buildOpportunitySnapshot()`, a pure function
    (`InterviewAnswers -> OpportunitySnapshot`) independent of the UI,
    callable from a page today or a server route later
- `supabase/migrations/` - schema SQL
