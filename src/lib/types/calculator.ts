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
