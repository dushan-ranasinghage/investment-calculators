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
          800: 'rgb(var(--surface-800-rgb) / <alpha-value>)',
          700: 'rgb(var(--surface-700-rgb) / <alpha-value>)',
          600: 'rgb(var(--surface-600-rgb) / <alpha-value>)',
        },
        accent: {
          purple: 'rgb(var(--accent-purple-rgb) / <alpha-value>)',
          'purple-light': 'rgb(var(--accent-purple-light-rgb) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}

export default config
