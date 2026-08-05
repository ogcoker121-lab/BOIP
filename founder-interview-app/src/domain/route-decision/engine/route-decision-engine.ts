import { evaluateRules } from "@/src/domain/shared/rule-engine";
import { NextMoveType } from "@/src/domain/shared/next-move-type";
import { RouteContext } from "../models/route-context";
import { routeWeightRules } from "../knowledge/route-weights";

// Tie-break order when scores are equal: hybrid_path first (the balanced,
// lowest-regret choice when signals are genuinely ambiguous), then
// side_hustle (low commitment), then job_search (safe), then business_plan
// (highest commitment - only wins ties if nothing else scored at all).
const TIE_BREAK_ORDER: NextMoveType[] = ["hybrid_path", "side_hustle", "job_search", "business_plan"];

// Reuses the shared evaluateRules() for the matching step, then sums the
// weighted contributions per route and picks the highest - not a second
// engine, an aggregation step on top of the same one (same pattern the
// recommendation engine uses for sorting). skill_path is never returned
// here; the mapper applies it afterward if opportunity matching finds a
// genuine skills gap against the chosen route.
export function decideRoute(context: RouteContext): NextMoveType {
  if (context.preferredPath === "job") {
    return "job_search";
  }

  const contributions = evaluateRules(routeWeightRules, context);
  const scores: Record<NextMoveType, number> = {
    business_plan: 0,
    side_hustle: 0,
    job_search: 0,
    hybrid_path: 0,
    skill_path: 0,
  };
  for (const contribution of contributions) {
    scores[contribution.route] += contribution.weight;
  }

  return TIE_BREAK_ORDER.reduce((best, route) => (scores[route] > scores[best] ? route : best), TIE_BREAK_ORDER[0]);
}
