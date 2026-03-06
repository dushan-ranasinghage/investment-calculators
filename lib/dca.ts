export type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
}

export type AdvancedMode = 'none' | 'contribute_then_mature' | 'keep_pct_to_mature'

export interface DcaParams {
  investmentAmount: number
  frequency: Frequency
  durationYears: number
  annualReturnPercent: number
  startingBalance: number
  /** Advanced: contribute only for this many years, then let sit */
  advancedMode?: AdvancedMode
  /** Extra years to let money grow after contribution period (no new contributions, or growth of kept %). */
  maturityYears?: number
  /** When keep_pct_to_mature: percent of final portfolio to keep growing (0-100). */
  keepPercentToMature?: number
}

export interface DcaResult {
  finalPortfolioValue: number
  totalContributions: number
  totalReturns: number
  returnOnInvestmentPercent: number
  lumpSumFinalValue: number
  lumpSumAdvantage: number
  chartData: { year: number; portfolioValue: number; totalContributions: number }[]
  /** When contribute_then_mature: value at end of contribution period (before maturity). */
  valueAtEndOfContributions?: number
  /** When contribute_then_mature: total years = durationYears + maturityYears. */
  totalYears?: number
  /** When keep_pct_to_mature: amount kept (Y% of DCA final) to grow. */
  amountKeptToMature?: number
  /** When keep_pct_to_mature: value after maturity period. */
  valueAfterMaturity?: number
}

function dcaCore(
  P: number,
  i: number,
  periodsPerYear: number,
  contributionYears: number,
  startingBalance: number
): { value: number; chartData: { year: number; portfolioValue: number; totalContributions: number }[] } {
  const n = contributionYears * periodsPerYear
  const growthFactor = Math.pow(1 + i, n)
  const fvContributions = i === 0 ? P * n : P * ((growthFactor - 1) / i)
  const fvStarting = startingBalance * growthFactor
  const value = fvStarting + fvContributions
  const chartData: { year: number; portfolioValue: number; totalContributions: number }[] = []
  for (let y = 0; y <= contributionYears; y++) {
    const n_t = y * periodsPerYear
    const gf_t = Math.pow(1 + i, n_t)
    const contrib_t = i === 0 ? P * n_t : P * ((gf_t - 1) / i)
    const pv_t = startingBalance * gf_t + contrib_t
    const tc_t = P * n_t
    chartData.push({ year: y, portfolioValue: pv_t, totalContributions: tc_t })
  }
  return { value, chartData }
}

export function calculateDca(params: DcaParams): DcaResult {
  const {
    investmentAmount,
    frequency,
    durationYears,
    annualReturnPercent,
    startingBalance,
    advancedMode = 'none',
    maturityYears = 0,
    keepPercentToMature = 100,
  } = params
  const periodsPerYear = PERIODS_PER_YEAR[frequency]
  const r = annualReturnPercent / 100
  const i = r / periodsPerYear
  const P = investmentAmount

  /** For contribute_then_mature, Duration (Years) is the contribution period; otherwise same. */
  const contributionYears = durationYears
  const maturityPeriodYears = maturityYears ?? 0

  const { value: valueAtEndOfContributions, chartData: contributionChartData } = dcaCore(
    P,
    i,
    periodsPerYear,
    contributionYears,
    startingBalance
  )

  const totalContributions = P * contributionYears * periodsPerYear
  let finalPortfolioValue: number
  let chartData = contributionChartData

  if (advancedMode === 'contribute_then_mature' && maturityPeriodYears > 0) {
    finalPortfolioValue = valueAtEndOfContributions * Math.pow(1 + r, maturityPeriodYears)
    const totalYears = contributionYears + maturityPeriodYears
    for (let y = contributionYears + 1; y <= totalYears; y++) {
      const yearsIntoMaturity = y - contributionYears
      const pv = valueAtEndOfContributions * Math.pow(1 + r, yearsIntoMaturity)
      chartData.push({ year: y, portfolioValue: pv, totalContributions })
    }
  } else if (advancedMode === 'keep_pct_to_mature' && maturityPeriodYears > 0 && keepPercentToMature > 0) {
    const amountKept = (keepPercentToMature / 100) * valueAtEndOfContributions
    const valueAfterMaturityVal = amountKept * Math.pow(1 + r, maturityPeriodYears)
    const totalYears = contributionYears + maturityPeriodYears
    for (let y = contributionYears + 1; y <= totalYears; y++) {
      const yearsIntoMaturity = y - contributionYears
      const pv = amountKept * Math.pow(1 + r, yearsIntoMaturity)
      chartData.push({ year: y, portfolioValue: pv, totalContributions })
    }
    const totalReturns = valueAfterMaturityVal - totalContributions
    const returnOnInvestmentPercent =
      totalContributions > 0 ? (totalReturns / totalContributions) * 100 : 0
    const totalInvested = totalContributions + startingBalance
    const lumpSumFinalValue = totalInvested * Math.pow(1 + r, totalYears)
    const lumpSumAdvantage = lumpSumFinalValue - valueAfterMaturityVal
    return {
      finalPortfolioValue: valueAfterMaturityVal,
      totalContributions,
      totalReturns,
      returnOnInvestmentPercent,
      lumpSumFinalValue,
      lumpSumAdvantage,
      chartData,
      valueAtEndOfContributions,
      amountKeptToMature: amountKept,
      valueAfterMaturity: valueAfterMaturityVal,
    }
  } else {
    finalPortfolioValue = valueAtEndOfContributions
  }

  const totalReturns = finalPortfolioValue - totalContributions
  const returnOnInvestmentPercent =
    totalContributions > 0 ? (totalReturns / totalContributions) * 100 : 0
  const totalInvested = totalContributions + startingBalance
  const totalYearsForLump = advancedMode === 'contribute_then_mature'
    ? contributionYears + maturityPeriodYears
    : contributionYears
  const lumpSumFinalValue = totalInvested * Math.pow(1 + r, totalYearsForLump)
  const lumpSumAdvantage = lumpSumFinalValue - finalPortfolioValue

  const result: DcaResult = {
    finalPortfolioValue,
    totalContributions,
    totalReturns,
    returnOnInvestmentPercent,
    lumpSumFinalValue,
    lumpSumAdvantage,
    chartData,
  }
  if (advancedMode === 'contribute_then_mature' && maturityPeriodYears > 0) {
    result.valueAtEndOfContributions = valueAtEndOfContributions
    result.totalYears = contributionYears + maturityPeriodYears
  }
  return result
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
