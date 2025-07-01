'use client';

import Link from 'next/link';
import { Calculator, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FinanceCalc</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/calculators/mortgage" className="text-gray-600 hover:text-blue-600 transition-colors">
              Mortgage Calculator
            </Link>
            <Link href="/calculators/loan" className="text-gray-600 hover:text-blue-600 transition-colors">
              Loan Calculator
            </Link>
            <div className="text-gray-400 cursor-not-allowed">Investment Calculator</div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="space-y-2">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/calculators/mortgage"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Mortgage Calculator
              </Link>
              <Link
                href="/calculators/loan"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Loan Calculator
              </Link>
              <div className="block px-3 py-2 text-gray-400 cursor-not-allowed">
                Investment Calculator (Coming Soon)
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
