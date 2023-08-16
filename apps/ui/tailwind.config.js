/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nav-bar': "#4a4e69",
        'page-default': "#f2e9e4",
      }
    },
  },
  plugins: [],
}

