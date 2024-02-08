import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Tailwind CSS v2+ uses string for darkMode configuration ("class" or "media")
  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      textColor: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
      },
      backgroundColor: {
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        tertiary: "var(--bg-tertiary)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Ensure this plugin is installed and correctly typed if TypeScript is used
};

export default config;

