/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'table-green': '#35654d',
        'felt-green': '#267f45',
        'card-white': '#ffffff',
        'chip-red': '#e74c3c',
        'chip-blue': '#3498db',
        'chip-black': '#2c3e50'
      },
      spacing: {
        'card': '14rem',
        'chip': '4rem'
      }
    },
  },
  plugins: [],
}