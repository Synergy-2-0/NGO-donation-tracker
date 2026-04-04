/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        display: ['Open Sans', 'sans-serif'],
        serif: ['Open Sans', 'sans-serif'],
      },
      colors: {
        tf: {
          primary: '#FF8A00', // Matches new Brand Logo
          secondary: '#F8FAFC', // Slate 50
          accent: '#10B981', // Emerald
          dark: '#0F172A',   // Slate 900
          slate: '#64748B',  // Slate 500
        },
        brand: {
          red: '#E53E3E',    // Vibrant red for CTAs and accents
          orange: '#FF8A00', // Primary brand orange
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
