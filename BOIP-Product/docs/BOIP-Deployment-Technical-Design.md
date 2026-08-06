# BOIP Deployment — Technical Design

**Status:** Draft for approval
**Scope:** How BOIP gets from GitHub to a real URL — Vercel project structure, environment variables, Supabase configuration, the deployment workflow, secrets, monitoring, and rollback. This is a design, not an implementation: **nothing described here has been deployed.** No application code changes, no new Vercel/Supabase resources created.
**Follows from:** `BOIP-v1.0-Product-Specification.md` Section 7 (Technical Architecture, which names Vercel and Supabase as the intended stack) and Section 8 (Production Readiness Checklist, which flags monitoring/logging/backups as beta gaps this design addresses).
**Governance:** Per `founder-interview-app/CONTRIBUTING.md`'s Specification-First Development workflow, this design must be approved before any deployment work begins.

---

## 1. Objective

Get the current, already-built BOIP onto a real URL that a small group of trusted founders can use — nothing more. This explicitly does **not** include AI, a new domain, a new engine, or any founder-facing feature. The three phases below map directly to what the Product Owner specified:

1. **Deploy to Vercel** — `main` becomes reachable at a real URL.
2. **Connect Supabase** — interview data survives beyond a single server process.
3. **Deploy every PR** — every PR gets its own preview URL; `main` auto-deploys to the beta environment.

---

## 2. Vercel Project Structure

**Repository connection.** One Vercel project, connected via Vercel's native GitHub integration to `ogcoker121-lab/BOIP`.

**Root Directory.** The Next.js app lives in `founder-interview-app/`, not the repo root — the repo also contains `BOIP-Product/` (documentation only) and root-level `CHANGELOG.md`/`README.md`. Vercel's **Root Directory** project setting must be set to `founder-interview-app`. This is the one setting most likely to be missed and cause a broken first deploy (Vercel would otherwise look for `package.json` at the repo root and fail to find a buildable app). No monorepo tooling (Turborepo, Vercel's monorepo detection) is needed for a single-app repo like this — the Root Directory setting alone is sufficient.

**Framework preset.** Next.js (auto-detected once Root Directory is set correctly).

**Build settings.** Defaults (`npm run build`, `npm install`) — no custom build command needed. `next.config.ts` has no build-time configuration today that would require overriding Vercel's defaults.

**Node version.** Whatever Vercel's current LTS default is; nothing in this codebase pins a specific Node version today. If a version needs pinning later (a `.nvmrc` or `engines` field), that's a small follow-up, not part of this design.

**Environments.** Vercel's three built-in environments map directly onto BOIP's needs, with no custom environment configuration required:
- **Production** — deploys from `main`, serves the beta URL founders actually use.
- **Preview** — deploys from every other branch and every PR, one URL per deployment.
- **Development** — local `vercel dev` / `npm run dev`, not part of this design's scope (local development already works without Vercel, per `README.md`).

---

## 3. Environment Variables

BOIP's entire environment surface today is two variables (`.env.example`), both server-only, both already used by `lib/interview-repository.ts`'s Supabase/in-memory fallback:

| Variable | Scope | Set in Vercel? |
|---|---|---|
| `SUPABASE_URL` | Server-only, never sent to the browser | Production + Preview (see Section 4 for which Supabase project each points at) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only, never sent to the browser | Production + Preview |

