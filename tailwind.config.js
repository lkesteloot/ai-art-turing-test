/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

export default {
  content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
    backgroundImage: {
        "circle-gradient": "radial-gradient(circle at center, var(--tw-gradient-stops))",
        "ellipse-gradient": "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
    },
    boxShadow: {
        "glow": "0 0 10px 2px rgba(0, 0, 0, 0.3)",
    },
  },
  plugins: [
      plugin(function({ addUtilities }) {
          addUtilities({
              '.text-glow': {
                  'text-shadow': '0 0 15px color-mix(in srgb, currentColor, transparent 50%)',
              },
          })
      }),
  ],
}
