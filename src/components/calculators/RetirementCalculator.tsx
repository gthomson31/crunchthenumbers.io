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
  PiggyBank,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  AlertCircle,
} from "lucide-react";
import ExportButton from "@/components/ui/ExportButton";
import { formatCurrency, currencies } from "@/lib/utils/currency";
import { RetirementInputs, RetirementResults } from "@/lib/types/calculator";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function RetirementCalculator() {
  const [savedCurrency, setSavedCurrency] = useLocalStorage(
    "selectedCurrency",
    "USD"
  );

  const [inputs, setInputs] = useState<RetirementInputs>({
    currentAge: 30,
    retirementAge: 65,
    currentSalary: 75000,
    currentBalance: 25000,
    employeeContribution: 10,
    employerMatch: 50,
    employerMatchLimit: 6,
    salaryIncrease: 3,
    annualReturn: 7,
    currency: savedCurrency,
  });

  const [results, setResults] = useState<RetirementResults>({
    yearsToRetirement: 0,
    totalContributions: 0,
    totalEmployerMatch: 0,
    finalBalance: 0,
    monthlyRetirementIncome: 0,
    yearlyBreakdown: [],
    employerMatchReceived: 0,
  });

  const calculateRetirement = (): RetirementResults => {
    const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
    const yearlyBreakdown = [];

    let currentBalance = inputs.currentBalance;
    let currentSalary = inputs.currentSalary;
    let totalContributions = 0;
    let totalEmployerMatch = 0;

    for (let year = 1; year <= yearsToRetirement; year++) {
      const age = inputs.currentAge + year;
      const actualYear = new Date().getFullYear() + year;

      // Calculate contributions
      const employeeContribution = (currentSalary * inputs.employeeContribution) / 100;
      const matchableContribution = (currentSalary * inputs.employerMatchLimit) / 100;
      const employerMatch = Math.min(employeeContribution, matchableContribution) * (inputs.employerMatch / 100);

      const totalContribution = employeeContribution + employerMatch;
      const beginningBalance = currentBalance;

      // Add contributions at the beginning of the year
      currentBalance += totalContribution;

      // Calculate growth
      const growth = currentBalance * (inputs.annualReturn / 100);
      currentBalance += growth;

      totalContributions += employeeContribution;
      totalEmployerMatch += employerMatch;

      yearlyBreakdown.push({
        age,
        year: actualYear,
        salary: currentSalary,
        employeeContribution,
        employerMatch,
        totalContribution,
        beginningBalance,
        growth,
        endingBalance: currentBalance,
      });

      // Increase salary for next year
      currentSalary *= (1 + inputs.salaryIncrease / 100);
    }

    const finalBalance = currentBalance;
    const monthlyRetirementIncome = finalBalance * 0.04 / 12; // 4% rule

    return {
      yearsToRetirement,
      totalContributions: totalContributions + inputs.currentBalance,
      totalEmployerMatch,
      finalBalance,
      monthlyRetirementIncome,
      yearlyBreakdown,
      employerMatchReceived: totalEmployerMatch,
    };
  };

  useEffect(() => {
    const newResults = calculateRetirement();
    setResults(newResults);
  }, [inputs]);

  useEffect(() => {
    setInputs(prev => ({ ...prev, currency: savedCurrency }));
  }, [savedCurrency]);

  const handleInputChange = (field: keyof RetirementInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (currency: string) => {
    setSavedCurrency(currency);
    setInputs(prev => ({ ...prev, currency }));
  };

  const chartData = results.yearlyBreakdown.filter((_, index) => index % Math.max(1, Math.floor(results.yearlyBreakdown.length / 20)) === 0);

  const contributionData = [
    { name: 'Your Contributions', value: results.totalContributions, color: '#3B82F6' },
    { name: 'Employer Match', value: results.totalEmployerMatch, color: '#10B981' },
    { name: 'Investment Growth', value: results.finalBalance - results.totalContributions - results.totalEmployerMatch, color: '#F59E0B' },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <PiggyBank className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">401(k) Retirement Calculator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Plan your retirement with employer 401(k) matching. See how much you'll have at retirement and optimize your contributions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Retirement Details
            </h2>

            <div className="space-y-6">
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

              {/* Age Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Age
                  </label>
                  <input
                    type="number"
                    value={inputs.currentAge}
                    onChange={(e) => handleInputChange('currentAge', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="18"
                    max="70"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retirement Age
                  </label>
                  <input
                    type="number"
                    value={inputs.retirementAge}
                    onChange={(e) => handleInputChange('retirementAge', Number(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="50"
                    max="80"
                  />
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Annual Salary
                </label>
                <input
                  type="number"
                  value={inputs.currentSalary}
                  onChange={(e) => handleInputChange('currentSalary', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="75000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current 401(k) Balance
                </label>
                <input
                  type="number"
                  value={inputs.currentBalance}
                  onChange={(e) => handleInputChange('currentBalance', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="25000"
                />
              </div>

              {/* Contribution Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Contribution (% of salary)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.employeeContribution}
                  onChange={(e) => handleInputChange('employeeContribution', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Match (% of your contribution)
                </label>
                <input
                  type="number"
                  step="5"
                  value={inputs.employerMatch}
                  onChange={(e) => handleInputChange('employerMatch', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  E.g., 50% means employer matches 50¢ for every $1 you contribute
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employer Match Limit (% of salary)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.employerMatchLimit}
                  onChange={(e) => handleInputChange('employerMatchLimit', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="20"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maximum salary percentage eligible for employer matching
                </p>
              </div>

              {/* Growth Assumptions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Salary Increase (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.salaryIncrease}
                  onChange={(e) => handleInputChange('salaryIncrease', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.annualReturn}
                  onChange={(e) => handleInputChange('annualReturn', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="7"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Historical stock market average is around 7-10%
                </p>
              </div>
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
                  <p className="text-sm text-gray-600">Final Balance</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.finalBalance, inputs.currency)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.monthlyRetirementIncome, inputs.currency)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Using 4% withdrawal rule</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Years to Retire</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {results.yearsToRetirement}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Employer Match</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.totalEmployerMatch, inputs.currency)}
                  </p>
                </div>
                <PiggyBank className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-gray-500 mt-1">Free money from employer</p>
            </div>
          </div>

          {/* Employer Match Alert */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-blue-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Maximize Your Employer Match
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  You're contributing {inputs.employeeContribution}% of your salary. Your employer matches {inputs.employerMatch}% up to {inputs.employerMatchLimit}% of salary.
                  {inputs.employeeContribution < inputs.employerMatchLimit && (
                    <span className="font-medium"> Consider contributing at least {inputs.employerMatchLimit}% to get the full employer match!</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          {chartData.length > 0 && (
            <>
              {/* Growth Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  401(k) Growth Over Time
                </h3>
                <div style={{ width: '100%', height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="age"
                        label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value, inputs.currency, false)}
                        label={{ value: 'Balance', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [formatCurrency(value, inputs.currency), name]}
                        labelFormatter={(label) => `Age ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="endingBalance"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="401(k) Balance"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Contribution Breakdown */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Total Contribution Breakdown</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={contributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {contributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => formatCurrency(value, inputs.currency)} />
                    </PieChart>
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
              filename="401k-retirement-calculation"
              calculatorType="401(k) Retirement"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
