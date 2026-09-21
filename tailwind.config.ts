import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#F5B30D",
          yellowDark: "#D89A00",
          brown: "#5B2D0F",
          brownDark: "#4A2408",
        },
        surface: "#FFFFFF",
        surface2: "#FBF0D9",
        bg: "#FFF9EF",
        border: "#E7D6AE",
        muted: "#8A6A45",
        success: "#2E7D32",
        successBg: "#E3F1E1",
        warning: "#B45309",
        warningBg: "#FBEBD3",
        danger: "#B3261E",
        dangerBg: "#FAE1DE",
      },
      fontFamily: {
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

