"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Home,
  TrendingUp,
  Calendar,
  DollarSign,
  Scale,
  AlertTriangle,
} from "lucide-react";
import ExportButton from "@/components/ui/ExportButton";
import { formatCurrency, currencies } from "@/lib/utils/currency";
import { RentBuyInputs, RentBuyResults } from "@/lib/types/calculator";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function RentBuyCalculator() {
  const [savedCurrency, setSavedCurrency] = useLocalStorage(
    "selectedCurrency",
    "USD"
  );

  const [inputs, setInputs] = useState<RentBuyInputs>({
    homePrice: 400000,
    downPayment: 80000,
    interestRate: 6.5,
    loanTerm: 30,
    propertyTax: 5000,
    homeInsurance: 1200,
    hoaFees: 0,
    maintenanceRate: 1.5,
    monthlyRent: 2200,
    rentIncrease: 3,
    rentersInsurance: 200,
    investmentReturn: 7,
    yearsToAnalyze: 10,
    currency: savedCurrency,
  });

  const [results, setResults] = useState<RentBuyResults>({
    totalCostToBuy: 0,
    totalCostToRent: 0,
    costDifference: 0,
    isBuyingBetter: false,
    breakEvenYear: 0,
    yearlyBreakdown: [],
    buyingCosts: {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPropertyTax: 0,
      totalInsurance: 0,
      totalMaintenance: 0,
      totalHOA: 0,
      closingCosts: 0,
    },
    rentingCosts: {
      totalRent: 0,
      totalInsurance: 0,
      investmentGrowth: 0,
      opportunityCost: 0,
    },
  });

  const calculateRentBuy = (): RentBuyResults => {
    const loanAmount = inputs.homePrice - inputs.downPayment;
    const monthlyRate = inputs.interestRate / 100 / 12;
    const totalPayments = inputs.loanTerm * 12;

    // Calculate monthly mortgage payment
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
                          (Math.pow(1 + monthlyRate, totalPayments) - 1);

    const monthlyPropertyTax = inputs.propertyTax / 12;
    const monthlyInsurance = inputs.homeInsurance / 12;
    const monthlyHOA = inputs.hoaFees;
    const monthlyMaintenance = (inputs.homePrice * inputs.maintenanceRate / 100) / 12;

    const totalMonthlyBuying = monthlyPayment + monthlyPropertyTax + monthlyInsurance + monthlyHOA + monthlyMaintenance;
    const closingCosts = inputs.homePrice * 0.03; // 3% closing costs

    const yearlyBreakdown = [];
    let buyingCumulativeCost = inputs.downPayment + closingCosts;
    let rentingCumulativeCost = 0;
    let currentRent = inputs.monthlyRent;
    let homeValue = inputs.homePrice;
    let mortgageBalance = loanAmount;
    let investmentBalance = inputs.downPayment + closingCosts; // Opportunity cost investment
    let breakEvenYear = 0;

    for (let year = 1; year <= inputs.yearsToAnalyze; year++) {
      // Buying costs for this year
      const yearlyMortgagePayments = monthlyPayment * 12;
      const yearlyPropertyTax = inputs.propertyTax;
      const yearlyInsurance = inputs.homeInsurance;
      const yearlyHOA = inputs.hoaFees * 12;
      const yearlyMaintenance = inputs.homePrice * inputs.maintenanceRate / 100;

      buyingCumulativeCost += yearlyMortgagePayments + yearlyPropertyTax + yearlyInsurance + yearlyHOA + yearlyMaintenance;

      // Calculate mortgage balance and home appreciation
      const yearlyInterest = mortgageBalance * inputs.interestRate / 100;
      const yearlyPrincipal = yearlyMortgagePayments - yearlyInterest;
      mortgageBalance = Math.max(0, mortgageBalance - yearlyPrincipal);
      homeValue *= 1.03; // 3% appreciation

      // Renting costs for this year
      const yearlyRent = currentRent * 12;
      const yearlyRentersInsurance = inputs.rentersInsurance;
      rentingCumulativeCost += yearlyRent + yearlyRentersInsurance;

      // Investment growth (opportunity cost)
      investmentBalance *= (1 + inputs.investmentReturn / 100);
      investmentBalance += (totalMonthlyBuying - currentRent - inputs.rentersInsurance / 12) * 12; // Monthly difference invested

      const homeEquity = homeValue - mortgageBalance;

      // Net position calculation
      const buyingNetPosition = homeEquity - buyingCumulativeCost;
      const rentingNetPosition = investmentBalance - rentingCumulativeCost;
      const difference = rentingNetPosition - buyingNetPosition;

      yearlyBreakdown.push({
        year,
        buyingCumulativeCost: buyingCumulativeCost - homeEquity, // Adjust for equity
        rentingCumulativeCost: rentingCumulativeCost - investmentBalance, // Adjust for investments
        difference,
        homeValue,
        mortgageBalance,
        homeEquity,
        investmentBalance,
      });

      if (buyingNetPosition > rentingNetPosition && breakEvenYear === 0) {
        breakEvenYear = year;
      }

      // Increase rent for next year
      currentRent *= (1 + inputs.rentIncrease / 100);
    }

    const lastYear = yearlyBreakdown[yearlyBreakdown.length - 1];
    const totalCostToBuy = lastYear.buyingCumulativeCost;
    const totalCostToRent = lastYear.rentingCumulativeCost;
    const costDifference = totalCostToRent - totalCostToBuy;
    const isBuyingBetter = costDifference > 0;

    // Calculate total costs breakdown
    const totalInterest = (monthlyPayment * totalPayments) - loanAmount;
    const totalPropertyTax = inputs.propertyTax * inputs.yearsToAnalyze;
    const totalInsurance = inputs.homeInsurance * inputs.yearsToAnalyze;
    const totalMaintenance = (inputs.homePrice * inputs.maintenanceRate / 100) * inputs.yearsToAnalyze;
    const totalHOA = inputs.hoaFees * 12 * inputs.yearsToAnalyze;

    const totalRent = inputs.monthlyRent * 12 * inputs.yearsToAnalyze *
                     Math.pow(1 + inputs.rentIncrease / 100, inputs.yearsToAnalyze / 2); // Approximate total with increases
    const totalRentersInsurance = inputs.rentersInsurance * inputs.yearsToAnalyze;

    return {
      totalCostToBuy,
      totalCostToRent,
      costDifference,
      isBuyingBetter,
      breakEvenYear,
      yearlyBreakdown,
      buyingCosts: {
        monthlyPayment,
        totalInterest,
        totalPropertyTax,
        totalInsurance,
        totalMaintenance,
        totalHOA,
        closingCosts,
      },
      rentingCosts: {
        totalRent,
        totalInsurance: totalRentersInsurance,
        investmentGrowth: lastYear.investmentBalance - (inputs.downPayment + closingCosts),
        opportunityCost: inputs.downPayment + closingCosts,
      },
    };
  };

  useEffect(() => {
    const newResults = calculateRentBuy();
    setResults(newResults);
  }, [inputs]);

  useEffect(() => {
    setInputs(prev => ({ ...prev, currency: savedCurrency }));
  }, [savedCurrency]);

  const handleInputChange = (field: keyof RentBuyInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (currency: string) => {
    setSavedCurrency(currency);
    setInputs(prev => ({ ...prev, currency }));
  };

  const chartData = results.yearlyBreakdown;

  const costComparisonData = [
    { name: 'Buying Costs', value: Math.abs(results.totalCostToBuy), color: '#3B82F6' },
    { name: 'Renting Costs', value: Math.abs(results.totalCostToRent), color: '#10B981' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Scale className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Rent vs Buy Calculator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Compare the total cost of renting versus buying a home over time. Consider all costs including opportunity cost of your down payment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Home Purchase Details
            </h2>

            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                value={inputs.currency}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(currencies).map(([code, details]) => (
                  <option key={code} value={code}>
                    {code} - {details.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Price
              </label>
              <input
                type="number"
                value={inputs.homePrice}
                onChange={(e) => handleInputChange('homePrice', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="400000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment
              </label>
              <input
                type="number"
                value={inputs.downPayment}
                onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="80000"
              />
              <p className="text-xs text-gray-500 mt-1">
                {((inputs.downPayment / inputs.homePrice) * 100).toFixed(1)}% of home price
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="6.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term (years)
                </label>
                <select
                  value={inputs.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Property Tax
              </label>
              <input
                type="number"
                value={inputs.propertyTax}
                onChange={(e) => handleInputChange('propertyTax', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Home Insurance
              </label>
              <input
                type="number"
                value={inputs.homeInsurance}
                onChange={(e) => handleInputChange('homeInsurance', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly HOA Fees
              </label>
              <input
                type="number"
                value={inputs.hoaFees}
                onChange={(e) => handleInputChange('hoaFees', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Maintenance (% of home value)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.maintenanceRate}
                onChange={(e) => handleInputChange('maintenanceRate', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.5"
              />
              <p className="text-xs text-gray-500 mt-1">
                Typical range: 1-3% of home value annually
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mt-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Home className="w-5 h-5 mr-2 text-green-600" />
              Rental Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent
              </label>
              <input
                type="number"
                value={inputs.monthlyRent}
                onChange={(e) => handleInputChange('monthlyRent', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Rent Increase (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.rentIncrease}
                onChange={(e) => handleInputChange('rentIncrease', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Renter's Insurance
              </label>
              <input
                type="number"
                value={inputs.rentersInsurance}
                onChange={(e) => handleInputChange('rentersInsurance', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Return (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.investmentReturn}
                onChange={(e) => handleInputChange('investmentReturn', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="7"
              />
              <p className="text-xs text-gray-500 mt-1">
                Return on investing your down payment
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years to Analyze
              </label>
              <select
                value={inputs.yearsToAnalyze}
                onChange={(e) => handleInputChange('yearsToAnalyze', Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 years</option>
                <option value={10}>10 years</option>
                <option value={15}>15 years</option>
                <option value={20}>20 years</option>
                <option value={30}>30 years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Better Option</p>
                  <p className={`text-2xl font-bold ${results.isBuyingBetter ? 'text-blue-600' : 'text-green-600'}`}>
                    {results.isBuyingBetter ? 'Buy' : 'Rent'}
                  </p>
                </div>
                <Scale className={`w-8 h-8 ${results.isBuyingBetter ? 'text-blue-600' : 'text-green-600'}`} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Cost Difference</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(Math.abs(results.costDifference), inputs.currency)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-gray-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {results.isBuyingBetter ? 'Savings from buying' : 'Savings from renting'}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Break-even Year</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {results.breakEvenYear || 'Never'}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">When buying becomes better</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Payment</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.buyingCosts.monthlyPayment, inputs.currency)}
                  </p>
                </div>
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Mortgage payment only</p>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`${results.isBuyingBetter ? 'bg-blue-50 border-blue-400' : 'bg-green-50 border-green-400'} border-l-4 p-4 rounded-lg`}>
            <div className="flex items-center">
              <Scale className={`w-5 h-5 mr-3 ${results.isBuyingBetter ? 'text-blue-400' : 'text-green-400'}`} />
              <div>
                <h3 className={`text-sm font-medium ${results.isBuyingBetter ? 'text-blue-800' : 'text-green-800'}`}>
                  Recommendation: {results.isBuyingBetter ? 'Buy' : 'Rent'}
                </h3>
                <p className={`text-sm mt-1 ${results.isBuyingBetter ? 'text-blue-700' : 'text-green-700'}`}>
                  {results.isBuyingBetter
                    ? `Buying is ${formatCurrency(Math.abs(results.costDifference), inputs.currency)} cheaper over ${inputs.yearsToAnalyze} years when considering all costs and opportunity costs.`
                    : `Renting is ${formatCurrency(Math.abs(results.costDifference), inputs.currency)} cheaper over ${inputs.yearsToAnalyze} years when investing your down payment at ${inputs.investmentReturn}% return.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          {chartData.length > 0 && (
            <>
              {/* Cost Comparison Over Time */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Cost Comparison Over Time
                </h3>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="year"
                        label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value, inputs.currency, false)}
                        label={{ value: 'Net Cost', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [formatCurrency(value, inputs.currency), name]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="buyingCumulativeCost"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="Net Cost to Buy"
                      />
                      <Line
                        type="monotone"
                        dataKey="rentingCumulativeCost"
                        stroke="#10B981"
                        strokeWidth={3}
                        name="Net Cost to Rent"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Total Cost Comparison */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Total Cost Comparison</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={costComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => formatCurrency(value, inputs.currency, false)} />
                      <Tooltip formatter={(value: number) => formatCurrency(value, inputs.currency)} />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Export Button */}
          <div className="flex justify-center">
            <ExportButton
              data={{
                inputs,
                results,
              }}
              filename="rent-vs-buy-analysis"
              calculatorType="Rent vs Buy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
