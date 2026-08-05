# Founder Discovery Interview

A minimal Next.js app implementing the BOIP Founder Discovery Interview
workflow: landing page -> 19-question interview -> review -> submit ->
Opportunity Snapshot with a personalised Next Move. Progress auto-saves and
resumes across refreshes/return visits (v0.2). After submitting, the founder
gets a structured, rule-based read on their idea (v0.3), ordered concrete
next actions (v0.4), a named business/side-hustle/job/hybrid/skill-path
recommendation with one clickable next step (v0.5), and an optional "Why
BOIP recommended this" explanation tracing that recommendation back to the
interview answers and knowledge rules that produced it (v0.6) - no AI
anywhere. Under the hood, every permanent object (frameworks,
recommendations, opportunities, rules) is now resolvable through one
Knowledge Catalog - BOIP's canonical identity layer, not a founder-facing
feature (v0.7). Every framework referenced by a recommendation now has its
own Framework Explorer page - what it is, why it was recommended, when to
use it, expected outcome, common mistakes, and related frameworks - BOIP's
first Learning Capability, built entirely from the Knowledge Catalog
(v0.8).

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
  RecommendationCard (each referenced framework now links "Learn More"
  to its Framework Explorer page), TopOpportunities / OpportunityCard,
  NextMoveCard (now with an optional, collapsed-by-default
  WhyBoipRecommended section), and the OpportunitySnapshot component
  that composes all of them
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
- `app/frameworks/[id]/` - the Framework Explorer (v0.8): what a
  framework is, why BOIP recommended it, when to use it, expected
  outcome, common mistakes, related frameworks, and a recommended next
  framework - resolved entirely by
  `src/domain/framework-explorer/resolver/framework-explorer-resolver.ts`,
  server-rendered, no client state
- `lib/interview-repository.ts` - the `InterviewRepository` interface, an
  in-memory implementation, and a factory that picks Supabase when
  configured
- `lib/supabase-interview-repository.ts` - the Supabase implementation
  (server-only)
- `lib/interview-client.ts` - the browser-side fetch wrapper the Context
  uses; never touches the repository or Supabase directly
