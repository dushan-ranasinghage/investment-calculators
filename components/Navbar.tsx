'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/dca', label: 'DCA' },
  { href: '/compound-interest', label: 'Compound Interest' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className='sticky top-0 z-50 border-b border-surface-600/60 bg-surface-800/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-surface-800/55'>
      <div className='mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6'>
        <Link
          href='/'
          className='group flex items-center gap-3 text-white transition-colors'
        >
          <span className='flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-purple-light text-sm font-bold text-white shadow-[0_8px_22px_rgb(139,92,246,0.45)]'>
            IC
          </span>
          <span className='hidden text-sm font-semibold tracking-tight text-slate-100 group-hover:text-white sm:inline'>
            Investment Calculators
          </span>
        </Link>
        <div className='flex items-center gap-1 rounded-xl border border-surface-600/70 bg-surface-700/35 p-1'>
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-surface-700/80 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-surface-700/50 hover:text-white'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
