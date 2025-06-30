'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ChevronDown, ChevronUp, TrendingDown, Calculator, DollarSign, Calendar } from 'lucide-react';
import { formatCurrency, currencies } from '@/lib/utils/currency';
import { MortgageInputs, MortgageResults } from '@/lib/types/calculator';

export default function MortgageCalculator() {
  const [inputs, setInputs] = useState<MortgageInputs>({
    loanAmount: 400000,
    interestRate: 6.5,
    loanTerm: 30,
    downPayment: 80000,
    propertyTax: 4800,
    homeInsurance: 1200,
    pmi: 200,
    currency: 'USD',
    loanType: 'mortgage'
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
  const [chartView, setChartView] = useState<'balance' | 'payments' | 'breakdown'>('balance');

  // Calculate mortgage details
  useEffect(() => {
    const calculateMortgage = () => {
      if (inputs.loanTerm <= 0) {
        setResults({
          monthlyPayment: 0,
          totalInterest: 0,
          totalPayment: 0,
          monthlyPI: 0,
          monthlyTaxInsurance: 0,
          amortizationSchedule: []
        });
        return;
      }

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

  // Prepare chart data for remaining balance over time
  const balanceChartData = [];
  for (let year = 0; year <= inputs.loanTerm; year++) {
    if (year === 0) {
      balanceChartData.push({
        year: 0,
        balance: inputs.loanAmount - inputs.downPayment,
        principal: 0,
        interest: 0
      });
    } else {
      const yearData = results.amortizationSchedule.filter(item => item.year === year);
      if (yearData.length > 0) {
        const endBalance = yearData[yearData.length - 1].remainingBalance;
        const yearlyPrincipal = yearData.reduce((sum, item) => sum + item.principalPayment, 0);
        const yearlyInterest = yearData.reduce((sum, item) => sum + item.interestPayment, 0);
        
        balanceChartData.push({
          year,
          balance: Math.round(endBalance),
          principal: Math.round(yearlyPrincipal),
          interest: Math.round(yearlyInterest)
        });
      }
    }
  }

  // Pie chart data for payment breakdown
  const pieData = [
    { name: 'Principal & Interest', value: results.monthlyPI, color: '#3B82F6' },
    { name: 'Property Tax', value: inputs.propertyTax / 12, color: '#EF4444' },
    { name: 'Home Insurance', value: inputs.homeInsurance / 12, color: '#10B981' }
  ];

  if (inputs.pmi > 0) {
    pieData.push({ name: 'PMI', value: inputs.pmi, color: '#F59E0B' });
  }

  // Total interest vs principal pie chart
  const totalBreakdownData = [
    { name: 'Principal', value: inputs.loanAmount - inputs.downPayment, color: '#10B981' },
    { name: 'Total Interest', value: results.totalInterest, color: '#EF4444' }
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`Year ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value, inputs.currency)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mortgage Calculator</h1>
        <p className="text-gray-600">Calculate your monthly payments and visualize your mortgage breakdown</p>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
            <div className="flex items-center mb-4">
              <Calculator className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Loan Details</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={inputs.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(currencies).map(([code, details]) => (
                    <option key={code} value={code}>
                      {details.symbol} {code}
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
                  value={inputs.loanAmount || ''}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter home price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Down Payment
                </label>
                <input
                  type="number"
                  value={inputs.downPayment || ''}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter down payment"
                />
                <div className="text-sm text-blue-600 mt-1 font-medium">
                  {inputs.loanAmount > 0 ? `${((inputs.downPayment / inputs.loanAmount) * 100).toFixed(1)}% of home price` : ''}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={inputs.interestRate || ''}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter interest rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Term (years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={inputs.loanTerm || ''}
                  onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter loan term"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Additional Costs</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Tax (annual)
                </label>
                <input
                  type="number"
                  value={inputs.propertyTax || ''}
                  onChange={(e) => handleInputChange('propertyTax', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter annual property tax"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Home Insurance (annual)
                </label>
                <input
                  type="number"
                  value={inputs.homeInsurance || ''}
                  onChange={(e) => handleInputChange('homeInsurance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter annual insurance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PMI (monthly)
                </label>
                <input
                  type="number"
                  value={inputs.pmi || ''}
                  onChange={(e) => handleInputChange('pmi', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter monthly PMI"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results and Charts Section */}
        <div className="xl:col-span-2 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Monthly Payment</p>
                  <p className="text-3xl font-bold">{formatCurrency(results.monthlyPayment, inputs.currency)}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Total Interest</p>
                  <p className="text-3xl font-bold">{formatCurrency(results.totalInterest, inputs.currency)}</p>
                </div>
                <TrendingDown className="w-8 h-8 text-red-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Loan Amount</p>
                  <p className="text-3xl font-bold">{formatCurrency(inputs.loanAmount - inputs.downPayment, inputs.currency)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </div>
          </div>

          {/* Chart Toggle Buttons */}
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setChartView('balance')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                chartView === 'balance' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Loan Balance Over Time
            </button>
            <button
              onClick={() => setChartView('payments')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                chartView === 'payments' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Principal vs Interest
            </button>
            <button
              onClick={() => setChartView('breakdown')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                chartView === 'breakdown' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              Payment Breakdown
            </button>
          </div>

          {/* Charts */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            {chartView === 'balance' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Remaining Loan Balance Over Time</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={balanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(value, inputs.currency)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="Remaining Balance"
                      dot={{ fill: '#3B82F6', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {chartView === 'payments' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Principal vs Interest Payments by Year</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={balanceChartData.slice(1)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#666"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatCurrency(value, inputs.currency)}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="principal" stackId="a" fill="#10B981" name="Principal" />
                    <Bar dataKey="interest" stackId="a" fill="#EF4444" name="Interest" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {chartView === 'breakdown' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Monthly Payment Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value), inputs.currency)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Total Loan Cost</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={totalBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {totalBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value), inputs.currency)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Payment Breakdown Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">Detailed Payment Breakdown</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Principal & Interest</p>
                <p className="text-xl font-bold text-blue-600">{formatCurrency(results.monthlyPI, inputs.currency)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Property Tax</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(inputs.propertyTax / 12, inputs.currency)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">Home Insurance</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(inputs.homeInsurance / 12, inputs.currency)}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <p className="text-sm text-gray-600">PMI</p>
                <p className="text-xl font-bold text-yellow-600">{formatCurrency(inputs.pmi, inputs.currency)}</p>
              </div>
            </div>
          </div>

          {/* Amortization Schedule */}
          {results.amortizationSchedule.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <button
                onClick={() => setShowAmortization(!showAmortization)}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between transition-colors"
              >
                <h3 className="text-lg font-semibold">Amortization Schedule</h3>
                {showAmortization ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              
              {showAmortization && (
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {results.amortizationSchedule.map((payment, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{payment.month}</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-600">
                            {formatCurrency(payment.principalPayment, inputs.currency)}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-red-600">
                            {formatCurrency(payment.interestPayment, inputs.currency)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {formatCurrency(payment.remainingBalance, inputs.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}