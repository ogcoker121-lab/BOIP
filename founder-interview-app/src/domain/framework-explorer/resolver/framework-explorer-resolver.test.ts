import { describe, it, expect } from "vitest";
import { resolveFrameworkPage } from "./framework-explorer-resolver";

describe("resolveFrameworkPage", () => {
  it("returns null for an id that doesn't exist", () => {
    expect(resolveFrameworkPage("NOPE-999")).toBeNull();
  });

  it("returns null for a permanent id that exists but isn't a Framework", () => {
    expect(resolveFrameworkPage("REC-001")).toBeNull();
  });

  it("resolves identity fields (title, whatItIs, capability) from the Catalog", () => {
    const page = resolveFrameworkPage("FW-001");
    expect(page?.title).toBe("Lean Startup");
    expect(page?.whatItIs).toBe(
      "Build a minimum viable version of your idea, test it with real users, and learn before investing further.",
    );
    expect(page?.capability).toBe("Product Validation");
  });

  it("resolves guidance fields (whenToUse, expectedOutcome, commonMistakes) from this domain's own knowledge", () => {
    const page = resolveFrameworkPage("FW-001");
    expect(page?.whenToUse.length).toBeGreaterThan(0);
    expect(page?.expectedOutcome.length).toBeGreaterThan(0);
    expect(page?.commonMistakes.length).toBeGreaterThan(0);
  });

  it("derives whyRecommended entirely from Recommendations that USES this framework, via the Catalog", () => {
    const page = resolveFrameworkPage("FW-001");
    expect(page?.whyRecommended).toContain("Build a Low-Fidelity MVP");
  });

  it("derives usedBy from the Catalog's reverse relationship lookup, sorted by id", () => {
    const page = resolveFrameworkPage("FW-001");
    const ids = page?.usedBy.map((reference) => reference.id) ?? [];
    expect(ids).toEqual([...ids].sort());
    expect(ids).toContain("OPP-004");
    expect(ids).toContain("REC-007");
  });

  it("derives relatedFrameworks as other frameworks co-referenced by whatever USES this one", () => {
    const page = resolveFrameworkPage("FW-001");
    expect(page?.relatedFrameworks.every((reference) => reference.id !== "FW-001")).toBe(true);
  });

  it("degrades to empty/null relationship fields when nothing in the Catalog references this framework", () => {
    // FW-002 has no Recommendation or Opportunity USES edge pointing at
    // it today - a real, not simulated, "nothing to show" case.
    const page = resolveFrameworkPage("FW-002");
    expect(page?.usedBy).toEqual([]);
    expect(page?.relatedFrameworks).toEqual([]);
    expect(page?.nextRecommendedFramework).toBeNull();
    expect(page?.relatedCapability).toBeNull();
    expect(page?.leadsTo).toBeNull();
    expect(page?.whyRecommended).toBe("");
  });
});
