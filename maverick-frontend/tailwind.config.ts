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
      red: "#EA4335",
      lightred: "#de373a",
      grey: "#F7F6F6",
      white: "#FFFFFF",
      green: "#0DBE5E",
      code: "#454c59",
      edit: "#1F2937",
      git: "#222222",
      logo: '#00BA62',
      greyplus: '#666666',
      button: '#0DBE5E',
      border: '#EEEEEE',
      lightgreen: "#15d66e",
      lightblack: "#1a1a1a",
      lightgrey: "#CCCCCC",
      grey2: "#D9D9D9"
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
      width: {
        'full-plus': '600px',
        'full-fourty': '210px',
        'full-fourtyplus': '220px',
        'full-reset': '300px',
        'paper': '840px',
        'button': '109.18px',
        'button2': '181px',
        'button3': '168px',
        'image1': '504px',
        'full-tt': '875px',
        'full-six':'513px',
      },
    },
  },
  plugins: [],
};
export default config
