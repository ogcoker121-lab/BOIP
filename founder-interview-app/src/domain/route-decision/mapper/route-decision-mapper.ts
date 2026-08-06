import { InterviewAnswers } from "@/types/interview";
import { buildOpportunityContext } from "@/src/domain/opportunity";
import { NextMoveType } from "@/src/domain/shared";
import { buildRouteContext, RouteContext } from "../models/route-context";
import { decideRoute } from "../engine/route-decision-engine";

export interface RouteDecision {
  nextMoveType: NextMoveType;
  routeContext: RouteContext;
}

// Pure, UI-independent: InterviewAnswers -> RouteDecision. Reuses the same
// buildOpportunityContext() the opportunity and recommendation domains use,
// so all three read the interview identically.
export function buildRouteDecision(answers: InterviewAnswers): RouteDecision {
  const opportunityContext = buildOpportunityContext(answers);
  const routeContext = buildRouteContext(answers, opportunityContext);
  return {
    nextMoveType: decideRoute(routeContext),
    routeContext,
  };
}
