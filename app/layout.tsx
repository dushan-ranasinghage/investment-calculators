import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import Navbar from '@/components/Navbar'
import { baseMetadata, viewport } from '@/lib/metadata'
import { generateWebApplicationSchema } from '@/lib/seo-utils'

export const metadata: Metadata = baseMetadata
export { viewport }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const year = new Date().getFullYear()

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebApplicationSchema('https://investmentcalculators.dev'))
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
        <footer className="mt-6 border-t border-surface-600/60 bg-surface-800/35">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-slate-300">Investment Calculators</p>
            <nav className="flex flex-wrap items-center gap-4">
              <Link href="/dca" className="transition hover:text-white">DCA</Link>
              <Link href="/compound-interest" className="transition hover:text-white">Compound Interest</Link>
              <span className="text-slate-500">Planning only, not financial advice.</span>
            </nav>
            <p className="text-slate-500">© {year}</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
