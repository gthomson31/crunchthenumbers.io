'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, currencies } from '@/lib/utils/currency';
import { MortgageInputs, MortgageResults } from '@/lib/types/calculator';

export default function MortgageCalculator() {
  const [inputs, setInputs] = useState<MortgageInputs>({
    loanAmount: 300000,
    interestRate: 6.5,
    loanTerm: 30,
    downPayment: 60000,
    propertyTax: 3600,
    homeInsurance: 1200,
    pmi: 0,
    currency: 'USD'
  });

  const [results, setResults] = useState<MortgageResults>({
    monthlyPayment: 0,
    totalInterest: 0,
    totalPayment: 0,
    monthlyPI: 0,
    monthlyTaxInsurance: 0,
    amortizationSchedule: []
  });

  const [showAmortization, setShowAmortization] = useState(false);

  // Calculate mortgage details
  useEffect(() => {
    const calculateMortgage = () => {
      const principal = inputs.loanAmount - inputs.downPayment;
      const monthlyRate = inputs.interestRate / 100 / 12;
      const numberOfPayments = inputs.loanTerm * 12;
      
      // Monthly principal & interest payment
      const monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
      
      // Monthly tax and insurance
      const monthlyTaxInsurance = (inputs.propertyTax + inputs.homeInsurance) / 12 + inputs.pmi;
      
      // Total monthly payment
      const totalMonthlyPayment = monthlyPI + monthlyTaxInsurance;
      
      // Total interest over loan life
      const totalInterest = (monthlyPI * numberOfPayments) - principal;
      const totalPayment = principal + totalInterest;

      // Generate amortization schedule
      const schedule = [];
      let remainingBalance = principal;
      
      for (let month = 1; month <= numberOfPayments; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPI - interestPayment;
        remainingBalance -= principalPayment;
        
        if (remainingBalance < 0) remainingBalance = 0;
        
        schedule.push({
          month,
          year: Math.ceil(month / 12),
          principalPayment: Math.round(principalPayment * 100) / 100,
          interestPayment: Math.round(interestPayment * 100) / 100,
          remainingBalance: Math.round(remainingBalance * 100) / 100,
          totalPayment: Math.round(monthlyPI * 100) / 100
        });
      }

      setResults({
        monthlyPayment: Math.round(totalMonthlyPayment * 100) / 100,
        monthlyPI: Math.round(monthlyPI * 100) / 100,
        monthlyTaxInsurance: Math.round(monthlyTaxInsurance * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPayment: Math.round(totalPayment * 100) / 100,
        amortizationSchedule: schedule
      });
    };

    calculateMortgage();
  }, [inputs]);

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: field === 'currency' ? value : parseFloat(value) || 0
    }));
  };

  // Prepare chart data (yearly summary)
  const chartData = [];
  for (let year = 1; year <= inputs.loanTerm; year++) {
    const yearlyData = results.amortizationSchedule.filter(item => item.year === year);
    if (yearlyData.length > 0) {
      const yearlyPrincipal = yearlyData.reduce((sum, item) => sum + item.principalPayment, 0);
      const yearlyInterest = yearlyData.reduce((sum, item) => sum + item.interestPayment, 0);
      const endBalance = yearlyData[yearlyData.length - 1].remainingBalance;
      
      chartData.push({
        year,
        principal: Math.round(yearlyPrincipal),
        interest: Math.round(yearlyInterest),
        balance: Math.round(endBalance)
      });
    }
  }

  // Pie chart data for payment breakdown
  const pieData = [
    { name: 'Principal & Interest', value: results.monthlyPI, color: '#3B82F6' },
    { name: 'Property Tax', value: inputs.propertyTax / 12, color: '#EF4444' },
    { name: 'Home Insurance', value: inputs.homeInsurance / 12, color: '#10B981' },
    { name: 'PMI', value: inputs.pmi, color: '#F59E0B' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Mortgage Calculator</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Loan Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={inputs.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(currencies).map(([code, details]) => (
                    <option key={code} value={code}>
                      {details.symbol} {code}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home Price
                </label>
                <input
                  type="number"
                  value={inputs.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Down Payment
                </label>
                <input
                  type="number"
                  value={inputs.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-sm text-gray-500 mt-1">
                  {((inputs.downPayment / inputs.loanAmount) * 100).toFixed(1)}% of home price
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Term (years)
                </label>
                <select
                  value={inputs.loanTerm}
                  onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={25}>25 years</option>
                  <option value={30}>30 years</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Additional Costs</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Tax (annual)
                </label>
                <input
                  type="number"
                  value={inputs.propertyTax}
                  onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Home Insurance (annual)
                </label>
                <input
                  type="number"
                  value={inputs.homeInsurance}
                  onChange={(e) => handleInputChange('homeInsurance', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PMI (monthly)
                </label>
                <input
                  type="number"
                  value={inputs.pmi}
                  onChange={(e) => handleInputChange('pmi', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Monthly Payment Breakdown</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Principal & Interest:</span>
                <span className="font-semibold">{formatCurrency(results.monthlyPI, inputs.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Property Tax:</span>
                <span className="font-semibold">{formatCurrency(inputs.propertyTax / 12, inputs.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Home Insurance:</span>
                <span className="font-semibold">{formatCurrency(inputs.homeInsurance / 12, inputs.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">PMI:</span>
                <span className="font-semibold">{formatCurrency(inputs.pmi, inputs.currency)}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Monthly Payment:</span>
                  <span className="text-2xl font-bold text-blue-600">{formatCurrency(results.monthlyPayment, inputs.currency)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Loan Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Loan Amount:</span>
                <span className="font-semibold">{formatCurrency(inputs.loanAmount - inputs.downPayment, inputs.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Interest:</span>
                <span className="font-semibold text-red-600">{formatCurrency(results.totalInterest, inputs.currency)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Payment:</span>
                <span className="font-semibold">{formatCurrency(results.totalPayment, inputs.currency)}</span>
              </div>
            </div>
          </div>

          {/* Payment Breakdown Pie Chart */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Monthly Payment Breakdown</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value), inputs.currency)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Principal vs Interest Over Time</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(Number(value), inputs.currency)} />
            <Legend />
            <Line type="monotone" dataKey="principal" stroke="#3B82F6" name="Principal Payment" strokeWidth={2} />
            <Line type="monotone" dataKey="interest" stroke="#EF4444" name="Interest Payment" strokeWidth={2} />
            <Line type="monotone" dataKey="balance" stroke="#10B981" name="Remaining Balance" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Amortization Schedule */}
      <div className="mt-8">
        <button
          onClick={() => setShowAmortization(!showAmortization)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
        </button>
        
        {showAmortization && (
          <div className="mt-6 bg-white border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Month</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Principal</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Interest</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.amortizationSchedule.map((payment, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm">{payment.month}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(payment.principalPayment, inputs.currency)}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(payment.interestPayment, inputs.currency)}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(payment.remainingBalance, inputs.currency)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
