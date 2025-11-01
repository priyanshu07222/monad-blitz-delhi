/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#667eea",
          "purple-dark": "#764ba2",
        },
        accent: {
          gold: "#ffd700",
          orange: "#ffa500",
          coral: "#ff6b6b",
          teal: "#4ecdc4",
          blue: "#45b7d1",
        },
        success: {
          green: "#4ade80",
          "green-dark": "#22c55e",
          "green-darker": "#16a34a",
        },
        bg: {
          primary: "#0f0f23",
          secondary: "#1a1a2e",
          tertiary: "#16213e",
          quaternary: "#0f3460",
          game: "#1a1a2e",
        },
        glass: {
          bg: "rgba(255, 255, 255, 0.05)",
          "bg-hover": "rgba(255, 255, 255, 0.08)",
          border: "rgba(255, 255, 255, 0.1)",
          "border-hover": "rgba(255, 255, 255, 0.2)",
        },
        text: {
          primary: "#ffffff",
          secondary: "rgba(255, 255, 255, 0.9)",
          tertiary: "rgba(255, 255, 255, 0.8)",
          muted: "rgba(255, 255, 255, 0.7)",
          address: "#87ceeb",
          rank: "#ffd700",
          score: "#4ade80",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        pixelify: ["Pixelify Sans", "cursive"],
      },
      spacing: {
        xs: "0.5rem",
        sm: "0.75rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.5rem",
        "3xl": "3rem",
        "4xl": "4rem",
      },
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(31, 38, 135, 0.37)",
        glow: "0 0 20px rgba(102, 126, 234, 0.3)",
        "glow-hover": "0 0 30px rgba(102, 126, 234, 0.5)",
        "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float 3s ease-in-out infinite 1.5s",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 3s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-slow": "bounce 2s infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.5s ease-out",
        "success-pulse": "successPulse 0.6s ease-out",
        "warning-pulse": "warningPulse 2s infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        successPulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
        warningPulse: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 107, 107, 0.3)" },
          "50%": { boxShadow: "0 0 0 10px rgba(255, 107, 107, 0)" },
        },
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      transitionDuration: {
        0: "0ms",
        75: "75ms",
        100: "100ms",
        150: "150ms",
        200: "200ms",
        300: "300ms",
        500: "500ms",
        700: "700ms",
        1000: "1000ms",
      },
      transitionTimingFunction: {
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        starry: `
          radial-gradient(2px 2px at 20px 30px, #eee, transparent),
          radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
          radial-gradient(1px 1px at 90px 40px, #fff, transparent),
          radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
          radial-gradient(2px 2px at 160px 30px, #ddd, transparent)
        `,
      },
    },
  },
  plugins: [
    // Custom utilities for glass morphism
    function ({ addUtilities }) {
      const newUtilities = {
        ".glass-morphism": {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".glass-morphism-hover": {
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        },
        ".text-gradient": {
          background:
            "linear-gradient(135deg, #ffd700 0%, #ffa500 25%, #ff6b6b 50%, #4ecdc4 75%, #45b7d1 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundSize: "200% 200%",
        },
        ".bg-starry": {
          background: `
            #0f0f23,
            radial-gradient(2px 2px at 20px 30px, #eee, transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 90px 40px, #fff, transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
            radial-gradient(2px 2px at 160px 30px, #ddd, transparent)
          `,
          backgroundSize: "200px 100px",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
