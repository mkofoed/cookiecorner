const fictionalCurrencyFormatter = new Intl.NumberFormat("da-DK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatDkk(value: number) {
  return `${fictionalCurrencyFormatter.format(value)} Đ`;
}
