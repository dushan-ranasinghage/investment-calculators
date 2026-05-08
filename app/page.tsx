import Link from 'next/link'

const calculators = [
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

const highlights = [
  'Fast and clean projections',
  'Charts for growth visibility',
  'Built to add more calculators quickly',
]

export default function HomePage() {
  return (
    <div className='space-y-7'>
      <section className='rounded-2xl border border-surface-600 bg-surface-800/90 p-7 sm:p-9'>
        <span className='inline-flex items-center rounded-full border border-surface-600 bg-surface-700/80 px-3 py-1 text-xs font-medium text-slate-300'>
          Modern investment toolkit
        </span>
        <h1 className='mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl'>
          Investment calculators for every strategy
        </h1>
        <p className='mt-3 max-w-2xl text-slate-300'>
          Start with DCA, compare scenarios, and expand to compound interest, retirement planning, and more.
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
            className='rounded-lg border border-surface-600 bg-surface-700/80 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-surface-700'
          >
            View Compound Interest
          </Link>
        </div>
      </section>

      <section className='grid gap-3 sm:grid-cols-3'>
        {highlights.map((item) => (
          <div key={item} className='rounded-xl border border-surface-600 bg-surface-800/75 p-4 text-sm text-slate-300'>
            {item}
          </div>
        ))}
      </section>

      <section>
        <h2 className='text-xl font-semibold text-white'>Calculator Library</h2>
        <p className='mt-1 text-sm text-slate-400'>Choose a calculator type to begin.</p>

        <div className='mt-4 grid gap-4 sm:grid-cols-2'>
          {calculators.map((item) => {
            const isComingSoon = item.href === '#'
            return (
              <div
                key={item.title}
                className='rounded-xl border border-surface-600 bg-surface-800/78 p-5 shadow-sm transition-colors hover:bg-surface-800/90'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-base font-semibold text-white'>{item.title}</h3>
                  <span className='rounded-full border border-surface-600 bg-surface-700/70 px-2.5 py-1 text-xs font-medium text-slate-300'>
                    {item.status}
                  </span>
                </div>
                <p className='text-sm leading-relaxed text-slate-400'>{item.description}</p>
                {isComingSoon ? (
                  <span className='mt-4 inline-block text-sm font-medium text-slate-500'>Coming soon</span>
                ) : (
                  <Link href={item.href} className='mt-4 inline-flex items-center text-sm font-medium text-accent-purple'>
                    Open calculator
                    <span className='ml-1'>-&gt;</span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <footer className='rounded-2xl border border-surface-600 bg-surface-800/85 p-6'>
        <div className='grid gap-6 sm:grid-cols-3'>
          <div>
            <h3 className='text-base font-semibold text-white'>Investment Calculators</h3>
            <p className='mt-2 text-sm text-slate-400'>
              A growing set of calculators for planning and comparing investing strategies.
            </p>
          </div>
          <div>
            <h4 className='text-sm font-semibold text-slate-200'>Quick Links</h4>
            <div className='mt-2 space-y-2 text-sm'>
              <Link href='/dca' className='block text-slate-400 hover:text-slate-200'>
                DCA Calculator
              </Link>
              <Link href='/compound-interest' className='block text-slate-400 hover:text-slate-200'>
                Compound Interest
              </Link>
            </div>
          </div>
          <div>
            <h4 className='text-sm font-semibold text-slate-200'>Disclaimer</h4>
            <p className='mt-2 text-sm text-slate-400'>
              Calculations are estimates for planning only, not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
