import { describe, it, expect } from "vitest";
import { buildSignals } from "./signals";

describe("buildSignals", () => {
  it("only includes direct signals whose question was actually answered", () => {
    const signals = buildSignals({ "risk-tolerance": "High" });
    const riskSignal = signals.find((s) => s.sourceQuestionId === "risk-tolerance");
    expect(riskSignal).toEqual({
      id: "SIG-risk-tolerance",
      name: "Risk Tolerance",
      value: "High",
      sourceQuestionId: "risk-tolerance",
    });
    expect(signals.find((s) => s.sourceQuestionId === "income-urgency")).toBeUndefined();
  });

  it("always includes the three presence-based signals, valued Yes/No", () => {
    const answered = buildSignals({ "who-affected": "Freelancers" });
    expect(answered.find((s) => s.sourceQuestionId === "who-affected")).toEqual({
      id: "SIG-who-affected",
      name: "Customer Identified",
      value: "Yes",
      sourceQuestionId: "who-affected",
    });

    const unanswered = buildSignals({});
    expect(unanswered.find((s) => s.sourceQuestionId === "who-affected")?.value).toBe("No");
    expect(unanswered.find((s) => s.sourceQuestionId === "problem-solved")?.value).toBe("No");
    expect(unanswered.find((s) => s.sourceQuestionId === "market-signal")?.value).toBe("No");
  });

  it("treats a whitespace-only answer as unanswered", () => {
    const signals = buildSignals({ "risk-tolerance": "   " });
    expect(signals.find((s) => s.sourceQuestionId === "risk-tolerance")).toBeUndefined();
  });
});
