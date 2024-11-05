/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          light: '#404040',
          dark: '#0a0a0a',
          focus: {
            border: '#525252',
            ring: '#737373',
          },
        },
      },
    },
  },
  plugins: [],
}