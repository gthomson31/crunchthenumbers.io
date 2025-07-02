import { Currency } from '@/lib/types/calculator';

export const currencies: Record<string, Currency> = {
  USD: { symbol: '$', locale: 'en-US' },
  EUR: { symbol: '€', locale: 'de-DE' },
  GBP: { symbol: '£', locale: 'en-GB' },
  CAD: { symbol: 'C$', locale: 'en-CA' },
  AUD: { symbol: 'A$', locale: 'en-AU' },
  JPY: { symbol: '¥', locale: 'ja-JP' }
};

export const formatCurrency = (amount: number, currencyCode: string, abbreviated: boolean = true): string => {
  const currency = currencies[currencyCode];

  if (!abbreviated) {
    // For chart labels - abbreviated format
    if (amount >= 1000000) {
      return currency.symbol + (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return currency.symbol + (amount / 1000).toFixed(0) + 'K';
    }
  }

  if (currencyCode === 'JPY') {
    return currency.symbol + Math.round(amount).toLocaleString(currency.locale);
  }
  return currency.symbol + amount.toLocaleString(currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
