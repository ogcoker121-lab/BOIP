export type QuestionType = "text" | "textarea" | "select" | "multi-select";

// What capability actually consumes this answer. Keeps the interview
// honest as it grows - every question should map to a reason it exists,
// not just accumulate as a generic survey.
export type QuestionCapability =
  | "Founder Discovery"
  | "Route Decision"
  | "Opportunity Matching"
  | "Business Planning"
  | "Career Guidance";

export interface InterviewQuestion {
  id: string;
  question: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  // Required for type: "multi-select" - caps how many options can be chosen.
  maxSelections?: number;
  capability: QuestionCapability;
}

// Multi-select answers are stored as a comma-joined string here too, so
// persistence (a single text column per answer) and every consumer that
// already reads InterviewAnswers as Record<string, string> needs no change.
export type InterviewAnswers = Record<string, string>;
