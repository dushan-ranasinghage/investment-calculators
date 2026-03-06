'use client'

import { useState, useCallback } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import {
  calculateDca,
  formatCurrency,
  formatPercent,
  type DcaParams,
  type Frequency,
  FREQUENCY_LABELS,
} from '@/lib/dca'

const DEFAULT_PARAMS: DcaParams = {
  investmentAmount: 500,
  frequency: 'weekly',
  durationYears: 10,
  annualReturnPercent: 10,
  startingBalance: 0,
}

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
]

function InfoIcon({ title }: { title: string }) {
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-surface-600 text-xs text-slate-400 cursor-help"
      title={title}
    >
      i
    </span>
  )
}

export default function DcaCalculator() {
  const [params, setParams] = useState<DcaParams>(DEFAULT_PARAMS)
  const [result, setResult] = useState<ReturnType<typeof calculateDca> | null>(null)

  const handleCalculate = useCallback(() => {
    setResult(calculateDca(params))
  }, [params])

  const handleReset = useCallback(() => {
    setParams(DEFAULT_PARAMS)
    setResult(null)
  }, [])

  const freqLabel = FREQUENCY_LABELS[params.frequency].toLowerCase()

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-xl font-bold text-white">DCA Calculator</h1>
        <p className="text-slate-400 text-sm mt-0.5">Dollar-cost averaging projection</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Parameters */}
        <div className="rounded-xl bg-surface-800/80 border border-surface-600 p-5 shadow-lg">
          <h2 className="text-base font-semibold text-white">Enter Your Parameters</h2>
          <p className="text-slate-400 text-sm mt-0.5 mb-4">Configure your DCA strategy.</p>

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                Investment Amount ($)
                <InfoIcon title="Amount invested each period" />
              </label>
              <input
                type="number"
                min={1}
                step={1}
                value={params.investmentAmount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParams((p) => ({ ...p, investmentAmount: Number(e.target.value) || 0 }))
                }
                className="mt-2 w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2.5 text-white placeholder-slate-500 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                Investment Frequency
                <InfoIcon title="How often you invest" />
              </label>
              <select
                value={params.frequency}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setParams((p) => ({ ...p, frequency: e.target.value as Frequency }))
                }
                className="mt-2 w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2.5 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
              >
                {FREQUENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                Duration (Years)
                <InfoIcon title="Number of years to invest" />
              </label>
              <input
                type="number"
                min={1}
                max={50}
                step={1}
                value={params.durationYears}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParams((p) => ({ ...p, durationYears: Number(e.target.value) || 0 }))
                }
                className="mt-2 w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2.5 text-white placeholder-slate-500 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                Annual Return (%)
                <InfoIcon title="Expected annualized return" />
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={params.annualReturnPercent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParams((p) => ({ ...p, annualReturnPercent: Number(e.target.value) || 0 }))
                }
                className="mt-2 w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2.5 text-white placeholder-slate-500 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                Starting Balance ($)
                <InfoIcon title="Existing balance at start" />
              </label>
              <input
                type="number"
                min={0}
                step={100}
                value={params.startingBalance}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setParams((p) => ({ ...p, startingBalance: Number(e.target.value) || 0 }))
                }
                className="mt-2 w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2.5 text-white placeholder-slate-500 focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              onClick={handleCalculate}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-purple px-5 py-2.5 font-medium text-white hover:bg-accent-purple-light transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-surface-600 px-4 py-2.5 font-medium text-slate-300 hover:bg-surface-700 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        {/* Right: Results */}
        <div className="rounded-xl bg-surface-800/80 border border-surface-600 p-5 shadow-lg">
          <h2 className="text-base font-semibold text-white">Results</h2>
          <p className="text-slate-400 text-sm mt-0.5 mb-4">Your DCA projection.</p>

          {result ? (
            <div className="space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed">
                Investing <strong className="text-emerald-400">${params.investmentAmount.toLocaleString()}</strong> every{' '}
                <strong className="text-emerald-400">{freqLabel}</strong> for{' '}
                <strong className="text-emerald-400">{params.durationYears} years</strong> at{' '}
                <strong className="text-emerald-400">{params.annualReturnPercent}%</strong> annual return grows your{' '}
                <strong className="text-emerald-400">{formatCurrency(result.totalContributions)}</strong> in contributions to{' '}
                <strong className="text-emerald-400">{formatCurrency(result.finalPortfolioValue)}</strong>.
              </p>

              <div className="text-xl font-bold text-accent-purple">
                {formatCurrency(result.finalPortfolioValue)}
              </div>
              <p className="text-xs text-slate-500 -mt-1">Final Portfolio Value</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500 text-sm">Total Contributions</p>
                  <p className="text-white font-medium">{formatCurrency(result.totalContributions)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total Returns</p>
                  <p className="text-white font-medium">{formatCurrency(result.totalReturns)}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-sm mb-1">Return on Investment</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-6 rounded-full bg-surface-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-purple"
                      style={{
                        width: `${Math.min(100, result.returnOnInvestmentPercent)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white whitespace-nowrap">
                    {formatPercent(result.returnOnInvestmentPercent)}
                  </span>
                </div>
              </div>

              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                      dataKey="year"
                      tickFormatter={(v: number) => `Year ${v}`}
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis
                      tickFormatter={(v: number) => `$${v / 1000}k`}
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e1b2e', border: '1px solid #2d2a3e' }}
                      labelFormatter={(v: number) => `Year ${v}`}
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === 'portfolioValue' ? 'Portfolio Value' : 'Total Contributions',
                      ]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12 }}
                      formatter={(value: string) => (value === 'portfolioValue' ? 'Portfolio Value' : 'Total Contributions')}
                    />
                    <Line
                      type="monotone"
                      dataKey="portfolioValue"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                      name="portfolioValue"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalContributions"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                      name="totalContributions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-lg bg-surface-700/80 p-3 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">DCA Final Value</span>
                  <span className="text-white font-medium">{formatCurrency(result.finalPortfolioValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Lump Sum Final Value</span>
                  <span className="text-white font-medium">{formatCurrency(result.lumpSumFinalValue)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-surface-600">
                  <span className="text-slate-400">Lump Sum Advantage</span>
                  <span className="font-medium text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                    +{formatCurrency(result.lumpSumAdvantage)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <svg className="h-10 w-10 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Enter parameters and click Calculate to see your projection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
