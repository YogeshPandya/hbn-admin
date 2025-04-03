/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        lg: "1350px", // Customizing the 'lg' breakpoint to 1240px
      },
    },
  },
  plugins: [],
};
