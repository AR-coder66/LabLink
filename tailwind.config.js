/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1020',
        surface: {
          DEFAULT: '#131B2E',
          secondary: '#1A233D',
          hover: '#222E4D',
          card: '#111728',
          border: '#1F2B48',
        },
        primary: {
          DEFAULT: '#527BFF',
          hover: '#3F68EB',
          light: '#7093FF',
          dark: '#3053D4',
        },
        violet: {
          DEFAULT: '#9875FF',
          hover: '#825BF0',
          light: '#B297FF',
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        rose: {
          DEFAULT: '#F43F5E',
          light: '#FB7185',
          dark: '#E11D48',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(82, 123, 255, 0.35)',
        'glow-violet': '0 0 25px -5px rgba(152, 117, 255, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
