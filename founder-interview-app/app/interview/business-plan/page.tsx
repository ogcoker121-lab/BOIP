"use client";

import { useMemo } from "react";
import BusinessPlanView from "@/components/interview/BusinessPlanView";
import { buildBusinessPlan } from "@/src/domain/business-plan/mapper/business-plan-mapper";
import { useInterview } from "../hooks/useInterview";

// Reads the same in-memory interview answers /interview/complete already
// reads (no persistence, no re-fetch) and assembles a fresh Business Plan
// from them - deterministic, no AI, nothing invented.
export default function BusinessPlanPage() {
  const { answers } = useInterview();
  const plan = useMemo(() => buildBusinessPlan(answers), [answers]);

  return <BusinessPlanView plan={plan} />;
}
