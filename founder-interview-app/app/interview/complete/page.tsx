"use client";

import { useMemo } from "react";
import OpportunitySnapshot from "@/components/interview/OpportunitySnapshot";
import { buildOpportunitySnapshot } from "@/src/domain/opportunity/opportunity-mapper";
import { buildRecommendations } from "@/src/domain/recommendation/mapper/recommendation-mapper";
import { buildOpportunityDiscovery } from "@/src/domain/route-decision/mapper/next-move-mapper";
import { useInterview } from "../hooks/useInterview";

export default function InterviewCompletePage() {
  const { answers, reset } = useInterview();
  const snapshot = useMemo(() => buildOpportunitySnapshot(answers), [answers]);
  const recommendations = useMemo(() => buildRecommendations(answers), [answers]);
  const discovery = useMemo(() => buildOpportunityDiscovery(answers), [answers]);

  return (
    <OpportunitySnapshot
      snapshot={snapshot}
      recommendations={recommendations}
      matches={discovery.matches}
      nextMove={discovery.nextMove}
      onRestart={reset}
    />
  );
}
