/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0E17',
          raised: '#0D121F',
        },
        surface: {
          DEFAULT: '#121828',
          raised: '#171F33',
        },
        line: {
          DEFAULT: '#232C40',
          soft: '#1A2133',
        },
        fg: {
          DEFAULT: '#E9EDF6',
          muted: '#8D97AE',
          faint: '#59627A',
        },
        route: {
          gold: '#D4A857',
          teal: '#4FA3A1',
          terracotta: '#C15B3E',
          periwinkle: '#8098D6',
          sage: '#8FAE6B',
          plum: '#B583B0',
        },
        danger: '#E2604F',
      },
      fontFamily: {
        display: ['"Zen Kaku Gothic New"', '"Noto Sans JP"', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 12px 30px -12px rgba(0,0,0,0.55)',
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 6px 16px -8px rgba(0,0,0,0.5)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
        'dash': {
          to: { strokeDashoffset: '-24' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
        'dash': 'dash 1.2s linear infinite',
      },
    },
  },
  plugins: [],
};
