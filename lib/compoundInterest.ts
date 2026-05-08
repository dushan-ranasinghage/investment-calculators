export type ContributionFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

export type CompoundingFrequency = 'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily'

export type ContributionTiming = 'end_of_period' | 'beginning_of_period'

export interface CompoundInterestParams {
  principal: number
  contribution: number
  contributionFrequency: ContributionFrequency
  annualRatePercent: number
  years: number
  compoundingFrequency: CompoundingFrequency
  contributionTiming: ContributionTiming
}

export interface CompoundInterestResult {
  finalPortfolioValue: number
  lumpSumFutureValue: number
  recurringFutureValue: number
  totalContributions: number
  totalInvested: number
  totalReturns: number
  returnOnInvestmentPercent: number
  chartData: { year: number; portfolioValue: number; totalInvested: number }[]
}

export const CONTRIBUTION_PERIODS_PER_YEAR: Record<ContributionFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  quarterly: 4,
  yearly: 1,
}

export const COMPOUNDING_PERIODS_PER_YEAR: Record<CompoundingFrequency, number> = {
  annually: 1,
  semiannually: 2,
  quarterly: 4,
  monthly: 12,
  daily: 365,
}

export const CONTRIBUTION_FREQUENCY_LABELS: Record<ContributionFrequency, string> = {
  weekly: 'Weekly',
  biweekly: 'Bi-weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
}

export const COMPOUNDING_FREQUENCY_LABELS: Record<CompoundingFrequency, string> = {
  annually: 'Annually',
  semiannually: 'Semi-annually',
  quarterly: 'Quarterly',
  monthly: 'Monthly',
  daily: 'Daily',
}

export const CONTRIBUTION_TIMING_LABELS: Record<ContributionTiming, string> = {
  end_of_period: 'End of period',
  beginning_of_period: 'Beginning of period',
}

function sanitizeInput(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

function calculateLumpSumFutureValue(
  principal: number,
  annualRate: number,
  compoundingPeriodsPerYear: number,
  years: number
): number {
  if (years === 0) return principal
  return principal * Math.pow(1 + annualRate / compoundingPeriodsPerYear, compoundingPeriodsPerYear * years)
}

function calculateRecurringFutureValue(
  contributionPerPeriod: number,
  annualRate: number,
  compoundingPeriodsPerYear: number,
  contributionPeriodsPerYear: number,
  years: number,
  contributionTiming: ContributionTiming
): number {
  const contributionPeriods = contributionPeriodsPerYear * years
  if (contributionPeriods === 0 || contributionPerPeriod === 0) return 0

  const periodRate = annualRate === 0
    ? 0
    : Math.pow(1 + annualRate / compoundingPeriodsPerYear, compoundingPeriodsPerYear / contributionPeriodsPerYear) - 1

  if (periodRate === 0) return contributionPerPeriod * contributionPeriods

  const baseFutureValue = contributionPerPeriod * ((Math.pow(1 + periodRate, contributionPeriods) - 1) / periodRate)
  return contributionTiming === 'beginning_of_period'
    ? baseFutureValue * (1 + periodRate)
    : baseFutureValue
}

export function calculateCompoundInterest(params: CompoundInterestParams): CompoundInterestResult {
  const principal = sanitizeInput(params.principal)
  const contribution = sanitizeInput(params.contribution)
  const annualRatePercent = sanitizeInput(params.annualRatePercent)
  const years = Math.max(1, Math.round(sanitizeInput(params.years)))
  const annualRate = annualRatePercent / 100
  const compoundingPeriodsPerYear = COMPOUNDING_PERIODS_PER_YEAR[params.compoundingFrequency]
  const contributionPeriodsPerYear = CONTRIBUTION_PERIODS_PER_YEAR[params.contributionFrequency]

  const lumpSumFutureValue = calculateLumpSumFutureValue(
    principal,
    annualRate,
    compoundingPeriodsPerYear,
    years
  )
  const recurringFutureValue = calculateRecurringFutureValue(
    contribution,
    annualRate,
    compoundingPeriodsPerYear,
    contributionPeriodsPerYear,
    years,
    params.contributionTiming
  )
  const finalPortfolioValue = lumpSumFutureValue + recurringFutureValue

  const totalContributions = contribution * contributionPeriodsPerYear * years
  const totalInvested = principal + totalContributions
  const totalReturns = finalPortfolioValue - totalInvested
  const returnOnInvestmentPercent = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0

  const chartData: { year: number; portfolioValue: number; totalInvested: number }[] = []
  for (let year = 0; year <= years; year++) {
    const lumpAtYear = calculateLumpSumFutureValue(principal, annualRate, compoundingPeriodsPerYear, year)
    const recurringAtYear = calculateRecurringFutureValue(
      contribution,
      annualRate,
      compoundingPeriodsPerYear,
      contributionPeriodsPerYear,
      year,
      params.contributionTiming
    )
    chartData.push({
      year,
      portfolioValue: lumpAtYear + recurringAtYear,
      totalInvested: principal + contribution * contributionPeriodsPerYear * year,
    })
  }

  return {
    finalPortfolioValue,
    lumpSumFutureValue,
    recurringFutureValue,
    totalContributions,
    totalInvested,
    totalReturns,
    returnOnInvestmentPercent,
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
