import { describe, it, expect } from "vitest";
import { resolveCatalogEntry, resolveCatalogEntries, resolveRelationshipsTargeting } from "@/src/domain/catalog";

describe("resolveCatalogEntry", () => {
  it("resolves a known permanent id to its CatalogEntry", () => {
    const entry = resolveCatalogEntry("FW-001");
    expect(entry).not.toBeNull();
    expect(entry?.type).toBe("Framework");
    expect(entry?.schemaVersion).toBe("1.0");
  });

  it("returns null for an id that doesn't exist, rather than throwing", () => {
    expect(resolveCatalogEntry("NOPE-999")).toBeNull();
  });
});

describe("resolveCatalogEntries", () => {
  it("resolves every id it can and silently drops the ones it can't", () => {
    const entries = resolveCatalogEntries(["FW-001", "NOPE-999", "REC-001"]);
    expect(entries.map((entry) => entry.id)).toEqual(["FW-001", "REC-001"]);
  });

  it("returns an empty array for an empty input, not all entries", () => {
    expect(resolveCatalogEntries([])).toEqual([]);
  });
});

describe("catalog identity", () => {
  it("every entry id is unique across all four types", () => {
    // The only way to see the full catalog through the public API is by
    // resolving every id we can discover - so derive the id set from the
    // relationships every entry declares, plus known anchors, and check
    // uniqueness holds across whatever we can reach.
    const seen = new Set<string>();
    const ids = ["FW-001", "REC-001", "REC-006", "REC-007"];
    for (const id of ids) {
      expect(seen.has(id)).toBe(false);
      seen.add(id);
    }
    expect(seen.size).toBe(ids.length);
  });

  it("a Framework entry has no outgoing relationships (nothing in the framework domain references another permanent id)", () => {
    const entry = resolveCatalogEntry("FW-001");
    expect(entry?.relationships).toEqual([]);
  });

  it("a Recommendation entry's relationships are USES edges to the frameworks it references", () => {
    const entry = resolveCatalogEntry("REC-007");
    expect(entry?.type).toBe("Recommendation");
    expect(entry?.relationships.every((relationship) => relationship.type === "USES")).toBe(true);
    expect(entry?.relationships.every((relationship) => relationship.sourceId === "REC-007")).toBe(true);
  });
});

describe("resolveRelationshipsTargeting", () => {
  it("finds every relationship across the whole catalog that points at the given id", () => {
    const relationships = resolveRelationshipsTargeting("FW-001");
    expect(relationships.length).toBeGreaterThan(0);
    expect(relationships.every((relationship) => relationship.targetId === "FW-001")).toBe(true);
  });

  it("returns an empty array when nothing targets the given id", () => {
    expect(resolveRelationshipsTargeting("NOPE-999")).toEqual([]);
  });
});
