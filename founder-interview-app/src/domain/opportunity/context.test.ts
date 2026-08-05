import { describe, it, expect } from "vitest";
import { buildOpportunityContext } from "./context";

describe("buildOpportunityContext", () => {
  it("cleans a trailing period and trims whitespace", () => {
    const context = buildOpportunityContext({ "business-stage": "  Just an idea. " });
    expect(context.businessStage).toBe("Just an idea");
  });

  it("defaults missing fields to an empty string", () => {
    const context = buildOpportunityContext({});
    expect(context.industry).toBe("");
    expect(context.revenueModel).toBe("");
    expect(context.marketType).toBe("");
  });

  it("derives hasCustomer/hasProblem/hasMarketSignal from presence, not content", () => {
    const withAnswers = buildOpportunityContext({
      "who-affected": "Freelancers",
      "problem-solved": "  ",
      "market-signal": "Some signal",
    });
    expect(withAnswers.hasCustomer).toBe(true);
    // whitespace-only counts as not present
    expect(withAnswers.hasProblem).toBe(false);
    expect(withAnswers.hasMarketSignal).toBe(true);

    const empty = buildOpportunityContext({});
    expect(empty.hasCustomer).toBe(false);
    expect(empty.hasProblem).toBe(false);
    expect(empty.hasMarketSignal).toBe(false);
  });
});
