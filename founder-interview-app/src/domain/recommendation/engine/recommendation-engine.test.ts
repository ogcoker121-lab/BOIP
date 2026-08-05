import { describe, it, expect } from "vitest";
import { OpportunityContext } from "@/src/domain/opportunity";
import { evaluateRecommendations } from "./recommendation-engine";

const PRIORITY_ORDER = ["Critical", "High", "Medium", "Low"];
const IMPACT_ORDER = ["High", "Medium", "Low"];
const EFFORT_ORDER = ["Small", "Medium", "Large"];

function baseContext(overrides: Partial<OpportunityContext> = {}): OpportunityContext {
  return {
    businessStage: "Early revenue",
    industry: "Creative",
    revenueModel: "Subscription",
    marketType: "Consumers (B2C)",
    hasCustomer: true,
    hasProblem: true,
    hasMarketSignal: true,
    ...overrides,
  };
}

describe("evaluateRecommendations", () => {
  it("always includes the competition recommendation - its rule has an unconditional when: {}", () => {
    const recommendations = evaluateRecommendations(baseContext());
    expect(recommendations.some((r) => r.id === "REC-006")).toBe(true);
  });

  it("orders results by priority, then impact, then effort", () => {
    // A profile that fires every recommendation rule at once.
    const recommendations = evaluateRecommendations(
      baseContext({ businessStage: "Just an idea", revenueModel: "Not sure yet", hasMarketSignal: false }),
    );
    expect(recommendations.length).toBeGreaterThan(1);

    for (let i = 1; i < recommendations.length; i++) {
      const prev = recommendations[i - 1];
      const curr = recommendations[i];
      const prevPriority = PRIORITY_ORDER.indexOf(prev.priority);
      const currPriority = PRIORITY_ORDER.indexOf(curr.priority);
      expect(prevPriority).toBeLessThanOrEqual(currPriority);
      if (prevPriority === currPriority) {
        const prevImpact = IMPACT_ORDER.indexOf(prev.estimatedImpact);
        const currImpact = IMPACT_ORDER.indexOf(curr.estimatedImpact);
        expect(prevImpact).toBeLessThanOrEqual(currImpact);
        if (prevImpact === currImpact) {
          expect(EFFORT_ORDER.indexOf(prev.estimatedEffort)).toBeLessThanOrEqual(EFFORT_ORDER.indexOf(curr.estimatedEffort));
        }
      }
    }
  });

  it("fires REC-001 (idea-stage customer discovery) only at the idea stage", () => {
    expect(evaluateRecommendations(baseContext({ businessStage: "Just an idea" })).some((r) => r.id === "REC-001")).toBe(true);
    expect(evaluateRecommendations(baseContext({ businessStage: "Early revenue" })).some((r) => r.id === "REC-001")).toBe(false);
  });

  it("is deterministic - the same context always produces the same recommendations", () => {
    const context = baseContext();
    expect(evaluateRecommendations(context)).toEqual(evaluateRecommendations(context));
  });
});
