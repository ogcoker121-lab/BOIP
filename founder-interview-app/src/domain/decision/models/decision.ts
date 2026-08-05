import { NextMoveType } from "@/src/domain/shared";
import { Recommendation } from "@/src/domain/recommendation";
import { OpportunityMatch } from "@/src/domain/opportunity";

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

// The public, UI-facing object this domain produces. Not persisted, not
// part of the permanent ontology (id is a runtime DEC-xxx, generated fresh
// per evaluation) - if the knowledge changes, a new Decision is computed,
// nothing needs migrating. Recommendations, opportunities, and route are
// whatever the existing engines already produce; this domain never
// recomputes or overrides them, only explains them.
//
// Deliberately doesn't carry signals/evaluations/rule ids - that's
// DecisionTrace below. Decision is what the UI renders; DecisionTrace is
// what a developer, report generator, or future AI consumes. Splitting
// them keeps the public model clean without losing any explainability.
export interface Decision {
  id: string;
  interviewId: string | null;
  timestamp: string;

  route: NextMoveType;
  opportunities: OpportunityMatch[];
  recommendations: Recommendation[];

  explanation: Explanation;
}

// The internal explainability record for the same evaluation - everything
// Decision leaves out. matchedRules and firedRecommendations are
// convenience id-only indices (RULE-xxx / REC-xxx) over evaluations and
// recommendations respectively, meant for graph/report consumers that
// want to walk id -> id relationships (RULE-014 -> REC-003 -> FW-011)
// without re-deriving them from the full records every time.
export interface DecisionTrace {
  signals: Signal[];
  evaluations: Evaluation[];
  matchedRules: string[];
  firedRecommendations: string[];
  frameworkReferences: string[];
}
