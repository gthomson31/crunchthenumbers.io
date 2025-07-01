import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MortgageInputs, MortgageResults, LoanInputs, LoanResults } from '@/lib/types/calculator';
import { formatCurrency } from './currency';

export interface ExportData {
  inputs: MortgageInputs;
  results: MortgageResults;
}

export interface LoanExportData {
  inputs: LoanInputs;
  results: LoanResults;
}

export type CalculatorExportData = ExportData | LoanExportData;

// CSV Export for Amortization Schedule
export const exportToCSV = (data: CalculatorExportData) => {
  const { inputs, results } = data;

  // Create CSV headers
  const headers = [
    'Payment #',
    'Principal Payment',
    'Interest Payment',
    'Total Payment',
    'Remaining Balance'
  ];

  // Convert amortization schedule to CSV format
  const csvRows = [
    headers.join(','),
    ...results.amortizationSchedule.map(payment => [
      payment.month,
      payment.principalPayment.toFixed(2),
      payment.interestPayment.toFixed(2),
      payment.totalPayment.toFixed(2),
      payment.remainingBalance.toFixed(2)
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const fileName = `${inputs.loanType}_amortization_schedule.csv`;
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

  // Check if this is mortgage or loan data
  const isMortgage = 'downPayment' in inputs;

  // Title
  const title = isMortgage
    ? (inputs.loanType === 'mortgage' ? 'Mortgage Calculator Report' : 'Remortgage Calculator Report')
    : `${inputs.loanType.charAt(0).toUpperCase() + inputs.loanType.slice(1)} Loan Calculator Report`;
  pdf.setFontSize(20);
  pdf.text(title, 20, 30);

  // Loan Details
  pdf.setFontSize(16);
  pdf.text('Loan Details', 20, 50);
  pdf.setFontSize(12);

  let yPosition = 65;
  const lineHeight = 8;

  let loanDetails: [string, string][];

  if (isMortgage) {
    const mortgageInputs = inputs as MortgageInputs;
    loanDetails = [
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
    loanDetails = [
      [`Loan Type:`, loanInputs.loanType.charAt(0).toUpperCase() + loanInputs.loanType.slice(1) + ' Loan'],
      [`Loan Amount:`, formatCurrency(loanInputs.loanAmount, loanInputs.currency)],
      [`Interest Rate:`, `${loanInputs.interestRate}%`],
      [`Loan Term:`, `${loanInputs.loanTerm} years`]
    ];
  }

  loanDetails.forEach(([label, value]) => {
    pdf.text(`${label}`, 20, yPosition);
    pdf.text(`${value}`, 120, yPosition);
    yPosition += lineHeight;
  });

  // Payment Summary
  yPosition += 10;
  pdf.setFontSize(16);
  pdf.text(isMortgage ? 'Monthly Payment Breakdown' : 'Payment Summary', 20, yPosition);
  pdf.setFontSize(12);
  yPosition += 15;

  let paymentDetails: [string, string][];

  if (isMortgage) {
    const mortgageInputs = inputs as MortgageInputs;
    const mortgageResults = results as MortgageResults;
    paymentDetails = [
      ['Principal & Interest:', formatCurrency(mortgageResults.monthlyPI, mortgageInputs.currency)],
      ['Property Tax:', formatCurrency(mortgageInputs.propertyTax / 12, mortgageInputs.currency)],
      ['Home Insurance:', formatCurrency(mortgageInputs.homeInsurance / 12, mortgageInputs.currency)],
      ['PMI:', formatCurrency(mortgageInputs.pmi, mortgageInputs.currency)],
      ['Total Monthly Payment:', formatCurrency(mortgageResults.monthlyPayment, mortgageInputs.currency)]
    ];
  } else {
    paymentDetails = [
      ['Monthly Payment:', formatCurrency(results.monthlyPayment, inputs.currency)]
    ];
  }

  paymentDetails.forEach(([label, value], index) => {
    if (index === paymentDetails.length - 1) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
    }
    pdf.text(`${label}`, 20, yPosition);
    pdf.text(`${value}`, 120, yPosition);
    yPosition += lineHeight;
  });

  // Loan Summary
  yPosition += 10;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(16);
  pdf.text('Loan Summary', 20, yPosition);
  pdf.setFontSize(12);
  yPosition += 15;

  const summaryDetails = [
    ['Total Interest:', formatCurrency(results.totalInterest, inputs.currency)],
    ['Total Payment:', formatCurrency(results.totalPayment, inputs.currency)]
  ];

  summaryDetails.forEach(([label, value]) => {
    pdf.text(`${label}`, 20, yPosition);
    pdf.text(`${value}`, 120, yPosition);
    yPosition += lineHeight;
  });

  // Footer
  pdf.setFontSize(8);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 280);

  // Save PDF
  const calculatorType = isMortgage ? inputs.loanType : inputs.loanType;
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
    const isMortgage = 'downPayment' in data.inputs;
    const title = isMortgage
      ? (data.inputs.loanType === 'mortgage' ? 'Mortgage Calculator Report' : 'Remortgage Calculator Report')
      : `${data.inputs.loanType.charAt(0).toUpperCase() + data.inputs.loanType.slice(1)} Loan Calculator Report`;
    pdf.text(title, pdfWidth / 2, 30, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pdfWidth / 2, 40, { align: 'center' });

    // Add the calculator image
    pdf.addImage(imgData, 'PNG', imgX, 50, imgWidth * ratio, imgHeight * ratio);

    // Save PDF
    const fileName = `${data.inputs.loanType}_full_report.pdf`;
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
