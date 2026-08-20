import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
  resolve: {
    alias: {
      "@": `${import.meta.dirname}/src`,
      "server-only": `${import.meta.dirname}/src/test/server-only.ts`,
    },
  },
});
