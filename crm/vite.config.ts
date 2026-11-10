import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// Served by the Next.js site. Assets live at /crm/ and the router is mounted
// at /admin so existing Next admin pages keep their URLs.
export default defineConfig({
  base: "/crm/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, "../public/crm"),
    emptyOutDir: true,
    sourcemap: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
