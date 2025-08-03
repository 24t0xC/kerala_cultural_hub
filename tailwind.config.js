/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // muted earth tone
        input: 'var(--color-input)', // warm neutral
        ring: 'var(--color-ring)', // warm laterite brown
        background: 'var(--color-background)', // soft off-white
        foreground: 'var(--color-foreground)', // rich dark brown
        primary: {
          DEFAULT: 'var(--color-primary)', // warm laterite brown
          foreground: 'var(--color-primary-foreground)' // soft off-white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // deep forest green
          foreground: 'var(--color-secondary-foreground)' // soft off-white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // clear red
          foreground: 'var(--color-destructive-foreground)' // soft off-white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // warm neutral
          foreground: 'var(--color-muted-foreground)' // muted brown
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // golden temple brass
          foreground: 'var(--color-accent-foreground)' // rich dark brown
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // soft off-white
          foreground: 'var(--color-popover-foreground)' // rich dark brown
        },
        card: {
          DEFAULT: 'var(--color-card)', // soft off-white
          foreground: 'var(--color-card-foreground)' // rich dark brown
        },
        success: {
          DEFAULT: 'var(--color-success)', // standard success green
          foreground: 'var(--color-success-foreground)' // soft off-white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // warm amber
          foreground: 'var(--color-warning-foreground)' // rich dark brown
        },
        error: {
          DEFAULT: 'var(--color-error)', // clear red
          foreground: 'var(--color-error-foreground)' // soft off-white
        }
      },
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'caption': ['Source Sans Pro', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      animation: {
        'pulse-gentle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 200ms cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.4, 0, 0.2, 1)'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ],
}