import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    // Packages are still scaffolds; an empty suite should not fail `turbo run test`.
    passWithNoTests: true,
  },
});
