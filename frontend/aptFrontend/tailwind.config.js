/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customGrey: '#f0f4f9',
        customBlue: '#0b57d0', 
        customRed: '#b3261e',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        '0.75rem': '0.75rem', 
        '1rem': '1rem',
        '1.25rem': '1.25rem',
        '1.5rem': '1.5rem',
        '2.25rem': '2.25rem',
        '2,5rem': '2.5rem',
      },
    },
  },
  plugins: [],
}
