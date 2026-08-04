"use client";

import { useMemo } from "react";
import OpportunitySnapshot from "@/components/interview/OpportunitySnapshot";
import { buildOpportunitySnapshot } from "@/src/domain/opportunity/opportunity-mapper";
import { buildRecommendations } from "@/src/domain/recommendation/mapper/recommendation-mapper";
import { useInterview } from "../hooks/useInterview";

export default function InterviewCompletePage() {
  const { answers, reset } = useInterview();
  const snapshot = useMemo(() => buildOpportunitySnapshot(answers), [answers]);
  const recommendations = useMemo(() => buildRecommendations(answers), [answers]);

  return <OpportunitySnapshot snapshot={snapshot} recommendations={recommendations} onRestart={reset} />;
}
