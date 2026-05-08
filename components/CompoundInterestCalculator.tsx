'use client'

import Link from 'next/link'
import { useCallback, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  calculateCompoundInterest,
  COMPOUNDING_FREQUENCY_LABELS,
  CONTRIBUTION_FREQUENCY_LABELS,
  CONTRIBUTION_TIMING_LABELS,
  formatCurrency,
  formatPercent,
  type CompoundInterestParams,
  type CompoundingFrequency,
  type ContributionFrequency,
  type ContributionTiming,
} from '@/lib/compoundInterest'

const DEFAULT_PARAMS: CompoundInterestParams = {
  principal: 10000,
  contribution: 500,
  contributionFrequency: 'monthly',
  annualRatePercent: 10,
  years: 10,
  compoundingFrequency: 'monthly',
  contributionTiming: 'end_of_period',
}

const CONTRIBUTION_FREQUENCY_OPTIONS: { value: ContributionFrequency; label: string }[] = [
  { value: 'weekly', label: CONTRIBUTION_FREQUENCY_LABELS.weekly },
  { value: 'biweekly', label: CONTRIBUTION_FREQUENCY_LABELS.biweekly },
  { value: 'monthly', label: CONTRIBUTION_FREQUENCY_LABELS.monthly },
  { value: 'quarterly', label: CONTRIBUTION_FREQUENCY_LABELS.quarterly },
  { value: 'yearly', label: CONTRIBUTION_FREQUENCY_LABELS.yearly },
]

const COMPOUNDING_FREQUENCY_OPTIONS: { value: CompoundingFrequency; label: string }[] = [
  { value: 'annually', label: COMPOUNDING_FREQUENCY_LABELS.annually },
  { value: 'semiannually', label: COMPOUNDING_FREQUENCY_LABELS.semiannually },
  { value: 'quarterly', label: COMPOUNDING_FREQUENCY_LABELS.quarterly },
  { value: 'monthly', label: COMPOUNDING_FREQUENCY_LABELS.monthly },
  { value: 'daily', label: COMPOUNDING_FREQUENCY_LABELS.daily },
]

const CONTRIBUTION_TIMING_OPTIONS: { value: ContributionTiming; label: string }[] = [
  { value: 'end_of_period', label: CONTRIBUTION_TIMING_LABELS.end_of_period },
  { value: 'beginning_of_period', label: CONTRIBUTION_TIMING_LABELS.beginning_of_period },
]

function InfoIcon({ title }: { title: string }) {
  return (
    <span
      className='inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-surface-600 text-xs text-slate-400'
      title={title}
    >
      i
    </span>
  )
}

const currentYear = new Date().getFullYear()

