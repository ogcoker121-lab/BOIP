import { NextMoveType } from "@/src/domain/shared/next-move-type";
import { Recommendation } from "@/src/domain/recommendation/models/recommendation";
import { OpportunityMatch } from "@/src/domain/opportunity/library/matching/opportunity-match";

// An input used during evaluation - a human-readable view of one answer
// that actually fed a decision, not every raw answer.
export interface Signal {
  id: string;
  name: string;
  value: string;
  sourceQuestionId: string;
}

// One row of knowledge being checked against the founder's signals.
// matched: false rows are kept, not discarded, for genuine auditability -
// a Decision should show what didn't fire, not just what did.
export type EvaluationCategory = "route" | "opportunity-signal" | "recommendation";

export interface Evaluation {
  ruleId: string;
  category: EvaluationCategory;
  matched: boolean;
  weight?: number;
  reason: string;
}

export interface Explanation {
  headline: string;
  bullets: string[];
}

// The central computed object this domain produces. Not persisted, not
// part of the permanent ontology (id is a runtime DEC-xxx, generated fresh
// per evaluation) - if the knowledge changes, a new Decision is computed,
// nothing needs migrating. Recommendations, opportunities, and route are
// whatever the existing engines already produce; this domain never
// recomputes or overrides them, only explains them.
export interface Decision {
  id: string;
  interviewId: string | null;
  timestamp: string;

  signals: Signal[];
  evaluations: Evaluation[];

  route: NextMoveType;
  opportunities: OpportunityMatch[];
  recommendations: Recommendation[];
  frameworkReferences: string[];

  explanation: Explanation;
}
