/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B131E',
          card: '#131D2A',
          border: '#1E2D40',
          hover: '#192535',
          subtle: '#223247',
        },
        cream: {
          DEFAULT: '#F5EFE6',
          light: '#FAF7F2',
          border: '#334155',
        },
        gold: {
          DEFAULT: '#E5A93C',
          hover: '#F5B94E',
          subtle: '#A8895E',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(19, 32, 48, 0.06)',
        'lift': '0 10px 25px -5px rgba(19, 32, 48, 0.08), 0 8px 10px -6px rgba(19, 32, 48, 0.04)',
      }
    },
  },
  plugins: [],
}
