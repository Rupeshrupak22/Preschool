import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#0f172a"
        },
        ink: "#ffffff",
        panel: "#ffffff"
      },
      boxShadow: {
        glow: "0 0 42px rgba(37, 99, 235, 0.24)",
        glass: "0 20px 70px rgba(37, 99, 235, 0.16)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "radial-grid": "none"
      }
    }
  },
  plugins: []
};

export default config;
