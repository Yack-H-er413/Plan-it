import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.08)",
      },
      transitionTimingFunction: {
        // iOS-like "springy" ease (works well for micro-interactions)
        ios: "cubic-bezier(0.2, 0.9, 0.2, 1)",
      },
      keyframes: {
        "overlay-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "overlay-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        // "Liquid glass" style modal: fades + slight blur + springy overshoot.
        "sheet-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(18px) scale(0.96)",
            filter: "blur(10px)",
          },
          "60%": {
            opacity: "1",
            transform: "translateY(0px) scale(1.015)",
            filter: "blur(0px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px) scale(1)",
            filter: "blur(0px)",
          },
        },
        "sheet-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0px) scale(1)",
            filter: "blur(0px)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(18px) scale(0.96)",
            filter: "blur(10px)",
          },
        },
        // Smaller surface (popover/menu) — tighter motion.
        "popover-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px) scale(0.98)",
            filter: "blur(8px)",
          },
          "70%": {
            opacity: "1",
            transform: "translateY(0px) scale(1.01)",
            filter: "blur(0px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0px) scale(1)",
            filter: "blur(0px)",
          },
        },
        "popover-out": {
          "0%": {
            opacity: "1",
            transform: "translateY(0px) scale(1)",
            filter: "blur(0px)",
          },
          "100%": {
            opacity: "0",
            transform: "translateY(10px) scale(0.98)",
            filter: "blur(8px)",
          },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0px)" },
        },
        "fade-out": {
          from: { opacity: "1", transform: "translateY(0px)" },
          to: { opacity: "0", transform: "translateY(6px)" },
        },
      },
      animation: {
        "overlay-in": "overlay-in 160ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        "overlay-out": "overlay-out 140ms cubic-bezier(0.4, 0, 1, 1)",
        "sheet-in": "sheet-in 280ms cubic-bezier(0.2, 0.9, 0.2, 1)",
        "sheet-out": "sheet-out 200ms cubic-bezier(0.4, 0, 1, 1)",
        "popover-in": "popover-in 220ms cubic-bezier(0.2, 0.9, 0.2, 1)",
        "popover-out": "popover-out 160ms cubic-bezier(0.4, 0, 1, 1)",
        "fade-in": "fade-in 220ms cubic-bezier(0.2, 0.9, 0.2, 1)",
        "fade-out": "fade-out 160ms cubic-bezier(0.4, 0, 1, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
