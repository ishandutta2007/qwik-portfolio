import defaultThemeCjs from "tailwindcss/defaultTheme.js";
import colors from "tailwindcss/colors.js";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */

// fallback per Bun + jiti
const defaultSans = defaultThemeCjs?.default?.sans || defaultThemeCjs.sans;

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#00ff00",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        danger: colors.red,
        secondary: colors.gray,
      },
      fontFamily: {
        sans: [...defaultSans],
      },
    },
  },
  plugins: [typography],
  darkMode: "class",
};
