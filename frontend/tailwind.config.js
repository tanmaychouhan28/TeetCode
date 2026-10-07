/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0D10',
          secondary: '#111419',
          surface: '#171A20',
          elevated: '#1D212A',
        },
        border: {
          DEFAULT: '#2A2F38',
          subtle: '#22262E',
          focus: '#4A5568',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#9CA3AF',
          muted: '#6B7280',
          accent: '#FFFFFF',
        },
        brand: {
          accent: '#FFFFFF',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Consolas', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '2px',
        md: '3px',
        lg: '4px',
      },
      boxShadow: {
        'crisp': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'crisp-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
