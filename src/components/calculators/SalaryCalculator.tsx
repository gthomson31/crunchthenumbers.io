'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator, DollarSign, PiggyBank, Clock, Settings, FileText } from 'lucide-react';
import { calculateSalary, SalaryCalculationInput, SalaryCalculationResult } from '@/lib/utils/salaryCalculations';
import { formatCurrency } from '@/lib/utils/currency';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ExportButton from '@/components/ui/ExportButton';

interface SalaryCalculatorProps {
  title?: string;
  description?: string;
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({
  title = "Salary Calculator",
  description = "Calculate your take-home pay for US and UK with tax, National Insurance, student loans, and more"
}) => {
  const [inputs, setInputs] = useLocalStorage<SalaryCalculationInput>('salary-calculator', {
    grossSalary: 60000,
    country: 'UK',
    taxCode: '1257L',
    isScottishTaxpayer: false,
    studentLoanPlan: 'none',
    filingStatus: 'single',
    state: '',
    pensionContribution: 5,
    pensionContributionType: 'percentage',
    bonus: 0,
    overtime: 0,
    overtimeRate: 1.5,
    salaryPackaging: [],
    workingDaysPerWeek: 5,
    weeksPerYear: 52,
    blindAllowance: false,
    niExemption: false,
    taxableBenefits: 0,
    childcareVouchers: 0,
  });

  const [results, setResults] = useState<SalaryCalculationResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const calculatedResults = calculateSalary(inputs);
    setResults(calculatedResults);
  }, [inputs]);

  const handleInputChange = (field: keyof SalaryCalculationInput, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberInput = (field: keyof SalaryCalculationInput, value: string) => {
    if (value === '') {
      setInputs(prev => ({ ...prev, [field]: '' }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setInputs(prev => ({ ...prev, [field]: numValue }));
      }
    }
  };

  const formatNumber = (value: number | string) => {
    if (value === '' || value === 0) return '';
    return value.toString();
  };

  const getExportData = () => {
    if (!results) return null;

    const currency = inputs.country === 'UK' ? 'GBP' : 'USD';

    return {
      calculation: 'Salary Calculator',
      inputs: {
        'Gross Salary': formatCurrency(inputs.grossSalary, currency),
        'Country': inputs.country,
        'Tax Code': inputs.taxCode || 'N/A',
        'Scottish Taxpayer': inputs.isScottishTaxpayer ? 'Yes' : 'No',
        'Student Loan Plan': inputs.studentLoanPlan || 'None',
        'Filing Status': inputs.filingStatus || 'N/A',
        'Pension Contribution': inputs.pensionContributionType === 'percentage'
          ? `${inputs.pensionContribution}%`
          : formatCurrency(inputs.pensionContribution || 0, currency),
        'Bonus': formatCurrency(inputs.bonus || 0, currency),
        'Overtime Hours': inputs.overtime || 0,
        'Working Days/Week': inputs.workingDaysPerWeek,
        'Weeks/Year': inputs.weeksPerYear,
      },
      results: {
        'Gross Annual': formatCurrency(results.gross.annual, currency),
        'Gross Monthly': formatCurrency(results.gross.monthly, currency),
        'Income Tax': formatCurrency(results.deductions.incomeTax, currency),
        'National Insurance': results.deductions.nationalInsurance ? formatCurrency(results.deductions.nationalInsurance, currency) : 'N/A',
        'Social Security': results.deductions.fica ? formatCurrency(results.deductions.fica.socialSecurity, currency) : 'N/A',
        'Medicare': results.deductions.fica ? formatCurrency(results.deductions.fica.medicare, currency) : 'N/A',
        'Student Loan': formatCurrency(results.deductions.studentLoan, currency),
        'Pension': formatCurrency(results.deductions.pension, currency),
        'Total Deductions': formatCurrency(results.deductions.totalDeductions, currency),
        'Net Annual': formatCurrency(results.net.annual, currency),
        'Net Monthly': formatCurrency(results.net.monthly, currency),
        'Effective Tax Rate': `${results.effectiveTaxRate.toFixed(2)}%`,
        'Marginal Tax Rate': `${results.marginalTaxRate.toFixed(2)}%`,
      }
    };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Calculator className="h-8 w-8 text-blue-600" />
          {title}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grossSalary">Annual Gross Salary</Label>
                  <Input
                    id="grossSalary"
                    type="number"
                    placeholder="Enter salary"
                    value={formatNumber(inputs.grossSalary)}
                    onChange={(e) => handleNumberInput('grossSalary', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={inputs.country} onValueChange={(value) => handleInputChange('country', value as 'UK' | 'US')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {inputs.country === 'UK' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="taxCode">Tax Code</Label>
                      <Input
                        id="taxCode"
                        placeholder="e.g., 1257L"
                        value={inputs.taxCode || ''}
                        onChange={(e) => handleInputChange('taxCode', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentLoanPlan">Student Loan Plan</Label>
                      <Select value={inputs.studentLoanPlan || 'none'} onValueChange={(value) => handleInputChange('studentLoanPlan', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Student Loan</SelectItem>
                          <SelectItem value="plan_1">Plan 1</SelectItem>
                          <SelectItem value="plan_2">Plan 2</SelectItem>
                          <SelectItem value="plan_4">Plan 4</SelectItem>
                          <SelectItem value="plan_5">Plan 5</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="scottishTaxpayer"
                      checked={inputs.isScottishTaxpayer || false}
                      onCheckedChange={(checked) => handleInputChange('isScottishTaxpayer', checked)}
                    />
                    <Label htmlFor="scottishTaxpayer">Scottish Taxpayer</Label>
                  </div>
                </div>
              )}

              {inputs.country === 'US' && (
                <div>
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select value={inputs.filingStatus || 'single'} onValueChange={(value) => handleInputChange('filingStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filing status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married_filing_jointly">Married Filing Jointly</SelectItem>
                      <SelectItem value="married_filing_separately">Married Filing Separately</SelectItem>
                      <SelectItem value="head_of_household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5" />
                Pension & Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pensionContribution">Pension Contribution</Label>
                  <Input
                    id="pensionContribution"
                    type="number"
                    placeholder="Enter amount"
                    value={formatNumber(inputs.pensionContribution || 0)}
                    onChange={(e) => handleNumberInput('pensionContribution', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="pensionType">Contribution Type</Label>
                  <Select value={inputs.pensionContributionType || 'percentage'} onValueChange={(value) => handleInputChange('pensionContributionType', value as 'percentage' | 'fixed')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Additional Income
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bonus">Annual Bonus</Label>
                  <Input
                    id="bonus"
                    type="number"
                    placeholder="Enter bonus"
                    value={formatNumber(inputs.bonus || 0)}
                    onChange={(e) => handleNumberInput('bonus', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="overtime">Overtime Hours/Month</Label>
                  <Input
                    id="overtime"
                    type="number"
                    placeholder="Enter hours"
                    value={formatNumber(inputs.overtime || 0)}
                    onChange={(e) => handleNumberInput('overtime', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="overtimeRate">Overtime Rate Multiplier</Label>
                <Input
                  id="overtimeRate"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 1.5"
                  value={formatNumber(inputs.overtimeRate || 1.5)}
                  onChange={(e) => handleNumberInput('overtimeRate', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Work Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workingDays">Working Days/Week</Label>
                  <Input
                    id="workingDays"
                    type="number"
                    min="1"
                    max="7"
                    placeholder="5"
                    value={formatNumber(inputs.workingDaysPerWeek || 5)}
                    onChange={(e) => handleNumberInput('workingDaysPerWeek', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="weeksPerYear">Weeks/Year</Label>
                  <Input
                    id="weeksPerYear"
                    type="number"
                    placeholder="52"
                    value={formatNumber(inputs.weeksPerYear || 52)}
                    onChange={(e) => handleNumberInput('weeksPerYear', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {inputs.country === 'UK' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Special Allowances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="blindAllowance"
                    checked={inputs.blindAllowance || false}
                    onCheckedChange={(checked) => handleInputChange('blindAllowance', checked)}
                  />
                  <Label htmlFor="blindAllowance">Blind Person's Allowance</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="niExemption"
                    checked={inputs.niExemption || false}
                    onCheckedChange={(checked) => handleInputChange('niExemption', checked)}
                  />
                  <Label htmlFor="niExemption">National Insurance Exemption</Label>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {results && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Take-Home Pay Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Gross Pay</div>
                      <div className="text-lg font-semibold">{formatCurrency(results.gross.annual, inputs.country === 'UK' ? 'GBP' : 'USD')}</div>
                      <div className="text-xs text-gray-600">Annual</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Net Pay</div>
                      <div className="text-lg font-semibold text-green-600">{formatCurrency(results.net.annual, inputs.country === 'UK' ? 'GBP' : 'USD')}</div>
                      <div className="text-xs text-gray-600">Annual</div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs text-gray-500">Monthly Gross</div>
                      <div className="font-medium">{formatCurrency(results.gross.monthly, inputs.country === 'UK' ? 'GBP' : 'USD')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Monthly Net</div>
                      <div className="font-medium text-green-600">{formatCurrency(results.net.monthly, inputs.country === 'UK' ? 'GBP' : 'USD')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Weekly Gross</div>
                      <div className="font-medium">{formatCurrency(results.gross.weekly, inputs.country === 'UK' ? 'GBP' : 'USD')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Weekly Net</div>
                      <div className="font-medium text-green-600">{formatCurrency(results.net.weekly, inputs.country === 'UK' ? 'GBP' : 'USD')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax & Deductions Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Income Tax</span>
                      <span className="font-medium">{formatCurrency(results.deductions.incomeTax, inputs.country === 'UK' ? 'GBP' : 'USD')}</span>
                    </div>
                    {results.deductions.nationalInsurance !== undefined && (
                      <div className="flex justify-between">
                        <span>National Insurance</span>
                        <span className="font-medium">{formatCurrency(results.deductions.nationalInsurance, inputs.country === 'UK' ? 'GBP' : 'USD')}</span>
                      </div>
                    )}
                    {results.deductions.fica && (
                      <>
                        <div className="flex justify-between">
                          <span>Social Security</span>
                          <span className="font-medium">{formatCurrency(results.deductions.fica.socialSecurity, inputs.country === 'UK' ? 'GBP' : 'USD')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medicare</span>
                          <span className="font-medium">{formatCurrency(results.deductions.fica.medicare, inputs.country === 'UK' ? 'GBP' : 'USD')}</span>
                        </div>
                      </>
                    )}
                    {results.deductions.studentLoan > 0 && (
                      <div className="flex justify-between">
                        <span>Student Loan</span>
                        <span className="font-medium">{formatCurrency(results.deductions.studentLoan, inputs.country === 'UK' ? 'GBP' : 'USD')}</span>
                      </div>
                    )}
                    {results.deductions.pension > 0 && (
                      <div className="flex justify-between">
                        <span>Pension</span>
                        <span className="font-medium">{formatCurrency(results.deductions.pension, inputs.country === 'UK' ? 'GBP' : 'USD')}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total Deductions</span>
                      <span>{formatCurrency(results.deductions.totalDeductions, inputs.country === 'UK' ? 'GBP' : 'USD')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Effective Tax Rate</span>
                      <span className="font-medium">{results.effectiveTaxRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marginal Tax Rate</span>
                      <span className="font-medium">{results.marginalTaxRate.toFixed(2)}%</span>
                    </div>
                    {results.breakdown.personalAllowance && (
                      <div className="flex justify-between">
                        <span>Personal Allowance</span>
                        <span className="font-medium">{formatCurrency(results.breakdown.personalAllowance, inputs.country === 'UK' ? 'GBP' : 'USD')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center">
                {getExportData() && (
                  <ExportButton
                    data={getExportData() as any}
                    filename="salary-calculation"
                    calculatorType="Salary Calculator"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
