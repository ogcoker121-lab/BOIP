"use client";

import CompletionCard from "@/components/interview/CompletionCard";
import { useInterview } from "../hooks/useInterview";

export default function InterviewCompletePage() {
  const { reset } = useInterview();

  return <CompletionCard onRestart={reset} />;
}