- `src/domain/shared/` - the one generic evaluation engine
  (`rule-engine.ts`: `Rule<Context, Result>` + `evaluateRules()`, plus
  `evaluateRulesWithTrace()` for the decision domain) and `NextMoveType`,
  both shared across domains so none of them depend on each other for
  these. Every `Rule` now carries a permanent `RULE-xxx` id - the same
  convention as `REC-xxx`/`FW-xxx`/`OPP-xxx` - assigned once in its
  knowledge file, never renumbered or reused
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
- `src/domain/decision/` - explains what every other domain already
  decided; never recomputes or overrides route, opportunities, scores, or
  recommendations:
  - `models/decision.ts` - `Decision` (UI-facing: id, route,
    opportunities, recommendations, explanation) and `DecisionTrace`
    (everything else: signals, full evaluations, and two convenience
    id-only indices - `matchedRules` (`RULE-xxx`) and
    `firedRecommendations` (`REC-xxx`) - for report/AI/developer
    consumers that want to walk id -> id relationships without
    re-deriving them). `Decision.id` (`DEC-xxx`) is a runtime id, not
    part of the permanent ontology - a Decision is recomputed fresh per
    evaluation and never persisted
  - `models/signals.ts` - `buildSignals()`: a human-readable view of the
    interview answers that actually fed a decision (e.g. "Risk Tolerance
    = High"), traced back to the source question id
  - `engine/decision-engine.ts` - `buildEvaluations()`: re-evaluates the
    same route/opportunity/recommendation knowledge via
    `evaluateRulesWithTrace()` (shared engine) to record which `RULE-xxx`
    rows matched and why - matched and unmatched rows both kept, for
    genuine auditability
  - `trace/explanation-generator.ts` - `buildExplanation()`: generates
    "Why BOIP recommended this" entirely from matched evaluations - no
    AI, no prompts, every bullet reuses a reason string that already
    existed elsewhere
  - `mapper/decision-mapper.ts` - `buildDecisionWithTrace()`, pure,
    computes `{ decision, trace }` together; `buildDecision()` is a thin
    wrapper returning just `Decision`, the UI's only need
- `src/domain/catalog/` - BOIP's canonical identity layer. No UI, a
  platform capability: domains own behaviour, the catalog owns metadata
  - `models/catalog-entry.ts` - `CatalogEntry` (id, type, title,
    description, owner, capability, version, status, relationships,
    schemaVersion) and `createCatalogEntry()`, so every builder stamps
    `schemaVersion` consistently
  - `models/relationship.ts` - `Relationship` (sourceId, targetId, type)
  - `metadata/` - only what genuinely doesn't exist elsewhere (framework
    capability per `FW-xxx`; uniform owner/version/status defaults for
    Recommendation/Opportunity/Rule) - never a field a domain already has
  - `builders/` - one per type (`framework-builder.ts`,
    `recommendation-builder.ts`, `opportunity-builder.ts`,
    `rule-builder.ts`), each reading its source domain's own existing
    data (`frameworkRegistry`, recommendation knowledge,
    `opportunityLibrary`, the three rule-knowledge groups
    `decision-engine.ts` already evaluates) rather than a second copy
  - `relationships/` - derivation functions, not hardcoded data: `REC-xxx
    USES FW-xxx` and `OPP-xxx USES FW-xxx` from each object's own
    `frameworkReferences`; `RULE-xxx GENERATES REC-xxx` from a
    recommendation rule's own `then`. Nothing is guessed - every
    relationship traces to a field that already existed
  - `resolver/catalog-resolver.ts` - `resolveCatalogEntry(id)` /
    `resolveCatalogEntries(ids)`, the one place any permanent id
    resolves to full metadata; builds the merged catalog once.
    `resolveRelationshipsTargeting(id)` (v0.8) is the one reverse lookup
    exposed - which relationships point at this id - still flat
    id-based filtering, not a graph
  - `index.ts` - the domain's public surface for consumers (the
    Framework Explorer, v0.8, is the first real one; a report
    generator, AI enrichment, or knowledge graph could be next). No
    existing pre-v0.8 domain has been migrated to resolve ids through
    it - this release only builds the identity layer itself
- `src/domain/framework-explorer/` - BOIP's first Learning Capability
  (v0.8): helps a founder understand a recommended framework, not
  generate a plan. Resolves everything exclusively through the
  Knowledge Catalog - never imports the recommendation, opportunity, or
  rule domains directly:
  - `models/framework-page.ts` - `FrameworkPage`, the shape one
    Explorer page needs; `FrameworkPageReference` (id + title only) is
    what related-framework/used-by lists carry, never a second copy of
    a `CatalogEntry`
  - `knowledge/framework-guidance.ts` - hand-authored, deterministic
    whenToUse/expectedOutcome/commonMistakes per `FW-xxx` - the same
    kind of knowledge as `frameworkRegistry` itself, keyed to the
    catalog's existing ids rather than minting new identity
  - `resolver/framework-explorer-resolver.ts` -
    `resolveFrameworkPage(id)`: `whatItIs`/description come straight
    from the catalog; `whyRecommended` is built from the Recommendations
    that actually reference this framework (their own catalog
    title/description, reused verbatim); `relatedFrameworks` are
    frameworks some Recommendation or Opportunity references alongside
    this one (derived from each entry's own declared `USES`
    relationships, never a name/category guess); `nextRecommendedFramework`
    is the first related framework, deterministic; `usedBy`/
    `relatedCapability`/`leadsTo` (capability navigation) each read data
    the catalog already holds
- `app/frameworks/[id]/` - the Framework Explorer page: what it is, why
  BOIP recommended it, when to use it, expected outcome, common
  mistakes, related frameworks (clickable), a recommended next
  framework, and a capability block. Linked from every Recommendation
  Card's "Learn More"
- `supabase/migrations/` - schema SQL
