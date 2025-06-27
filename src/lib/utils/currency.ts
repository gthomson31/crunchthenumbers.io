import { Currency } from '@/lib/types/calculator';

export const currencies: Record<string, Currency> = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  CAD: { symbol: 'C$', locale: 'en-CA' },
  AUD: { symbol: 'A$', locale: 'en-AU' },
  JPY: { symbol: '¥', locale: 'ja-JP' }
};

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencies[currencyCode];
  if (currencyCode === 'JPY') {
    return currency.symbol + Math.round(amount).toLocaleString(currency.locale);
  }
  return currency.symbol + amount.toLocaleString(currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
