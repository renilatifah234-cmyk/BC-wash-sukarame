export function normalizePlate(raw: string) {
  return raw.replace(/\s+/g, "").toUpperCase();
}
