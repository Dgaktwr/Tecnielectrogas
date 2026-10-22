import type { Config } from "tailwindcss";
// Paleta fija del manual de marca (siete colores).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      pizarra: "#1E2C33", papel: "#F5F2EC", cobre: "#A8582F", "cobre-claro": "#E0975F",
      niebla: "#DFE5E7", gris: "#4E5B61", verde: "#2D6E52",
      brand: { DEFAULT: "#1E2C33", light: "#33444C", soft: "#DFE5E7" },
      accent: { DEFAULT: "#A8582F", light: "#E0975F" },
    },
    fontFamily: {
      sans: ["var(--font-plex-sans)", "Arial", "Helvetica", "sans-serif"],
      mono: ["var(--font-plex-mono)", "ui-monospace", "Menlo", "Consolas", "monospace"],
    },
  } },
  plugins: [],
};
export default config;
