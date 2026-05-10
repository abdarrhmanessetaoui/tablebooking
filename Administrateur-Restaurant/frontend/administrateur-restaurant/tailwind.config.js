/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: {
          50:  '#FAF7F4',
          100: '#F5F1ED',
          200: '#EDE5DB',
          300: '#DDD1C2',
          400: '#C8A97E',
          500: '#8B6F4E',
          600: '#6B5339',
          700: '#4B3621',
          800: '#3D2B1A',
          900: '#2E1F12',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm':   '8px',
        DEFAULT: '12px',
        'md':   '12px',
        'lg':   '16px',
        'xl':   '20px',
        '2xl':  '24px',
        '3xl':  '32px',
        'full': '9999px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(75, 54, 33, 0.04), 0 4px 12px rgba(75, 54, 33, 0.03)',
        'card-hover': '0 4px 16px rgba(75, 54, 33, 0.08), 0 2px 6px rgba(75, 54, 33, 0.04)',
        'glass': '0 8px 32px rgba(75, 54, 33, 0.06)',
      },
    },
  },
  plugins: [],
}