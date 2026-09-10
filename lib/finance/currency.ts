const FX_RATES: Record<string, number> = {
  "USD_PKR": 278.50,
  "EUR_PKR": 302.15,
  "GBP_PKR": 353.80,
  "AED_PKR": 75.85,
  "PKR_USD": 0.00359,
};

export function convert(amount: number, from: string, to: string, rates?: Record<string, number>): number {
  if (from === to) return amount;
  const rateMap = rates || FX_RATES;
  const key = `${from}_${to}`;
  const reverseKey = `${to}_${from}`;
  if (rateMap[key]) return +(amount * rateMap[key]).toFixed(2);
  if (rateMap[reverseKey]) return +(amount / rateMap[reverseKey]).toFixed(2);
  return amount;
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const formatted = amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return `${currency} ${formatted}`;
}

export const CURRENCIES = ["USD", "PKR", "EUR", "GBP", "AED", "CAD"] as const;
export type Currency = typeof CURRENCIES[number];