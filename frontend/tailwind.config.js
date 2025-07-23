/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        // Existing color system
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Notion-inspired colors (muted, pastel-like)
        notion: {
          // Light mode colors
          bg: {
            DEFAULT: '#ffffff',
            secondary: '#fbfbfa',
            hover: '#f7f6f3',
            card: '#ffffff',
            overlay: 'rgba(255, 255, 255, 0.8)',
          },
          text: {
            DEFAULT: '#37352f',
            secondary: '#787774',
            tertiary: '#9b9a97',
            placeholder: '#e1e1e0',
          },
          border: {
            DEFAULT: '#e9e9e8',
            light: '#f1f1f0',
            dark: '#d3d3d2',
          },
          
          // Dark mode colors
          dark: {
            bg: {
              DEFAULT: '#191919',
              secondary: '#202020',
              hover: '#2a2a2a',
              card: '#1e1e1e',
              overlay: 'rgba(25, 25, 25, 0.8)',
            },
            text: {
              DEFAULT: 'rgba(255, 255, 255, 0.9)',
              secondary: 'rgba(255, 255, 255, 0.6)',
              tertiary: 'rgba(255, 255, 255, 0.4)',
              placeholder: 'rgba(255, 255, 255, 0.15)',
            },
            border: {
              DEFAULT: 'rgba(255, 255, 255, 0.055)',
              light: 'rgba(255, 255, 255, 0.082)',
              dark: 'rgba(255, 255, 255, 0.027)',
            },
          },
          
          // Muted accent colors - Light mode
          blue: {
            DEFAULT: '#529cca',
            light: '#e6f3f7',
            dark: '#2383e2',
            muted: '#a5d0e7',
          },
          purple: {
            DEFAULT: '#a47bb3',
            light: '#f3f0f8',
            dark: '#9065b0',
            muted: '#d4c5df',
          },
          pink: {
            DEFAULT: '#d6709f',
            light: '#faf1f5',
            dark: '#c14c8a',
            muted: '#e8b6d1',
          },
          red: {
            DEFAULT: '#e07c7c',
            light: '#fef1f1',
            dark: '#d44c47',
            muted: '#f0b5b3',
          },
          orange: {
            DEFAULT: '#e79a57',
            light: '#fef8f1',
            dark: '#cc5d2b',
            muted: '#f3d19e',
          },
          yellow: {
            DEFAULT: '#dfab01',
            light: '#fef9ec',
            dark: '#c09200',
            muted: '#f0d86e',
          },
          green: {
            DEFAULT: '#6ba085',
            light: '#f1f8f4',
            dark: '#448361',
            muted: '#afd4bf',
          },
          gray: {
            DEFAULT: '#9b9a97',
            light: '#f7f6f4',
            dark: '#787774',
            muted: '#d9d9d8',
          },
          
          // Dark mode accent colors
          darkAccent: {
            blue: '#6db3d0',
            purple: '#b794c6',
            pink: '#e187b8',
            red: '#ff9999',
            orange: '#ffa344',
            yellow: '#ffd644',
            green: '#7bc796',
            gray: '#a1a1a1',
          },
        },
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        notion: "3px",
      },
      
      boxShadow: {
        'notion-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'notion-md': '0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'notion-lg': '0 8px 16px -4px rgba(0, 0, 0, 0.08), 0 4px 8px -4px rgba(0, 0, 0, 0.06)',
        'notion-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'notion-glow': '0 0 0 1px rgba(35, 131, 226, 0.14), 0 0 0 4px rgba(35, 131, 226, 0.05)',
        'notion-dark-sm': '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
        'notion-dark-md': '0 4px 8px 0 rgba(0, 0, 0, 0.3), 0 2px 4px 0 rgba(0, 0, 0, 0.2)',
        'notion-dark-lg': '0 8px 16px 0 rgba(0, 0, 0, 0.4), 0 4px 8px 0 rgba(0, 0, 0, 0.3)',
      },
      
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "notion-shimmer": {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        "notion-fade": {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        "notion-slide-up": {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        "notion-bounce": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        "notion-pulse": {
          '0%': { opacity: '1' },
          '50%': { opacity: '0.5' },
          '100%': { opacity: '1' },
        },
        "notion-scale": {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "notion-shimmer": "notion-shimmer 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "notion-fade": "notion-fade 0.3s ease-out",
        "notion-slide-up": "notion-slide-up 0.3s ease-out",
        "notion-bounce": "notion-bounce 0.5s ease-in-out",
        "notion-pulse": "notion-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "notion-scale": "notion-scale 0.15s ease-out",
      },
      
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Apple Color Emoji", "Arial", "sans-serif", "Segoe UI Emoji", "Segoe UI Symbol"],
        notion: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica", "Apple Color Emoji", "Arial", "sans-serif", "Segoe UI Emoji", "Segoe UI Symbol"],
      },
      
      fontSize: {
        'notion-xs': ['11px', '16px'],
        'notion-sm': ['14px', '20px'],
        'notion-base': ['16px', '24px'],
        'notion-lg': ['18px', '28px'],
        'notion-xl': ['20px', '28px'],
        'notion-2xl': ['24px', '32px'],
        'notion-3xl': ['30px', '36px'],
      },
      
      transitionDuration: {
        'notion': '300ms',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}