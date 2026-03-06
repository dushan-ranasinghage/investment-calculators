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
  type AdvancedMode,
  FREQUENCY_LABELS,
} from '@/lib/dca'

const DEFAULT_PARAMS: DcaParams = {
  investmentAmount: 500,
  frequency: 'weekly',
  durationYears: 10,
  annualReturnPercent: 10,
  startingBalance: 0,
  advancedMode: 'none',
  maturityYears: 5,
  keepPercentToMature: 80,
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
  const isContributeThenMature = (params.advancedMode === 'contribute_then_mature') && (params.maturityYears ?? 0) > 0
  const isKeepPctToMature = (params.advancedMode === 'keep_pct_to_mature') && (params.maturityYears ?? 0) > 0 && (params.keepPercentToMature ?? 0) > 0

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

            {/* Advanced */}
            <div className="pt-3 border-t border-surface-600">
              <p className="text-sm font-medium text-slate-300 mb-2">Advanced</p>
              <label className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                Scenario
                <InfoIcon title="Contribute then mature: invest for X years, then let sit with no new contributions. Keep % to mature: after DCA, keep Y% of portfolio to grow for extra years." />
              </label>
              <select
                value={params.advancedMode ?? 'none'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setParams((p) => ({ ...p, advancedMode: e.target.value as AdvancedMode }))
                }
                className="w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2.5 text-white focus:border-accent-purple focus:outline-none focus:ring-1 focus:ring-accent-purple"
              >
                <option value="none">Standard (contribute entire duration)</option>
                <option value="contribute_then_mature">Contribute for X years, then let mature</option>
                <option value="keep_pct_to_mature">Keep % of final value to mature</option>
              </select>
              {(params.advancedMode === 'contribute_then_mature') && (
                <div className="mt-3">
                  <label className="text-sm text-slate-400">Maturity years (no new contributions after Duration)</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={params.maturityYears ?? 5}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setParams((p) => ({ ...p, maturityYears: Number(e.target.value) || 0 }))
                      }
                      className="mt-1 w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2 text-white"
                    />
                </div>
              )}
              {(params.advancedMode === 'keep_pct_to_mature') && (
                <>
                  <div className="mt-3">
                    <label className="text-sm text-slate-400">Keep % of final portfolio (Y)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={params.keepPercentToMature ?? 80}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setParams((p) => ({ ...p, keepPercentToMature: Number(e.target.value) || 100 }))
                      }
                      className="mt-1 w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2 text-white"
                    />
                  </div>
                  <div className="mt-2">
                    <label className="text-sm text-slate-400">Maturity years</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={params.maturityYears ?? 5}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setParams((p) => ({ ...p, maturityYears: Number(e.target.value) || 0 }))
                      }
                      className="mt-1 w-full rounded-lg bg-surface-700 border border-surface-600 px-4 py-2 text-white"
                    />
                  </div>
                </>
              )}
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
              {/* Standard: single summary */}
              {!isContributeThenMature && !isKeepPctToMature && (
                <p className="text-slate-300 text-sm leading-relaxed">
                  Investing <strong className="text-emerald-400">${params.investmentAmount.toLocaleString()}</strong> every{' '}
                  <strong className="text-emerald-400">{freqLabel}</strong> for{' '}
                  <strong className="text-emerald-400">{params.durationYears} years</strong> at{' '}
                  <strong className="text-emerald-400">{params.annualReturnPercent}%</strong> annual return grows your{' '}
                  <strong className="text-emerald-400">{formatCurrency(result.totalContributions)}</strong> in contributions to{' '}
                  <strong className="text-emerald-400">{formatCurrency(result.finalPortfolioValue)}</strong>.
                </p>
              )}

              {/* Contribute then mature: phased explanation */}
              {isContributeThenMature && result.valueAtEndOfContributions != null && (
                <div className="rounded-lg bg-surface-700/60 p-3 text-sm space-y-3">
                  <p className="text-slate-300 font-medium">How it works</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wide">Phase 1 — Contributing ({params.durationYears} years)</p>
                      <p className="text-slate-300 mt-0.5">
                        You invest <strong className="text-white">${params.investmentAmount.toLocaleString()}</strong> every{' '}
                        <strong className="text-white">{freqLabel}</strong> at{' '}
                        <strong className="text-white">{params.annualReturnPercent}%</strong> return. Total contributed:{' '}
                        <strong className="text-emerald-400">{formatCurrency(result.totalContributions)}</strong>.
                      </p>
                      <p className="text-slate-400 mt-1">
                        Portfolio at end of Year {params.durationYears}:{' '}
                        <strong className="text-white">{formatCurrency(result.valueAtEndOfContributions)}</strong>
                      </p>
                    </div>
                    <div className="border-t border-surface-600 pt-2">
                      <p className="text-slate-500 text-xs uppercase tracking-wide">Phase 2 — Maturity ({params.maturityYears} years, no new contributions)</p>
                      <p className="text-slate-300 mt-0.5">
                        You stop contributing. The <strong className="text-white">{formatCurrency(result.valueAtEndOfContributions)}</strong> continues to compound at{' '}
                        <strong className="text-white">{params.annualReturnPercent}%</strong> for{' '}
                        <strong className="text-white">{params.maturityYears} more years</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Keep % to mature: phased explanation */}
              {isKeepPctToMature && result.valueAtEndOfContributions != null && result.amountKeptToMature != null && (
                <div className="rounded-lg bg-surface-700/60 p-3 text-sm space-y-3">
                  <p className="text-slate-300 font-medium">How it works</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-slate-500 text-xs uppercase tracking-wide">Phase 1 — DCA ({params.durationYears} years)</p>
                      <p className="text-slate-300 mt-0.5">
                        You invest <strong className="text-white">${params.investmentAmount.toLocaleString()}</strong> every{' '}
                        <strong className="text-white">{freqLabel}</strong>. After {params.durationYears} years your portfolio is{' '}
                        <strong className="text-white">{formatCurrency(result.valueAtEndOfContributions)}</strong>.
                      </p>
                    </div>
                    <div className="border-t border-surface-600 pt-2">
                      <p className="text-slate-500 text-xs uppercase tracking-wide">Phase 2 — Keep {params.keepPercentToMature}% to mature ({params.maturityYears} years)</p>
                      <p className="text-slate-300 mt-0.5">
                        You withdraw <strong className="text-white">{100 - (params.keepPercentToMature ?? 0)}%</strong> and keep{' '}
                        <strong className="text-white">{formatCurrency(result.amountKeptToMature)}</strong> ({params.keepPercentToMature}%) invested. That amount grows at{' '}
                        <strong className="text-white">{params.annualReturnPercent}%</strong> for{' '}
                        <strong className="text-white">{params.maturityYears} years</strong> with no further contributions.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Final value highlight */}
              <div className="text-xl font-bold text-accent-purple">
                {formatCurrency(result.finalPortfolioValue)}
              </div>
              <p className="text-xs text-slate-500 -mt-1">
                {isContributeThenMature
                  ? `Final value after ${params.durationYears} yr contributions + ${params.maturityYears} yr maturity (${(params.durationYears ?? 0) + (params.maturityYears ?? 0)} years total)`
                  : isKeepPctToMature
                    ? `Value of the ${params.keepPercentToMature}% you kept, after ${params.maturityYears} yr maturity`
                    : 'Final Portfolio Value'}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-slate-500 text-sm">
                    {isContributeThenMature || isKeepPctToMature ? 'Total you contributed' : 'Total Contributions'}
                  </p>
                  <p className="text-white font-medium">{formatCurrency(result.totalContributions)}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-sm">Total returns (growth)</p>
                  <p className="text-white font-medium">{formatCurrency(result.totalReturns)}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-500 text-sm mb-1">Return on investment (vs contributions)</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-surface-700 overflow-hidden">
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
                <p className="text-slate-500 text-xs mb-1.5">
                  {(isContributeThenMature || isKeepPctToMature)
                    ? 'If you had invested the same total amount as a lump sum at the start (same total timeline):'
                    : 'If you had invested the same total amount as a lump sum at the start:'}
                </p>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Your strategy (DCA{isContributeThenMature ? ' + maturity' : isKeepPctToMature ? ' + keep % to mature' : ''})</span>
                  <span className="text-white font-medium">{formatCurrency(result.finalPortfolioValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Lump sum (same total invested, full period)</span>
                  <span className="text-white font-medium">{formatCurrency(result.lumpSumFinalValue)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-surface-600">
                  <span className="text-slate-400">Lump sum would have been</span>
                  <span className={`font-medium px-2 py-0.5 rounded ${result.lumpSumAdvantage >= 0 ? 'text-emerald-400 bg-emerald-500/20' : 'text-amber-400 bg-amber-500/20'}`}>
                    {result.lumpSumAdvantage >= 0 ? '+' : ''}{formatCurrency(result.lumpSumAdvantage)} {result.lumpSumAdvantage >= 0 ? 'more' : 'less'}
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
