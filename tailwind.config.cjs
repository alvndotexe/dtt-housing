/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", "./src/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        'red': '#EB5440',
        'black': '#000000',
        'grey': {
          100: '#FFFFFF',
          200: '#F6F6F6',
          300: '#e8e8e8',
          400: '#c3c3c3',
          500: '#4a4b4c'
        },
        'blue': '#067bc2',
      },
      fontFamily: {
        "monster": ['Monsterrat','sans-serif'],
        'open': ['Open Sans','sans-serif']
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
}
