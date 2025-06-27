import Link from 'next/link';
import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">FinanceCalc</span>
            </div>
            <p className="text-gray-400 mb-4">
              Free, professional-grade financial calculators to help you make informed decisions about your money. 
              All tools support multiple currencies and provide detailed analysis.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 FinanceCalc. All rights reserved.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="font-semibold mb-4">Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/calculators/mortgage" className="text-gray-400 hover:text-white transition-colors">
                  Mortgage Calculator
                </Link>
              </li>
              <li className="text-gray-600">Loan Calculator (Soon)</li>
              <li className="text-gray-600">Investment Calculator (Soon)</li>
              <li className="text-gray-600">Debt Payoff Calculator (Soon)</li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
