import MortgageCalculator from '@/components/calculators/MortgageCalculator';

export const metadata = {
  title: 'Mortgage Calculator - Crunch the Numbers | Free Home Loan Calculator',
  description: 'Crunch the numbers on your mortgage with our free calculator. Calculate monthly payments, total interest, and detailed amortization schedules for home loans.',
  keywords: 'mortgage calculator, home loan calculator, crunch the numbers, monthly payment calculator, amortization schedule',
};

export default function MortgagePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <MortgageCalculator />
    </div>
  );
}
