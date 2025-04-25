/** @type {import('tailwindcss').Config} */
// Tailwind config for custom color palette from https://coolors.co/palette/353535-3c6e71-ffffff-d9d9d9-284b63
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#353535',
        teal: '#3c6e71',
        white: '#ffffff',
        lightgray: '#d9d9d9',
        navy: '#284b63',
      },
    },
  },
  plugins: [],
};
