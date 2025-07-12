/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#1E40AF',
        'secondary': '#9333EA',
        'accent': '#F59E0B',
        'neutral': '#F3F4F6',
        'dark-neutral': '#1F2937',
        'error': '#DC2626',
        'success': '#16A34A',
        'sage': '#A3BFFA',
        'coral': '#FF7F50',
        'lavender': '#E6E6FA',
        'teal': '#26A69A',
        'rose': '#FF9999',
        'mustard': '#D4A017',
        'indigo': '#4B0082',
        'peach': '#FFDAB9',
      },
    },
  },
  plugins: [],
};