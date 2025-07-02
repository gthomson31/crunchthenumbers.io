// UK Tax Bands and Rates for 2024/25 tax year
export const UK_TAX_BANDS_2024_25 = {
  personal_allowance: 12570,
  basic_rate_threshold: 50270,
  higher_rate_threshold: 125140,
  basic_rate: 0.20,
  higher_rate: 0.40,
  additional_rate: 0.45,
  // Scottish rates
  scottish_starter_rate: 0.19,
  scottish_basic_rate: 0.20,
  scottish_intermediate_rate: 0.21,
  scottish_higher_rate: 0.42,
  scottish_top_rate: 0.47,
  scottish_starter_threshold: 14876,
  scottish_basic_threshold: 26561,
  scottish_intermediate_threshold: 43662,
  scottish_higher_threshold: 75000,
};

// UK National Insurance rates for 2024/25
export const UK_NI_RATES_2024_25 = {
  lower_earnings_limit: 6396,
  primary_threshold: 12570,
  upper_earnings_limit: 50270,
  employee_rate: 0.12,
  employee_rate_above_uel: 0.02,
};

// UK Student Loan rates
export const UK_STUDENT_LOAN_RATES = {
  plan_1: {
    threshold: 22015,
    rate: 0.09,
  },
  plan_2: {
    threshold: 27295,
    rate: 0.09,
  },
  plan_4: {
    threshold: 31395,
    rate: 0.09,
  },
  plan_5: {
    threshold: 25000,
    rate: 0.09,
  },
  postgraduate: {
    threshold: 21000,
    rate: 0.06,
  },
};

// US Federal Tax Brackets for 2024
export const US_FEDERAL_TAX_BRACKETS_2024 = {
  single: [
    { min: 0, max: 11000, rate: 0.10 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 },
  ],
  married_filing_jointly: [
    { min: 0, max: 22000, rate: 0.10 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 },
  ],
};

// US FICA rates
export const US_FICA_RATES = {
  social_security: {
    rate: 0.062,
    wage_base: 160200,
  },
  medicare: {
    rate: 0.0145,
    additional_rate: 0.009,
    additional_threshold_single: 200000,
    additional_threshold_married: 250000,
  },
};

export interface SalaryCalculationInput {
  // Basic inputs
  grossSalary: number;
  country: 'UK' | 'US';

  // UK specific
  taxCode?: string;
  isScottishTaxpayer?: boolean;
  studentLoanPlan?: 'plan_1' | 'plan_2' | 'plan_4' | 'plan_5' | 'postgraduate' | 'none';

  // US specific
  filingStatus?: 'single' | 'married_filing_jointly' | 'married_filing_separately' | 'head_of_household';
  state?: string;

  // Common options
  pensionContribution?: number;
  pensionContributionType?: 'percentage' | 'fixed';
  bonus?: number;
  overtime?: number;
  overtimeRate?: number;
  salaryPackaging?: SalaryPackage[];
  workingDaysPerWeek?: number;
  weeksPerYear?: number;

  // Special allowances
  blindAllowance?: boolean;
  niExemption?: boolean;

  // Additional benefits
  taxableBenefits?: number;
  childcareVouchers?: number;
}

export interface SalaryPackage {
  type: 'car' | 'bike' | 'phone' | 'childcare' | 'other';
  value: number;
  description?: string;
}

export interface SalaryCalculationResult {
  gross: {
    annual: number;
    monthly: number;
    weekly: number;
    daily: number;
  };
  deductions: {
    incomeTax: number;
    nationalInsurance?: number;
    fica?: {
      socialSecurity: number;
      medicare: number;
    };
    studentLoan: number;
    pension: number;
    totalDeductions: number;
  };
  net: {
    annual: number;
    monthly: number;
    weekly: number;
    daily: number;
  };
  effectiveTaxRate: number;
  marginalTaxRate: number;
  breakdown: {
    taxBand?: string;
    personalAllowance?: number;
    niContributions?: number;
  };
}

