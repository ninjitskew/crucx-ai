export function formatUSD(amount: number): string {
  if (typeof amount !== "number" || Number.isNaN(amount)) return "$0.00";
  return `$${amount.toFixed(2)}`;
}
