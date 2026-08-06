# Contributing

This is a small, deliberately narrow-scoped app. Before touching
anything, read `docs/ARCHITECTURE.md` for *why* it's structured the way
it is - this document is the practical *how*.

## Specification-First Development

BOIP v1.0 onward follows one governing sequence for every feature:

```
Product Specification -> Technical Design -> Implementation -> Review -> Merge
```

Not "idea, then code, then a specification written to match what got
built." The specification comes first and is approved before
implementation begins; a technical design (an implementation plan,
proposed for anything non-trivial) follows it and is itself approved
before code is written; only then does implementation start.

**`BOIP-Product/docs/BOIP-v1.0-Product-Specification.md`** (repo root)
is the authoritative product specification for BOIP v1.0 - the contract
every feature traces back to. Its **Product Principles** section
(founder journey first, no invented content, explainable decisions,
Single Source of Truth, deterministic before generative, honest about
limitations, narrow scope by design) functions as a set of
non-functional requirements: a PR that can't justify itself against
them needs to explain why, not skip the question.

A record of the major *irreversible* architecture decisions behind this
codebase (why BOIP is deterministic-first, why AI is an enhancement
layer rather than the reasoning engine, why stable ids exist, why the
Knowledge Catalog owns identity, why domains only communicate through
public APIs, why Business Plans compose knowledge instead of
generating it, why explainability is mandatory) is planned as
`BOIP-Product/docs/ARCHITECTURE_DECISIONS.md`, to be written before
public beta launch - not yet created.

## Setup

```bash
npm install
npm run dev
```

Runs against an in-memory repository by default - no Supabase setup
needed to develop. See the root `README.md` for optional Supabase
persistence.

## Before opening a PR

Run all of these; they're what CI/review will check:

```bash
npm run lint            # ESLint, including the domain-boundary rule
npm run build            # production build + TypeScript check
npm test                 # Vitest - domain tests + architecture tests
npm run test:coverage    # same, with a coverage report (no threshold - visibility only)
npm run test:e2e         # Playwright, against a production build
```

`npm run test:e2e` builds and starts the app itself
(`playwright.config.ts`'s `webServer`), so you don't need `npm run dev`
running first.

## Domain boundaries are enforced, not just conventional

Every domain under `src/domain/<name>/` exposes exactly one import
surface: `src/domain/<name>/index.ts`. Importing anything from inside a
domain other than its own `index.ts` is a lint error
(`no-restricted-imports` in `eslint.config.mjs`) with no per-file
exceptions, and is also checked independently by
`src/architecture.test.ts`. If you add a new domain, give it an
`index.ts` barrel exporting exactly its intended public surface before
anything else imports from it.

If another domain genuinely needs raw knowledge from yours (not just
your computed output - see `docs/ARCHITECTURE.md`'s "Why some domains
export raw knowledge too"), export it from your own barrel with a
comment explaining why, rather than asking for a lint exception.

## Where logic goes

Business logic is data ("knowledge"), evaluated by the shared engine
(`src/domain/shared/rule-engine.ts`), never branching code scattered
through components or pages. If you're about to write an `if` chain
that encodes a business rule, it almost certainly belongs in a
knowledge file as a `Rule<Context, Result>` instead.

- **Permanent ids** (`REC-xxx`, `FW-xxx`, `OPP-xxx`, `RULE-xxx`): assign
  the next unused number in sequence, in the relevant knowledge file.
  Never renumber or reuse a retired one.
- **Runtime ids** (`DEC-xxx`, `BP-xxx`): generated at evaluation time
  (`crypto.randomUUID()`), never persisted, never added to the
  Knowledge Catalog.

## Tests

- Add a co-located `*.test.ts` next to any new pure function you'd
  regret breaking silently - domain mappers/resolvers/builders and any
  non-trivial helper. Match the existing style: build a small, readable
  fixture, assert on the actual shape the function returns (verify
  against real output first, don't guess at exact strings).
- If you add or move a domain boundary, add or update the matching
  check in `src/architecture.test.ts` - and verify it actually fails
  when you deliberately reintroduce the violation, not just that it
  passes once written.
- If you touch the founder-facing flow (the interview wizard, the
  Opportunity Snapshot, the Business Plan, the Framework Explorer),
  check whether `e2e/founder-journey.spec.ts` or
  `e2e/framework-explorer.spec.ts` need updating - they exercise the
  real click-through path, not just component output.

## Commits

Small, logical, separately buildable and lintable commits - one
concern per commit (e.g. "add the domain model" separate from "wire it
into the UI"). Write commit messages that explain *why*, not just
*what*, the way the existing history does.

## Error handling

Domains never throw on a missing/invalid id or empty input - they
return `null` (or an empty array/object) and the caller renders
`components/shared/EmptyState`. `components/shared/ErrorState` exists
for genuinely unexpected runtime failures (e.g. `app/error.tsx`'s route
error boundary), not as a substitute for that convention - don't reach
for it as an alternative to returning `null`.

## Accessibility

Every interactive control needs a keyboard path and an accessible name
that's unambiguous on its own (not just "Edit" or "Learn More" - see
how `components/interview/ReviewAnswers.tsx` and
`components/interview/RecommendationCard.tsx` disambiguate repeated
controls with `aria-label`). Don't remove a focus outline
(`outline-none`) without replacing it with an equally visible
alternative (see `components/interview/QuestionCard.tsx`'s
`focus:ring-2`). See `docs/ACCESSIBILITY_AUDIT.md` for the full v0.9.1
audit and what was fixed.
