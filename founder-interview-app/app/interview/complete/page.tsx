"use client";

import { useMemo } from "react";
import OpportunitySnapshot from "@/components/interview/OpportunitySnapshot";
import { buildOpportunitySnapshot } from "@/src/domain/opportunity/opportunity-mapper";
import { buildRecommendations } from "@/src/domain/recommendation/mapper/recommendation-mapper";
import { buildOpportunityDiscovery } from "@/src/domain/route-decision/mapper/next-move-mapper";
import { buildDecision } from "@/src/domain/decision/mapper/decision-mapper";
import { useInterview } from "../hooks/useInterview";

export default function InterviewCompletePage() {
  const { answers, reset } = useInterview();
  const snapshot = useMemo(() => buildOpportunitySnapshot(answers), [answers]);
  const recommendations = useMemo(() => buildRecommendations(answers), [answers]);
  const discovery = useMemo(() => buildOpportunityDiscovery(answers), [answers]);
  // Decisions aren't persisted (v0.6) - the interview's own id isn't
  // exposed outside InterviewContext yet, so this is computed fresh here
  // purely to explain what the engines above already produced.
  const decision = useMemo(() => buildDecision(answers), [answers]);

  return (
    <OpportunitySnapshot
      snapshot={snapshot}
      recommendations={recommendations}
      matches={discovery.matches}
      nextMove={discovery.nextMove}
      explanation={decision.explanation}
      onRestart={reset}
    />
  );
}
