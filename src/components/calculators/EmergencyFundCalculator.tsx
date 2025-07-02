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
  Shield,
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  AlertTriangle,
} from "lucide-react";
import ExportButton from "@/components/ui/ExportButton";
import { formatCurrency, currencies } from "@/lib/utils/currency";
import { EmergencyFundInputs, EmergencyFundResults } from "@/lib/types/calculator";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function EmergencyFundCalculator() {
  const [savedCurrency, setSavedCurrency] = useLocalStorage(
    "selectedCurrency",
    "USD"
  );

  const [inputs, setInputs] = useState<EmergencyFundInputs>({
    monthlyExpenses: 4000,
    currentSavings: 5000,
    targetMonths: 6,
    monthlySavings: 500,
    currency: savedCurrency,
    annualReturn: 2.5,
  });

  const [results, setResults] = useState<EmergencyFundResults>({
    targetAmount: 0,
    amountNeeded: 0,
    monthsToGoal: 0,
    yearsToGoal: 0,
    monthlyBreakdown: [],
    isGoalMet: false,
  });

  const calculateEmergencyFund = (): EmergencyFundResults => {
    const targetAmount = inputs.monthlyExpenses * inputs.targetMonths;
    const amountNeeded = Math.max(0, targetAmount - inputs.currentSavings);
    const isGoalMet = inputs.currentSavings >= targetAmount;

    const monthlyBreakdown = [];
    let currentBalance = inputs.currentSavings;
    let monthsToGoal = 0;

    if (!isGoalMet && inputs.monthlySavings > 0) {
      for (let month = 1; month <= 120; month++) { // Max 10 years
        const monthlyReturn = inputs.annualReturn / 100 / 12;
        const interest = currentBalance * monthlyReturn;
        currentBalance += inputs.monthlySavings + interest;

        const monthsOfExpensesCovered = currentBalance / inputs.monthlyExpenses;

        monthlyBreakdown.push({
          month,
          monthlyContribution: inputs.monthlySavings,
          interest,
          balance: currentBalance,
          monthsOfExpensesCovered,
        });

        if (currentBalance >= targetAmount && monthsToGoal === 0) {
          monthsToGoal = month;
        }

        if (month >= 60 && currentBalance >= targetAmount) break; // Stop after 5 years if goal met
      }
    }

    const yearsToGoal = monthsToGoal / 12;

    return {
      targetAmount,
      amountNeeded,
      monthsToGoal,
      yearsToGoal,
      monthlyBreakdown,
      isGoalMet,
    };
  };

  useEffect(() => {
    const newResults = calculateEmergencyFund();
    setResults(newResults);
  }, [inputs]);

  useEffect(() => {
    setInputs(prev => ({ ...prev, currency: savedCurrency }));
  }, [savedCurrency]);

  const handleInputChange = (field: keyof EmergencyFundInputs, value: number | string) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleCurrencyChange = (currency: string) => {
    setSavedCurrency(currency);
    setInputs(prev => ({ ...prev, currency }));
  };

  const chartData = results.monthlyBreakdown.slice(0, Math.min(results.monthsToGoal || 60, 60));

  const pieData = [
    { name: 'Current Savings', value: inputs.currentSavings, color: '#3B82F6' },
    { name: 'Amount Needed', value: Math.max(0, results.amountNeeded), color: '#EF4444' },
  ];

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Emergency Fund Calculator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate how much you need for your emergency fund and create a savings plan to reach your goal.
          Most experts recommend 3-6 months of expenses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              Emergency Fund Details
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

              {/* Monthly Expenses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Expenses
                </label>
                <input
                  type="number"
                  value={inputs.monthlyExpenses}
                  onChange={(e) => handleInputChange('monthlyExpenses', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="4000"
                />
              </div>

              {/* Current Savings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Emergency Savings
                </label>
                <input
                  type="number"
                  value={inputs.currentSavings}
                  onChange={(e) => handleInputChange('currentSavings', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000"
                />
              </div>

              {/* Target Months */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Months of Expenses
                </label>
                <select
                  value={inputs.targetMonths}
                  onChange={(e) => handleInputChange('targetMonths', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>3 months (minimum)</option>
                  <option value={6}>6 months (recommended)</option>
                  <option value={9}>9 months (conservative)</option>
                  <option value={12}>12 months (very conservative)</option>
                </select>
              </div>

              {/* Monthly Savings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Savings Amount
                </label>
                <input
                  type="number"
                  value={inputs.monthlySavings}
                  onChange={(e) => handleInputChange('monthlySavings', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>

              {/* Annual Return */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Return on Savings (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.annualReturn}
                  onChange={(e) => handleInputChange('annualReturn', Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2.5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  High-yield savings account or money market rate
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
                  <p className="text-sm text-gray-600">Target Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.targetAmount, inputs.currency)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Amount Needed</p>
                  <p className={`text-2xl font-bold ${results.isGoalMet ? 'text-green-600' : 'text-red-600'}`}>
                    {results.isGoalMet ? '✓ Goal Met!' : formatCurrency(results.amountNeeded, inputs.currency)}
                  </p>
                </div>
                <DollarSign className={`w-8 h-8 ${results.isGoalMet ? 'text-green-600' : 'text-red-600'}`} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Time to Goal</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {results.isGoalMet ? 'Achieved' :
                     results.monthsToGoal > 0 ? `${Math.round(results.yearsToGoal * 10) / 10} years` : 'N/A'}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-gray-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Months Covered</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round((inputs.currentSavings / inputs.monthlyExpenses) * 10) / 10}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Status Alert */}
          {!results.isGoalMet && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">
                    Emergency Fund Gap
                  </h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    You need {formatCurrency(results.amountNeeded, inputs.currency)} more to reach your {inputs.targetMonths}-month emergency fund goal.
                    {results.monthsToGoal > 0 && (
                      <span> At your current savings rate, you'll reach this goal in {Math.round(results.yearsToGoal * 10) / 10} years.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {results.isGoalMet && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-green-400 mr-3" />
                <div>
                  <h3 className="text-sm font-medium text-green-800">
                    Emergency Fund Complete!
                  </h3>
                  <p className="text-sm text-green-700 mt-1">
                    Congratulations! You have enough saved to cover {inputs.targetMonths} months of expenses.
                    Consider investing additional savings for other financial goals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Charts Section */}
          {!results.isGoalMet && chartData.length > 0 && (
            <>
              {/* Progress Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                  Emergency Fund Growth
                </h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                      />
                      <YAxis
                        tickFormatter={(value) => formatCurrency(value, inputs.currency, false)}
                        label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip
                        formatter={(value: number) => [formatCurrency(value, inputs.currency), 'Balance']}
                        labelFormatter={(label) => `Month ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        name="Emergency Fund Balance"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Current vs Target Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Current Progress</h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
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
              filename="emergency-fund-calculation"
              calculatorType="Emergency Fund"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
