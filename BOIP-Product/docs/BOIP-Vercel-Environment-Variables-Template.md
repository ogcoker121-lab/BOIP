# Vercel Environment Variables — Template

No secrets in this file. Two variables, both server-only (`lib/interview-repository.ts`), matching `founder-interview-app/.env.example` exactly — this document exists because *where* they need to be set (Vercel's Environment Variables UI, once per environment) is different from local development (`.env.local`), not because the variables themselves are different.

Per `BOIP-Deployment-Technical-Design.md` Section 4, **Preview** and **Production** point at two different Supabase projects — so each environment gets its own copy of these two variables, with different real values, once Phase 2 (Connect Supabase) happens. Nothing below has a value yet.

## Preview environment

Set on the Vercel project's **Preview** environment. Points at the shared Preview/Development Supabase project.

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Production environment

Set on the Vercel project's **Production** environment. Points at the dedicated Production Supabase project.

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## How to fill these in (Phase 2, not now)

1. Create the Supabase project (Preview or Production — do both).
2. Project Settings → API → copy the Project URL into `SUPABASE_URL`, and the `service_role` secret key into `SUPABASE_SERVICE_ROLE_KEY`.
3. In Vercel: Project → Settings → Environment Variables → paste each `KEY=value` pair, scoped to the matching environment (Preview or Production — not "All Environments," since the two point at different projects).
4. Leave `Development` unset unless you also want `vercel dev` to hit a real Supabase project — the app already falls back to the in-memory repository with nothing set, per `.env.example`.

## What's intentionally not here

No `NEXT_PUBLIC_*` variables (the app never talks to Supabase from the browser), no Stripe/PostHog/auth secrets (none of that exists yet, per `BOIP-v1.0-Product-Specification.md`'s exclusions), and no actual values — this file stays safe to commit.
