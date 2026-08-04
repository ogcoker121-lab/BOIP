# Changelog

All notable changes to BOIP are documented in this file.

## v0.3.0 (pending release)

### Added

- Opportunity Snapshot: replaces the "Thank you" completion screen with a
  structured, rule-based read on the founder's idea - Founder Summary,
  Opportunity Overview, Strengths, Watch List, Recommended Next Steps
- Three new structured interview questions (industry, business stage,
  revenue model) so the snapshot has real categorical data to key off
- `OpportunityMapper` (`buildOpportunitySnapshot`), a pure function
  independent of the UI
- Deterministic rules as data (`lib/opportunity/rules.ts`) - no AI, no LLM
  calls; the same answers always produce the same snapshot

### Architecture

- Rules live as data, not branching code - extend the rule tables to add
  behavior, not the mapper itself
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

- Interview grew from 10 to 13 questions
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
