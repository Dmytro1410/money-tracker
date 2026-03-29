import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: {
          50:  '#f4f4f6',
          100: '#e8e8ed',
          200: '#c4c4d0',
          300: '#8e8ea8',
          400: '#5a5a7a',
          500: '#2e2e48',
          600: '#1e1e32',
          700: '#16162a',
          800: '#0f0f1c',
          900: '#0a0a0f',
          950: '#050508',
        },
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
        amber: {
          400: '#fbbf24',
        },
      },
      fontFamily: {
        display: ['"Urbanist"', 'sans-serif'],
        sans:    ['"Urbanist"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
} satisfies Config
