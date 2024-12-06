/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",   // HTML dosyalarını gözlemle
    "./src/**/*.{js,jsx,ts,tsx}",  // JavaScript dosyalarını gözlemle
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
