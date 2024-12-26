import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,route.ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,route.ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,route.ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
