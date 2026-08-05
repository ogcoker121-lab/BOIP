import { Rule } from "@/src/domain/shared/rule-engine";
import { NextMoveType } from "@/src/domain/shared/next-move-type";
import { RouteContext } from "../models/route-context";

// Deterministic BOIP knowledge - data, not code. The route decision
// genuinely depends on several signals together (preference, risk,
// urgency, employment, readiness), so each row contributes a weighted
// nudge toward one route rather than a single equality match deciding
// everything outright. The engine (route-decision-engine.ts) sums
// matching contributions per route and picks the highest - still the same
// shared evaluateRules() doing the matching (compound `when` clauses use
// the engine's existing multi-key equality support), just with a small
// aggregation step on top, the same pattern the recommendation engine
// uses for sorting.
//
// Compound rows exist specifically so a lone strong preference can't
// override genuinely weak fundamentals - "recommend a business when the
// founder wants entrepreneurship AND skills/time/capital support it AND
// risk tolerance is sufficient" is an AND of conditions, not a single
// vote among several.
//
// skill_path is decided later, after opportunities are scored against the
// chosen route (see route-decision-mapper.ts) - it depends on match
// quality, which isn't known yet at this stage.
export interface RouteWeightContribution {
  route: NextMoveType;
  weight: number;
  reason: string;
}

export const routeWeightRules: Rule<RouteContext, RouteWeightContribution>[] = [
  // Stated preference. No row for preferredPath: "job" - an explicit job
  // preference is honored unconditionally by the engine (never bad advice
  // to defer to), not weighted against other signals.
  {
    when: { preferredPath: "business" },
    then: [{ route: "business_plan", weight: 4, reason: "Stated preference: start a business" }],
  },
  {
    when: { preferredPath: "side_hustle" },
    then: [{ route: "side_hustle", weight: 4, reason: "Stated preference: build a side hustle" }],
  },

  // Independent single-factor nudges.
  { when: { riskBand: "high" }, then: [{ route: "business_plan", weight: 2, reason: "High risk tolerance" }] },
  { when: { riskBand: "moderate" }, then: [{ route: "side_hustle", weight: 1, reason: "Moderate risk tolerance" }] },
  { when: { urgencyBand: "flexible" }, then: [{ route: "business_plan", weight: 2, reason: "No immediate income pressure" }] },
  { when: { urgencyBand: "soon" }, then: [{ route: "side_hustle", weight: 2, reason: "Needs income within a few months" }] },
  {
    when: { businessReadiness: "strong" },
    then: [
      { route: "business_plan", weight: 3, reason: "Business readiness is strong" },
      { route: "hybrid_path", weight: 1, reason: "Business readiness is strong" },
    ],
  },
  {
    when: { businessReadiness: "moderate" },
    then: [{ route: "side_hustle", weight: 2, reason: "Business readiness is moderate - worth testing first" }],
  },

  // Compound conditions: weak fundamentals actively count against
  // business_plan (not just in favour of something else), and the safe
  // fallback differs depending on whether the founder already has income
  // from employment.
  {
    when: { riskBand: "low", businessReadiness: "weak" },
    then: [{ route: "business_plan", weight: -4, reason: "Low risk tolerance combined with weak business readiness" }],
  },
  {
    when: { urgencyBand: "immediate", isCurrentlyEmployed: true },
    then: [{ route: "hybrid_path", weight: 3, reason: "Needs income soon but already has employment income" }],
  },
  {
    when: { urgencyBand: "immediate", isCurrentlyEmployed: false },
    then: [{ route: "job_search", weight: 4, reason: "Needs income immediately and has no current employment" }],
  },
  {
    when: { businessReadiness: "weak", isCurrentlyEmployed: true },
    then: [{ route: "hybrid_path", weight: 2, reason: "Weak business readiness, but currently employed" }],
  },
  {
    when: { businessReadiness: "weak", isCurrentlyEmployed: false },
    then: [{ route: "job_search", weight: 2, reason: "Weak business readiness and not currently employed" }],
  },
  {
    when: { riskBand: "low", isCurrentlyEmployed: true },
    then: [{ route: "hybrid_path", weight: 1, reason: "Low risk tolerance, but currently employed" }],
  },
  {
    when: { riskBand: "low", isCurrentlyEmployed: false },
    then: [{ route: "job_search", weight: 1, reason: "Low risk tolerance and not currently employed" }],
  },
];
