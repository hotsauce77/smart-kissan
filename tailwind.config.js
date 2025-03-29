/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      animation: {
        'fade-in-out': 'fadeInOut 4s ease-in-out infinite',
        'pulse': 'pulse 2s infinite',
      },
      keyframes: {
        fadeInOut: {
          '0%, 100%': { opacity: 0 },
          '30%, 70%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
} 