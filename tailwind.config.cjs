/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
const typography = require("@tailwindcss/typography");

module.exports = {
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
        // default sans manuale, funziona sempre con Bun
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
        ],
      },
    },
  },
  plugins: [typography],
  darkMode: "class",
};
