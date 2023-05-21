/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "theme-input": "#232332",
        "theme-dark": "#10101e",
        "theme-main": "#1d1d30",
        "theme-main-light": "#2e2e40",
        "theme-main-ex-light": "#38384d",
        "theme-action": "#919be0",
        "theme-action-light": "#BFC8FF",
        "theme-action-dark": "#515A94",
      },
    },
  },
  plugins: [require("tailwindcss-safe-area")],
};
