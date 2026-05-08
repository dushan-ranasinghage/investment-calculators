# Compound Interest Calculator Spec

## Goal

Build a production-ready calculator for `/compound-interest` that supports:

- Lump sum growth
- Recurring contribution growth
- Combined lump sum + recurring growth

The UX and visual language should stay consistent with the existing DCA calculator.

## Files

- `lib/compoundInterest.ts`
- `components/CompoundInterestCalculator.tsx`
- `app/compound-interest/page.tsx`

## Scenarios

1. **Lump sum only**
   - `principal > 0`, `contribution = 0`
   - Result should include growth from principal compounding only.

2. **Recurring only**
   - `principal = 0`, `contribution > 0`
   - Result should include annuity growth from recurring contributions.

3. **Combined investment**
   - `principal > 0`, `contribution > 0`
   - Final value should equal lump sum future value + recurring future value.

4. **Contribution timing**
   - `end_of_period` and `beginning_of_period` must be supported.
   - Beginning-of-period should produce a larger recurring future value (all else equal).

5. **Compounding frequencies**
   - Annually, semi-annually, quarterly, monthly, daily.
   - Must affect results correctly.

6. **Contribution frequencies**
   - Weekly, bi-weekly, monthly, quarterly, yearly.
   - Must affect total contributions, chart data, and recurring growth.

7. **Zero-interest edge case**
   - `annualRatePercent = 0`
   - Final value should be exactly principal + total contributions.

8. **Bounds and validation**
   - No negative values should be used in calculations.
   - Duration should be clamped to at least 1 year in calculator logic.

## Inputs

- Initial Investment (`principal`)
- Recurring Contribution (`contribution`)
- Contribution Frequency (`contributionFrequency`)
- Annual Return % (`annualRatePercent`)
- Duration in years (`years`)
- Compounding Frequency (`compoundingFrequency`)
- Contribution Timing (`contributionTiming`)

## Calculation Rules

Definitions:

- `r = annualRatePercent / 100`
- `n = compounding periods per year`
- `m = contribution periods per year`
- `t = years`
- `N = m * t`

Lump sum:

- `FV_lump = principal * (1 + r / n)^(n * t)`

Recurring contribution:

- Effective contribution-period rate:
  - `i_m = (1 + r / n)^(n / m) - 1`
- End-of-period:
  - `FV_recurring = contribution * (((1 + i_m)^N - 1) / i_m)`
- Beginning-of-period:
  - `FV_recurring_due = FV_recurring * (1 + i_m)`
- If `i_m = 0`:
  - `FV_recurring = contribution * N`

Totals:

- `finalPortfolioValue = FV_lump + FV_recurring_component`
- `totalContributions = contribution * N`
- `totalInvested = principal + totalContributions`
- `totalReturns = finalPortfolioValue - totalInvested`
- `ROI% = totalReturns / totalInvested * 100` (if invested > 0, else 0)

## Outputs

- Final Portfolio Value
- Initial Investment
- Total Contributions
- Total Invested
- Total Returns
- ROI %
- Lump sum future value
- Recurring future value
- Yearly chart data:
  - `portfolioValue`
  - `totalInvested`

## Chart Expectations

- Include year 0 through final year.
- Two lines:
  - Portfolio value
  - Total invested
- Support showing either relative years (`Year 0...`) or actual calendar years.

## UX Expectations

- Keep existing app styling conventions (`glass-card`, `soft-panel`, button classes).
- Use clear empty state before first calculation.
- Include calculate and reset actions.

## Route Expectations

- `app/compound-interest/page.tsx` should render the production calculator component.
- Placeholder copy should be removed.

## Out of Scope

- Tax effects
- Inflation-adjusted returns
- Fees/expense ratios
- Variable annual rate by year
