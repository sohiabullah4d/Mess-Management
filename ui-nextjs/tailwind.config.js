/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.tsx", "./src/components/**/*.tsx"],
  important: "#__next",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          500: "#3f51b5",
          600: "#3949ab",
          700: "#303f9f",
        },
        secondary: {
          50: "#fff0f3",
          100: "#ffe0e6",
          500: "#f50057",
          600: "#e0004e",
          700: "#c50045",
        },
      },
    },
  },
  corePlugins: {
    // Disable preflight to avoid conflicts with Material-UI
    preflight: false,
  },
  plugins: [],
};
