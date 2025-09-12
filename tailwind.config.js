import defaultThemeCjs from "tailwindcss/defaultTheme.js";
import colors from "tailwindcss/colors.js";

/** @type {import('tailwindcss').Config} */
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
        sans: [...(defaultThemeCjs?.default?.sans ?? defaultThemeCjs.sans)],
      },
    },
  },
  plugins: [import("@tailwindcss/typography")],
  darkMode: "class",
};
