'use client';

import React, { useState } from 'react';
import { Download, FileText, Table, Printer, ChevronDown } from 'lucide-react';
import { ExportData, exportToCSV, exportToPDF, exportFullPDFReport, printCalculator } from '@/lib/utils/export';

interface ExportButtonProps {
  data: ExportData;
  calculatorElementId?: string;
  className?: string;
}

export default function ExportButton({
  data,
  calculatorElementId = 'mortgage-calculator',
  className = ''
}: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: 'csv' | 'pdf' | 'fullPdf' | 'print') => {
    setIsExporting(true);
    setIsOpen(false);

    try {
      switch (type) {
        case 'csv':
          exportToCSV(data);
          break;
        case 'pdf':
          await exportToPDF(data);
          break;
        case 'fullPdf':
          await exportFullPDFReport(calculatorElementId, data);
          break;
        case 'print':
          printCalculator();
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText className="w-4 h-4 mr-3" />
              Export Summary as PDF
            </button>

            <button
              onClick={() => handleExport('fullPdf')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FileText className="w-4 h-4 mr-3" />
              Export Report as PDF
            </button>

            <button
              onClick={() => handleExport('csv')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Table className="w-4 h-4 mr-3" />
              Export as CSV
            </button>

            <button
              onClick={() => handleExport('print')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Printer className="w-4 h-4 mr-3" />
              Print Calculator
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
