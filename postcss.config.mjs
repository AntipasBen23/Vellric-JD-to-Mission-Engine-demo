// frontend/tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        velric: {
          purple: "#b025ff",
          purpleSoft: "#5b00ff",
          bg: "#05030a",
        },
      },
      boxShadow: {
        "velric-glow": "0 0 30px rgba(176, 37, 255, 0.75)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
