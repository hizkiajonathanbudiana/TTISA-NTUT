/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Custom color palette based on the TTISA logo
      colors: {
        primary: {
          DEFAULT: "#1A73E8", // TTISA Blue
          hover: "#1765c9",
        },
        secondary: {
          DEFAULT: "#00B660", // TTISA Green
          hover: "#00a054",
        },
        neutral: {
          100: "#F8FAFC", // Off-White (Card Backgrounds)
          200: "#E5E7EB", // Light Gray (Borders)
          500: "#6B7280", // Medium Gray (Subtle Text)
          800: "#101827", // Dark Gray (Headings)
        },
        system: {
          success: "#16A34A",
          danger: "#EF4444",
        },
      },
    },
  },
  plugins: [],
};
