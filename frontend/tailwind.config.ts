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
        soft: "0 24px 60px rgba(48, 31, 20, 0.22)"
      },
      colors: {
        brand: {
          ink: "#241912",
          ocean: "#577046",
          gold: "#E4A92F",
          mint: "#7B8F54",
          paper: "#FFF7E6",
          line: "#B58B60"
        }
      }
    }
  },
  plugins: []
};

export default config;
