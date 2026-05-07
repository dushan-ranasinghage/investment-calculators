import Link from 'next/link'

const featuredCalculators = [
  {
    title: 'DCA Calculator',
    description: 'Plan recurring investments with advanced maturity scenarios and growth charts.',
    href: '/dca',
    status: 'Live',
  },
  {
    title: 'Compound Interest',
    description: 'Estimate how a one-time or recurring investment grows over time.',
    href: '/compound-interest',
    status: 'Soon',
  },
  {
    title: 'Retirement Planner',
    description: 'Model monthly savings, inflation, and retirement withdrawal targets.',
    href: '#',
    status: 'Planned',
  },
  {
    title: 'SIP vs Lump Sum',
    description: 'Compare periodic investing versus investing upfront across time horizons.',
    href: '#',
    status: 'Planned',
  },
]

export default function HomePage() {
  return (
    <div className='space-y-10'>
      <section className='rounded-2xl border border-surface-600 bg-gradient-to-br from-surface-800 via-surface-800 to-[#2a2450] p-8 sm:p-10'>
        <span className='inline-flex items-center rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-200'>
          Built for modern investors
        </span>
        <h1 className='mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl'>
          Investment Calculators for every strategy
        </h1>
        <p className='mt-4 max-w-2xl text-slate-300'>
          Explore calculators for DCA, compound growth, retirement planning, and portfolio comparisons.
          Start with the DCA calculator and expand your toolkit as new calculators are added.
        </p>
        <div className='mt-6 flex flex-wrap gap-3'>
          <Link
            href='/dca'
            className='rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-purple-light'
          >
            Open DCA Calculator
          </Link>
          <Link
            href='/compound-interest'
            className='rounded-lg border border-surface-600 bg-surface-700 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-surface-600'
          >
            View Compound Interest
          </Link>
        </div>
      </section>

      <section>
        <div className='mb-4 flex items-end justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-white'>Calculator Library</h2>
            <p className='mt-1 text-sm text-slate-400'>Choose a calculator type to begin.</p>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2'>
          {featuredCalculators.map((item) => {
            const isComingSoon = item.href == '#'
            return (
              <div
                key={item.title}
                className='group rounded-xl border border-surface-600 bg-surface-800/80 p-5 shadow-lg transition-colors hover:border-violet-400/40'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-base font-semibold text-white'>{item.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.status == 'Live'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.status == 'Soon'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-500/20 text-slate-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <p className='text-sm leading-relaxed text-slate-400'>{item.description}</p>
                {isComingSoon ? (
                  <span className='mt-4 inline-block text-sm font-medium text-slate-500'>Coming soon</span>
                ) : (
                  <Link
                    href={item.href}
                    className='mt-4 inline-flex items-center text-sm font-medium text-violet-300 transition-colors group-hover:text-violet-200'
                  >
                    Open calculator
                    <span className='ml-1'>→</span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
