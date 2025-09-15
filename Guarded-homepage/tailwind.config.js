/** @type {import('tailwindcss').Config} */
module.exports = {
  // enable class strategy dark mode
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // ...existing extend...
    },
  },
  plugins: [
    // ...existing plugins...
  ],
};
