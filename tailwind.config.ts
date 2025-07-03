import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "bounce-gentle": "bounce-gentle 2s infinite",
        "pulse-gentle": "pulse-gentle 2s infinite",
      },
      keyframes: {
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "pulse-gentle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#14919B", // 메인 틸 색상
          foreground: "#ffffff",
          50: "#D7FEDF",
          100: "#80ED99",
          200: "#45DFB1",
          300: "#0AD1C8",
          400: "#14919B",
          500: "#14919B",
          600: "#0B6477",
          700: "#0B6477",
          800: "#213A57",
          900: "#213A57",
        },
        secondary: {
          DEFAULT: "#0AD1C8", // 밝은 터콰이즈
          foreground: "#213A57",
          50: "#D7FEDF",
          100: "#80ED99",
          200: "#45DFB1",
          300: "#0AD1C8",
          400: "#14919B",
          500: "#0B6477",
        },
        accent: {
          DEFAULT: "#45DFB1", // 연한 그린
          foreground: "#213A57",
        },
        muted: {
          DEFAULT: "hsl(210 40% 96.1%)",
          foreground: "#213A57",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #14919B 0%, #0AD1C8 50%, #45DFB1 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #213A57 0%, #0B6477 50%, #14919B 100%)",
        "gradient-light":
          "linear-gradient(135deg, #45DFB1 0%, #80ED99 50%, #D7FEDF 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
