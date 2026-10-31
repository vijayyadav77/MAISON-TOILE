/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          950: '#0a0a0a',
          900: '#121212',
          850: '#1a1a1a',
          800: '#242424',
          700: '#383838',
          600: '#525252',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e5e5',
          100: '#f5f4f0',
          50: '#faf9f5',
          cream: '#FAF7F2',
          sand: '#F2ECE1',
          gold: '#C5A880',
          goldHover: '#B29367',
          bronze: '#8C6D3F'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Montserrat"', '"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'widest-plus': '0.25em',
        'editorial': '0.15em',
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
        'luxury-hover': '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
        'drawer': '-10px 0 30px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}
