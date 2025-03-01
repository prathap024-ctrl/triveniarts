import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  server : {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  plugins: [react()],
  define: {'process.env': process.env},
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
