// Shared between route-decision/ (which produces one) and
// opportunity/library/ (whose entries declare which they suit) - lives
// here rather than in either domain so neither has to depend on the other.
export type NextMoveType = "business_plan" | "side_hustle" | "job_search" | "hybrid_path" | "skill_path";
