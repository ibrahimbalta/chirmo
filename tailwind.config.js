/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        chirmo: {
          bg: '#FFFFFF',
          secondary: '#F5F6FA',
          brand: {
            DEFAULT: '#6652C9',
            hover: '#5541B8',
            light: '#F0EEFC',
            dark: '#4835A1'
          },
          text: {
            DEFAULT: '#252631',
            secondary: '#777987',
            muted: '#9CA3AF'
          },
          border: '#E5E7EF',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
