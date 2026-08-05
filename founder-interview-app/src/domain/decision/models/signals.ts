import { InterviewAnswers } from "@/types/interview";
import { Signal } from "./decision";

// Every context field that any knowledge set evaluates against (route
// weights, opportunity signals, recommendation knowledge) traces back to
// exactly one of these. Extracting signals here, once, is what lets
// evaluations point at a human-readable "Risk Tolerance = High" instead of
// a raw context field name.
const SIGNAL_LABELS: { questionId: string; name: string }[] = [
  { questionId: "preferred-path", name: "Preferred Path" },
  { questionId: "risk-tolerance", name: "Risk Tolerance" },
  { questionId: "income-urgency", name: "Income Urgency" },
  { questionId: "employment-status", name: "Employment" },
  { questionId: "time-available", name: "Time Available" },
  { questionId: "capital-available", name: "Capital Available" },
  { questionId: "professional-skills", name: "Professional Skills" },
  { questionId: "business-stage", name: "Business Stage" },
  { questionId: "industry", name: "Industry" },
  { questionId: "revenue-model", name: "Revenue Model" },
  { questionId: "market-type", name: "Market Type" },
];

// Presence-based signals (opportunity knowledge evaluates whether these
// were answered at all, not what they say).
const PRESENCE_SIGNAL_LABELS: { questionId: string; name: string }[] = [
  { questionId: "who-affected", name: "Customer Identified" },
  { questionId: "problem-solved", name: "Problem Defined" },
  { questionId: "market-signal", name: "Market Signal" },
];

export function buildSignals(answers: InterviewAnswers): Signal[] {
  const directSignals: Signal[] = SIGNAL_LABELS.filter(({ questionId }) => Boolean(answers[questionId]?.trim())).map(
    ({ questionId, name }) => ({
      id: `SIG-${questionId}`,
      name,
      value: answers[questionId].trim(),
      sourceQuestionId: questionId,
    }),
  );

  const presenceSignals: Signal[] = PRESENCE_SIGNAL_LABELS.map(({ questionId, name }) => ({
    id: `SIG-${questionId}`,
    name,
    value: answers[questionId]?.trim() ? "Yes" : "No",
    sourceQuestionId: questionId,
  }));

  return [...directSignals, ...presenceSignals];
}
