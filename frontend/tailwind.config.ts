import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 60px rgba(15, 23, 42, 0.14)"
      },
      colors: {
        brand: {
          ink: "#081225",
          ocean: "#155DFC",
          gold: "#F7B500",
          mint: "#2ABF88",
          paper: "#F7F9FC",
          line: "#D6DEEB"
        }
      }
    }
  },
  plugins: []
};

export default config;
