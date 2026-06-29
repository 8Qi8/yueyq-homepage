import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,mdx,ts}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#e9eff5",
          surface: "#ffffff",
          border: "#d0dae4",
          "border-light": "#dce4ed",
          text: "#1b2838",
          "text-secondary": "#4a6072",
          "text-muted": "#8496a6",
          primary: "#5b9ecf",
          "primary-dark": "#3b78ab",
          "primary-light": "#b4d5ec",
          accent: "#d6e8f5",
          "tag-bg": "#e4f0f8",
          "tag-text": "#356277",
          "bubble-ai": "#edf2f7",
          "bubble-user": "#d9e9f7",
          online: "#4db87a",
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
