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
