/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        sidebar: "rgb(var(--sidebar) / <alpha-value>)",
      },
      boxShadow: {
        "soft-md": "0 1px 2px rgba(16,24,40,0.06), 0 6px 16px rgba(16,24,40,0.08)",
        "soft-lg": "0 2px 6px rgba(16,24,40,0.08), 0 20px 40px rgba(16,24,40,0.12)",
      },
    },
  },
  plugins: [],
}