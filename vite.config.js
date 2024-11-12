import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// before running the admin, we will add server:{port:5173} 5173 is the port number for the frontend to avoid conflict
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 }
});
