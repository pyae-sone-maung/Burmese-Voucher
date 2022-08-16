/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      'noto': ['Noto Sans Myanmar', 'sans-serif'],
      'roboto': ['Roboto Serif', 'serif'],
      'pyidaungsu': ['Pyidaungsu']
    },
    extend: {
      colors: {
        'dark-blue': '#00008B',
        'navy-dark': '#0B0B45'
      }
    },
  },
  plugins: [],
}