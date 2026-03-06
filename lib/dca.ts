export type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
}

export interface DcaParams {
  investmentAmount: number
  frequency: Frequency
  durationYears: number
  annualReturnPercent: number
  startingBalance: number
}

export interface DcaResult {
  finalPortfolioValue: number
  totalContributions: number
  totalReturns: number
  returnOnInvestmentPercent: number
  lumpSumFinalValue: number
  lumpSumAdvantage: number
  chartData: { year: number; portfolioValue: number; totalContributions: number }[]
}

export function calculateDca(params: DcaParams): DcaResult {
  const { investmentAmount, frequency, durationYears, annualReturnPercent, startingBalance } = params
  const periodsPerYear = PERIODS_PER_YEAR[frequency]
  const n = durationYears * periodsPerYear
  const i = annualReturnPercent / 100 / periodsPerYear
  const P = investmentAmount

  // FV = startingBalance * (1+i)^n + P * (((1+i)^n - 1) / i)
  const growthFactor = Math.pow(1 + i, n)
  const fvContributions = i === 0 ? P * n : P * ((growthFactor - 1) / i)
  const fvStarting = startingBalance * growthFactor
  const finalPortfolioValue = fvStarting + fvContributions

  const totalContributions = P * n
  const totalReturns = finalPortfolioValue - totalContributions
  const returnOnInvestmentPercent =
    totalContributions > 0 ? (totalReturns / totalContributions) * 100 : 0

  const totalInvested = totalContributions + startingBalance
  const lumpSumFinalValue = totalInvested * Math.pow(1 + annualReturnPercent / 100, durationYears)
  const lumpSumAdvantage = lumpSumFinalValue - finalPortfolioValue

  const chartData: { year: number; portfolioValue: number; totalContributions: number }[] = []
  for (let y = 0; y <= durationYears; y++) {
    const n_t = y * periodsPerYear
    const gf_t = Math.pow(1 + i, n_t)
    const contrib_t = i === 0 ? P * n_t : P * ((gf_t - 1) / i)
    const pv_t = startingBalance * gf_t + contrib_t
    const tc_t = P * n_t
    chartData.push({ year: y, portfolioValue: pv_t, totalContributions: tc_t })
  }

  return {
    finalPortfolioValue,
    totalContributions,
    totalReturns,
    returnOnInvestmentPercent,
    lumpSumFinalValue,
    lumpSumAdvantage,
    chartData,
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export const FREQUENCY_LABELS: Record<Frequency, string> = {
  weekly: 'Week',
  biweekly: 'Bi-week',
  monthly: 'Month',
  quarterly: 'Quarter',
  yearly: 'Year',
}
