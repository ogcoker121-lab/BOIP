import { InterviewAnswers } from "@/types/interview";
import { buildOpportunityContext } from "@/src/domain/opportunity/context";
import { evaluateRecommendations } from "../engine/recommendation-engine";
import { Recommendation } from "../models/recommendation";

// Interview -> Opportunity -> Recommendation -> Snapshot -> UI. Pure, no UI
// or network dependency - callable from a page (as it is today) or a
// server route later without changing anything here. Reuses the same
// OpportunityContext the opportunity domain builds, so both domains read
// the interview identically.
export function buildRecommendations(answers: InterviewAnswers): Recommendation[] {
  const context = buildOpportunityContext(answers);
  return evaluateRecommendations(context);
}
