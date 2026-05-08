import { Metadata } from 'next'
import DcaCalculator from '@/components/DcaCalculator'
import { dcaMetadata } from '@/lib/metadata'
import { generateCalculatorSchema, generateBreadcrumbSchema } from '@/lib/seo-utils'

export const metadata: Metadata = dcaMetadata

export default function DcaPage() {
  const calculatorSchema = generateCalculatorSchema(
    "DCA Calculator",
    "Plan your dollar cost averaging investment strategy with phase analysis and withdrawal scenarios",
    "https://investmentcalculators.dev/dca"
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://investmentcalculators.dev/" },
    { name: "DCA Calculator", url: "https://investmentcalculators.dev/dca" }
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
      <DcaCalculator />
    </>
  )
}
