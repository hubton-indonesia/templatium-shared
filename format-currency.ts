export function formatIDR(value: number, multiplier = 1) {
  return `Rp ${(value * multiplier).toLocaleString("id-ID")}`;
}

export function formatUSD(value: number, multiplier = 1) {
  return `$${(value * multiplier).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
