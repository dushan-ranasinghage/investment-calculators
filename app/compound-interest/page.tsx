import { Metadata } from 'next'
import CompoundInterestCalculator from '@/components/CompoundInterestCalculator'
import { compoundInterestMetadata } from '@/lib/metadata'

export const metadata: Metadata = compoundInterestMetadata

export default function CompoundInterestPage() {
  return <CompoundInterestCalculator />
}
