import { describe, it, expect } from "vitest";
import { buildBusinessPlan } from "./business-plan-mapper";

const SIDE_HUSTLE_ANSWERS = {
  "preferred-path": "Build a side hustle",
  "risk-tolerance": "Moderate",
  "income-urgency": "📅 Within 3 months",
  "employment-status": "Employed full-time",
  "time-available": "20 to 35 hours",
  "capital-available": "£1,000 to £5,000",
  "professional-skills": "Marketing & Content",
  "business-stage": "Just an idea",
  industry: "Creative",
  "revenue-model": "Not sure yet",
  "market-type": "Consumers (B2C)",
  "who-affected": "Freelancers who need better portfolios",
  "problem-solved": "They struggle to showcase their work professionally",
  "market-signal": "A few people have already asked me to help",
};

describe("buildBusinessPlan", () => {
  it("produces a runtime BP-xxx id, not a permanent one", () => {
    const plan = buildBusinessPlan(SIDE_HUSTLE_ANSWERS);
    expect(plan.id).toMatch(/^BP-/);
  });

  it("assembles exactly the eight canonical sections, in fixed order", () => {
    const plan = buildBusinessPlan(SIDE_HUSTLE_ANSWERS);
    expect(plan.sections.map((section) => section.id)).toEqual([
      "executive-summary",
      "business-opportunity",
      "target-customer",
      "revenue-model",
      "go-to-market-strategy",
      "first-90-day-action-plan",
      "key-risks",
      "recommended-frameworks",
    ]);
  });

  it("carries the Decision's own route and id into metadata, without recomputing them", () => {
    const plan = buildBusinessPlan(SIDE_HUSTLE_ANSWERS, "interview-abc");
    expect(plan.metadata.route).toBe("side_hustle");
    expect(plan.metadata.decisionId).toMatch(/^DEC-/);
  });

  it("titles the plan after the Best Match opportunity when one exists", () => {
    const plan = buildBusinessPlan(SIDE_HUSTLE_ANSWERS);
    expect(plan.title).toMatch(/^Business Plan: /);
    expect(plan.metadata.opportunityId).not.toBeNull();
  });

  it("falls back to a generic title and null opportunityId when there is no Best Match", () => {
    // job_search has no opportunity library coverage (see
    // opportunity-matcher.test.ts) - no Best Match to title the plan after.
    const plan = buildBusinessPlan({ "preferred-path": "Find a better job", "risk-tolerance": "Low" });
    expect(plan.title).toBe("Business Plan");
    expect(plan.metadata.opportunityId).toBeNull();
  });

  it("never crashes on an empty answer set", () => {
    expect(() => buildBusinessPlan({})).not.toThrow();
  });
});
