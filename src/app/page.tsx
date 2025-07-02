import Link from 'next/link';
import { Calculator, TrendingUp, PiggyBank, CreditCard, Shield, Home, Scale } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Money Decisions Made Simple
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stop guessing about your finances. Get instant, accurate calculations for mortgages,
            investments, loans, and debt payoff. Our professional-grade tools help you save money
            and make confident financial decisions.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>✓ No Sign-up Required</span>
            <span>✓ Instant Results</span>
            <span>✓ Professional-Grade Accuracy</span>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                Debt Payoff Calculator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                Create a strategy to pay off credit cards and other debts faster with avalanche and snowball methods.
              </p>
            </div>
          </Link>

          {/* Emergency Fund Calculator */}
          <Link href="/calculators/emergency-fund" className="group h-full">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                <Shield className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-orange-600 transition-colors">
                Emergency Fund Calculator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                Plan your financial safety net. Calculate how much to save for 3-6 months of expenses and track your progress.
              </p>
            </div>
          </Link>

          {/* 401(k) Retirement Calculator */}
          <Link href="/calculators/retirement" className="group h-full">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <PiggyBank className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition-colors">
                401(k) Calculator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                Maximize your retirement savings with employer matching. Plan contributions and see your long-term growth.
              </p>
            </div>
          </Link>

          {/* Rent vs Buy Calculator */}
          <Link href="/calculators/rent-vs-buy" className="group h-full">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105 h-full flex flex-col">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <Scale className="w-6 h-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 group-hover:text-teal-600 transition-colors">
                Rent vs Buy Calculator
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                Should you rent or buy? Compare total costs including opportunity cost and make the best housing decision.
              </p>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Save Money, Make Better Decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Save Thousands on Interest</h3>
              <p className="text-gray-600">Compare loan terms and payment strategies to find the best deals and pay off debt faster.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Plan for Retirement</h3>
              <p className="text-gray-600">See exactly how much you need to invest today to reach your retirement goals tomorrow.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">Make Confident Choices</h3>
              <p className="text-gray-600">Visual charts and detailed breakdowns turn complex numbers into clear insights.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
