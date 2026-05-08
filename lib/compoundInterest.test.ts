import { describe, expect, it } from 'vitest'
import {
  calculateCompoundInterest,
  type CompoundInterestParams,
} from './compoundInterest'

function createParams(overrides: Partial<CompoundInterestParams> = {}): CompoundInterestParams {
  return {
    principal: 10000,
    contribution: 500,
    contributionFrequency: 'monthly',
    annualRatePercent: 10,
    years: 10,
    compoundingFrequency: 'monthly',
    contributionTiming: 'end_of_period',
    ...overrides,
  }
}

describe('calculateCompoundInterest', () => {
  it('returns principal + contributions when rate is zero', () => {
    const result = calculateCompoundInterest(
      createParams({
        annualRatePercent: 0,
        principal: 1000,
        contribution: 100,
        years: 2,
      })
    )

    expect(result.totalContributions).toBe(2400)
    expect(result.totalInvested).toBe(3400)
    expect(result.finalPortfolioValue).toBe(3400)
    expect(result.totalReturns).toBe(0)
    expect(result.returnOnInvestmentPercent).toBe(0)
  })

  it('calculates lump sum only growth correctly', () => {
    const result = calculateCompoundInterest(
      createParams({
        principal: 1000,
        contribution: 0,
        annualRatePercent: 10,
        years: 3,
        compoundingFrequency: 'annually',
      })
    )

    expect(result.recurringFutureValue).toBe(0)
    expect(result.lumpSumFutureValue).toBeCloseTo(1331, 8)
    expect(result.finalPortfolioValue).toBeCloseTo(1331, 8)
    expect(result.totalInvested).toBe(1000)
  })

  it('calculates recurring-only growth correctly', () => {
    const result = calculateCompoundInterest(
      createParams({
        principal: 0,
        contribution: 100,
        years: 2,
        annualRatePercent: 12,
        contributionFrequency: 'monthly',
        compoundingFrequency: 'monthly',
        contributionTiming: 'end_of_period',
      })
    )

    const i = 0.12 / 12
    const expectedRecurring = 100 * ((Math.pow(1 + i, 24) - 1) / i)
    expect(result.lumpSumFutureValue).toBe(0)
    expect(result.recurringFutureValue).toBeCloseTo(expectedRecurring, 8)
    expect(result.finalPortfolioValue).toBeCloseTo(expectedRecurring, 8)
  })

  it('produces higher recurring value when contributions are at beginning of period', () => {
    const common = createParams({
      principal: 0,
      contribution: 100,
      years: 2,
      annualRatePercent: 12,
      contributionFrequency: 'monthly',
      compoundingFrequency: 'monthly',
    })

    const endOfPeriod = calculateCompoundInterest({
      ...common,
      contributionTiming: 'end_of_period',
    })
    const beginningOfPeriod = calculateCompoundInterest({
      ...common,
      contributionTiming: 'beginning_of_period',
    })

    expect(beginningOfPeriod.recurringFutureValue).toBeGreaterThan(endOfPeriod.recurringFutureValue)
  })

  it('changes result when compounding frequency changes', () => {
    const annual = calculateCompoundInterest(
      createParams({
        principal: 1000,
        contribution: 0,
        annualRatePercent: 10,
        years: 10,
        compoundingFrequency: 'annually',
      })
    )
    const daily = calculateCompoundInterest(
      createParams({
        principal: 1000,
        contribution: 0,
        annualRatePercent: 10,
        years: 10,
        compoundingFrequency: 'daily',
      })
    )

    expect(daily.finalPortfolioValue).toBeGreaterThan(annual.finalPortfolioValue)
  })

  it('sanitizes negative and invalid inputs and builds chart from year 0', () => {
    const result = calculateCompoundInterest({
      ...createParams(),
      principal: -100,
      contribution: Number.NaN,
      annualRatePercent: -3,
      years: 0,
    })

    expect(result.totalInvested).toBe(0)
    expect(result.finalPortfolioValue).toBe(0)
    expect(result.chartData[0]).toEqual({ year: 0, portfolioValue: 0, totalInvested: 0 })
    expect(result.chartData[result.chartData.length - 1]?.year).toBe(1)
  })
})
