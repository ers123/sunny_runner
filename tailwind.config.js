/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sparkle-pink': '#FFB6C1',
        'sparkle-purple': '#DDA0DD',
        'sparkle-blue': '#87CEEB',
      },
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
        bubbly: ['Bubblegum Sans', 'cursive'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
}
