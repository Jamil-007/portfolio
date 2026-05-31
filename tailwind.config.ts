import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./content/**/*.{md,mdx,json}"],
  theme: {
    extend: {
      colors: {
        cream: "#F5F1EA",
        paper: "#FBF8F2",
        ink: "#171717",
        muted: "#6B645B",
        quiet: "#A39E98",
        accent: {
          DEFAULT: "#0075de",
          active: "#005bab",
          soft: "#E8F1FC",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      letterSpacing: {
        tightish: "-0.02em",
        tighter2: "-0.04em",
      },
      boxShadow: {
        card:
          "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.84688px, rgba(0,0,0,0.02) 0px 0.8px 2.925px, rgba(0,0,0,0.01) 0px 0.175px 1.04062px",
      },
      keyframes: {
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scrollCue: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.45" },
          "50%": { transform: "translateY(6px)", opacity: "1" },
        },
      },
      animation: {
        "rise-in": "riseIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scroll-cue": "scrollCue 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
