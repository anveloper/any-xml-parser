import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "example",
  resolve: {
    alias: {
      "@lib": path.resolve(__dirname, "src"),
    },
  },
});
