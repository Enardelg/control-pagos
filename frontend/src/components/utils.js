export function formatNumber(value) {
  return value
    .toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}