export function calculateUKIncomeTax(
  taxableIncome: number,
  personalAllowance: number = UK_TAX_BANDS_2024_25.personal_allowance,
  isScottish: boolean = false
): number {
  // Apply personal allowance tapering for high earners
  // Personal allowance reduces by £1 for every £2 of income over £100,000
  let adjustedPersonalAllowance = personalAllowance;
  if (taxableIncome > 100000) {
    const reduction = Math.min(personalAllowance, (taxableIncome - 100000) / 2);
    adjustedPersonalAllowance = personalAllowance - reduction;
  }

  if (taxableIncome <= adjustedPersonalAllowance) return 0;

  const taxableAmount = taxableIncome - adjustedPersonalAllowance;
  let tax = 0;

  if (isScottish) {
    // Scottish tax bands
    if (taxableAmount <= UK_TAX_BANDS_2024_25.scottish_starter_threshold - personalAllowance) {
      tax = taxableAmount * UK_TAX_BANDS_2024_25.scottish_starter_rate;
    } else if (taxableAmount <= UK_TAX_BANDS_2024_25.scottish_basic_threshold - personalAllowance) {
      tax = (UK_TAX_BANDS_2024_25.scottish_starter_threshold - personalAllowance) * UK_TAX_BANDS_2024_25.scottish_starter_rate;
      tax += (taxableAmount - (UK_TAX_BANDS_2024_25.scottish_starter_threshold - personalAllowance)) * UK_TAX_BANDS_2024_25.scottish_basic_rate;
    } else if (taxableAmount <= UK_TAX_BANDS_2024_25.scottish_intermediate_threshold - personalAllowance) {
      tax = (UK_TAX_BANDS_2024_25.scottish_starter_threshold - personalAllowance) * UK_TAX_BANDS_2024_25.scottish_starter_rate;
      tax += (UK_TAX_BANDS_2024_25.scottish_basic_threshold - UK_TAX_BANDS_2024_25.scottish_starter_threshold) * UK_TAX_BANDS_2024_25.scottish_basic_rate;
      tax += (taxableAmount - (UK_TAX_BANDS_2024_25.scottish_basic_threshold - personalAllowance)) * UK_TAX_BANDS_2024_25.scottish_intermediate_rate;
    } else if (taxableAmount <= UK_TAX_BANDS_2024_25.scottish_higher_threshold - personalAllowance) {
      tax = (UK_TAX_BANDS_2024_25.scottish_starter_threshold - personalAllowance) * UK_TAX_BANDS_2024_25.scottish_starter_rate;
      tax += (UK_TAX_BANDS_2024_25.scottish_basic_threshold - UK_TAX_BANDS_2024_25.scottish_starter_threshold) * UK_TAX_BANDS_2024_25.scottish_basic_rate;
      tax += (UK_TAX_BANDS_2024_25.scottish_intermediate_threshold - UK_TAX_BANDS_2024_25.scottish_basic_threshold) * UK_TAX_BANDS_2024_25.scottish_intermediate_rate;
      tax += (taxableAmount - (UK_TAX_BANDS_2024_25.scottish_intermediate_threshold - personalAllowance)) * UK_TAX_BANDS_2024_25.scottish_higher_rate;
    } else {
      tax = (UK_TAX_BANDS_2024_25.scottish_starter_threshold - personalAllowance) * UK_TAX_BANDS_2024_25.scottish_starter_rate;
      tax += (UK_TAX_BANDS_2024_25.scottish_basic_threshold - UK_TAX_BANDS_2024_25.scottish_starter_threshold) * UK_TAX_BANDS_2024_25.scottish_basic_rate;
      tax += (UK_TAX_BANDS_2024_25.scottish_intermediate_threshold - UK_TAX_BANDS_2024_25.scottish_basic_threshold) * UK_TAX_BANDS_2024_25.scottish_intermediate_rate;
      tax += (UK_TAX_BANDS_2024_25.scottish_higher_threshold - UK_TAX_BANDS_2024_25.scottish_intermediate_threshold) * UK_TAX_BANDS_2024_25.scottish_higher_rate;
      tax += (taxableAmount - (UK_TAX_BANDS_2024_25.scottish_higher_threshold - personalAllowance)) * UK_TAX_BANDS_2024_25.scottish_top_rate;
    }
  } else {
    // England, Wales, Northern Ireland tax bands
    if (taxableAmount <= UK_TAX_BANDS_2024_25.basic_rate_threshold - personalAllowance) {
      tax = taxableAmount * UK_TAX_BANDS_2024_25.basic_rate;
    } else if (taxableAmount <= UK_TAX_BANDS_2024_25.higher_rate_threshold - personalAllowance) {
      tax = (UK_TAX_BANDS_2024_25.basic_rate_threshold - personalAllowance) * UK_TAX_BANDS_2024_25.basic_rate;
      tax += (taxableAmount - (UK_TAX_BANDS_2024_25.basic_rate_threshold - personalAllowance)) * UK_TAX_BANDS_2024_25.higher_rate;
    } else {
      tax = (UK_TAX_BANDS_2024_25.basic_rate_threshold - personalAllowance) * UK_TAX_BANDS_2024_25.basic_rate;
      tax += (UK_TAX_BANDS_2024_25.higher_rate_threshold - UK_TAX_BANDS_2024_25.basic_rate_threshold) * UK_TAX_BANDS_2024_25.higher_rate;
      tax += (taxableAmount - (UK_TAX_BANDS_2024_25.higher_rate_threshold - personalAllowance)) * UK_TAX_BANDS_2024_25.additional_rate;
    }
  }

  return Math.round(tax * 100) / 100;
}

