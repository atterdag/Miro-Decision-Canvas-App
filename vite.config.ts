import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 3000,
    // Allow cross-origin requests from Miro's iframe
    cors: true,
  },
  build: {
    // Emit a sourcemap to help with debugging inside Miro
    sourcemap: true,
    rollupOptions: {
      input: {
        // App panel entry (opened when the user clicks the toolbar icon)
        index: "index.html",
      },
    },
  },
});
