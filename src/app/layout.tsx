import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Finance Calculators | Free Mortgage, Loan & Investment Tools',
  description: 'Free financial calculators for mortgages, loans, investments, and debt payoff. Multi-currency support with detailed charts and amortization schedules.',
  keywords: 'mortgage calculator, loan calculator, finance tools, investment calculator',
  authors: [{ name: 'Finance Calculators' }],
  viewport: 'width=device-width, initial-scale=1',
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
      </body>
    </html>
  );
}
