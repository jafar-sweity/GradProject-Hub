/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enables dark mode using the `class` strategy
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(20 14.3% 4.1%)",
        foreground: "hsl(0 0% 95%)",
        card: {
          DEFAULT: "hsl(24 9.8% 10%)",
          foreground: "hsl(0 0% 95%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 9%)",
          foreground: "hsl(0 0% 95%)",
        },
        primary: {
          DEFAULT: "hsl(142.1 70.6% 45.3%)",
          foreground: "hsl(144.9 80.4% 10%)",
        },
        secondary: {
          DEFAULT: "hsl(240 3.7% 15.9%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(0 0% 15%)",
          foreground: "hsl(240 5% 64.9%)",
        },
        accent: {
          DEFAULT: "hsl(12 6.5% 15.1%)",
          foreground: "hsl(0 0% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 62.8% 50%)",
          foreground: "hsl(0 85.7% 97.3%)",
        },
        border: "hsl(240 3.7% 15.9%)",
        input: "hsl(240 3.7% 15.9%)",
        ring: "hsl(142.4 71.8% 29.2%)",
      },
      borderRadius: {
        lg: "1rem",
        md: "calc(1rem - 2px)",
        sm: "calc(1rem - 4px)",
      },
    },
  },
  plugins: [],
};
