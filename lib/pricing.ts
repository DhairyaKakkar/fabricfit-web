export type Currency = 'SGD' | 'INR' | 'AED' | 'USD';

export interface PlanPricing {
  monthly: number;
  annual: number;
  effectiveMonthly: number;
}

export interface CurrencyConfig {
  symbol: string;
  flag: string;
  label: string;
  plans: {
    starter: PlanPricing;
    pro: PlanPricing;
    business: PlanPricing;
  };
  packs: {
    small: number;
    standard: number;
    large: number;
  };
  topupPacks: {
    fifty: number;
    hundred: number;
    twoHundred: number;
    fiveHundred: number;
  };
  rates: {
    paygStarter: string;
    pro: string;
    business: string;
  };
  addons: {
    watermark: string;
    topupFrom: string;
  };
}

export const PRICING: Record<Currency, CurrencyConfig> = {
  SGD: {
    symbol: 'S$',
    flag: '🇸🇬',
    label: 'SGD',
    plans: {
      starter: { monthly: 40, annual: 400, effectiveMonthly: 34 },
      pro: { monthly: 72, annual: 720, effectiveMonthly: 60 },
      business: { monthly: 160, annual: 1600, effectiveMonthly: 134 },
    },
    packs: { small: 8, standard: 20, large: 50 },
    topupPacks: { fifty: 10, hundred: 20, twoHundred: 40, fiveHundred: 100 },
    rates: { paygStarter: 'S$0.40', pro: 'S$0.36', business: 'S$0.32' },
    addons: { watermark: 'S$8 / month', topupFrom: 'From S$8' },
  },
  INR: {
    symbol: '₹',
    flag: '🇮🇳',
    label: 'INR',
    plans: {
      starter: { monthly: 2500, annual: 25000, effectiveMonthly: 2083 },
      pro: { monthly: 4500, annual: 45000, effectiveMonthly: 3750 },
      business: { monthly: 10000, annual: 100000, effectiveMonthly: 8333 },
    },
    packs: { small: 500, standard: 1250, large: 3125 },
    topupPacks: { fifty: 625, hundred: 1250, twoHundred: 2500, fiveHundred: 6250 },
    rates: { paygStarter: '₹25', pro: '₹22.50', business: '₹20' },
    addons: { watermark: '₹499 / month', topupFrom: 'From ₹500' },
  },
  AED: {
    symbol: 'AED',
    flag: '🇦🇪',
    label: 'AED',
    plans: {
      starter: { monthly: 109, annual: 1090, effectiveMonthly: 91 },
      pro: { monthly: 192, annual: 1920, effectiveMonthly: 160 },
      business: { monthly: 425, annual: 4250, effectiveMonthly: 354 },
    },
    packs: { small: 22, standard: 55, large: 139 },
    topupPacks: { fifty: 28, hundred: 55, twoHundred: 110, fiveHundred: 275 },
    rates: { paygStarter: 'AED 1.10', pro: 'AED 0.96', business: 'AED 0.85' },
    addons: { watermark: 'AED 22 / month', topupFrom: 'From AED 22' },
  },
  USD: {
    symbol: '$',
    flag: '🇺🇸',
    label: 'USD',
    plans: {
      starter: { monthly: 29, annual: 290, effectiveMonthly: 24 },
      pro: { monthly: 52, annual: 520, effectiveMonthly: 43 },
      business: { monthly: 115, annual: 1150, effectiveMonthly: 96 },
    },
    packs: { small: 6, standard: 15, large: 38 },
    topupPacks: { fifty: 8, hundred: 15, twoHundred: 30, fiveHundred: 75 },
    rates: { paygStarter: '$0.30', pro: '$0.26', business: '$0.23' },
    addons: { watermark: '$6 / month', topupFrom: 'From $6' },
  },
};

/** country_code → Currency (defaults to USD for unlisted countries) */
export function countryToCurrency(code: string): Currency {
  const MAP: Record<string, Currency> = { SG: 'SGD', IN: 'INR', AE: 'AED' };
  return MAP[code] ?? 'USD';
}

/** Format a number with the correct currency prefix, no decimals */
export function fmtPrice(amount: number, currency: Currency): string {
  const n = amount.toLocaleString('en-US');
  if (currency === 'AED') return `AED ${n}`;
  return `${PRICING[currency].symbol}${n}`;
}
