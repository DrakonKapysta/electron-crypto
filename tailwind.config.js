/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      boxShadow: {
        "3d": `
          0px 1px 2px rgba(0, 0, 0, 0.1), 
          0px 2px 4px rgba(0, 0, 0, 0.1), 
          0px 4px 8px rgba(0, 0, 0, 0.1), 
          0px 8px 16px rgba(0, 0, 0, 0.1), 
          0px 16px 32px rgba(0, 0, 0, 0.1), 
          0px 32px 64px rgba(0, 0, 0, 0.05)
        `,
        "3d-light":
          "0 4px 6px rgba(255, 255, 255, 0.15), 0 8px 15px rgba(255, 255, 255, 0.1), 0 15px 25px rgba(255, 255, 255, 0.08)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
