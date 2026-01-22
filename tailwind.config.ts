import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
      surface: "var(--surface)",
      muted: "var(--muted)",
      border: "var(--border)",
      primary: "var(--primary)",
      cta: "var(--cta)",
      danger: "var(--danger)",
      // Base colors
      white: '#ffffff',
      black: '#000000',
      transparent: 'transparent',
      // Slate palette
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
      },
      // Emerald for mint accents
      emerald: {
        200: '#a7f3d0',
        600: '#059669',
        800: '#065f46',
      },
      // Miracle Workshop Theme
      lavender: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
      },
      mint: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
      },
      coral: {
        50: '#fff1f2',
        100: '#ffe4e6',
        200: '#fecdd3',
        400: '#fb7185',
        500: '#f43f5e',
      }
    },
    fontFamily: {
      sans: ['"Quicksand"', '"ZCOOL KuaiLe"', 'sans-serif'],
      script: ['"Ma Shan Zheng"', 'cursive'],
    },
    borderRadius: {
      DEFAULT: "12px",
      lg: "24px",
      full: "9999px",
      '3xl': "1.5rem", // Added for large cards
      '4xl': "2.5rem", // Added for floating card
    },
    boxShadow: {
      sm: "0 1px 2px rgba(0,0,0,0.05)",
      md: "0 12px 30px rgba(15,23,42,0.18)",
      lg: "0 20px 50px rgba(15,23,42,0.12)",
    },
    animation: {
      "float-slow": "float 6s ease-in-out infinite",
      "float-slower": "float 8s ease-in-out infinite",
      "pulse-slow": "pulse-glow 4s ease-in-out infinite",
    },
    keyframes: {
      float: {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-20px)" },
      },
      "pulse-glow": {
        "0%, 100%": { opacity: "0.4" },
        "50%": { opacity: "0.7" },
      },
    },
  },
  plugins: [],
};
export default config;
