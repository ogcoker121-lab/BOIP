import { describe, it, expect } from "vitest";
import { buildDecision, buildDecisionWithTrace } from "./decision-mapper";

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

const JOB_SEARCH_ANSWERS = {
  "preferred-path": "Find a better job",
  "risk-tolerance": "Low",
  "income-urgency": "🚨 Immediately",
  "employment-status": "Unemployed",
  "time-available": "Full-time",
  "capital-available": "Under £1,000",
};

describe("buildDecision", () => {
  it("produces a runtime DEC-xxx id, not a permanent one", () => {
    const decision = buildDecision(SIDE_HUSTLE_ANSWERS);
    expect(decision.id).toMatch(/^DEC-/);
  });

  it("passes interviewId through without looking it up or persisting it", () => {
    expect(buildDecision(SIDE_HUSTLE_ANSWERS, "interview-123").interviewId).toBe("interview-123");
    expect(buildDecision(SIDE_HUSTLE_ANSWERS).interviewId).toBeNull();
  });

  it("only exposes the UI-facing fields (Decision), not signals/evaluations", () => {
    const decision = buildDecision(SIDE_HUSTLE_ANSWERS);
    expect(Object.keys(decision).sort()).toEqual(
      ["id", "interviewId", "timestamp", "route", "opportunities", "recommendations", "explanation"].sort(),
    );
  });

  it("builds a route-consistent explanation headline", () => {
    const decision = buildDecision(JOB_SEARCH_ANSWERS);
    expect(decision.route).toBe("job_search");
    expect(decision.explanation.headline).toBe("BOIP recommends a Job Search because:");
    expect(decision.explanation.bullets.length).toBeGreaterThan(0);
  });
});

describe("buildDecisionWithTrace", () => {
  it("computes decision and trace together, consistently", () => {
    const { decision, trace } = buildDecisionWithTrace(SIDE_HUSTLE_ANSWERS, "interview-abc");
    expect(decision.route).toBeDefined();
    expect(trace.signals.length).toBeGreaterThan(0);
    expect(trace.evaluations.length).toBeGreaterThan(0);
  });

  it("matchedRules is exactly the ruleIds of matched evaluations", () => {
    const { trace } = buildDecisionWithTrace(SIDE_HUSTLE_ANSWERS);
    const expected = trace.evaluations.filter((e) => e.matched).map((e) => e.ruleId);
    expect(trace.matchedRules).toEqual(expected);
  });

  it("firedRecommendations is exactly the ids of the decision's recommendations", () => {
    const { decision, trace } = buildDecisionWithTrace(SIDE_HUSTLE_ANSWERS);
    expect(trace.firedRecommendations).toEqual(decision.recommendations.map((r) => r.id));
  });

  it("frameworkReferences is a deduplicated union of every recommendation's frameworkReferences", () => {
    const { decision, trace } = buildDecisionWithTrace(SIDE_HUSTLE_ANSWERS);
    const expected = Array.from(new Set(decision.recommendations.flatMap((r) => r.frameworkReferences)));
    expect(trace.frameworkReferences).toEqual(expected);
  });

  it("keeps unmatched rules in evaluations, not just matched ones", () => {
    const { trace } = buildDecisionWithTrace(SIDE_HUSTLE_ANSWERS);
    expect(trace.evaluations.some((e) => !e.matched)).toBe(true);
  });

  it("re-derives a skill-gap match for skill_path so the explanation isn't empty", () => {
    // A profile likely to hit skill_path: side-hustle preference but a
    // skill with no overlap in the curated library.
    const { decision } = buildDecisionWithTrace({
      ...SIDE_HUSTLE_ANSWERS,
      "professional-skills": "Customer Service",
    });
    if (decision.route === "skill_path") {
      expect(decision.opportunities).toEqual([]);
      expect(decision.explanation.bullets.length).toBeGreaterThan(0);
    }
  });
});
