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
  CreditCard,
  DollarSign,
  Calendar,
  Target,
  Plus,
  Trash2,
  Edit3,
} from "lucide-react";
import ExportButton from "@/components/ui/ExportButton";
import { formatCurrency, currencies } from "@/lib/utils/currency";
import { DebtInputs, DebtResults, DebtItem } from "@/lib/types/calculator";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function DebtPayoffCalculator() {
  const [savedCurrency, setSavedCurrency] = useLocalStorage(
    "selectedCurrency",
    "USD"
  );

  const [inputs, setInputs] = useState<DebtInputs>({
    currency: savedCurrency,
    payoffStrategy: "avalanche",
    extraPayment: 100,
    debts: [
      {
        id: "1",
        name: "Credit Card 1",
        balance: 5000,
        interestRate: 18.99,
        minimumPayment: 125,
        debtType: "credit_card",
      },
      {
        id: "2",
        name: "Credit Card 2",
        balance: 3000,
        interestRate: 22.99,
        minimumPayment: 85,
        debtType: "credit_card",
      },
      {
        id: "3",
        name: "Auto Loan",
        balance: 15000,
        interestRate: 6.5,
        minimumPayment: 350,
        debtType: "auto_loan",
      },
    ],
  });

  const [results, setResults] = useState<DebtResults>({
    totalDebt: 0,
    totalMinimumPayment: 0,
    totalMonthlyPayment: 0,
    payoffTime: 0,
    totalInterest: 0,
    totalPaid: 0,
    interestSaved: 0,
    timeSaved: 0,
    debtSchedule: [],
    monthlyBreakdown: [],
  });

  const [showSchedule, setShowSchedule] = useState(false);
  const [chartView, setChartView] = useState<
    "balance" | "payments" | "breakdown" | "progress"
  >("balance");
  const [editingDebt, setEditingDebt] = useState<string | null>(null);

  // Calculate debt payoff details
  useEffect(() => {
    const calculateDebtPayoff = () => {
      if (inputs.debts.length === 0) {
        setResults({
          totalDebt: 0,
          totalMinimumPayment: 0,
          totalMonthlyPayment: 0,
          payoffTime: 0,
          totalInterest: 0,
          totalPaid: 0,
          interestSaved: 0,
          timeSaved: 0,
          debtSchedule: [],
          monthlyBreakdown: [],
        });
        return;
      }

      const totalDebt = inputs.debts.reduce((sum, debt) => sum + debt.balance, 0);
      const totalMinimumPayment = inputs.debts.reduce(
        (sum, debt) => sum + debt.minimumPayment,
        0
      );
      const totalMonthlyPayment = totalMinimumPayment + inputs.extraPayment;

      // Calculate minimum payment scenario first (for comparison)
      const minimumResults = calculatePayoffScenario(inputs.debts, 0, "minimum");

      // Calculate chosen strategy
      const strategyResults = calculatePayoffScenario(
        inputs.debts,
        inputs.extraPayment,
        inputs.payoffStrategy
      );

      const interestSaved = minimumResults.totalInterest - strategyResults.totalInterest;
      const timeSaved = minimumResults.payoffTime - strategyResults.payoffTime;

      setResults({
        totalDebt,
        totalMinimumPayment,
        totalMonthlyPayment,
        payoffTime: strategyResults.payoffTime,
        totalInterest: strategyResults.totalInterest,
        totalPaid: strategyResults.totalPaid,
        interestSaved: Math.max(0, interestSaved),
        timeSaved: Math.max(0, timeSaved),
        debtSchedule: strategyResults.debtSchedule,
        monthlyBreakdown: strategyResults.monthlyBreakdown,
      });
    };

    calculateDebtPayoff();
  }, [inputs]);

  const calculatePayoffScenario = (
    debts: DebtItem[],
    extraPayment: number,
    strategy: "avalanche" | "snowball" | "minimum"
  ) => {
    // Create working copies of debts
    let workingDebts = debts.map((debt) => ({ ...debt }));
    const debtSchedule = [];
    const monthlyBreakdown = [];

    let month = 0;
    let totalInterest = 0;
    let totalPaid = 0;

    // Sort debts based on strategy
    if (strategy === "avalanche") {
      workingDebts.sort((a, b) => b.interestRate - a.interestRate);
    } else if (strategy === "snowball") {
      workingDebts.sort((a, b) => a.balance - b.balance);
    }

    let availableExtraPayment = extraPayment;

    while (workingDebts.some((debt) => debt.balance > 0) && month < 600) {
      // Safety limit
      month++;
      const currentYear = Math.ceil(month / 12);
      const monthInYear = ((month - 1) % 12) + 1;

      let monthlyTotalPayment = 0;
      let monthlyTotalInterest = 0;
      let monthlyTotalPrincipal = 0;
      const monthlyPayments = [];

      // Apply minimum payments to all debts
      for (const debt of workingDebts) {
        if (debt.balance <= 0) continue;

        const monthlyInterestRate = debt.interestRate / 100 / 12;
        const interestPayment = debt.balance * monthlyInterestRate;
        let principalPayment = Math.max(0, debt.minimumPayment - interestPayment);

        // Don't overpay
        if (principalPayment > debt.balance) {
          principalPayment = debt.balance;
        }

        const totalPayment = interestPayment + principalPayment;

        debt.balance -= principalPayment;
        totalInterest += interestPayment;
        totalPaid += totalPayment;
        monthlyTotalPayment += totalPayment;
        monthlyTotalInterest += interestPayment;
        monthlyTotalPrincipal += principalPayment;

        monthlyPayments.push({
          debtId: debt.id,
          debtName: debt.name,
          payment: Math.round(totalPayment * 100) / 100,
          principal: Math.round(principalPayment * 100) / 100,
          interest: Math.round(interestPayment * 100) / 100,
          remainingBalance: Math.round(debt.balance * 100) / 100,
          isPaidOff: debt.balance <= 0,
        });

        // Record when debt is paid off
        if (debt.balance <= 0 && !debtSchedule.find((d) => d.debtId === debt.id)) {
          debtSchedule.push({
            debtId: debt.id,
            debtName: debt.name,
            payoffMonth: month,
            totalPaid: Math.round(totalPaid * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100,
            monthsToPayoff: month,
          });
        }
      }

      // Apply extra payment to target debt (if strategy is not minimum)
      if (availableExtraPayment > 0 && strategy !== "minimum") {
        // Find the target debt based on strategy
        let targetDebt = null;
        if (strategy === "avalanche") {
          targetDebt = workingDebts
            .filter((debt) => debt.balance > 0)
            .sort((a, b) => b.interestRate - a.interestRate)[0];
        } else if (strategy === "snowball") {
          targetDebt = workingDebts
            .filter((debt) => debt.balance > 0)
            .sort((a, b) => a.balance - b.balance)[0];
        }

        if (targetDebt) {
          let extraPrincipal = Math.min(availableExtraPayment, targetDebt.balance);
          targetDebt.balance -= extraPrincipal;
          totalPaid += extraPrincipal;
          monthlyTotalPayment += extraPrincipal;
          monthlyTotalPrincipal += extraPrincipal;

          // Update the payment record for this debt
          const paymentRecord = monthlyPayments.find(
            (p) => p.debtId === targetDebt.id
          );
          if (paymentRecord) {
            paymentRecord.payment += extraPrincipal;
            paymentRecord.principal += extraPrincipal;
            paymentRecord.remainingBalance = Math.round(targetDebt.balance * 100) / 100;
            paymentRecord.isPaidOff = targetDebt.balance <= 0;
          }

          // Record when debt is paid off
          if (
            targetDebt.balance <= 0 &&
            !debtSchedule.find((d) => d.debtId === targetDebt.id)
          ) {
            debtSchedule.push({
              debtId: targetDebt.id,
              debtName: targetDebt.name,
              payoffMonth: month,
              totalPaid: Math.round(totalPaid * 100) / 100,
              totalInterest: Math.round(totalInterest * 100) / 100,
              monthsToPayoff: month,
            });
          }
        }
      }

      const remainingDebts = workingDebts.filter((debt) => debt.balance > 0).length;
      const totalRemainingBalance = workingDebts.reduce(
        (sum, debt) => sum + debt.balance,
        0
      );

      monthlyBreakdown.push({
        month: monthInYear,
        year: currentYear,
        payments: monthlyPayments,
        totalPayment: Math.round(monthlyTotalPayment * 100) / 100,
        totalInterest: Math.round(monthlyTotalInterest * 100) / 100,
        totalPrincipal: Math.round(monthlyTotalPrincipal * 100) / 100,
        remainingDebts,
        totalRemainingBalance: Math.round(totalRemainingBalance * 100) / 100,
      });

      // Break if all debts are paid off
      if (remainingDebts === 0) break;
    }

    return {
      payoffTime: month,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      debtSchedule,
      monthlyBreakdown,
    };
  };

  const handleInputChange = (field: keyof DebtInputs, value: string | number) => {
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "currency") {
      setSavedCurrency(value as string);
    }
  };

  const addDebt = () => {
    const newDebt: DebtItem = {
      id: Date.now().toString(),
      name: `Debt ${inputs.debts.length + 1}`,
      balance: 1000,
      interestRate: 15.0,
      minimumPayment: 25,
      debtType: "credit_card",
    };

    setInputs((prev) => ({
      ...prev,
      debts: [...prev.debts, newDebt],
    }));
  };

  const updateDebt = (debtId: string, field: keyof DebtItem, value: string | number) => {
    setInputs((prev) => ({
      ...prev,
      debts: prev.debts.map((debt) =>
        debt.id === debtId ? { ...debt, [field]: value } : debt
      ),
    }));
  };

  const removeDebt = (debtId: string) => {
    setInputs((prev) => ({
      ...prev,
      debts: prev.debts.filter((debt) => debt.id !== debtId),
    }));
  };

  // Prepare chart data
  const balanceChartData = results.monthlyBreakdown.map((month) => ({
    month: `${month.year}-${month.month.toString().padStart(2, "0")}`,
    balance: month.totalRemainingBalance,
    payment: month.totalPayment,
    interest: month.totalInterest,
    principal: month.totalPrincipal,
  }));

  // Pie chart data for debt breakdown
  const debtBreakdownData = inputs.debts.map((debt, index) => ({
    name: debt.name,
    value: debt.balance,
    color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"][
      index % 6
    ],
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

  const getStrategyDescription = () => {
    switch (inputs.payoffStrategy) {
      case "avalanche":
        return "Pay minimums on all debts, then put extra payments toward the highest interest rate debt first";
      case "snowball":
        return "Pay minimums on all debts, then put extra payments toward the smallest balance debt first";
      case "minimum":
        return "Pay only the minimum required payments on all debts";
      default:
        return "";
    }
  };

  const getDebtTypeIcon = (debtType: string) => {
    switch (debtType) {
      case "credit_card":
        return <CreditCard className="w-4 h-4" />;
      case "auto_loan":
        return <DollarSign className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  return (
    <div id="debt-payoff-calculator" className="max-w-7xl mx-auto p-6 bg-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Debt Payoff Calculator
        </h1>
        <p className="text-gray-600">
          Create a strategy to pay off credit cards and other debts faster
        </p>
      </div>
      <div className="flex justify-end mb-6">
        <ExportButton
          data={{ inputs, results }}
          calculatorElementId="debt-payoff-calculator"
          className="no-print"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-1 space-y-6">
          {/* Strategy Settings */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                Payoff Strategy
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Strategy
                </label>
                <select
                  value={inputs.payoffStrategy}
                  onChange={(e) =>
                    handleInputChange(
                      "payoffStrategy",
                      e.target.value as "avalanche" | "snowball" | "minimum"
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="avalanche">Debt Avalanche (Highest Interest First)</option>
                  <option value="snowball">Debt Snowball (Smallest Balance First)</option>
                  <option value="minimum">Minimum Payments Only</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {getStrategyDescription()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extra Monthly Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {currencies[inputs.currency as keyof typeof currencies]?.symbol}
                  </span>
                  <input
                    type="number"
                    value={inputs.extraPayment}
                    onChange={(e) => handleInputChange("extraPayment", parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    min="0"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Additional amount to pay beyond minimums
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={inputs.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
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

          {/* Debts List */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Your Debts</h3>
              </div>
              <button
                onClick={addDebt}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Debt
              </button>
            </div>

            <div className="space-y-4">
              {inputs.debts.map((debt) => (
                <div
                  key={debt.id}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {getDebtTypeIcon(debt.debtType)}
                      <span className="ml-2 font-medium">{debt.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setEditingDebt(editingDebt === debt.id ? null : debt.id)
                        }
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeDebt(debt.id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={inputs.debts.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {editingDebt === debt.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={debt.name}
                        onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Debt name"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Balance
                          </label>
                          <input
                            type="number"
                            value={debt.balance}
                            onChange={(e) =>
                              updateDebt(debt.id, "balance", parseFloat(e.target.value) || 0)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Interest Rate (%)
                          </label>
                          <input
                            type="number"
                            value={debt.interestRate}
                            onChange={(e) =>
                              updateDebt(
                                debt.id,
                                "interestRate",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            step="0.1"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Minimum Payment
                          </label>
                          <input
                            type="number"
                            value={debt.minimumPayment}
                            onChange={(e) =>
                              updateDebt(
                                debt.id,
                                "minimumPayment",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Type
                          </label>
                          <select
                            value={debt.debtType}
                            onChange={(e) =>
                              updateDebt(debt.id, "debtType", e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="credit_card">Credit Card</option>
                            <option value="personal_loan">Personal Loan</option>
                            <option value="auto_loan">Auto Loan</option>
                            <option value="student_loan">Student Loan</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Balance:</span>
                        <div className="font-medium">
                          {formatCurrency(debt.balance, inputs.currency)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Interest:</span>
                        <div className="font-medium">{debt.interestRate}%</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Min Payment:</span>
                        <div className="font-medium">
                          {formatCurrency(debt.minimumPayment, inputs.currency)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <div className="font-medium capitalize">
                          {debt.debtType.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Total Debt</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(results.totalDebt, inputs.currency)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Monthly Payment</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(results.totalMonthlyPayment, inputs.currency)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Payoff Time</p>
                  <p className="text-3xl font-bold">
                    {Math.floor(results.payoffTime / 12)}y {results.payoffTime % 12}m
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Total Interest</p>
                  <p className="text-3xl font-bold">
                    {formatCurrency(results.totalInterest, inputs.currency)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Savings Display */}
          {(results.interestSaved > 0 || results.timeSaved > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-6 rounded-lg text-white">
                <div>
                  <p className="text-purple-100 text-sm">Interest Saved</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(results.interestSaved, inputs.currency)}
                  </p>
                  <p className="text-purple-200 text-xs">vs. minimum payments only</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 rounded-lg text-white">
                <div>
                  <p className="text-teal-100 text-sm">Time Saved</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(results.timeSaved / 12)}y {results.timeSaved % 12}m
                  </p>
                  <p className="text-teal-200 text-xs">vs. minimum payments only</p>
                </div>
              </div>
            </div>
          )}

          {/* Chart Section */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
                Debt Payoff Visualization
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setChartView("balance")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === "balance"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Balance Over Time
                </button>
                <button
                  onClick={() => setChartView("payments")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === "payments"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Monthly Payments
                </button>
                <button
                  onClick={() => setChartView("breakdown")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === "breakdown"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Debt Breakdown
                </button>
                <button
                  onClick={() => setChartView("progress")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    chartView === "progress"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Progress
                </button>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {chartView === "balance" && (
                  <LineChart data={balanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
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
                      dataKey="balance"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Remaining Balance"
                    />
                  </LineChart>
                )}

                {chartView === "payments" && (
                  <AreaChart data={balanceChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
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
                      dataKey="interest"
                      stackId="1"
                      stroke="#f59e0b"
                      fill="#f59e0b"
                      name="Interest Payment"
                    />
                    <Area
                      type="monotone"
                      dataKey="principal"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      name="Principal Payment"
                    />
                  </AreaChart>
                )}

                {chartView === "breakdown" && (
                  <PieChart>
                    <Pie
                      data={debtBreakdownData}
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
                      {debtBreakdownData.map((entry, index) => (
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

                {chartView === "progress" && (
                  <BarChart data={results.debtSchedule}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="debtName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="monthsToPayoff" fill="#10b981" name="Months to Payoff" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payoff Schedule */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Debt Payoff Schedule
              </h3>
              {showSchedule ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showSchedule && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-medium text-gray-700">
                        Debt Name
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Payoff Month
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Months to Payoff
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Total Interest
                      </th>
                      <th className="text-right py-2 px-2 font-medium text-gray-700">
                        Total Paid
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.debtSchedule.map((debt) => (
                      <tr
                        key={debt.debtId}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-2 px-2 font-medium">{debt.debtName}</td>
                        <td className="py-2 px-2 text-right">
                          Month {debt.payoffMonth}
                        </td>
                        <td className="py-2 px-2 text-right">
                          {debt.monthsToPayoff}
                        </td>
                        <td className="py-2 px-2 text-right text-orange-600">
                          {formatCurrency(debt.totalInterest, inputs.currency)}
                        </td>
                        <td className="py-2 px-2 text-right font-medium">
                          {formatCurrency(debt.totalPaid, inputs.currency)}
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
