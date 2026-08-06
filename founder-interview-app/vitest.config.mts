import { defineConfig } from "vitest/config";

// Domain logic is pure TypeScript with no DOM dependency, so the default
// ("node") environment covers almost everything; the handful of
// component tests opt into jsdom per-file via a `// @vitest-environment
// jsdom` comment rather than paying the jsdom cost for every test.
export default defineConfig({
  resolve: {
    alias: {
      "@": import.meta.dirname,
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    coverage: {
      provider: "v8",
      // Reporting only - no thresholds yet. The goal right now is
      // visibility (which domains have coverage and which don't), not
      // gating merges on a percentage.
      reporter: ["text", "html", "json-summary"],
      include: ["src/domain/**/*.ts"],
      exclude: ["src/domain/**/*.test.ts", "src/domain/**/models/**", "src/domain/**/knowledge/**"],
    },
  },
});
