import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
        background: "#FEF3E2",
        foreground: "#000000",
        bg1: "#FEF3E2",
        bg2: "#FAB12F",
        bg3: "#FA812F",
        bg4: "#FA4032",
        headline: "#A82A21",
      },
    },
  },
  darkMode: false,
  plugins: [],
} satisfies Config;
