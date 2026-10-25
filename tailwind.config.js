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
          DEFAULT: '#0052CC',
          dark: '#0039A6',
          light: '#DEEBFF',
        },
        secondary: '#FF5630',
        accent: '#00B8D4',
        success: '#216E4E',
        dark: {
          bg: '#0F1419',
          surface: '#161B22',
          text: '#EAEEF2',
        },
        light: {
          bg: '#FFFFFF',
          surface: '#F7F8FA',
          text: '#172B4D',
        },
        // Theme-aware dynamic colors
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        text: {
          DEFAULT: 'var(--text)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        border: 'var(--border)',
        subtle: 'var(--subtle)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 1.5s ease-in-out infinite',
        'loading': 'loading 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
        'fadeIn': 'fadeIn 0.3s ease',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.5, transform: 'scale(1.1)' },
        },
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(350%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

