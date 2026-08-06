import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated test/coverage output.
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
  ]),
  // Domain contracts (v0.9.1): every domain exposes a public API through
  // its own index.ts (src/domain/<name>/index.ts) - consumers import
  // only "@/src/domain/<name>", never an internal path underneath it.
  // Same-domain files are unaffected: they use relative imports
  // ("../models/...") by convention, which this pattern doesn't match.
  // See CONTRIBUTING.md ("Domain boundaries") for the full rationale.
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/src/domain/*/**"],
              message: "Import from the domain's public API (@/src/domain/<name>) instead of an internal path. See CONTRIBUTING.md.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
