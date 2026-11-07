/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        skyblock: {
          common: "#ffffff",
          uncommon: "#55ff55",
          rare: "#55ffff",
          epic: "#aa00aa",
          legendary: "#ffaa00",
          mythic: "#ff55ff",
          divine: "#55ffff",
          special: "#ff5555",
          very_special: "#ff5555"
        }
      },
    },
  },
  plugins: [],
};
