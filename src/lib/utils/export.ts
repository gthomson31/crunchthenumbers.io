import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MortgageInputs, MortgageResults, LoanInputs, LoanResults, InvestmentInputs, InvestmentResults, DebtInputs, DebtResults } from '@/lib/types/calculator';
import { formatCurrency } from './currency';

export interface ExportData {
  inputs: MortgageInputs;
  results: MortgageResults;
}

export interface LoanExportData {
  inputs: LoanInputs;
  results: LoanResults;
}

export interface InvestmentExportData {
  inputs: InvestmentInputs;
  results: InvestmentResults;
}

export interface DebtExportData {
  inputs: DebtInputs;
  results: DebtResults;
}

export type CalculatorExportData = ExportData | LoanExportData | InvestmentExportData | DebtExportData;

// CSV Export for Amortization Schedule or Investment Breakdown
export const exportToCSV = (data: CalculatorExportData) => {
  const { inputs, results } = data;

  // Check data type
  const isInvestment = 'initialInvestment' in inputs;
  const isDebt = 'debts' in inputs;

  let headers: string[];
  let csvRows: string[];
  let fileName: string;

  if (isInvestment) {
    const investmentInputs = inputs as InvestmentInputs;
    const investmentResults = results as InvestmentResults;

    // Create CSV headers for investment data
    headers = [
      'Year',
      'Starting Balance',
      'Contributions',
      'Growth',
      'Ending Balance',
      'Real Value'
    ];

    // Convert yearly breakdown to CSV format
    csvRows = [
      headers.join(','),
      ...investmentResults.yearlyBreakdown.map(year => [
        year.year,
        year.startingBalance.toFixed(2),
        year.contributions.toFixed(2),
        year.growth.toFixed(2),
        year.endingBalance.toFixed(2),
        year.realValue.toFixed(2)
      ].join(','))
    ];

    fileName = `investment_yearly_breakdown.csv`;
  } else if (isDebt) {
    const debtInputs = inputs as DebtInputs;
    const debtResults = results as DebtResults;

    // Create CSV headers for debt payoff schedule
    headers = [
      'Debt Name',
      'Payoff Month',
      'Months to Payoff',
      'Total Interest',
      'Total Paid'
    ];

    // Convert debt schedule to CSV format
    csvRows = [
      headers.join(','),
      ...debtResults.debtSchedule.map(debt => [
        `"${debt.debtName}"`,
        debt.payoffMonth,
        debt.monthsToPayoff,
        debt.totalInterest.toFixed(2),
        debt.totalPaid.toFixed(2)
      ].join(','))
    ];

    fileName = `debt_payoff_schedule.csv`;
  } else {
    // Original amortization schedule logic for mortgage/loan calculators
    const amortizationResults = results as MortgageResults | LoanResults;
    headers = [
      'Payment #',
      'Principal Payment',
      'Interest Payment',
      'Total Payment',
      'Remaining Balance'
    ];

    // Convert amortization schedule to CSV format
    csvRows = [
      headers.join(','),
      ...amortizationResults.amortizationSchedule.map(payment => [
        payment.month,
        payment.principalPayment.toFixed(2),
        payment.interestPayment.toFixed(2),
        payment.totalPayment.toFixed(2),
        payment.remainingBalance.toFixed(2)
      ].join(','))
    ];

    const loanType = 'loanType' in inputs ? (inputs as LoanInputs).loanType : 'mortgage';
    fileName = `${loanType}_amortization_schedule.csv`;
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// PDF Export - Summary Only
export const exportToPDF = async (data: CalculatorExportData) => {
  const { inputs, results } = data;
  const pdf = new jsPDF();

  // Check data type
  const isInvestment = 'initialInvestment' in inputs;
  const isDebt = 'debts' in inputs;
  const isMortgage = !isInvestment && !isDebt && 'downPayment' in inputs;

  // Title
  let title: string;
  if (isInvestment) {
    title = 'Investment Calculator Report';
  } else if (isDebt) {
    title = 'Debt Payoff Calculator Report';
  } else if (isMortgage) {
    title = inputs.loanType === 'mortgage' ? 'Mortgage Calculator Report' : 'Remortgage Calculator Report';
  } else {
    title = `${inputs.loanType.charAt(0).toUpperCase() + inputs.loanType.slice(1)} Loan Calculator Report`;
  }

  pdf.setFontSize(20);
  pdf.text(title, 20, 30);

  // Details Section
  pdf.setFontSize(16);
  let sectionTitle: string;
  if (isInvestment) {
    sectionTitle = 'Investment Details';
  } else if (isDebt) {
    sectionTitle = 'Debt Details';
  } else {
    sectionTitle = 'Loan Details';
  }
  pdf.text(sectionTitle, 20, 50);
  pdf.setFontSize(12);

  let yPosition = 65;
  const lineHeight = 8;

  let details: [string, string][];

  if (isInvestment) {
    const investmentInputs = inputs as InvestmentInputs;
    details = [
      [`Initial Investment:`, formatCurrency(investmentInputs.initialInvestment, investmentInputs.currency)],
      [`Monthly Contribution:`, formatCurrency(investmentInputs.monthlyContribution, investmentInputs.currency)],
      [`Expected Annual Return:`, `${investmentInputs.annualReturn}%`],
      [`Investment Period:`, `${investmentInputs.investmentPeriod} years`],
      [`Compounding Frequency:`, investmentInputs.compoundingFrequency.charAt(0).toUpperCase() + investmentInputs.compoundingFrequency.slice(1)],
      [`Expected Inflation Rate:`, `${investmentInputs.inflationRate}%`],
      [`Annual Contribution Increase:`, `${investmentInputs.contributionIncrease}%`]
    ];
  } else if (isDebt) {
    const debtInputs = inputs as DebtInputs;
    details = [
      [`Payoff Strategy:`, debtInputs.payoffStrategy === 'avalanche' ? 'Debt Avalanche (Highest Interest First)' :
                          debtInputs.payoffStrategy === 'snowball' ? 'Debt Snowball (Smallest Balance First)' :
                          'Minimum Payments Only'],
      [`Extra Monthly Payment:`, formatCurrency(debtInputs.extraPayment, debtInputs.currency)],
      [`Number of Debts:`, debtInputs.debts.length.toString()],
      [`Total Debt Amount:`, formatCurrency(debtInputs.debts.reduce((sum, debt) => sum + debt.balance, 0), debtInputs.currency)]
    ];
  } else if (isMortgage) {
    const mortgageInputs = inputs as MortgageInputs;
    details = [
      [`Loan Type:`, mortgageInputs.loanType === 'mortgage' ? 'New Mortgage (Purchase)' : 'Remortgage (Refinance)'],
      [`${mortgageInputs.loanType === 'mortgage' ? 'Home Price:' : 'Property Value:'}`, formatCurrency(mortgageInputs.loanAmount, mortgageInputs.currency)],
      [`${mortgageInputs.loanType === 'mortgage' ? 'Down Payment:' : 'Outstanding Balance:'}`, formatCurrency(mortgageInputs.downPayment, mortgageInputs.currency)],
      [`Loan Amount:`, formatCurrency(mortgageInputs.loanAmount - mortgageInputs.downPayment, mortgageInputs.currency)],
      [`Interest Rate:`, `${mortgageInputs.interestRate}%`],
      [`Loan Term:`, `${mortgageInputs.loanTerm} years`],
      [`Property Tax (Annual):`, formatCurrency(mortgageInputs.propertyTax, mortgageInputs.currency)],
      [`Home Insurance (Annual):`, formatCurrency(mortgageInputs.homeInsurance, mortgageInputs.currency)],
      [`PMI (Monthly):`, formatCurrency(mortgageInputs.pmi, mortgageInputs.currency)]
    ];
  } else {
    const loanInputs = inputs as LoanInputs;
    details = [
      [`Loan Type:`, loanInputs.loanType.charAt(0).toUpperCase() + loanInputs.loanType.slice(1) + ' Loan'],
      [`Loan Amount:`, formatCurrency(loanInputs.loanAmount, loanInputs.currency)],
      [`Interest Rate:`, `${loanInputs.interestRate}%`],
      [`Loan Term:`, `${loanInputs.loanTerm} years`]
    ];
  }

  details.forEach(([label, value]) => {
    pdf.text(`${label}`, 20, yPosition);
    pdf.text(`${value}`, 120, yPosition);
    yPosition += lineHeight;
  });

  // Results Summary
  yPosition += 10;
  pdf.setFontSize(16);
  let resultsSectionTitle: string;
  if (isInvestment) {
    resultsSectionTitle = 'Investment Results';
  } else if (isDebt) {
    resultsSectionTitle = 'Debt Payoff Results';
  } else if (isMortgage) {
    resultsSectionTitle = 'Monthly Payment Breakdown';
  } else {
    resultsSectionTitle = 'Payment Summary';
  }
  pdf.text(resultsSectionTitle, 20, yPosition);
  pdf.setFontSize(12);
  yPosition += 15;

  let resultsDetails: [string, string][];

  if (isInvestment) {
    const investmentResults = results as InvestmentResults;
    resultsDetails = [
      ['Final Investment Value:', formatCurrency(investmentResults.finalAmount, inputs.currency)],
      ['Total Contributions:', formatCurrency(investmentResults.totalContributions, inputs.currency)],
      ['Investment Growth:', formatCurrency(investmentResults.totalGrowth, inputs.currency)],
      ['Real Value (Inflation Adjusted):', formatCurrency(investmentResults.realValue, inputs.currency)]
    ];
  } else if (isDebt) {
    const debtResults = results as DebtResults;
    resultsDetails = [
      ['Total Monthly Payment:', formatCurrency(debtResults.totalMonthlyPayment, inputs.currency)],
      ['Payoff Time:', `${Math.floor(debtResults.payoffTime / 12)}y ${debtResults.payoffTime % 12}m`],
      ['Total Interest:', formatCurrency(debtResults.totalInterest, inputs.currency)],
      ['Interest Saved:', formatCurrency(debtResults.interestSaved, inputs.currency)],
      ['Time Saved:', `${Math.floor(debtResults.timeSaved / 12)}y ${debtResults.timeSaved % 12}m`]
    ];
  } else if (isMortgage) {
    const mortgageInputs = inputs as MortgageInputs;
    const mortgageResults = results as MortgageResults;
    resultsDetails = [
      ['Principal & Interest:', formatCurrency(mortgageResults.monthlyPI, mortgageInputs.currency)],
      ['Property Tax:', formatCurrency(mortgageInputs.propertyTax / 12, mortgageInputs.currency)],
      ['Home Insurance:', formatCurrency(mortgageInputs.homeInsurance / 12, mortgageInputs.currency)],
      ['PMI:', formatCurrency(mortgageInputs.pmi, mortgageInputs.currency)],
      ['Total Monthly Payment:', formatCurrency(mortgageResults.monthlyPayment, mortgageInputs.currency)]
    ];
  } else {
    const loanResults = results as LoanResults;
    const loanInputs = inputs as LoanInputs;
    resultsDetails = [
      ['Monthly Payment:', formatCurrency(loanResults.monthlyPayment, loanInputs.currency)]
    ];
  }

  resultsDetails.forEach(([label, value], index) => {
    if (index === resultsDetails.length - 1) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
    }
    pdf.text(`${label}`, 20, yPosition);
    pdf.text(`${value}`, 120, yPosition);
    yPosition += lineHeight;
  });

  // Additional Summary for loan/mortgage calculators only
  if (!isInvestment && !isDebt) {
    yPosition += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(16);
    pdf.text('Loan Summary', 20, yPosition);
    pdf.setFontSize(12);
    yPosition += 15;

    const loanResults = results as MortgageResults | LoanResults;
    const loanInputs = inputs as MortgageInputs | LoanInputs;
    const summaryDetails = [
      ['Total Interest:', formatCurrency(loanResults.totalInterest, loanInputs.currency)],
      ['Total Payment:', formatCurrency(loanResults.totalPayment, loanInputs.currency)]
    ];

    summaryDetails.forEach(([label, value]) => {
      pdf.text(`${label}`, 20, yPosition);
      pdf.text(`${value}`, 120, yPosition);
      yPosition += lineHeight;
    });
  }

  // Footer
  pdf.setFontSize(8);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 280);

  // Save PDF
  let calculatorType: string;
  if (isInvestment) {
    calculatorType = 'investment';
  } else if (isDebt) {
    calculatorType = 'debt_payoff';
  } else if (isMortgage) {
    calculatorType = inputs.loanType;
  } else {
    calculatorType = inputs.loanType;
  }
  const fileName = `${calculatorType}_calculator_report.pdf`;
  pdf.save(fileName);
};

