import MortgageCalculator from '@/components/calculators/MortgageCalculator';

export const metadata = {
  title: 'Mortgage Calculator | Calculate Monthly Payments & Interest',
  description: 'Free mortgage calculator with amortization schedule. Calculate monthly payments, total interest, and compare different loan scenarios. Supports multiple currencies.',
  keywords: 'mortgage calculator, home loan calculator, monthly payment calculator, amortization schedule',
};

export default function MortgagePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <MortgageCalculator />
    </div>
  );
}
