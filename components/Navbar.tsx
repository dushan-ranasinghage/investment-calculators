'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'DCA' },
  { href: '/compound-interest', label: 'Compound Interest' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-600 bg-surface-800/95 backdrop-blur supports-[backdrop-filter]:bg-surface-800/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-semibold tracking-tight hover:text-accent-purple-light transition-colors"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-purple text-white text-sm">
            $
          </span>
          <span>Investment Calculators</span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-surface-700'
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-accent-purple" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
