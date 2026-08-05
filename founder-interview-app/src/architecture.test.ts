import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// Dependency tests, not unit tests - they don't exercise any function,
// they read the source tree and assert import statements respect the
// boundaries the domain architecture depends on. A second, independent
// layer of protection alongside the ESLint no-restricted-imports rule
// (eslint.config.mjs) - this keeps working even if lint config drifts
// or a rule gets locally disabled.

const SRC_ROOT = import.meta.dirname;
const APP_ROOT = path.resolve(SRC_ROOT, "..", "app");
const COMPONENTS_ROOT = path.resolve(SRC_ROOT, "..", "components");
const DOMAIN_ROOT = path.join(SRC_ROOT, "domain");

function listFiles(dir: string, extensions: string[]): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listFiles(full, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

function importSpecifiers(file: string): string[] {
  const content = fs.readFileSync(file, "utf8");
  const specifiers: string[] = [];
  const importRegex = /from\s+["']([^"']+)["']/g;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(content)) !== null) {
    specifiers.push(match[1]);
  }
  return specifiers;
}

function sourceFiles(dir: string): string[] {
  return listFiles(dir, [".ts", ".tsx"]).filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"));
}

describe("architecture: Business Plan does not import Interview directly", () => {
  it("only business-plan-mapper.ts (the domain's entry point) touches @/types/interview", () => {
    const offenders = sourceFiles(path.join(DOMAIN_ROOT, "business-plan"))
      .filter((file) => !file.endsWith("business-plan-mapper.ts"))
      .filter((file) => importSpecifiers(file).some((spec) => spec.includes("types/interview")));

    expect(offenders).toEqual([]);
  });
});

describe("architecture: Framework Explorer only resolves through the Knowledge Catalog", () => {
  it("never imports another domain besides catalog", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(path.join(DOMAIN_ROOT, "framework-explorer"))) {
      for (const spec of importSpecifiers(file)) {
        const match = spec.match(/^@\/src\/domain\/([a-z-]+)/);
        if (match && match[1] !== "catalog" && match[1] !== "framework-explorer") {
          offenders.push(`${path.relative(DOMAIN_ROOT, file)} -> ${spec}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("architecture: Recommendation does not import Opportunity internals", () => {
  it("only imports the opportunity barrel, never a deep path underneath it", () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(path.join(DOMAIN_ROOT, "recommendation"))) {
      for (const spec of importSpecifiers(file)) {
        if (spec.startsWith("@/src/domain/opportunity/")) {
          offenders.push(`${path.relative(DOMAIN_ROOT, file)} -> ${spec}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("architecture: Decision does not own business knowledge", () => {
  it("has no knowledge/ folder of its own - it only traces other domains'", () => {
    expect(fs.existsSync(path.join(DOMAIN_ROOT, "decision", "knowledge"))).toBe(false);
  });
});

describe("architecture: UI does not import knowledge files", () => {
  it("app/ never imports a domain's knowledge/ path", () => {
    const offenders = listFiles(APP_ROOT, [".ts", ".tsx"]).filter((file) =>
      importSpecifiers(file).some((spec) => spec.includes("/knowledge/")),
    );
    expect(offenders).toEqual([]);
  });

  it("components/ never imports a domain's knowledge/ path", () => {
    const offenders = listFiles(COMPONENTS_ROOT, [".ts", ".tsx"]).filter((file) =>
      importSpecifiers(file).some((spec) => spec.includes("/knowledge/")),
    );
    expect(offenders).toEqual([]);
  });
});
