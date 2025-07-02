'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo_main.png"
              alt="Crunch the Numbers Logo"
              width={200}
              height={80}
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/calculators/mortgage" className="text-gray-600 hover:text-blue-600 transition-colors">
              Mortgage
            </Link>
            <Link href="/calculators/investment" className="text-gray-600 hover:text-blue-600 transition-colors">
              Investment
            </Link>
            <Link href="/calculators/loan" className="text-gray-600 hover:text-blue-600 transition-colors">
              Loan
            </Link>
            <Link href="/calculators/debt-payoff" className="text-gray-600 hover:text-blue-600 transition-colors">
              Debt Payoff
            </Link>
            <Link href="/calculators/emergency-fund" className="text-gray-600 hover:text-blue-600 transition-colors">
              Emergency Fund
            </Link>
            <Link href="/calculators/retirement" className="text-gray-600 hover:text-blue-600 transition-colors">
              401(k)
            </Link>
            <Link href="/calculators/rent-vs-buy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Rent vs Buy
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden py-4 border-t">
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
                href="/calculators/investment"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Investment Calculator
              </Link>
              <Link
                href="/calculators/loan"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Loan Calculator
              </Link>
              <Link
                href="/calculators/debt-payoff"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Debt Payoff Calculator
              </Link>
              <Link
                href="/calculators/emergency-fund"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Emergency Fund Calculator
              </Link>
              <Link
                href="/calculators/retirement"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                401(k) Retirement Calculator
              </Link>
              <Link
                href="/calculators/rent-vs-buy"
                className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Rent vs Buy Calculator
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
