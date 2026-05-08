export type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

const PERIODS_PER_YEAR: Record<Frequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
}

export type AdvancedMode = 'none' | 'contribute_then_mature' | 'keep_pct_to_mature' | 'multi_phase'

export interface DcaPhase {
  years: number
  contributionPerPeriod: number
  frequency: Frequency
  annualReturnPercent: number
}

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
  /** When multi_phase: run each phase sequentially on top of previous compounded value. */
  phases?: DcaPhase[]
}

export interface DcaResult {
  finalPortfolioValue: number
  /** Sum of recurring contributions only (P × periods). */
  totalContributions: number
  /** Starting balance + total contributions. */
  totalInvested: number
  /** Starting balance (echoed for convenience). */
  startingBalance: number
  /** Final value − total invested (true growth). */
  totalReturns: number
  /** Returns as % of total invested. */
  returnOnInvestmentPercent: number
  lumpSumFinalValue: number
  lumpSumAdvantage: number
  /** Chart series: portfolioValue (true value) and totalInvested (starting + cumulative contributions). */
  chartData: { year: number; portfolioValue: number; totalInvested: number }[]
  /** When contribute_then_mature: value at end of contribution period (before maturity). */
  valueAtEndOfContributions?: number
  /** When contribute_then_mature: total years = durationYears + maturityYears. */
  totalYears?: number
  /** When keep_pct_to_mature: amount kept (Y% of DCA final) to grow. */
  amountKeptToMature?: number
  /** When keep_pct_to_mature: value withdrawn at end of DCA phase. */
  amountWithdrawn?: number
  /** When keep_pct_to_mature: value after maturity period. */
  valueAfterMaturity?: number
  /** When multi_phase: breakdown by phase. */
  phaseSummaries?: {
    phaseIndex: number
    startYear: number
    endYear: number
    contributions: number
    startValue: number
    endValue: number
  }[]
}

interface PhaseSimulationResult {
  endingValue: number
  endingYear: number
  contributions: number
  totalInvestedEnd: number
  chartPoints: { year: number; portfolioValue: number; totalInvested: number }[]
}

function dcaCore(
  P: number,
  i: number,
  periodsPerYear: number,
  contributionYears: number,
  startingBalance: number
): { value: number; chartData: { year: number; portfolioValue: number; totalInvested: number }[] } {
  const n = contributionYears * periodsPerYear
  const growthFactor = Math.pow(1 + i, n)
  const fvContributions = i === 0 ? P * n : P * ((growthFactor - 1) / i)
  const fvStarting = startingBalance * growthFactor
  const value = fvStarting + fvContributions
  const chartData: { year: number; portfolioValue: number; totalInvested: number }[] = []
  for (let y = 0; y <= contributionYears; y++) {
    const n_t = y * periodsPerYear
    const gf_t = Math.pow(1 + i, n_t)
    const contrib_t = i === 0 ? P * n_t : P * ((gf_t - 1) / i)
    const pv_t = startingBalance * gf_t + contrib_t
    const tc_t = P * n_t
    chartData.push({ year: y, portfolioValue: pv_t, totalInvested: startingBalance + tc_t })
  }
  return { value, chartData }
}