export function calculateUKNationalInsurance(grossSalary: number, niExemption: boolean = false): number {
  if (niExemption || grossSalary <= UK_NI_RATES_2024_25.primary_threshold) return 0;

  let ni = 0;
  const niableEarnings = grossSalary - UK_NI_RATES_2024_25.primary_threshold;

  if (grossSalary <= UK_NI_RATES_2024_25.upper_earnings_limit) {
    ni = niableEarnings * UK_NI_RATES_2024_25.employee_rate;
  } else {
    const earningsUpToUEL = UK_NI_RATES_2024_25.upper_earnings_limit - UK_NI_RATES_2024_25.primary_threshold;
    const earningsAboveUEL = grossSalary - UK_NI_RATES_2024_25.upper_earnings_limit;
    ni = (earningsUpToUEL * UK_NI_RATES_2024_25.employee_rate) + (earningsAboveUEL * UK_NI_RATES_2024_25.employee_rate_above_uel);
  }

  return Math.round(ni * 100) / 100;
}

export function calculateUKStudentLoan(grossSalary: number, plan: string): number {
  if (plan === 'none') return 0;

  const planRates = UK_STUDENT_LOAN_RATES[plan as keyof typeof UK_STUDENT_LOAN_RATES];
  if (!planRates || grossSalary <= planRates.threshold) return 0;

  const repayableAmount = grossSalary - planRates.threshold;
  return Math.round(repayableAmount * planRates.rate * 100) / 100;
}

export function calculateUSFederalTax(grossSalary: number, filingStatus: string): number {
  const brackets = US_FEDERAL_TAX_BRACKETS_2024[filingStatus as keyof typeof US_FEDERAL_TAX_BRACKETS_2024];
  if (!brackets) return 0;

  let tax = 0;
  for (const bracket of brackets) {
    if (grossSalary > bracket.min) {
      const taxableInBracket = Math.min(grossSalary, bracket.max) - bracket.min;
      tax += taxableInBracket * bracket.rate;
    }
  }

  return Math.round(tax * 100) / 100;
}

export function calculateUSFICA(grossSalary: number, filingStatus: string): { socialSecurity: number; medicare: number } {
  const socialSecurity = Math.min(grossSalary, US_FICA_RATES.social_security.wage_base) * US_FICA_RATES.social_security.rate;

  let medicare = grossSalary * US_FICA_RATES.medicare.rate;
  const additionalThreshold = filingStatus === 'married_filing_jointly'
    ? US_FICA_RATES.medicare.additional_threshold_married
    : US_FICA_RATES.medicare.additional_threshold_single;

  if (grossSalary > additionalThreshold) {
    medicare += (grossSalary - additionalThreshold) * US_FICA_RATES.medicare.additional_rate;
  }

  return {
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    medicare: Math.round(medicare * 100) / 100
  };
}

export function parseTaxCode(taxCode: string): { personalAllowance: number; otherAdjustments: number } {
  if (!taxCode) return { personalAllowance: UK_TAX_BANDS_2024_25.personal_allowance, otherAdjustments: 0 };

  const cleanCode = taxCode.toUpperCase().trim();

  // Handle special codes
  if (cleanCode === 'BR') return { personalAllowance: 0, otherAdjustments: 0 };
  if (cleanCode === 'D0') return { personalAllowance: 0, otherAdjustments: 0 };
  if (cleanCode === 'D1') return { personalAllowance: 0, otherAdjustments: 0 };
  if (cleanCode === 'NT') return { personalAllowance: UK_TAX_BANDS_2024_25.personal_allowance, otherAdjustments: 0 };

  // Extract numeric part
  const numericMatch = cleanCode.match(/(\d+)/);
  if (!numericMatch) return { personalAllowance: UK_TAX_BANDS_2024_25.personal_allowance, otherAdjustments: 0 };

  const numericPart = parseInt(numericMatch[1]);
  const personalAllowance = numericPart * 10;

  return { personalAllowance, otherAdjustments: 0 };
}

