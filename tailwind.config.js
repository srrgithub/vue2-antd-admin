/** @type {import('tailwindcss').Config} */
module.exports = {
  contet: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
