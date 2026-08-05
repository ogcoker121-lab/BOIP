# Founder Discovery Interview

A minimal Next.js app implementing the BOIP Founder Discovery Interview
workflow: landing page -> 19-question interview -> review -> submit ->
Opportunity Snapshot with a personalised Next Move. Progress auto-saves and
resumes across refreshes/return visits (v0.2). After submitting, the founder
gets a structured, rule-based read on their idea (v0.3), ordered concrete
next actions (v0.4), and a named business/side-hustle/job/hybrid/skill-path
recommendation with one clickable next step (v0.5) - no AI anywhere.

Scope is intentionally narrow: no AI, no auth, no scoring, no payments, no
analytics, no reports, no live search.

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

- `data/questions.ts` - the 19 interview questions (data, not UI). Every
  question is tagged with the capability that consumes it
  (`QuestionCapability` in `types/interview.ts`) - Founder Discovery, Route
  Decision, Opportunity Matching, Business Planning (future), Career
  Guidance (future) - so the interview can't drift into a generic survey.
- `types/interview.ts` - `InterviewQuestion`, `QuestionCapability`, and the
  `multi-select` question type (comma-joined string, capped by
  `maxSelections`)
- `components/interview/` - Interview, QuestionCard, ProgressBar,
  NavigationButtons, ReviewAnswers (presentational, no state, no
  persistence), the Opportunity Snapshot's FounderSummary,
  OpportunityOverview, StrengthsList, WatchList, RecommendedActions /
  RecommendationCard, TopOpportunities / OpportunityCard, NextMoveCard, and
  the OpportunitySnapshot component that composes all of them
- `app/interview/context/InterviewContext.tsx` - the interview wizard's
  state, scoped to `app/interview/*` only, plus persistence (restore on
  mount, auto-save, submit)
- `app/api/interview/` - the service layer: `POST /api/interview` (create),
  `GET /api/interview/:id` (resume), `PATCH /api/interview/:id` (save an
  answer and/or the current question pointer, or `{action: "submit"}`)
- `app/business-plan/[id]/`, `app/side-hustle/[id]/`, `app/jobs/`,
  `app/skills/` - the Next Move's real clickable destinations. The plan
  pages show what the Starter Opportunity Library actually knows about a
  named `OPP-xxx`, honestly labeled as library content rather than a
  personalised plan (full plan generation is v0.6). `/jobs` and `/skills`
  are explicit about what's not built yet instead of faking content.
- `lib/interview-repository.ts` - the `InterviewRepository` interface, an
  in-memory implementation, and a factory that picks Supabase when
  configured
- `lib/supabase-interview-repository.ts` - the Supabase implementation
  (server-only)
- `lib/interview-client.ts` - the browser-side fetch wrapper the Context
  uses; never touches the repository or Supabase directly
- `src/domain/shared/` - the one generic evaluation engine
  (`rule-engine.ts`: `Rule<Context, Result>` + `evaluateRules()`) and
  `NextMoveType`, both shared across domains so none of them depend on each
  other for these
- `src/domain/framework/registry.ts` - resolves `FW-xxx` to
  `{name, summary, whyItMatters}`. A founder never sees a raw framework id;
  wherever one is referenced (recommendation cards, opportunity plan pages)
  it's resolved here first.
- `src/domain/opportunity/` - describes the opportunity:
  - `context.ts` - `OpportunityContext` plus `buildOpportunityContext()`,
    shared by every other domain so all of them read the interview
    identically
  - `knowledge/customer-validation.ts`, `knowledge/pricing.ts` -
    deterministic strengths/watch-list signals, as data
  - `snapshot-model.ts`, `opportunity-mapper.ts` - `OpportunitySnapshot`
    and `buildOpportunitySnapshot()`, pure, UI-independent
  - `library/` - the Starter Opportunity Library as a domain object, not
    static pages: `models/opportunity.ts` (`Opportunity`, `OPP-xxx`
    permanent id - its attribute fields ARE the recommendation rules, not
    a separate parallel list), `catalog/` (16 curated entries, 7 business +
    9 side-hustle, spanning all ten skill categories), `matching/` (scores
    library entries 0-100 against a founder profile - skills/capital/time/
    risk/industry - and picks a diverse Top 3; explicitly a profile-fit
    score, not a success prediction)
- `src/domain/route-decision/` - decides business_plan / side_hustle /
  job_search / hybrid_path / skill_path:
  - `models/route-context.ts` - derives normalized bands (risk, urgency,
    capital, time, a composite business-readiness score) from raw answers
  - `knowledge/route-weights.ts` - each row is a weighted nudge toward one
    route, including compound conditions so weak fundamentals actively
    count against `business_plan` rather than only boosting alternatives
  - `engine/route-decision-engine.ts` - sums weighted contributions
    (reusing the shared engine for matching) and picks the highest; an
    explicit "find a job" preference is honored unconditionally, never
    outweighed by other signals
  - `mapper/route-decision-mapper.ts`, `mapper/next-move-mapper.ts` - the
    latter is the top of the pipeline: decides the route, matches
    opportunities against it, applies the `skill_path` override if
    matching found a genuine skills gap, and produces the one clickable
    `NextMove`
- `src/domain/recommendation/` - decides what to do about the opportunity
  (its own domain, not part of `opportunity/`):
  - `models/recommendation.ts` - the `Recommendation` shape: permanent
    `id` (`REC-xxx`), category/priority/effort/impact enums, `actions[]`,
    `frameworkReferences[]`
  - `knowledge/` - one file per category, data only
  - `engine/recommendation-engine.ts` - the shared engine plus
    deterministic sorting (priority, then impact, then effort)
  - `mapper/recommendation-mapper.ts` - `buildRecommendations()`, pure
- `supabase/migrations/` - schema SQL
