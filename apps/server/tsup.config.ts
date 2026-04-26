import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"], // Output ESM for Node
  outDir: "dist", // Explicitly tell it where to put the files
  clean: true, // Clean the dist folder before building
  platform: "node",
});
