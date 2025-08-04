/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", /* warm brown border */
        input: "var(--color-input)", /* light earth tone */
        ring: "var(--color-ring)", /* warm golden brown */
        background: "var(--color-background)", /* warm off-white */
        foreground: "var(--color-foreground)", /* rich dark brown */
        primary: {
          DEFAULT: "var(--color-primary)", /* warm golden brown */
          foreground: "var(--color-primary-foreground)", /* warm off-white */
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", /* deep palm green */
          foreground: "var(--color-secondary-foreground)", /* warm off-white */
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", /* muted red-brown */
          foreground: "var(--color-destructive-foreground)", /* warm off-white */
        },
        muted: {
          DEFAULT: "var(--color-muted)", /* light earth tone */
          foreground: "var(--color-muted-foreground)", /* medium brown */
        },
        accent: {
          DEFAULT: "var(--color-accent)", /* bright gold */
          foreground: "var(--color-accent-foreground)", /* rich dark brown */
        },
        popover: {
          DEFAULT: "var(--color-popover)", /* warm off-white */
          foreground: "var(--color-popover-foreground)", /* rich dark brown */
        },
        card: {
          DEFAULT: "var(--color-card)", /* light earth tone */
          foreground: "var(--color-card-foreground)", /* rich dark brown */
        },
        success: {
          DEFAULT: "var(--color-success)", /* natural green */
          foreground: "var(--color-success-foreground)", /* warm off-white */
        },
        warning: {
          DEFAULT: "var(--color-warning)", /* amber tone */
          foreground: "var(--color-warning-foreground)", /* rich dark brown */
        },
        error: {
          DEFAULT: "var(--color-error)", /* muted red-brown */
          foreground: "var(--color-error-foreground)", /* warm off-white */
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
        caption: ['Source Sans Pro', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 2px 0 rgba(193, 120, 23, 0.1)',
        'warm': '0 1px 3px 0 rgba(193, 120, 23, 0.1), 0 1px 2px 0 rgba(193, 120, 23, 0.06)',
        'warm-md': '0 4px 6px -1px rgba(193, 120, 23, 0.1), 0 2px 4px -1px rgba(193, 120, 23, 0.06)',
        'warm-lg': '0 10px 15px -3px rgba(193, 120, 23, 0.1), 0 4px 6px -2px rgba(193, 120, 23, 0.05)',
        'warm-xl': '0 20px 25px -5px rgba(193, 120, 23, 0.1), 0 10px 10px -5px rgba(193, 120, 23, 0.04)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "spring": "spring 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "spring": {
          "0%": { transform: "scale(0.9)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
      transitionTimingFunction: {
        'cultural': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}