Neither needs a `NEXT_PUBLIC_` prefix — the app never talks to Supabase from the browser, only through its own API routes (`app/api/interview/*`), exactly as `.env.example` already documents. No other environment variables exist in the codebase today (no Stripe keys, no PostHog keys, no auth secrets — none of that is built yet, per the Product Specification's exclusions).

**Behavior if unset.** `getInterviewRepository()` (`lib/interview-repository.ts`) already falls back to an in-memory repository automatically when these are missing — so a Preview deployment with no Supabase variables configured still works, it just won't persist across requests to different serverless function instances. This fallback is what makes Phase 1 (deploy) independently useful before Phase 2 (connect Supabase) is done.

---

## 4. Supabase Configuration

**Decision needed from Product before this phase starts:** how many Supabase projects.

**Recommended design: two Supabase projects, one per Vercel environment tier.**

| Vercel environment | Supabase project | Why |
|---|---|---|
| Production (`main`) | A dedicated **Production** Supabase project | Real beta-founder data should never share a database with throwaway PR-testing data. |
| Preview (every PR/branch) | A single shared **Preview/Development** Supabase project | All preview deployments point at the same hosted project. Simpler than provisioning a database per PR, and acceptable because no real founder data exists in Preview — it's app-developer and reviewer test data only. |

Both are wired via Vercel's per-environment environment variable scoping (Vercel natively supports different values for the same variable name across Production/Preview/Development) — no code change is needed for this; `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` are read the same way regardless of which project they point at.

**Setup steps (per project, both Preview and Production):**
1. Create the Supabase project (free tier is sufficient for beta scale in both cases; Production may need an upgrade once real usage data exists — not a beta-time decision).
2. Run `supabase/migrations/0001_interview_persistence.sql` against it (SQL Editor or Supabase CLI) — this is the only migration that exists today.
3. Copy `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from Project Settings → API into the corresponding Vercel environment's variables.

**Authentication.** Explicitly out of scope for this design and for v1.0 (Product Specification Section 6: "No authentication or user accounts"). Noted here only so the "Configure Authentication" line item from the Product Owner's Phase 2 list has an explicit answer: **not configured now, revisited if/when authentication is scoped as its own specification.**

**Storage.** Also explicitly deferred ("later," per the Product Owner) — no Supabase Storage buckets are part of this design. Noted so it isn't silently forgotten, not because it's being decided now.

**Row Level Security (RLS).** Not addressed by the existing migration or this design. Since there is no authentication, RLS policies would currently only be able to distinguish "the service role" from "everyone" — meaningful RLS design depends on the authentication decision above. Flagged as a gap, not solved here: today, all writes go through the service-role key from server-side API routes only (the browser never holds Supabase credentials), which is the actual security boundary in place until RLS is designed.

---

## 5. Deployment Workflow

```
GitHub (branch or PR)
      │
      ▼
Vercel (auto-triggered by the GitHub integration)
      │
      ▼
Preview Deployment  ──────────────►  (every branch/PR: its own URL)
      │
      ▼
main branch merge
      │
      ▼
Production Deployment  ───────────►  the Private Beta URL founders use
```

This is Vercel's default GitHub-integration behavior, not custom infrastructure — the only configuration required is connecting the repository and setting Root Directory (Section 2). No GitHub Actions workflow is needed for deployment itself; Vercel's own integration handles build + deploy on every push.

**What stays separate:** BOIP's existing CI-equivalent checks (`npm run lint`, `npm test`, `npm run test:coverage`, `npm run test:e2e`) are not currently wired into GitHub Actions or any check that blocks a Vercel deployment — they're run manually per `CONTRIBUTING.md`. Whether to add a GitHub Actions workflow that runs these on every PR (independent of, and prior to, the Vercel preview build) is a natural fast-follow but is **not part of this design** — flagging it as a gap rather than silently bundling it in.

---

## 6. Preview Deployments

- Every PR gets a unique, shareable preview URL, posted automatically as a PR comment by Vercel's GitHub integration.
- Preview deployments use the shared Preview Supabase project (Section 4) — interview data created while testing a preview is real but not beta data; it does not appear in Production.
- Preview deployments are the mechanism behind the updated PR workflow below (Section 8).

---

## 7. Production Deployments

- `main` is the Production branch. Every merge to `main` triggers an automatic Production deployment.
- The resulting URL (a `*.vercel.app` domain by default, or a custom domain if one is added later — not part of this design) is the "Private Beta URL" the Product Owner's rollout plan shares with 5–10 trusted founders.
- No manual promotion step exists in this design (i.e., merging to `main` *is* the deploy trigger) — this matches Vercel's default and keeps the beta's deployment model as simple as the beta itself.

---

## 8. Updated PR Workflow

Per the Product Owner's proposed change, once this design is approved and Vercel is actually connected, `founder-interview-app/CONTRIBUTING.md`'s workflow gains one step (this change is described here, not yet applied to `CONTRIBUTING.md` — updating it is part of implementing this design, not this design document itself):

```
Specification → Technical Design → Implementation → PR → Preview Deployment → Human Testing → Merge
```

The addition is **Preview Deployment → Human Testing**, between opening a PR and merging it: a reviewer clicks the Vercel preview URL Vercel posts on the PR and actually exercises the change in a real deployed environment (not just `npm run dev`) before approving the merge. This catches deployment-environment issues (env var misconfiguration, build-only failures, anything that only manifests once actually deployed) that local testing and CI-equivalent checks can't.

---

## 9. Secrets Management

- All secrets (`SUPABASE_SERVICE_ROLE_KEY` for each project) are stored in Vercel's encrypted Environment Variables, scoped per environment (Production vs. Preview) — never committed to the repo, matching `.env.example`'s existing instruction and `.gitignore`'s existing exclusion of `.env.local`.
- Vercel project access (who can view/edit environment variables, trigger deployments, or roll back) is limited to the repository owner for the beta — no team/collaborator access is part of this design.
- **Rotation:** if the Supabase service role key for either project is ever exposed (committed by accident, shared in a screenshot, etc.), rotate it immediately from Supabase's Project Settings → API and update the corresponding Vercel environment variable. No automated rotation exists or is proposed here — manual, incident-driven rotation is sufficient at beta scale.

---

## 10. Monitoring

**Day one (part of this design, low-effort):** Vercel's built-in observability — deployment logs, serverless function runtime logs, and basic request analytics — requires no additional setup or vendor beyond enabling it in the Vercel dashboard. This is enough to answer "is it up, and what broke" during early beta testing with 5–10 founders.

**Fast-follow (not part of this design, flagged per the Product Specification's Section 8):** a dedicated error-tracking service (e.g. Sentry) wired into `app/error.tsx`'s route error boundary and the API routes, so failures are discoverable without a founder having to report them. Proposed as a small, separate follow-up task once the beta is live and the volume of real usage justifies it — not a blocker to Phase 1.

**Explicitly not part of this design:** uptime/synthetic monitoring (e.g. a third-party ping service), alerting/paging, and log aggregation beyond what Vercel provides natively. All reasonable next steps, none required to get 5–10 trusted founders testing the current build.

---

## 11. Rollback Strategy

- Vercel supports instant rollback: any previous successful deployment can be promoted back to Production with one action (dashboard or CLI), with no rebuild required. This is the primary rollback mechanism for this design — no custom tooling needed.
- **Important caveat this design must state explicitly:** rolling back the application code does **not** roll back a Supabase schema migration that already ran. If a future migration needs to ship alongside application code, it must be written to stay backward-compatible with the previous version of the app (additive changes — new nullable columns, new tables — rather than destructive ones) until a rollback window has passed. Today there is exactly one migration (`0001_interview_persistence.sql`) and no beta data yet, so this risk is currently theoretical — but the principle should hold from the first migration that ships after real founders are using the beta.
- No automated rollback-on-error exists or is proposed here (e.g. auto-revert on an elevated error rate) — manual rollback, triggered by a human noticing a problem (via Section 10's monitoring), is sufficient at this scale.

---

## 12. What This Design Does Not Cover

Stated explicitly, matching the Product Owner's instruction that this is design-only:

- No Vercel project has been created.
- No Supabase project (Production or Preview) has been created.
- No environment variables have been set anywhere.
- No domain has been purchased or configured (the beta runs on a default `*.vercel.app` URL).
- No GitHub Actions workflow has been added.
- `CONTRIBUTING.md` has not yet been updated with the Section 8 workflow change — that update happens when this design is implemented, not now.
- Authentication, Storage, RLS design, and third-party error tracking are named as future work, not designed in detail here.

## 13. Approval Checklist

Once approved, implementation should be the small, low-risk sequence the Product Owner described:

1. Create the Vercel project, connect the GitHub repo, set Root Directory to `founder-interview-app`.
2. Create the two Supabase projects (Production, Preview) and run the existing migration against both.
3. Set both environment variables in both Vercel environments.
4. Deploy `main` to Production; verify the interview works end-to-end on the live URL.
5. Update `CONTRIBUTING.md` with the Preview Deployment → Human Testing step.
6. Share the Production URL with 5–10 trusted founders.
