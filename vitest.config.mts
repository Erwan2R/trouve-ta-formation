import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // tsconfig garde jsx: "preserve" pour Next ; Vitest doit transformer lui-même.
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: { include: ["**/*.test.ts"], exclude: ["node_modules/**", "e2e/**"] },
});
