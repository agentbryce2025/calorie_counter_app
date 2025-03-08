/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0077B6",
        secondary: "#90E0EF",
        dark: "#03045E",
        light: "#CAF0F8",
      },
    },
  },
  plugins: [],
};