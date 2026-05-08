import { Metadata } from 'next'
import CompoundInterestCalculator from '@/components/CompoundInterestCalculator'
import { compoundInterestMetadata } from '@/lib/metadata'
import { generateCalculatorSchema, generateBreadcrumbSchema } from '@/lib/seo-utils'

export const metadata: Metadata = compoundInterestMetadata

export default function CompoundInterestPage() {
  const calculatorSchema = generateCalculatorSchema(
    "Compound Interest Calculator",
    "Calculate investment returns with compound interest modeling. Analyze different compounding frequencies and contribution timing.",
    "https://investmentcalculators.dev/compound-interest"
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://investmentcalculators.dev/" },
    { name: "Compound Interest Calculator", url: "https://investmentcalculators.dev/compound-interest" }
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <CompoundInterestCalculator />
    </>
  )
}
