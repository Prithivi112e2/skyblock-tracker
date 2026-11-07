export function formatCoins(amount?: number): string {
  if (!amount || isNaN(amount)) return '0 coins';
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(2)}B coins`;
  if (amount >= 1e6) return `${(amount / 1e6).toFixed(2)}M coins`;
  if (amount >= 1e3) return `${(amount / 1e3).toFixed(1)}k coins`;
  return `${amount.toLocaleString()} coins`;
}
