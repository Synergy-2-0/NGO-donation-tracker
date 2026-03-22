/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      colors: {
        tf: {
          primary: '#FF8A00', // The Logo Orange
          orange: '#FF8A00',
          pink: '#FF8A00',   // Backwards compat for existing classes
          purple: '#05010B', // Deepest dark for contrast
          green: '#10B981', 
          grey: '#F9FAFB',
          dark: '#05010B',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
