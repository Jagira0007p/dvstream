/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all React components
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"), // A nice plugin for form styling
  ],
};
