import { describe, expect, it } from 'vitest'
import { calculateDca, type DcaParams } from './dca'

function createParams(overrides: Partial<DcaParams> = {}): DcaParams {
  return {
    investmentAmount: 100,
    frequency: 'monthly',
    durationYears: 2,
    annualReturnPercent: 10,
    startingBalance: 0,
    advancedMode: 'none',
    maturityYears: 0,
    keepPercentToMature: 100,
    phases: [],
    ...overrides,
  }
}

describe('calculateDca', () => {
  it('calculates standard DCA with zero return', () => {
    const result = calculateDca(
      createParams({
        annualReturnPercent: 0,
      })
    )

    expect(result.totalContributions).toBe(2400)
    expect(result.totalInvested).toBe(2400)
    expect(result.finalPortfolioValue).toBe(2400)
    expect(result.totalReturns).toBe(0)
    expect(result.returnOnInvestmentPercent).toBe(0)
    expect(result.chartData).toHaveLength(3)
    expect(result.chartData[0]).toEqual({ year: 0, portfolioValue: 0, totalInvested: 0 })
    expect(result.chartData[2]).toEqual({ year: 2, portfolioValue: 2400, totalInvested: 2400 })
  })

  it('calculates standard DCA with starting balance and positive return', () => {
    const params = createParams({
      investmentAmount: 100,
      durationYears: 1,
      annualReturnPercent: 12,
      startingBalance: 1000,
    })
    const result = calculateDca(params)

    const monthlyRate = 0.12 / 12
    const growthFactor = Math.pow(1 + monthlyRate, 12)
    const expected = (1000 * growthFactor) + (100 * ((growthFactor - 1) / monthlyRate))

    expect(result.finalPortfolioValue).toBeCloseTo(expected, 8)
    expect(result.totalContributions).toBe(1200)
    expect(result.totalInvested).toBe(2200)
    expect(result.totalReturns).toBeCloseTo(expected - 2200, 8)
  })

  it('calculates contribute-then-mature scenario', () => {
    const result = calculateDca(
      createParams({
        investmentAmount: 100,
        durationYears: 1,
        annualReturnPercent: 10,
        advancedMode: 'contribute_then_mature',
        maturityYears: 2,
      })
    )

    const i = 0.1 / 12
    const valueAtEnd = 100 * ((Math.pow(1 + i, 12) - 1) / i)
    const expectedFinal = valueAtEnd * Math.pow(1.1, 2)

    expect(result.valueAtEndOfContributions).toBeCloseTo(valueAtEnd, 8)
    expect(result.finalPortfolioValue).toBeCloseTo(expectedFinal, 8)
    expect(result.totalYears).toBe(3)
    expect(result.chartData).toHaveLength(4)
    expect(result.totalInvested).toBe(1200)
  })

  it('calculates keep-percent-to-mature scenario and total received return', () => {
    const result = calculateDca(
      createParams({
        annualReturnPercent: 0,
        durationYears: 1,
        advancedMode: 'keep_pct_to_mature',
        keepPercentToMature: 50,
        maturityYears: 2,
      })
    )

    expect(result.valueAtEndOfContributions).toBe(1200)
    expect(result.amountKeptToMature).toBe(600)
    expect(result.amountWithdrawn).toBe(600)
    expect(result.valueAfterMaturity).toBe(600)
    expect(result.finalPortfolioValue).toBe(600)
    expect(result.totalReturns).toBe(0)
    expect(result.returnOnInvestmentPercent).toBe(0)
  })

  it('calculates multi-phase scenario and phase summaries', () => {
    const result = calculateDca(
      createParams({
        annualReturnPercent: 0,
        durationYears: 1,
        advancedMode: 'multi_phase',
        phases: [
          {
            years: 1,
            contributionPerPeriod: 200,
            frequency: 'monthly',
            annualReturnPercent: 0,
          },
        ],
      })
    )

    expect(result.finalPortfolioValue).toBe(3600)
    expect(result.totalContributions).toBe(3600)
    expect(result.totalInvested).toBe(3600)
    expect(result.totalReturns).toBe(0)
    expect(result.totalYears).toBe(2)
    expect(result.phaseSummaries).toHaveLength(2)
    expect(result.chartData).toHaveLength(3)
    expect(result.phaseSummaries?.[0].endValue).toBe(1200)
    expect(result.phaseSummaries?.[1].endValue).toBe(3600)
  })
})
