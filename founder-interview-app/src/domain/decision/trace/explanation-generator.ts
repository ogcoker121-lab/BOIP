import { NextMoveType } from "@/src/domain/shared";
import { OpportunityMatch } from "@/src/domain/opportunity";
import { routeWeightRules } from "@/src/domain/route-decision";
import { Evaluation, Explanation } from "../models/decision";

// Human-readable label per route - the same kind of static lookup
// opportunity-mapper.ts's STAGE_PHRASES uses to label an enum value, not
// a rewritten reason.
const ROUTE_LABELS: Record<NextMoveType, string> = {
  business_plan: "starting a Business",
  side_hustle: "building a Side Hustle",
  job_search: "a Job Search",
  hybrid_path: "a Hybrid Path",
  skill_path: "building a Skill first",
};

// A route-weight rule can target more than one route (see RULE-007); an
// evaluation only belongs in the explanation if it actually nudged the
// route BOIP settled on, not every route it matched for.
function ruleTargetsRoute(ruleId: string, route: NextMoveType): boolean {
  const rule = routeWeightRules.find((candidate) => candidate.id === ruleId);
  return Boolean(rule?.then.some((contribution) => contribution.route === route));
}

// Generated entirely from the evaluations - no AI, no prompts, no new
// prose. Every bullet is a reason string that already existed elsewhere:
// the route-weight rule that fired, plus (when one exists) the best
// matching opportunity's own whyItFits.
export function buildExplanation(
  route: NextMoveType,
  evaluations: Evaluation[],
  opportunities: OpportunityMatch[],
  // skill_path never appears as a `then.route` in route-weights.ts (it's
  // applied after matching, not decided by weighted rules) and its final
  // opportunities list is always empty (next-move-mapper.ts clears it) -
  // so there are no route-category or Best-Match reasons to draw on. This
  // is the one existing match still available for that case: the same
  // match the skill-gap redirect itself was triggered by.
  skillGapMatch?: OpportunityMatch,
): Explanation {
  const routeBullets = evaluations
    .filter(
      (evaluation) =>
        evaluation.category === "route" && evaluation.matched && ruleTargetsRoute(evaluation.ruleId, route),
    )
    .map((evaluation) => evaluation.reason);

  const bestMatch = opportunities.find((match) => match.matchLabel === "Best Match");
  const matchBullets = bestMatch ? [bestMatch.whyItFits] : skillGapMatch ? [skillGapMatch.whyItFits] : [];

  return {
    headline: `BOIP recommends ${ROUTE_LABELS[route]} because:`,
    bullets: Array.from(new Set([...routeBullets, ...matchBullets])),
  };
}
