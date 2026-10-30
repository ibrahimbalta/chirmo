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
          secondary: '#F8FAFC',
          brand: {
            DEFAULT: '#6534F8',
            hover: '#5526E5',
            light: '#F3EFFE',
            dark: '#4C1D95'
          },
          text: {
            DEFAULT: '#0F172A',
            secondary: '#475569',
            muted: '#94A3B8'
          },
          border: '#E2E8F0',
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
