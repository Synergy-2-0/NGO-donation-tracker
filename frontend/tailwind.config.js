/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:    '#DC2626',
          orange: '#FB923C',
          cream:  '#FFF7ED',
          brown:  '#7C2D12',
          dark:   '#1F2937',
        },
      },
    },
  },
  plugins: [],
};
