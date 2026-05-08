import { Metadata, Viewport } from 'next'

const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://investmentcalculators.dev'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
}

export const baseMetadata: Metadata = {
  title: {
    default: "Free Investment Calculators - DCA & Compound Interest",
    template: "%s | Investment Calculators"
  },
  description: "Free online investment calculators for wealth planning. Calculate DCA strategies, compound interest, and retirement projections with interactive visual charts.",
  keywords: ["DCA calculator", "compound interest calculator", "investment planner", "wealth planning tool", "investment calculator", "dollar cost averaging"],
  authors: [{ name: "Investment Calculators" }],
  creator: "Investment Calculators",
  robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${domain}/`,
    title: "Free Investment Calculators - Plan Your Wealth",
    description: "Calculate DCA strategies, compound interest, and investment growth with our free tools. Clean, modern interface for wealth planning.",
    siteName: "Investment Calculators",
    images: [{
      url: `${domain}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "Investment Calculators - Free Wealth Planning Tools",
      type: "image/png"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Investment Calculators - DCA & Compound Interest",
    description: "Plan your investments with DCA and compound interest calculators. Free, fast, and accurate.",
    images: [`${domain}/og-image.png`]
  },
  alternates: {
    canonical: `${domain}/`
  }
}

export const dcaMetadata: Metadata = {
  title: "DCA Calculator - Dollar Cost Averaging Investment Planner",
  description: "Free DCA calculator to plan your dollar cost averaging strategy. Analyze contribution phases, maturity scenarios, and withdrawal strategies with visual projections.",
  keywords: ["DCA calculator", "dollar cost averaging calculator", "investment calculator", "SIP calculator", "recurring investment calculator"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${domain}/dca`,
    title: "DCA Calculator - Free Dollar Cost Averaging Tool",
    description: "Plan your dollar cost averaging strategy with our free calculator. Analyze investment phases and growth projections.",
    siteName: "Investment Calculators",
    images: [{
      url: `${domain}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "DCA Calculator - Dollar Cost Averaging Investment Planner",
      type: "image/png"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "DCA Calculator - Free Dollar Cost Averaging Tool",
    description: "Calculate your DCA investment strategy with visual charts and detailed analysis.",
    images: [`${domain}/og-image.png`]
  },
  alternates: {
    canonical: `${domain}/dca`
  }
}

export const compoundInterestMetadata: Metadata = {
  title: "Compound Interest Calculator - Investment Growth Calculator",
  description: "Free compound interest calculator to model investment growth. Calculate returns with different compounding frequencies, contribution timing, and investment scenarios.",
  keywords: ["compound interest calculator", "investment calculator", "interest calculator", "investment growth calculator", "savings calculator"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${domain}/compound-interest`,
    title: "Compound Interest Calculator - Free Investment Growth Tool",
    description: "Calculate compound interest and visualize your investment growth. Model different scenarios and watch your wealth grow.",
    siteName: "Investment Calculators",
    images: [{
      url: `${domain}/og-image.png`,
      width: 1200,
      height: 630,
      alt: "Compound Interest Calculator - Investment Growth Calculator",
      type: "image/png"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Compound Interest Calculator - Free Investment Tool",
    description: "Model compound interest and investment returns with interactive charts.",
    images: [`${domain}/og-image.png`]
  },
  alternates: {
    canonical: `${domain}/compound-interest`
  }
}
