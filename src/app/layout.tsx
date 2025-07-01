import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Crunch the Numbers | Free Financial Calculators & Tools',
  description: 'Crunch the numbers with our free financial calculators for mortgages, loans, investments, and debt payoff. Multi-currency support with detailed charts and amortization schedules.',
  keywords: 'crunch the numbers, financial calculator, mortgage calculator, loan calculator, investment calculator, debt payoff calculator',
  authors: [{ name: 'Crunch the Numbers' }],
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
      </body>
    </html>
  );
}