// PDF Export with Charts
export const exportFullPDFReport = async (elementId: string, data: CalculatorExportData) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Calculator element not found');
    }

    // Capture the calculator as an image
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Calculate dimensions to fit the page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;

    // Add title page
    pdf.setFontSize(20);
    const isInvestment = 'initialInvestment' in data.inputs;
    const isDebt = 'debts' in data.inputs;
    const isMortgage = !isInvestment && !isDebt && 'downPayment' in data.inputs;

    let title: string;
    if (isInvestment) {
      title = 'Investment Calculator Report';
    } else if (isDebt) {
      title = 'Debt Payoff Calculator Report';
    } else if (isMortgage) {
      const mortgageInputs = data.inputs as MortgageInputs;
      title = mortgageInputs.loanType === 'mortgage' ? 'Mortgage Calculator Report' : 'Remortgage Calculator Report';
    } else {
      const loanInputs = data.inputs as LoanInputs;
      title = `${loanInputs.loanType.charAt(0).toUpperCase() + loanInputs.loanType.slice(1)} Loan Calculator Report`;
    }
    pdf.text(title, pdfWidth / 2, 30, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pdfWidth / 2, 40, { align: 'center' });

    // Add the calculator image
    pdf.addImage(imgData, 'PNG', imgX, 50, imgWidth * ratio, imgHeight * ratio);

    // Save PDF
    let calculatorType: string;
    if (isInvestment) {
      calculatorType = 'investment';
    } else if (isDebt) {
      calculatorType = 'debt_payoff';
    } else {
      calculatorType = (data.inputs as MortgageInputs | LoanInputs).loanType;
    }
    const fileName = `${calculatorType}_full_report.pdf`;
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to summary PDF
    await exportToPDF(data);
  }
};

// Print Function
export const printCalculator = () => {
  // Hide non-essential elements for printing
  const elementsToHide = document.querySelectorAll('.no-print');
  elementsToHide.forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });

  window.print();

  // Restore elements after printing
  elementsToHide.forEach(el => {
    (el as HTMLElement).style.display = '';
  });
};
