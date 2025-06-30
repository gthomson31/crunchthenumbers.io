import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MortgageInputs, MortgageResults } from '@/lib/types/calculator';
import { formatCurrency } from './currency';

export interface ExportData {
  inputs: MortgageInputs;
  results: MortgageResults;
}

// CSV Export for Amortization Schedule
export const exportToCSV = (data: ExportData) => {
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
  link.download = `${inputs.loanType}_amortization_schedule.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// PDF Export - Summary Only
export const exportToPDF = async (data: ExportData) => {
  const { inputs, results } = data;
  const pdf = new jsPDF();

  // Title
  const title = inputs.loanType === 'mortgage' ? 'Mortgage Calculator Report' : 'Remortgage Calculator Report';
  pdf.setFontSize(20);
  pdf.text(title, 20, 30);

  // Loan Details
  pdf.setFontSize(16);
  pdf.text('Loan Details', 20, 50);
  pdf.setFontSize(12);

  let yPosition = 65;
  const lineHeight = 8;

  const loanDetails = [
    [`Loan Type:`, inputs.loanType === 'mortgage' ? 'New Mortgage (Purchase)' : 'Remortgage (Refinance)'],
    [`${inputs.loanType === 'mortgage' ? 'Home Price:' : 'Property Value:'}`, formatCurrency(inputs.loanAmount, inputs.currency)],
    [`${inputs.loanType === 'mortgage' ? 'Down Payment:' : 'Outstanding Balance:'}`, formatCurrency(inputs.downPayment, inputs.currency)],
    [`Loan Amount:`, formatCurrency(inputs.loanAmount - inputs.downPayment, inputs.currency)],
    [`Interest Rate:`, `${inputs.interestRate}%`],
    [`Loan Term:`, `${inputs.loanTerm} years`],
    [`Property Tax (Annual):`, formatCurrency(inputs.propertyTax, inputs.currency)],
    [`Home Insurance (Annual):`, formatCurrency(inputs.homeInsurance, inputs.currency)],
    [`PMI (Monthly):`, formatCurrency(inputs.pmi, inputs.currency)]
  ];

  loanDetails.forEach(([label, value]) => {
    pdf.text(`${label}`, 20, yPosition);
    pdf.text(`${value}`, 120, yPosition);
    yPosition += lineHeight;
  });

  // Payment Summary
  yPosition += 10;
  pdf.setFontSize(16);
  pdf.text('Monthly Payment Breakdown', 20, yPosition);
  pdf.setFontSize(12);
  yPosition += 15;

  const paymentDetails = [
    ['Principal & Interest:', formatCurrency(results.monthlyPI, inputs.currency)],
    ['Property Tax:', formatCurrency(inputs.propertyTax / 12, inputs.currency)],
    ['Home Insurance:', formatCurrency(inputs.homeInsurance / 12, inputs.currency)],
    ['PMI:', formatCurrency(inputs.pmi, inputs.currency)],
    ['Total Monthly Payment:', formatCurrency(results.monthlyPayment, inputs.currency)]
  ];

  paymentDetails.forEach(([label, value], index) => {
    if (index === paymentDetails.length - 1) {
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
    }
    pdf.text(`${label}`, 20, yPosition);
    pdf.text(`${value}`, 120, yPosition);
    yPosition += lineHeight;
  });

  // Loan Summary
  yPosition += 10;
  pdf.setFont(undefined, 'normal');
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
  const fileName = `${inputs.loanType}_calculator_report.pdf`;
  pdf.save(fileName);
};

// PDF Export with Charts
export const exportFullPDFReport = async (elementId: string, data: ExportData) => {
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
    const imgY = 10;

    // Add title page
    pdf.setFontSize(20);
    const title = data.inputs.loanType === 'mortgage' ? 'Mortgage Calculator Report' : 'Remortgage Calculator Report';
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
