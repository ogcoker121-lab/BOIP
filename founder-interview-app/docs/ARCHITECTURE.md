# Architecture

This document explains *why* BOIP is structured the way it is. For
*what* each domain does file-by-file, see the "Structure" section of
the root `README.md` - that's the up-to-date map; this is the set of
rules that produced it.

## The one governing principle

> Knowledge drives decisions. Engines evaluate knowledge. UI renders
> decisions.

No business logic is ever written as branching application code (`if`
chains scattered across components, ad hoc scoring in a page). Every
piece of BOIP's judgment - which route a founder should take, which
recommendations fire, which opportunities match, why a decision was
made - is expressed as **data** ("knowledge": rules, weights,
thresholds, curated text) and evaluated by **one shared, generic,
reusable engine**. The UI never decides anything; it only renders what
an engine already decided.

This is why every domain under `src/domain/` follows the same internal
shape: a `models/` (or `knowledge/`) folder holding data, an
`engine/`/`mapper/`/`builder`/`resolver` folder holding the pure
functions that evaluate it, and nothing in between that mixes the two.

## The shared rule engine

`src/domain/shared/rule-engine.ts` is the one evaluation engine every
domain reuses:

```ts
interface Rule<Context, Result> {
  id: string;
  when: Partial<Context> | ((context: Context) => boolean);
  then: Result;
}

function evaluateRules<Context, Result>(rules: Rule<Context, Result>[], context: Context): Result[]
function evaluateRulesWithTrace<Context, Result>(rules: Rule<Context, Result>[], context: Context): RuleEvaluation<Result>[]
```

Route decisions, recommendations, and opportunity-signal knowledge are
all just arrays of `Rule<Context, Result>` evaluated through this same
function. No domain hand-rolls its own `if`/`switch` evaluation logic -
if a domain needs a new kind of judgment, the fix is a new rule in a
knowledge file, not a new branch in code. `evaluateRulesWithTrace()`
(added for the Decision domain, v0.6) is the same evaluation with every
matched *and* unmatched rule kept, for genuine auditability - not a
second, parallel implementation.

## Permanent vs. runtime identity

BOIP has two kinds of id, and they're never confused:

- **Permanent, hand-assigned, never renumbered or reused**: `REC-xxx`
  (Recommendation), `FW-xxx` (Framework), `OPP-xxx` (Opportunity),
  `RULE-xxx` (Rule). These are BOIP's internal ontology - stable
  references a Knowledge Catalog entry, a report, or an AI prompt can
  point to indefinitely.
- **Runtime, generated per evaluation, never persisted**: `DEC-xxx`
  (Decision), `BP-xxx` (BusinessPlan). A founder's Decision or Business
  Plan is recomputed fresh from their answers every time - it has no
  identity worth keeping around, so it isn't part of the permanent
  ontology and never appears in the Knowledge Catalog.

## Domain boundaries: the public-API convention (v0.9.1)

Every domain under `src/domain/<name>/` exposes exactly one import
surface: `src/domain/<name>/index.ts`. Nothing outside that domain -
not another domain, not `app/`, not `components/` - imports a path
inside it.

```ts
// Allowed
import { Recommendation, buildRecommendations } from "@/src/domain/recommendation";

// Not allowed - enforced by eslint.config.mjs's no-restricted-imports rule
import { Recommendation } from "@/src/domain/recommendation/models/recommendation";
```

This is enforced two ways, deliberately redundant:

1. **`eslint.config.mjs`** - a `no-restricted-imports` rule banning any
   `@/src/domain/*/**` import path. This is a *general* pattern with
   **zero per-file exceptions** - it has no allowlist for "this one
   file is special."
2. **`src/architecture.test.ts`** - dependency tests (not unit tests)
   that read the actual file tree and assert specific boundary rules
   by name, e.g. "Business Plan must not import Interview directly
   outside its own mapper," "Framework Explorer must only resolve
   through the Catalog," "Decision must not own business knowledge."
   These exist as a second, ESLint-independent layer, and each was
   verified to actually fail when the violation it guards against was
   deliberately reintroduced.

### Why some domains export "raw knowledge" too

Two consumers legitimately need more than a domain's computed output:
the Decision domain's trace engine needs to re-evaluate the same
underlying rules to explain *why* something matched, and the Catalog's
builders need every domain's raw knowledge arrays to build catalog
entries from. Rather than carve out ESLint exceptions (which would
break the "zero exceptions" property above), the *owning* domain's own
barrel intentionally exports that raw knowledge too, with a comment
explaining why. `src/domain/opportunity/index.ts` and
`src/domain/recommendation/index.ts` are the two examples today - open
either and read the comment above the extra exports.

This keeps the rule genuinely uniform (any deep import is always wrong,
no exceptions to remember) while staying honest that some knowledge is
deliberately public, not accidentally leaked.

## Single Source of Truth

Domains never duplicate each other's logic. If two domains need the
same fact, one of them computes it and the other consumes that
domain's output - never a second independent computation of the same
thing. Interview → Opportunity → Business Plan is the concrete example
(v0.9 review decision): the Business Plan domain does not read raw
interview answers itself except in its own mapper; every section
consumes `OpportunityContext`/`CustomerContext`/`Decision`, output that
the Opportunity and Decision domains already produced.

New capabilities get their own top-level folder under `src/domain/` -
a capability's logic never gets bolted onto an existing domain it isn't
about (e.g. the Roadmap's day-bucketing was extracted out of
`business-plan/` into its own `src/domain/roadmap/` the moment a second
concern needed it, v0.9).

## Testing strategy (v0.9.1)

- **Domain tests** (Vitest, co-located `*.test.ts` next to the code
  they test): one suite per domain, covering the domain's own public
  entry point (its mapper/resolver/builder) plus any small pure
  function worth testing in isolation. Coverage reporting
  (`npm run test:coverage`) is configured with no minimum threshold -
  visibility only, not a gate, per the v0.9.1 decision.
- **Architecture tests** (`src/architecture.test.ts`): dependency
  tests, not unit tests - they assert the domain-boundary rules above
  by reading the file tree, independent of ESLint.
- **E2E tests** (Playwright, `e2e/`): the actual founder workflow
  (Landing → Interview → Review → Submit → Opportunity Snapshot →
  Business Plan, plus the Framework Explorer reached via a
  recommendation's "Learn More" link), run against a production build
  (`npm run build && npm run start`) rather than the dev server, to
  avoid dev-mode cold-compile flakiness.

## What this release deliberately did not touch

v0.9.1 (Platform Hardening) added tests, domain contracts, error/loading
UI, accessibility, and low-risk performance work - and explicitly
**did not** touch business logic, recommendation logic, opportunity
matching, or Decision behaviour. One specific, previously-identified
piece of technical debt was left alone on purpose: `decision-mapper.ts`
calls `matchOpportunities()` twice on the `skill_path` route (once via
the Opportunity Discovery pipeline, once again to re-derive a match for
the trace). This was flagged and consciously deferred during the v0.6
review - the reviewer's call was that this duplication naturally
disappears once a true evaluation graph exists, and optimizing it
early would mean solving the wrong problem. A hardening release is not
a refactoring release; that decision stands untouched.
