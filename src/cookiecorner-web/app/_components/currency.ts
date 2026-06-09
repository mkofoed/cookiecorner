const dkkFormatter = new Intl.NumberFormat("da-DK", {
  style: "currency",
  currency: "DKK",
});

export function formatDkk(value: number) {
  return dkkFormatter.format(value);
}
