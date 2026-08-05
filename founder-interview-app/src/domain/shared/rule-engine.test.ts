import { describe, it, expect } from "vitest";
import { matches, evaluateRules, evaluateRulesWithTrace, Rule } from "@/src/domain/shared/rule-engine";

interface Context {
  a: string;
  b: number;
}

describe("matches", () => {
  it("is vacuously true for an empty when clause", () => {
    expect(matches({}, { a: "x", b: 1 })).toBe(true);
  });

  it("is true when every key in when equals the context", () => {
    expect(matches({ a: "x", b: 1 }, { a: "x", b: 1 })).toBe(true);
  });

  it("is false when any key in when differs from the context", () => {
    expect(matches({ a: "x", b: 2 }, { a: "x", b: 1 })).toBe(false);
  });
});

describe("evaluateRules", () => {
  const rules: Rule<Context, string>[] = [
    { id: "RULE-A", when: { a: "x" }, then: ["matched-a"] },
    { id: "RULE-B", when: { a: "y" }, then: ["matched-b"] },
    { id: "RULE-C", when: {}, then: ["always"] },
  ];

  it("flattens then[] for every matching rule and skips non-matching rules", () => {
    expect(evaluateRules(rules, { a: "x", b: 1 })).toEqual(["matched-a", "always"]);
  });
});

describe("evaluateRulesWithTrace", () => {
  const rules: Rule<Context, string>[] = [
    { id: "RULE-A", when: { a: "x" }, then: ["matched-a"] },
    { id: "RULE-B", when: { a: "y" }, then: ["matched-b"] },
  ];

  it("reports matched:true with then[] for matching rules", () => {
    const trace = evaluateRulesWithTrace(rules, { a: "x", b: 1 });
    expect(trace).toEqual([
      { ruleId: "RULE-A", matched: true, then: ["matched-a"] },
      { ruleId: "RULE-B", matched: false, then: [] },
    ]);
  });

  it("keeps unmatched rules in the trace with an empty then[]", () => {
    const trace = evaluateRulesWithTrace(rules, { a: "z", b: 1 });
    expect(trace.every((entry) => entry.matched === false && entry.then.length === 0)).toBe(true);
  });
});
