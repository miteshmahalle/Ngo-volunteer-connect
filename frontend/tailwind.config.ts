import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: "#f1fbf3",
          100: "#daf5df",
          500: "#2aa84a",
          600: "#1f873b",
          700: "#196b31",
          900: "#0b351a",
        },
        saffron: "#f5a524",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 53, 26, 0.14)",
      },
    },
  },
  plugins: [],
} satisfies Config;

