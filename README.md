# Investment Calculators

A Next.js app for investment calculators, starting with a **Dollar-Cost Averaging (DCA) Calculator**.

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The DCA calculator is on the home page.

## Features (DCA Calculator)

- **Parameters:** Investment amount, frequency (weekly/bi-weekly/monthly/quarterly/yearly), duration, annual return %, starting balance
- **Results:** Final portfolio value, total contributions, total returns, ROI %, growth chart (portfolio value vs contributions), and lump sum comparison

You can add more calculator types later under new routes (e.g. `/compound-interest`, `/retirement`) and link them from the main layout.
