export interface MortgageInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  downPayment: number;
  propertyTax: number;
  homeInsurance: number;
  pmi: number;
  currency: string;
  loanType: 'mortgage' | 'remortgage';
  monthlyOverpayment: number;
  lumpSumPayment: number;
  lumpSumYear: number;
}

export interface MortgageResults {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  monthlyPI: number;
  monthlyTaxInsurance: number;
  amortizationSchedule: AmortizationPayment[];
  interestSaved: number;
  timeSaved: number;
}

export interface AmortizationPayment {
  month: number;
  year: number;
  principalPayment: number;
  interestPayment: number;
  remainingBalance: number;
  totalPayment: number;
}

export interface Currency {
  symbol: string;
  locale: string;
}

export interface ExportData {
  inputs: MortgageInputs;
  results: MortgageResults;
}

export interface LoanInputs {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  currency: string;
  loanType: 'personal' | 'auto' | 'student' | 'business';
  monthlyOverpayment: number;
  lumpSumPayment: number;
  lumpSumYear: number;
}

export interface LoanResults {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  amortizationSchedule: AmortizationPayment[];
  interestSaved: number;
  timeSaved: number;
}

export interface LoanExportData {
  inputs: LoanInputs;
  results: LoanResults;
}

export interface InvestmentInputs {
  initialInvestment: number;
  monthlyContribution: number;
  annualReturn: number;
  investmentPeriod: number;
  currency: string;
  compoundingFrequency: 'monthly' | 'quarterly' | 'annually';
  inflationRate: number;
  contributionIncrease: number;
}

export interface InvestmentResults {
  finalAmount: number;
  totalContributions: number;
  totalGrowth: number;
  realValue: number;
  yearlyBreakdown: InvestmentYearData[];
  monthlyBreakdown: InvestmentMonthData[];
}

export interface InvestmentYearData {
  year: number;
  startingBalance: number;
  contributions: number;
  growth: number;
  endingBalance: number;
  realValue: number;
}

export interface InvestmentMonthData {
  month: number;
  year: number;
  monthlyContribution: number;
  growth: number;
  balance: number;
  realValue: number;
}

export interface InvestmentExportData {
  inputs: InvestmentInputs;
  results: InvestmentResults;
}

export interface DebtInputs {
  currency: string;
  payoffStrategy: 'avalanche' | 'snowball' | 'minimum';
  extraPayment: number;
  debts: DebtItem[];
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
  debtType: 'credit_card' | 'personal_loan' | 'auto_loan' | 'student_loan' | 'other';
}

export interface DebtResults {
  totalDebt: number;
  totalMinimumPayment: number;
  totalMonthlyPayment: number;
  payoffTime: number;
  totalInterest: number;
  totalPaid: number;
  interestSaved: number;
  timeSaved: number;
  debtSchedule: DebtPaymentSchedule[];
  monthlyBreakdown: DebtMonthlyPayment[];
}

export interface DebtPaymentSchedule {
  debtId: string;
  debtName: string;
  payoffMonth: number;
  totalPaid: number;
  totalInterest: number;
  monthsToPayoff: number;
}

export interface DebtMonthlyPayment {
  month: number;
  year: number;
  payments: {
    debtId: string;
    debtName: string;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
    isPaidOff: boolean;
  }[];
  totalPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  remainingDebts: number;
  totalRemainingBalance: number;
}

export interface DebtExportData {
  inputs: DebtInputs;
  results: DebtResults;
}

export interface EmergencyFundInputs {
  monthlyExpenses: number;
  currentSavings: number;
  targetMonths: number;
  monthlySavings: number;
  currency: string;
  annualReturn: number;
}

export interface EmergencyFundResults {
  targetAmount: number;
  amountNeeded: number;
  monthsToGoal: number;
  yearsToGoal: number;
  monthlyBreakdown: EmergencyFundMonthData[];
  isGoalMet: boolean;
}

