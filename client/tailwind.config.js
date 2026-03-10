/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ¡Esta es la línea nueva!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}