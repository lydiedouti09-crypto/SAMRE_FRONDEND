import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env.NEXT_PUBLIC_API_URL": JSON.stringify(
      process.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
    ),
  },
  server: {
    port: 5173,
    host: true,
  },
});
