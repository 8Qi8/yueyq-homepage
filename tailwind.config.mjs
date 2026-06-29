import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,mdx,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#f6f9fc",
          surface: "#ffffff",
          border: "#e8f0f7",
          "border-light": "#edf3f7",
          text: "#2c3e50",
          "text-secondary": "#5a7d8e",
          "text-muted": "#a0b8c6",
          primary: "#6baed6",
          "primary-dark": "#4a90c4",
          "primary-light": "#b8d9f0",
          accent: "#d4eaf8",
          "tag-bg": "#e8f4fd",
          "tag-text": "#3a6b85",
          "bubble-ai": "#f1f6fa",
          "bubble-user": "#dceefb",
          online: "#5cc08a",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [typography],
};
