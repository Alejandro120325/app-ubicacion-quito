/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        quito: {
          navy: "#10233f",
          blue: "#1d4ed8",
          sky: "#0ea5e9",
          mint: "#14b8a6",
          green: "#22c55e",
          amber: "#f59e0b",
          coral: "#fb7185",
          graphite: "#263241"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 23, 42, 0.12)",
        glow: "0 0 0 8px rgba(20, 184, 166, 0.12)"
      },
      animation: {
        "slow-drift": "slow-drift 18s ease-in-out infinite alternate",
        "grid-pan": "grid-pan 24s linear infinite"
      },
      keyframes: {
        "slow-drift": {
          "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "100%": { transform: "translate3d(24px, -18px, 0) scale(1.03)" }
        },
        "grid-pan": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "72px 72px" }
        }
      }
    }
  },
  plugins: []
};
