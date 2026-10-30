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
            DEFAULT: '#2563EB',
            hover: '#1D4ED8',
            light: '#EFF6FF',
            dark: '#1E40AF'
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