function simulatePhase(
  startingValue: number,
  startingYear: number,
  totalInvestedStart: number,
  phase: DcaPhase
): PhaseSimulationResult {
  const periodsPerYear = PERIODS_PER_YEAR[phase.frequency]
  const periods = Math.max(0, Math.round(phase.years * periodsPerYear))
  const i = (phase.annualReturnPercent / 100) / periodsPerYear
  let value = startingValue
  let contributions = 0
  let totalInvested = totalInvestedStart
  const chartPoints: { year: number; portfolioValue: number; totalInvested: number }[] = []

  for (let p = 1; p <= periods; p++) {
    value = value * (1 + i) + phase.contributionPerPeriod
    contributions += phase.contributionPerPeriod
    totalInvested += phase.contributionPerPeriod

    if (p % periodsPerYear === 0) {
      chartPoints.push({
        year: startingYear + p / periodsPerYear,
        portfolioValue: value,
        totalInvested,
      })
    }
  }

  return {
    endingValue: value,
    endingYear: startingYear + (periods / periodsPerYear),
    contributions,
    totalInvestedEnd: totalInvested,
    chartPoints,
  }
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
    phases = [],
  } = params
  const periodsPerYear = PERIODS_PER_YEAR[frequency]
  const r = annualReturnPercent / 100
  const i = r / periodsPerYear
  const P = investmentAmount

  /** For contribute_then_mature, Duration (Years) is the contribution period; otherwise same. */
  const contributionYears = durationYears
  const maturityPeriodYears = maturityYears ?? 0

  if (advancedMode === 'multi_phase') {
    const basePhase: DcaPhase = {
      years: durationYears,
      contributionPerPeriod: investmentAmount,
      frequency,
      annualReturnPercent,
    }
    const allPhases = [basePhase, ...phases]
    const validPhases = allPhases.filter(
      (phase) =>
        phase.years > 0 &&
        phase.annualReturnPercent >= 0 &&
        phase.contributionPerPeriod >= 0
    )

    if (validPhases.length > 0) {
      let value = startingBalance
      let currentYear = 0
      let totalInvested = startingBalance
      let totalContributions = 0

      const chartData: { year: number; portfolioValue: number; totalInvested: number }[] = [
        { year: 0, portfolioValue: startingBalance, totalInvested: startingBalance },
      ]
      const phaseSummaries: {
        phaseIndex: number
        startYear: number
        endYear: number
        contributions: number
        startValue: number
        endValue: number
      }[] = []

      validPhases.forEach((phase, index) => {
        const startValue = value
        const phaseStartYear = currentYear
        const simulation = simulatePhase(value, currentYear, totalInvested, phase)
        value = simulation.endingValue
        currentYear = simulation.endingYear
        totalInvested = simulation.totalInvestedEnd
        totalContributions += simulation.contributions
        chartData.push(...simulation.chartPoints)
        phaseSummaries.push({
          phaseIndex: index + 1,
          startYear: phaseStartYear,
          endYear: simulation.endingYear,
          contributions: simulation.contributions,
          startValue,
          endValue: simulation.endingValue,
        })
      })

      let lumpSumFinalValue = totalInvested
      validPhases.forEach((phase) => {
        lumpSumFinalValue *= Math.pow(1 + phase.annualReturnPercent / 100, phase.years)
      })

      const finalPortfolioValue = value
      const totalReturns = finalPortfolioValue - totalInvested
      const returnOnInvestmentPercent =
        totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0
      const lumpSumAdvantage = lumpSumFinalValue - finalPortfolioValue

      return {
        finalPortfolioValue,
        totalContributions,
        totalInvested,
        startingBalance,
        totalReturns,
        returnOnInvestmentPercent,
        lumpSumFinalValue,
        lumpSumAdvantage,
        chartData,
        totalYears: currentYear,
        phaseSummaries,
      }
    }
  }

  const { value: valueAtEndOfContributions, chartData: contributionChartData } = dcaCore(
    P,
    i,
    periodsPerYear,
    contributionYears,
    startingBalance
  )

  const totalContributions = P * contributionYears * periodsPerYear
  const totalInvested = totalContributions + startingBalance
  let finalPortfolioValue: number
  let chartData = contributionChartData

  if (advancedMode === 'contribute_then_mature' && maturityPeriodYears > 0) {
    finalPortfolioValue = valueAtEndOfContributions * Math.pow(1 + r, maturityPeriodYears)
    const totalYears = contributionYears + maturityPeriodYears
    for (let y = contributionYears + 1; y <= totalYears; y++) {
      const yearsIntoMaturity = y - contributionYears
      const pv = valueAtEndOfContributions * Math.pow(1 + r, yearsIntoMaturity)
      chartData.push({ year: y, portfolioValue: pv, totalInvested })
    }
  } else if (advancedMode === 'keep_pct_to_mature' && maturityPeriodYears > 0 && keepPercentToMature > 0) {
    const amountKept = (keepPercentToMature / 100) * valueAtEndOfContributions
    const amountWithdrawn = valueAtEndOfContributions - amountKept
    const valueAfterMaturityVal = amountKept * Math.pow(1 + r, maturityPeriodYears)
    const totalYears = contributionYears + maturityPeriodYears
    for (let y = contributionYears + 1; y <= totalYears; y++) {
      const yearsIntoMaturity = y - contributionYears
      const pv = amountKept * Math.pow(1 + r, yearsIntoMaturity)
      chartData.push({ year: y, portfolioValue: pv, totalInvested })
    }
    // Net gain accounts for what you withdrew + what's left after maturity.
    const totalReceived = amountWithdrawn + valueAfterMaturityVal
    const totalReturns = totalReceived - totalInvested
    const returnOnInvestmentPercent =
      totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0
    const lumpSumFinalValue = totalInvested * Math.pow(1 + r, totalYears)
    const lumpSumAdvantage = lumpSumFinalValue - totalReceived
    return {
      finalPortfolioValue: valueAfterMaturityVal,
      totalContributions,
      totalInvested,
      startingBalance,
      totalReturns,
      returnOnInvestmentPercent,
      lumpSumFinalValue,
      lumpSumAdvantage,
      chartData,
      valueAtEndOfContributions,
      amountKeptToMature: amountKept,
      amountWithdrawn,
      valueAfterMaturity: valueAfterMaturityVal,
    }
  } else {
    finalPortfolioValue = valueAtEndOfContributions
  }

  const totalReturns = finalPortfolioValue - totalInvested
  const returnOnInvestmentPercent =
    totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0
  const totalYearsForLump = advancedMode === 'contribute_then_mature'
    ? contributionYears + maturityPeriodYears
    : contributionYears
  const lumpSumFinalValue = totalInvested * Math.pow(1 + r, totalYearsForLump)
  const lumpSumAdvantage = lumpSumFinalValue - finalPortfolioValue

  const result: DcaResult = {
    finalPortfolioValue,
    totalContributions,
    totalInvested,
    startingBalance,
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
