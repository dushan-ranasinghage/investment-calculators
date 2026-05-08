import Link from 'next/link'

const calculators = [
  {
    title: 'DCA Calculator',
    description: 'Plan contribution strategy across phases, maturity, and withdrawal scenarios.',
    href: '/dca',
    status: 'Live',
  },
  {
    title: 'Compound Interest',
    description: 'Analyze growth math using compounding frequency and contribution timing assumptions.',
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

const faqs = [
  {
    question: "What is a DCA calculator?",
    answer: "A DCA (Dollar Cost Averaging) calculator helps you plan a recurring investment strategy by analyzing contributions across different market phases and time horizons. It shows you the potential outcomes of consistent, periodic investing."
  },
  {
    question: "How does compound interest work?",
    answer: "Compound interest is interest earned on both your initial investment and the previously earned interest. Our calculator lets you visualize how your money grows exponentially over time with different compounding frequencies."
  },
  {
    question: "Are these calculators accurate?",
    answer: "Our calculators are built with accurate financial formulas. However, they're designed for planning and educational purposes only, not as financial advice. Always consult a financial advisor for investment decisions."
  },
  {
    question: "Do I need to create an account?",
    answer: "No! All our calculators are completely free and require no account creation or sign-up. Just visit, enter your numbers, and see the results instantly."
  },
  {
    question: "Can I use these calculators on mobile?",
    answer: "Yes, all our calculators are fully responsive and work great on mobile, tablet, and desktop devices. No downloads or installations needed."
  },
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
          Plan recurring investments, compare scenarios, and make faster decisions with a cleaner, data-first interface. Free investment calculators for DCA, compound interest, and more.
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

      <section className='py-8'>
        <h2 className='text-2xl font-semibold text-white'>Frequently Asked Questions</h2>
        <p className='mt-1 text-sm text-slate-400'>Everything you need to know about our investment calculators.</p>

        <div className='mt-6 space-y-4'>
          {faqs.map((faq, idx) => (
            <details key={idx} className='glass-card group cursor-pointer p-5'>
              <summary className='flex items-center justify-between font-medium text-white'>
                {faq.question}
                <span className='ml-3 text-lg transition group-open:rotate-180'>▼</span>
              </summary>
              <p className='mt-4 text-sm leading-relaxed text-slate-300'>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className='rounded-lg border border-surface-600/40 bg-surface-800/50 p-6 sm:p-8'>
        <h2 className='text-lg font-semibold text-white'>Disclaimer</h2>
        <p className='mt-3 text-sm text-slate-400'>
          These calculators are for educational and planning purposes only. They are not financial advice. Past performance does not guarantee future results. Please consult with a qualified financial advisor before making investment decisions.
        </p>
      </section>
    </div>
  )
}
