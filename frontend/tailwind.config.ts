import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#0d9488",
          600: "#0f766e",
          700: "#115e59",
          800: "#134e4a",
          900: "#0f172a"
        },
        ink: "#ffffff",
        panel: "#ffffff"
      },
      boxShadow: {
        glow: "0 0 42px rgba(13, 148, 136, 0.22)",
        glass: "0 20px 70px rgba(37, 99, 235, 0.16)"
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"]
      },
      backgroundImage: {
        "radial-grid": "none"
      }
    }
  },
  plugins: []
};

export default config;