export default function CompoundInterestCalculator() {
  const [params, setParams] = useState<CompoundInterestParams>(DEFAULT_PARAMS)
  const [result, setResult] = useState<ReturnType<typeof calculateCompoundInterest> | null>(null)
  const [chartShowActualYears, setChartShowActualYears] = useState(false)

  const handleCalculate = useCallback(() => {
    setResult(calculateCompoundInterest(params))
  }, [params])

  const handleReset = useCallback(() => {
    setParams(DEFAULT_PARAMS)
    setResult(null)
  }, [])

  return (
    <div className='space-y-4'>
      <header className='space-y-1'>
        <p className='text-xs font-medium uppercase tracking-[0.2em] text-slate-400'>Investment Planner</p>
        <h1 className='text-2xl font-bold text-white sm:text-3xl'>Compound Interest Calculator</h1>
        <p className='text-sm text-slate-300'>
          Growth engine for precise compounding math with frequency and contribution timing controls.
        </p>
        <div className='flex flex-wrap gap-2 pt-1'>
          <span className='rounded-full border border-surface-600/80 bg-surface-700/60 px-2.5 py-1 text-xs text-slate-300'>Lump sum forecasting</span>
          <span className='rounded-full border border-surface-600/80 bg-surface-700/60 px-2.5 py-1 text-xs text-slate-300'>Rate sensitivity</span>
          <span className='rounded-full border border-surface-600/80 bg-surface-700/60 px-2.5 py-1 text-xs text-slate-300'>Timing assumptions</span>
        </div>
        <p className='text-xs text-slate-400'>
          Need phase-based contribution strategy?{' '}
          <Link href='/dca' className='text-accent-purple-light hover:text-accent-purple'>
            Open DCA Calculator
          </Link>
          .
        </p>
      </header>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
        <div className='glass-card p-4 sm:p-5'>
          <h2 className='text-base font-semibold text-white'>Enter Your Parameters</h2>
          <p className='mt-0.5 mb-4 text-sm text-slate-400'>Configure your compound interest scenario.</p>

          <div className='space-y-3'>
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-slate-300'>
                Initial Investment ($)
                <InfoIcon title='Your lump sum amount invested at the start' />
              </label>
              <input
                type='number'
                min={0}
                step={100}
                value={params.principal}
                onChange={(e) => setParams((p) => ({ ...p, principal: Number(e.target.value) || 0 }))}
                className='field-input'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-slate-300'>
                Recurring Contribution ($)
                <InfoIcon title='Amount added every contribution period' />
              </label>
              <input
                type='number'
                min={0}
                step={1}
                value={params.contribution}
                onChange={(e) => setParams((p) => ({ ...p, contribution: Number(e.target.value) || 0 }))}
                className='field-input'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-slate-300'>
                Contribution Frequency
                <InfoIcon title='How often recurring contributions are made' />
              </label>
              <select
                value={params.contributionFrequency}
                onChange={(e) => setParams((p) => ({ ...p, contributionFrequency: e.target.value as ContributionFrequency }))}
                className='field-input'
              >
                {CONTRIBUTION_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-slate-300'>
                Compounding Frequency
                <InfoIcon title='How often returns are compounded' />
              </label>
              <select
                value={params.compoundingFrequency}
                onChange={(e) => setParams((p) => ({ ...p, compoundingFrequency: e.target.value as CompoundingFrequency }))}
                className='field-input'
              >
                {COMPOUNDING_FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-slate-300'>
                Annual Return (%)
                <InfoIcon title='Expected yearly return rate' />
              </label>
              <input
                type='number'
                min={0}
                step={0.1}
                value={params.annualRatePercent}
                onChange={(e) => setParams((p) => ({ ...p, annualRatePercent: Number(e.target.value) || 0 }))}
                className='field-input'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-slate-300'>
                Duration (Years)
                <InfoIcon title='Total investment timeline' />
              </label>
              <input
                type='number'
                min={1}
                max={50}
                step={1}
                value={params.years}
                onChange={(e) => setParams((p) => ({ ...p, years: Number(e.target.value) || 1 }))}
                className='field-input'
              />
            </div>

            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-slate-300'>
                Contribution Timing
                <InfoIcon title='Choose whether each contribution is added at the start or end of each period' />
              </label>
              <select
                value={params.contributionTiming}
                onChange={(e) => setParams((p) => ({ ...p, contributionTiming: e.target.value as ContributionTiming }))}
                className='field-input'
              >
                {CONTRIBUTION_TIMING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='mt-4 flex gap-2'>
            <button onClick={handleCalculate} className='primary-btn'>
              Calculate
            </button>
            <button onClick={handleReset} className='secondary-btn'>
              Reset
            </button>
          </div>
        </div>

        <div className='glass-card p-4 sm:p-5'>
          <h2 className='text-base font-semibold text-white'>Results</h2>
          <p className='mt-0.5 mb-4 text-sm text-slate-400'>Your projected compound growth.</p>

          {result ? (
            <div className='space-y-3'>
              <p className='text-sm leading-relaxed text-slate-300'>
                With an initial <strong className='text-emerald-400'>{formatCurrency(params.principal)}</strong>, recurring{' '}
                <strong className='text-emerald-400'>{formatCurrency(params.contribution)}</strong> contributions (
                <strong className='text-emerald-400'>{CONTRIBUTION_FREQUENCY_LABELS[params.contributionFrequency].toLowerCase()}</strong>), and{' '}
                <strong className='text-emerald-400'>{params.annualRatePercent}%</strong> annual return for{' '}
                <strong className='text-emerald-400'>{params.years} years</strong>, your total invested{' '}
                <strong className='text-emerald-400'>{formatCurrency(result.totalInvested)}</strong> grows to{' '}
                <strong className='text-emerald-400'>{formatCurrency(result.finalPortfolioValue)}</strong>.
              </p>

              <div className='rounded-xl border border-accent-purple/40 bg-accent-purple/15 p-3'>
                <p className='text-xs uppercase tracking-wide text-slate-300'>Final Portfolio Value</p>
                <div className='text-2xl font-bold text-accent-purple-light'>{formatCurrency(result.finalPortfolioValue)}</div>
              </div>

              <div className='grid grid-cols-2 gap-3 rounded-xl border border-surface-600/70 bg-surface-700/40 p-3'>
                <div>
                  <p className='text-sm text-slate-500'>Initial investment</p>
                  <p className='font-medium text-white'>{formatCurrency(params.principal)}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-500'>Total contributions</p>
                  <p className='font-medium text-white'>{formatCurrency(result.totalContributions)}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-500'>Total invested</p>
                  <p className='font-medium text-white'>{formatCurrency(result.totalInvested)}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-500'>Total returns</p>
                  <p className={`font-medium ${result.totalReturns >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {formatCurrency(result.totalReturns)}
                  </p>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3 rounded-xl border border-surface-600/70 bg-surface-700/40 p-3'>
                <div>
                  <p className='text-sm text-slate-500'>Lump sum growth</p>
                  <p className='font-medium text-white'>{formatCurrency(result.lumpSumFutureValue)}</p>
                </div>
                <div>
                  <p className='text-sm text-slate-500'>Recurring growth</p>
                  <p className='font-medium text-white'>{formatCurrency(result.recurringFutureValue)}</p>
                </div>
              </div>

              <div className='soft-panel p-3'>
                <p className='mb-1 text-sm text-slate-500'>Return on investment (vs total invested)</p>
                <div className='flex items-center gap-2'>
                  <div className='h-2 flex-1 overflow-hidden rounded-full bg-surface-700'>
                    <div
                      className='h-full rounded-full bg-accent-purple'
                      style={{ width: `${Math.min(100, Math.max(0, result.returnOnInvestmentPercent))}%` }}
                    />
                  </div>
                  <span className='whitespace-nowrap text-sm font-medium text-white'>
                    {formatPercent(result.returnOnInvestmentPercent)}
                  </span>
                </div>
              </div>

              <div className='space-y-2 soft-panel p-3'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-xs text-slate-500'>X-axis</span>
                  <div className='flex rounded-lg border border-surface-600/70 bg-surface-700 p-0.5'>
                    <button
                      type='button'
                      onClick={() => setChartShowActualYears(false)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        !chartShowActualYears ? 'bg-accent-purple text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      From now (Year 0)
                    </button>
                    <button
                      type='button'
                      onClick={() => setChartShowActualYears(true)}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        chartShowActualYears ? 'bg-accent-purple text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Actual years ({currentYear}...)
                    </button>
                  </div>
                </div>
                <div className='h-48'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={result.chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray='3 3' stroke='#334155' />
                      <XAxis
                        dataKey='year'
                        tickFormatter={(value: number) => (chartShowActualYears ? `${currentYear + value}` : `Year ${value}`)}
                        stroke='#94a3b8'
                        fontSize={12}
                      />
                      <YAxis tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`} stroke='#94a3b8' fontSize={12} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1e1b2e', border: '1px solid #2d2a3e' }}
                        labelFormatter={(value: number) => (chartShowActualYears ? `${currentYear + value}` : `Year ${value}`)}
                        formatter={(value: number, name: string) => [
                          formatCurrency(value),
                          name === 'portfolioValue' ? 'Portfolio Value' : 'Total Invested',
                        ]}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12 }}
                        formatter={(value: string) => (value === 'portfolioValue' ? 'Portfolio Value' : 'Total Invested')}
                      />
                      <Line type='monotone' dataKey='portfolioValue' stroke='#22c55e' strokeWidth={2} dot={false} name='portfolioValue' />
                      <Line type='monotone' dataKey='totalInvested' stroke='#3b82f6' strokeWidth={2} dot={false} name='totalInvested' />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-slate-500'>
              <svg className='mb-3 h-10 w-10 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
              <p>Enter parameters and click Calculate to see your projection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
