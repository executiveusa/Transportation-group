import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
      },
      colors: {
        ink: "#0a0a0a",
        navy: "#0a1628",
        gold: "#c9a96e",
        sand: "#f5f0e8",
        mist: "#fafaf9",
        muted: "#6b7280",
        whatsapp: "#25D366",
      },
      letterSpacing: {
        widest: "0.2em",
      },
      lineHeight: {
        tight: "1.1",
        snug: "1.3",
      },
    },
  },
  plugins: [],
};

export default config;
