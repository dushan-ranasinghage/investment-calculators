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
    status: 'Live',
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
    <div className='space-y-8'>
      <section className='glass-card relative overflow-hidden p-7 sm:p-10'>
        <div className='pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent-purple/25 blur-3xl' />
        <div className='pointer-events-none absolute -bottom-20 left-0 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl' />

        <span className='inline-flex items-center rounded-full border border-surface-600/70 bg-surface-700/75 px-3 py-1 text-xs font-medium text-slate-200'>
          Smarter investing, cleaner insights
        </span>
        <h1 className='mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-5xl'>
          Modern calculators for long-term wealth planning
        </h1>
        <p className='mt-4 max-w-2xl text-slate-300'>
          Plan recurring investments, compare scenarios, and make faster decisions with a cleaner, data-first interface.
        </p>
        <div className='mt-7 flex flex-wrap gap-3'>
          <Link
            href='/dca'
            className='primary-btn'
          >
            Open DCA Calculator
          </Link>
          <Link
            href='/compound-interest'
            className='secondary-btn'
          >
            View Compound Interest
          </Link>
        </div>

        <div className='mt-8 grid gap-3 sm:grid-cols-3'>
          <div className='soft-panel p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-400'>Focus</p>
            <p className='mt-1 text-sm font-medium text-white'>Practical wealth projections</p>
          </div>
          <div className='soft-panel p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-400'>Experience</p>
            <p className='mt-1 text-sm font-medium text-white'>Less clutter, stronger hierarchy</p>
          </div>
          <div className='soft-panel p-4'>
            <p className='text-xs uppercase tracking-wide text-slate-400'>Roadmap</p>
            <p className='mt-1 text-sm font-medium text-white'>More calculators coming soon</p>
          </div>
        </div>
      </section>

      <section className='grid gap-3 sm:grid-cols-3'>
        {highlights.map((item) => (
          <div key={item} className='soft-panel p-4 text-sm text-slate-300'>
            {item}
          </div>
        ))}
      </section>

      <section>
        <h2 className='text-2xl font-semibold text-white'>Calculator Library</h2>
        <p className='mt-1 text-sm text-slate-400'>Choose the tool you need and jump straight in.</p>

        <div className='mt-4 grid gap-4 sm:grid-cols-2'>
          {calculators.map((item) => {
            const isComingSoon = item.href === '#'
            return (
              <div
                key={item.title}
                className='glass-card p-5 transition duration-200 hover:-translate-y-0.5 hover:border-surface-600'
              >
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='text-base font-semibold text-white'>{item.title}</h3>
                  <span className='rounded-full border border-surface-600/80 bg-surface-700/70 px-2.5 py-1 text-xs font-medium text-slate-300'>
                    {item.status}
                  </span>
                </div>
                <p className='text-sm leading-relaxed text-slate-300'>{item.description}</p>
                {isComingSoon ? (
                  <span className='mt-4 inline-block text-sm font-medium text-slate-500'>Coming soon</span>
                ) : (
                  <Link href={item.href} className='mt-4 inline-flex items-center text-sm font-medium text-accent-purple-light hover:text-accent-purple'>
                    Open calculator
                    <span className='ml-1'>-&gt;</span>
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
