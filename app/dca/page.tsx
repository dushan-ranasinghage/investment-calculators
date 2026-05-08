import { Metadata } from 'next'
import DcaCalculator from '@/components/DcaCalculator'
import { dcaMetadata } from '@/lib/metadata'

export const metadata: Metadata = dcaMetadata

export default function DcaPage() {
  return <DcaCalculator />
}
