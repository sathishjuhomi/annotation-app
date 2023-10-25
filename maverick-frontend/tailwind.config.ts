import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      black: "#000000",
      blue: '#19256b',
      primary: "#000000",
      red: "#bd2426",
      lightred: "#de373a",
      tertiary: "#9c27b0",
      grey: "#303030",
      white: "#FFFFFF",
      green: "#068932",
      yellow: "#f3f578",
      lightgreen: "#0fb847",
      lightblack: "#1a1a1a",
      lightgrey: "#f2f2f2",
      lightblue: "#374491",
    },
    screens: {
      sm: "320px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config
