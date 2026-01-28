import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-foreground": "rgb(var(--muted-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        secondary: "rgb(var(--secondary) / <alpha-value>)",
        "secondary-foreground": "rgb(var(--secondary-foreground) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        "accent-foreground": "rgb(var(--accent-foreground) / <alpha-value>)",
        destructive: "rgb(var(--destructive) / <alpha-value>)",
        "destructive-foreground": "rgb(var(--destructive-foreground) / <alpha-value>)",
        brand: {
          bg: "rgb(var(--background) / <alpha-value>)",
          dark: "rgb(var(--foreground) / <alpha-value>)",
          primary: "#2B4C7E",
          accent: "#E07A5F",
          success: "#81B29A",
          surface: "rgb(var(--surface) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        "solid-sm": "2px 2px 0px 0px rgba(0,0,0,0.8)",
        solid: "4px 4px 0px 0px rgba(0,0,0,0.8)",
        "solid-lg": "8px 8px 0px 0px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        "grid-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm1 1h38v38H1V1z' fill='%23ccc' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        "fade-in-left": {
          "0%": { opacity: "0", transform: "translateX(-50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-right": {
          "0%": { opacity: "0", transform: "translateX(50px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-y": {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        // Entrance: keep it simple and GPU-friendly (transform/opacity only).
        "fade-in-left": "fade-in-left 800ms ease-out both",
        "fade-in-right": "fade-in-right 800ms ease-out both",
        "fade-in-up": "fade-in-up 300ms ease-out both",
        float: "float-y 6s ease-in-out infinite",
        "float-slow": "float-y 7s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
