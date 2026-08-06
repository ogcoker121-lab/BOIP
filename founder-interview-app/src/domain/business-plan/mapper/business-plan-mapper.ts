import { InterviewAnswers } from "@/types/interview";
import { buildOpportunityContext, buildOpportunitySnapshot, buildCustomerContext } from "@/src/domain/opportunity";
import { buildDecisionWithTrace } from "@/src/domain/decision";
import { BusinessPlan } from "../models/business-plan";
import { buildBusinessPlanSections } from "../builders/business-plan-builder";

function generateBusinessPlanId(): string {
  // Runtime id, not part of the permanent ontology - same convention as
  // Decision's DEC-xxx (src/domain/decision/mapper/decision-mapper.ts).
  // A plan is recomputed fresh from the same deterministic inputs, never
  // persisted or hand-edited, so it doesn't need a stable identity.
  return typeof crypto.randomUUID === "function" ? `BP-${crypto.randomUUID()}` : `BP-${Date.now()}`;
}

// Interview -> Opportunity -> Decision -> Business Plan. This is the
// only place in the domain that touches raw InterviewAnswers - every
// section builder downstream consumes an existing domain's own context
// or output (OpportunityContext, CustomerContext, OpportunitySnapshot,
// Decision), never interview answers directly. Never recomputes route,
// opportunities, scores, or recommendations - reuses
// buildOpportunitySnapshot() (v0.3) and buildDecisionWithTrace() (v0.6)
// exactly as every other consumer does, and only assembles what those
// domains already produced into readable sections.
export function buildBusinessPlan(answers: InterviewAnswers, interviewId: string | null = null): BusinessPlan {
  const opportunityContext = buildOpportunityContext(answers);
  const snapshot = buildOpportunitySnapshot(answers);
  const customerContext = buildCustomerContext(answers);
  const { decision } = buildDecisionWithTrace(answers, interviewId);
  const bestMatch = decision.opportunities.find((match) => match.matchLabel === "Best Match");

  const sections = buildBusinessPlanSections({ opportunityContext, snapshot, customerContext, decision, bestMatch });

  const title = bestMatch ? `Business Plan: ${bestMatch.opportunity.title}` : "Business Plan";

  return {
    id: generateBusinessPlanId(),
    title,
    sections,
    metadata: {
      generatedAt: new Date().toISOString(),
      route: decision.route,
      opportunityId: bestMatch?.opportunity.id ?? null,
      decisionId: decision.id,
    },
  };
}
