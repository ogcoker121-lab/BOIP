# Changelog

All notable changes to BOIP are documented in this file.

## v0.5.0 (pending release)

### Added

- Opportunity Discovery: replaces generic "next steps" text with a named
  business, side-hustle, job, hybrid, or skill-building recommendation and
  one primary clickable Next Move
- Starter Opportunity Library: 16 curated opportunities (`OPP-xxx`
  permanent ids) as first-class domain objects, not static pages
- Route Decision Engine: deterministically decides business_plan /
  side_hustle / job_search / hybrid_path / skill_path from risk tolerance,
  income urgency, employment status, stated preference, and a composite
  business-readiness score
- Opportunity matching and scoring (0-100 profile-fit, not a success
  prediction) with diversity-aware Top 3 selection (Best Match / Strong
  Alternative / Different Direction)
- Framework Resolver: `FW-xxx` references resolve to real names/summaries
  everywhere they appear, including v0.4's recommendation cards
- Real clickable routes: `/business-plan/[id]`, `/side-hustle/[id]`,
  `/jobs`, `/skills`
- Five new interview questions (professional skills, preferred path,
  employment status, risk tolerance, income urgency), every question
  tagged with the capability that consumes it

### Architecture

- `src/domain/shared/rule-engine.ts` and `NextMoveType` are shared
  primitives - opportunity/, recommendation/, and route-decision/ all
  build on them without depending on each other
- Route decision uses weighted knowledge rows (including compound
  conditions) evaluated by the same shared engine, not a second one -
  multi-signal decisions summed and ranked rather than a single rule
  deciding everything
- skill_path is applied after opportunity matching, not during route
  decision, since it depends on match quality
- Opportunity Library entries are self-describing: their attribute fields
  (suitableFor, risk, capital, skills, time) are the matching rules
  themselves, not a separate parallel rule set

### Excluded

- AI / LLM-generated recommendations
- Live search, live jobs, external APIs, market feeds
- Opportunity Score
- Payments
- Authentication
- Analytics

### Changed

- Interview grew from 14 to 19 questions
- Recommendation cards (v0.4) now show resolved framework names instead of
  raw `FW-xxx` ids

### Fixed

- N/A

## v0.4.0

### Added

- Recommendation Engine: the Opportunity Snapshot's "Recommended Next
  Steps" list is replaced with ordered Recommendation Cards - title, why
  it matters, priority, estimated effort, expected impact, and a concrete
  action checklist
- `Recommendation` domain model with a permanent `id` (`REC-xxx`) and
  stable `frameworkReferences` (`FW-xxx`) instead of free-text names -
  the start of BOIP's internal ontology
- Recommendation knowledge across six categories: Customer Discovery,
  Business Model, Market Validation, Pricing, Competition, MVP
- Deterministic ordering: priority, then impact, then effort

### Architecture

- New domain, `src/domain/recommendation/`, separate from
  `src/domain/opportunity/` - each capability owns its own domain
- The generic rule engine moved to `src/domain/shared/rule-engine.ts` and
  is reused by both domains - no second engine
- Opportunity's old next-step knowledge (business-stage, revenue-model)
  is retired; "what to do next" now lives entirely in the recommendation
  domain
- `OpportunityContext` construction (`buildOpportunityContext`) is shared
  between both domains so they read the interview identically

### Excluded

- AI / LLM-generated recommendations
- Opportunity Score
- Payments
- Authentication
- Analytics
- Reports

### Changed

- "Recommended Next Steps" (plain text list) replaced by "Recommended
  Actions" (Recommendation Cards)

### Fixed

- N/A

## v0.3.0

### Added

- Opportunity Snapshot: replaces the "Thank you" completion screen with a
  structured, rule-based read on the founder's idea - Founder Summary,
  Opportunity Overview, Strengths, Watch List, Recommended Next Steps
- Four new structured interview questions (industry, business stage,
  revenue model, market type) so the snapshot has real categorical data to
  key off
- `OpportunityMapper` (`buildOpportunitySnapshot`), a pure function
  independent of the UI
- Generic rule engine (`Rule<Context, Result>` + `evaluateRules`) plus
  deterministic BOIP rules as data, split by topic (business stage, revenue
  model, customer validation, pricing) - no AI, no LLM calls; the same
  answers always produce the same snapshot

### Architecture

- New domain layer, `src/domain/opportunity/`, separate from both the
  interview feature and the UI - `Interview -> Interview Service ->
  Opportunity Mapper -> Rule Engine -> Snapshot Model -> UI`
- Rules live as data, not branching code, one file per concern - extend a
  rule table to add behavior, not the mapper or rule engine
- Mapper has no UI dependency and no network calls, so it's callable from a
  server route later (e.g. to persist a snapshot) without changing it

### Excluded

- AI / LLM-generated analysis
- Scoring
- AI-based recommendations
- Payments
- Authentication
- Analytics
- Founder Intelligence Report

### Changed

- Interview grew from 10 to 14 questions
- The interview's final screen is now the Opportunity Snapshot, not a
  completion message

### Fixed

- N/A

## v0.2.0

### Added

- Interview persistence: progress auto-saves and resumes across browser
  refreshes and return visits
- `InterviewRepository` interface with in-memory and Supabase
  implementations
- Minimal Supabase schema (`interviews`, `interview_answers`)
- Service layer: `POST/GET/PATCH /api/interview[/:id]`
- Anonymous sessions (no authentication) via a client-generated interview id

### Architecture

- Repository pattern: UI and API routes never depend on where interview
  data lives; Supabase is a swappable implementation, not a hard dependency
- App stays fully buildable/testable with zero external setup (in-memory
  fallback when Supabase env vars aren't set)

### Excluded

- AI
- Authentication
- Payments
- Analytics
- Scoring
- Recommendation Engine
- Founder Intelligence Report

### Changed

- N/A

### Fixed

- N/A

## v0.1.0

### Added

- Founder Discovery Interview MVP
- Landing page
- Data-driven interview engine
- 10-question interview
- Progress bar
- Previous / Next navigation
- Required field validation
- Review screen
- Completion screen
- Feature-scoped Interview Context

### Architecture

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Modular interview components
- Data-driven question model

### Excluded

- AI
- Authentication
- Database
- Payments
- Analytics
- Scoring
- Recommendation Engine

### Changed

- N/A

### Fixed

- N/A
