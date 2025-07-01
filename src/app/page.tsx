import Link from 'next/link';
import { Calculator, TrendingUp, PiggyBank, CreditCard } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Crunch the Numbers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Make informed financial decisions with our comprehensive suite of free calculators.
            Crunch the numbers for mortgages, loans, investments, and debt payoff with detailed analysis.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>✓ Multi-currency support</span>
            <span>✓ Detailed charts</span>
            <span>✓ Amortization schedules</span>
            <span>✓ Mobile responsive</span>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Mortgage Calculator */}
          <Link href="/calculators/mortgage" className="group h-full">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Calculator className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
                Mortgage Calculator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                Calculate monthly payments, total interest, and view detailed amortization schedules for your home loan.
              </p>
            </div>
          </Link>

          {/* Investment Calculator */}
          <Link href="/calculators/investment" className="group h-full">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors">
                Investment Calculator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                Plan your retirement and calculate investment growth with compound interest and inflation adjustments.
              </p>
            </div>
          </Link>

          {/* Loan Calculator */}
          <Link href="/calculators/loan" className="group h-full">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <PiggyBank className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-purple-600 transition-colors">
                Loan
                <br />
                Calculator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                Calculate monthly payments, total interest, and amortization schedules for personal, auto, student, and business loans.
              </p>
            </div>
          </Link>

          {/* Debt Payoff Calculator */}
          <Link href="/calculators/debt-payoff" className="group h-full">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-red-600 transition-colors">
                Debt Payoff
                <br />
                Calculator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                Create a strategy to pay off credit cards and other debts faster with avalanche and snowball methods.
              </p>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Use Our Calculators?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Accurate Calculations</h3>
              <p className="text-gray-600">Professional-grade financial formulas ensure precise results every time.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Multi-Currency Support</h3>
              <p className="text-gray-600">Calculate in USD, EUR, GBP, CAD, AUD, and JPY with proper formatting.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Visual Charts</h3>
              <p className="text-gray-600">Interactive charts and detailed breakdowns help you understand your finances.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
