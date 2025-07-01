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
  Area,
  AreaChart,
} from "recharts";
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  Percent,
} from "lucide-react";
import ExportButton from "@/components/ui/ExportButton";
import { formatCurrency, currencies } from "@/lib/utils/currency";
import { InvestmentInputs, InvestmentResults } from "@/lib/types/calculator";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function InvestmentCalculator() {
  const [savedCurrency, setSavedCurrency] = useLocalStorage(
    "selectedCurrency",
    "USD"
  );
  const [inputs, setInputs] = useState<InvestmentInputs>({
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualReturn: 8.0,
    investmentPeriod: 20,
    currency: savedCurrency,
    compoundingFrequency: "monthly",
    inflationRate: 2.5,
    contributionIncrease: 0,
  });

  const [results, setResults] = useState<InvestmentResults>({
    finalAmount: 0,
    totalContributions: 0,
    totalGrowth: 0,
    realValue: 0,
    yearlyBreakdown: [],
    monthlyBreakdown: [],
  });

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [chartView, setChartView] = useState<
    "growth" | "contributions" | "breakdown" | "real"
  >("growth");

  // Calculate investment details
  useEffect(() => {
    const calculateInvestment = () => {
      if (inputs.investmentPeriod <= 0) {
        setResults({
          finalAmount: 0,
          totalContributions: 0,
          totalGrowth: 0,
          realValue: 0,
          yearlyBreakdown: [],
          monthlyBreakdown: [],
        });
        return;
      }

      const monthlyRate = inputs.annualReturn / 100 / 12;
      const monthlyInflationRate = inputs.inflationRate / 100 / 12;
      const monthlyContributionIncrease = inputs.contributionIncrease / 100 / 12;
      const totalMonths = inputs.investmentPeriod * 12;

      let balance = inputs.initialInvestment;
      let totalContributions = inputs.initialInvestment;
      let monthlyContribution = inputs.monthlyContribution;

      const yearlyBreakdown = [];
      const monthlyBreakdown = [];

      // Track yearly totals
      let yearlyContributions = inputs.initialInvestment;
      let yearlyStartBalance = inputs.initialInvestment;

      for (let month = 1; month <= totalMonths; month++) {
        const currentYear = Math.ceil(month / 12);
        const monthInYear = ((month - 1) % 12) + 1;

        // Add monthly contribution (with increases if applicable)
        if (month > 1) {
          if (inputs.contributionIncrease > 0) {
            monthlyContribution *= (1 + monthlyContributionIncrease);
          }
          balance += monthlyContribution;
          totalContributions += monthlyContribution;
          yearlyContributions += monthlyContribution;
        }

        // Apply compound growth
        const growth = balance * monthlyRate;
        balance += growth;

        // Calculate real value (adjusted for inflation)
        const realValue = balance / Math.pow(1 + inputs.inflationRate / 100, month / 12);

        monthlyBreakdown.push({
          month: monthInYear,
          year: currentYear,
          monthlyContribution: Math.round(monthlyContribution * 100) / 100,
          growth: Math.round(growth * 100) / 100,
          balance: Math.round(balance * 100) / 100,
          realValue: Math.round(realValue * 100) / 100,
        });

        // At end of year, record yearly summary
        if (month % 12 === 0 || month === totalMonths) {
          const yearGrowth = balance - yearlyStartBalance - (yearlyContributions - (currentYear === 1 ? inputs.initialInvestment : 0));
          const yearEndRealValue = balance / Math.pow(1 + inputs.inflationRate / 100, currentYear);

          yearlyBreakdown.push({
            year: currentYear,
            startingBalance: Math.round(yearlyStartBalance * 100) / 100,
            contributions: Math.round((yearlyContributions - (currentYear === 1 ? inputs.initialInvestment : 0)) * 100) / 100,
            growth: Math.round(yearGrowth * 100) / 100,
            endingBalance: Math.round(balance * 100) / 100,
            realValue: Math.round(yearEndRealValue * 100) / 100,
          });

          // Reset for next year
          yearlyStartBalance = balance;
          yearlyContributions = 0;
        }
      }

      const finalRealValue = balance / Math.pow(1 + inputs.inflationRate / 100, inputs.investmentPeriod);

      setResults({
        finalAmount: Math.round(balance * 100) / 100,
        totalContributions: Math.round(totalContributions * 100) / 100,
        totalGrowth: Math.round((balance - totalContributions) * 100) / 100,
        realValue: Math.round(finalRealValue * 100) / 100,
        yearlyBreakdown,
        monthlyBreakdown,
      });
    };

    calculateInvestment();
  }, [inputs]);

  const handleInputChange = (field: keyof InvestmentInputs, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [field]:
        field === "currency" || field === "compoundingFrequency"
          ? value
          : parseFloat(value) || 0,
    }));

    if (field === "currency") {
      setSavedCurrency(value);
    }
  };

  // Prepare chart data for investment growth over time
  const growthChartData = results.yearlyBreakdown.map((year, index) => ({
    year: year.year,
    totalValue: year.endingBalance,
    contributions: results.yearlyBreakdown.slice(0, index + 1).reduce((sum, y) => sum + y.contributions, inputs.initialInvestment),
    growth: year.endingBalance - (results.yearlyBreakdown.slice(0, index + 1).reduce((sum, y) => sum + y.contributions, inputs.initialInvestment)),
    realValue: year.realValue,
  }));

  // Pie chart data for final breakdown
  const breakdownData = [
    {
      name: "Initial Investment",
      value: inputs.initialInvestment,
      color: "#3b82f6",
    },
    {
      name: "Total Contributions",
      value: results.totalContributions - inputs.initialInvestment,
      color: "#10b981",
    },
    {
      name: "Investment Growth",
      value: results.totalGrowth,
      color: "#f59e0b",
    },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  const getFrequencyDescription = () => {
    switch (inputs.compoundingFrequency) {
      case "monthly":
        return "Interest compounds monthly (12x per year)";
      case "quarterly":
        return "Interest compounds quarterly (4x per year)";
      case "annually":
        return "Interest compounds annually (1x per year)";
      default:
        return "Monthly compounding";
    }
  };

  return (
    <div id="investment-calculator" className="max-w-7xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Investment Calculator
        </h1>
        <p className="text-gray-600">
          Plan your retirement and calculate investment growth with compound interest
        </p>
      </div>
      <div className="flex justify-end mb-6">
        <ExportButton
          data={{ inputs, results }}
          calculatorElementId="investment-calculator"
          className="no-print"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-1 space-y-6">
          {/* Investment Details */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Investment Details
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Investment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currencies[inputs.currency as keyof typeof currencies]?.symbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.initialInvestment}
                    onChange={(e) => handleInputChange("initialInvestment", e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currencies[inputs.currency as keyof typeof currencies]?.symbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.monthlyContribution}
                    onChange={(e) => handleInputChange("monthlyContribution", e.target.value)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Annual Return (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.annualReturn}
                    onChange={(e) => handleInputChange("annualReturn", e.target.value)}
                    className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    max="50"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Investment Period (Years)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="number"
                    value={inputs.investmentPeriod}
                    onChange={(e) => handleInputChange("investmentPeriod", e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="1"
                    max="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={inputs.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  {Object.entries(currencies).map(([code, currency]) => (
                    <option key={code} value={code}>
                      {currency.symbol} {code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Advanced Options
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compounding Frequency
                </label>
                <select
                  value={inputs.compoundingFrequency}
                  onChange={(e) => handleInputChange("compoundingFrequency", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {getFrequencyDescription()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Inflation Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.inflationRate}
                    onChange={(e) => handleInputChange("inflationRate", e.target.value)}
                    className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="20"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Used to calculate real purchasing power
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Annual Contribution Increase (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.contributionIncrease}
                    onChange={(e) => handleInputChange("contributionIncrease", e.target.value)}
                    className="w-full pl-4 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    max="20"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Automatic yearly increases to monthly contributions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Final Investment Value</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(results.finalAmount, inputs.currency)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Contributions</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(results.totalContributions, inputs.currency)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Investment Growth</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(results.totalGrowth, inputs.currency)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Percent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Real Value (Inflation Adjusted)</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(results.realValue, inputs.currency)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
                Investment Growth Visualization
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setChartView("growth")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === "growth"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Growth Over Time
                </button>
                <button
                  onClick={() => setChartView("contributions")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === "contributions"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Contributions vs Growth
                </button>
                <button
                  onClick={() => setChartView("breakdown")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === "breakdown"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Final Breakdown
                </button>
                <button
                  onClick={() => setChartView("real")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === "real"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Real vs Nominal
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === "growth" && (
                  <LineChart data={growthChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis
                      tickFormatter={(value) =>
                        formatCurrency(value, inputs.currency)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, inputs.currency)
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalValue"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Total Investment Value"
                    />
                  </LineChart>
                )}

                {chartView === "contributions" && (
                  <AreaChart data={growthChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis
                      tickFormatter={(value) =>
                        formatCurrency(value, inputs.currency)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, inputs.currency)
                      }
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="contributions"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      name="Total Contributions"
                    />
                    <Area
                      type="monotone"
                      dataKey="growth"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      name="Investment Growth"
                    />
                  </AreaChart>
                )}

                {chartView === "breakdown" && (
                  <PieChart>
                    <Pie
                      data={breakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(1)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {breakdownData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, inputs.currency)
                      }
                    />
                  </PieChart>
                )}

                {chartView === "real" && (
                  <LineChart data={growthChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis
                      tickFormatter={(value) =>
                        formatCurrency(value, inputs.currency)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        formatCurrency(value, inputs.currency)
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalValue"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Nominal Value"
                    />
                    <Line
                      type="monotone"
                      dataKey="realValue"
                      stroke="#8b5cf6"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Real Value (Inflation Adjusted)"
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly Breakdown Table */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Yearly Investment Breakdown
              </h3>
              {showBreakdown ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showBreakdown && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-medium text-gray-700">
                        Year
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Starting Balance
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Contributions
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Growth
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Ending Balance
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Real Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyBreakdown.map((year) => (
                      <tr
                        key={year.year}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-2 px-2 font-medium">{year.year}</td>
                        <td className="py-2 px-2 text-right">
                          {formatCurrency(year.startingBalance, inputs.currency)}
                        </td>
                        <td className="py-2 px-2 text-right text-blue-600">
                          {formatCurrency(year.contributions, inputs.currency)}
                        </td>
                        <td className="py-2 px-2 text-right text-green-600">
                          {formatCurrency(year.growth, inputs.currency)}
                        </td>
                        <td className="py-2 px-2 text-right font-medium">
                          {formatCurrency(year.endingBalance, inputs.currency)}
                        </td>
                        <td className="py-2 px-2 text-right text-purple-600">
                          {formatCurrency(year.realValue, inputs.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
