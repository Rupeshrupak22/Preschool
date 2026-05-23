import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: "#fffaf2",
          100: "#fff2d9",
          200: "#ffe3ae",
          300: "#ffc96f",
          400: "#ffad32",
          500: "#ff8a00",
          600: "#f97316",
          700: "#ea580c",
          800: "#c2410c",
          900: "#9a3412"
        },
        ink: "#ffffff",
        panel: "#ffffff"
      },
      boxShadow: {
        glow: "0 0 42px rgba(255, 122, 0, 0.28)",
        glass: "0 20px 70px rgba(249, 115, 22, 0.22)"
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