export function calculateSalary(input: SalaryCalculationInput): SalaryCalculationResult {
  const workingDays = input.workingDaysPerWeek || 5;
  const weeksPerYear = input.weeksPerYear || 52;
  const workingDaysPerYear = workingDays * weeksPerYear;

  // Calculate total gross including bonus and overtime
  let totalGross = input.grossSalary;
  if (input.bonus) totalGross += input.bonus;
  if (input.overtime) {
    const overtimeRate = input.overtimeRate || 1.5;
    const hourlyRate = input.grossSalary / (workingDaysPerYear * 8); // Assuming 8-hour days
    totalGross += input.overtime * hourlyRate * overtimeRate;
  }

  // Calculate pension contribution
  let pensionContribution = 0;
  if (input.pensionContribution && input.pensionContribution > 0) {
    pensionContribution = input.pensionContributionType === 'percentage'
      ? totalGross * (input.pensionContribution / 100)
      : input.pensionContribution;
  }

  // Reduce gross by pension (if pre-tax)
  const pensionReducedGross = totalGross - pensionContribution;

  let incomeTax = 0;
  let nationalInsurance = 0;
  let fica = { socialSecurity: 0, medicare: 0 };
  let studentLoan = 0;

  if (input.country === 'UK') {
    // UK calculations
    const taxCodeInfo = parseTaxCode(input.taxCode || '1257L');
    const personalAllowance = input.blindAllowance
      ? taxCodeInfo.personalAllowance + 2870
      : taxCodeInfo.personalAllowance;

    incomeTax = calculateUKIncomeTax(pensionReducedGross, personalAllowance, input.isScottishTaxpayer);
    nationalInsurance = calculateUKNationalInsurance(pensionReducedGross, input.niExemption);
    studentLoan = calculateUKStudentLoan(pensionReducedGross, input.studentLoanPlan || 'none');
  } else {
    // US calculations
    incomeTax = calculateUSFederalTax(pensionReducedGross, input.filingStatus || 'single');
    fica = calculateUSFICA(pensionReducedGross, input.filingStatus || 'single');
  }

  const totalDeductions = incomeTax + nationalInsurance + fica.socialSecurity + fica.medicare + studentLoan + pensionContribution;
  const netAnnual = totalGross - totalDeductions;

  return {
    gross: {
      annual: totalGross,
      monthly: totalGross / 12,
      weekly: totalGross / weeksPerYear,
      daily: totalGross / workingDaysPerYear,
    },
    deductions: {
      incomeTax,
      nationalInsurance: input.country === 'UK' ? nationalInsurance : undefined,
      fica: input.country === 'US' ? fica : undefined,
      studentLoan,
      pension: pensionContribution,
      totalDeductions,
    },
    net: {
      annual: netAnnual,
      monthly: netAnnual / 12,
      weekly: netAnnual / weeksPerYear,
      daily: netAnnual / workingDaysPerYear,
    },
    effectiveTaxRate: (totalDeductions / totalGross) * 100,
    marginalTaxRate: calculateMarginalRate(pensionReducedGross, input.country, input.isScottishTaxpayer, input.filingStatus),
    breakdown: {
      personalAllowance: input.country === 'UK' ? parseTaxCode(input.taxCode || '1257L').personalAllowance : undefined,
      niContributions: input.country === 'UK' ? nationalInsurance : undefined,
    },
  };
}

function calculateMarginalRate(income: number, country: string, isScottish?: boolean, filingStatus?: string): number {
  if (country === 'UK') {
    const personalAllowance = UK_TAX_BANDS_2024_25.personal_allowance;
    const taxableIncome = Math.max(0, income - personalAllowance);

    if (isScottish) {
      if (taxableIncome <= UK_TAX_BANDS_2024_25.scottish_starter_threshold - personalAllowance) return UK_TAX_BANDS_2024_25.scottish_starter_rate * 100;
      if (taxableIncome <= UK_TAX_BANDS_2024_25.scottish_basic_threshold - personalAllowance) return UK_TAX_BANDS_2024_25.scottish_basic_rate * 100;
      if (taxableIncome <= UK_TAX_BANDS_2024_25.scottish_intermediate_threshold - personalAllowance) return UK_TAX_BANDS_2024_25.scottish_intermediate_rate * 100;
      if (taxableIncome <= UK_TAX_BANDS_2024_25.scottish_higher_threshold - personalAllowance) return UK_TAX_BANDS_2024_25.scottish_higher_rate * 100;
      return UK_TAX_BANDS_2024_25.scottish_top_rate * 100;
    } else {
      if (taxableIncome <= UK_TAX_BANDS_2024_25.basic_rate_threshold - personalAllowance) return UK_TAX_BANDS_2024_25.basic_rate * 100;
      if (taxableIncome <= UK_TAX_BANDS_2024_25.higher_rate_threshold - personalAllowance) return UK_TAX_BANDS_2024_25.higher_rate * 100;
      return UK_TAX_BANDS_2024_25.additional_rate * 100;
    }
  } else {
    const brackets = US_FEDERAL_TAX_BRACKETS_2024[filingStatus as keyof typeof US_FEDERAL_TAX_BRACKETS_2024] || US_FEDERAL_TAX_BRACKETS_2024.single;
    for (const bracket of brackets.reverse()) {
      if (income >= bracket.min) {
        return bracket.rate * 100;
      }
    }
    return 10; // Lowest bracket
  }
}
