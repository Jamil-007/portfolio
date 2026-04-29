import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.{md,mdx,json}"],
  theme: {
    extend: {
      colors: {
        paper: "#f6f5f4",
        ink: "rgba(0,0,0,0.95)",
        muted: "#615d59",
        quiet: "#a39e98",
        notion: {
          blue: "#0075de",
          active: "#005bab",
          focus: "#097fe8",
          badge: "#f2f9ff",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card:
          "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84688px, rgba(0,0,0,0.02) 0px 0.8px 2.925px, rgba(0,0,0,0.01) 0px 0.175px 1.04062px",
      },
    },
  },
  plugins: [],
};

export default config;
