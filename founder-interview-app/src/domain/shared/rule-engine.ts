// The one generic evaluation engine for BOIP's knowledge-driven domains.
// Knows nothing about interviews, opportunities, recommendations, or UI -
// every domain (opportunity/, recommendation/, route-decision/, and future
// scoring/) reuses this rather than each building its own.

export interface Rule<Context, Result> {
  // Permanent identity (RULE-xxx), assigned once in the knowledge file and
  // never renumbered or reused - same convention as REC-xxx/FW-xxx/OPP-xxx.
  // Exists purely for traceability (see src/domain/decision/); evaluation
  // behavior never depends on it.
  id: string;
  when: Partial<Context>;
  then: Result[];
}

export function matches<Context>(when: Partial<Context>, context: Context): boolean {
  return (Object.keys(when) as (keyof Context)[]).every((key) => when[key] === context[key]);
}

export function evaluateRules<Context, Result>(rules: Rule<Context, Result>[], context: Context): Result[] {
  return rules.filter((rule) => matches(rule.when, context)).flatMap((rule) => rule.then);
}

// Additive: every existing evaluateRules() caller is untouched and behaves
// identically. This is what the decision domain uses instead - it needs to
// know which specific rule produced (or didn't produce) a result, not just
// the flattened results themselves.
export interface RuleEvaluation<Result> {
  ruleId: string;
  matched: boolean;
  then: Result[];
}

export function evaluateRulesWithTrace<Context, Result>(
  rules: Rule<Context, Result>[],
  context: Context,
): RuleEvaluation<Result>[] {
  return rules.map((rule) => {
    const matched = matches(rule.when, context);
    return { ruleId: rule.id, matched, then: matched ? rule.then : [] };
  });
}
