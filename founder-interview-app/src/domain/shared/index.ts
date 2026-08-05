// The public surface of src/domain/shared/ - the generic rule engine and
// the one cross-domain enum every route-producing consumer needs.
export type { Rule, RuleEvaluation } from "./rule-engine";
export { matches, evaluateRules, evaluateRulesWithTrace } from "./rule-engine";
export type { NextMoveType } from "./next-move-type";
