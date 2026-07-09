import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A0F1E',    // Fondo inmersivo base (Midnight Navy)
          cyan: '#00E5FF',    // Flujos de datos e IA (Electric Cyan)
          violet: '#8B5CF6',  // Profundidad y tecnología (Tech Violet)
          coral: '#FF4D00',   // El Spark disruptivo de conversión (Neon Coral)
        },
      },
    },
  },
  plugins: [],
};
export default config;