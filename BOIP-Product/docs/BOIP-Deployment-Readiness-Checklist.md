# BOIP Deployment Readiness Checklist — Phase 1

**Status:** Phase 1 not yet started (nothing below is checked off as complete on the Vercel side)
**Scope:** Connect Vercel to GitHub and configure the project, without secrets and without a Production deployment. Matches `BOIP-Deployment-Technical-Design.md`.

## Who does what

Claude does not have Vercel account access or credentials in this session, and the Vercel connector available in this workspace's catalog is read/analysis-only (project and deployment inspection) — it has no tool for creating or configuring a project, and it isn't connected regardless. **Steps 1–3 are manual, done by a human in the Vercel dashboard.** Steps 4–5 are already complete in this repository. Step 6 is a hard stop, enforced regardless of who's doing the work.

## 1. Connect the GitHub repository to Vercel — manual, not started

- [ ] Sign in to vercel.com with the account that should own this project.
- [ ] "Add New…" → "Project."
- [ ] Import `ogcoker121-lab/BOIP` from GitHub (grant Vercel's GitHub App access to this repository if prompted — it needs read access to detect pushes/PRs and post preview-URL comments).

## 2. Configure the project — manual, not started

- [ ] **Root Directory:** `founder-interview-app` — required; the Next.js app is not at the repo root (the repo also contains `BOIP-Product/` and root-level docs). Skipping this makes the first build fail.
- [ ] **Framework Preset:** Next.js — should auto-detect correctly once Root Directory is set.
- [ ] **Build Command / Install Command / Output Directory:** leave as Vercel's Next.js defaults. Nothing in `next.config.ts` or `package.json` requires overriding any of them.
- [ ] **Do not click "Deploy" yet** if the setup flow offers to deploy immediately — see Step 6.

## 3. Configure Preview and Production environments — manual, not started

- [ ] Confirm Vercel's default environment mapping applies with no extra configuration: **Production** deploys from `main`, **Preview** deploys from every other branch and every PR.
- [ ] Leave environment variables empty for now (see Step 4) — do not enter real Supabase values yet.

## 4. Environment variable template — done, in this repository

- [x] `BOIP-Product/docs/BOIP-Vercel-Environment-Variables-Template.md` — copy-pasteable Preview and Production blocks, `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY`, no values.

## 5. This checklist — done, in this repository

- [x] This document.

## 6. Stop condition — do not cross without explicit approval

- [ ] No Supabase project (Preview or Production) has been created.
- [ ] No real secret value has been entered into Vercel.
- [ ] No Production deployment has been triggered.

**Nothing past this line happens until told to proceed.**

## What "Phase 1 complete" looks like

A Vercel project exists, correctly pointed at `founder-interview-app`, with Preview and Production recognized as environments and empty variable slots ready to receive real values — but no deployment has run yet, and BOIP is not reachable at any URL. Turning this into an actual reachable deployment is Phase 2 (`BOIP-Deployment-Technical-Design.md` Section 4: create the two Supabase projects, fill in real values, deploy) — a separate, explicitly-approved step, not implied by finishing this checklist.

## Verifying Phase 1 from this side

Once steps 1–3 are done manually, tell Claude and (if you'd like ongoing visibility into deployment status without re-explaining context each time) consider connecting the Vercel MCP connector in this workspace's connector settings — it can then inspect project/deployment state (`list_projects`, `get_project`, `list_deployments`, `get_deployment`) for verification and troubleshooting. It still can't create or configure anything; that's still a dashboard action.
