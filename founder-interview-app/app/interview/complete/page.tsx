"use client";

import { useMemo } from "react";
import OpportunitySnapshot from "@/components/interview/OpportunitySnapshot";
import { buildOpportunitySnapshot } from "@/lib/opportunity/opportunity-mapper";
import { useInterview } from "../hooks/useInterview";

export default function InterviewCompletePage() {
  const { answers, reset } = useInterview();
  const snapshot = useMemo(() => buildOpportunitySnapshot(answers), [answers]);

  return <OpportunitySnapshot snapshot={snapshot} onRestart={reset} />;
}
