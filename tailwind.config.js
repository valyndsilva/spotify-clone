/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,js}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwind-scrollbar")],
};
