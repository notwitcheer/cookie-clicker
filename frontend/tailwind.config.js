/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cookie Brown - Rich chocolate vibes 🍫
        primary: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#a08072',
          700: '#8b5a3c',
          800: '#7c4a2f',
          900: '#5d2f1a',
        },
        // Golden Butter - Warm and delicious 🧈
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Caramel Orange - Sweet and cozy 🍮
        caramel: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Cherry Red - Fun pops of color 🍒
        cherry: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Mint Green - Fresh accent 🌿
        mint: {
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
        },
        // Cream - Soft backgrounds 🥛
        cream: {
          50: '#fefdf8',
          100: '#fefbf0',
          200: '#fcf7e6',
          300: '#f9f1d1',
          400: '#f4e5a3',
          500: '#efd574',
          600: '#e8c547',
          700: '#d4aa2a',
          800: '#b8941f',
          900: '#9c7b1a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        fun: ['Comic Sans MS', 'Trebuchet MS', 'Lucida Grande', 'sans-serif'],
        cozy: ['Georgia', 'serif'],
      },
      animation: {
        'bounce-gentle': 'bounce 1s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'click': 'click 0.1s ease-out',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'cookie-spin': 'cookieSpin 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        click: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        cookieSpin: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'bakery-warmth': 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 25%, #fde68a 50%, #f9f1d1 100%)',
        'cookie-texture': 'radial-gradient(circle at 20% 80%, #fbbf24 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 40% 40%, #d97706 0%, transparent 50%)',
      },
      boxShadow: {
        'cookie': '0 10px 25px -3px rgba(217, 119, 6, 0.3), 0 4px 6px -2px rgba(217, 119, 6, 0.2)',
        'caramel': '0 10px 25px -3px rgba(251, 146, 60, 0.3), 0 4px 6px -2px rgba(251, 146, 60, 0.2)',
        'warm': '0 10px 25px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -2px rgba(245, 158, 11, 0.1)',
      },
    },
  },
  plugins: [],
}