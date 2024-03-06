/** @type {import('tailwindcss').Config} */
module.exports = {
  // content: ["./.{html,js}"],
  // content: ["./src/**/*.{html,js,pug}"],
  content: ["./views/*.{html,js,pug}"],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['InterVariable', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

