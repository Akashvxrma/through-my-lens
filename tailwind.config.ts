import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        obsidian: "#0A0A0B",
        alabaster: "#F4F3EF",
        mutedStone: "#8A8A8E",
      },
      fontFamily: {
        serif: [
          '"Cormorant Garamond"',
          'Baskerville',
          'Georgia',
          'Cambria',
          '"Times New Roman"',
          'serif',
        ],
        sans: [
          '"Plus Jakarta Sans"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      letterSpacing: {
        widest: "0.2em",
        ultra: "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;
