/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './types/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        secondary: {
          DEFAULT: '#06D6A0',
          dark: '#05b889',
        },
        accent: {
          DEFAULT: '#EF476F',
          dark: '#e91e63',
        },
        background: {
          light: '#FFFCF9',
          dark: '#121212',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        text: {
          light: '#073B4C',
          dark: '#E0E0E0',
        },
        muted: {
          light: '#6B7280',
          dark: '#9CA3AF',
        },
        border: {
          light: '#E5E7EB',
          dark: '#333333',
        },
        card: {
          light: '#FFFFFF',
          dark: '#252525',
        },
        hover: {
          light: '#F3F4F6',
          dark: '#2C2C2C',
        },
      },
    },
  },
  plugins: [],
}
