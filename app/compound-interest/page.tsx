import Link from 'next/link'

export default function CompoundInterestPage() {
  return (
    <div>
      <header className='mb-5'>
        <h1 className='text-xl font-bold text-white'>Compound Interest Calculator</h1>
        <p className='text-slate-400 text-sm mt-0.5'>Coming soon</p>
      </header>
      <div className='rounded-xl bg-surface-800/80 border border-surface-600 p-8 text-center text-slate-400'>
        <p>This calculator is not built yet. Use the DCA calculator in the meantime.</p>
        <Link
          href='/dca'
          className='mt-4 inline-flex rounded-lg bg-accent-purple px-4 py-2 text-sm font-medium text-white hover:bg-accent-purple-light'
        >
          Open DCA Calculator
        </Link>
      </div>
    </div>
  )
}
