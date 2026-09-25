import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#0a1f3a",
          900: "#0d2a4d",
          800: "#123762",
          700: "#1a4a80",
        },
        brand: {
          orange: "#f2811d",
          "orange-dark": "#d76c0f",
          "orange-light": "#fff4e6",
        },
        success: {
          DEFAULT: "#22c55e",
          light: "#dcfce7",
        },
        danger: {
          DEFAULT: "#ef4444",
          light: "#fee2e2",
        },
        info: {
          DEFAULT: "#3b82f6",
          light: "#dbeafe",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fef3c7",
        },
        surface: {
          DEFAULT: "#F5F7FA",
          card: "#ffffff",
        },
        mist: "#eef4fb",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ["var(--font-sora)", "sans-serif"],
      },
      maxWidth: {
        wrap: "1200px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "hero-float": {
          "0%": { transform: "translateY(-2%) rotate(1.5deg)" },
          "100%": { transform: "translateY(2%) rotate(-1deg)" },
        },
        "hero-float-slow": {
          "0%": { transform: "translateY(0%) rotate(-1.5deg)" },
          "100%": { transform: "translateY(-3%) rotate(1deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "0.8", transform: "translate(-50%, -50%) scale(1.2)" },
        },
        "glow-pulse-slow": {
          "0%, 100%": { opacity: "0.3", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "0.6", transform: "translate(-50%, -50%) scale(1.15)" },
        },
        "particle-1": {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.8" },
          "25%": { transform: "translateY(-20px) translateX(10px)", opacity: "1" },
          "50%": { transform: "translateY(-8px) translateX(-8px)", opacity: "0.6" },
          "75%": { transform: "translateY(-25px) translateX(5px)", opacity: "1" },
        },
        "particle-2": {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.6" },
          "33%": { transform: "translateY(-15px) translateX(-12px)", opacity: "1" },
          "66%": { transform: "translateY(8px) translateX(8px)", opacity: "0.4" },
        },
        "particle-3": {
          "0%, 100%": { transform: "translateY(0) scale(1)", opacity: "0.7" },
          "50%": { transform: "translateY(-18px) scale(1.3)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-in-left": "fade-in-left 0.6s ease-out forwards",
        "fade-in-right": "fade-in-right 0.6s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "count-up": "count-up 0.5s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "hero-float": "hero-float 3.5s ease-in-out infinite alternate",
        "hero-float-slow": "hero-float-slow 4.5s ease-in-out infinite alternate",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite",
        "glow-pulse-slow": "glow-pulse-slow 5s ease-in-out infinite",
        "particle-1": "particle-1 6s ease-in-out infinite",
        "particle-2": "particle-2 5s ease-in-out infinite 1s",
        "particle-3": "particle-3 4s ease-in-out infinite 0.5s",
        shimmer: "shimmer 2s infinite linear",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 30px rgba(0,0,0,0.12)",
        glow: "0 0 40px rgba(242,129,29,0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
