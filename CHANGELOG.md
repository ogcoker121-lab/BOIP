# Changelog

All notable changes to BOIP are documented in this file.

## v0.8.0 (pending release)

### Added

- Framework Explorer: BOIP's first Learning Capability. Every
  Recommendation Card links "Learn More" through to a framework's own
  page - what it is, why BOIP recommended it, when to use it, expected
  outcome, common mistakes, related frameworks, and a recommended next
  framework. Not a business plan generator, not AI - deterministic,
  built entirely from the Knowledge Catalog
- Capability navigation: every framework page also shows its
  capability, a related capability, which recommendations/opportunities
  use it, and what it leads to - exposing relationships the catalog
  already holds, not a new engine
- `resolveRelationshipsTargeting(id)` on the Knowledge Catalog: the one
  reverse lookup needed to answer "what references this id" - still
  flat id-based filtering, not a graph

### Architecture

- New domain, `src/domain/framework-explorer/` (`models/`,
  `knowledge/`, `resolver/`) - resolves everything exclusively through
  the Knowledge Catalog (`resolveCatalogEntry`/`resolveCatalogEntries`/
  `resolveRelationshipsTargeting`); the recommendation, opportunity,
  and rule domains are never imported directly
- `framework-guidance.ts`: hand-authored, deterministic
  whenToUse/expectedOutcome/commonMistakes per `FW-xxx` - the same kind
  of knowledge as `frameworkRegistry` itself, keyed to the catalog's
  existing ids rather than minting new identity
- "Related frameworks" are derived structurally: two frameworks are
  related if some Recommendation or Opportunity's own declared `USES`
  relationship references both - never a name or category guess
- First real catalog consumer: the Framework Explorer is what v0.7's
  Knowledge Catalog was built for. `framework/registry.ts` and every
  other existing consumer are untouched - migrating them is still a
  deliberate, separate, later step

### Excluded

- AI-generated explanations, business plan generation, payments,
  authentication, analytics, search, knowledge graph visualisation
- `RECOMMENDS`/`RECOMMENDED_BY` (`OPP-xxx` <-> `REC-xxx`) relationships
  remain unpopulated (a v0.7 limitation, unchanged here)

### Changed

- Recommendation cards: each referenced framework now shows a "Learn
  More" link to its Explorer page, alongside the existing resolved name

### Fixed

- N/A

## v0.7.0 (pending release)

### Added

- Knowledge Catalog: BOIP's canonical identity layer. Every permanent
  object (`FW-xxx`, `REC-xxx`, `OPP-xxx`, `RULE-xxx`) is now a
  `CatalogEntry` - title, description, owner, capability, version,
  status, and declared relationships - resolvable through one service
- `CatalogResolver`: `resolveCatalogEntry(id)` /
  `resolveCatalogEntries(ids)` - the one place any permanent id resolves
  to full metadata, deterministically
- Declared relationships between permanent objects: `REC-xxx USES
  FW-xxx`, `OPP-xxx USES FW-xxx`, `RULE-xxx GENERATES REC-xxx` - each
  derived from a real, already-explicit structural fact (an existing
  `frameworkReferences` field, or a knowledge rule's own `then`), never
  guessed from a name or category
- `schemaVersion` on every `CatalogEntry`, separate from the object's
  own `version` - lets the catalog format evolve later without breaking
  existing entries

### Architecture

- New domain, `src/domain/catalog/` (`models/`, `metadata/`,
  `builders/`, `relationships/`, `resolver/`) - no UI, a platform
  capability. Domains own behaviour; the catalog owns metadata
- Builders read each source domain's own existing data
  (`frameworkRegistry`, recommendation knowledge, `opportunityLibrary`,
  route/recommendation/opportunity-signal rule knowledge) rather than
  maintaining a second copy - the catalog builds itself
- `metadata/` holds only what genuinely doesn't exist elsewhere
  (framework capability, and uniform owner/version/status defaults)
  rather than duplicating fields a domain already has (e.g.
  `Recommendation.category` is read directly, not copied)
- No existing consumer (`framework/registry.ts`'s `resolveFramework()`
  and friends) has been migrated to the catalog yet - this release only
  builds the identity layer itself; migrating call sites is a
  deliberate later step

### Excluded

- Search, a knowledge graph, visualization, AI, persistence (per spec -
  this release is the identity layer only)
- `RECOMMENDS`/`RECOMMENDED_BY` relationships (`OPP-xxx` <-> `REC-xxx`):
  no domain object links an Opportunity to a Recommendation today, so
  there's nothing true to declare yet
- Migrating existing domains to resolve ids through the catalog instead
  of their own registries

### Changed

- N/A

### Fixed

- N/A

## v0.6.0

### Added

- Decision Engine: a deterministic `Decision` object that ties every
  existing engine's output together and explains why BOIP reached its
  conclusions - it does not change any recommendation, route, match, or
  score, it only explains them
- `DecisionTrace`: the internal explainability record alongside
  `Decision` - full signals and evaluations, plus id-only indices
  (`matchedRules`, `firedRecommendations`) for report/AI/developer
  consumers, kept separate from the UI-facing `Decision`
- `Signal` extraction: a human-readable view of which interview answers
  actually fed a decision (e.g. "Risk Tolerance = High"), traced back to
  the source question id
- `Evaluation` tracing: every knowledge rule - matched or not - is
  recorded with its permanent id, weight, and reason, via a new
  `evaluateRulesWithTrace()` on the shared engine
- Permanent `RULE-xxx` registry: every existing knowledge row (route
  weights, opportunity signals, recommendations) now has a stable id,
  the same never-renumbered/never-reused convention as
  `REC-xxx`/`FW-xxx`/`OPP-xxx`
- Explanation generator: "Why BOIP recommended this" is generated
  entirely from matched evaluations - no AI, no prompts, no new prose;
  every bullet reuses a reason string that already existed elsewhere in
  the app
- UI: an optional, collapsed-by-default "Why BOIP recommended this"
  section on the Next Move card

### Architecture

- New domain, `src/domain/decision/` (`models/`, `engine/`, `mapper/`,
  `trace/`), separate from every domain it explains - it reads their
  output, never recomputes or overrides it
- `Decision` (UI-facing) and `DecisionTrace` (developer/report/AI-facing)
  are deliberately separate objects, both computed together by
  `buildDecisionWithTrace()` - the public model stays clean without
  losing any explainability
- `Decision.id` (`DEC-xxx`) is a runtime id, not part of the permanent
  ontology, since a Decision is recomputed fresh every time an interview
  is evaluated and never persisted
- BOIP's mental model shifts from a linear pipeline to an evaluation
  graph: Interview Signals -> Knowledge Evaluation -> Decision ->
  (Recommendations, Opportunity Matches) -> Framework References ->
  Presentation

### Excluded

- AI / LLM-generated explanations
- Persisting Decisions
- Any change to recommendation logic, opportunity matching, scores, or
  interview questions

### Changed

- N/A

### Fixed

- N/A

## v0.5.0

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
