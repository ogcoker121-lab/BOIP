import { InterviewAnswers } from "@/types/interview";
import { buildOpportunityContext } from "@/src/domain/opportunity/context";
import { buildRouteContext } from "@/src/domain/route-decision/models/route-context";
import { decideRoute } from "@/src/domain/route-decision/engine/route-decision-engine";
import { buildOpportunityDiscovery } from "@/src/domain/route-decision/mapper/next-move-mapper";
import { matchOpportunities } from "@/src/domain/opportunity/library/matching/opportunity-matcher";
import { buildRecommendations } from "@/src/domain/recommendation/mapper/recommendation-mapper";
import { Decision, DecisionTrace } from "../models/decision";
import { buildSignals } from "../models/signals";
import { buildEvaluations } from "../engine/decision-engine";
import { buildExplanation } from "../trace/explanation-generator";

function generateDecisionId(): string {
  // Runtime id, not a permanent registry entry like REC-xxx/FW-xxx/
  // OPP-xxx/RULE-xxx - a Decision is recomputed fresh every time an
  // interview is evaluated and is never persisted or referenced later.
  return typeof crypto.randomUUID === "function" ? `DEC-${crypto.randomUUID()}` : `DEC-${Date.now()}`;
}

export interface DecisionWithTrace {
  decision: Decision;
  trace: DecisionTrace;
}

// Interview -> Signals -> Knowledge Evaluation -> Decision + DecisionTrace.
// Ties every existing engine's output together; never recomputes route,
// opportunities, scores, or recommendations - it only re-evaluates the
// same knowledge (decision-engine.ts) to explain what those engines
// already produced. Not persisted (interviewId is passed through, not
// looked up or stored).
export function buildDecisionWithTrace(answers: InterviewAnswers, interviewId: string | null = null): DecisionWithTrace {
  const opportunityContext = buildOpportunityContext(answers);
  const routeContext = buildRouteContext(answers, opportunityContext);
  const discovery = buildOpportunityDiscovery(answers);
  const recommendations = buildRecommendations(answers);

  const evaluations = buildEvaluations(routeContext, opportunityContext);
  const matchedRules = evaluations.filter((evaluation) => evaluation.matched).map((evaluation) => evaluation.ruleId);
  const firedRecommendations = recommendations.map((recommendation) => recommendation.id);
  const frameworkReferences = Array.from(
    new Set(recommendations.flatMap((recommendation) => recommendation.frameworkReferences)),
  );

  // next-move-mapper.ts clears opportunities entirely once it redirects
  // to skill_path, so there is no Best Match left to explain from. Redo
  // the same pre-redirect match lookup here (same inputs, same engine,
  // read a second time) purely so the explanation can point at the match
  // that actually triggered the redirect.
  const skillGapMatch =
    discovery.nextMove.nextMoveType === "skill_path"
      ? matchOpportunities(routeContext, decideRoute(routeContext), opportunityContext.industry).matches[0]
      : undefined;

  const decision: Decision = {
    id: generateDecisionId(),
    interviewId,
    timestamp: new Date().toISOString(),
    route: discovery.nextMove.nextMoveType,
    opportunities: discovery.matches,
    recommendations,
    explanation: buildExplanation(discovery.nextMove.nextMoveType, evaluations, discovery.matches, skillGapMatch),
  };

  const trace: DecisionTrace = {
    signals: buildSignals(answers),
    evaluations,
    matchedRules,
    firedRecommendations,
    frameworkReferences,
  };

  return { decision, trace };
}

// Convenience for the common case - the UI only ever needs Decision.
// DecisionTrace consumers (report generator, future AI, developer
// tooling) call buildDecisionWithTrace() directly instead.
export function buildDecision(answers: InterviewAnswers, interviewId: string | null = null): Decision {
  return buildDecisionWithTrace(answers, interviewId).decision;
}
