import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-inter'
})

export const metadata = {
  title: 'Fahrplan | kitmatheinfo.de',
  description: 'O-Phasen Termine: Das Wann und Wo',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦆</text></svg>'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
