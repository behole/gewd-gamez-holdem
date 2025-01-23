/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'table-green': '#35654d',
        'felt-green': '#267f45',
        'card-white': '#ffffff',
        'chip-red': '#e74c3c',
        'chip-blue': '#3498db',
        'chip-black': '#2c3e50',
        'poker-table': '#1a472a',
        'poker-felt': '#35654d',
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      spacing: {
        'card': '14rem',
        'chip': '4rem'
      }
    },
  },
  plugins: [],
}