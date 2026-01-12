import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { codeInspectorPlugin } from "code-inspector-plugin"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    codeInspectorPlugin({
      bundler: "vite",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
