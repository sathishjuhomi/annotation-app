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
      red: "#bd2426",
      lightred: "#de373a",
      grey: "#F7F6F6",
      white: "#FFFFFF",
      green: "#0DBE5E",
      code: "#454c59",
      edit: "#1F2937",
      git: "#222222",
      lightgreen: "#088228",
      lightblack: "#1a1a1a",
      lightgrey: "#f2f2f2",
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
