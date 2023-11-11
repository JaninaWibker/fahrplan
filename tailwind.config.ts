import type { Config } from 'tailwindcss'

type Theme = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: (path: string, defaultValue?: unknown) => any
}

const config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      sans: [
        'var(--font-inter)',
        'ui-sans-serif',
        'system-ui',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"'
      ]
    },
    extend: {
      minHeight: ({ theme }: Theme) => ({
        ...theme('spacing')
      }),
      maxHeight: ({ theme }: Theme) => ({
        ...theme('spacing')
      }),
      minWidth: ({ theme }: Theme) => ({
        ...theme('spacing')
      }),
      maxWidth: ({ theme }: Theme) => ({
        ...theme('spacing')
      })
    }
  },
  plugins: []
} satisfies Config

export default config
