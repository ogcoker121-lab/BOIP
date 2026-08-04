// The one generic evaluation engine for BOIP's knowledge-driven domains.
// Knows nothing about interviews, opportunities, recommendations, or UI -
// every domain (opportunity/, recommendation/, and future scoring/) reuses
// this rather than each building its own.

export interface Rule<Context, Result> {
  when: Partial<Context>;
  then: Result[];
}

export function matches<Context>(when: Partial<Context>, context: Context): boolean {
  return (Object.keys(when) as (keyof Context)[]).every((key) => when[key] === context[key]);
}

export function evaluateRules<Context, Result>(rules: Rule<Context, Result>[], context: Context): Result[] {
  return rules.filter((rule) => matches(rule.when, context)).flatMap((rule) => rule.then);
}
