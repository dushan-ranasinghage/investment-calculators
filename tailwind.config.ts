import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          800: '#1e1b2e',
          700: '#252236',
          600: '#2d2a3e',
        },
        accent: {
          purple: '#8b5cf6',
          'purple-light': '#a78bfa',
        },
      },
    },
  },
  plugins: [],
}
export default config
