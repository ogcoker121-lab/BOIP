import { describe, it, expect } from "vitest";
import { buildOpportunitySnapshot } from "./opportunity-mapper";

const FULL_ANSWERS = {
  "business-stage": "Just an idea",
  industry: "Creative",
  "revenue-model": "Not sure yet",
  "market-type": "Consumers (B2C)",
  "who-affected": "Freelancers who need better portfolios",
  "problem-solved": "They struggle to showcase their work professionally",
  "market-signal": "A few people have already asked me to help",
};

describe("buildOpportunitySnapshot", () => {
  it("builds a founder summary sentence per answered field", () => {
    const snapshot = buildOpportunitySnapshot(FULL_ANSWERS);
    expect(snapshot.founderSummary).toEqual([
      "You're building in the Creative space, focused on freelancers who need better portfolios.",
      "You are currently at the idea stage.",
      "Your revenue model isn't decided yet.",
      "The problem you're solving: They struggle to showcase their work professionally.",
    ]);
  });

  it("fills the overview from the same answers, defaulting to 'Not specified'", () => {
    const snapshot = buildOpportunitySnapshot(FULL_ANSWERS);
    expect(snapshot.overview).toEqual({
      stage: "Just an idea",
      industry: "Creative",
      customer: "Freelancers who need better portfolios",
      revenueModel: "Not sure yet",
      marketType: "Consumers (B2C)",
    });

    const empty = buildOpportunitySnapshot({});
    expect(empty.overview).toEqual({
      stage: "Not specified",
      industry: "Not specified",
      customer: "Not specified",
      revenueModel: "Not specified",
      marketType: "Not specified",
    });
  });

  it("lists a strength for each of customer/problem/market-signal present", () => {
    const snapshot = buildOpportunitySnapshot(FULL_ANSWERS);
    expect(snapshot.strengths).toEqual(
      expect.arrayContaining(["Customer clearly identified", "Problem clearly defined", "Early market signal identified"]),
    );
    expect(snapshot.strengths).toHaveLength(3);
  });

  it("has no strengths and a market-signal watch item when nothing is answered", () => {
    const snapshot = buildOpportunitySnapshot({});
    expect(snapshot.strengths).toEqual([]);
    expect(snapshot.watchList).toContain("Market signal not yet validated");
  });

  it("always includes the two structurally-unvalidated watch items regardless of answers", () => {
    const snapshot = buildOpportunitySnapshot(FULL_ANSWERS);
    expect(snapshot.watchList).toEqual(
      expect.arrayContaining(["Market size not yet estimated", "Competitive differentiation not yet defined"]),
    );
  });

  it("adds a pricing watch item only when the revenue model is undecided", () => {
    const undecided = buildOpportunitySnapshot({ ...FULL_ANSWERS, "revenue-model": "Not sure yet" });
    expect(undecided.watchList).toContain("Pricing not yet validated with customers");

    const decided = buildOpportunitySnapshot({ ...FULL_ANSWERS, "revenue-model": "Subscription" });
    expect(decided.watchList).not.toContain("Pricing not yet validated with customers");
  });

  it("de-duplicates strengths and watch-list items", () => {
    const snapshot = buildOpportunitySnapshot(FULL_ANSWERS);
    expect(new Set(snapshot.strengths).size).toBe(snapshot.strengths.length);
    expect(new Set(snapshot.watchList).size).toBe(snapshot.watchList.length);
  });
});
