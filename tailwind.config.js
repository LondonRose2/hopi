/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oatmeal: {
          DEFAULT: '#FBF8F2',
          linen: '#F6F1E8',
          subtle: '#EFE7DA',
        },
        warm: {
          50: '#FDFBF7',
          100: '#F8F4EE',
          200: '#EAE2D5',
          300: '#D6CABE',
          400: '#B0A294',
          500: '#8A7C6E',
          600: '#70685F',
          700: '#524A42',
          800: '#3D362F',
          900: '#2D2721',
        },
        terracotta: {
          DEFAULT: '#E07A5F',
          hover: '#D46C51',
          soft: '#FCEFEA',
        },
        sage: {
          DEFAULT: '#7D9371',
          hover: '#6F8563',
          soft: '#EEF4EB',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'pebble': '0 2px 12px -2px rgba(45, 39, 33, 0.05), 0 1px 3px 0 rgba(45, 39, 33, 0.03)',
        'pebble-lg': '0 10px 30px -4px rgba(45, 39, 33, 0.08), 0 4px 6px -2px rgba(45, 39, 33, 0.03)',
        'sheet': '0 -10px 40px -5px rgba(45, 39, 33, 0.12)',
      },
      borderRadius: {
        'pebble': '1.25rem',
      }
    },
  },
  plugins: [],
}
