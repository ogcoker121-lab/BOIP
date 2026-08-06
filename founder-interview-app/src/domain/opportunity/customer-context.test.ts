import { describe, it, expect } from "vitest";
import { buildCustomerContext } from "./customer-context";

describe("buildCustomerContext", () => {
  it("cleans each field independently", () => {
    const context = buildCustomerContext({
      "who-affected": "Freelancers who need better portfolios.",
      "problem-solved": "  They struggle to showcase work. ",
      "market-signal": "A few people asked.",
    });
    expect(context).toEqual({
      customer: "Freelancers who need better portfolios",
      problem: "They struggle to showcase work",
      marketSignal: "A few people asked",
    });
  });

  it("defaults every field to an empty string when unanswered", () => {
    expect(buildCustomerContext({})).toEqual({ customer: "", problem: "", marketSignal: "" });
  });
});