export interface EmergencyFundMonthData {
  month: number;
  monthlyContribution: number;
  interest: number;
  balance: number;
  monthsOfExpensesCovered: number;
}

export interface EmergencyFundExportData {
  inputs: EmergencyFundInputs;
  results: EmergencyFundResults;
}

export interface RetirementInputs {
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  currentBalance: number;
  employeeContribution: number;
  employerMatch: number;
  employerMatchLimit: number;
  salaryIncrease: number;
  annualReturn: number;
  currency: string;
}

export interface RetirementResults {
  yearsToRetirement: number;
  totalContributions: number;
  totalEmployerMatch: number;
  finalBalance: number;
  monthlyRetirementIncome: number;
  yearlyBreakdown: RetirementYearData[];
  employerMatchReceived: number;
}

export interface RetirementYearData {
  age: number;
  year: number;
  salary: number;
  employeeContribution: number;
  employerMatch: number;
  totalContribution: number;
  beginningBalance: number;
  growth: number;
  endingBalance: number;
}

export interface RetirementExportData {
  inputs: RetirementInputs;
  results: RetirementResults;
}

export interface RentBuyInputs {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTax: number;
  homeInsurance: number;
  hoaFees: number;
  maintenanceRate: number;
  monthlyRent: number;
  rentIncrease: number;
  rentersInsurance: number;
  investmentReturn: number;
  yearsToAnalyze: number;
  currency: string;
}

export interface RentBuyResults {
  totalCostToBuy: number;
  totalCostToRent: number;
  costDifference: number;
  isBuyingBetter: boolean;
  breakEvenYear: number;
  yearlyBreakdown: RentBuyYearData[];
  buyingCosts: BuyingCosts;
  rentingCosts: RentingCosts;
}

export interface RentBuyYearData {
  year: number;
  buyingCumulativeCost: number;
  rentingCumulativeCost: number;
  difference: number;
  homeValue: number;
  mortgageBalance: number;
  homeEquity: number;
  investmentBalance: number;
}

export interface BuyingCosts {
  monthlyPayment: number;
  totalInterest: number;
  totalPropertyTax: number;
  totalInsurance: number;
  totalMaintenance: number;
  totalHOA: number;
  closingCosts: number;
}

export interface RentingCosts {
  totalRent: number;
  totalInsurance: number;
  investmentGrowth: number;
  opportunityCost: number;
}

export interface RentBuyExportData {
  inputs: RentBuyInputs;
  results: RentBuyResults;
}

export interface BudgetInputs {
  monthlyIncome: number;
  expenses: BudgetExpense[];
  currency: string;
}

export interface BudgetExpense {
  id: string;
  category: string;
  name: string;
  amount: number;
  type: 'fixed' | 'variable' | 'discretionary';
}

export interface BudgetResults {
  totalIncome: number;
  totalExpenses: number;
  surplus: number;
  deficit: number;
  expensesByCategory: CategorySummary[];
  expensesByType: TypeSummary[];
  savingsRate: number;
  recommendations: string[];
}

export interface CategorySummary {
  category: string;
  amount: number;
  percentage: number;
  type: 'fixed' | 'variable' | 'discretionary';
}

export interface TypeSummary {
  type: 'fixed' | 'variable' | 'discretionary';
  amount: number;
  percentage: number;
}

export interface BudgetExportData {
  inputs: BudgetInputs;
  results: BudgetResults;
}

export interface SavingsGoalInputs {
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  targetDate: string;
  currency: string;
}

export interface SavingsGoalResults {
  monthsToGoal: number;
  yearsToGoal: number;
  totalContributions: number;
  totalInterest: number;
  monthlyBreakdown: SavingsGoalMonthData[];
  isGoalRealistic: boolean;
  recommendedMonthlyAmount: number;
}

export interface SavingsGoalMonthData {
  month: number;
  contribution: number;
  interest: number;
  balance: number;
  percentComplete: number;
}

export interface SavingsGoalExportData {
  inputs: SavingsGoalInputs;
  results: SavingsGoalResults;
}
