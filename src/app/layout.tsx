import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Free Financial Calculators | Smart Money Decisions Made Simple',
  description: 'Make smarter financial decisions with our free, professional-grade calculators. Get instant mortgage payments, investment projections, loan comparisons, and debt payoff strategies with detailed breakdowns.',
  keywords: 'financial calculator, mortgage calculator, loan calculator, investment calculator, debt payoff calculator, retirement planning, compound interest, amortization schedule, financial planning tools',
  authors: [{ name: 'Financial Calculator Suite' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
