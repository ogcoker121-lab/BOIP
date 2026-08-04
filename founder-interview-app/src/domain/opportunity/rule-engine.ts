// Generic, reusable across BOIP's future rule-driven layers (scoring,
// recommendations) - knows nothing about interviews, opportunities, or UI.

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
