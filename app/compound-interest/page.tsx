import Link from 'next/link'

export default function CompoundInterestPage() {
  return (
    <div className='space-y-5'>
      <header className='space-y-1'>
        <p className='text-xs font-medium uppercase tracking-[0.2em] text-slate-400'>In progress</p>
        <h1 className='text-2xl font-bold text-white sm:text-3xl'>Compound Interest Calculator</h1>
        <p className='text-sm text-slate-300'>A cleaner version is on the way.</p>
      </header>

      <div className='glass-card p-8 text-center text-slate-300'>
        <p className='mx-auto max-w-lg'>
          This calculator is not built yet. In the meantime, use the upgraded DCA calculator for recurring investment scenarios.
        </p>
        <Link
          href='/dca'
          className='primary-btn mt-5'
        >
          Open DCA Calculator
        </Link>
      </div>
    </div>
  )
}
