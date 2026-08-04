# Founder Discovery Interview

A minimal Next.js app implementing the BOIP Founder Discovery Interview
workflow: landing page -> 14-question interview -> review -> submit ->
Opportunity Snapshot with Recommended Actions. Progress auto-saves and
resumes across refreshes/return visits (v0.2). After submitting, the founder
gets a structured, rule-based read on their idea (v0.3) plus ordered,
concrete next actions (v0.4) - no AI anywhere.

Scope is intentionally narrow: no AI, no auth, no scoring, no payments, no
analytics, no reports.

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
  select fields added in v0.3 so both domains below have real categorical
  data to key off, rather than guessing from prose.
- `types/interview.ts` - the `InterviewQuestion` shape
- `components/interview/` - Interview, QuestionCard, ProgressBar,
  NavigationButtons, ReviewAnswers (presentational, no state, no
  persistence), plus the Opportunity Snapshot's FounderSummary,
  OpportunityOverview, StrengthsList, WatchList, RecommendedActions /
  RecommendationCard, and the OpportunitySnapshot component that composes
  them
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
- `src/domain/shared/rule-engine.ts` - the one generic evaluation engine
  (`Rule<Context, Result>` + `evaluateRules()`). Knows nothing about
  interviews, opportunities, or recommendations - every domain below
  reuses it rather than building its own.
- `src/domain/opportunity/` - describes the opportunity:
  - `context.ts` - `OpportunityContext` plus `buildOpportunityContext()`,
    shared with the recommendation domain so both read the interview
    identically
  - `knowledge/customer-validation.ts`, `knowledge/pricing.ts` -
    deterministic mappings as data (strengths, watch-list signals). Named
    `knowledge/` rather than `rules/` since not everything BOIP evaluates
    will be a simple condition -> outcome rule forever.
  - `snapshot-model.ts` - the `OpportunitySnapshot` / `OpportunityOverview`
    shapes
  - `opportunity-mapper.ts` - `buildOpportunitySnapshot()`, pure,
    UI-independent
- `src/domain/recommendation/` - decides what to do about it (its own
  domain, not part of opportunity):
  - `models/recommendation.ts` - the `Recommendation` shape: permanent
    `id` (`REC-xxx`, hand-assigned in knowledge, never renumbered/reused -
    the start of BOIP's internal ontology), category/priority/effort/
    impact enums, `actions[]`, and `frameworkReferences[]` (stable
    `FW-xxx` IDs, not free-text framework names)
  - `knowledge/` - one file per category (customer-discovery,
    business-model, market-validation, pricing, competition, mvp), data
    only
  - `engine/recommendation-engine.ts` - runs the shared `evaluateRules()`
    against all six knowledge sets (not a second engine), then sorts
    deterministically by priority, then impact, then effort
  - `mapper/recommendation-mapper.ts` - `buildRecommendations()`, pure,
    UI-independent, builds the same `OpportunityContext` the opportunity
    domain does
- `supabase/migrations/` - schema SQL
