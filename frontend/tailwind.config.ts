import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#dc2626",
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#0f172a"
        },
        ink: "#ffffff",
        panel: "#ffffff"
      },
      boxShadow: {
        glow: "0 0 42px rgba(220, 38, 38, 0.22)",
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
