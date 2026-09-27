import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        "paper-raised": "var(--paper-raised)",
        brand: {
          DEFAULT: "var(--brand)",
          deep: "var(--brand-deep)",
          tint: "var(--brand-tint)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          tint: "var(--accent-tint)",
        },
        line: "var(--line)",
        muted: "var(--muted)",
        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-be-vietnam)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};
export default config;
